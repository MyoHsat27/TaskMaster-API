import mongoose from "mongoose";
import logger from "../helpers/logger.js";

mongoose.set("strictPopulate", false);

export async function dbConnect() {
    try {
        await mongoose.connect(process.env.MONGO_URL!);
        const connection = mongoose.connection;
        connection.on("connected", () => {
            logger.info("DB Connected");
            console.log("DB Connected");
        });

        connection.on("error", (err) => {
            logger.error("MongoDB connection error" + err);
            process.exit();
        });
    } catch (error) {
        console.log(error);
    }
}
