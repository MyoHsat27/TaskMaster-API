import pino from "pino";
import { createStream } from "rotating-file-stream";
import path from "path";
import { fileURLToPath } from "url";

// Get the equivalent of __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFilePath = path.resolve(__dirname, "../logs/app.log");
const logStream = createStream("app.log", {
    size: "10M",
    interval: "1d",
    path: path.resolve(__dirname, "../logs")
});
const logger = pino(
    {
        level: process.env.PINO_LOG_LEVEL || "info"
    },
    logStream
);

export default logger;
