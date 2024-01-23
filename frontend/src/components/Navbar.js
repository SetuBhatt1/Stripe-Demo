import { Button, Navbar } from 'react-bootstrap';
import { useContext } from 'react';
import { CartContext } from '../CartContext';
// ... (other imports)

function NavbarComponent() {
    const cart = useContext(CartContext);
    const prodCounts = cart.items.reduce((sum, product) => sum + product.quantity, 0);

    const handleCheckout = async () => {
        try {
            // replace localhost with your ngrok link
            const response = await fetch('https://079f-27-121-101-112.ngrok-free.app/checkout', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ items: cart.items })
            });

            const data = await response.json();

            if (data.url) {
                window.location.assign(data.url);
                //checkPaymentStatus(data.paymentIntentId);
            }
        } catch (error) {
            console.error("Error during checkout:", error);
            // Handle errors as needed
        }
    };

    async function checkPaymentStatus(paymentIntentId) {
        try {
            // replace localhost with your ngrok link
            const response = await fetch(`http://localhost:4000/${paymentIntentId}`);
            const result = await response.json();

            if (result.success) {
                console.log('Payment succeeded! Money is in the bank!');
                handlePaymentSuccess(); // Call your function to handle success
            } else {
                console.log('Payment failed or not yet completed.');
            }
        } catch (error) {
            console.error("Error checking payment status:", error);
            // Handle errors as needed
        }
    }

    const handlePaymentSuccess = async () => {
        try {
            // replace localhost with your ngrok link
            // Trigger your webhook or perform additional actions on the frontend
            const webhookResponse = await fetch('http://localhost:4000/webhook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // You can pass any additional data needed by your backend
                body: JSON.stringify({ /* your data */ })
            });

            const webhookData = await webhookResponse.json();
            console.log('Webhook response:', webhookData);

            // Display a success message or redirect the user
            // Example: alert('Payment succeeded!');

        } catch (error) {
            console.error('Error handling payment success:', error);
            // Handle errors as needed
        }
    };

    return (
        <>
            <Navbar expand="sm">
                <Navbar.Brand href='/'><h1>MyStore</h1></Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className='justify-content-end'>
                    <Button onClick={handleCheckout}>Cart {prodCounts} Items</Button>
                </Navbar.Collapse>
            </Navbar>
        </>
    );
}

export default NavbarComponent;
