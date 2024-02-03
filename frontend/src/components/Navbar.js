import { Button, Navbar } from 'react-bootstrap';
import { useContext } from 'react';
import { CartContext } from '../CartContext';


function NavbarComponent() {
    const cart = useContext(CartContext);
    const prodCounts = cart.items.reduce((sum, product) => sum + product.quantity, 0);

    const handleCheckout = async () => {
        try {
            // replace localhost with your ngrok link
            const response = await fetch('https://2a55-2402-8100-39af-6af8-389c-86bd-7d3-3a82.ngrok-free.app/checkout', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ items: cart.items })
            });

            const data = await response.json();

            if (data.url) {
                window.location.assign(data.url);
            }
        } catch (error) {
            console.error("Error during checkout:", error);
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
