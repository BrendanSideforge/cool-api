"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStripeCustomer = exports.getStripeCustomer = exports.updateStripeCustomersTotalCredits = exports.stripeConstructEvent = void 0;
const __1 = require("..");
const Logger_1 = require("./Logger");
/**
 * A better way to construct a stripe event
 * @param body
 * @param sig
 * @param webhook_sec
 */
function stripeConstructEvent(body, sig, webhook_sec) {
    let event;
    try {
        event = __1.stripe.webhooks.constructEvent(body, sig, webhook_sec);
    }
    catch (err) {
        (0, Logger_1.write_to_logs)("errors", `Stripe Webhook Error: ${err.message}`, true);
    }
    return event;
}
exports.stripeConstructEvent = stripeConstructEvent;
/**
 * Update or remove credits from a customer on stripe
 * @param email string
 * @param credits number
 */
async function updateStripeCustomersTotalCredits(email, credits) {
    const customer = await (0, exports.getStripeCustomer)(email);
    let new_credits = +customer.total_vt_credits ? +customer.total_vt_credits : +__1.config.stripe.default_credits;
    if (credits < 0)
        new_credits -= Math.abs(credits);
    else
        new_credits += credits;
    const query = `
    UPDATE customers
    SET total_vt_credits=$2
    WHERE email=$1
    `;
    await __1.pool.query(query, [email, new_credits > 0 ? new_credits : 0]);
}
exports.updateStripeCustomersTotalCredits = updateStripeCustomersTotalCredits;
/**
 * Get the stripe customer from the SQL database.
 * @param email
 * @returns
 */
const getStripeCustomer = async (email) => {
    const rows = (await __1.pool.query("SELECT * FROM customers WHERE email=$1", [email])).rows;
    if (rows.length === 0) {
        return {};
    }
    else {
        return rows[0];
    }
};
exports.getStripeCustomer = getStripeCustomer;
/**
 * Create a stripe customer in database
 * @param email - email to store
 * @param customer - their customer id to reverse match
 */
async function createStripeCustomer(email, uuid, customer) {
    const query = `
        INSERT INTO customers (
            email,
            uuid,
            total_vt_credits,
            customer_id,
            plan,
            currency,
            next_bill_date,
            created_at
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8
        )
    `;
    await __1.pool.query(query, [
        email,
        uuid,
        __1.config.stripe.default_credits,
        customer,
        "free",
        0,
        null,
        new Date()
    ]);
}
exports.createStripeCustomer = createStripeCustomer;
