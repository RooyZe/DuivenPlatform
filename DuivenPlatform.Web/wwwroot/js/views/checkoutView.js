// Checkout View - renders the checkout page and handles order submission
import { cartService } from '../services/cartService.js';
import { api } from '../services/api.js';

export function renderCheckoutPage(navigate, updateCartBadge) {
    const cartItems = cartService.getItems();
    const total = cartService.getTotal();
    const app = document.getElementById('app');

    if (cartItems.length === 0) {
        app.innerHTML = `
            <section class="home-page">
                <div class="section-bar">
                    <h2>Afrekenen</h2>
                </div>
                <div class="info-card">
                    <div class="info-card-inner">
                        <p>Je winkelwagen is leeg.</p>
                        <a href="#" onclick="event.preventDefault(); window.router.navigate('/duiven-te-koop');" class="btn btn-primary">Naar duiven te koop</a>
                    </div>
                </div>
            </section>
        `;
        return;
    }

    app.innerHTML = `
        <section class="checkout-page">
            <div class="section-bar">
                <h2>Afrekenen</h2>
            </div>

            <div class="checkout-container">
                <form id="checkout-form" class="checkout-form">
                    <input type="text" id="customer-name" name="customerName" placeholder="Naam" required class="checkout-input" />
                    <input type="email" id="customer-email" name="email" placeholder="E-Mail" required class="checkout-input" />
                    <input type="tel" id="customer-phone" name="phoneNumber" placeholder="Telefoonnummer" class="checkout-input" />
                    <input type="text" id="customer-address" name="address" placeholder="Locatie" class="checkout-input" />

                    <div class="payment-methods">
                        <label class="payment-option">
                            <input type="radio" name="payment" value="ideal" checked />
                            <span class="payment-button ideal">
                                <span class="payment-circle">0</span>
                                <span class="payment-text">iDeal</span>
                                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Cpath fill='%23cc0066' d='M0 0h40v40H0z'/%3E%3Cpath fill='white' d='M10 10h20v20H10z'/%3E%3C/svg%3E" alt="iDeal" class="payment-logo" />
                            </span>
                        </label>

                        <label class="payment-option">
                            <input type="radio" name="payment" value="visa" />
                            <span class="payment-button visa">
                                <span class="payment-circle">0</span>
                                <span class="payment-text">Visa Kaart</span>
                                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 32'%3E%3Crect fill='%231A1F71' width='48' height='32' rx='4'/%3E%3Ctext x='50%25' y='50%25' fill='white' font-size='12' text-anchor='middle' dy='.3em' font-weight='bold'%3EVISA%3C/text%3E%3C/svg%3E" alt="Visa" class="payment-logo" />
                            </span>
                        </label>

                        <label class="payment-option">
                            <input type="radio" name="payment" value="paypal" />
                            <span class="payment-button paypal">
                                <span class="payment-circle">0</span>
                                <span class="payment-text">Pay Pal</span>
                                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 32'%3E%3Crect fill='%23003087' width='48' height='32' rx='4'/%3E%3Ctext x='50%25' y='50%25' fill='%2300457C' font-size='10' text-anchor='middle' dy='.3em' font-weight='bold'%3EPayPal%3C/text%3E%3C/svg%3E" alt="PayPal" class="payment-logo" />
                            </span>
                        </label>
                    </div>

                    <div class="checkout-total">
                        Totaal: €${total.toFixed(2)}
                    </div>

                    <button type="submit" class="checkout-submit-button">Afrekenen</button>
                </form>
            </div>
        </section>
    `;

    // Checkout form submit handler
    const form = document.getElementById('checkout-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleCheckoutSubmit(form, cartItems, total, navigate, updateCartBadge);
    });
}

async function handleCheckoutSubmit(form, cartItems, total, navigate, updateCartBadge) {
    const submitButton = form.querySelector('.checkout-submit-button');
    const originalText = submitButton.textContent;

    // Disable button during processing
    submitButton.disabled = true;
    submitButton.textContent = 'Bezig met verwerken...';

    // Get form data
    const formData = new FormData(form);
    const customerName = formData.get('customerName');
    const email = formData.get('email');
    const phoneNumber = formData.get('phoneNumber');
    const address = formData.get('address');
    const paymentMethod = formData.get('payment');

    // Validation
    if (!customerName || !email) {
        alert('Vul minimaal naam en email in');
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        return;
    }

    // Create order object
    const order = {
        customerName: customerName,
        email: email,
        phoneNumber: phoneNumber || '',
        address: address || '',
        totalPrice: total,
        orderItems: cartItems.map(item => ({
            pigeonId: item.id,
            pigeonTitle: item.title,
            price: item.price
        }))
    };

    try {
        const result = await api.createOrder(order);

        // Clear cart
        cartService.clear();
        updateCartBadge();

        // Show success message
        const app = document.getElementById('app');
        app.innerHTML = `
            <section class="home-page">
                <div class="section-bar">
                    <h2>Bestelling Geplaatst!</h2>
                </div>
                <div class="info-card">
                    <div class="info-card-inner">
                        <p style="margin-bottom: 12px;">✅ Je bestelling is succesvol geplaatst!</p>
                        <p style="margin-bottom: 12px;"><strong>Order nummer:</strong> ${result.id}</p>
                        <p style="margin-bottom: 12px;"><strong>Totaal:</strong> €${result.totalPrice.toFixed(2)}</p>
                        <p style="margin-bottom: 12px;"><strong>Betaalmethode:</strong> ${paymentMethod}</p>
                        <p style="margin-bottom: 20px;">Je ontvangt een bevestigingsmail op ${email}</p>
                        <a href="#" onclick="event.preventDefault(); window.router.navigate('/');" style="display: inline-block; background: #4f8fc0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 700;">Terug naar home</a>
                    </div>
                </div>
            </section>
        `;
    } catch (error) {
        alert('Er ging iets mis bij het plaatsen van de bestelling. Probeer het later opnieuw.');
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
}
