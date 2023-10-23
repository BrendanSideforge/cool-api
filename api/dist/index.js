"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cached_timers = exports.subscriptions = exports.stripe = exports.redis = exports.pool = exports.config = exports.app = void 0;
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const pg = tslib_1.__importStar(require("pg"));
const Redis = tslib_1.__importStar(require("redis"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const body_parser_1 = tslib_1.__importDefault(require("body-parser"));
// import { createClient } from "@supabase/supabase-js";
// rate limiting 
const express_rate_limit_1 = tslib_1.__importDefault(require("express-rate-limit"));
const ConfigLoader_1 = require("./utils/ConfigLoader");
const Logger_1 = require("./utils/Logger");
const RouteLoader_1 = require("./utils/RouteLoader");
const DatabaseLoader = tslib_1.__importStar(require("./utils/DatabaseLoader"));
const CacheTimer_1 = require("./utils/CacheTimer");
const ConnectionLog_1 = require("./utils/ConnectionLog");
const stripe_1 = require("stripe");
const Process_1 = require("./utils/Process");
const Subscriptions_1 = require("./utils/Subscriptions");
exports.app = (0, express_1.default)();
exports.config = (0, ConfigLoader_1.ConfigLoader)('config.yaml');
exports.pool = new pg.Pool((0, Process_1.getDatabaseCredentials)('postgresql'));
exports.redis = new Redis.createClient((0, Process_1.getDatabaseCredentials)('redis'));
exports.stripe = new stripe_1.Stripe((0, Process_1.getStripeAPIKey)(), exports.config.stripe.config);
exports.subscriptions = new Subscriptions_1.SubscriptionGroup(exports.config.stripe.subscriptions);
exports.cached_timers = new CacheTimer_1.CacheTimerGroup([
// input cache timers here, when we need to do stripe checking, or whatever we need to check on an interval
// this wwill be used to bypass rate limiting, so using third party API
// will be able to use this
]);
const rateLimiter = (0, express_rate_limit_1.default)({
    windowMs: exports.config.server.ratelimit.default.duration,
    max: exports.config.server.ratelimit.default.max_requests,
    standardHeaders: true,
    skip: (req, res) => {
        exports.config.server.ratelimit.default.allowed_ips.includes(req.ip) ||
            exports.config.server.ratelimit.default.allowed_hosts.includes(req.headers.host) ||
            exports.config.server.ratelimit.default.allowed_hosts.includes(req.headers.origin);
    },
    message: async function (req, res) {
        const request_connection = req.ip || req.headers['X-Forwarded-For'] || req.socket.remoteAddress;
        (0, Logger_1.write_to_logs)("connections", `The request from ${request_connection} has been rate limited`);
        return "You're making requests way too fast, please wait 15 more minutes to come back.";
    },
});
exports.app.set('trust proxy');
exports.app.use((0, cors_1.default)(exports.config.server.cors));
exports.app.use(rateLimiter);
exports.app.use(body_parser_1.default.json({
    verify: function (req, res, buf) {
        var url = req.originalUrl;
        if (url.includes('/webhook')) {
            req.rawBody = buf.toString();
        }
    }
}));
exports.app.use(ConnectionLog_1.ConnectionMiddleware);
(0, RouteLoader_1.RouteLoader)(exports.app);
exports.app.listen(exports.config.server.port, exports.config.server.host, async () => {
    await DatabaseLoader.postgres(exports.pool);
    await DatabaseLoader.redis(exports.redis);
    (0, Logger_1.write_to_logs)('service', `Listening on ${exports.config.server.host}:${exports.config.server.port}`, true);
});
