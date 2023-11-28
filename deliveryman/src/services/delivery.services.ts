import DeliveryRepo from "../database/repository/delivery.repository";
import { DeliveryType } from "../database/types/type.delivery";
import { LoginStyle } from "../database/types/type.session";
import { CustomerType } from "../database/types/types.customer";
import { FeedbacksInputType } from "../database/types/types.feedbacks";
import { OrderType } from "../database/types/types.order";
import { ProductType } from "../database/types/types.orderMenu";
import { VendorType } from "../database/types/types.vendor";

class DeliveryService {
  private repository: DeliveryRepo;

  constructor() {
    this.repository = new DeliveryRepo();
  }

  async CreateDeliveryService(input: DeliveryType) {
    return await this.repository.CreateDeliveryMan(input);
  }

  async CreateSessionService(
    { email, password }: LoginStyle,
    userAgent: string
  ) {
    return this.repository.CreateSession({ email, password }, userAgent);
  }

  async UpdateDeliverymanService(id: number, input: DeliveryType) {
    return this.repository.UpdateDeliveryman(id, input);
  }

  async CreateOrderService(input: OrderType) {
    return this.repository.CreateOrder(input);
  }

  async AddOrderMenuService(input: ProductType[]) {
    return this.repository.AddOrderMenu(input);
  }

  async AddCustomerInfoService(input: CustomerType) {
    return this.repository.AddCustomerInfo(input);
  }

  async AddVendorInfoService(input: VendorType) {
    return this.repository.AddvendorInfo(input);
  }

  async CreateFeedbackService(input: FeedbacksInputType) {
    return this.repository.createFeedback(input);
  }

  async GetDeliverymanService(id: number) {
    return this.repository.GetDeliveryman(id);
  }

  async GetDeliverymanWithSpecFieldService(id: number, field: string) {
    return this.repository.GetDeliverymanWithSpecField(id, field);
  }
}

export default DeliveryService;
