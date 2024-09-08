import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: The user's username.
 *           example: "john_doe"
 *         email:
 *           type: string
 *           description: The user's email address.
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           description: The user's password.
 *           example: "password123"
 *         isAdmin:
 *           type: boolean
 *           description: Indicates whether the user is an admin.
 *           example: false
 *         refreshToken:
 *           type: string
 *           description: The user's refresh token for authentication.
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflK6HTF83sBbGNV7Ox1QuqY4zPq8cyfwmOgFOtrI5E"
 *       example:
 *         username: "john_doe"
 *         email: "john.doe@example.com"
 *         password: "password123"
 *         isAdmin: false
 *         refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflK6HTF83sBbGNV7Ox1QuqY4zPq8cyfwmOgFOtrI5E"
 *     CreateUserInput:
 *       type: object
 *       required:
 *         - email
 *         - name
 *         - password
 *         - passwordConfirmation
 *       properties:
 *         email:
 *           type: string
 *           description: The user's email address.
 *           default: "jane.doe@example.com"
 *         name:
 *           type: string
 *           description: The user's name.
 *           default: "Jane Doe"
 *         password:
 *           type: string
 *           description: The user's password.
 *           default: "stringPassword123"
 *         passwordConfirmation:
 *           type: string
 *           description: The confirmation of the user's password.
 *           default: "stringPassword123"
 */
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Please provide username"],
            unique: true
        },
        email: {
            type: String,
            required: [true, "Please provide email"],
            unique: true
        },
        password: {
            type: String,
            required: [true, "Please provide a password"]
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        refreshToken: String
    },
    { timestamps: true }
);

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
