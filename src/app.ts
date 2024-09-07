import createServer from "./server.js";
import logger from "./helpers/logger.js";
import { dbConnect } from "./utils/mongoose.js";

const PORT = process.env.PORT || 3000;

const app = createServer();

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    console.log(`Server is running on port ${PORT}`);

    dbConnect();
});
