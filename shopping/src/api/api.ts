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

  //this functioc's capability is to gain all delivery person's order
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

  //create a new order (converting cart into orderItems)
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

        //we need to send information via RabbitMQ to define that the convertion process successfully ended and the customer servers should reset the cart field
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
  //create an order complete and send it to participants
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
        // sometime order's status is pending, so we need to unsure that we are handling the completed order
        if (order.order_status === "complete") {
          const { id, createdAt, total_amount, ...other } = order;

          //grouping the order's items based on items' addresses, that because we need to define which vendor belongs the order. As we know one order perheps includes several vendors, so we need to handle create a new order based on specific vendor.
          const groupItemsBasedOnAddress = _.groupBy(
            order.orderItem,
            "product_address"
          );
          //here we iterate on the grouped order, and extracting items' for vendor and addresses
          _.forEach(
            groupItemsBasedOnAddress,
            (itemForVendor, vendorAddress) => {
              //as we know "itemForVendor" consist with orderItems based on addresses
              const calcTotalPrice = itemForVendor.reduce(
                (acc, item) => acc + parseFloat(item.product_price),
                0
              );
              // create event for sending per vendor
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
          //also we need to send the entire order to the deliveryman server, so that's why we make a request to the customer server to take customer's order information
          if (channel) {
            const url = `http://localhost:8001/order-customer-info/${order.customerId}`;
            const customer = await makeRequestWithRetries(url, "GET");
            if (!customer)
              return res.status(400).json({ msg: "Customer was not found..." });
            //we need to wait when the entire process finished
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
            //send order information to the deliveryman server
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
  //returns order list
  app.get("/orders-list", async (req: Request, res: Response) => {
    try {
      if (req.user) {
        const customerId = req.user.user;
        let page: number | string | undefined = undefined;
        if (typeof req.query.page === "string") {
          page = parseInt(req.query.page);
        }
        const orderList = await service.GetOrdersListService(customerId, page);
        return res.status(200).json(orderList);
      }
    } catch (error) {
      ErrorHandler(error, res);
    }
  });

  //return all orders, this is for admin panel
  app.get("/orders", async (req: Request, res: Response) => {
    try {
      const orders = await service.GetOrdersService();
      return res.status(200).json(orders);
    } catch (error) {
      ErrorHandler(error, res);
    }
  });

  //it returns orders' information like length and total amount
  app.get("/orders-data", async (req: Request, res: Response) => {
    try {
      const orderData = await service.GetOrdersDataService();
      return res.status(200).json(orderData);
    } catch (error) {
      ErrorHandler(error, res);
    }
  });

  //define order based on id
  app.get("/order/:orderId", async (req: Request, res: Response) => {
    try {
      const orderId = parseInt(req.params.orderId);
      const result = await service.GetOrderByIdService(orderId);
      return res.status(200).json(result);
    } catch (error) {
      ErrorHandler(error, res);
    }
  });

  //the function handles the process of definition the popular foods
  app.get("/popular-foods", async (req: Request, res: Response) => {
    try {
      const result = await service.GetPopularFoodsService();
      return res.status(200).json(result);
    } catch (error) {
      ErrorHandler(error, res);
    }
  });

  //the fucntion defines top customers based on total amount of making order (orders length)
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

  //cancel order process, when it is on the pending stage
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
