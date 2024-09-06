import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { dbConnect } from "./utils/mongoose.js";
import v1Routes from "./routes/v1/index.js";

function createServer() {
    dotenv.config();

    const app = express();

    app.use(express.json());

    dbConnect();

    app.use((err: Error, req: Request, res: Response, __next: NextFunction) => {
        console.error(err.stack);
        res.status(500).send("Something went wrong");
    });

    app.use("/api/v1", v1Routes);

    return app;
}

export default createServer;
