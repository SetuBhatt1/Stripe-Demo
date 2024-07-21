# Ecommerce Website With Payment Integration

This project is a dynamic e-commerce website developed using React.js, Express.js, and Node.js, with styling provided by MDB React UI Kit. It includes seamless online payment integration using the Stripe API and features such as cart management, and secure checkout functionality with webhook support.

## Live Demo

- [Live Link](https://stripe-demo-flame.vercel.app/) (Hosted Frontend on Vercel and Backend on Render)

## Features

- **Responsive Design**: The website is fully responsive, providing an optimal viewing experience across a wide range of devices except the Stripe's Checkout Page.
- **Cart Management**: Users can add products to their cart, update quantities, and remove items as needed.
- **Secure Checkout**: The checkout process is secured using Stripe API, ensuring safe and reliable transactions.
- **Webhooks**: Stripe webhooks are implemented to handle post-transaction events such as payment confirmation and updates.

## Technologies Used

- **Frontend**: React.js, MDB React UI Kit
- **Backend**: Express.js, Node.js
- **Payment Integration**: Stripe API
- **Hosting**: Vercel (Frontend), Render (Backend)

## Usage

    1. Add products to the cart.
    2. Proceed to checkout and complete the payment using Stripe.
    3. Receive confirmation and view order details.

### Checkout Process

**Please note that after clicking the "Cart x items" button, it may take a few moments to process the payment.**

### Test Card Credentials

Use the following test card numbers provided by Stripe for testing the checkout process:

- **Email:** test@example.com
- **Card Number:** 4242 4242 4242 4242
- **MM/YY:** 12/34
- **CVC:** 567

You can find more test card numbers and details on the [Stripe Testing Documentation](https://stripe.com/docs/testing).
