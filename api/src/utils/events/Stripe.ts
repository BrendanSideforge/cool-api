import { config, pool, stripe } from "../.."
import { write_to_logs } from "../cache/Logger";

/**
 * A better way to construct a stripe event
 * @param body 
 * @param sig 
 * @param webhook_sec 
 */
export function stripeConstructEvent(
    body: string,
    sig: string,
    webhook_sec: string
) {

    let event: any;

    try {

        event = stripe.webhooks.constructEvent(
            body,
            sig,
            webhook_sec
        );

    } catch(err) {

        write_to_logs(
            "errors",
            `Stripe Webhook Error: ${err.message}`,
            true
        );

    }

    return event;

}

/**
 * Update or remove credits from a customer on stripe
 * @param email string
 * @param credits number
 */
export async function updateStripeCustomersTotalCredits(email: string, credits: number) {

    const customer: any = await getStripeCustomer(email);
    let new_credits: number = +customer.total_vt_credits ? +customer.total_vt_credits : +config.stripe.default_credits;

    if (credits < 0)
        new_credits -= Math.abs(credits);
    else
        new_credits += credits;

    const query: string = `
    UPDATE customers
    SET total_vt_credits=$2
    WHERE email=$1
    `;
    await pool.query(query, [email, new_credits > 0 ? new_credits : 0]);

}

/**
 * Get the stripe customer from the SQL database.
 * @param email 
 * @returns 
 */
export const getStripeCustomer = async (email: string)  => {

    const rows: Array<object> = (await pool.query("SELECT * FROM customers WHERE email=$1", [email])).rows;

    if (rows.length === 0) {
        return {}
    } else {
        return rows[0];
    }

}

/**
 * Create a stripe customer in database
 * @param email - email to store
 * @param customer - their customer id to reverse match
 */
export async function createStripeCustomer(email: string, uuid: string, customer: string) {

    const query: string = `
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
    await pool.query(query, [
        email,
        uuid,
        config.stripe.default_credits,
        customer,
        "free",
        0,
        null,
        new Date()
    ]);

}