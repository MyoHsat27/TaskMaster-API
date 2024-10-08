import request from "supertest";
import createServer from "../../server.js";
import User from "../../models/user.js";
import * as jwtManager from "../../helpers/jwtManager.js";
import * as userService from "../../services/v1/userService.js";
import * as passwordManager from "../../helpers/passwordManager.js";
import { jest } from "@jest/globals";
import mongoose from "mongoose";

const app = createServer();

describe("POST /auth/refresh", () => {
    let existingRefreshToken: string;

    beforeAll(async () => {
        await User.deleteMany({});
        await User.create({
            email: "testuser@example.com",
            username: "testuser",
            password: await passwordManager.hashPassword("ValidPassword123!"),
            refreshToken: "validRefreshToken" // Set a valid refresh token for testing
        });
        existingRefreshToken = "validRefreshToken"; // Mocked token value
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should return error if no refresh token is provided", async () => {
        const response = await request(app).post("/api/v1/auth/refresh").send().set("Cookie", "refreshToken=");

        expect(response.status).toBe(400);
        expect(response.body.status).toBe(400);
        expect(response.body.message).toBe("No refresh token provided");
    });

    it("should return error if refresh token is invalid ", async () => {
        await User.updateOne({ email: "testuser@example.com" }, { refreshToken: "invalidToken" });

        jest.spyOn(jwtManager, "decodeRefreshToken").mockReturnValue({ _id: "testuserId" });

        const mockUser = new User({
            _id: "testuserId",
            username: "testuser",
            email: "testuser@example.com",
            password: "ValidPassword123!",
            refreshToken: existingRefreshToken
        });

        jest.spyOn(userService, "findOneById").mockResolvedValue(mockUser);

        const response = await request(app).post("/api/v1/auth/refresh").set("Cookie", "refreshToken=invalidToken");

        expect(response.status).toBe(400);
        expect(response.body.status).toBe(400);
        expect(response.body.message).toBe("Invalid refresh token");
    });

    it("should refresh tokens successfully and set new tokens in cookies", async () => {
        jest.spyOn(jwtManager, "decodeRefreshToken").mockReturnValue({ _id: "testuserId" });

        const mockUser = new User({
            _id: new mongoose.Types.ObjectId("66dd82797888aeb9e361e0e3").toString(),
            username: "testuser2",
            email: "testuser2@example.com",
            password: "ValidPassword123!",
            refreshToken: existingRefreshToken
        });
        jest.spyOn(userService, "findOneById").mockResolvedValue(mockUser);

        const newAuthToken = "newAuthToken";
        const newRefreshToken = "newRefreshToken";

        jest.spyOn(jwtManager, "generateAuthToken").mockReturnValue(newAuthToken);
        jest.spyOn(jwtManager, "generateRefreshToken").mockReturnValue(newRefreshToken);

        const response = await request(app)
            .post("/api/v1/auth/refresh")
            .set("Cookie", `refreshToken=${existingRefreshToken}`);

        expect(response.body.status).toBe(201);
        expect(response.body.message).toBe("Token refreshed successfully");
        expect(response.body.accessToken).toBe(newAuthToken);

        const cookies = response.headers["set-cookie"];
        expect(cookies).toBeDefined();
        expect(cookies).toEqual(expect.arrayContaining([expect.stringMatching(/^refreshToken=.*; HttpOnly$/)]));
    });

    it("should handle error when saving user fails", async () => {
        jest.spyOn(jwtManager, "decodeRefreshToken").mockReturnValue({ _id: "testuserId" });

        const mockUser = new User({
            _id: "testuserId",
            username: "testuser",
            email: "testuser@example.com",
            password: "ValidPassword123!",
            refreshToken: existingRefreshToken
        });

        jest.spyOn(userService, "findOneById").mockResolvedValue(mockUser);

        const newAuthToken = "newAuthToken";
        const newRefreshToken = "newRefreshToken";
        jest.spyOn(jwtManager, "generateAuthToken").mockReturnValue(newAuthToken);
        jest.spyOn(jwtManager, "generateRefreshToken").mockReturnValue(newRefreshToken);

        jest.spyOn(User.prototype, "save").mockImplementation(() => {
            throw new Error("Database error");
        });

        const response = await request(app)
            .post("/api/v1/auth/refresh")
            .set("Cookie", `refreshToken=${existingRefreshToken}`);

        expect(response.body.message).toBe("Database error");
        expect(response.statusCode).toBe(500);
    });

    it("should handle error when generating tokens fails", async () => {
        jest.spyOn(jwtManager, "decodeRefreshToken").mockReturnValue({ _id: "testuserId" });

        const mockUser = {
            _id: "testuserId",
            username: "testuser",
            email: "testuser@example.com",
            password: "ValidPassword123!",
            refreshToken: existingRefreshToken
        };

        jest.spyOn(userService, "findOneById").mockResolvedValue(mockUser);

        jest.spyOn(jwtManager, "generateAuthToken").mockImplementation(() => {
            throw new Error("Auth token generation error");
        });

        const response = await request(app)
            .post("/api/v1/auth/refresh")
            .set("Cookie", `refreshToken=${existingRefreshToken}`);

        expect(response.body.message).toBe("Auth token generation error");
        expect(response.statusCode).toBe(500);
    });
});
