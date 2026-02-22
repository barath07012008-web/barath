const products = [
    {
        id: 1,
        name: 'Lakshmi Cooker 3L',
        brand: 'Lakshmi',
        price: 900,
        category: 'cookers',
        icon: 'fa-fire',
        sale: false
    },
    {
        id: 2,
        name: 'Lakshmi Cooker 5L',
        brand: 'Lakshmi',
        price: 1150,
        category: 'cookers',
        icon: 'fa-fire',
        sale: true
    },
    {
        id: 3,
        name: 'V-Guard Tower Fan',
        brand: 'V-Guard',
        price: 3500,
        category: 'fans',
        icon: 'fa-fan',
        sale: false
    },
    {
        id: 4,
        name: 'Usha Table Fan',
        brand: 'Usha',
        price: 2200,
        category: 'fans',
        icon: 'fa-fan',
        sale: false
    },
    {
        id: 5,
        name: 'Preethi 500W Mixer',
        brand: 'Preethi',
        price: 3000,
        category: 'mixers',
        icon: 'fa-blender',
        sale: true
    },
    {
        id: 6,
        name: 'Crompton Iron Box',
        brand: 'Crompton',
        price: 850,
        category: 'iron',
        icon: 'fa-tshirt',
        sale: false
    },
    {
        id: 7,
        name: 'Bajaj 500W Mixer Grinder',
        brand: 'Bajaj',
        price: 2500,
        category: 'mixers',
        icon: 'fa-blender',
        sale: false
    },
    {
        id: 8,
        name: 'Prestige Cooker 2L',
        brand: 'Prestige',
        price: 750,
        category: 'cookers',
        icon: 'fa-fire',
        sale: true
    },
    {
        id: 9,
        name: 'Havells Ceiling Fan',
        brand: 'Havells',
        price: 1800,
        category: 'fans',
        icon: 'fa-fan',
        sale: false
    },
    {
        id: 10,
        name: 'Philips Steam Iron',
        brand: 'Philips',
        price: 1200,
        category: 'iron',
        icon: 'fa-tshirt',
        sale: false
    },
    {
        id: 11,
        name: 'Butterfly Mixer 750W',
        brand: 'Butterfly',
        price: 3500,
        category: 'mixers',
        icon: 'fa-blender',
        sale: true
    },
    {
        id: 12,
        name: 'Orient Wall Fan',
        brand: 'Orient',
        price: 1500,
        category: 'fans',
        icon: 'fa-fan',
        sale: false
    }
];

// ===================================
// Shopping Cart
// ===================================
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ===================================
// DOM Elements
// ===================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const themeToggle = document.getElementById('themeToggle');
const cartBtn = document.getElementById('cartBtn');
const cartDrawer = document.getElementById('cartDrawer');
const closeCart = document.getElementById('closeCart');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const totalAmount = document.getElementById('totalAmount');
const productsGrid = document.getElementById('productsGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const loadingScreen = document.getElementById('loadingScreen');
const toastContainer = document.createElement('div');
toastContainer.className = 'toast-container';
document.body.appendChild(toastContainer);

// ===================================
// Initialize
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    // Hide loading screen
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 1000);

    // Render products
    renderProducts('all');

    // Update cart UI
    updateCartUI();

    // Scroll reveal
    setupScrollReveal();

    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
});

// ===================================
// Navbar Scroll Effect
// ===================================
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===================================
// Mobile Menu Toggle
// ===================================
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close menu when clicking nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// ===================================
// Smooth Scroll & Active Link
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Update active nav link on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
            navLink.classList.add('active');
        }
    });
});

// ===================================
// Dark Mode Toggle
// ===================================
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');

    if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'dark');
    }
});

// ===================================
// Render Products
// ===================================
function renderProducts(filter) {
    const filteredProducts = filter === 'all'
        ? products
        : products.filter(p => p.category === filter);

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <i class="fas ${product.icon}"></i>
                ${product.sale ? '<div class="product-badge">SALE</div>' : ''}
            </div>
            <div class="product-info">
                <div class="product-brand">${product.brand}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">₹${product.price.toLocaleString()}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i>
                    <span>Add to Cart</span>
                </button>
            </div>
        </div>
    `).join('');
}

// ===================================
// Product Filters
// ===================================
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        renderProducts(filter);
    });
});

// ===================================
// Category Card Click
// ===================================
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
        const category = card.getAttribute('data-category');

        // Update filter buttons
        filterBtns.forEach(btn => {
            if (btn.getAttribute('data-filter') === category) {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }
        });

        // Render filtered products
        renderProducts(category);

        // Scroll to products section
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    });
});

// ===================================
// Add to Cart
// ===================================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();

    // Show cart drawer
    // cartDrawer.classList.add('active'); // Removed auto-open to be less intrusive

    // Show toast notification
    showToast(`${product.name} added to cart!`);

    // Add animation feedback
    cartBtn.style.transform = 'scale(1.2)';
    setTimeout(() => {
        cartBtn.style.transform = 'scale(1)';
    }, 300);
}

// ===================================
// Toast Notification
// ===================================
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    }, 3000);
}

// ===================================
// Update Cart UI
// ===================================
function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <i class="fas ${item.icon}"></i>
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="remove-item" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalAmount.textContent = `₹${total.toLocaleString()}`;
}

// ===================================
// Update Quantity
// ===================================
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);

    if (item) {
        item.quantity += change;

        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

// ===================================
// Remove from Cart
// ===================================
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

// ===================================
// Save Cart to LocalStorage
// ===================================
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// ===================================
// Cart Drawer Toggle
// ===================================
cartBtn.addEventListener('click', () => {
    cartDrawer.classList.add('active');
});

closeCart.addEventListener('click', () => {
    cartDrawer.classList.remove('active');
});

// Close cart when clicking outside
document.addEventListener('click', (e) => {
    if (!cartDrawer.contains(e.target) && !cartBtn.contains(e.target)) {
        cartDrawer.classList.remove('active');
    }
});

// ===================================
// Scroll Reveal Animation
// ===================================
function setupScrollReveal() {
    const reveals = document.querySelectorAll('.category-card, .product-card, .offer-card, .testimonial-card');

    const revealOnScroll = () => {
        reveals.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight - 100) {
                element.classList.add('reveal', 'active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check
}

// ===================================
// Search Functionality (Bonus)
// ===================================
function searchProducts(query) {
    const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase())
    );

    productsGrid.innerHTML = filtered.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <i class="fas ${product.icon}"></i>
                ${product.sale ? '<div class="product-badge">SALE</div>' : ''}
            </div>
            <div class="product-info">
                <div class="product-brand">${product.brand}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">₹${product.price.toLocaleString()}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i>
                    <span>Add to Cart</span>
                </button>
            </div>
        </div>
    `).join('');
}

// ===================================
// Checkout (Placeholder)
// ===================================
document.querySelector('.checkout-btn')?.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const message = `Hello! I would like to order:\n\n${cart.map(item =>
        `${item.name} (${item.brand}) x${item.quantity} - ₹${(item.price * item.quantity).toLocaleString()}`
    ).join('\n')}\n\nTotal: ₹${total.toLocaleString()}`;

    const whatsappUrl = `https://wa.me/918973072487?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
});

// ===================================
// Console Welcome Message
// ===================================
console.log('%c🛒 RV prithvik Furniture Electricals', 'color: #f97316; font-size: 20px; font-weight: bold;');
console.log('%cWelcome to our online store!', 'color: #0f172a; font-size: 14px;');
