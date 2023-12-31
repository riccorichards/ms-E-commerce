import { omit } from "lodash";
import initialize from "../initialize";
import { DeliveryType } from "../types/type.delivery";
import { LoginStyle } from "../types/type.session";
import bcrypt from "bcrypt";
import { ProductType } from "../types/types.orderMenu";
import { FeedbackMessageType } from "../types/types.feedbacks";
import log from "../../utils/logger";
import { RepoErrorHandler } from "./RepoErrorHandler";
import { IncomingDeliveryDataType } from "../../api/middleware/validation/deliveryman.validation";
import { IncomingOrderDataType } from "../../api/middleware/validation/orders.validation";

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
        delivery: deliveryman.email,
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

  async CreateOrder(input: IncomingOrderDataType["body"]) {
    try {
      return await initialize.Order.create(input);
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

  async AddOrderMenu(input: ProductType[]) {
    try {
      const newOrderMenu = await Promise.all(
        input.map(async (product: ProductType) => {
          return await initialize.Product.create(product);
        })
      );
      return newOrderMenu;
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
      const id = input.feedId;
      const [updatedFeeds] = await initialize.Feedbacks.update(input, {
        where: { id },
      });
      if (updatedFeeds === 0) return log.error("Not found updated rows");

      return await initialize.Feedbacks.findByPk(id);
    } catch (error) {
      RepoErrorHandler(error);
    }
  }

  async removeFeedback(id: number) {
    try {
      return await initialize.Feedbacks.destroy({ where: { id } });
    } catch (error) {
      RepoErrorHandler(error);
    }
  }

  async GetDeliveryman(id: number) {
    try {
      const delivery = await initialize.Delivery.findByPk(id, {
        include: [
          {
            model: initialize.Order,
            as: "orders",
            include: [{ model: initialize.Product, as: "menu" }],
          },
          { model: initialize.Feedbacks, as: "feedbacks" },
        ],
      });
      if (!delivery) throw new Error("Not found delivery");
      const { password, ...other } = delivery.dataValues;
      return other;
    } catch (error) {
      RepoErrorHandler(error);
    }
  }

  async GetDeliverymanWithSpecField(id: number, field: string) {
    try {
      const specField =
        field && field === "orders" ? initialize.Order : initialize.Feedbacks;
      const delivery = await initialize.Delivery.findByPk(id, {
        include: [
          { model: specField, as: field === "orders" ? "orders" : "feedbacks" },
        ],
      });
      if (!delivery) throw new Error("Not found delivery");
      const { password, ...other } = delivery.dataValues;
      return other;
    } catch (error) {
      RepoErrorHandler(error);
    }
  }
}

export default DeliveryRepo;
