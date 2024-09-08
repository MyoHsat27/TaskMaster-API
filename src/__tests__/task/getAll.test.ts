import request from "supertest";
import User from "../../models/user.js";
import createServer from "../../server.js";
import * as jwtManager from "../../helpers/jwtManager.js";
import * as userService from "../../services/v1/userService.js";
import * as taskService from "../../services/v1/taskService.js";
import { AuthTokenData } from "../../types/token.js";
import mongoose from "mongoose";
import Task from "../../models/task.js";

const app = createServer();

const decodedAuthToken: AuthTokenData = {
    _id: "66dd82797888aeb9e361e0e3",
    email: "testuser@example.com",
    username: "testuser"
};

const authToken = "Bearer validAuthToken";

const mockUser = new User({
    _id: new mongoose.Types.ObjectId("66dd82797888aeb9e361e0e3"),
    username: "testuser",
    email: "testuser@example.com",
    refreshToken: "validRefreshToken"
});

const mockTask = new Task({
    _id: new mongoose.Types.ObjectId("66dd82797888aeb9e361e0e3"),
    title: "test",
    description: "test",
    userId: new mongoose.Types.ObjectId("66dd82797888aeb9e361e0e3")
});

describe("GET /api/v1/tasks", () => {
    it("should return tasks for the authenticated user", async () => {
        jest.spyOn(jwtManager, "decodeAuthToken").mockReturnValue(decodedAuthToken);
        jest.spyOn(userService, "findOneById").mockResolvedValue(mockUser);
        jest.spyOn(taskService, "getTasks").mockResolvedValue({
            data: [mockTask],
            pagination: { page: 1, pages: 10, limit: 10, totalItems: 1 }
        });

        const response = await request(app).get("/api/v1/tasks").set("Authorization", authToken);

        expect(response.status).toBe(200);
        expect(response.body.status).toBe(200);
        expect(response.body.tasks).toHaveLength(1);
        expect(response.body.tasks[0].title).toBe("test");
        expect(response.body.pagination).toBeDefined();
    });

    it("should handle error when fetching tasks fails", async () => {
        jest.spyOn(jwtManager, "decodeAuthToken").mockReturnValue(decodedAuthToken);
        jest.spyOn(userService, "findOneById").mockResolvedValue(mockUser);
        jest.spyOn(taskService, "getTasks").mockImplementation(() => {
            throw new Error("Failed to fetch tasks");
        });

        const response = await request(app).get("/api/v1/tasks").set("Authorization", authToken);

        expect(response.status).toBe(500);
        expect(response.body.status).toBe(500);
        expect(response.body.message).toBe("Failed to fetch tasks");
    });

    it("should return unauthorize when users provide invalid auth token", async () => {
        jest.spyOn(jwtManager, "decodeAuthToken").mockImplementation(() => {
            throw Error("Unauthorized");
        });

        const response = await request(app).get("/api/v1/tasks").set("Authorization", authToken);

        expect(response.status).toBe(401);
        expect(response.body.status).toBe(401);
        expect(response.body.message).toBe("Unauthorized");
    });

    it("handle error when user cannot find", async () => {
        jest.spyOn(userService, "findOneById").mockImplementation(() => {
            throw Error("Unauthorized");
        });

        const response = await request(app).get("/api/v1/tasks").set("Authorization", authToken);

        expect(response.status).toBe(401);
        expect(response.body.status).toBe(401);
        expect(response.body.message).toBe("Unauthorized");
    });
});
