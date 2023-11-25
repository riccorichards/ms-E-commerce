import { UserDocument } from "../types/types.customer";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import log from "../../utils/logger";

//model for mongodb (user schema)
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, required: true },
    debit_card: { type: String, required: true },
    bonus: { type: Number, default: 0 },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    wishlist: [
      {
        _id: { type: String, required: true },
        name: { type: String },
        description: { type: String },
        image: { type: String },
        price: { type: String },
      },
    ],
    cart: [
      {
        product: {
          _id: { type: String, required: true },
          name: { type: String },
          description: { type: String },
          image: { type: String },
          price: { type: String },
        },
        unit: { type: Number, required: true },
      },
    ],
    order: [
      {
        orderId: { type: Number },
        amount: { type: String },
      },
    ],
    review: [
      {
        productId: Number,
        review: { type: String, default: "" },
        rating: { type: Number, default: null },
      },
    ],
  },
  {
    timestamps: true,
  }
);

//before we save the user's docs we are checking user's password
UserSchema.pre("save", async function (next) {
  const user = this;

  if (!user?.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(13);
    const hash = await bcrypt.hash(user?.password, salt);

    user.password = hash;
    return next();
  } catch (error: any) {
    return next(this.errors);
  }
});

UserSchema.methods.comparePass = async function (
  incomingPassword: string
): Promise<boolean> {
  try {
    const user = this as UserDocument;
    const isMatch = await bcrypt.compare(incomingPassword, user.password);
    return isMatch;
  } catch (error: any) {
    log.error({ err: error.message });
    return false;
  }
};

const UserModel = mongoose.model<UserDocument>("User", UserSchema);

export default UserModel;
