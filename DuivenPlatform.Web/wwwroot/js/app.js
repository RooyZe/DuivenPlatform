const API_BASE_URL = 'https://localhost:7158/api';

const router = {
    currentPage: '',

    async init() {
        this.setupEventListeners();
        await this.handleRoute();
        this.updateCartBadge();
    },

    setupEventListeners() {
        const navToggle = document.getElementById('nav-toggle');
        if (navToggle) {
            navToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.openNav();
            });
        }

        const navCloseIcon = document.getElementById('nav-close-icon');
        if (navCloseIcon) {
            navCloseIcon.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeNav();
            });
        }

        const navClose = document.getElementById('nav-close');
        if (navClose) {
            navClose.addEventListener('click', () => this.closeNav());
        }

        const cartIcon = document.getElementById('cart-icon');
        if (cartIcon) {
            cartIcon.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigate('/winkelwagen');
            });
        }

        const cartIconNav = document.getElementById('cart-icon-nav');
        if (cartIconNav) {
            cartIconNav.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeNav();
                this.navigate('/winkelwagen');
            });
        }

        const navOverlay = document.getElementById('nav-overlay');
        if (navOverlay) {
            navOverlay.addEventListener('click', (e) => {
                if (e.target.tagName === 'A' && e.target.classList.contains('nav-item-large')) {
                    e.preventDefault();
                    const href = e.target.getAttribute('href');
                    this.navigate(href);
                    this.closeNav();
                }
                if (e.target.classList.contains('nav-overlay-backdrop')) {
                    this.closeNav();
                }
            });
        }

        window.addEventListener('popstate', () => this.handleRoute());
    },

    navigate(path) {
        history.pushState({}, '', path);
        this.handleRoute();
    },

    async handleRoute() {
        const path = window.location.pathname;
        const app = document.getElementById('app');

        if (path === '/' || path === '/index.html') {
            app.innerHTML = this.getHomePage();
        } else if (path === '/duiven') {
            app.innerHTML = this.getPigeonsPage();
        } else if (path === '/wedvluchten') {
            app.innerHTML = this.getRacesPage();
        } else if (path === '/duiven-te-koop') {
            await this.loadPigeonsForSale();
        } else if (path === '/winkelwagen') {
            this.loadCart();
        } else if (path === '/afrekenen') {
            this.loadCheckout();
        } else {
            app.innerHTML = '<h2>Pagina niet gevonden</h2>';
        }
    },

    openNav() {
        const overlay = document.getElementById('nav-overlay');
        if (overlay) {
            overlay.classList.add('open');
            overlay.setAttribute('aria-hidden', 'false');
        }
    },

    closeNav() {
        const overlay = document.getElementById('nav-overlay');
        if (overlay) {
            overlay.classList.remove('open');
            overlay.setAttribute('aria-hidden', 'true');
        }
    },

    getHomePage() {
        return `
            <section class="home-page">
                <div class="hero-section">
                    <img src="/images/homepage-foto.jpg" alt="Dick en Arie ten Cate" class="hero-image" />
                    <div class="hero-text">
                        <h1>Dick en Arie<br />ten Cate</h1>
                    </div>
                </div>

                <div class="section-bar">
                    <h2>Over ons</h2>
                </div>

                <div class="info-card">
                    <div class="info-card-inner">
                        <p>
                            Combinatie Ten Cate bestaat uit twee broers met een grote passie voor de
                            duivensport. Al jarenlang houden en verzorgen zij duiven en nemen zij deel
                            aan verschillende vluchten. In deze periode hebben zij veel ervaring
                            opgebouwd en meerdere goede resultaten behaald.
                            <br /><br />
                            Op het platform delen zij informatie over hun duiven, hun werkwijze en hun
                            prestaties. Bezoekers kunnen zo een duidelijk beeld krijgen van de
                            combinatie en hun passie voor de sport. Daarnaast wordt er inzicht gegeven in
                            de kwaliteit en afkomst van de duiven, zodat geïnteresseerden beter
                            geïnformeerd zijn.
                        </p>
                    </div>
                </div>
            </section>
        `;
    },

    getPigeonsPage() {
        return `
            <section class="home-page">
                <div class="section-bar">
                    <h2>Onze duiven</h2>
                </div>

                <div class="pigeons-list">
                    <article class="pigeon-card-simple">
                        <h3 class="card-title">Miss Milos</h3>
                        <div class="card-image-wrap">
                            <img src="/images/miss-milos.jpg" alt="Foto van duif Miss Milos" class="card-img" />
                        </div>
                    </article>

                    <article class="pigeon-card-simple">
                        <h3 class="card-title">Red Rose</h3>
                        <div class="card-image-wrap">
                            <img src="/images/red-rose.jpg" alt="Foto van duif Red Rose" class="card-img" />
                        </div>
                    </article>

                    <article class="pigeon-card-simple">
                        <h3 class="card-title">Blue Wonder</h3>
                        <div class="card-image-wrap">
                            <img src="/images/blue-wonder.jpg" alt="Foto van duif Blue Wonder" class="card-img" />
                        </div>
                    </article>
                </div>
            </section>
        `;
    },

    getRacesPage() {
        return `
            <section class="home-page">
                <div class="section-bar">
                    <h2>Onze vluchten</h2>
                </div>

                <div class="flight-list">
                    <article class="flight-card">
                        <div class="flight-card-inner">
                            <h3 class="flight-title">Datum: 1-3-2026 — Barcelona</h3>
                            <div class="flight-meta">
                                <div><strong>Afstand:</strong> 900 km</div>
                                <div><strong>Beste posities:</strong> 2e, 6e, 13e</div>
                            </div>
                            <div class="flight-names">
                                <strong>Duiven:</strong> Miss Milos, Milos, Red Rose
                            </div>
                        </div>
                    </article>

                    <article class="flight-card">
                        <div class="flight-card-inner">
                            <h3 class="flight-title">Datum: 1-1-2026 — Rome</h3>
                            <div class="flight-meta">
                                <div><strong>Afstand:</strong> 1100 km</div>
                                <div><strong>Beste posities:</strong> 1e, 10e, 11e</div>
                            </div>
                            <div class="flight-names">
                                <strong>Duiven:</strong> Mino, Rooie Nick, Klopo
                            </div>
                        </div>
                    </article>

                    <article class="flight-card">
                        <div class="flight-card-inner">
                            <h3 class="flight-title">Datum: 15-12-2025 — Parijs</h3>
                            <div class="flight-meta">
                                <div><strong>Afstand:</strong> 750 km</div>
                                <div><strong>Beste posities:</strong> 5e, 8e</div>
                            </div>
                            <div class="flight-names">
                                <strong>Duiven:</strong> Blue Wonder, Red Rose
                            </div>
                        </div>
                    </article>
                </div>
            </section>
        `;
    },

    async loadPigeonsForSale() {
        const app = document.getElementById('app');
        app.innerHTML = '<div class="loading">Duiven laden...</div>';

        try {
            const response = await fetch(`${API_BASE_URL}/pigeons`);
            const pigeons = await response.json();

            app.innerHTML = `
                <section class="home-page">
                    <div class="section-bar">
                        <h2>Duiven te koop</h2>
                    </div>

                    <div class="pigeons-grid">
                        ${pigeons.length > 0 ? pigeons.map(pigeon => `
                            <div class="pigeon-card-sale">
                                <img src="${pigeon.imageUrl}" alt="${pigeon.title}" class="pigeon-image" />
                                <div class="pigeon-info">
                                    <h3>${pigeon.title}</h3>
                                    ${pigeon.description ? `<p class="pigeon-description">${pigeon.description}</p>` : ''}
                                    <div class="pigeon-price">
                                        Prijs: €${pigeon.price.toFixed(2)}
                                    </div>
                                    <div class="pigeon-actions">
                                        <a href="#" class="btn btn-info">Meer informatie</a>
                                        <button type="button" class="btn btn-success add-to-cart-btn" data-id="${pigeon.id}" data-title="${pigeon.title}" data-price="${pigeon.price}" data-image="${pigeon.imageUrl}">
                                            Voeg toe!
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('') : `
                            <div class="info-card">
                                <div class="info-card-inner">
                                    <p>Geen duiven beschikbaar.</p>
                                </div>
                            </div>
                        `}
                    </div>
                </section>
            `;

            document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const pigeon = {
                        id: parseInt(e.target.dataset.id),
                        title: e.target.dataset.title,
                        price: parseFloat(e.target.dataset.price),
                        imageUrl: e.target.dataset.image
                    };
                    cart.addItem(pigeon);
                    this.updateCartBadge();
                });
            });

        } catch (error) {
            app.innerHTML = '<div class="error">Fout bij het laden van duiven</div>';
            console.error('Error loading pigeons:', error);
        }
    },

    loadCart() {
        const cartItems = cart.getItems();
        const total = cart.getTotal();
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
                            <a href="#" onclick="router.navigate('/duiven-te-koop'); return false;" class="btn btn-primary">Naar duiven te koop</a>
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
                    <a href="#" onclick="router.navigate('/duiven-te-koop'); return false;" class="cart-back-button">
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

                    <a href="#" onclick="router.navigate('/afrekenen'); return false;" class="cart-checkout-button">
                        Afrekenen &gt;
                    </a>
                </div>
            </section>
        `;

        document.querySelectorAll('.cart-remove-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                cart.removeItem(id);
                this.loadCart();
                this.updateCartBadge();
            });
        });
    },

    updateCartBadge() {
        const count = cart.getCount();

        const badge = document.getElementById('cart-count');
        if (badge) {
            if (count > 0) {
                badge.textContent = count;
                badge.style.display = 'flex';
            } else {
                badge.textContent = '';
                badge.style.display = 'none';
            }
        }

        const badgeNav = document.getElementById('cart-count-nav');
        if (badgeNav) {
            if (count > 0) {
                badgeNav.textContent = count;
                badgeNav.style.display = 'flex';
            } else {
                badgeNav.textContent = '';
                badgeNav.style.display = 'none';
            }
        }
    },

    loadCheckout() {
        const cartItems = cart.getItems();
        const total = cart.getTotal();
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
                            <a href="#" onclick="router.navigate('/duiven-te-koop'); return false;" class="btn btn-primary">Naar duiven te koop</a>
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

            const submitButton = form.querySelector('.checkout-submit-button');
            const originalText = submitButton.textContent;

            // Disable button tijdens verwerking
            submitButton.disabled = true;
            submitButton.textContent = 'Bezig met verwerken...';

            // Haal formulier data op
            const formData = new FormData(form);
            const customerName = formData.get('customerName');
            const email = formData.get('email');
            const phoneNumber = formData.get('phoneNumber');
            const address = formData.get('address');
            const paymentMethod = formData.get('payment');

            // Validatie
            if (!customerName || !email) {
                alert('Vul minimaal naam en email in');
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                return;
            }

            // Maak order object
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
                // POST naar API
                const response = await fetch(`${API_BASE_URL}/orders`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(order)
                });

                if (response.ok) {
                    const result = await response.json();

                    // Leeg winkelwagen
                    cart.clear();
                    this.updateCartBadge();

                    // Toon succesmelding
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
                                    <a href="#" onclick="router.navigate('/'); return false;" style="display: inline-block; background: #4f8fc0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 700;">Terug naar home</a>
                                </div>
                            </div>
                        </section>
                    `;
                } else {
                    const error = await response.text();
                    alert('Fout bij het plaatsen van de bestelling: ' + error);
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                }
            } catch (error) {
                console.error('Error placing order:', error);
                alert('Er ging iets mis bij het plaatsen van de bestelling. Probeer het later opnieuw.');
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });
    }
};

const cart = {
    STORAGE_KEY: 'duiven_cart',

    getItems() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    addItem(pigeon) {
        const items = this.getItems();
        const existingItem = items.find(item => item.id === pigeon.id);

        if (!existingItem) {
            items.push({
                id: pigeon.id,
                title: pigeon.title,
                price: pigeon.price,
                imageUrl: pigeon.imageUrl
            });
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
            alert(`${pigeon.title} toegevoegd aan winkelwagen!`);
        } else {
            alert(`${pigeon.title} zit al in je winkelwagen!`);
        }
    },

    removeItem(id) {
        let items = this.getItems();
        items = items.filter(item => item.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    },

    clear() {
        localStorage.removeItem(this.STORAGE_KEY);
    },

    getCount() {
        return this.getItems().length;
    },

    getTotal() {
        return this.getItems().reduce((sum, item) => sum + item.price, 0);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    router.init();
});
