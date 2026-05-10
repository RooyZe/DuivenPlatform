// Shop View - renders the pigeons for sale page
import { api } from '../services/api.js';
import { cartService } from '../services/cartService.js';
import { authService } from '../services/authService.js';
import { router } from '../router.js';

export async function renderShopPage(updateCartBadge) {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="loading">Duiven laden...</div>';

    try {
        const pigeons = await api.getPigeons();

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

        // Attach event listeners to add-to-cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();

                // Check if user is logged in
                if (!authService.isLoggedIn()) {
                    sessionStorage.setItem('auth_message', 'Je moet ingelogd zijn om een duif te kunnen kopen.');
                    router.navigate('/register');
                    return;
                }

                // Only add to cart if logged in
                const pigeon = {
                    id: parseInt(e.target.dataset.id),
                    title: e.target.dataset.title,
                    price: parseFloat(e.target.dataset.price),
                    imageUrl: e.target.dataset.image
                };

                const added = cartService.addItem(pigeon);
                updateCartBadge();

                // Show notification based on result
                if (added) {
                    showToast(`${pigeon.title} toegevoegd aan winkelwagen!`, 'success');
                } else {
                    showToast(`${pigeon.title} zit al in je winkelwagen!`, 'info');
                }
            });
        });

    } catch (error) {
        app.innerHTML = '<div class="error">Fout bij het laden van duiven</div>';
        console.error('Error loading pigeons:', error);
    }
}

function showToast(message, type = 'success') {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}
