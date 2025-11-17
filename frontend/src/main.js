// main.js
const { createApp } = Vue;

// Define all components directly in this file since we can't use ES6 imports in browser without modules

// ContactList Component
const ContactList = {
    name: 'ContactList',
    props: ['contacts'],
    emits: ['load-contacts', 'view-contact', 'add-contact'],
    data() {
        return {
            currentPage: 1,
            itemsPerPage: 6, // Show 6 contacts per page
        }
    },
    computed: {
        totalPages() {
            return Math.ceil(this.contacts.length / this.itemsPerPage);
        },
        paginatedContacts() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.contacts.slice(start, end);
        }
    },
    mounted() {
        this.$emit('load-contacts');
    },
    methods: {
        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        }
    },
    template: `
        <div class="contact-list">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="fw-bold" style="color: #2d3748;">My Contacts</h2>
                <div class="text-muted">
                    {{ contacts.length }} total contact{{ contacts.length !== 1 ? 's' : '' }}
                </div>
            </div>

            <div class="row g-4">
                <div v-for="contact in paginatedContacts" :key="contact.id" class="col-lg-4 col-md-6">
                    <div class="card h-100 shadow-sm border-0 rounded-3" style="transition: transform 0.2s ease, box-shadow 0.2s ease; background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);">
                        <div class="card-body p-4">
                            <div class="d-flex align-items-center mb-3">
                                <div class="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white" style="width: 50px; height: 50px; font-size: 1.2rem;">
                                    {{ contact.name.charAt(0).toUpperCase() }}
                                </div>
                                <div class="ms-3">
                                    <h5 class="card-title mb-1" style="color: #2d3748;">{{ contact.name }}</h5>
                                    <small class="text-muted">Contact</small>
                                </div>
                            </div>
                            <div class="mb-2">
                                <div class="d-flex align-items-center text-muted">
                                    <i class="bi bi-telephone me-2"></i>
                                    <span>{{ contact.phone_number }}</span>
                                </div>
                            </div>
                            <div v-if="contact.email" class="mb-2">
                                <div class="d-flex align-items-center text-muted">
                                    <i class="bi bi-envelope me-2"></i>
                                    <span>{{ contact.email }}</span>
                                </div>
                            </div>
                            <div v-if="contact.address" class="mb-3">
                                <div class="d-flex align-items-start text-muted">
                                    <i class="bi bi-geo-alt me-2 mt-1"></i>
                                    <span>{{ contact.address }}</span>
                                </div>
                            </div>
                            <button @click="$emit('view-contact', contact.id)" class="btn btn-outline-primary w-100" style="border-radius: 8px; font-weight: 500;">
                                <i class="bi bi-eye me-1"></i> View Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div v-if="contacts.length > itemsPerPage" class="d-flex justify-content-center mt-4 position-relative" style="z-index: 9999; padding-bottom: 20px;">
                <nav>
                    <ul class="pagination">
                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                            <button class="page-link" @click="prevPage" :disabled="currentPage === 1" style="border-radius: 8px; border: 1px solid #e2e8f0; color: #4a5568;">Previous</button>
                        </li>

                        <!-- Show first page, current page(s), and last page with ellipsis as needed -->
                        <li v-for="pageNum in getVisiblePages()" :key="pageNum" class="page-item" :class="{ active: currentPage === pageNum }">
                            <button class="page-link" :class="{ 'active': currentPage === pageNum }" @click="changePage(pageNum)" style="border-radius: 8px; border: 1px solid #e2e8f0; color: #4a5568;" :style="currentPage === pageNum ? 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-color: #667eea;' : ''">
                                {{ pageNum }}
                            </button>
                        </li>

                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                            <button class="page-link" @click="nextPage" :disabled="currentPage === totalPages" style="border-radius: 8px; border: 1px solid #e2e8f0; color: #4a5568;">Next</button>
                        </li>
                    </ul>
                </nav>
            </div>

            <div v-if="contacts.length === 0" class="text-center py-5">
                <div class="mb-4">
                    <i class="bi bi-people" style="font-size: 4rem; color: #cbd5e0;"></i>
                </div>
                <h4 class="text-muted mb-2">No contacts yet</h4>
                <p class="text-muted mb-4">Add your first contact to get started</p>
                <button @click="$emit('add-contact')" class="btn btn-primary" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; font-weight: 500;">
                    <i class="bi bi-person-plus me-1"></i> Add Contact
                </button>
            </div>
        </div>
    `,
    methods: {
        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        getVisiblePages() {
            // Show a maximum of 5 page buttons: first, ..., current-1, current, current+1, ..., last
            const pages = [];
            const totalPages = this.totalPages;
            const currentPage = this.currentPage;

            if (totalPages <= 5) {
                // If total pages <= 5, show all pages
                for (let i = 1; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                // Always show first page
                pages.push(1);

                if (currentPage > 3) {
                    pages.push('...');
                }

                // Show current page and up to 1 page on each side
                for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                    pages.push(i);
                }

                if (currentPage < totalPages - 2) {
                    pages.push('...');
                }

                // Always show last page
                if (totalPages > 1) {
                    pages.push(totalPages);
                }
            }

            return pages;
        }
    }
};

// ContactDetail Component
const ContactDetail = {
    name: 'ContactDetail',
    props: ['contact'],
    emits: ['update-contact', 'delete-contact', 'back-to-list'],
    data() {
        return {
            isEditing: false,
            editedContact: {}
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
    methods: {
        startEdit() {
            this.isEditing = true;
            this.editedContact = { ...this.contact };
        },
        cancelEdit() {
            this.isEditing = false;
            this.editedContact = { ...this.contact };
        },
        saveEdit() {
            this.$emit('update-contact', this.contact.id, this.editedContact);
            this.isEditing = false;
        },
        deleteContact() {
            if (confirm('Are you sure you want to delete this contact?')) {
                this.$emit('delete-contact', this.contact.id);
            }
        }
    },
    computed: {
        formattedDate() {
            if (!this.contact || !this.contact.created_at) return '';
            return new Date(this.contact.created_at).toLocaleString();
        }
    },
    template: `
        <div class="contact-detail">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="fw-bold" style="color: #2d3748;">Contact Details</h2>
                <button @click="$emit('back-to-list')" class="btn btn-outline-secondary" style="border-radius: 8px; font-weight: 500;">
                    <i class="bi bi-arrow-left me-1"></i> Back to List
                </button>
            </div>

            <div class="card shadow-sm border-0 rounded-3" style="background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);">
                <div class="card-body p-4" v-if="!isEditing">
                    <div class="d-flex align-items-center mb-4">
                        <div class="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white" style="width: 80px; height: 80px; font-size: 2rem;">
                            {{ contact.name.charAt(0).toUpperCase() }}
                        </div>
                        <div class="ms-4">
                            <h3 class="mb-1" style="color: #2d3748;">{{ contact.name }}</h3>
                            <p class="text-muted mb-0">Contact Details</p>
                        </div>
                    </div>

                    <div class="row g-3">
                        <div class="col-md-6">
                            <div class="d-flex align-items-center p-3 rounded-2" style="background: #f8fafc; border: 1px solid #e2e8f0;">
                                <div class="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                                    <i class="bi bi-telephone text-primary"></i>
                                </div>
                                <div>
                                    <small class="text-muted">Phone Number</small>
                                    <div class="fw-medium">{{ contact.phone_number }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="d-flex align-items-center p-3 rounded-2" style="background: #f8fafc; border: 1px solid #e2e8f0;">
                                <div class="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                                    <i class="bi bi-envelope text-success"></i>
                                </div>
                                <div>
                                    <small class="text-muted">Email</small>
                                    <div class="fw-medium">{{ contact.email || 'Not provided' }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="d-flex align-items-start p-3 rounded-2" style="background: #f8fafc; border: 1px solid #e2e8f0;">
                                <div class="bg-warning bg-opacity-10 rounded-circle p-2 me-3">
                                    <i class="bi bi-geo-alt text-warning"></i>
                                </div>
                                <div>
                                    <small class="text-muted">Address</small>
                                    <div class="fw-medium">{{ contact.address || 'Not provided' }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="d-flex align-items-center p-3 rounded-2" style="background: #f8fafc; border: 1px solid #e2e8f0;">
                                <div class="bg-info bg-opacity-10 rounded-circle p-2 me-3">
                                    <i class="bi bi-clock text-info"></i>
                                </div>
                                <div>
                                    <small class="text-muted">Created</small>
                                    <div class="fw-medium">{{ formattedDate }}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="d-flex gap-2 mt-4">
                        <button @click="startEdit" class="btn btn-primary flex-fill" style="border-radius: 8px; font-weight: 500; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none;">
                            <i class="bi bi-pencil me-1"></i> Edit Contact
                        </button>
                        <button @click="deleteContact" class="btn btn-danger flex-fill" style="border-radius: 8px; font-weight: 500;">
                            <i class="bi bi-trash me-1"></i> Delete
                        </button>
                    </div>
                </div>

                <div class="card-body p-4" v-else>
                    <h4 class="mb-4 fw-bold" style="color: #2d3748;">Edit Contact</h4>
                    <form @submit.prevent="saveEdit">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label for="editName" class="form-label fw-medium mb-2">Name</label>
                                <div class="input-group">
                                    <span class="input-group-text" style="background: #f8f9fa; border: 1px solid #e2e8f0;">
                                        <i class="bi bi-person"></i>
                                    </span>
                                    <input
                                        type="text"
                                        class="form-control border-0 ps-0"
                                        id="editName"
                                        v-model="editedContact.name"
                                        required
                                        style="border-left: 1px solid #e2e8f0 !important;"
                                    >
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label for="editPhone" class="form-label fw-medium mb-2">Phone Number</label>
                                <div class="input-group">
                                    <span class="input-group-text" style="background: #f8f9fa; border: 1px solid #e2e8f0;">
                                        <i class="bi bi-telephone"></i>
                                    </span>
                                    <input
                                        type="text"
                                        class="form-control border-0 ps-0"
                                        id="editPhone"
                                        v-model="editedContact.phone_number"
                                        required
                                        style="border-left: 1px solid #e2e8f0 !important;"
                                    >
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label for="editEmail" class="form-label fw-medium mb-2">Email</label>
                                <div class="input-group">
                                    <span class="input-group-text" style="background: #f8f9fa; border: 1px solid #e2e8f0;">
                                        <i class="bi bi-envelope"></i>
                                    </span>
                                    <input
                                        type="email"
                                        class="form-control border-0 ps-0"
                                        id="editEmail"
                                        v-model="editedContact.email"
                                        style="border-left: 1px solid #e2e8f0 !important;"
                                    >
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label for="editAddress" class="form-label fw-medium mb-2">Address</label>
                                <div class="input-group">
                                    <span class="input-group-text" style="background: #f8f9fa; border: 1px solid #e2e8f0;">
                                        <i class="bi bi-geo-alt"></i>
                                    </span>
                                    <textarea
                                        class="form-control border-0 ps-0"
                                        id="editAddress"
                                        v-model="editedContact.address"
                                        rows="1"
                                        style="border-left: 1px solid #e2e8f0 !important; resize: none; height: auto;"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex gap-2 mt-4">
                            <button type="submit" class="btn btn-success flex-fill" style="border-radius: 8px; font-weight: 500; background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); border: none;">
                                <i class="bi bi-save me-1"></i> Save Changes
                            </button>
                            <button type="button" @click="cancelEdit" class="btn btn-secondary flex-fill" style="border-radius: 8px; font-weight: 500;">
                                <i class="bi bi-x me-1"></i> Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `
};

// CreateContact Component
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
            }
        };
    },
    methods: {
        submitForm() {
            // Basic validation
            if (!this.contact.name || !this.contact.phone_number) {
                alert('Name and phone number are required');
                return;
            }

            this.$emit('create-contact', { ...this.contact });
        }
    },
    template: `
        <div class="create-contact">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h3 class="fw-bold" style="color: #2d3748;">Add New Contact</h3>
                <button @click="$emit('cancel')" class="btn btn-outline-secondary btn-sm" style="border-radius: 8px; font-weight: 500; font-size: 0.85rem;">
                    <i class="bi bi-x me-1"></i> Cancel
                </button>
            </div>

            <div class="card shadow-sm border-0 rounded-3" style="background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);">
                <div class="card-body p-3">
                    <form @submit.prevent="submitForm">
                        <div class="row g-3">
                            <div class="col-12">
                                <label for="name" class="form-label fw-medium mb-1" style="font-size: 0.9rem;">Full Name *</label>
                                <div class="input-group">
                                    <span class="input-group-text" style="background: #f8f9fa; border: 1px solid #e2e8f0; font-size: 0.8rem;">
                                        <i class="bi bi-person"></i>
                                    </span>
                                    <input
                                        type="text"
                                        class="form-control border-0 ps-0"
                                        id="name"
                                        v-model="contact.name"
                                        required
                                        placeholder="Enter full name"
                                        style="border-left: 1px solid #e2e8f0 !important; font-size: 0.9rem;"
                                    >
                                </div>
                            </div>
                            <div class="col-12">
                                <label for="phone" class="form-label fw-medium mb-1" style="font-size: 0.9rem;">Phone Number *</label>
                                <div class="input-group">
                                    <span class="input-group-text" style="background: #f8f9fa; border: 1px solid #e2e8f0; font-size: 0.8rem;">
                                        <i class="bi bi-telephone"></i>
                                    </span>
                                    <input
                                        type="text"
                                        class="form-control border-0 ps-0"
                                        id="phone"
                                        v-model="contact.phone_number"
                                        required
                                        placeholder="+1234567890"
                                        style="border-left: 1px solid #e2e8f0 !important; font-size: 0.9rem;"
                                    >
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label for="email" class="form-label fw-medium mb-1" style="font-size: 0.9rem;">Email Address</label>
                                <div class="input-group">
                                    <span class="input-group-text" style="background: #f8f9fa; border: 1px solid #e2e8f0; font-size: 0.8rem;">
                                        <i class="bi bi-envelope"></i>
                                    </span>
                                    <input
                                        type="email"
                                        class="form-control border-0 ps-0"
                                        id="email"
                                        v-model="contact.email"
                                        placeholder="user@example.com"
                                        style="border-left: 1px solid #e2e8f0 !important; font-size: 0.9rem;"
                                    >
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label for="address" class="form-label fw-medium mb-1" style="font-size: 0.9rem;">Address</label>
                                <div class="input-group">
                                    <span class="input-group-text" style="background: #f8f9fa; border: 1px solid #e2e8f0; font-size: 0.8rem;">
                                        <i class="bi bi-geo-alt"></i>
                                    </span>
                                    <input
                                        type="text"
                                        class="form-control border-0 ps-0"
                                        id="address"
                                        v-model="contact.address"
                                        placeholder="Enter address"
                                        style="border-left: 1px solid #e2e8f0 !important; font-size: 0.9rem;"
                                    >
                                </div>
                            </div>
                        </div>
                        <div class="d-flex gap-2 mt-3">
                            <button type="submit" class="btn btn-primary flex-fill btn-sm" style="border-radius: 8px; font-weight: 500; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; padding: 8px 0; font-size: 0.9rem;">
                                <i class="bi bi-plus-circle me-1"></i> Add Contact
                            </button>
                            <button type="button" @click="$emit('cancel')" class="btn btn-outline-secondary flex-fill btn-sm" style="border-radius: 8px; font-weight: 500; font-size: 0.9rem;">
                                <i class="bi bi-x me-1"></i> Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `
};

// Login Component
const Login = {
    name: 'Login',
    emits: ['login', 'navigate-to-register'],
    data() {
        return {
            credentials: {
                username: '',
                password: ''
            }
        };
    },
    template: `
        <div class="login position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
            <div class="container-fluid px-3">
                <div class="row justify-content-center align-items-center" style="min-height: 100vh;">
                    <div class="col-xl-4 col-lg-5 col-md-6 col-sm-8">
                        <div class="card shadow-lg border-0 rounded-3" style="backdrop-filter: blur(10px); background: rgba(255, 255, 255, 0.95);">
                            <div class="card-body p-3 p-md-4">
                                <div class="text-center mb-3">
                                    <div class="mb-2">
                                        <i class="bi bi-people-circle" style="font-size: 2.5rem; color: #667eea;"></i>
                                    </div>
                                    <h3 class="fw-bold mb-1" style="color: #2d3748;">Welcome</h3>
                                    <p class="text-muted mb-0" style="font-size: 0.9rem;">Sign in to your account</p>
                                </div>
                                <form @submit.prevent="submitForm">
                                    <div class="mb-3">
                                        <label for="loginUsername" class="form-label fw-medium mb-1" style="font-size: 0.9rem;">Username</label>
                                        <div class="input-group">
                                            <span class="input-group-text" style="background: #f8f9fa; border: 1px solid #e2e8f0;">
                                                <i class="bi bi-person" style="font-size: 0.9rem;"></i>
                                            </span>
                                            <input
                                                type="text"
                                                class="form-control border-0 ps-0"
                                                id="loginUsername"
                                                v-model="credentials.username"
                                                required
                                                style="border-left: 1px solid #e2e8f0 !important;"
                                            >
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label for="loginPassword" class="form-label fw-medium mb-1" style="font-size: 0.9rem;">Password</label>
                                        <div class="input-group">
                                            <span class="input-group-text" style="background: #f8f9fa; border: 1px solid #e2e8f0;">
                                                <i class="bi bi-lock" style="font-size: 0.9rem;"></i>
                                            </span>
                                            <input
                                                type="password"
                                                class="form-control border-0 ps-0"
                                                id="loginPassword"
                                                v-model="credentials.password"
                                                required
                                                style="border-left: 1px solid #e2e8f0 !important;"
                                            >
                                        </div>
                                    </div>
                                    <div class="d-grid mb-3">
                                        <button type="submit" class="btn" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; color: white; padding: 10px 0; font-weight: 500; transition: all 0.3s ease; font-size: 0.95rem;">
                                            Sign In
                                        </button>
                                    </div>
                                </form>
                                <div class="text-center">
                                    <p class="mb-0 text-muted" style="font-size: 0.85rem;">Don't have an account?
                                        <a href="#" @click="$emit('navigate-to-register')" class="fw-bold" style="color: #667eea; text-decoration: none; font-size: 0.85rem;">Sign up</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    methods: {
        submitForm() {
            // Basic validation
            if (!this.credentials.username || !this.credentials.password) {
                alert('Please fill in all fields');
                return;
            }

            this.$emit('login', { ...this.credentials });
        }
    }
};

// Register Component
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
            }
        };
    },
    template: `
        <div class="register position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); min-height: 100vh;">
            <div class="container-fluid px-3">
                <div class="row justify-content-center align-items-center" style="min-height: 100vh;">
                    <div class="col-xl-4 col-lg-5 col-md-6 col-sm-8">
                        <div class="card shadow-lg border-0 rounded-3" style="backdrop-filter: blur(10px); background: rgba(255, 255, 255, 0.95);">
                            <div class="card-body p-3 p-md-4">
                                <div class="text-center mb-3">
                                    <div class="mb-2">
                                        <i class="bi bi-person-plus" style="font-size: 2.5rem; color: #f093fb;"></i>
                                    </div>
                                    <h3 class="fw-bold mb-1" style="color: #2d3748;">Create Account</h3>
                                    <p class="text-muted mb-0" style="font-size: 0.9rem;">Join our community today</p>
                                </div>
                                <form @submit.prevent="submitForm">
                                    <div class="mb-3">
                                        <label for="registerUsername" class="form-label fw-medium mb-1" style="font-size: 0.9rem;">Username</label>
                                        <div class="input-group">
                                            <span class="input-group-text" style="background: #f8f9fa; border: 1px solid #e2e8f0;">
                                                <i class="bi bi-person" style="font-size: 0.9rem;"></i>
                                            </span>
                                            <input
                                                type="text"
                                                class="form-control border-0 ps-0"
                                                id="registerUsername"
                                                v-model="credentials.username"
                                                required
                                                minlength="3"
                                                style="border-left: 1px solid #e2e8f0 !important;"
                                            >
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label for="registerEmail" class="form-label fw-medium mb-1" style="font-size: 0.9rem;">Email</label>
                                        <div class="input-group">
                                            <span class="input-group-text" style="background: #f8f9fa; border: 1px solid #e2e8f0;">
                                                <i class="bi bi-envelope" style="font-size: 0.9rem;"></i>
                                            </span>
                                            <input
                                                type="email"
                                                class="form-control border-0 ps-0"
                                                id="registerEmail"
                                                v-model="credentials.email"
                                                required
                                                style="border-left: 1px solid #e2e8f0 !important;"
                                            >
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label for="registerPassword" class="form-label fw-medium mb-1" style="font-size: 0.9rem;">Password</label>
                                        <div class="input-group">
                                            <span class="input-group-text" style="background: #f8f9fa; border: 1px solid #e2e8f0;">
                                                <i class="bi bi-lock" style="font-size: 0.9rem;"></i>
                                            </span>
                                            <input
                                                type="password"
                                                class="form-control border-0 ps-0"
                                                id="registerPassword"
                                                v-model="credentials.password"
                                                required
                                                minlength="6"
                                                style="border-left: 1px solid #e2e8f0 !important;"
                                            >
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label for="confirmPassword" class="form-label fw-medium mb-1" style="font-size: 0.9rem;">Confirm Password</label>
                                        <div class="input-group">
                                            <span class="input-group-text" style="background: #f8f9fa; border: 1px solid #e2e8f0;">
                                                <i class="bi bi-shield-lock" style="font-size: 0.9rem;"></i>
                                            </span>
                                            <input
                                                type="password"
                                                class="form-control border-0 ps-0"
                                                id="confirmPassword"
                                                v-model="credentials.confirmPassword"
                                                required
                                                minlength="6"
                                                style="border-left: 1px solid #e2e8f0 !important;"
                                            >
                                        </div>
                                    </div>
                                    <div class="d-grid mb-3">
                                        <button type="submit" class="btn" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border: none; color: white; padding: 10px 0; font-weight: 500; transition: all 0.3s ease; font-size: 0.95rem;">
                                            Create Account
                                        </button>
                                    </div>
                                </form>
                                <div class="text-center">
                                    <p class="mb-0 text-muted" style="font-size: 0.85rem;">Already have an account?
                                        <a href="#" @click="$emit('navigate-to-login')" class="fw-bold" style="color: #f093fb; text-decoration: none; font-size: 0.85rem;">Sign in</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    methods: {
        submitForm() {
            // Basic validation
            if (!this.credentials.username || !this.credentials.email || !this.credentials.password || !this.credentials.confirmPassword) {
                alert('Please fill in all fields');
                return;
            }

            if (this.credentials.password !== this.credentials.confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            if (this.credentials.password.length < 6) {
                alert('Password must be at least 6 characters');
                return;
            }

            this.$emit('register', {
                username: this.credentials.username,
                email: this.credentials.email,
                password: this.credentials.password
            });
        }
    }
};

// Main App
const App = {
    data() {
        return {
            currentView: 'contact-list', // Default view
            currentUser: { authenticated: false, username: null },
            searchTerm: '',
            contacts: [],
            selectedContact: null,
            apiUrl: '/api',
            token: localStorage.getItem('token') || null
        };
    },
    mounted() {
        // Check if user is logged in
        if (this.token) {
            // Verify token and get user info
            this.verifyToken();
        } else {
            // Redirect to login if not authenticated
            this.currentView = 'login';
        }
    },
    created() {
        // Initialize debounced search
        this.debouncedSearch = this.debounce(this.searchContacts, 300);
    },
    methods: {
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
                // Extract username from token (JWT) or use a fallback method
                if (this.token) {
                    // If we stored the username in localStorage with the token, we can retrieve it
                    // For now, we'll use a fallback approach
                    // We could implement a /me endpoint in the backend to get user info
                    const response = await axios.get(`${this.apiUrl}/contacts`, {
                        headers: { Authorization: `Bearer ${this.token}` }
                    });

                    // Since we don't have a specific endpoint to get user info,
                    // we'll assume the user is valid and try to get the username from localStorage
                    let storedUsername = localStorage.getItem('username') || 'User';
                    this.currentUser = { authenticated: true, username: storedUsername };
                }
            } catch (error) {
                // Check if it's a network error (backend not running) or authentication error
                if (error.response && error.response.status === 401) {
                    // Token is invalid, redirect to login
                    this.logout();
                } else {
                    // Network error (backend not running), could inform user
                    console.log('Backend not reachable, token validation pending until backend is available');
                    let storedUsername = localStorage.getItem('username') || 'User';
                    this.currentUser = { authenticated: true, username: storedUsername }; // Assume valid until backend is reachable
                    this.currentView = 'contact-list'; // Allow navigation but show error state
                }
            }
        },
        login(credentials) {
            // Backend expects JSON format for login
            axios.post(`${this.apiUrl}/login`, {
                username: credentials.username,
                password: credentials.password
            })
            .then(response => {
                this.token = response.data.access_token;
                localStorage.setItem('token', this.token);
                localStorage.setItem('username', credentials.username); // Store username in localStorage
                this.currentUser = { authenticated: true, username: credentials.username };
                this.currentView = 'contact-list';
            })
            .catch(error => {
                if (error.response) {
                    alert('Login failed: ' + error.response.data.detail);
                } else {
                    alert('Login failed: Network error - please make sure the backend server is running');
                }
            });
        },
        register(credentials) {
            // For register, we should send as JSON since it matches the UserCreate schema
            axios.post(`${this.apiUrl}/register`, {
                username: credentials.username,
                email: credentials.email,
                password: credentials.password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                this.token = response.data.access_token;
                localStorage.setItem('token', this.token);
                localStorage.setItem('username', credentials.username); // Store username in localStorage
                this.currentUser = { authenticated: true, username: credentials.username };
                this.currentView = 'contact-list';
            })
            .catch(error => {
                if (error.response) {
                    alert('Registration failed: ' + error.response.data.detail);
                } else {
                    alert('Registration failed: Network error - please make sure the backend server is running');
                }
            });
        },
        logout() {
            this.token = null;
            this.currentUser = { authenticated: false, username: null };
            localStorage.removeItem('token');
            localStorage.removeItem('username'); // Remove username from localStorage
            this.currentView = 'login';
        },
        navigateTo(view) {
            this.currentView = view;
        },
        loadContacts() {
            if (this.token) {
                axios.get(`${this.apiUrl}/contacts`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                })
                .then(response => {
                    this.contacts = response.data;
                })
                .catch(error => {
                    if (error.response) {
                        // Server responded with error status
                        console.error('Error fetching contacts:', error.response.data);
                    } else if (error.request) {
                        // Request made but no response received (backend down)
                        console.warn('Backend not reachable, showing empty contact list');
                    } else {
                        // Something else happened
                        console.error('Error:', error.message);
                    }
                });
            }
        },
        searchContacts() {
            if (this.token) {
                if (this.searchTerm) {
                    // Search with the term
                    axios.get(`${this.apiUrl}/contacts?search=${this.searchTerm}`, {
                        headers: {
                            'Authorization': `Bearer ${this.token}`
                        }
                    })
                    .then(response => {
                        this.contacts = response.data;
                    })
                    .catch(error => {
                        if (error.response) {
                            console.error('Error searching contacts:', error.response.data);
                        } else if (error.request) {
                            console.warn('Backend not reachable for search');
                        } else {
                            console.error('Error:', error.message);
                        }
                    });
                } else {
                    // If no search term, load all contacts
                    this.loadContacts();
                }
            }
        },
        loadContact(id) {
            if (this.token) {
                axios.get(`${this.apiUrl}/contacts/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                })
                .then(response => {
                    this.selectedContact = response.data;
                    this.currentView = 'contact-detail';
                })
                .catch(error => {
                    if (error.response) {
                        console.error('Error fetching contact:', error.response.data);
                        alert('Error fetching contact: ' + error.response.data.detail);
                    } else if (error.request) {
                        console.warn('Backend not reachable when fetching contact');
                        alert('Backend not reachable - please make sure the server is running');
                    } else {
                        console.error('Error:', error.message);
                        alert('Error fetching contact');
                    }
                });
            }
        },
        createContact(contactData) {
            if (this.token) {
                axios.post(`${this.apiUrl}/contacts`, contactData, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    this.contacts.push(response.data);
                    this.navigateTo('contact-list');
                })
                .catch(error => {
                    if (error.response) {
                        alert('Error creating contact: ' + error.response.data.detail);
                    } else {
                        alert('Error creating contact: Network error - please make sure the backend server is running');
                    }
                });
            }
        },
        updateContact(id, contactData) {
            if (this.token) {
                axios.put(`${this.apiUrl}/contacts/${id}`, contactData, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    // Find and update the contact in the local array
                    const index = this.contacts.findIndex(contact => contact.id === id);
                    if (index !== -1) {
                        this.contacts[index] = response.data;
                    }
                    this.selectedContact = response.data;
                    this.navigateTo('contact-list');
                })
                .catch(error => {
                    if (error.response) {
                        alert('Error updating contact: ' + error.response.data.detail);
                    } else {
                        alert('Error updating contact: Network error - please make sure the backend server is running');
                    }
                });
            }
        },
        deleteContact(id) {
            if (this.token) {
                axios.delete(`${this.apiUrl}/contacts/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                })
                .then(() => {
                    // Remove the contact from the local array
                    this.contacts = this.contacts.filter(contact => contact.id !== id);
                    this.navigateTo('contact-list');
                })
                .catch(error => {
                    if (error.response) {
                        alert('Error deleting contact: ' + error.response.data.detail);
                    } else {
                        alert('Error deleting contact: Network error - please make sure the backend server is running');
                    }
                });
            }
        }
    },
    computed: {
        isAuthenticated() {
            return !!this.token;
        }
    },
    template: `
        <div class="app position-relative" style="min-height: 100vh; background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);">
            <!-- Navigation Bar -->
            <nav v-if="isAuthenticated" class="navbar navbar-expand-lg navbar-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255,255,255,0.1);">
                <div class="container-fluid px-4">
                    <a class="navbar-brand d-flex align-items-center" href="#" @click="navigateTo('contact-list')">
                        <i class="bi bi-people me-2"></i>
                        <span class="fw-bold">Phonebook Pro</span>
                    </a>
                    <div class="navbar-nav ms-auto d-flex align-items-center">
                        <div class="d-flex align-items-center me-3 text-light">
                            <i class="bi bi-person-circle me-2"></i>
                            <span class="d-none d-md-block">Welcome, {{ currentUser && currentUser.username ? currentUser.username : 'User' }}</span>
                        </div>
                        <button class="btn btn-light me-2" @click="navigateTo('create-contact')" style="border-radius: 8px; font-weight: 500;">
                            <i class="bi bi-person-plus me-1"></i> Add Contact
                        </button>
                        <button class="btn btn-outline-light" @click="logout" style="border-radius: 8px; font-weight: 500;">
                            <i class="bi bi-box-arrow-right me-1"></i> Logout
                        </button>
                    </div>
                </div>
            </nav>

            <!-- Search Bar (when authenticated) -->
            <div v-if="isAuthenticated" class="container-fluid px-4 py-3">
                <div class="row justify-content-center">
                    <div class="col-xl-6 col-lg-8 col-md-10">
                        <div class="position-relative">
                            <input
                                type="text"
                                class="form-control form-control-lg ps-5"
                                placeholder="Search contacts by name or phone..."
                                v-model="searchTerm"
                                @input="debouncedSearch"
                                style="border-radius: 25px; padding: 15px 20px; border: none; box-shadow: 0 4px 20px rgba(0,0,0,0.08); transition: all 0.3s ease;"
                            >
                            <i class="bi bi-search position-absolute" style="left: 25px; top: 50%; transform: translateY(-50%); color: #a0aec0;"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Content Area -->
            <div class="container-fluid px-4 flex-grow-1">
                <div class="row justify-content-center">
                    <div class="col-12">
                        <!-- Contact List View -->
                        <contact-list
                            v-if="currentView === 'contact-list' && isAuthenticated"
                            :contacts="contacts"
                            @load-contacts="loadContacts"
                            @view-contact="loadContact"
                            @add-contact="navigateTo('create-contact')"
                        />

                        <!-- Contact Detail View -->
                        <contact-detail
                            v-if="currentView === 'contact-detail' && isAuthenticated"
                            :contact="selectedContact"
                            @update-contact="updateContact"
                            @delete-contact="deleteContact"
                            @back-to-list="navigateTo('contact-list')"
                        />

                        <!-- Create Contact View -->
                        <create-contact
                            v-if="currentView === 'create-contact' && isAuthenticated"
                            @create-contact="createContact"
                            @cancel="navigateTo('contact-list')"
                        />

                        <!-- Login View -->
                        <login
                            v-if="currentView === 'login'"
                            @login="login"
                            @navigate-to-register="navigateTo('register')"
                        />

                        <!-- Register View -->
                        <register
                            v-if="currentView === 'register'"
                            @register="register"
                            @navigate-to-login="navigateTo('login')"
                        />
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <footer v-if="isAuthenticated" class="footer py-3 text-center mt-auto" style="background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%); color: white; position: absolute; bottom: 0; width: 100%;">
                <div class="container-fluid px-4">
                    <!-- Removed copyright text to prevent blocking pagination -->
                </div>
            </footer>
        </div>
    `
};

// Create the app instance
const app = createApp(App);

// Register components
app.component('contact-list', ContactList);
app.component('contact-detail', ContactDetail);
app.component('create-contact', CreateContact);
app.component('login', Login);
app.component('register', Register);

// Mount the app
app.mount('#app');