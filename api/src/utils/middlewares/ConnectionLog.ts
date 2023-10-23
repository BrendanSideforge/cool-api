
import express from "express";
import { write_to_logs } from "../cache/Logger";

/**
 * Used to look through the traffic of website, and lock those connections
 * @param req express request
 * @param res express response
 * @param next next function
 */
export function ConnectionMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {

    const request_connection = req.ip || req.headers['X-Forwarded-For'] || req.socket.remoteAddress;

    let rateLimitString: string = "(IP allowed)";

    if (req.rateLimit) {
        rateLimitString = `(${req.rateLimit.remaining}/${req.rateLimit.limit} remaining request(s) until RATE LIMIT)`;
    }

    write_to_logs(
        "connections",
        `Request from ${request_connection} on ${req.originalUrl} ${rateLimitString}`
    );

    next();

}
