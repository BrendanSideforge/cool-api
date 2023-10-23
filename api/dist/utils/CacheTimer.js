"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheTimer = exports.CacheTimerGroup = void 0;
const __1 = require("..");
const Logger_1 = require("./Logger");
class CacheTimerGroup {
    constructor(cache_timers) {
        this.cache_timers = cache_timers;
    }
    get_timer(key, index = false) {
        let timer;
        let popIndex = 0;
        for (let i = 0; i < this.cache_timers.length; i++) {
            const cached_timer = this.cache_timers[i];
            if (cached_timer.expired_identifier === key) {
                timer = cached_timer;
            }
        }
        return index ? [timer, popIndex] : timer;
    }
    add_timer(timer) {
        this.cache_timers.push(timer);
    }
    remove_timer(key) {
        const timer = this.get_timer(key, true);
        if (!timer[0]) {
            (0, Logger_1.write_to_logs)('errors', `No timer found: ${key}`, true);
            return 'No timer found';
        }
        this.cache_timers.splice(timer[1], 1);
        timer.stop_timer();
    }
}
exports.CacheTimerGroup = CacheTimerGroup;
class CacheTimer {
    constructor(expired_timer, expired_cache_data, expired_identifier) {
        this.expired_timer = 5; // default expiration
        this.expired_identifier = "";
        this.expired_cache_data_raw = "";
        this.expired_elapsed_cache_duration = [];
        this.expired_average_cache_duration = 0;
        this.pending = true;
        this.expired_timer = expired_timer;
        this.expired_identifier = expired_identifier;
        this.expired_cache_data = expired_cache_data;
        this.get_cache_data();
        this.start_timer();
    }
    get_average_cache_duration() {
        const average_duration = (this.expired_elapsed_cache_duration.reduce((a, b) => a + b)) / this.expired_elapsed_cache_duration.length;
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
        await __1.redis.set(`cache-timer:${this.expired_identifier}`, "expired", "EX", this.expired_timer);
        this.pending = false;
    }
    async stop_timer() {
        await __1.redis.delete(this.expired_identifier);
    }
    async restart() {
        this.pending = true;
        this.get_cache_data();
        this.start_timer();
    }
}
exports.CacheTimer = CacheTimer;
