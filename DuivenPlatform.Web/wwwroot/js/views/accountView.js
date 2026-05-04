import { authService } from '../services/authService.js';
import { api } from '../services/api.js';

export function renderAccountPage(navigate) {
    const user = authService.getCurrentUser();

    if (!user) {
        navigate('/auth');
        return '';
    }

    return `
        <div class="account-page">
            <div class="account-container">
                <div class="section-bar">
                    <h2>Mijn Account</h2>
                </div>

                <div class="account-info-card">
                    <div class="account-info-inner">
                        <div class="account-field">
                            <span class="account-label">Naam:</span>
                            <span class="account-value">${escapeHtml(user.name || '-')}</span>
                        </div>

                        <div class="account-field">
                            <span class="account-label">Email:</span>
                            <span class="account-value">${escapeHtml(user.email || '-')}</span>
                        </div>

                        <div class="account-field">
                            <span class="account-label">Telefoonnummer:</span>
                            <span class="account-value">${escapeHtml(user.phoneNumber || '-')}</span>
                        </div>

                        <div class="account-field">
                            <span class="account-label">Locatie:</span>
                            <span class="account-value">${escapeHtml(user.location || '-')}</span>
                        </div>

                        ${user.roles && user.roles.length > 0 ? `
                            <div class="account-field">
                                <span class="account-label">Rol:</span>
                                <span class="account-value">${escapeHtml(user.roles.join(', '))}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>

                <button class="account-logout-button" data-account-logout>
                    Uitloggen
                </button>

                <button class="account-back-button" data-account-back>
                    Terug naar Home
                </button>
            </div>
        </div>
    `;
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

export function initAccountPage(navigate) {
    const backButton = document.querySelector('[data-account-back]');
    if (backButton) {
        backButton.addEventListener('click', () => navigate('/'));
    }

    const logoutButton = document.querySelector('[data-account-logout]');
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                await api.logout();
                authService.clearUser();
                navigate('/');
            } catch (error) {
                console.error('Logout error:', error);
                alert('Uitloggen mislukt');
            }
        });
    }
}
