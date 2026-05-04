// Auth View - renders login/register page with tabs
import { api } from '../services/api.js';
import { authService } from '../services/authService.js';

export function renderAuthPage(navigate, activeTab = 'login') {
    const app = document.getElementById('app');

    // Check for auth message in sessionStorage
    const authMessage = sessionStorage.getItem('auth_message');
    const messageHtml = authMessage ? `
        <div class="auth-message-notification" id="auth-notification">
            <p>${authMessage}</p>
        </div>
    ` : '';

    app.innerHTML = `
        <section class="auth-page">
            <div class="section-bar">
                <h2>Login/registreer</h2>
            </div>

            ${messageHtml}

            <div class="auth-container">
                <!-- Tab buttons -->
                <div class="auth-tabs">
                    <button 
                        id="login-tab" 
                        class="auth-tab ${activeTab === 'login' ? 'active' : ''}"
                        aria-selected="${activeTab === 'login'}"
                    >
                        Login
                    </button>
                    <button 
                        id="register-tab" 
                        class="auth-tab ${activeTab === 'register' ? 'active' : ''}"
                        aria-selected="${activeTab === 'register'}"
                    >
                        Registreer
                    </button>
                </div>

                <!-- Login Form -->
                <div id="login-form-container" class="auth-form-container ${activeTab === 'login' ? 'active' : ''}">
                    <form id="login-form" class="auth-form">
                        <div class="form-group">
                            <label for="login-email" class="sr-only">E-mail</label>
                            <input 
                                type="email" 
                                id="login-email" 
                                name="email" 
                                placeholder="E-mail" 
                                required 
                                class="auth-input"
                            />
                            <span id="login-email-error" class="error-message"></span>
                        </div>

                        <div class="form-group">
                            <label for="login-password" class="sr-only">Password</label>
                            <input 
                                type="password" 
                                id="login-password" 
                                name="password" 
                                placeholder="Password" 
                                required 
                                minlength="6"
                                class="auth-input"
                            />
                            <span id="login-password-error" class="error-message"></span>
                        </div>

                        <div id="login-general-error" class="error-message" style="text-align: center; margin: 12px 0;"></div>

                        <a href="#" class="forgot-password" onclick="event.preventDefault(); alert('Forgot password functionaliteit komt later');">
                            Forgot Password?
                        </a>

                        <button type="submit" class="auth-submit-button">Login</button>
                    </form>
                </div>

                <!-- Register Form -->
                <div id="register-form-container" class="auth-form-container ${activeTab === 'register' ? 'active' : ''}">
                    <form id="register-form" class="auth-form">
                        <div class="form-group">
                            <label for="register-name" class="sr-only">Naam</label>
                            <input 
                                type="text" 
                                id="register-name" 
                                name="name" 
                                placeholder="Naam" 
                                required 
                                minlength="2"
                                maxlength="100"
                                class="auth-input"
                            />
                            <span id="register-name-error" class="error-message"></span>
                        </div>

                        <div class="form-group">
                            <label for="register-email" class="sr-only">E-Mail</label>
                            <input 
                                type="email" 
                                id="register-email" 
                                name="email" 
                                placeholder="E-Mail" 
                                required 
                                class="auth-input"
                            />
                            <span id="register-email-error" class="error-message"></span>
                        </div>

                        <div class="form-group">
                            <label for="register-phone" class="sr-only">Telefoonnummer</label>
                            <input 
                                type="tel" 
                                id="register-phone" 
                                name="phoneNumber" 
                                placeholder="Telefoonnummer" 
                                pattern="[0-9+\-\s()]*"
                                class="auth-input"
                            />
                            <span id="register-phone-error" class="error-message"></span>
                        </div>

                        <div class="form-group">
                            <label for="register-location" class="sr-only">Locatie</label>
                            <input 
                                type="text" 
                                id="register-location" 
                                name="location" 
                                placeholder="Locatie" 
                                maxlength="200"
                                class="auth-input"
                            />
                            <span id="register-location-error" class="error-message"></span>
                        </div>

                        <div class="form-group">
                            <label for="register-password" class="sr-only">Wachtwoord</label>
                            <input 
                                type="password" 
                                id="register-password" 
                                name="password" 
                                placeholder="Wachtwoord" 
                                required 
                                minlength="6"
                                class="auth-input"
                            />
                            <span id="register-password-error" class="error-message"></span>
                        </div>

                        <div class="form-group">
                            <label for="register-confirm-password" class="sr-only">Herhaal wachtwoord</label>
                            <input 
                                type="password" 
                                id="register-confirm-password" 
                                name="confirmPassword" 
                                placeholder="Herhaal wachtwoord" 
                                required 
                                minlength="6"
                                class="auth-input"
                            />
                            <span id="register-confirm-password-error" class="error-message"></span>
                        </div>

                        <div id="register-general-error" class="error-message" style="text-align: center; margin: 12px 0;"></div>

                        <a href="#" class="already-account" onclick="event.preventDefault(); document.getElementById('login-tab').click();">
                            Ik heb al een account
                        </a>

                        <button type="submit" class="auth-submit-button">Registreer</button>
                    </form>
                </div>
            </div>
        </section>
    `;

    // Clear the auth message from sessionStorage
    if (authMessage) {
        sessionStorage.removeItem('auth_message');

        // Auto-hide notification after 5 seconds
        setTimeout(() => {
            const notification = document.getElementById('auth-notification');
            if (notification) {
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    // Setup tab switching
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginFormContainer = document.getElementById('login-form-container');
    const registerFormContainer = document.getElementById('register-form-container');

    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginFormContainer.classList.add('active');
        registerFormContainer.classList.remove('active');
    });

    registerTab.addEventListener('click', () => {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerFormContainer.classList.add('active');
        loginFormContainer.classList.remove('active');
    });

    // Setup form handlers
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleLogin(loginForm, navigate);
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleRegister(registerForm, navigate);
    });
}

async function handleLogin(form, navigate) {
    const submitButton = form.querySelector('.auth-submit-button');
    const originalText = submitButton.textContent;

    document.querySelectorAll('.error-message').forEach(span => span.textContent = '');

    const formData = new FormData(form);
    const email = formData.get('email')?.trim();
    const password = formData.get('password');

    // Client-side validation
    let hasErrors = false;

    if (!email || !email.includes('@')) {
        document.getElementById('login-email-error').textContent = 'Geldig e-mailadres is verplicht';
        hasErrors = true;
    }

    if (!password || password.length < 6) {
        document.getElementById('login-password-error').textContent = 'Wachtwoord moet minimaal 6 karakters zijn';
        hasErrors = true;
    }

    if (hasErrors) {
        return;
    }

    // Disable submit button
    submitButton.disabled = true;
    submitButton.textContent = 'Inloggen...';

    try {
        const user = await api.login({ email, password });
        authService.setUser(user);

        // Redirect to home
        navigate('/');
    } catch (error) {
        console.error('Login error:', error);

        const generalError = document.getElementById('login-general-error');
        generalError.textContent = error.message || 'Inloggen mislukt. Controleer je gegevens.';

        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
}

async function handleRegister(form, navigate) {
    const submitButton = form.querySelector('.auth-submit-button');
    const originalText = submitButton.textContent;

    document.querySelectorAll('.error-message').forEach(span => span.textContent = '');

    // Get form data
    const formData = new FormData(form);
    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const phoneNumber = formData.get('phoneNumber')?.trim();
    const location = formData.get('location')?.trim();
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    // Client-side validation
    let hasErrors = false;

    if (!name || name.length < 2) {
        document.getElementById('register-name-error').textContent = 'Naam is verplicht (minimaal 2 karakters)';
        hasErrors = true;
    }

    if (!email || !email.includes('@')) {
        document.getElementById('register-email-error').textContent = 'Geldig e-mailadres is verplicht';
        hasErrors = true;
    }

    if (!password || password.length < 6) {
        document.getElementById('register-password-error').textContent = 'Wachtwoord moet minimaal 6 karakters zijn';
        hasErrors = true;
    }

    if (password !== confirmPassword) {
        document.getElementById('register-confirm-password-error').textContent = 'Wachtwoorden komen niet overeen';
        hasErrors = true;
    }

    if (hasErrors) {
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Registreren...';

    try {
        const user = await api.register({
            name,
            email,
            phoneNumber: phoneNumber || null,
            location: location || null,
            password,
            confirmPassword
        });

        authService.setUser(user);

        navigate('/');
    } catch (error) {
        console.error('Register error:', error);

        const generalError = document.getElementById('register-general-error');
        if (error.message.includes('Email')) {
            generalError.textContent = 'Dit e-mailadres is al in gebruik';
        } else {
            generalError.textContent = error.message || 'Registratie mislukt. Probeer het opnieuw.';
        }

        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
}
