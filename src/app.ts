import createServer from "./server.js";
import swaggerDocs from "./swagger.js";

const app = createServer();
const PORT = process.env.PORT;

app.listen(PORT, () => {
    swaggerDocs(app);
    console.log(`Server is running on port ${PORT}`);
});
