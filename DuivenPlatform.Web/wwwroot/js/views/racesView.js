// Races View - renders the races/flights page
export function renderRacesPage() {
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
}
