"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionMiddleware = void 0;
const Logger_1 = require("./Logger");
/**
 * Used to look through the traffic of website, and lock those connections
 * @param req express request
 * @param res express response
 * @param next next function
 */
function ConnectionMiddleware(req, res, next) {
    const request_connection = req.ip || req.headers['X-Forwarded-For'] || req.socket.remoteAddress;
    let rateLimitString = "(IP allowed)";
    if (req.rateLimit) {
        rateLimitString = `(${req.rateLimit.remaining}/${req.rateLimit.limit} remaining request(s) until RATE LIMIT)`;
    }
    (0, Logger_1.write_to_logs)("connections", `Request from ${request_connection} on ${req.originalUrl} ${rateLimitString}`);
    next();
}
exports.ConnectionMiddleware = ConnectionMiddleware;
