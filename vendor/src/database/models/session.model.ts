import mongoose from "mongoose";
import SessionDocument from "../types/types.session";

const CreateSessionSchema = new mongoose.Schema({
  vendor: { type: mongoose.Types.ObjectId, ref: "Vendor" },
  valid: { type: Boolean, default: true },
  userAgent: { type: String },
});

const SessionModel = mongoose.model<SessionDocument>(
  "Session",
  CreateSessionSchema
);

export default SessionModel;
