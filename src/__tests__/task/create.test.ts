import request from "supertest";
import User from "../../models/user.js";
import createServer from "../../server.js";
import * as jwtManager from "../../helpers/jwtManager.js";
import * as userService from "../../services/v1/userService.js";
import * as taskService from "../../services/v1/taskService.js";
import * as passwordManager from "../../helpers/passwordManager.js";
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

describe.only("POST /api/v1/tasks", () => {
    beforeAll(async () => {
        await User.deleteMany({});
        await Task.deleteMany({});
        await Task.create({
            _id: new mongoose.Types.ObjectId("66dd82797888aeb9e361e0e3"),
            title: "test",
            description: "test",
            userId: new mongoose.Types.ObjectId("66dd82797888aeb9e361e0e3")
        });
        await User.create({
            _id: new mongoose.Types.ObjectId("66dd824b7888aeb9e361e0d7"),
            username: "testuser",
            email: "testuser@example.com",
            password: await passwordManager.hashPassword("ValidPassword123!"),
            refreshToken: "validRefreshToken"
        });
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should return validation error for invalid input", async () => {
        jest.spyOn(jwtManager, "decodeAuthToken").mockReturnValue(decodedAuthToken);
        jest.spyOn(userService, "findOneById").mockResolvedValue(mockUser);

        const response = await request(app).post("/api/v1/tasks").set("Authorization", authToken).send({
            title: "",
            description: "",
            status: "InvalidStatus",
            priority: "InvalidPriority"
        });

        expect(response.status).toBe(400);
        expect(response.body.status).toBe(400);
        expect(response.body.error).toBeDefined();
    });

    it("should return validation error when same task title enter", async () => {
        jest.spyOn(jwtManager, "decodeAuthToken").mockReturnValue(decodedAuthToken);
        jest.spyOn(userService, "findOneById").mockResolvedValue(mockUser);

        const response = await request(app).post("/api/v1/tasks").set("Authorization", authToken).send({
            title: "test",
            description: "test"
        });

        expect(response.status).toBe(400);
        expect(response.body.status).toBe(400);
        expect(response.body.message).toBe("Task already exists");
    });

    it("should create task successfully when validation pass", async () => {
        jest.spyOn(jwtManager, "decodeAuthToken").mockReturnValue(decodedAuthToken);
        jest.spyOn(userService, "findOneById").mockResolvedValue(mockUser);

        const response = await request(app).post("/api/v1/tasks").set("Authorization", authToken).send({
            title: "new test",
            description: "test"
        });

        expect(response.status).toBe(201);
        expect(response.body.status).toBe(201);
        expect(response.body.message).toBe("Task created successfully");
    });

    it("should handle error when task creation fail", async () => {
        jest.spyOn(jwtManager, "decodeAuthToken").mockReturnValue(decodedAuthToken);
        jest.spyOn(userService, "findOneById").mockResolvedValue(mockUser);
        jest.spyOn(taskService, "createTask").mockImplementation(() => {
            throw new Error("Task create fail");
        });

        const response = await request(app).post("/api/v1/tasks").set("Authorization", authToken).send({
            title: "new test2",
            description: "test"
        });

        expect(response.status).toBe(500);
        expect(response.body.status).toBe(500);
        expect(response.body.message).toBe("Task create fail");
    });
});
