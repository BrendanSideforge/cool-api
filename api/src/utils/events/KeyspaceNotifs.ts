
import * as Redis from "redis";
// import { CachedTimers, redis } from "../index";
import { CacheTimer } from "../cache/CacheTimer";
import { write_to_logs } from "../cache/Logger";

/**
 * Look for any events that have a key space notation for redis
 * @param e - string 
 * @param r - string
 */
export function KeyspaceNotif(e: any, r: any): void {

    const sub_client: Redis.createClient = new Redis.createClient();
    const expired_key: string = `__keyevent@0__:expired`;

    sub_client.subscribe(expired_key, () => {
        sub_client.on('message', async (channel: string, msg: string | any) => {
            
            const identifier: string = msg.split(":")[0];
            const second_identifier: string = msg.split(":")[1];

            switch(identifier) {
                case "cache-timer":

                    // const timer: CacheTimer | any = CachedTimers.get_timer(second_identifier);
                    // await timer.restart();
                    // // write_to_logs("actions", `Restarted timer: ${second_identifier} (${timer.expired_timer} second(s)) with average cache performance at: (${timer.expired_average_cache_duration} second(s))`);

                    break;

                default:
                    console.log(identifier);
                    break;
            }

        })
    });

}
