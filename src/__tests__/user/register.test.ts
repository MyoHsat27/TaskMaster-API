import supertest from "supertest";
import createServer from "../../server.js";

const app = createServer();

const userInput = {
    email: "test@example.com",
    name: "Jane Doe",
    password: "Password123",
    passwordConfirmation: "Password123"
};

describe("User Registration", () => {
    describe("when user entered invalid input", () => {
        const validationError = "Validation error";
        it("should return 400 if validation fails", async () => {
            const response = await supertest(app).post("/api/v1/users/register");
            expect(response.status).toBe(400);
        });
    });
});
