import { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "TaskMaster API Documentation",
        version: "v1.0.0",
        description: "This is the API documentation for the TaskMaster's backend services."
    },
    servers: [
        {
            url: "/api/v1",
            description: "Version 1 API"
        }
    ]
};

const options: swaggerJsdoc.Options = {
    swaggerDefinition,
    apis: ["./src/routes/**/*.ts", "./src/models/*.ts"]
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express) {
    // Swagger page
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Docs in JSON format
    app.get("/docs.json", (req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });
}

export default swaggerDocs;
