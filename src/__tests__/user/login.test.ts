import request from "supertest";
import createServer from "../../server.js";
import User from "../../models/user.js";
import * as userService from "../../services/v1/userService.js";
import * as passwordManager from "../../helpers/passwordManager.js";
import * as jwtManager from "../../helpers/jwtManager.js";
import TestAgent from "supertest/lib/agent.js";

const app = createServer();

describe("POST /users/login", () => {
    beforeAll(async () => {
        await User.deleteMany({});
        let user = await User.create({
            email: "testuser@example.com",
            username: "testuser",
            password: await passwordManager.hashPassword("ValidPassword123!"),
            refreshToken: ""
        });
    });

    it("should return validation error for invalid input", async () => {
        const response = await request(app).post("/api/v1/users/login").send({
            email: "", // Invalid email
            password: "" // Invalid password
        });

        expect(response.status).toBe(400);
        expect(response.body.status).toBe(400);
        expect(response.body.error).toBeDefined();
    });

    it("should return error if user is not found", async () => {
        const response = await request(app).post("/api/v1/users/login").send({
            email: "nonexistent@example.com", // Non-existent email
            password: "SomePassword123!"
        });

        expect(response.status).toBe(400);
        expect(response.body.status).toBe(400);
        expect(response.body.message).toBe("user not found");
    });

    it("should return error for incorrect password", async () => {
        const response = await request(app).post("/api/v1/users/login").send({
            email: "testuser@example.com",
            password: "WrongPassword123!"
        });

        expect(response.status).toBe(400);
        expect(response.body.status).toBe(400);
        expect(response.body.message).toBe("email or password is wrong");
    });

    // it("should login successfully and send refresh token in cookies", async () => {
    //     let response = await request(app).post("/api/v1/users/login").send({
    //         email: "testuser@example.com",
    //         password: "ValidPassword123!"
    //     });

    //     console.log(response);
    //     expect(response.body.message).toBe("Login successful");

    //     // Check if cookies are set
    //     const cookies = response.headers["set-cookie"];
    //     expect(cookies).toBeDefined();
    //     expect(cookies).toEqual(expect.arrayContaining([expect.stringMatching(/^refreshToken=.*; HttpOnly$/)]));
    // });

    it("should handle error when generating tokens fails", async () => {
        jest.spyOn(passwordManager, "comparePassword").mockResolvedValue(true); // Simulate correct password
        jest.spyOn(userService, "findOne").mockResolvedValue({
            _id: "someUserId",
            username: "testuser",
            email: "testuser@example.com",
            password: "ValidPassword123!",
            refreshToken: ""
        });
        jest.spyOn(jwtManager, "generateAuthToken").mockImplementation(() => {
            throw new Error("Token generation error");
        });

        const response = await request(app).post("/api/v1/users/login").send({
            email: "testuser@example.com",
            password: "ValidPassword123!"
        });

        expect(response.statusCode).toBe(500);
    });

    it("should handle error when hashing password fails", async () => {
        jest.spyOn(passwordManager, "comparePassword").mockImplementation(() => {
            throw new Error("Hashing error");
        });

        const response = await request(app).post("/api/v1/users/login").send({
            email: "testuser@example.com",
            password: "ErrorPassword123!"
        });

        expect(response.statusCode).toBe(500);
    });
});
