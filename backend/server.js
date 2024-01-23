const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config({ path: '../.env' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors());
app.use(express.json());

app.use(bodyParser.json(
    {
        verify: (req, res, buf) => {
            req.rawBody = buf;
        }
    }
));

const endpointSecret = process.env.ENDPOINT;

async function checkPaymentStatus(paymentIntentId) {
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        console.log('Retrieved payment intent:', paymentIntent);

        if (paymentIntent.status === 'succeeded') {
            return { success: true };
        } else {
            return { success: false };
        }
    } catch (error) {
        console.error(`Error checking payment status: ${error.message}`);
        return { success: false, error: error.message };
    }
}

app.post('/webhooks', async (req, res) => {
    console.log(req.headers)
    const sig = req.headers['stripe-signature'];
    console.log(sig)
    try {
        console.log('Received webhook event:', req.body);
        const raw = Buffer.from(JSON.stringify(req.body), 'base64').toString('utf8');
        const event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
        //const event = await stripe.events.retrieve(req.body.id);
        console.log(event)
        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded': {
                // const email = event.data.object.receipt_email;
                console.log(`PaymentIntent was successful for!`);
                // Check payment status using the paymentIntent ID
                const paymentIntentId = event.data.object.id;
                const paymentStatus = await checkPaymentStatus(paymentIntentId);

                if (paymentStatus.success) {
                    console.log('Payment succeeded! Money is in the bank!');
                } else {
                    console.log('Payment failed or not yet completed.');
                }
                break;
            }

            case 'checkout.session.completed': {
                // const email = event.data.object.receipt_email;
                console.log(`PaymentIntent was successful for!`);

                // Check payment status using the paymentIntent ID
                const paymentIntentId = event.data.object.id;
                const paymentStatus = await checkPaymentStatus(paymentIntentId);

                if (paymentStatus.success) {
                    console.log('Payment succeeded! Money is in the bank!');
                } else {
                    console.log('Payment failed or not yet completed.');
                }

                break;
            }
            // Handle other event types as needed
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        // Return a 200 response to acknowledge receipt of the event
        res.json({ received: true });
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
});

app.post("/checkout", async (req, res) => {
    const items = req.body.items;
    let lineItems = [];
    items.forEach((item) => {
        lineItems.push({
            price: item.id,
            quantity: item.quantity
        });
    });


    try {
        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: 'payment',
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel",
        });


        res.send(JSON.stringify({
            url: session.url,
            paymentIntentId: session.payment_intent,
        }));
    } catch (error) {
        console.error("Error creating Stripe checkout session:", error);
        res.status(500).send("Internal Server Error");
    }
});


const PORT = process.env.PORT || 3001;


app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));


