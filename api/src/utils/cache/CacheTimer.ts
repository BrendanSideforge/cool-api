
import { redis } from "..";
import { write_to_logs } from "./Logger";

export class CacheTimerGroup {

    cache_timers: Array<CacheTimer>

    constructor(
        cache_timers: Array<CacheTimer>
    ) {
        this.cache_timers = cache_timers;
    }

    get_timer(key: string, index: boolean = false): any {

        let timer: CacheTimer;
        let popIndex: number = 0;

        for (let i: number = 0; i < this.cache_timers.length; i++) {
            const cached_timer: CacheTimer = this.cache_timers[i];
            if (cached_timer.expired_identifier === key) {
                timer = cached_timer
            }
        }

        return index ? [timer, popIndex] : timer;

    }

    add_timer(timer: CacheTimer) {

        this.cache_timers.push(timer);

    }

    remove_timer(key: string) {

        const timer: any = this.get_timer(key, true);

        if (!timer[0]) {
            write_to_logs('errors', `No timer found: ${key}`, true);
            return 'No timer found';
        }

        this.cache_timers.splice(timer[1], 1);
        timer.stop_timer();

    }

}

export class CacheTimer {

    expired_timer: number = 5; // default expiration
    expired_cache_data: Function | undefined;
    expired_identifier: string = "";
    expired_cache_data_raw: any = "";
    expired_elapsed_cache_duration: Array<number> = [];
    expired_average_cache_duration: number = 0;
    pending: boolean = true;

    constructor(
        expired_timer: number,
        expired_cache_data: Function | undefined,
        expired_identifier: string
    ) {

        this.expired_timer = expired_timer;
        this.expired_identifier = expired_identifier;
        this.expired_cache_data = expired_cache_data

        this.get_cache_data();
        this.start_timer();

    }

    get_average_cache_duration() {

        const average_duration: number = (this.expired_elapsed_cache_duration.reduce((a, b) => a + b)) / this.expired_elapsed_cache_duration.length;

        this.expired_average_cache_duration = +(average_duration.toFixed(2));

    }

    async get_cache_data() {

        const elapsed_start = performance.now();
        const cache = await this.expired_cache_data();
        const elapsed_end = performance.now();
        const elapsed_duration = (elapsed_end - elapsed_start) / 1000;

        this.expired_cache_data_raw = cache;
        this.expired_elapsed_cache_duration.push(elapsed_duration);
        this.get_average_cache_duration();
    }

    async start_timer() {

        await redis.set(
            `cache-timer:${this.expired_identifier}`,
            "expired",
            "EX",
            this.expired_timer
        )
        this.pending = false;

    }

    async stop_timer() {

        await redis.delete(
            this.expired_identifier
        );

    }

    async restart() {

        this.pending = true;
        this.get_cache_data();
        this.start_timer();

    }

}
