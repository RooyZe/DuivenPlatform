// API Service - handles all HTTP requests to the backend
import { API_BASE_URL } from '../config.js';

export const api = {
    async getPigeons() {
        try {
            const response = await fetch(`${API_BASE_URL}/pigeons`);
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
    }
};
