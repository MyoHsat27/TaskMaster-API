import { Request, Response, NextFunction } from "express";

const mockAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    res.locals.user = { _id: "testuserId", username: "testuser" };
    next();
};

export default mockAuthMiddleware;
