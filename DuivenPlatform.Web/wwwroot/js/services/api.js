// API Service - handles all HTTP requests to the backend
import { API_BASE_URL } from '../config.js';

export const api = {
    async getPigeons() {
        try {
            const response = await fetch(`${API_BASE_URL}/pigeons`, {
                credentials: 'include' // Important for cookies!
            });
            if (!response.ok) throw new Error('Failed to fetch pigeons');
            return await response.json();
        } catch (error) {
            console.error('Error fetching pigeons:', error);
            throw error;
        }
    },

    async createOrder(orderData) {
        try {
            const response = await fetch(`${API_BASE_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Important for cookies!
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch {
                    errorData = { message: await response.text() };
                }

                const error = new Error('Validation failed');
                error.status = response.status;
                error.validationErrors = errorData.errors || errorData;
                throw error;
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    },

    // Authentication endpoints
    async register(userData) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Important for cookies!
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || errorData.errors?.[0] || 'Registration failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Error registering:', error);
            throw error;
        }
    },

    async login(credentials) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Important for cookies!
                body: JSON.stringify(credentials)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    },

    async logout() {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include' // Important for cookies!
            });

            if (!response.ok) {
                throw new Error('Logout failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Error logging out:', error);
            throw error;
        }
    },

    async getCurrentUser() {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                credentials: 'include' // Important for cookies!
            });

            if (!response.ok) {
                return null; // User not logged in
            }

            return await response.json();
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    }
};
