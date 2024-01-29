import { Application, Request, Response } from "express";
import {
  OrderInputValidation,
  ShippingInputValidation,
} from "./validation/shopping.validation";
import ShoppingService from "../services/shopping.service";
import ShoppingRepo from "../database/repository/shopping.repository";
import initialiazeRepo from "../database/repository/initialiaze.repo";
import { verifyJWT } from "./verifyToken";
import ErrorHandler, { ValidateIncomingData } from "./ErrorHandler";
import { CreateChannel, PublishMessage } from "../utils/rabbitMQ.utils";
import config from "../../config";
import _ from "lodash";
import {
  makeRequestWithRetries,
  takeUrl,
} from "../utils/makeRequestWithRetries";

const api = async (app: Application) => {
  const shoppingRepo = new ShoppingRepo(
    initialiazeRepo.orderRepository,
    initialiazeRepo.shippingRepository,
    initialiazeRepo.orderIteRepository
  );

  const service = new ShoppingService(shoppingRepo);

  const channel = await CreateChannel();

  app.get(
    "/deliveryman-orders/:deliveryName",
    async (req: Request, res: Response) => {
      try {
        const { deliveryName } = req.params;
        const orders = await service.GetOrdersByDeliveryNameService(
          deliveryName
        );
        return res.status(200).json(orders);
      } catch (error) {
        ErrorHandler(error, res);
      }
    }
  );

  app.use(verifyJWT);

  app.post(
    "/order",
    ValidateIncomingData(OrderInputValidation),
    async (req: Request, res: Response) => {
      try {
        const newOrder = await service.CreateOrderService(req.body);

        if (!newOrder)
          return res
            .status(404)
            .json({ msg: "Error while creating a new order" });

        const event = {
          type: "empty_cart",
          data: { userId: req.body.customerId },
        };

        if (channel) {
          PublishMessage(
            channel,
            config.customer_binding_key,
            JSON.stringify(event)
          );
        }

        return res.status(201).json(newOrder);
      } catch (error) {
        ErrorHandler(error, res);
      }
    }
  );

  app.post(
    "/shipping",
    ValidateIncomingData(ShippingInputValidation),
    async (req: Request, res: Response) => {
      try {
        const order = await service.CreateShippingService(req.body);

        if (!order)
          return res
            .status(404)
            .json({ msg: "Error while creating a new shipping" });

        if (order.order_status === "complete") {
          const { id, createdAt, total_amount, ...other } = order;
          const groupItemsBasedOnAddress = _.groupBy(
            order.orderItem,
            "product_address"
          );
          _.forEach(
            groupItemsBasedOnAddress,
            (itemForVendor, vendorAddress) => {
              const calcTotalPrice = itemForVendor.reduce(
                (acc, item) => acc + parseFloat(item.product_price),
                0
              );

              const event = {
                type: "new_order_for_vendor",
                data: {
                  order: {
                    ...other,
                    orderId: id,
                    orderItem: itemForVendor,
                    total_amount: calcTotalPrice,
                  },
                  vendor_address: vendorAddress,
                },
              };
              if (channel) {
                PublishMessage(
                  channel,
                  config.vendor_binding_key,
                  JSON.stringify(event)
                );
              }
            }
          );

          if (channel) {
            const url = `http://localhost:8001/order-customer-info/${order.customerId}`;
            const customer = await makeRequestWithRetries(url, "GET");
            if (!customer)
              return res.status(400).json({ msg: "Customer was not found..." });
            const result = await Promise.all(
              order.orderItem.map(async (item) => {
                const image = await takeUrl(item.product_image);
                item.product_image = image;
                return item;
              })
            );
            const event = {
              type: "new_order",
              data: { ...{ ...order, orderItem: result }, customer },
            };

            PublishMessage(
              channel,
              config.deliveryman_binding_key,
              JSON.stringify(event)
            );
          }
          return res.status(201).json(order);
        }
      } catch (error) {
        ErrorHandler(error, res);
      }
    }
  );

  app.get("/orders-list", async (req: Request, res: Response) => {
    try {
      if (req.user) {
        const customerId = req.user.user;
        let page: number | string | undefined = undefined;
        if (typeof req.query.page === "string") {
          page = parseInt(req.query.page);
        }
        console.log("what going on?");
        const orderList = await service.GetOrdersListService(customerId, page);
        return res.status(200).json(orderList);
      }
    } catch (error) {
      ErrorHandler(error, res);
    }
  });

  app.get("/orders", async (req: Request, res: Response) => {
    try {
      const orders = await service.GetOrdersService();
      return res.status(200).json(orders);
    } catch (error) {
      ErrorHandler(error, res);
    }
  });

  app.get("/orders-data", async (req: Request, res: Response) => {
    try {
      const orderData = await service.GetOrdersDataService();
      return res.status(200).json(orderData);
    } catch (error) {
      ErrorHandler(error, res);
    }
  });

  app.get("/order/:orderId", async (req: Request, res: Response) => {
    try {
      const orderId = parseInt(req.params.orderId);
      const result = await service.GetOrderByIdService(orderId);
      return res.status(200).json(result);
    } catch (error) {
      ErrorHandler(error, res);
    }
  });

  app.get("/popular-foods", async (req: Request, res: Response) => {
    try {
      const result = await service.GetPopularFoodsService();
      return res.status(200).json(result);
    } catch (error) {
      ErrorHandler(error, res);
    }
  });

  app.get("/top-customers", async (req: Request, res: Response) => {
    try {
      const result = await service.GetTopCustomersService();
      if (!result)
        return res
          .status(400)
          .json({ msg: "Customer was not found on that ID" });
      return res.status(200).json(result);
    } catch (error) {
      ErrorHandler(error, res);
    }
  });

  app.delete("/cancel-order/:orderId", async (req: Request, res: Response) => {
    try {
      const orderId = parseInt(req.params.orderId);
      if (!orderId) return res.status(400).json({ msg: "Invalid Order's ID" });
      const removedOrder = await service.CancelOrderService(orderId);
      if (!removedOrder)
        return res.status(400).json({ msg: "Failed to delete order" });

      return res.status(201).json(null);
    } catch (error) {
      ErrorHandler(error, res);
    }
  });
};

export default api;
