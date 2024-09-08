import mongoose from "mongoose";
import { throwError } from "../helpers/errorHandler.js";

mongoose.set("strictPopulate", false);

export async function dbConnect() {
    try {
        await mongoose.connect(process.env.MONGO_URL!);
        const connection = mongoose.connection;
        connection.on("connected", () => {
            console.log("DB Connected");
        });

        connection.on("error", () => {
            process.exit();
        });
    } catch (error) {
        throwError(error);
    }
}
