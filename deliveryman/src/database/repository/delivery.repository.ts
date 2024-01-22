import _, { omit } from "lodash";
import initialize from "../initialize";
import { DeliveryType } from "../types/type.delivery";
import { LoginStyle } from "../types/type.session";
import bcrypt from "bcrypt";
import { FeedbackMessageType } from "../types/types.feedbacks";
import { RepoErrorHandler } from "./RepoErrorHandler";
import { IncomingDeliveryDataType } from "../../api/middleware/validation/deliveryman.validation";
import { EditImageMessage } from "../types/type.event";
import { makeRequestWithRetries } from "../../utils/makeRequestWithRetries";
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
      return result.map((res) => ({
        address: res.currentAddress,
        personId: res.id,
      }));
    } catch (error) {
      RepoErrorHandler(error);
    }
  }

  async createFeedback(input: FeedbackMessageType) {
    try {
      return await initialize.Feedbacks.create(input);
    } catch (error) {
      RepoErrorHandler(error);
    }
  }

  async updateFeedback(input: FeedbackMessageType) {
    try {
      const updatedFeed = await initialize.Feedbacks.findOne({
        where: { feedId: input.feedId },
      });

      if (!updatedFeed) throw new Error("Not found feed");

      updatedFeed.review = input.review;

      await updatedFeed.save();
      return await initialize.Feedbacks.findByPk(input.feedId);
    } catch (error) {
      RepoErrorHandler(error);
    }
  }

  async editImage(input: EditImageMessage) {
    try {
      const deliveryman = await initialize.Delivery.findByPk(input.userId);

      if (!deliveryman) throw new Error("Deliveryman Not Found");

      deliveryman.image = input.url;
      return await deliveryman.save();
    } catch (error) {
      RepoErrorHandler(error);
    }
  }

  async removeFeedback(id: number) {
    try {
      return await initialize.Feedbacks.destroy({ where: { feedId: id } });
    } catch (error) {
      RepoErrorHandler(error);
    }
  }

  async GetDeliverymanById(personName: string, isCoords: boolean) {
    try {
      const delivery = await initialize.Delivery.findOne({
        where: { name: personName },
      });
      if (!delivery) throw new Error("Not found delivery");
      const { id, name, image, createdAt, email, currentAddress } =
        delivery.dataValues;

      if (isCoords) {
        const url = `http://localhost:8007/coords/${currentAddress}`;
        const coords: { latitude: number; longitude: number } =
          await makeRequestWithRetries(url, "GET");

        if (coords) {
          const { latitude, longitude } = coords;
          return {
            id,
            name,
            image,
            createdAt,
            email,
            currentAddress,
            latitude,
            longitude,
          };
        }
      }

      return { id, name, image, email, currentAddress };
    } catch (error) {
      RepoErrorHandler(error);
    }
  }

  async GetDeliverymanForOrder(id: number) {
    try {
      const delivery = await initialize.Delivery.findByPk(id);
      if (!delivery) throw new Error("Not found delivery");
      const { name, image, createdAt } = delivery.dataValues;

      return { name, image, createdAt };
    } catch (error) {
      RepoErrorHandler(error);
    }
  }

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

      return {
        employees: deliveries,
        pagination,
      };
    } catch (error) {
      RepoErrorHandler(error);
    }
  }

  async GetDeliveryActivities(
    id: number,
    isStats: boolean,
    amount: number | undefined | string
  ) {
    try {
      const deliverymen = await initialize.Delivery.findByPk(id);

      if (!deliverymen)
        throw new Error("Not found deliverymen or Data is not available");

      const url = `http://localhost:8003/deliveryman-orders/${deliverymen.name}`;
      const deliverymanOrders: OrderType[] = await makeRequestWithRetries(
        url,
        "GET"
      );

      if (!deliverymanOrders)
        throw new Error("Error while delivery orders feting...");

      if (isStats) {
        const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

        const groupedOrdersByWeekDays = _.groupBy(
          deliverymanOrders,
          (order) => {
            return weekDays[new Date(order.createdAt).getDay() - 1];
          }
        );

        const weeklyResult: { day: string; result: number }[] = [];
        weekDays.forEach((day) => {
          const ordersPerDay = groupedOrdersByWeekDays[day];

          const lenPerDay = ordersPerDay ? ordersPerDay.length : 0;
          weeklyResult.push({
            day: day,
            result: lenPerDay,
          });
        });

        return {
          res: weeklyResult,
          len: deliverymanOrders.length,
          isStats: true,
        };
      }

      const targetAmount =
        typeof amount === "number"
          ? amount
          : typeof amount === "undefined"
          ? 5
          : deliverymanOrders.length;

      const sortedOrders = deliverymanOrders
        .sort((a, b) => b.id - a.id)
        .slice(0, targetAmount);
      return {
        res: sortedOrders,
        len: deliverymanOrders.length,
        isStats: false,
      };
    } catch (error) {
      RepoErrorHandler(error);
    }
  }

  async getDeliveryFeeds(id: number, amount: number | undefined | string) {
    try {
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
      console.log({ targetAmount });
      return feedbacks.slice(0, targetAmount);
    } catch (error) {
      RepoErrorHandler(error);
    }
  }

  async GetDeliveryman(id: number) {
    try {
      const delivery = await initialize.Delivery.findByPk(id);

      if (!delivery) throw new Error("Not found delivery");

      const feedCount = await initialize.Feedbacks.count({
        where: { targetId: id },
      });

      if (!feedCount)
        throw new Error("feedback not found or data is not available");

      const result = delivery.dataValues;
      return { ...result, feedCount };
    } catch (error) {
      RepoErrorHandler(error);
    }
  }
}

export default DeliveryRepo;
