import createServer from "./server.js";
import logger from "./helpers/logger.js";
import { dbConnect } from "./config/mongoose.js";

const app = createServer();
const PORT = process.env.PORT;

app.listen(PORT, () => {
    dbConnect();
    logger.info(`Server is running on port ${PORT}`);
    console.log(`Server is running on port ${PORT}`);
});
