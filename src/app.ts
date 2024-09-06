import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { dbConnect } from "./config/mongoose.js";
import v1Routes from "./routes/v1/index";

dotenv.config();

const app = express();

app.use(express.json());

dbConnect();

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong");
});

app.use("/api/v1", v1Routes);

app.use("/test", (req: Request, res: Response) => {
    res.send(" Myo Hsat Nanda - Open Heaven");
});

export default app;
