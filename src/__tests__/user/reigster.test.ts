import request from "supertest";
import createServer from "../../server.js";
import User from "../../models/user.js";
import * as userService from "../../services/v1/userService.js";
import logger from "../../utils/logger.js";
import * as passwordManager from "../../utils/passwordManager.js";

const app = createServer();

describe("POST /register", () => {
    beforeAll(async () => {
        await User.deleteMany({});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should return validation error for invalid input", async () => {
        const response = await request(app).post("/api/v1/users/register").send({
            email: "", // Invalid email
            username: "", // Invalid username
            password: "short" // Invalid password
        });

        expect(response.status).toBe(400);
        expect(response.body.status).toBe(400);
        expect(response.body.error).toBeDefined();
    });

    it("should return error if user with email already exists", async () => {
        // First user creation
        await request(app).post("/api/v1/users/register").send({
            email: "test@example.com",
            username: "testuser",
            password: "ValidPassword123!",
            confirmPassword: "ValidPassword123!"
        });

        // Try to create another user with the same email but different username
        const response = await request(app).post("/api/v1/users/register").send({
            email: "test@example.com", // Duplicate email
            username: "anotheruser", // Different username
            password: "AnotherPassword123!",
            confirmPassword: "AnotherPassword123!"
        });

        expect(response.status).toBe(400);
        expect(response.body.status).toBe(400);
        expect(response.body.message).toBe("User with this email already exists");
    });

    it("should return error if user with username already exists", async () => {
        // First user creation
        await request(app).post("/api/v1/users/register").send({
            email: "unique@example.com",
            username: "testuser",
            password: "ValidPassword123!",
            confirmPassword: "ValidPassword123!"
        });

        // Try to create another user with the same username but different email
        const response = await request(app).post("/api/v1/users/register").send({
            email: "another@example.com", // Different email
            username: "testuser", // Duplicate username
            password: "AnotherPassword123!",
            confirmPassword: "AnotherPassword123!"
        });

        expect(response.status).toBe(400);
        expect(response.body.status).toBe(400);
        expect(response.body.message).toBe("User with this username already exists");
    });

    it("should register a new user successfully", async () => {
        const response = await request(app).post("/api/v1/users/register").send({
            email: "newuser@example.com",
            username: "newuser",
            password: "NewValidPassword123!",
            confirmPassword: "NewValidPassword123!"
        });

        expect(response.status).toBe(201);
        expect(response.body.status).toBe(201);
        expect(response.body.responseMessage).toBe("User created successfully");

        // Check if user is actually in the database
        const createdUser = await User.findOne({ email: "newuser@example.com" });
        expect(createdUser).toBeTruthy();
        expect(createdUser?.email).toBe("newuser@example.com");
    });

    it("should handle error when creating user fails", async () => {
        jest.spyOn(userService, "create").mockImplementation(() => {
            throw new Error("Database error during user creation");
        });

        const loggerSpy = jest.spyOn(logger, "error");

        const response = await request(app).post("/api/v1/users/register").send({
            email: "erroruser@example.com",
            username: "erroruser",
            password: "ErrorPassword123!",
            confirmPassword: "ErrorPassword123!"
        });

        expect(response.statusCode).toBe(500);
        expect(loggerSpy).toHaveBeenCalled();
        expect(loggerSpy).toHaveBeenCalledWith(new Error("Database error during user creation"));
    });

    it("should handle error when hashing password fails", async () => {
        jest.spyOn(passwordManager, "hashPassword").mockImplementation(() => {
            throw new Error("Hashing error");
        });

        const loggerSpy = jest.spyOn(logger, "error");

        const response = await request(app).post("/api/v1/users/register").send({
            email: "hashuser@example.com",
            username: "hashuser",
            password: "ErrorPassword123!",
            confirmPassword: "ErrorPassword123!"
        });

        expect(response.statusCode).toBe(500);
        expect(loggerSpy).toHaveBeenCalled();
        expect(loggerSpy).toHaveBeenCalledWith(new Error("Hashing error"));
    });
});
