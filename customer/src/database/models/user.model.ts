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
    image: { type: String },
    url: { type: String, default: null },
    bonus: { type: Number, default: 0 },
    isAdmin: { type: Boolean, default: false },
    bank: { type: mongoose.Schema.Types.ObjectId, ref: "Bank" },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    wishlist: [
      {
        id: { type: Number, required: true },
        title: { type: String },
        desc: { type: String },
        image: { type: String },
        address: { type: String },
        price: { type: String },
      },
    ],
    cart: [
      {
        id: { type: Number, required: true },
        title: { type: String },
        image: { type: String },
        address: { type: String },
        price: { type: String },
        unit: { type: Number, required: true },
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
