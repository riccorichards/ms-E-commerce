import { VendorDocument } from "../types/types.vendor";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import log from "../../utils/logger";

//model for mongodb (user schema)
const VendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    about: { type: String },
    pincode: { type: String, required: true },
    rating: { type: Number, required: true },
    image: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: mongoose.Schema.Types.ObjectId, ref: "address" },
    teamMember: [{ type: mongoose.Schema.Types.ObjectId, ref: "teamMember" }],
    feeds: [{ type: mongoose.Schema.Types.ObjectId, ref: "feeds" }],
    foods: [{ type: mongoose.Schema.Types.ObjectId, ref: "foods" }],
    gallery: [{ type: mongoose.Schema.Types.ObjectId, ref: "gallery" }],
    socialMedia: [{ title: String, url: String }],
    workingHrs: {
      workingDays: {
        type: String,
      },
      weekend: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

//before we save the vendor's docs, we are checking vendor's password
VendorSchema.pre("save", async function (next) {
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

VendorSchema.methods.comparePass = async function (
  incomingPassword: string
): Promise<boolean> {
  try {
    const user = this as VendorDocument;
    const isMatch = await bcrypt.compare(incomingPassword, user.password);
    return isMatch;
  } catch (error: any) {
    log.error({ err: error.message });
    return false;
  }
};

const VendorModel = mongoose.model<VendorDocument>("Vendor", VendorSchema);

export default VendorModel;
