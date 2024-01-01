import mongoose from "mongoose";
import { TeamDocs } from "../types/type.teamMember";

const teamMember = new mongoose.Schema(
  {
    name: { type: String },
    description: { type: String },
    image: { type: String },
    position: { type: String },
  },
  { timestamps: true }
);

const TeamModel = mongoose.model<TeamDocs>("teamMember", teamMember);

export default TeamModel;
