const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "../.env" });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

app.post("/checkout", async (req, res) => {
  const items = req.body.items;
  let lineItems = items.map((item) => ({
    price: item.id,
    quantity: item.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    res.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const webhookEndpointPath = "/webhook";
const endpointSecret = process.env.WEBHOOK_SECRET;

app.post(
  webhookEndpointPath,
  express.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];
    let eventType;
    let data;

    try {
      // Verify the webhook signature
      const verifiedEvent = stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        endpointSecret
      );

      // Handle the verified event
      data = verifiedEvent.data.object;
      eventType = verifiedEvent.type;

      // Return a response to acknowledge receipt of the event
      res.json({ received: true });
    } catch (error) {
      console.error("Error handling webhook:", error);
      res.status(400).json({ error: "Webhook Error" });
    }

    // Now you can use 'data' and 'eventType' in your logic
    if (eventType === "checkout.session.completed") {
      console.log("Checkout session completed:", data);
      // Handle checkout session completed event
    }
  }
);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
