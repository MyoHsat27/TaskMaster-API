import { TaskCreateObject, TaskObject, TaskUpdateObject } from "../../types/task.js";
import { transformToObjectId } from "../../helpers/helpers.js";
import { PaginateQuery, PaginateResult } from "../../types/paginate.js";
import { paginator } from "../../helpers/paginator.js";
import mongoose from "mongoose";
import { throwError } from "../../helpers/errorHandler.js";
import Task from "../../models/task.js";

export const getTaskByUserIdAndTitle = async (userId: mongoose.Types.ObjectId, title: string) => {
    try {
        const task = await Task.findOne({
            $and: [{ title }, { userId }]
        });
        return task;
    } catch (error) {
        throwError(error);
    }
};

export const getTaskById = async (id: string) => {
    try {
        const taskObjectId = transformToObjectId(id);
        return await Task.findOne({ _id: taskObjectId });
    } catch (error) {
        throwError(error);
    }
};

export const getTaskByTitle = async (title: string) => {
    try {
        return await Task.findOne({ title });
    } catch (error) {
        throwError(error);
    }
};

export const getTasks = async (userId: string, query: PaginateQuery): Promise<PaginateResult<TaskObject>> => {
    try {
        const filters = {
            ...query.filters,
            userId
        };
        return await paginator(Task, { ...query, filters });
    } catch (error) {
        throwError(error);
        return Promise.reject(error);
    }
};

export const createTask = async (task: TaskCreateObject) => {
    try {
        const newTask = new Task(task);
        const savedTask = await newTask.save();

        return savedTask;
    } catch (error) {
        throwError(error);
    }
};

export const updateTask = async (id: string, task: TaskUpdateObject) => {
    try {
        const oldTask = await Task.findById(id);

        oldTask.title = task.title;
        oldTask.description = task.description;
        oldTask.status = task.status;
        oldTask.priority = task.priority;

        const updatedTask = await oldTask.save();
        return updatedTask;
    } catch (error) {
        throwError(error);
    }
};

export const deleteTask = async (id: string) => {
    try {
        const taskObjectId = transformToObjectId(id);
        await Task.deleteOne({ _id: taskObjectId });
    } catch (error) {
        throwError(error);
    }
};
