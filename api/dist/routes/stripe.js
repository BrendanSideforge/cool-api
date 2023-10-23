"use strict";
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const __1 = require("..");
const Logger_1 = require("../utils/Logger");
const Stripe_1 = require("../utils/Stripe");
const router = new express_1.default.Router();
router.post("/customer/credits", async (req, res) => {
    const email = req.body.email;
    const credits = req.body.credits;
    await (0, Stripe_1.updateStripeCustomersTotalCredits)(email, credits);
    res.json({
        credits: credits
    });
});
router.get("/customer/invoices/:email", async (req, res) => {
    const email = req.params.email;
    const customer = await (0, Stripe_1.getStripeCustomer)(email);
    let invoices = [];
    try {
        // invoices = await stripe.invoices.list(customer.custxxomer_id);
    }
    catch (e) {
        invoices = [];
        (0, Logger_1.write_to_logs)("stripe", `There wasn't any invoices listed for the customer: ${customer.customer_id} (${email})`, false);
    }
    res.json(invoices);
});
router.get("/customer/:email", async (req, res) => {
    const email = req.params.email;
    const customer = await (0, Stripe_1.getStripeCustomer)(email);
    // console.log(customer);
    res.json(customer);
});
router.post("/customer", async (req, res) => {
    const email = req.body.email;
    const uuid = req.body.uuid;
    const customer = await __1.stripe.customers.create({
        email: email
    });
    await (0, Stripe_1.createStripeCustomer)(email, uuid, customer.id);
    res.json(customer);
});
router.post("/webhook", express_1.default.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event = (0, Stripe_1.stripeConstructEvent)(req.rawBody, sig, __1.config.stripe.webhook_secret);
    if (!event)
        return res.status(400).send("Stripe Webhook Error - Check logs");
    // console.log(event.type, event.data.object);
    switch (event.type) {
        case "charge.succeeded":
            console.log(event.data.object);
        case 'payment_intent.succeeded':
            // console.log(event.data.object);
            break;
        case "checkout.session.completed":
            const amount_total = event.data.object.amount_total;
            const amount_total_in_usd = amount_total / 100; // in cents
            const credits = amount_total_in_usd * __1.config.stripe.credits_per_dollar;
            const generations = credits / 5;
            const customer_email = event.data.object.customer_details.email;
            const session_log_format = [
                `New payment created by: ${customer_email}`,
                `This payment was $${amount_total_in_usd} which converts to ${credits} credit(s) or ${generations} generation(s)`
            ].join("\n");
            (0, Logger_1.write_to_logs)("stripe", session_log_format, true);
            await (0, Stripe_1.updateStripeCustomersTotalCredits)(customer_email, credits);
            break;
        default:
            // console.log(event.type);
            break;
    }
    res.send();
});
module.exports = router;
