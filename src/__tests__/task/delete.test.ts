import request from "supertest";
import User from "../../models/user.js";
import createServer from "../../server.js";
import * as jwtManager from "../../helpers/jwtManager.js";
import * as userService from "../../services/v1/userService.js";
import * as taskService from "../../services/v1/taskService.js";
import * as helper from "../../helpers/helpers.js";
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

describe("DELETE /api/v1/tasks/:taskId", () => {
    it("should delete the task successfully", async () => {
        jest.spyOn(jwtManager, "decodeAuthToken").mockReturnValue(decodedAuthToken);
        jest.spyOn(userService, "findOneById").mockResolvedValue(mockUser);
        jest.spyOn(helper, "isValidObjectId").mockReturnValue(true);
        jest.spyOn(taskService, "getTaskById").mockResolvedValue(mockTask);
        jest.spyOn(taskService, "deleteTask").mockResolvedValue();

        const response = await request(app).delete(`/api/v1/tasks/${mockTask._id}`).set("Authorization", authToken);

        expect(response.status).toBe(200);
        expect(response.body.status).toBe(200);
        expect(response.body.message).toBe("Task deleted successfully");
    });

    it("should return 404 if invalid task id given", async () => {
        jest.spyOn(jwtManager, "decodeAuthToken").mockReturnValue(decodedAuthToken);
        jest.spyOn(userService, "findOneById").mockResolvedValue(mockUser);
        jest.spyOn(helper, "isValidObjectId").mockReturnValue(false);

        const response = await request(app)
            .delete(`/api/v1/tasks/${mockTask._id}`)
            .set("Authorization", authToken)
            .send({
                title: "updated test",
                description: "test",
                priority: "low",
                status: "pending"
            });

        expect(response.status).toBe(404);
        expect(response.body.status).toBe(404);
        expect(response.body.message).toBe("Task not found");
    });

    it("should return 404 if task not found", async () => {
        jest.spyOn(jwtManager, "decodeAuthToken").mockReturnValue(decodedAuthToken);
        jest.spyOn(userService, "findOneById").mockResolvedValue(mockUser);
        jest.spyOn(helper, "isValidObjectId").mockReturnValue(true);
        jest.spyOn(taskService, "getTaskById").mockResolvedValue(null);

        const response = await request(app).delete(`/api/v1/tasks/${mockTask._id}`).set("Authorization", authToken);

        expect(response.status).toBe(404);
        expect(response.body.status).toBe(404);
        expect(response.body.message).toBe("Task not found");
    });

    it("should return 404 if task does not belong to user", async () => {
        jest.spyOn(jwtManager, "decodeAuthToken").mockReturnValue(decodedAuthToken);
        jest.spyOn(userService, "findOneById").mockResolvedValue(mockUser);
        jest.spyOn(helper, "isValidObjectId").mockReturnValue(true);
        jest.spyOn(taskService, "getTaskById").mockResolvedValue({
            _id: new mongoose.Types.ObjectId("66dd82797888aeb9e361e0e3"),
            title: "test",
            description: "test",
            userId: new mongoose.Types.ObjectId("66dd82631888aeb9e361e0e3") // different user id
        });
        jest.spyOn(taskService, "getTaskByTitle").mockResolvedValue(mockTask);

        const response = await request(app)
            .delete(`/api/v1/tasks/${mockTask._id}`)
            .set("Authorization", authToken)
            .send({
                title: "updated test",
                description: "test",
                priority: "low",
                status: "pending"
            });

        expect(response.status).toBe(404);
        expect(response.body.status).toBe(404);
        expect(response.body.message).toBe("Task not found");
    });

    it("should handle error when deleting task fails", async () => {
        jest.spyOn(jwtManager, "decodeAuthToken").mockReturnValue(decodedAuthToken);
        jest.spyOn(userService, "findOneById").mockResolvedValue(mockUser);
        jest.spyOn(helper, "isValidObjectId").mockReturnValue(true);
        jest.spyOn(taskService, "getTaskById").mockResolvedValue(mockTask);
        jest.spyOn(taskService, "deleteTask").mockImplementation(() => {
            throw new Error("Task delete fail");
        });

        const response = await request(app).delete(`/api/v1/tasks/${mockTask._id}`).set("Authorization", authToken);

        expect(response.status).toBe(500);
        expect(response.body.status).toBe(500);
        expect(response.body.message).toBe("Task delete fail");
    });

    it("should return unauthorize when users provide invalid auth token", async () => {
        jest.spyOn(jwtManager, "decodeAuthToken").mockImplementation(() => {
            throw Error("Unauthorized");
        });

        const response = await request(app).delete(`/api/v1/tasks/${mockTask._id}`).set("Authorization", authToken);

        expect(response.status).toBe(401);
        expect(response.body.status).toBe(401);
        expect(response.body.message).toBe("Unauthorized");
    });

    it("handle error when user cannot find", async () => {
        jest.spyOn(userService, "findOneById").mockImplementation(() => {
            throw Error("Unauthorized");
        });

        const response = await request(app).delete(`/api/v1/tasks/${mockTask._id}`).set("Authorization", authToken);

        expect(response.status).toBe(401);
        expect(response.body.status).toBe(401);
        expect(response.body.message).toBe("Unauthorized");
    });
});
