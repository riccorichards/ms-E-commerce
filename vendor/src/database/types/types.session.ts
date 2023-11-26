import mongoose from "mongoose";
import { VendorDocument } from "./types.vendor";

interface SessionDocument extends mongoose.Document {
  vendor: VendorDocument["_id"];
  valid: boolean;
  userAgent: string;
  createAt: Date;
  updateAt: Date;
}

export default SessionDocument;
