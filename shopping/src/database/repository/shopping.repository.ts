import { Not, Repository } from "typeorm";
import Order from "../entities/order.entity";
import log from "../../utils/logger";
import Shipping from "../entities/shipping.entity";
import {
  OrderInputValidation,
  ShippingInputValidation,
  queryParamsType,
} from "../../api/validation/shopping.validation";
import OrderItem from "../entities/orderItem.entity";
import {
  GetDeliverymanById,
  sendAddressesToCloudManager,
} from "../../services/helper.service";
import _ from "lodash";
import { makeRequestWithRetries } from "../../utils/makeRequestWithRetries";

class ShoppingRepo {
  constructor(
    private orderRepository: Repository<Order>,
    private shippingRepository: Repository<Shipping>,
    private orderItemRepository: Repository<OrderItem>
  ) {}

  //creation operations
  async CreateOrderRepo(orderInput: OrderInputValidation) {
    try {
      const { total_amount, customerId, cartItems } = orderInput;

      const newOrder = this.orderRepository.create({
        total_amount,
        customerId,
        order_status: "pending",
      });

      await this.orderRepository.save(newOrder);
      let vendorAddresses = [];
      for (const item of cartItems) {
        const newItem = this.orderItemRepository.create({
          ...item,
          order: { id: newOrder.id },
        });
        if (!newItem) {
          throw new Error("Error while create item:" + item);
        }
        await this.orderItemRepository.save(newItem);
        vendorAddresses.push(item.product_address);
        const order = await this.orderRepository.findOne({
          where: { id: newOrder.id },
          relations: ["orderItem"],
        });
        if (!order) {
          throw new Error("Order not found");
        }
        order.orderItem.push(newItem);
      }
      await this.orderRepository.save(newOrder);

      const topNearestPersons: {
        latitude: number;
        longitude: number;
        personId: string;
      }[] = await sendAddressesToCloudManager(vendorAddresses);
      if (!topNearestPersons)
        throw new Error("Error while defining the top nearest persons");

      const result = topNearestPersons.map(async (person) => {
        const deliveryman: { name: string; image: string } =
          await GetDeliverymanById(person.personId);

        if (!deliveryman)
          throw new Error("Error while fetching delivery person" + deliveryman);

        return {
          lat: person.latitude,
          lng: person.longitude,
          name: deliveryman.name,
          image: deliveryman.image,
        };
      });

      if (!result)
        throw new Error("Error while create a new format of deliveryman");
      const nearestPersons = await Promise.all(result);
      return { nearestPersons, orderId: newOrder.id };
    } catch (error: any) {
      log.error({ err: error.message });
      throw new Error(`Error creating order: ${error.message}`);
    }
  }

  async CreateShippingRepo(shippingInput: ShippingInputValidation) {
    try {
      const newShipping = this.shippingRepository.create(shippingInput);
      if (!newShipping) throw new Error("Error while adding shipping info");
      await this.shippingRepository.save(newShipping);
      const deliveryman = await GetDeliverymanById(newShipping.personName);
      if (!deliveryman) throw new Error("Not found chosen person...");

      const order = await this.orderRepository.findOne({
        where: { id: newShipping.orderId },
        relations: ["orderItem"],
      });

      if (!order) throw new Error("Not found the order...");

      order.order_status = "complete";
      order.deliverymanName = newShipping.personName;

      await this.orderRepository.save(order);

      return order;
    } catch (error: any) {
      log.error({ err: error.message });
      throw new Error(`Error creating order: ${error.message}`);
    }
  }

  async CancelOrder(orderId: number) {
    try {
      await this.orderItemRepository
        .createQueryBuilder()
        .delete()
        .from(OrderItem)
        .where("order.id = :orderId", { orderId })
        .execute();

      const result = await this.orderRepository.delete(orderId);

      if (result.affected === 0) {
        throw new Error("Order not found or could not be removed");
      }

      return { message: "Order successfully cancelled", orderId: orderId };
    } catch (error: any) {
      log.error({ err: error.message });
      throw new Error(`Error cancelling order: ${error.message}`);
    }
  }

  async GetOrdersList(customerId: string, page: number | undefined) {
    try {
      if (!page) {
        const orderList = await this.orderRepository
          .find({
            where: {
              customerId,
              order_status: Not("pending"),
            },
            order: { createdAt: "DESC" },
          })
          .then((res) =>
            res.map((order) => {
              return {
                orderId: order.id,
                total_amount: order.total_amount,
                createdAt: order.createdAt,
              };
            })
          );
        return { orderList, pagination: null };
      }

      const take = 10;
      const skip = (page - 1) * take;

      const [orders, totalOrdersCount] =
        await this.orderRepository.findAndCount({
          where: { customerId: customerId, order_status: Not("pending") },
          order: {
            createdAt: "DESC",
          },
          take,
          skip,
        });

      const orderDetails = orders.map((order) => {
        return {
          orderId: order.id,
          total_amount: order.total_amount,
          createdAt: order.createdAt,
        };
      });

      const totalPages = Math.ceil(totalOrdersCount / take);
      const pagination = {
        page,
        totalPages,
        pageSize: take,
        totalCount: totalOrdersCount,
      };
      const result = { orderList: orderDetails, pagination };
      return result;
    } catch (error: any) {
      log.error({ err: error.message });
      throw new Error(`Error cancelling order: ${error.message}`);
    }
  }

  async GetOrdersData() {
    try {
      const orders = await this.orderRepository.find();
      const total_amount = orders.reduce(
        (acc, order) => acc + order.total_amount,
        0
      );
      return { length: orders.length, total: total_amount };
    } catch (error: any) {
      log.error({ err: error.message });
      throw new Error(`Error cancelling order: ${error.message}`);
    }
  }

  async GetPopularFoods() {
    try {
      const orderItems = await this.orderItemRepository.find({});
      const groupedByFoodName = _.groupBy(orderItems, "product_name");

      let topThreePopularFood: {
        foodName: string;
        image: string;
        length: number;
      }[] = [];
      _.forEach(groupedByFoodName, (food, foodName) => {
        topThreePopularFood.push({
          foodName,
          image: food[0].product_image,
          length: food.length,
        });
      });
      if (topThreePopularFood) {
        const result = topThreePopularFood
          .sort((a, b) => b.length - a.length)
          .slice(0, 3);

        return { popularItems: result, amount: orderItems.length };
      }
    } catch (error: any) {
      log.error({ err: error.message });
      throw new Error(`Error cancelling order: ${error.message}`);
    }
  }

  async GetTopCustomers() {
    try {
      const orders = await this.orderRepository.find();

      if (!orders) throw new Error("Data is not available");

      const groupedByCustomers = _.groupBy(orders, "customerId");

      const customerInfoPromises = Object.keys(groupedByCustomers).map(
        async (customerId) => {
          const url = `http://localhost:8001/order-customer-info/${customerId}`;
          try {
            return await makeRequestWithRetries(url, "GET");
          } catch (error: any) {
            log.error({ err: error.message });
            return null; // Return null or handle error as needed
          }
        }
      );

      const customers = await Promise.all(customerInfoPromises);

      return customers.filter((customer) => customer !== null || undefined);
    } catch (error: any) {
      log.error({ err: error.message });
      throw error;
    }
  }

  async GetOrders() {
    try {
      const orders = await this.orderRepository.find();

      if (!orders) throw new Error("Data is not available");

      return orders.map((order) => {
        return {
          id: order.id,
          customerId: order.customerId,
          deliverymanName: order.deliverymanName,
          total_amount: order.total_amount,
          createdAt: order.createdAt,
          status: order.order_status,
        };
      });
    } catch (error: any) {
      log.error({ err: error.message });
      throw error;
    }
  }

  async GetOrdersByDeliveryName(name: string) {
    try {
      const orders = await this.orderRepository.find({
        where: { deliverymanName: name },
        relations: ["orderItem"],
      });

      if (!orders) throw new Error("Data is not available");

      const deliveryOrderPromises = orders.map(async (order) => {
        const url = `http://localhost:8001/order-customer-info/${order.customerId}`;
        const customer = await makeRequestWithRetries(url, "GET");
        return {
          id: order.id,
          customer: customer ? customer : null,
          total_amount: order.total_amount,
          createdAt: order.createdAt,
          status: order.order_status,
          orderItem: order.orderItem,
        };
      });
      const deliveryOrders = await Promise.all(deliveryOrderPromises);
      return deliveryOrders;
    } catch (error: any) {
      log.error({ err: error.message });
      throw error;
    }
  }

  async GetOrderById(orderId: number) {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
        relations: ["orderItem"],
      });
      if (!order)
        throw new Error("Order was not found with that ID:" + orderId);
      return order;
    } catch (error: any) {
      log.error({ err: error.message });
      throw new Error(`Error cancelling order: ${error.message}`);
    }
  }
}

export default ShoppingRepo;
