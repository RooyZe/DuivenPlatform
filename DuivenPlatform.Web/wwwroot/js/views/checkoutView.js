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
                <form id="checkout-form" class="checkout-form" novalidate>
                    <!-- WCAG 2.1.1: Keyboard accessible form fields with labels -->
                    <div class="form-group">
                        <label for="customer-name" class="sr-only">Naam (verplicht)</label>
                        <input 
                            type="text" 
                            id="customer-name" 
                            name="customerName" 
                            placeholder="Naam *" 
                            required 
                            minlength="2"
                            maxlength="100"
                            aria-required="true"
                            aria-describedby="name-error"
                            class="checkout-input" 
                        />
                        <span id="name-error" class="error-message" role="alert" aria-live="polite"></span>
                    </div>

                    <div class="form-group">
                        <label for="customer-email" class="sr-only">E-mailadres (verplicht)</label>
                        <input 
                            type="email" 
                            id="customer-email" 
                            name="email" 
                            placeholder="E-Mail *" 
                            required 
                            maxlength="100"
                            aria-required="true"
                            aria-describedby="email-error"
                            class="checkout-input" 
                        />
                        <span id="email-error" class="error-message" role="alert" aria-live="polite"></span>
                    </div>

                    <div class="form-group">
                        <label for="customer-phone" class="sr-only">Telefoonnummer (optioneel)</label>
                        <input 
                            type="tel" 
                            id="customer-phone" 
                            name="phoneNumber" 
                            placeholder="Telefoonnummer" 
                            maxlength="20"
                            pattern="[0-9+\-\s()]*"
                            aria-describedby="phone-error"
                            class="checkout-input" 
                        />
                        <span id="phone-error" class="error-message" role="alert" aria-live="polite"></span>
                    </div>

                    <div class="form-group">
                        <label for="customer-address" class="sr-only">Locatie (optioneel)</label>
                        <input 
                            type="text" 
                            id="customer-address" 
                            name="address" 
                            placeholder="Locatie" 
                            maxlength="200"
                            class="checkout-input" 
                        />
                    </div>

                    <!-- WCAG 1.3.1: Proper fieldset for radio group -->
                    <fieldset class="payment-methods">
                        <legend class="sr-only">Kies een betaalmethode</legend>

                        <label class="payment-option">
                            <input type="radio" name="payment" value="ideal" checked aria-label="iDeal betaling" />
                            <span class="payment-button ideal">
                                <span class="payment-circle" aria-hidden="true">0</span>
                                <span class="payment-text">iDeal</span>
                                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Cpath fill='%23cc0066' d='M0 0h40v40H0z'/%3E%3Cpath fill='white' d='M10 10h20v20H10z'/%3E%3C/svg%3E" alt="" class="payment-logo" aria-hidden="true" />
                            </span>
                        </label>

                        <label class="payment-option">
                            <input type="radio" name="payment" value="visa" aria-label="Visa kaart betaling" />
                            <span class="payment-button visa">
                                <span class="payment-circle" aria-hidden="true">0</span>
                                <span class="payment-text">Visa Kaart</span>
                                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 32'%3E%3Crect fill='%231A1F71' width='48' height='32' rx='4'/%3E%3Ctext x='50%25' y='50%25' fill='white' font-size='12' text-anchor='middle' dy='.3em' font-weight='bold'%3EVISA%3C/text%3E%3C/svg%3E" alt="" class="payment-logo" aria-hidden="true" />
                            </span>
                        </label>

                        <label class="payment-option">
                            <input type="radio" name="payment" value="paypal" aria-label="PayPal betaling" />
                            <span class="payment-button paypal">
                                <span class="payment-circle" aria-hidden="true">0</span>
                                <span class="payment-text">Pay Pal</span>
                                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 32'%3E%3Crect fill='%23003087' width='48' height='32' rx='4'/%3E%3Ctext x='50%25' y='50%25' fill='%2300457C' font-size='10' text-anchor='middle' dy='.3em' font-weight='bold'%3EPayPal%3C/text%3E%3C/svg%3E" alt="" class="payment-logo" aria-hidden="true" />
                            </span>
                        </label>
                    </fieldset>

                    <div class="checkout-total" role="status" aria-live="polite">
                        Totaal: €${total.toFixed(2)}
                    </div>

                    <!-- General error message for non-field-specific errors -->
                    <div id="general-error" class="error-message" role="alert" aria-live="assertive" style="text-align: center; margin: 12px 0;"></div>

                    <button type="submit" class="checkout-submit-button" aria-label="Bevestig bestelling en reken af">Afrekenen</button>
                </form>
            </div>
        </section>
    `;

    // ASVS V5.1.3: Client-side validation with proper error messages
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

    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(span => span.textContent = '');

    // Get form data
    const formData = new FormData(form);
    const customerName = formData.get('customerName')?.trim();
    const email = formData.get('email')?.trim();
    const phoneNumber = formData.get('phoneNumber')?.trim();
    const address = formData.get('address')?.trim();
    const paymentMethod = formData.get('payment');

    // Client-side validation with inline error messages
    let hasErrors = false;

    if (!customerName || customerName.length < 2) {
        document.getElementById('name-error').textContent = 'Naam is verplicht (minimaal 2 karakters)';
        hasErrors = true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        document.getElementById('email-error').textContent = 'Vul een geldig emailadres in';
        hasErrors = true;
    }

    const phoneRegex = /^[0-9+\-\s()]*$/;
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
        document.getElementById('phone-error').textContent = 'Ongeldig telefoonnummer';
        hasErrors = true;
    }

    if (hasErrors) {
        return; // Stop submission
    }

    // Disable button during processing
    submitButton.disabled = true;
    submitButton.textContent = 'Bezig met verwerken...';

    // Create order object
    const order = {
        customerName: customerName,
        email: email,
        phoneNumber: phoneNumber || null,
        address: address || null,
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
        console.error('Order submission error:', error);

        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.textContent = originalText;

        // Handle validation errors from API
        if (error.status === 400 && error.validationErrors) {
            // Map server-side validation errors to form fields
            const errorMap = {
                'CustomerName': 'name-error',
                'Email': 'email-error',
                'PhoneNumber': 'phone-error',
                'TotalPrice': 'general-error'
            };

            let hasFieldError = false;

            // Loop through validation errors and display them
            for (const [field, messages] of Object.entries(error.validationErrors)) {
                const errorElementId = errorMap[field];
                if (errorElementId) {
                    const errorElement = document.getElementById(errorElementId);
                    if (errorElement) {
                        errorElement.textContent = Array.isArray(messages) ? messages[0] : messages;
                        hasFieldError = true;
                    }
                }
            }

            // If no field-specific errors were mapped, show general error
            if (!hasFieldError) {
                document.getElementById('general-error').textContent = 'Controleer de invoer en probeer opnieuw.';
            }
        } else {
            // Show generic error message for network/server errors
            document.getElementById('general-error').textContent = 'Er ging iets mis bij het plaatsen van de bestelling. Probeer het later opnieuw.';
        }
    }
}
