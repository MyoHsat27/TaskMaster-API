import { Request, Response, NextFunction } from "express";
import { decodeAuthToken } from "../helpers/jwtManager.js";
import { findOneById } from "../services/v1/userService.js";
import { HttpUnauthorizedHandler } from "../helpers/httpResponseHandler.js";

const isAuthenticate = async (req: Request, res: Response, next: NextFunction) => {
    const authToken = req.headers["authorization"]?.split(" ")[1];

    if (!authToken) {
        return HttpUnauthorizedHandler(res, "Unauthorized");
    }

    try {
        const decoded = decodeAuthToken(authToken);
        const user = await findOneById(decoded._id);

        if (!user) {
            return HttpUnauthorizedHandler(res, "Unauthorized");
        }

        res.locals.user = user; // Attach the user to res.locals
        next();
    } catch (error) {
        return HttpUnauthorizedHandler(res, "Unauthorized");
    }
};

export default isAuthenticate;
