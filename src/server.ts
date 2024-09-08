import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import v1Routes from "./routes/v1/index.js";
import cookieParser from "cookie-parser";

function createServer() {
    const environment = process.env.NODE_ENV || "development";
    if (process.env.NODE_ENV !== "test") {
        dotenv.config({ path: `.env.${environment}` });
    }

    const app = express();

    app.use(express.json());
    app.use(cookieParser());

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
        // _next is required by the Express error-handling middleware
        res.status(500).send("Something went wrong");
    });

    app.use("/api/v1", v1Routes);

    return app;
}

export default createServer;
