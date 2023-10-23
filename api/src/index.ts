
import express from "express";
import * as pg from "pg";
import * as Redis from "redis";
import cors from "cors";
import bodyparser from "body-parser";
// import { createClient } from "@supabase/supabase-js";

// rate limiting 
import rateLimit from 'express-rate-limit'

import { ConfigLoader } from "./utils/loaders/ConfigLoader";
import { write_to_logs } from "./utils/cache/Logger";
import { RouteLoader } from "./utils/loaders/RouteLoader";
import * as DatabaseLoader from "./utils/loaders/DatabaseLoader";
import { CacheTimer, CacheTimerGroup } from "./utils/cache/CacheTimer";
import { ConnectionMiddleware } from "./utils/middlewares/ConnectionLog";
import { Stripe } from "stripe";
import { getDatabaseCredentials, getStripeAPIKey } from "./utils/cache/Process";
import { Subscription, SubscriptionGroup } from "./utils/events/Subscriptions";

export const app: express.Application = express()
export const config: object | any = ConfigLoader('config.yaml');
export const pool: pg.Pool = new pg.Pool(getDatabaseCredentials('postgresql'));
export const redis: Redis.Client = new Redis.createClient(getDatabaseCredentials('redis'));
export const stripe: Stripe = new Stripe(getStripeAPIKey(), config.stripe.config);
export const subscriptions: SubscriptionGroup = new SubscriptionGroup(config.stripe.subscriptions);
export const cached_timers: CacheTimerGroup = new CacheTimerGroup([

    // input cache timers here, when we need to do stripe checking, or whatever we need to check on an interval
    // this wwill be used to bypass rate limiting, so using third party API
    // will be able to use this

]);

const rateLimiter = rateLimit({
	windowMs: config.server.ratelimit.default.duration, // 5 minutes
	max: config.server.ratelimit.default.max_requests, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    skip: (req, res): any => {
        config.server.ratelimit.default.allowed_ips.includes(req.ip) ||
        config.server.ratelimit.default.allowed_hosts.includes(req.headers.host) ||
        config.server.ratelimit.default.allowed_hosts.includes(req.headers.origin)
    },
    message: async function (req, res) {
        const request_connection = req.ip || req.headers['X-Forwarded-For'] || req.socket.remoteAddress;

        write_to_logs("connections", `The request from ${request_connection} has been rate limited`);

        return "You're making requests way too fast, please wait 15 more minutes to come back.";
    },
});

app.set('trust proxy');
app.use(cors(config.server.cors));
app.use(rateLimiter);
app.use(bodyparser.json({
    verify: function (req, res, buf) {
      var url = req.originalUrl;
      if (url.includes('/webhook')) {
         req.rawBody = buf.toString();
      }
    }
}));
app.use(ConnectionMiddleware);
RouteLoader(app);

app.listen(config.server.port, config.server.host, async (): Promise<void> => {

    await DatabaseLoader.postgres(pool);
    await DatabaseLoader.redis(redis);

    write_to_logs('service', `Listening on ${config.server.host}:${config.server.port}`, true);
});
