import express, { Response, Request } from "express";

const app = express();

app.get("/", async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ msg: "From Order" });
  } catch (error: any) {
    console.log(error.message);
  }
});

try {
  app.listen(8003, () => {
    console.log("Order connected at 8003");
  });
} catch (error: any) {
  console.log({ err: error.message });
}
