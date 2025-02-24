import express from "express";
import { auth } from "express-oauth2-jwt-bearer";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Setup JWT authentication check using values from environment variables
const jwtCheck = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_ISSUER,
    tokenSigningAlg: "RS256"
});

// Your middleware for checking the token
export default (req, res, next) => {
    console.log("Received Token:", req.headers.authorization); // Debugging
    if (!req.headers.authorization) {
        return res.status(401).json({ message: "No token provided" });
    }
    jwtCheck(req, res, next);
};
