const express = require('express');
// to enable cross-origin requests
const cors = require('cors');
// parse incoming body requests
const bodyParser = require('body-parser');
// load environment variables
require('dotenv').config({ path: '../.env' });
// import stripe and initialise with secret key
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

app.post('/webhook', bodyParser.raw({type: 'application/json'}), (request, response) => {
    const event = request.body;
    console.log(event);

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(paymentIntent);
        console.log('PaymentIntent was successful!');
        break;
      
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  
    // Return a 200 response to acknowledge receipt of the event
    response.json({received: true});
  });

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));


