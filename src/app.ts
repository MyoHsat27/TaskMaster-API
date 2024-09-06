import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

app.use((err: Error, req: Request, res: Response) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong");
});

app.use("/test", (req: Request, res: Response) => {
    res.send("Thar Linn Htet - Larry, Myo Hsat Nanda - Open Heaven");
});

export default app;
