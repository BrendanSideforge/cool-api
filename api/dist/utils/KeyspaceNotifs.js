"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyspaceNotif = void 0;
const tslib_1 = require("tslib");
const Redis = tslib_1.__importStar(require("redis"));
/**
 * Look for any events that have a key space notation for redis
 * @param e - string
 * @param r - string
 */
function KeyspaceNotif(e, r) {
    const sub_client = new Redis.createClient();
    const expired_key = `__keyevent@0__:expired`;
    sub_client.subscribe(expired_key, () => {
        sub_client.on('message', async (channel, msg) => {
            const identifier = msg.split(":")[0];
            const second_identifier = msg.split(":")[1];
            switch (identifier) {
                case "cache-timer":
                    // const timer: CacheTimer | any = CachedTimers.get_timer(second_identifier);
                    // await timer.restart();
                    // // write_to_logs("actions", `Restarted timer: ${second_identifier} (${timer.expired_timer} second(s)) with average cache performance at: (${timer.expired_average_cache_duration} second(s))`);
                    break;
                default:
                    console.log(identifier);
                    break;
            }
        });
    });
}
exports.KeyspaceNotif = KeyspaceNotif;
