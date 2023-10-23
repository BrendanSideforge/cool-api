
import express from "express";
import Stripe from "stripe";
import { config, stripe } from "..";
import { write_to_logs } from "../utils/cache/Logger";
import { createStripeCustomer, getStripeCustomer, stripeConstructEvent, updateStripeCustomersTotalCredits } from "../utils/events/Stripe";

const router: express.Router = new express.Router();

router.post("/customer/credits", async (req: express.Request, res: express.Response) => {

    const email: string = req.body.email;
    const credits: number = req.body.credits;

    await updateStripeCustomersTotalCredits(email, credits);

    res.json({
        credits: credits
    });

});

router.get("/customer/invoices/:email", async (req: express.Request, res: express.Response) => {

    const email: string = req.params.email;
    const customer: any = await getStripeCustomer(email);

    let invoices: any = [];

    try {
        // invoices = await stripe.invoices.list(customer.custxxomer_id);
    } catch(e) {
        invoices = [];

        write_to_logs(
            "stripe",
            `There wasn't any invoices listed for the customer: ${customer.customer_id} (${email})`,
            false
        )
    }

    res.json(invoices);

})

router.get("/customer/:email", async (req: express.Request, res: express.Response) => {

    const email: string = req.params.email;
    const customer = await getStripeCustomer(email);

    // console.log(customer);
    res.json(customer);

})

router.post(
    "/customer",
    async (req: express.Request, res: express.Response) => {

        const email: string = req.body.email;
        const uuid: string = req.body.uuid;

        const customer: Stripe.Customer = await stripe.customers.create({
            email: email
        });

        await createStripeCustomer(email, uuid, customer.id);

        res.json(customer);
    }
)

router.post(
    "/webhook",
    express.raw({type: 'application/json'}),
    async (req: express.Request, res: express.Response) => {

        const sig: string = req.headers['stripe-signature'];
        let event: any = stripeConstructEvent(
            req.rawBody,
            sig,
            config.stripe.webhook_secret
        );
        
        if (!event) return res.status(400).send("Stripe Webhook Error - Check logs");

        // console.log(event.type, event.data.object);

        switch(event.type) {
            case "charge.succeeded":
                console.log(event.data.object);
            case 'payment_intent.succeeded':
                // console.log(event.data.object);
                break;
            case "checkout.session.completed":
                const amount_total: number = event.data.object.amount_total;
                const amount_total_in_usd: number = amount_total / 100; // in cents
                const credits: number = amount_total_in_usd * config.stripe.credits_per_dollar;
                const generations: number = credits / 5;

                const customer_email: string = event.data.object.customer_details.email;
                const session_log_format: string = [
                    `New payment created by: ${customer_email}`,
                    `This payment was $${amount_total_in_usd} which converts to ${credits} credit(s) or ${generations} generation(s)`
                ].join("\n");

                write_to_logs(
                    "stripe",
                    session_log_format,
                    true
                );

                await updateStripeCustomersTotalCredits(customer_email, credits);
                
                break;
            default:
                // console.log(event.type);
                break;
        }

        res.send();

    }
)

export = router;
