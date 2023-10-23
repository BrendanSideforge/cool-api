import * as pg from "pg";
/**
 * Create all new tables inside the "sql" directory
 * @param pool - pg.Pool
 */
export declare function postgres(pool: pg.Pool): Promise<void>;
/**
 * sets up keyspace event notifications, i.e expired keys
 * @param redis - redisClient
 */
export declare function redis(redis: any): Promise<void>;
