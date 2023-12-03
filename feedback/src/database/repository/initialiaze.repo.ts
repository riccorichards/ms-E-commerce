import { appDataSource } from "../connectToTypeOrm";
import Feedbacks from "../entities/feedback.entity";

const Feedback = appDataSource.getRepository(Feedbacks);

export default Feedback;
