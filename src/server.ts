import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import v1Routes from "./routes/v1/index.js";
import cookieParser from "cookie-parser";
import logger from "./helpers/logger.js";

function createServer() {
    dotenv.config();

    const app = express();

    app.use(express.json());
    app.use(cookieParser());

    app.use((err: Error, req: Request, res: Response, __next: NextFunction) => {
        logger.error(err.stack);
        res.status(500).send("Something went wrong");
    });

    app.use("/api/v1", v1Routes);

    return app;
}

export default createServer;
