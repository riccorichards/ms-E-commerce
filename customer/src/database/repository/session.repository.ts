import UserModel from "../models/user.model";
import { LoginInputType } from "../types/types.customer";

class SessionRepo {
  async Login({ email, password }: LoginInputType) {
    try {
      const user = await UserModel.findOne({ email: email });

      if (!user) {
        throw new Error("Wrong credentials");
      }

      const validPass = await user.comparePass(password);

      if (!validPass) {
        throw new Error("Wrong credentials");
      }

      return user;
    } catch (error: any) {
      console.log({ err: error.message });
    }
  }
}

export default SessionRepo;
