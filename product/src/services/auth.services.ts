import { omit } from "lodash";
import UserModel from "../database/models/user.model";
import { UserInput } from "../database/types/types.customer";
import log from "../utils/logger";

//register a user is the system
export const register = async (input: UserInput) => {
  try {
    const user = await UserModel.create(input);
    if (!user) return false;
    return omit(user.toJSON(), "password");
  } catch (error: any) {
    log.error(error.message);
  }
};

//login
export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const user = await UserModel.findOne({ email: email });

    if (!user) return false;

    const isValidPassword = await user.comparePass(password);

    if (!isValidPassword) return false;

    return omit(user.toJSON(), "password");
  } catch (error) {
    log.error(error);
    return false;
  }
};
