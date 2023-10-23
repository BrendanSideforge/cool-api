import express from "express";
/**
 * Used to look through the traffic of website, and lock those connections
 * @param req express request
 * @param res express response
 * @param next next function
 */
export declare function ConnectionMiddleware(req: express.Request, res: express.Response, next: express.NextFunction): void;
