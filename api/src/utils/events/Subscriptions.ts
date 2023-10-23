
export class SubscriptionGroup {

    raw_subscriptions: Array<object>
    subscriptions: Array<Subscription> = [];

    constructor(
        raw_subscriptions: Array<object>
    ) {

        this.raw_subscriptions = raw_subscriptions;

        this.create_subscriptions();

    }

    /**
     * Create subscription, meaning that it will create classes for each obj
     */
    create_subscriptions() {

        for (let i: number = 0; i < this.raw_subscriptions.length; i++) {

            const sub: object = this.raw_subscriptions[i];
            const subscription: Subscription = new Subscription(sub);

            this.subscriptions.push(subscription);

        }

    }

    /**
     * Find the subscription with that ID
     * @param id 
     */
    find_subscription(id: string) {

        const sub: Array<Subscription> = this.subscriptions.filter((subscription: Subscription) => {

            return subscription.type_name === id;

        });

        return sub.length > 0 ? sub[0] : null;

    }

}

export class Subscription {

    type: number;
    price: number;
    monthly_price: number | undefined;
    portal_link: string;
    type_name: string;
    promise: string;
    pros: Array<string>;
    cons: Array<string>;

    constructor(
        raw_data: object
    ) {

        // assign values to each of the class properties accordingly
        for (let i: number = 0; i < Object.keys(raw_data).length; i++) {
            const key: string = Object.keys(raw_data)[i];
            const value: string = raw_data[key];

            this[key] = value;
        }

    }

}
