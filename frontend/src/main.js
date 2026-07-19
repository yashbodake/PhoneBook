// main.js — Phonebook Pro redesigned UI/UX
const { createApp } = Vue;

// --------------------------------------------------------
// Toast notification system
// --------------------------------------------------------
const ToastContainer = {
    name: 'ToastContainer',
    data() {
        return {
            toasts: []
        };
    },
    methods: {
        addToast(message, type = 'info', duration = 4000) {
            const id = Date.now() + Math.random();
            const toast = { id, message, type };
            this.toasts.push(toast);
            setTimeout(() => {
                this.removeToast(id);
            }, duration);
        },
        removeToast(id) {
            this.toasts = this.toasts.filter(t => t.id !== id);
        }
    },
    template: `
        <div class="toast-container" role="region" aria-live="polite" aria-label="Notifications">
            <div
                v-for="toast in toasts"
                :key="toast.id"
                class="toast-item"
                :class="'toast-' + toast.type"
                role="status"
            >
                <i class="bi" :class="{
                    'bi-check-circle-fill': toast.type === 'success',
                    'bi-exclamation-circle-fill': toast.type === 'error',
                    'bi-info-circle-fill': toast.type === 'info'
                }" aria-hidden="true"></i>
                <span>{{ toast.message }}</span>
            </div>
        </div>
    `
};

// --------------------------------------------------------
// ContactList Component
// --------------------------------------------------------
const ContactList = {
    name: 'ContactList',
    props: ['contacts'],
    emits: ['load-contacts', 'view-contact', 'add-contact'],
    data() {
        return {
            currentPage: 1,
            itemsPerPage: 9
        };
    },
    computed: {
        totalPages() {
            return Math.max(1, Math.ceil(this.contacts.length / this.itemsPerPage));
        },
        paginatedContacts() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            return this.contacts.slice(start, start + this.itemsPerPage);
        }
    },
    watch: {
        contacts() {
            this.currentPage = 1;
        }
    },
    mounted() {
        this.$emit('load-contacts');
    },
    methods: {
        changePage(page) {
            if (page >= 1 && page <= this.totalPages && page !== '...') {
                this.currentPage = page;
            }
        },
        getVisiblePages() {
            const pages = [];
            const total = this.totalPages;
            const current = this.currentPage;

            if (total <= 5) {
                for (let i = 1; i <= total; i++) pages.push(i);
                return pages;
            }

            pages.push(1);
            if (current > 3) pages.push('...');
            for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
                pages.push(i);
            }
            if (current < total - 2) pages.push('...');
            if (total > 1) pages.push(total);
            return pages;
        },
        getInitials(name) {
            if (!name) return '?';
            return name.charAt(0).toUpperCase();
        }
    },
    template: `
        <div class="contact-list">
            <div class="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center gap-2 mb-4">
                <div>
                    <h1 class="h3 fw-bold mb-1" style="color: var(--color-foreground);">My Contacts</h1>
                    <p class="text-muted-custom mb-0">
                        {{ contacts.length }} contact{{ contacts.length !== 1 ? 's' : '' }}
                    </p>
                </div>
                <button @click="$emit('add-contact')" class="btn-custom btn-primary-custom">
                    <i class="bi bi-person-plus" aria-hidden="true"></i>
                    Add Contact
                </button>
            </div>

            <div class="row g-4">
                <div
                    v-for="(contact, index) in paginatedContacts"
                    :key="contact.id"
                    class="col-lg-4 col-md-6 stagger-item"
                    :style="{ animationDelay: (index * 0.05) + 's' }"
                >
                    <div
                        class="card-custom clickable h-100"
                        @click="$emit('view-contact', contact.id)"
                        role="button"
                        tabindex="0"
                        @keydown.enter="$emit('view-contact', contact.id)"
                        :aria-label="'View details for ' + contact.name"
                    >
                        <div class="card-body p-4">
                            <div class="d-flex align-items-center mb-3">
                                <div class="avatar avatar-md me-3">
                                    {{ getInitials(contact.name) }}
                                </div>
                                <div class="min-w-0">
                                    <h5 class="fw-bold mb-0 text-truncate" style="color: var(--color-foreground);">{{ contact.name }}</h5>
                                    <small class="text-muted-custom">Contact</small>
                                </div>
                            </div>
                            <div class="d-flex align-items-center text-muted-custom mb-2">
                                <i class="bi bi-telephone me-2" aria-hidden="true"></i>
                                <span class="text-truncate">{{ contact.phone_number }}</span>
                            </div>
                            <div v-if="contact.email" class="d-flex align-items-center text-muted-custom mb-2">
                                <i class="bi bi-envelope me-2" aria-hidden="true"></i>
                                <span class="text-truncate">{{ contact.email }}</span>
                            </div>
                            <div v-if="contact.address" class="d-flex align-items-start text-muted-custom">
                                <i class="bi bi-geo-alt me-2 mt-1" aria-hidden="true"></i>
                                <span class="text-truncate" style="white-space: normal; line-height: 1.4;">{{ contact.address }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="contacts.length > itemsPerPage" class="d-flex justify-content-center mt-4">
                <nav aria-label="Contact pagination">
                    <ul class="pagination-custom">
                        <li>
                            <button
                                class="page-btn"
                                @click="changePage(currentPage - 1)"
                                :disabled="currentPage === 1"
                                aria-label="Previous page"
                            >
                                <i class="bi bi-chevron-left" aria-hidden="true"></i>
                            </button>
                        </li>
                        <li v-for="(pageNum, idx) in getVisiblePages()" :key="pageNum + '-' + idx">
                            <button
                                v-if="pageNum !== '...'"
                                class="page-btn"
                                :class="{ active: currentPage === pageNum }"
                                @click="changePage(pageNum)"
                                :aria-label="'Page ' + pageNum"
                                :aria-current="currentPage === pageNum ? 'page' : null"
                            >
                                {{ pageNum }}
                            </button>
                            <span v-else class="page-ellipsis" aria-hidden="true">…</span>
                        </li>
                        <li>
                            <button
                                class="page-btn"
                                @click="changePage(currentPage + 1)"
                                :disabled="currentPage === totalPages"
                                aria-label="Next page"
                            >
                                <i class="bi bi-chevron-right" aria-hidden="true"></i>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            <div v-if="contacts.length === 0" class="empty-state">
                <div class="empty-state-icon">
                    <i class="bi bi-people" aria-hidden="true"></i>
                </div>
                <h2 class="h4 fw-bold mb-2" style="color: var(--color-foreground);">No contacts yet</h2>
                <p class="text-muted-custom mb-4">Add your first contact to get started with Phonebook Pro.</p>
                <button @click="$emit('add-contact')" class="btn-custom btn-primary-custom">
                    <i class="bi bi-person-plus" aria-hidden="true"></i>
                    Add Contact
                </button>
            </div>
        </div>
    `
};

// --------------------------------------------------------
// ContactDetail Component
// --------------------------------------------------------
const ContactDetail = {
    name: 'ContactDetail',
    props: ['contact'],
    emits: ['update-contact', 'delete-contact', 'back-to-list'],
    data() {
        return {
            isEditing: false,
            editedContact: {},
            errors: {},
            isSaving: false,
            isDeleting: false
        };
    },
    watch: {
        contact: {
            handler(newContact) {
                if (newContact) {
                    this.editedContact = { ...newContact };
                }
            },
            immediate: true
        }
    },
    computed: {
        formattedDate() {
            if (!this.contact || !this.contact.created_at) return 'Not available';
            return new Date(this.contact.created_at).toLocaleString();
        }
    },
    methods: {
        startEdit() {
            this.isEditing = true;
            this.editedContact = { ...this.contact };
            this.errors = {};
            this.$nextTick(() => {
                this.$refs.editName?.focus();
            });
        },
        cancelEdit() {
            this.isEditing = false;
            this.editedContact = { ...this.contact };
            this.errors = {};
        },
        validate() {
            const errors = {};
            if (!this.editedContact.name || !this.editedContact.name.trim()) {
                errors.name = 'Name is required';
            }
            if (!this.editedContact.phone_number || !this.editedContact.phone_number.trim()) {
                errors.phone_number = 'Phone number is required';
            }
            if (this.editedContact.email && !this.isValidEmail(this.editedContact.email)) {
                errors.email = 'Please enter a valid email address';
            }
            this.errors = errors;
            return Object.keys(errors).length === 0;
        },
        isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        saveEdit() {
            if (!this.validate()) return;
            this.isSaving = true;
            this.$emit('update-contact', this.contact.id, { ...this.editedContact });
            // Parent will reset isSaving when done if it calls back; since parent doesn't,
            // we reset quickly to give feedback. Better handled by parent with callback,
            // but for this architecture we keep simple.
            setTimeout(() => {
                this.isSaving = false;
                this.isEditing = false;
            }, 400);
        },
        deleteContact() {
            if (confirm('Are you sure you want to delete this contact? This action cannot be undone.')) {
                this.isDeleting = true;
                this.$emit('delete-contact', this.contact.id);
            }
        },
        getInitials(name) {
            if (!name) return '?';
            return name.charAt(0).toUpperCase();
        }
    },
    template: `
        <div class="contact-detail">
            <div class="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center gap-3 mb-4">
                <h1 class="h3 fw-bold mb-0" style="color: var(--color-foreground);">Contact Details</h1>
                <button @click="$emit('back-to-list')" class="btn-custom btn-ghost-custom">
                    <i class="bi bi-arrow-left" aria-hidden="true"></i>
                    Back to List
                </button>
            </div>

            <div class="card-custom">
                <div class="card-body p-4 p-lg-5" v-if="!isEditing">
                    <div class="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-4 mb-4">
                        <div class="avatar avatar-lg">
                            {{ getInitials(contact.name) }}
                        </div>
                        <div class="text-center text-md-start">
                            <h2 class="h3 fw-bold mb-1" style="color: var(--color-foreground);">{{ contact.name }}</h2>
                            <p class="text-muted-custom mb-0">Contact Details</p>
                        </div>
                    </div>

                    <div class="info-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-md);">
                        <div class="info-chip">
                            <div class="info-chip-icon">
                                <i class="bi bi-telephone" aria-hidden="true"></i>
                            </div>
                            <div class="min-w-0">
                                <div class="info-chip-label">Phone Number</div>
                                <div class="info-chip-value">{{ contact.phone_number }}</div>
                            </div>
                        </div>
                        <div class="info-chip">
                            <div class="info-chip-icon">
                                <i class="bi bi-envelope" aria-hidden="true"></i>
                            </div>
                            <div class="min-w-0">
                                <div class="info-chip-label">Email</div>
                                <div class="info-chip-value">{{ contact.email || 'Not provided' }}</div>
                            </div>
                        </div>
                        <div class="info-chip">
                            <div class="info-chip-icon">
                                <i class="bi bi-geo-alt" aria-hidden="true"></i>
                            </div>
                            <div class="min-w-0">
                                <div class="info-chip-label">Address</div>
                                <div class="info-chip-value">{{ contact.address || 'Not provided' }}</div>
                            </div>
                        </div>
                        <div class="info-chip">
                            <div class="info-chip-icon">
                                <i class="bi bi-clock" aria-hidden="true"></i>
                            </div>
                            <div class="min-w-0">
                                <div class="info-chip-label">Created</div>
                                <div class="info-chip-value">{{ formattedDate }}</div>
                            </div>
                        </div>
                    </div>

                    <div class="d-flex flex-column flex-sm-row gap-3 mt-4">
                        <button @click="startEdit" class="btn-custom btn-primary-custom flex-fill">
                            <i class="bi bi-pencil" aria-hidden="true"></i>
                            Edit Contact
                        </button>
                        <button @click="deleteContact" class="btn-custom btn-danger-custom flex-fill" :disabled="isDeleting">
                            <i class="bi bi-trash" aria-hidden="true"></i>
                            <span v-if="isDeleting" class="spinner me-2"></span>
                            {{ isDeleting ? 'Deleting...' : 'Delete' }}
                        </button>
                    </div>
                </div>

                <div class="card-body p-4 p-lg-5" v-else>
                    <h2 class="h4 fw-bold mb-4" style="color: var(--color-foreground);">Edit Contact</h2>
                    <form @submit.prevent="saveEdit" novalidate>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label for="editName" class="input-label">Full Name *</label>
                                <div class="input-group-custom">
                                    <i class="bi bi-person input-icon" aria-hidden="true"></i>
                                    <input
                                        ref="editName"
                                        type="text"
                                        id="editName"
                                        v-model="editedContact.name"
                                        class="input-custom"
                                        :class="{ error: errors.name }"
                                        aria-required="true"
                                        :aria-invalid="!!errors.name"
                                        :aria-describedby="errors.name ? 'editName-error' : null"
                                    >
                                </div>
                                <div v-if="errors.name" id="editName-error" class="input-error" role="alert">{{ errors.name }}</div>
                            </div>
                            <div class="col-md-6">
                                <label for="editPhone" class="input-label">Phone Number *</label>
                                <div class="input-group-custom">
                                    <i class="bi bi-telephone input-icon" aria-hidden="true"></i>
                                    <input
                                        type="text"
                                        id="editPhone"
                                        v-model="editedContact.phone_number"
                                        class="input-custom"
                                        :class="{ error: errors.phone_number }"
                                        aria-required="true"
                                        :aria-invalid="!!errors.phone_number"
                                        :aria-describedby="errors.phone_number ? 'editPhone-error' : null"
                                    >
                                </div>
                                <div v-if="errors.phone_number" id="editPhone-error" class="input-error" role="alert">{{ errors.phone_number }}</div>
                            </div>
                            <div class="col-md-6">
                                <label for="editEmail" class="input-label">Email Address</label>
                                <div class="input-group-custom">
                                    <i class="bi bi-envelope input-icon" aria-hidden="true"></i>
                                    <input
                                        type="email"
                                        id="editEmail"
                                        v-model="editedContact.email"
                                        class="input-custom"
                                        :class="{ error: errors.email }"
                                        :aria-invalid="!!errors.email"
                                        :aria-describedby="errors.email ? 'editEmail-error' : null"
                                    >
                                </div>
                                <div v-if="errors.email" id="editEmail-error" class="input-error" role="alert">{{ errors.email }}</div>
                            </div>
                            <div class="col-md-6">
                                <label for="editAddress" class="input-label">Address</label>
                                <div class="input-group-custom">
                                    <i class="bi bi-geo-alt input-icon" aria-hidden="true"></i>
                                    <textarea
                                        id="editAddress"
                                        v-model="editedContact.address"
                                        class="input-custom"
                                        rows="2"
                                        style="resize: vertical; padding-top: 0.75rem;"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex flex-column flex-sm-row gap-3 mt-4">
                            <button type="submit" class="btn-custom btn-primary-custom flex-fill" :disabled="isSaving">
                                <span v-if="isSaving" class="spinner me-2"></span>
                                <i v-else class="bi bi-check-lg" aria-hidden="true"></i>
                                {{ isSaving ? 'Saving...' : 'Save Changes' }}
                            </button>
                            <button type="button" @click="cancelEdit" class="btn-custom btn-ghost-custom flex-fill">
                                <i class="bi bi-x-lg" aria-hidden="true"></i>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `
};

// --------------------------------------------------------
// CreateContact Component
// --------------------------------------------------------
const CreateContact = {
    name: 'CreateContact',
    emits: ['create-contact', 'cancel'],
    data() {
        return {
            contact: {
                name: '',
                phone_number: '',
                email: '',
                address: ''
            },
            errors: {},
            isSubmitting: false
        };
    },
    mounted() {
        this.$refs.nameInput?.focus();
    },
    methods: {
        validate() {
            const errors = {};
            if (!this.contact.name || !this.contact.name.trim()) {
                errors.name = 'Name is required';
            }
            if (!this.contact.phone_number || !this.contact.phone_number.trim()) {
                errors.phone_number = 'Phone number is required';
            }
            if (this.contact.email && !this.isValidEmail(this.contact.email)) {
                errors.email = 'Please enter a valid email address';
            }
            this.errors = errors;
            return Object.keys(errors).length === 0;
        },
        isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        submitForm() {
            if (!this.validate()) return;
            this.isSubmitting = true;
            this.$emit('create-contact', { ...this.contact });
            // Parent handles actual loading state; reset after brief delay for feedback
            setTimeout(() => {
                this.isSubmitting = false;
                this.contact = { name: '', phone_number: '', email: '', address: '' };
            }, 400);
        }
    },
    template: `
        <div class="create-contact">
            <div class="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center gap-3 mb-4">
                <div>
                    <h1 class="h3 fw-bold mb-1" style="color: var(--color-foreground);">Add New Contact</h1>
                    <p class="text-muted-custom mb-0">Create a new contact in your phonebook.</p>
                </div>
                <button @click="$emit('cancel')" class="btn-custom btn-ghost-custom">
                    <i class="bi bi-x-lg" aria-hidden="true"></i>
                    Cancel
                </button>
            </div>

            <div class="card-custom">
                <div class="card-body p-4 p-lg-5">
                    <form @submit.prevent="submitForm" novalidate>
                        <div class="row g-3">
                            <div class="col-12">
                                <label for="name" class="input-label">Full Name *</label>
                                <div class="input-group-custom">
                                    <i class="bi bi-person input-icon" aria-hidden="true"></i>
                                    <input
                                        ref="nameInput"
                                        type="text"
                                        id="name"
                                        v-model="contact.name"
                                        class="input-custom"
                                        :class="{ error: errors.name }"
                                        placeholder="John Doe"
                                        aria-required="true"
                                        :aria-invalid="!!errors.name"
                                        :aria-describedby="errors.name ? 'name-error' : null"
                                    >
                                </div>
                                <div v-if="errors.name" id="name-error" class="input-error" role="alert">{{ errors.name }}</div>
                            </div>
                            <div class="col-12">
                                <label for="phone" class="input-label">Phone Number *</label>
                                <div class="input-group-custom">
                                    <i class="bi bi-telephone input-icon" aria-hidden="true"></i>
                                    <input
                                        type="text"
                                        id="phone"
                                        v-model="contact.phone_number"
                                        class="input-custom"
                                        :class="{ error: errors.phone_number }"
                                        placeholder="+1 (555) 123-4567"
                                        aria-required="true"
                                        :aria-invalid="!!errors.phone_number"
                                        :aria-describedby="errors.phone_number ? 'phone-error' : null"
                                    >
                                </div>
                                <div v-if="errors.phone_number" id="phone-error" class="input-error" role="alert">{{ errors.phone_number }}</div>
                            </div>
                            <div class="col-md-6">
                                <label for="email" class="input-label">Email Address</label>
                                <div class="input-group-custom">
                                    <i class="bi bi-envelope input-icon" aria-hidden="true"></i>
                                    <input
                                        type="email"
                                        id="email"
                                        v-model="contact.email"
                                        class="input-custom"
                                        :class="{ error: errors.email }"
                                        placeholder="john@example.com"
                                        :aria-invalid="!!errors.email"
                                        :aria-describedby="errors.email ? 'email-error' : null"
                                    >
                                </div>
                                <div v-if="errors.email" id="email-error" class="input-error" role="alert">{{ errors.email }}</div>
                            </div>
                            <div class="col-md-6">
                                <label for="address" class="input-label">Address</label>
                                <div class="input-group-custom">
                                    <i class="bi bi-geo-alt input-icon" aria-hidden="true"></i>
                                    <input
                                        type="text"
                                        id="address"
                                        v-model="contact.address"
                                        class="input-custom"
                                        placeholder="123 Main Street, City"
                                    >
                                </div>
                            </div>
                        </div>
                        <div class="d-flex flex-column flex-sm-row gap-3 mt-4">
                            <button type="submit" class="btn-custom btn-primary-custom flex-fill" :disabled="isSubmitting">
                                <span v-if="isSubmitting" class="spinner me-2"></span>
                                <i v-else class="bi bi-plus-lg" aria-hidden="true"></i>
                                {{ isSubmitting ? 'Adding...' : 'Add Contact' }}
                            </button>
                            <button type="button" @click="$emit('cancel')" class="btn-custom btn-ghost-custom flex-fill">
                                <i class="bi bi-x-lg" aria-hidden="true"></i>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `
};

// --------------------------------------------------------
// Login Component
// --------------------------------------------------------
const Login = {
    name: 'Login',
    emits: ['login', 'navigate-to-register'],
    data() {
        return {
            credentials: {
                username: '',
                password: ''
            },
            errors: {},
            isLoading: false
        };
    },
    mounted() {
        this.$refs.usernameInput?.focus();
    },
    methods: {
        validate() {
            const errors = {};
            if (!this.credentials.username.trim()) errors.username = 'Username is required';
            if (!this.credentials.password) errors.password = 'Password is required';
            this.errors = errors;
            return Object.keys(errors).length === 0;
        },
        submitForm() {
            if (!this.validate()) return;
            this.isLoading = true;
            this.$emit('login', { ...this.credentials });
        },
        resetLoading() {
            this.isLoading = false;
        }
    },
    template: `
        <div class="auth-page">
            <div class="auth-card">
                <div class="text-center">
                    <div class="auth-logo">
                        <i class="bi bi-people" aria-hidden="true"></i>
                    </div>
                    <h2 class="h3 fw-bold mb-1" style="color: var(--color-foreground);">Welcome back</h2>
                    <p class="text-muted-custom mb-4">Sign in to your Phonebook Pro account</p>
                </div>
                <form @submit.prevent="submitForm" novalidate>
                    <div class="mb-3">
                        <label for="loginUsername" class="input-label">Username</label>
                        <div class="input-group-custom">
                            <i class="bi bi-person input-icon" aria-hidden="true"></i>
                            <input
                                ref="usernameInput"
                                type="text"
                                id="loginUsername"
                                v-model="credentials.username"
                                class="input-custom"
                                :class="{ error: errors.username }"
                                autocomplete="username"
                                :aria-invalid="!!errors.username"
                                :aria-describedby="errors.username ? 'loginUsername-error' : null"
                            >
                        </div>
                        <div v-if="errors.username" id="loginUsername-error" class="input-error" role="alert">{{ errors.username }}</div>
                    </div>
                    <div class="mb-4">
                        <label for="loginPassword" class="input-label">Password</label>
                        <div class="input-group-custom">
                            <i class="bi bi-lock input-icon" aria-hidden="true"></i>
                            <input
                                type="password"
                                id="loginPassword"
                                v-model="credentials.password"
                                class="input-custom"
                                :class="{ error: errors.password }"
                                autocomplete="current-password"
                                :aria-invalid="!!errors.password"
                                :aria-describedby="errors.password ? 'loginPassword-error' : null"
                            >
                        </div>
                        <div v-if="errors.password" id="loginPassword-error" class="input-error" role="alert">{{ errors.password }}</div>
                    </div>
                    <button type="submit" class="btn-custom btn-primary-custom w-100" :disabled="isLoading">
                        <span v-if="isLoading" class="spinner me-2"></span>
                        {{ isLoading ? 'Signing in...' : 'Sign In' }}
                    </button>
                </form>
                <div class="text-center mt-4">
                    <p class="mb-0 text-muted-custom" style="font-size: 0.9rem;">
                        Don't have an account?
                        <a href="#" @click.prevent="$emit('navigate-to-register')" class="fw-bold">Sign up</a>
                    </p>
                </div>
            </div>
        </div>
    `
};

// --------------------------------------------------------
// Register Component
// --------------------------------------------------------
const Register = {
    name: 'Register',
    emits: ['register', 'navigate-to-login'],
    data() {
        return {
            credentials: {
                username: '',
                email: '',
                password: '',
                confirmPassword: ''
            },
            errors: {},
            isLoading: false
        };
    },
    mounted() {
        this.$refs.usernameInput?.focus();
    },
    methods: {
        validate() {
            const errors = {};
            if (!this.credentials.username.trim()) errors.username = 'Username is required';
            if (!this.credentials.email.trim()) {
                errors.email = 'Email is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.credentials.email)) {
                errors.email = 'Please enter a valid email';
            }
            if (!this.credentials.password) {
                errors.password = 'Password is required';
            } else if (this.credentials.password.length < 6) {
                errors.password = 'Password must be at least 6 characters';
            }
            if (this.credentials.password !== this.credentials.confirmPassword) {
                errors.confirmPassword = 'Passwords do not match';
            }
            this.errors = errors;
            return Object.keys(errors).length === 0;
        },
        submitForm() {
            if (!this.validate()) return;
            this.isLoading = true;
            this.$emit('register', {
                username: this.credentials.username,
                email: this.credentials.email,
                password: this.credentials.password
            });
        },
        resetLoading() {
            this.isLoading = false;
        }
    },
    template: `
        <div class="auth-page">
            <div class="auth-card">
                <div class="text-center">
                    <div class="auth-logo" style="background-color: var(--color-secondary);">
                        <i class="bi bi-person-plus" aria-hidden="true"></i>
                    </div>
                    <h2 class="h3 fw-bold mb-1" style="color: var(--color-foreground);">Create Account</h2>
                    <p class="text-muted-custom mb-4">Join Phonebook Pro today</p>
                </div>
                <form @submit.prevent="submitForm" novalidate>
                    <div class="mb-3">
                        <label for="registerUsername" class="input-label">Username</label>
                        <div class="input-group-custom">
                            <i class="bi bi-person input-icon" aria-hidden="true"></i>
                            <input
                                ref="usernameInput"
                                type="text"
                                id="registerUsername"
                                v-model="credentials.username"
                                class="input-custom"
                                :class="{ error: errors.username }"
                                autocomplete="username"
                                minlength="3"
                                :aria-invalid="!!errors.username"
                                :aria-describedby="errors.username ? 'registerUsername-error' : null"
                            >
                        </div>
                        <div v-if="errors.username" id="registerUsername-error" class="input-error" role="alert">{{ errors.username }}</div>
                    </div>
                    <div class="mb-3">
                        <label for="registerEmail" class="input-label">Email</label>
                        <div class="input-group-custom">
                            <i class="bi bi-envelope input-icon" aria-hidden="true"></i>
                            <input
                                type="email"
                                id="registerEmail"
                                v-model="credentials.email"
                                class="input-custom"
                                :class="{ error: errors.email }"
                                autocomplete="email"
                                :aria-invalid="!!errors.email"
                                :aria-describedby="errors.email ? 'registerEmail-error' : null"
                            >
                        </div>
                        <div v-if="errors.email" id="registerEmail-error" class="input-error" role="alert">{{ errors.email }}</div>
                    </div>
                    <div class="mb-3">
                        <label for="registerPassword" class="input-label">Password</label>
                        <div class="input-group-custom">
                            <i class="bi bi-lock input-icon" aria-hidden="true"></i>
                            <input
                                type="password"
                                id="registerPassword"
                                v-model="credentials.password"
                                class="input-custom"
                                :class="{ error: errors.password }"
                                autocomplete="new-password"
                                minlength="6"
                                :aria-invalid="!!errors.password"
                                :aria-describedby="errors.password ? 'registerPassword-error' : null"
                            >
                        </div>
                        <div v-if="errors.password" id="registerPassword-error" class="input-error" role="alert">{{ errors.password }}</div>
                    </div>
                    <div class="mb-4">
                        <label for="confirmPassword" class="input-label">Confirm Password</label>
                        <div class="input-group-custom">
                            <i class="bi bi-shield-lock input-icon" aria-hidden="true"></i>
                            <input
                                type="password"
                                id="confirmPassword"
                                v-model="credentials.confirmPassword"
                                class="input-custom"
                                :class="{ error: errors.confirmPassword }"
                                autocomplete="new-password"
                                :aria-invalid="!!errors.confirmPassword"
                                :aria-describedby="errors.confirmPassword ? 'confirmPassword-error' : null"
                            >
                        </div>
                        <div v-if="errors.confirmPassword" id="confirmPassword-error" class="input-error" role="alert">{{ errors.confirmPassword }}</div>
                    </div>
                    <button type="submit" class="btn-custom btn-primary-custom w-100" :disabled="isLoading">
                        <span v-if="isLoading" class="spinner me-2"></span>
                        {{ isLoading ? 'Creating account...' : 'Create Account' }}
                    </button>
                </form>
                <div class="text-center mt-4">
                    <p class="mb-0 text-muted-custom" style="font-size: 0.9rem;">
                        Already have an account?
                        <a href="#" @click.prevent="$emit('navigate-to-login')" class="fw-bold">Sign in</a>
                    </p>
                </div>
            </div>
        </div>
    `
};

// --------------------------------------------------------
// Main App
// --------------------------------------------------------
const App = {
    data() {
        return {
            currentView: 'contact-list',
            currentUser: { authenticated: false, username: null },
            searchTerm: '',
            contacts: [],
            selectedContact: null,
            apiUrl: window.location.port === '8080' ? 'http://localhost:8000' : '/api',
            token: localStorage.getItem('token') || null,
            isMobileMenuOpen: false,
            isSearchLoading: false
        };
    },
    mounted() {
        if (this.token) {
            this.verifyToken();
        } else {
            this.currentView = 'login';
        }
    },
    created() {
        this.debouncedSearch = this.debounce(this.performSearch, 300);
    },
    computed: {
        isAuthenticated() {
            return !!this.token;
        }
    },
    methods: {
        // Toast proxy
        showToast(message, type = 'info', duration = 4000) {
            this.$refs.toastContainer?.addToast(message, type, duration);
        },

        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        async verifyToken() {
            try {
                if (this.token) {
                    await axios.get(`${this.apiUrl}/contacts`, {
                        headers: { Authorization: `Bearer ${this.token}` }
                    });
                    const storedUsername = localStorage.getItem('username') || 'User';
                    this.currentUser = { authenticated: true, username: storedUsername };
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    this.logout();
                } else {
                    console.warn('Backend not reachable; token validation pending.');
                    const storedUsername = localStorage.getItem('username') || 'User';
                    this.currentUser = { authenticated: true, username: storedUsername };
                    this.currentView = 'contact-list';
                }
            }
        },

        login(credentials) {
            axios.post(`${this.apiUrl}/login`, {
                username: credentials.username,
                password: credentials.password
            })
            .then(response => {
                this.token = response.data.access_token;
                localStorage.setItem('token', this.token);
                localStorage.setItem('username', credentials.username);
                this.currentUser = { authenticated: true, username: credentials.username };
                this.currentView = 'contact-list';
                this.showToast('Welcome back, ' + credentials.username + '!', 'success');
            })
            .catch(error => {
                const detail = error.response?.data?.detail || 'Network error — please make sure the backend server is running';
                this.showToast('Login failed: ' + detail, 'error');
                this.$nextTick(() => {
                    this.$refs.loginComponent?.resetLoading();
                });
            });
        },

        register(credentials) {
            axios.post(`${this.apiUrl}/register`, {
                username: credentials.username,
                email: credentials.email,
                password: credentials.password
            }, {
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => {
                this.token = response.data.access_token;
                localStorage.setItem('token', this.token);
                localStorage.setItem('username', credentials.username);
                this.currentUser = { authenticated: true, username: credentials.username };
                this.currentView = 'contact-list';
                this.showToast('Account created successfully!', 'success');
            })
            .catch(error => {
                const detail = error.response?.data?.detail || 'Network error — please make sure the backend server is running';
                this.showToast('Registration failed: ' + detail, 'error');
                this.$nextTick(() => {
                    this.$refs.registerComponent?.resetLoading();
                });
            });
        },

        logout() {
            this.token = null;
            this.currentUser = { authenticated: false, username: null };
            this.searchTerm = '';
            this.contacts = [];
            this.selectedContact = null;
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            this.currentView = 'login';
            this.showToast('You have been logged out.', 'info');
        },

        navigateTo(view) {
            this.currentView = view;
            this.isMobileMenuOpen = false;
            if (view === 'contact-list') {
                this.selectedContact = null;
            }
        },

        loadContacts() {
            if (!this.token) return;
            axios.get(`${this.apiUrl}/contacts`, {
                headers: { Authorization: `Bearer ${this.token}` }
            })
            .then(response => {
                this.contacts = response.data;
            })
            .catch(error => {
                if (error.response) {
                    console.error('Error fetching contacts:', error.response.data);
                    this.showToast('Could not load contacts.', 'error');
                } else if (error.request) {
                    console.warn('Backend not reachable, showing empty contact list');
                    this.showToast('Backend not reachable. Please make sure the server is running.', 'error');
                }
            });
        },

        performSearch() {
            if (!this.token) return;
            this.isSearchLoading = true;
            const url = this.searchTerm
                ? `${this.apiUrl}/contacts?search=${encodeURIComponent(this.searchTerm)}`
                : `${this.apiUrl}/contacts`;

            axios.get(url, {
                headers: { Authorization: `Bearer ${this.token}` }
            })
            .then(response => {
                this.contacts = response.data;
            })
            .catch(error => {
                if (error.response) {
                    console.error('Error searching contacts:', error.response.data);
                } else if (error.request) {
                    console.warn('Backend not reachable for search');
                }
            })
            .finally(() => {
                this.isSearchLoading = false;
            });
        },

        loadContact(id) {
            if (!this.token) return;
            axios.get(`${this.apiUrl}/contacts/${id}`, {
                headers: { Authorization: `Bearer ${this.token}` }
            })
            .then(response => {
                this.selectedContact = response.data;
                this.currentView = 'contact-detail';
            })
            .catch(error => {
                const detail = error.response?.data?.detail || 'Network error — please make sure the backend server is running';
                this.showToast('Error fetching contact: ' + detail, 'error');
            });
        },

        createContact(contactData) {
            if (!this.token) return;
            axios.post(`${this.apiUrl}/contacts`, contactData, {
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                this.contacts.push(response.data);
                this.navigateTo('contact-list');
                this.showToast('Contact added successfully!', 'success');
            })
            .catch(error => {
                const detail = error.response?.data?.detail || 'Network error — please make sure the backend server is running';
                this.showToast('Error creating contact: ' + detail, 'error');
            });
        },

        updateContact(id, contactData) {
            if (!this.token) return;
            axios.put(`${this.apiUrl}/contacts/${id}`, contactData, {
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                const index = this.contacts.findIndex(contact => contact.id === id);
                if (index !== -1) {
                    this.contacts[index] = response.data;
                }
                this.selectedContact = response.data;
                this.navigateTo('contact-list');
                this.showToast('Contact updated successfully!', 'success');
            })
            .catch(error => {
                const detail = error.response?.data?.detail || 'Network error — please make sure the backend server is running';
                this.showToast('Error updating contact: ' + detail, 'error');
            });
        },

        deleteContact(id) {
            if (!this.token) return;
            axios.delete(`${this.apiUrl}/contacts/${id}`, {
                headers: { Authorization: `Bearer ${this.token}` }
            })
            .then(() => {
                this.contacts = this.contacts.filter(contact => contact.id !== id);
                this.selectedContact = null;
                this.navigateTo('contact-list');
                this.showToast('Contact deleted successfully.', 'info');
            })
            .catch(error => {
                const detail = error.response?.data?.detail || 'Network error — please make sure the backend server is running';
                this.showToast('Error deleting contact: ' + detail, 'error');
            });
        }
    },
    template: `
        <div class="app" style="min-height: 100vh; background-color: var(--color-background); display: flex; flex-direction: column;">
            <toast-container ref="toastContainer"></toast-container>

            <!-- Navigation Bar -->
            <nav v-if="isAuthenticated" class="app-navbar">
                <div class="container-fluid px-4">
                    <div class="d-flex flex-wrap align-items-center justify-content-between">
                        <a class="navbar-brand-custom" href="#" @click.prevent="navigateTo('contact-list')">
                            <span class="brand-icon">
                                <i class="bi bi-people" aria-hidden="true"></i>
                            </span>
                            <span>Phonebook Pro</span>
                        </a>

                        <button
                            class="btn-custom btn-ghost-custom d-lg-none"
                            @click="isMobileMenuOpen = !isMobileMenuOpen"
                            aria-label="Toggle navigation menu"
                            :aria-expanded="isMobileMenuOpen"
                        >
                            <i class="bi" :class="isMobileMenuOpen ? 'bi-x-lg' : 'bi-list'" aria-hidden="true"></i>
                        </button>

                        <div
                            class="navbar-actions d-lg-flex"
                            :class="isMobileMenuOpen ? 'd-flex' : 'd-none d-lg-flex'"
                        >
                            <div class="d-flex align-items-center text-muted-custom me-lg-3">
                                <i class="bi bi-person-circle me-2" aria-hidden="true"></i>
                                <span class="d-none d-md-inline">Welcome, {{ currentUser && currentUser.username ? currentUser.username : 'User' }}</span>
                            </div>
                            <button class="btn-custom btn-primary-custom" @click="navigateTo('create-contact')" aria-label="Add new contact">
                                <i class="bi bi-person-plus" aria-hidden="true"></i>
                                Add Contact
                            </button>
                            <button class="btn-custom btn-ghost-custom" @click="logout">
                                <i class="bi bi-box-arrow-right" aria-hidden="true"></i>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <!-- Search Bar -->
            <div v-if="isAuthenticated" class="container-fluid px-4 py-4">
                <div class="row justify-content-center">
                    <div class="col-xl-6 col-lg-8 col-md-10">
                        <div class="input-group-custom">
                            <i class="bi bi-search input-icon" aria-hidden="true"></i>
                            <input
                                type="text"
                                class="input-custom"
                                style="padding-left: 2.75rem; border-radius: var(--radius-full);"
                                placeholder="Search contacts by name or phone..."
                                v-model="searchTerm"
                                @input="debouncedSearch"
                                aria-label="Search contacts"
                            >
                            <span v-if="isSearchLoading" class="position-absolute" style="right: 1rem; color: var(--color-placeholder);">
                                <span class="spinner" style="width: 1rem; height: 1rem; border-top-color: var(--color-primary);"></span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Content Area -->
            <main class="container-fluid px-4 flex-grow-1 pb-5">
                <div class="row justify-content-center">
                    <div class="col-12">
                        <transition name="fade" mode="out-in">
                            <contact-list
                                v-if="currentView === 'contact-list' && isAuthenticated"
                                :contacts="contacts"
                                @load-contacts="loadContacts"
                                @view-contact="loadContact"
                                @add-contact="navigateTo('create-contact')"
                            />
                        </transition>

                        <transition name="fade" mode="out-in">
                            <contact-detail
                                v-if="currentView === 'contact-detail' && isAuthenticated"
                                :contact="selectedContact"
                                @update-contact="updateContact"
                                @delete-contact="deleteContact"
                                @back-to-list="navigateTo('contact-list')"
                            />
                        </transition>

                        <transition name="fade" mode="out-in">
                            <create-contact
                                v-if="currentView === 'create-contact' && isAuthenticated"
                                @create-contact="createContact"
                                @cancel="navigateTo('contact-list')"
                            />
                        </transition>

                        <transition name="fade" mode="out-in">
                            <login
                                ref="loginComponent"
                                v-if="currentView === 'login'"
                                @login="login"
                                @navigate-to-register="navigateTo('register')"
                            />
                        </transition>

                        <transition name="fade" mode="out-in">
                            <register
                                ref="registerComponent"
                                v-if="currentView === 'register'"
                                @register="register"
                                @navigate-to-login="navigateTo('login')"
                            />
                        </transition>
                    </div>
                </div>
            </main>
        </div>
    `
};

// Create the app instance
const app = createApp(App);

// Register components
app.component('toast-container', ToastContainer);
app.component('contact-list', ContactList);
app.component('contact-detail', ContactDetail);
app.component('create-contact', CreateContact);
app.component('login', Login);
app.component('register', Register);

// Mount the app
app.mount('#app');
