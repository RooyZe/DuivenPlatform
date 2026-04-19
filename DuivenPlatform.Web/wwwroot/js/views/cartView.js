// Cart View - renders the shopping cart page
import { cartService } from '../services/cartService.js';

export function renderCartPage(navigate, updateCartBadge) {
    const cartItems = cartService.getItems();
    const total = cartService.getTotal();
    const app = document.getElementById('app');

    if (cartItems.length === 0) {
        app.innerHTML = `
            <section class="home-page">
                <div class="section-bar">
                    <h2>Winkelwagen</h2>
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
        <section class="home-page">
            <div class="section-bar">
                <h2>Winkelwagen</h2>
            </div>

            <div class="cart-container">
                <a href="#" class="cart-back-button" id="continue-shopping">
                    &lt; Verder winkelen
                </a>

                ${cartItems.map(item => `
                    <div class="cart-item-card">
                        <div class="cart-item-image-wrapper">
                            <img src="${item.imageUrl}" alt="${item.title}" class="cart-item-image" />
                        </div>
                        <div class="cart-item-details">
                            <div class="cart-item-price-bar">
                                Prijs: €${item.price.toFixed(2)}
                            </div>
                            <button class="cart-remove-button" data-id="${item.id}">Verwijder</button>
                        </div>
                    </div>
                `).join('')}

                <div class="cart-total-bar">
                    Totaal: €${total.toFixed(2)}
                </div>

                <a href="#" class="cart-checkout-button" id="go-to-checkout">
                    Afrekenen &gt;
                </a>
            </div>
        </section>
    `;

    // Event listeners
    document.getElementById('continue-shopping').addEventListener('click', (e) => {
        e.preventDefault();
        navigate('/duiven-te-koop');
    });

    document.getElementById('go-to-checkout').addEventListener('click', (e) => {
        e.preventDefault();
        navigate('/afrekenen');
    });

    document.querySelectorAll('.cart-remove-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            cartService.removeItem(id);
            renderCartPage(navigate, updateCartBadge);
            updateCartBadge();
        });
    });
}
