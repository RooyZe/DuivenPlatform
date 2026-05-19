// Admin View - Duivenbeheer voor admins
import { api } from '../services/api.js';
import { authService } from '../services/authService.js';
import { API_BASE_URL } from '../config.js';

export async function renderAdminPage(navigate) {
    // Check if user is admin
    if (!authService.isAdmin()) {
        navigate('/');
        return;
    }

    const app = document.getElementById('app');
    app.innerHTML = '<div class="loading">Duiven laden...</div>';

    try {
        const response = await fetch(`${API_BASE_URL}/pigeons`, {
            credentials: 'include'
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', response.status, errorText);
            throw new Error('Fout bij laden van duiven');
        }

        const pigeons = await response.json();

        app.innerHTML = `
            <section class="admin-page">
                <div class="section-bar">
                    <h2>Duivenbeheer</h2>
                </div>

                <div class="admin-container">
                    <!-- Add new pigeon button -->
                    <button class="admin-add-button" id="add-pigeon-btn">
                        + Nieuwe duif toevoegen
                    </button>

                    <!-- Add pigeon form (hidden by default) -->
                    <div id="add-pigeon-form" class="admin-form-container" style="display: none;">
                        <div class="admin-form-card">
                            <h3>Nieuwe duif toevoegen</h3>
                            <form id="pigeon-form" class="admin-form">
                                <div class="form-group">
                                    <label for="pigeon-title">Titel *</label>
                                    <input 
                                        type="text" 
                                        id="pigeon-title" 
                                        name="title" 
                                        required 
                                        class="admin-input"
                                        placeholder="Bijv. Blue Wonder"
                                    />
                                </div>

                                <div class="form-group">
                                    <label for="pigeon-description">Beschrijving</label>
                                    <textarea 
                                        id="pigeon-description" 
                                        name="description" 
                                        rows="4"
                                        class="admin-input"
                                        placeholder="Optionele beschrijving van de duif"
                                    ></textarea>
                                </div>

                                <div class="form-group">
                                    <label for="pigeon-price">Prijs (€) *</label>
                                    <input 
                                        type="number" 
                                        id="pigeon-price" 
                                        name="price" 
                                        required 
                                        min="0" 
                                        step="0.01"
                                        class="admin-input"
                                        placeholder="100.00"
                                    />
                                </div>

                                <div class="form-group">
                                    <label for="pigeon-image">Afbeelding URL *</label>
                                    <input 
                                        type="text" 
                                        id="pigeon-image" 
                                        name="imageUrl" 
                                        required 
                                        class="admin-input"
                                        placeholder="/images/duif.jpg"
                                    />
                                </div>

                                <div class="admin-form-actions">
                                    <button type="submit" class="admin-save-button">Opslaan</button>
                                    <button type="button" class="admin-cancel-button" id="cancel-add-btn">Annuleren</button>
                                </div>

                                <div id="form-error" class="error-message"></div>
                            </form>
                        </div>
                    </div>

                    <!-- Edit pigeon form (hidden by default) -->
                    <div id="edit-pigeon-form" class="admin-form-container" style="display: none;">
                        <div class="admin-form-card">
                            <h3>Duif aanpassen</h3>
                            <form id="edit-pigeon-form-element" class="admin-form">
                                <input type="hidden" id="edit-pigeon-id" name="id" />

                                <div class="form-group">
                                    <label for="edit-pigeon-title">Titel *</label>
                                    <input 
                                        type="text" 
                                        id="edit-pigeon-title" 
                                        name="title" 
                                        required 
                                        class="admin-input"
                                    />
                                </div>

                                <div class="form-group">
                                    <label for="edit-pigeon-description">Beschrijving</label>
                                    <textarea 
                                        id="edit-pigeon-description" 
                                        name="description" 
                                        rows="4"
                                        class="admin-input"
                                    ></textarea>
                                </div>

                                <div class="form-group">
                                    <label for="edit-pigeon-price">Prijs (€) *</label>
                                    <input 
                                        type="number" 
                                        id="edit-pigeon-price" 
                                        name="price" 
                                        required 
                                        min="0" 
                                        step="0.01"
                                        class="admin-input"
                                    />
                                </div>

                                <div class="form-group">
                                    <label for="edit-pigeon-image">Afbeelding URL *</label>
                                    <input 
                                        type="text" 
                                        id="edit-pigeon-image" 
                                        name="imageUrl" 
                                        required 
                                        class="admin-input"
                                    />
                                </div>

                                <div class="admin-form-actions">
                                    <button type="submit" class="admin-save-button">Opslaan</button>
                                    <button type="button" class="admin-cancel-button" id="cancel-edit-btn">Annuleren</button>
                                </div>

                                <div id="edit-form-error" class="error-message"></div>
                            </form>
                        </div>
                    </div>

                    <!-- Pigeons list -->
                    <div class="admin-pigeons-list">
                        ${pigeons.length > 0 ? pigeons.map(pigeon => `
                            <div class="admin-pigeon-card" data-id="${pigeon.id}">
                                <div class="admin-pigeon-info">
                                    <img src="${pigeon.imageUrl}" alt="${pigeon.title}" class="admin-pigeon-image" />
                                    <div class="admin-pigeon-details">
                                        <h3>${pigeon.title}</h3>
                                        ${pigeon.description ? `<p>${pigeon.description}</p>` : ''}
                                        <div class="admin-pigeon-price">€${pigeon.price.toFixed(2)}</div>
                                        ${pigeon.isSold ? '<span class="admin-sold-badge">Verkocht</span>' : ''}
                                    </div>
                                </div>
                                <div class="admin-pigeon-actions">
                                    <button class="admin-edit-button" data-id="${pigeon.id}">
                                        Aanpassen
                                    </button>
                                    <button class="admin-delete-button" data-id="${pigeon.id}" data-title="${pigeon.title}">
                                        Verwijderen
                                    </button>
                                </div>
                            </div>
                        `).join('') : `
                            <div class="admin-empty">
                                <p>Geen duiven gevonden.</p>
                            </div>
                        `}
                    </div>
                </div>
            </section>
        `;

        initAdminPage(navigate);

    } catch (error) {
        app.innerHTML = '<div class="error">Fout bij het laden van duiven</div>';
        console.error('Error loading pigeons:', error);
    }
}

function initAdminPage(navigate) {
    const addButton = document.getElementById('add-pigeon-btn');
    const addForm = document.getElementById('add-pigeon-form');
    const cancelButton = document.getElementById('cancel-add-btn');
    const editForm = document.getElementById('edit-pigeon-form');
    const cancelEditButton = document.getElementById('cancel-edit-btn');

    if (addButton) {
        addButton.addEventListener('click', () => {
            addForm.style.display = 'block';
            editForm.style.display = 'none';
            addButton.style.display = 'none';
        });
    }

    if (cancelButton) {
        cancelButton.addEventListener('click', () => {
            addForm.style.display = 'none';
            addButton.style.display = 'block';
            document.getElementById('pigeon-form').reset();
            document.getElementById('form-error').textContent = '';
        });
    }

    if (cancelEditButton) {
        cancelEditButton.addEventListener('click', () => {
            editForm.style.display = 'none';
            addButton.style.display = 'block';
            document.getElementById('edit-pigeon-form-element').reset();
            document.getElementById('edit-form-error').textContent = '';
        });
    }

    // Handle add pigeon form submit
    const form = document.getElementById('pigeon-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleAddPigeon(form, navigate);
        });
    }

    // Handle edit pigeon form submit
    const editFormElement = document.getElementById('edit-pigeon-form-element');
    if (editFormElement) {
        editFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleEditPigeon(editFormElement, navigate);
        });
    }

    // Handle edit buttons
    document.querySelectorAll('.admin-edit-button').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = parseInt(e.target.dataset.id);
            await showEditForm(id, navigate);
        });
    });

    // Handle delete buttons
    document.querySelectorAll('.admin-delete-button').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = parseInt(e.target.dataset.id);
            const title = e.target.dataset.title;
            await handleDeletePigeon(id, title, navigate);
        });
    });
}

async function handleAddPigeon(form, navigate) {
    const formData = new FormData(form);
    const errorDiv = document.getElementById('form-error');
    errorDiv.textContent = '';

    const pigeon = {
        title: formData.get('title').trim(),
        description: formData.get('description').trim() || null,
        price: parseFloat(formData.get('price')),
        imageUrl: formData.get('imageUrl').trim()
    };

    try {
        const response = await fetch(`${API_BASE_URL}/pigeons`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(pigeon)
        });

        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('Je hebt geen rechten om duiven toe te voegen');
            }
            throw new Error('Fout bij toevoegen van duif');
        }

        // Success - reload page
        alert('Duif succesvol toegevoegd!');
        navigate('/admin/duiven');
    } catch (error) {
        console.error('Error adding pigeon:', error);
        errorDiv.textContent = error.message || 'Er is een fout opgetreden';
    }
}

async function showEditForm(id, navigate) {
    try {
        // Fetch pigeon data
        const response = await fetch(`${API_BASE_URL}/pigeons/${id}`, {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Fout bij laden van duif');
        }

        const pigeon = await response.json();

        // Fill form with pigeon data
        document.getElementById('edit-pigeon-id').value = pigeon.id;
        document.getElementById('edit-pigeon-title').value = pigeon.title;
        document.getElementById('edit-pigeon-description').value = pigeon.description || '';
        document.getElementById('edit-pigeon-price').value = pigeon.price;
        document.getElementById('edit-pigeon-image').value = pigeon.imageUrl;

        // Show edit form, hide add form and add button
        document.getElementById('add-pigeon-form').style.display = 'none';
        document.getElementById('edit-pigeon-form').style.display = 'block';
        document.getElementById('add-pigeon-btn').style.display = 'none';

    } catch (error) {
        console.error('Error loading pigeon for edit:', error);
        alert('Fout bij laden van duif');
    }
}

async function handleEditPigeon(form, navigate) {
    const formData = new FormData(form);
    const errorDiv = document.getElementById('edit-form-error');
    errorDiv.textContent = '';

    const id = parseInt(formData.get('id'));
    const pigeon = {
        title: formData.get('title').trim(),
        description: formData.get('description').trim() || null,
        price: parseFloat(formData.get('price')),
        imageUrl: formData.get('imageUrl').trim()
    };

    try {
        const response = await fetch(`${API_BASE_URL}/pigeons/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(pigeon)
        });

        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('Je hebt geen rechten om duiven aan te passen');
            }
            throw new Error('Fout bij aanpassen van duif');
        }

        // Success - reload page
        alert('Duif succesvol aangepast!');
        navigate('/admin/duiven');
    } catch (error) {
        console.error('Error editing pigeon:', error);
        errorDiv.textContent = error.message || 'Er is een fout opgetreden';
    }
}

async function handleDeletePigeon(id, title, navigate) {
    // Show simple confirmation
    const confirmed = await showSimpleConfirm(`Weet je zeker dat je "${title}" wilt verwijderen?`);
    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/pigeons/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('Je hebt geen rechten om duiven te verwijderen');
            }
            throw new Error('Fout bij verwijderen van duif');
        }

        showToast('Duif succesvol verwijderd!', 'success');
        setTimeout(() => navigate('/admin/duiven'), 1500);
    } catch (error) {
        console.error('Error deleting pigeon:', error);
        showToast(error.message || 'Er is een fout opgetreden', 'error');
    }
}

function showToast(message, type = 'success') {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

function showSimpleConfirm(message) {
    return new Promise((resolve) => {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'simple-confirm-overlay';

        // Create box
        const box = document.createElement('div');
        box.className = 'simple-confirm-box';

        // Message
        const msg = document.createElement('p');
        msg.className = 'simple-confirm-message';
        msg.textContent = message;

        // Buttons
        const btnContainer = document.createElement('div');
        btnContainer.className = 'simple-confirm-buttons';

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Annuleren';
        cancelBtn.className = 'simple-confirm-btn simple-confirm-cancel';

        const okBtn = document.createElement('button');
        okBtn.textContent = 'OK';
        okBtn.className = 'simple-confirm-btn simple-confirm-ok';

        btnContainer.appendChild(cancelBtn);
        btnContainer.appendChild(okBtn);

        box.appendChild(msg);
        box.appendChild(btnContainer);
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        // Event handlers
        const cleanup = (result) => {
            overlay.remove();
            resolve(result);
        };

        cancelBtn.addEventListener('click', () => cleanup(false));
        okBtn.addEventListener('click', () => cleanup(true));
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) cleanup(false);
        });
    });
}
