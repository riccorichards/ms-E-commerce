import { number, object, string, TypeOf } from "zod";

export const IncomingOrderData = object({
  body: object({
    username: string({
      required_error: "Username is Required!",
    }),
    customerEmail: string({
      required_error: "Customer email is Required!",
    }),
    customerAddress: string({
      required_error: "Customer address is Required!",
    }),
    vedor: string({
      required_error: "Vendro's name is Required!",
    }),
    vendorEmail: string({
      required_error: "Vendro's email is Required!",
    }),
    vendorAddress: string({
      required_error: "Vendro's address is Required!",
    }),
    vendorRating: string({
      required_error: "Vendro's rating is Required!",
    }),
    customerImg: string().optional(),
    orderStatus: string({
      required_error: "Customer email is Required!",
    }),
    note: string().optional(),
    deliveryTime: string({
      required_error: "Delivery time is Required!",
    }).min(3, "Title must be at least 3 characters long"),
    distance: string({
      required_error: "Description is required!",
    }),
    paymentMethod: string({
      required_error: "Payment method is required!",
    }),
    totalAmount: string({
      required_error: "total amount is required!",
    }),
    deliverymanId: number({
      required_error: "Person's ID is required!",
    }),
  }),
});

export type IncomingOrderDataType = TypeOf<typeof IncomingOrderData>;
