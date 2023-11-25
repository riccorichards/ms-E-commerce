import mongoose from "mongoose";
import { UserDocument } from "./types.customer";

interface SessionDocument extends mongoose.Document {
  user: UserDocument["_id"];
  valid: boolean;
  userAgent: string;
  createAt: Date;
  updateAt: Date;
}

export default SessionDocument;
