import { Not, Repository } from "typeorm";
import Order from "../entities/order.entity";
import log from "../../utils/logger";
import Shipping from "../entities/shipping.entity";
import {
  OrderInputValidation,
  ShippingInputValidation,
} from "../../api/validation/shopping.validation";
import OrderItem from "../entities/orderItem.entity";
import {
  GetDeliverymanById,
  sendAddressesToCloudManager,
} from "../../services/helper.service";
import _ from "lodash";
import {
  makeRequestWithRetries,
  takeUrl,
} from "../../utils/makeRequestWithRetries";
import { MessageType } from "../../services/shopping.service";

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

      //creating the order with pending status
      await this.orderRepository.save(newOrder);

      //define empty array for future addresses
      let vendorAddresses = [];

      //after creating the order we need to create order's items and assign them orderId as a relation
      for (const item of cartItems) {
        const newItem = this.orderItemRepository.create({
          ...item,
          order: { id: newOrder.id },
        });

        if (!newItem) {
          throw new Error("Error while create item:" + item);
        }
        //save the process
        await this.orderItemRepository.save(newItem);
        //push item's address
        vendorAddresses.push(item.product_address);

        newOrder.orderItem.push(newItem);
      }
      await this.orderRepository.save(newOrder);

      //we need to define top neaders persons
      const topNearestPersons: {
        latitude: number;
        longitude: number;
        personId: string;
      }[] = await sendAddressesToCloudManager(vendorAddresses);

      if (!topNearestPersons)
        throw new Error("Error while defining the top nearest persons");

      // so we have top three nearest delivery persons, and now we need to make a request based on persons id and take deliveryman's specific information, like lat and long
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
      //at the end we need to wait for all request and send the persons to the client to allow the customer choose one from the nearest three curier
      const nearestPersons = await Promise.all(result);
      return { nearestPersons, orderId: newOrder.id }; // we also send order's id to continue process of creation order, the next step is to create shipping process (which is formal by the way)
    } catch (error: any) {
      log.error({ err: error.message });
      throw new Error(`Error creating order: ${error.message}`);
    }
  }

  //creating a new shipping and finishing the creation of order
  async CreateShippingRepo(shippingInput: ShippingInputValidation) {
    try {
      const newShipping = this.shippingRepository.create(shippingInput);
      if (!newShipping) throw new Error("Error while adding shipping info");
      await this.shippingRepository.save(newShipping);
      //define deliveryman
      const deliveryman = await GetDeliverymanById(newShipping.personName);
      if (!deliveryman) throw new Error("Not found chosen person...");

      //define order with it's items
      const order = await this.orderRepository.findOne({
        where: { id: newShipping.orderId },
        relations: ["orderItem"],
      });

      if (!order) throw new Error("Not found the order...");

      //updating the status
      order.order_status = "complete";
      //initialy thi field is empty, but after definition of name of person we need to update the order
      order.deliverymanName = newShipping.personName;

      //save
      await this.orderRepository.save(order);

      return order;
    } catch (error: any) {
      log.error({ err: error.message });
      throw new Error(`Error creating order: ${error.message}`);
    }
  }

  //canceling the ordering creation process the stage of pending
  async CancelOrder(orderId: number) {
    try {
      await this.orderItemRepository
        .createQueryBuilder() // before we canceled the order, we need to remove all associated items, so createQueryBuilder helps up to do that.
        .delete() // after detect all order items we can remove it.
        .from(OrderItem) // detect the class where the items should removed
        .where("order.id = :orderId", { orderId }) // where define the order's id, if it is matches we are removing order with execute()
        .execute();

      //when the order has no any associations, we can remove it
      const result = await this.orderRepository.delete(orderId);

      //checking that if there is any kinf of effect, if it no we need to throw new error
      if (result.affected === 0) {
        throw new Error("Order not found or could not be removed");
      }

      return { message: "Order successfully cancelled", orderId: orderId };
    } catch (error: any) {
      log.error({ err: error.message });
      throw new Error(`Error cancelling order: ${error.message}`);
    }
  }

  //this function has two capabilities, one handle orders list and second one is to handle it based on provided pages
  async GetOrdersList(customerId: string, page: number | undefined) {
    try {
      //if page is not provided
      if (!page) {
        //we simple fining the orders (which has status === complete) for customer, then sorting it based on creation
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
        //we need to define pagnation: null because the client detect what kind of data it receives
        return { orderList, pagination: null };
      }

      //if page is provided
      const take = 10;
      const skip = (page - 1) * take;

      //gain all orders and its length
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

  // the function handles to define the most sold foods
  async GetPopularFoods() {
    try {
      const orderItems = await this.orderItemRepository.find({});
      //grouped order's item based the name of food
      const groupedByFoodName = _.groupBy(orderItems, "product_name");

      //define empty array for per food's necessary information
      let topThreePopularFood: {
        foodName: string;
        image: string;
        length: number;
      }[] = [];

      //we are iterating on the grouped order items and take items (food) and item's name (foodName)
      _.forEach(groupedByFoodName, (food, foodName) => {
        topThreePopularFood.push({
          foodName,
          image: food[0].product_image, //as we know inside food we have all foods bassed its name, so define [0].image that means we have the image of specific foods because each food in this foods array would has the same information
          length: food.length,
        });
      });

      //if top foods are existing we need to sort it based on length and then slice only first three items
      if (topThreePopularFood) {
        const result = topThreePopularFood
          .sort((a, b) => b.length - a.length)
          .slice(0, 3);

        //returning popular items via Promise.all()
        return {
          popularItems: await Promise.all(
            result.map(async (food) => {
              const url = await takeUrl(food.image);
              food.image = url;

              return food;
            })
          ),
          amount: orderItems.length,
        };
      }
    } catch (error: any) {
      log.error({ err: error.message });
      throw new Error(`Error cancelling order: ${error.message}`);
    }
  }

  //return top customer
  async GetTopCustomers() {
    try {
      //grab all orders with its relations
      const orders = await this.orderRepository.find({
        relations: ["orderItem"],
      });

      if (!orders) throw new Error("Data is not available");

      //grouped orders based on customerId
      const groupedByCustomers = _.groupBy(orders, "customerId");

      const result = [];
      //iterating on the grouped object and makes a reqeust base object's key (customer's id)
      for (const customerId in groupedByCustomers) {
        const url = `http://localhost:8001/order-customer-info/${customerId}`;
        const customer = await makeRequestWithRetries(url, "GET");
        result.push({
          customer,
          len: groupedByCustomers[customerId].length, //each key has array of orders
          totalAmount: groupedByCustomers[customerId]
            .reduce((acc, order) => acc + order.total_amount, 0)
            .toFixed(2),
        });
      }
      return result.sort((a, b) => b.len - a.len).slice(0, 5);
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

  //this function returns orders for deliveryman based on provided name
  async GetOrdersByDeliveryName(name: string) {
    try {
      const orders = await this.orderRepository.find({
        where: { deliverymanName: name },
        relations: ["orderItem"],
      });

      if (!orders) throw new Error("Data is not available");

      //we are using promise here because we need to define here complete order, so we need to take customers' information also
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

  //return order based on provided order id
  async GetOrderById(orderId: number) {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
        relations: ["orderItem"],
      });
      if (!order)
        throw new Error("Order was not found with that ID:" + orderId);

      const result = await Promise.all(
        order.orderItem.map(async (item) => {
          const image = await takeUrl(item.product_image);
          item.product_image = image;
          return item;
        })
      );

      return { ...order, orderItem: result };
    } catch (error: any) {
      log.error({ err: error.message });
      throw new Error(`Error cancelling order: ${error.message}`);
    }
  }
}

export default ShoppingRepo;
