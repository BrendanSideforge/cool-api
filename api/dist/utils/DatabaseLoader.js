"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = exports.postgres = void 0;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const utils = tslib_1.__importStar(require("util"));
const Logger_1 = require("./Logger");
/**
 * Create all new tables inside the "sql" directory
 * @param pool - pg.Pool
 */
async function postgres(pool) {
    fs.readdir("./sql", async (err, filenames) => {
        if (err)
            return console.error(err);
        filenames.forEach(async (filename) => {
            fs.readFile(`./sql/${filename}`, async (err, content) => {
                if (err)
                    return console.error(err);
                try {
                    await pool.query(content.toString());
                    // console.info(`[TABLE CREATED] ${filename}`)
                    (0, Logger_1.write_to_logs)('service', `${filename} database table has been created.`, true);
                }
                catch (e) {
                    (0, Logger_1.write_to_logs)('errors', `${filename} database table has an error: \n${e}`, true);
                }
            });
        });
    });
}
exports.postgres = postgres;
/**
 * sets up keyspace event notifications, i.e expired keys
 * @param redis - redisClient
 */
async function redis(redis) {
    redis.get = utils.promisify(redis.get);
    redis.smembers = utils.promisify(redis.smembers);
    redis.config("SET", "notify-keyspace-events", "Ex");
    // console.info("[REDIS] Created keyspace event notifications, and promisified methods.")
    (0, Logger_1.write_to_logs)('service', 'Redis connection has been established.', true);
}
exports.redis = redis;
