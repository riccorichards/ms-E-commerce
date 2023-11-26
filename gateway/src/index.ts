import express, { Response, Request } from "express";
import proxy from "express-http-proxy";
const app = express();

app.use(express.json());
app.use("/customer", proxy("http://localhost:8001"));
app.use("/shopping", proxy("http://localhost:8003"));
app.use("/vendor", proxy("http://localhost:8004"));
app.use("/deliveryman", proxy("http://localhost:8005"));
app.use("/admin", proxy("http://localhost:8006"));
app.use("/", proxy("http://localhost:8002"));

app.get("/", async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ msg: "From GateWay" });
  } catch (error: any) {
    console.log(error.message);
  }
});

try {
  app.listen(8000, () => {
    console.log("GateWay connected at 8000");
  });
} catch (error: any) {
  console.log({ err: error.message });
}
