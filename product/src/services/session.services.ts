import { FilterQuery, UpdateQuery } from "mongoose";
import SessionModel from "../database/models/session.model";
import log from "../utils/logger";
import SessionDocument from "../database/types/types.session";

export const createSession = async (userId: string, userAgent: string) => {
  try {
    const session = await SessionModel.create({ user: userId, userAgent });
    return session;
  } catch (error: any) {
    log.error(error.message);
  }
};

export const findSessions = async (query: FilterQuery<SessionDocument>) => {
  return await SessionModel.find(query).lean();
};

export const deleteSession = async (
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
) => {
  try {
    return await SessionModel.updateOne(query, update);
  } catch (error: any) {
    log.error(error.message);
  }
};
