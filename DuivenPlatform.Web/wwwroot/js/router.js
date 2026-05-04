// Router - handles client-side routing and navigation
import { renderHomePage } from './views/homeView.js';
import { renderPigeonsPage } from './views/pigeonsView.js';
import { renderRacesPage } from './views/racesView.js';
import { renderShopPage } from './views/shopView.js';
import { renderCartPage } from './views/cartView.js';
import { renderCheckoutPage } from './views/checkoutView.js';
import { renderAuthPage } from './views/authView.js';
import { renderAccountPage, initAccountPage } from './views/accountView.js';
import { cartService } from './services/cartService.js';
import { authService } from './services/authService.js';

export const router = {
    currentPage: '',

    async init() {
        this.setupEventListeners();
        await this.checkAuthStatus(); // Check if user is logged in
        await this.handleRoute();
        this.updateCartBadge();
    },

    setupEventListeners() {
        // Navigation toggle (hamburger menu)
        const navToggle = document.getElementById('nav-toggle');
        if (navToggle) {
            navToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.openNav();
            });
        }

        // Close navigation
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

        // Cart icon in header
        const cartIcon = document.getElementById('cart-icon');
        if (cartIcon) {
            cartIcon.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigate('/winkelwagen');
            });
        }

        // Cart icon in nav overlay
        const cartIconNav = document.getElementById('cart-icon-nav');
        if (cartIconNav) {
            cartIconNav.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeNav();
                this.navigate('/winkelwagen');
            });
        }

        // Navigation overlay links
        const navOverlay = document.getElementById('nav-overlay');
        if (navOverlay) {
            navOverlay.addEventListener('click', (e) => {
                if (e.target.tagName === 'A' && e.target.classList.contains('nav-item-large')) {
                    e.preventDefault();
                    const href = e.target.getAttribute('href');

                    // Handle logout specially
                    if (e.target.id === 'nav-logout-link') {
                        this.handleLogout();
                        return;
                    }

                    this.navigate(href);
                    this.closeNav();
                }
                if (e.target.classList.contains('nav-overlay-backdrop')) {
                    this.closeNav();
                }
            });
        }

        // User icon clicks
        const userIcon = document.getElementById('user-icon');
        if (userIcon) {
            userIcon.addEventListener('click', (e) => {
                e.preventDefault();
                if (authService.isLoggedIn()) {
                    this.navigate('/account');
                } else {
                    this.navigate('/auth');
                }
            });
        }

        const userIconNav = document.getElementById('user-icon-nav');
        if (userIconNav) {
            userIconNav.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeNav();
                if (authService.isLoggedIn()) {
                    this.handleLogout();
                } else {
                    this.navigate('/auth');
                }
            });
        }

        // Browser back/forward buttons
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
            app.innerHTML = renderHomePage();
        } else if (path === '/duiven') {
            app.innerHTML = renderPigeonsPage();
        } else if (path === '/wedvluchten') {
            app.innerHTML = renderRacesPage();
        } else if (path === '/duiven-te-koop') {
            await renderShopPage(this.updateCartBadge.bind(this));
        } else if (path === '/winkelwagen') {
            renderCartPage(this.navigate.bind(this), this.updateCartBadge.bind(this));
        } else if (path === '/afrekenen') {
            renderCheckoutPage(this.navigate.bind(this), this.updateCartBadge.bind(this));
        } else if (path === '/auth' || path === '/login' || path === '/register') {
            // Redirect to home if already logged in
            if (authService.isLoggedIn()) {
                this.navigate('/');
                return;
            }
            const activeTab = path === '/register' ? 'register' : 'login';
            renderAuthPage(this.navigate.bind(this), activeTab);
        } else if (path === '/account') {
            // Redirect to auth if not logged in
            if (!authService.isLoggedIn()) {
                this.navigate('/auth');
                return;
            }
            app.innerHTML = renderAccountPage(this.navigate.bind(this));
            initAccountPage(this.navigate.bind(this));
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

    updateCartBadge() {
        const count = cartService.getCount();

        // Header cart badge
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

        // Nav overlay cart badge
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

    async checkAuthStatus() {
        const user = await api.getCurrentUser();
        if (user) {
            authService.setUser(user);
        } else {
            authService.clearUser();
        }
        this.updateAuthUI();
    },

    updateAuthUI() {
        const isLoggedIn = authService.isLoggedIn();
        const loginLink = document.getElementById('nav-login-link');
        const logoutLink = document.getElementById('nav-logout-link');

        if (loginLink && logoutLink) {
            if (isLoggedIn) {
                loginLink.style.display = 'none';
                logoutLink.style.display = 'block';
            } else {
                loginLink.style.display = 'block';
                logoutLink.style.display = 'none';
            }
        }
    },

    async handleLogout() {
        try {
            await api.logout();
            authService.clearUser();
            this.updateAuthUI();
            this.navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
            alert('Uitloggen mislukt');
        }
    }
};
