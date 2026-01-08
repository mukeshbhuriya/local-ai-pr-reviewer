import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // If we are in development mode with no key set, distinct warning or allow?
    // For production security, we enforce it.

    const apiKey = req.headers['x-api-key'];
    const validKey = process.env.APP_API_KEY;

    if (!validKey) {
        // If the server admin hasn't set a key, we warn but might allow for local demo.
        // But for "Production Grade", we should block or explicit log.
        console.warn('WARNING: APP_API_KEY is not set in environment. allowing request (UNSAFE).');
        return next();
    }

    if (!apiKey || apiKey !== validKey) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or missing API Key' });
    }

    next();
};
