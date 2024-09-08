import express, { Router } from "express";
import { refreshToken } from "../../../controllers/v1/authController.js";

const router: Router = express.Router();

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh the JWT access token
 *     description: Allows a user to refresh their JWT access token using a valid refresh token. The refresh token is sent in the HTTP-only cookies.
 *     tags:
 *       - Authentication
 *     responses:
 *       201:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token refreshed successfully
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 accessToken:
 *                   type: string
 *                   description: New JWT access token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Invalid refresh token or missing refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No refresh token provided
 *                 status:
 *                   type: number
 *                   example: 400
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 status:
 *                   type: number
 *                   example: 500
 *     security:
 *       - cookieAuth: []
 */
router.post("/refresh", refreshToken);

export default router;
