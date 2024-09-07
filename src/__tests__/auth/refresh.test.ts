import request from "supertest";
import createServer from "../../server.js";
import User from "../../models/user.js";
import * as jwtManager from "../../utils/jwtManager.js";
import logger from "../../utils/logger.js";
import * as userService from "../../services/v1/userService.js";
import * as passwordManager from "../../utils/passwordManager.js";

const app = createServer();

describe("POST /auth/refresh", () => {
    let existingRefreshToken: string;

    beforeAll(async () => {
        await User.deleteMany({});
        const user = await User.create({
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
        expect(response.body.error).toBe("No refresh token provided");
    });

    it("should return error if refresh token is invalid ", async () => {
        await User.updateOne({ email: "testuser@example.com" }, { refreshToken: "invalidToken" });

        const response = await request(app).post("/api/v1/auth/refresh").set("Cookie", "refreshToken=invalidToken");

        expect(response.status).toBe(400);
        expect(response.body.status).toBe(400);
        expect(response.body.error).toBe("Invalid refresh token");
    });

    it("should refresh tokens successfully and set new tokens in cookies", async () => {
        jest.spyOn(jwtManager, "decodeRefreshToken").mockReturnValue({ _id: "testuserId" });
        jest.spyOn(userService, "findOneById").mockResolvedValue({
            _id: "testuserId",
            username: "testuser",
            email: "testuser@example.com",
            password: "ValidPassword123!",
            refreshToken: existingRefreshToken
        });

        const newAuthToken = "newAuthToken";
        const newRefreshToken = "newRefreshToken";

        jest.spyOn(jwtManager, "generateAuthToken").mockReturnValue(newAuthToken);
        jest.spyOn(jwtManager, "generateRefreshToken").mockReturnValue(newRefreshToken);

        const response = await request(app)
            .post("/api/v1/auth/refresh")
            .set("Cookie", `refreshToken=${existingRefreshToken}`);

        expect(response.status).toBe(201);
        expect(response.body.status).toBe(201);
        expect(response.body.message).toBe("Token refreshed successfully");

        const cookies = response.headers["set-cookie"];
        expect(cookies).toBeDefined();
        expect(cookies).toEqual(
            expect.arrayContaining([
                expect.stringMatching(`authToken=${newAuthToken}`),
                expect.stringMatching(`refreshToken=${newRefreshToken}`)
            ])
        );
    });

    it("should handle error when saving user fails", async () => {
        jest.spyOn(jwtManager, "decodeRefreshToken").mockReturnValue({ _id: "testuserId" });
        jest.spyOn(userService, "findOneById").mockResolvedValue({
            _id: "testuserId",
            username: "testuser",
            email: "testuser@example.com",
            password: "ValidPassword123!",
            refreshToken: existingRefreshToken
        });
        jest.spyOn(jwtManager, "generateAuthToken").mockReturnValue("newAuthToken");
        jest.spyOn(jwtManager, "generateRefreshToken").mockReturnValue("newRefreshToken");

        jest.spyOn(User.prototype, "save").mockImplementation(() => {
            throw new Error("Database error");
        });

        const loggerSpy = jest.spyOn(logger, "error");

        const response = await request(app)
            .post("/api/v1/auth/refresh")
            .set("Cookie", `refreshToken=${existingRefreshToken}`);

        expect(response.statusCode).toBe(500);
        expect(loggerSpy).toHaveBeenCalled();
        expect(loggerSpy).toHaveBeenCalledWith(new Error("Database error"));
    });

    it("should handle error when generating tokens fails", async () => {
        jest.spyOn(jwtManager, "decodeRefreshToken").mockReturnValue({ _id: "testuserId" });
        jest.spyOn(userService, "findOneById").mockResolvedValue({
            _id: "testuserId",
            username: "testuser",
            email: "testuser@example.com",
            password: "ValidPassword123!",
            refreshToken: existingRefreshToken
        });

        jest.spyOn(jwtManager, "generateAuthToken").mockImplementation(() => {
            throw new Error("Auth token generation error");
        });

        const loggerSpy = jest.spyOn(logger, "error");

        const response = await request(app)
            .post("/api/v1/auth/refresh")
            .set("Cookie", `refreshToken=${existingRefreshToken}`);

        expect(response.statusCode).toBe(500);
        expect(loggerSpy).toHaveBeenCalled();
        expect(loggerSpy).toHaveBeenCalledWith(new Error("Auth token generation error"));
    });
});
