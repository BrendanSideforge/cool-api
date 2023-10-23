
import * as pg from "pg";
import * as fs from "fs";
import * as utils from "util";

import { KeyspaceNotif } from "../events/KeyspaceNotifs";
import { write_to_logs } from "../cache/Logger";

/**
 * Create all new tables inside the "sql" directory
 * @param pool - pg.Pool
 */
export async function postgres(pool: pg.Pool): Promise<void> {

    fs.readdir("./sql", async (err: any, filenames: Array<string>) => {
        if (err) return console.error(err);

        filenames.forEach(async (filename: string) => {
            fs.readFile(`./sql/${filename}`, async (err: any, content: any) => {
                if (err) return console.error(err);

                try {
                    await pool.query(content.toString());
                    // console.info(`[TABLE CREATED] ${filename}`)
                    write_to_logs('service', `${filename} database table has been created.`, true);
                } catch(e) {

                    write_to_logs('errors', `${filename} database table has an error: \n${e}`, true)

                }

            });
        });

    })

}

/**
 * sets up keyspace event notifications, i.e expired keys
 * @param redis - redisClient
 */
export async function redis(redis): Promise<void> {

    redis.get = utils.promisify(redis.get);
    redis.smembers = utils.promisify(redis.smembers);
    redis.config("SET", "notify-keyspace-events", "Ex");

    // console.info("[REDIS] Created keyspace event notifications, and promisified methods.")
    write_to_logs('service', 'Redis connection has been established.', true);

}
