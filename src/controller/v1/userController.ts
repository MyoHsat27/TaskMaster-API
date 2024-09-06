import { Request, Response } from "express";

export const userController = () => {
    const login = async (req: Request, res: Response) => {};

    const register = async (req: Request, res: Response) => {};
    return { register, login };
};
