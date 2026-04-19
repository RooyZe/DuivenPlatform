// Cart Service - manages shopping cart state in localStorage
export const cartService = {
    STORAGE_KEY: 'duiven_cart',

    getItems() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    addItem(pigeon) {
        const items = this.getItems();
        const existingItem = items.find(item => item.id === pigeon.id);

        if (!existingItem) {
            items.push({
                id: pigeon.id,
                title: pigeon.title,
                price: pigeon.price,
                imageUrl: pigeon.imageUrl
            });
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
            alert(`${pigeon.title} toegevoegd aan winkelwagen!`);
            return true;
        } else {
            alert(`${pigeon.title} zit al in je winkelwagen!`);
            return false;
        }
    },

    removeItem(id) {
        let items = this.getItems();
        items = items.filter(item => item.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    },

    clear() {
        localStorage.removeItem(this.STORAGE_KEY);
    },

    getCount() {
        return this.getItems().length;
    },

    getTotal() {
        return this.getItems().reduce((sum, item) => sum + item.price, 0);
    }
};
