/**
 * A better way to construct a stripe event
 * @param body
 * @param sig
 * @param webhook_sec
 */
export declare function stripeConstructEvent(body: string, sig: string, webhook_sec: string): any;
/**
 * Update or remove credits from a customer on stripe
 * @param email string
 * @param credits number
 */
export declare function updateStripeCustomersTotalCredits(email: string, credits: number): Promise<void>;
/**
 * Get the stripe customer from the SQL database.
 * @param email
 * @returns
 */
export declare const getStripeCustomer: (email: string) => Promise<object>;
/**
 * Create a stripe customer in database
 * @param email - email to store
 * @param customer - their customer id to reverse match
 */
export declare function createStripeCustomer(email: string, uuid: string, customer: string): Promise<void>;
