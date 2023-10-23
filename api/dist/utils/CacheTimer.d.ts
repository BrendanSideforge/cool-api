export declare class CacheTimerGroup {
    cache_timers: Array<CacheTimer>;
    constructor(cache_timers: Array<CacheTimer>);
    get_timer(key: string, index?: boolean): any;
    add_timer(timer: CacheTimer): void;
    remove_timer(key: string): string;
}
export declare class CacheTimer {
    expired_timer: number;
    expired_cache_data: Function | undefined;
    expired_identifier: string;
    expired_cache_data_raw: any;
    expired_elapsed_cache_duration: Array<number>;
    expired_average_cache_duration: number;
    pending: boolean;
    constructor(expired_timer: number, expired_cache_data: Function | undefined, expired_identifier: string);
    get_average_cache_duration(): void;
    get_cache_data(): Promise<void>;
    start_timer(): Promise<void>;
    stop_timer(): Promise<void>;
    restart(): Promise<void>;
}
