import mongoose from "mongoose";
import { BankAccountDocsType } from "../types/types.customer";

const bank = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    balance: { type: String },
    debit_card: { type: String },
    bankOf: { type: String },
  },
  { timestamps: true }
);

const BankModel = mongoose.model<BankAccountDocsType>("Bank", bank);

export default BankModel;
