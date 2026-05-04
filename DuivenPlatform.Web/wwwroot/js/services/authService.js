// Auth Service - manages authentication state
export const authService = {
    // Get current user from session (will check with API)
    getCurrentUser() {
        // User state is managed by cookies on backend
        // We just need to know if user is logged in
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

    // Clear user data (logout)
    clearUser() {
        sessionStorage.removeItem('duiven_user');
    },

    // Check if user is logged in
    isLoggedIn() {
        return this.getCurrentUser() !== null;
    },

    // Check if user has specific role
    hasRole(role) {
        const user = this.getCurrentUser();
        return user && user.role === role;
    },

    // Check if user is admin
    isAdmin() {
        return this.hasRole('Admin');
    }
};
