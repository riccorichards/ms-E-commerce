import _, { omit } from "lodash";
import initialize from "../initialize";
import { DeliveryType } from "../types/type.delivery";
import { LoginStyle } from "../types/type.session";
import bcrypt from "bcrypt";
import {
  FeedbackMessageType,
  UpdateCustomerInfoInFeedMessageType,
} from "../types/types.feedbacks";
import { RepoErrorHandler } from "./RepoErrorHandler";
import { IncomingDeliveryDataType } from "../../api/middleware/validation/deliveryman.validation";
import { EditImageMessage } from "../types/type.event";
import {
  makeRequestWithRetries,
  takeUrl,
} from "../../utils/makeRequestWithRetries";
import { OrderType } from "../types/types.orders";

class DeliveryRepo {
  async CreateDeliveryMan(input: IncomingDeliveryDataType["body"]) {
    try {
      const { name, email, password, image, currentAddress } = input;

      const salt = await bcrypt.genSalt(13);

      const hashedPassword = await bcrypt.hash(password, salt);

      const newDeliveryMan = initialize.Delivery.create({
        name,
        email,
        password: hashedPassword,
        image,
        isValid: true,
        currentAddress,
        url: null, // url needs for signed url
      });

      if (!newDeliveryMan)
        throw new Error("Error while creating a new delivery person");

      return omit((await newDeliveryMan).toJSON(), "password");
    } catch (error) {
      RepoErrorHandler(error);
    }
  }

  async CreateSession({ email, password }: LoginStyle, userAgent: string) {
    try {
      const deliveryman = await initialize.Delivery.findOne({
        where: { email: email },
      });

      if (!deliveryman) throw new Error("Wrong credentials");

      const validPass = await bcrypt.compare(password, deliveryman.password);

      if (!validPass) throw new Error("Wrong credentials");

      const newSession = await initialize.Session.create({
        delivery: deliveryman.id,
        isValid: true,
        userAgent,
      });

      return { deliveryman, newSession };
    } catch (error) {
      RepoErrorHandler(error);
    }
  }

  async UpdateDeliveryman(id: number, input: DeliveryType) {
    try {
      const existingDelivery = await initialize.Delivery.findByPk(id);

      if (!existingDelivery) throw new Error("Not found deliveryman");

      const updatedData = { ...existingDelivery.get(), ...input };
      const [rows] = await initialize.Delivery.update(updatedData, {
        where: { id: id },
      });

      if (rows === 0) throw new Error("No updated row is exist");

      const result = await initialize.Delivery.findByPk(id);
      if (!result) throw new Error("Not found deliveryman");

      const { password, ...other } = result.dataValues;
      return other;
    } catch (error) {
      RepoErrorHandler(error);
    }
  }

  async GetAllDeliverymen() {
    try {
      const result = await initialize.Delivery.findAll({
        where: { isValid: true },
        raw: true,
      });
      if (!result) throw new Error("Deliveryman Not Found");

      // here we need to return persons' current addresses and their IDs.then the cloudManage server will convert it into coords (lat and long)
      return result.map((res) => ({
        address: res.currentAddress,
        personId: res.id,
      }));
    } catch (error) {
      RepoErrorHandler(error);
    }
  }
  //the server receives new feedback's information and add it into it's databases for avoid and decrement of network traffic
  async createFeedback(input: FeedbackMessageType) {
    try {
      return await initialize.Feedbacks.create(input);
    } catch (error) {
      RepoErrorHandler(error);
    }
  }

  //updating image
  async editImage(input: EditImageMessage) {
    try {
      const deliveryman = await initialize.Delivery.findByPk(input.userId);

      if (!deliveryman) throw new Error("Deliveryman Not Found");

      deliveryman.image = input.title;

      return await deliveryman.save();
    } catch (error) {
      RepoErrorHandler(error);
    }
  }

  //will also receive id of feedbacks from feedback server to remove it inside deliveryman server
  async removeFeedback(id: number) {
    try {
      return await initialize.Feedbacks.destroy({ where: { feedId: id } });
    } catch (error) {
      RepoErrorHandler(error);
    }
  }

  //this function takes person's name and returns its information + coords,
  async GetDeliverymanByName(personName: string, isCoords: boolean) {
    try {
      const delivery = await initialize.Delivery.findOne({
        where: { name: personName },
      });
      if (!delivery) throw new Error("Not found delivery");
      const { id, name, image, createdAt, email, currentAddress } =
        delivery.dataValues;

      // define the image's url from the GCP
      const imgUrl = await takeUrl(image);
      if (isCoords) {
        //making request to convert address into coords
        const url = `http://localhost:8007/coords?address=${currentAddress}`;
        const coords: { latitude: number; longitude: number } =
          await makeRequestWithRetries(url, "GET");

        if (coords) {
          const { latitude, longitude } = coords;

          return {
            id,
            name,
            image: imgUrl,
            createdAt,
            email,
            currentAddress,
            latitude,
            longitude,
          };
        }
      }

      return { id, name, image: imgUrl, email, currentAddress };
    } catch (error) {
      RepoErrorHandler(error);
    }
  }

  async GetDeliverymanForOrder(id: number) {
    try {
      const delivery = await initialize.Delivery.findByPk(id);
      if (!delivery) throw new Error("Not found delivery");
      const { name, image, createdAt } = delivery.dataValues;

      const imageUrl = await takeUrl(image);

      return { name, image: imageUrl, createdAt };
    } catch (error) {
      RepoErrorHandler(error);
    }
  }

  //this function needs to take pages from the clien, this information is used to define all employees for admin panel
  async GetAllDeliveryman(page: number) {
    try {
      const limit = 5;
      const offset = (page - 1) * 5;

      const totaldDeliveries = await initialize.Delivery.count();

      const totalPages = Math.ceil(totaldDeliveries / limit);

      const deliveries = await initialize.Delivery.findAll({
        limit,
        offset,
      }).then((deliveries) =>
        deliveries.map((person) => {
          return {
            id: person.id,
            name: person.name,
            email: person.email,
            image: person.image,
            currentAddress: person.currentAddress,
          };
        })
      );

      if (!deliveries)
        throw new Error("Not found deliverymen or Data is not available");

      const pagination = {
        page,
        totalPages,
        pageSize: limit,
        totalCount: totaldDeliveries,
      };
      const result = await Promise.all(
        deliveries.map(async (person) => {
          const image = await takeUrl(person.image);
          person.image = image;
          return person;
        })
      );
      return {
        employees: result,
        pagination,
      };
    } catch (error) {
      RepoErrorHandler(error);
    }
  }

  //this function has two capabilities, one if isStats is true return financial information for echart, and the second capability is to return order information of person (ID)
  async GetDeliveryActivities(
    id: number,
    isStats: boolean,
    amount: number | undefined | string
  ) {
    try {
      const deliverymen = await initialize.Delivery.findByPk(id);

      if (!deliverymen)
        throw new Error("Not found deliverymen or Data is not available");
      // we need to make a request to the shopping server for receive delivery person's orders (total)
      const url = `http://localhost:8003/deliveryman-orders/${deliverymen.name}`;
      const deliverymanOrders: OrderType[] = await makeRequestWithRetries(
        url,
        "GET"
      );
      // if there is any kind of error we need to hanfle it
      if (!deliverymanOrders)
        throw new Error("Error while delivery orders feting...");
      //in this condition we are handling finantial information for E-chart
      if (isStats) {
        const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        // grouping orders based on weekly days
        const groupedOrdersByWeekDays = _.groupBy(
          deliverymanOrders,
          (order) => {
            //we need to define the number of weekdays to interact then with (like this ==> weekdays[index])
            return weekDays[new Date(order.createdAt).getDay() - 1];
          }
        );

        //we are defining weekly result's empty array
        const weeklyResult: { day: string; result: number }[] = [];
        weekDays.forEach((day) => {
          // here we have gained orders for per weekly days
          const ordersPerDay = groupedOrdersByWeekDays[day];

          // defining the length for calculate and see how many orders delivery person did
          const lenPerDay = ordersPerDay ? ordersPerDay.length : 0;
          weeklyResult.push({
            day: day,
            result: lenPerDay,
          });
        });

        // and returning information with "isStats: true" because of the client needs to understand whan kind of data the server responsed
        return {
          res: weeklyResult,
          len: deliverymanOrders.length,
          isStats: true,
        };
      }

      //if isStats is false, that means we need to handle the only returning process based on receiving amount
      const targetAmount =
        typeof amount === "number"
          ? amount
          : typeof amount === "undefined"
          ? 5 // initial required amount is 5 (default)
          : deliverymanOrders.length;

      // then sorting because we need to see the last order first
      const sortedOrders = deliverymanOrders
        .sort((a, b) => b.id - a.id)
        .slice(0, targetAmount);

      // orderItem (oi) this function returns all order items (foods) with image (url ==> GCP)
      const oiWithImgUrl = sortedOrders.map(async (order) => {
        const orderItems = await Promise.all(
          order.orderItem.map(async (item) => {
            const image = await takeUrl(item.product_image);
            item.product_image = image;
            return item;
          })
        );
        return { ...order, orderItem: orderItems };
      });

      return {
        res: await Promise.all(oiWithImgUrl), // response, we need to wait when all data will be ready to send to the client side
        len: deliverymanOrders.length,
        isStats: false,
      };
    } catch (error) {
      RepoErrorHandler(error);
    }
  }


  //this function returns the feedbacks based on provided amount 
  async getDeliveryFeeds(id: number, amount: number | undefined | string) {
    try {
      // first we need to gain all feedbacks of deliveryman 
      const feedbacks = await initialize.Feedbacks.findAll({
        where: { targetId: id },
      });
      if (!feedbacks) throw new Error("Data is not available or was not found");

      const targetAmount =
        typeof amount === "number"
          ? amount
          : typeof amount === "undefined"
          ? 5
          : feedbacks.length;
      const result = feedbacks.slice(0, targetAmount);

      // the same, we need to take url from GCP 
      return await Promise.all(
        result.map(async (feed) => {
          const authorImg = await takeUrl(feed.authorImg);
          const targetImg = await takeUrl(feed.targetImg);

          feed.authorImg = authorImg;
          feed.targetImg = targetImg;

          return feed;
        })
      );
    } catch (error) {
      RepoErrorHandler(error);
    }
  }

  async GetDeliveryman(id: number) {
    try {
      const delivery = await initialize.Delivery.findByPk(id);

      if (!delivery) throw new Error("Not found delivery");

      const image = await takeUrl(delivery.image);

      delivery.url = image;

      const feedCount = await initialize.Feedbacks.count({
        where: { targetId: id },
      });

      const result = delivery.dataValues;
      return { ...result, feedCount: feedCount || 0 };
    } catch (error) {
      RepoErrorHandler(error);
    }
  }
}

export default DeliveryRepo;
