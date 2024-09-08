import createServer from "./server.js";
import swaggerDocs from "./swagger.js";
import { dbConnect } from "./config/mongoose.js";

const app = createServer();
const PORT = process.env.PORT;

app.listen(PORT, () => {
    dbConnect();
    swaggerDocs(app);
    console.log(`Server is running on port ${PORT}`);
});
