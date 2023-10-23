export declare class SubscriptionGroup {
    raw_subscriptions: Array<object>;
    subscriptions: Array<Subscription>;
    constructor(raw_subscriptions: Array<object>);
    /**
     * Create subscription, meaning that it will create classes for each obj
     */
    create_subscriptions(): void;
    /**
     * Find the subscription with that ID
     * @param id
     */
    find_subscription(id: string): Subscription;
}
export declare class Subscription {
    type: number;
    price: number;
    monthly_price: number | undefined;
    portal_link: string;
    type_name: string;
    promise: string;
    pros: Array<string>;
    cons: Array<string>;
    constructor(raw_data: object);
}
