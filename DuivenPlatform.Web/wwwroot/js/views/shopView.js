// Shop View - renders the pigeons for sale page
import { api } from '../services/api.js';
import { cartService } from '../services/cartService.js';

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
                const pigeon = {
                    id: parseInt(e.target.dataset.id),
                    title: e.target.dataset.title,
                    price: parseFloat(e.target.dataset.price),
                    imageUrl: e.target.dataset.image
                };
                cartService.addItem(pigeon);
                updateCartBadge();
            });
        });

    } catch (error) {
        app.innerHTML = '<div class="error">Fout bij het laden van duiven</div>';
        console.error('Error loading pigeons:', error);
    }
}
