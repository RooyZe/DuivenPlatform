// Auth Service - manages authentication state
export const authService = {
    // Get current user from session (will check with API)
    getCurrentUser() {
        const userJson = sessionStorage.getItem('duiven_user');
        return userJson ? JSON.parse(userJson) : null;
    },

    // Set current user in session storage
    setUser(user) {
        if (user) {
            sessionStorage.setItem('duiven_user', JSON.stringify(user));
        } else {
            sessionStorage.removeItem('duiven_user');
        }
    },

    clearUser() {
        sessionStorage.removeItem('duiven_user');
    },

    isLoggedIn() {
        return this.getCurrentUser() !== null;
    },

    hasRole(role) {
        const user = this.getCurrentUser();
        return user && (user.role === role || user.Role === role);
    },

    isAdmin() {
        return this.hasRole('Admin');
    }
};
