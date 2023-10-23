"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = exports.SubscriptionGroup = void 0;
class SubscriptionGroup {
    constructor(raw_subscriptions) {
        this.subscriptions = [];
        this.raw_subscriptions = raw_subscriptions;
        this.create_subscriptions();
    }
    /**
     * Create subscription, meaning that it will create classes for each obj
     */
    create_subscriptions() {
        for (let i = 0; i < this.raw_subscriptions.length; i++) {
            const sub = this.raw_subscriptions[i];
            const subscription = new Subscription(sub);
            this.subscriptions.push(subscription);
        }
    }
    /**
     * Find the subscription with that ID
     * @param id
     */
    find_subscription(id) {
        const sub = this.subscriptions.filter((subscription) => {
            return subscription.type_name === id;
        });
        return sub.length > 0 ? sub[0] : null;
    }
}
exports.SubscriptionGroup = SubscriptionGroup;
class Subscription {
    constructor(raw_data) {
        // assign values to each of the class properties accordingly
        for (let i = 0; i < Object.keys(raw_data).length; i++) {
            const key = Object.keys(raw_data)[i];
            const value = raw_data[key];
            this[key] = value;
        }
    }
}
exports.Subscription = Subscription;
