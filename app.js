// app.js
document.addEventListener('DOMContentLoaded', function() {
    // Product Data
    const products = [
        {
            id: 1,
            name: "Quantum Headphones",
            description: "Noise-cancelling wireless headphones with 40hr battery life.",
            price: 299,
            oldPrice: 399,
            category: "headphones",
            imageColor: "bg-blue-100 dark:bg-blue-900"
        },
        {
            id: 2,
            name: "Nova Smart Watch",
            description: "Advanced health tracking and always-on display.",
            price: 499,
            oldPrice: null,
            category: "smartwatch",
            imageColor: "bg-green-100 dark:bg-green-900"
        },
        {
            id: 3,
            name: "Edge Pro Phone",
            description: "Flagship smartphone with revolutionary camera system.",
            price: 1199,
            oldPrice: 1299,
            category: "phone",
            imageColor: "bg-purple-100 dark:bg-purple-900"
        },
        {
            id: 4,
            name: "Aura Earbuds",
            description: "True wireless earbuds with spatial audio.",
            price: 199,
            oldPrice: 249,
            category: "headphones",
            imageColor: "bg-pink-100 dark:bg-pink-900"
        },
        {
            id: 5,
            name: "Chrono Watch",
            description: "Premium smartwatch with titanium casing.",
            price: 699,
            oldPrice: null,
            category: "smartwatch",
            imageColor: "bg-yellow-100 dark:bg-yellow-900"
        },
        {
            id: 6,
            name: "Power Bank 100W",
            description: "Ultra-fast charging portable power bank.",
            price: 89,
            oldPrice: 129,
            category: "accessory",
            imageColor: "bg-red-100 dark:bg-red-900"
        },
        {
            id: 7,
            name: "Vision Pro Glasses",
            description: "Augmented reality glasses with 4K displays.",
            price: 2499,
            oldPrice: 2999,
            category: "accessory",
            imageColor: "bg-indigo-100 dark:bg-indigo-900"
        },
        {
            id: 8,
            name: "Stream Deck",
            description: "Modular controller for creators and streamers.",
            price: 149,
            oldPrice: null,
            category: "accessory",
            imageColor: "bg-gray-100 dark:bg-gray-800"
        }
    ];

    // Cart State
    let cart = JSON.parse(localStorage.getItem('glovance_cart')) || [];
    let currentFilter = 'all';

    // DOM Elements
    const productGrid = document.getElementById('productGrid');
    const cartButton = document.getElementById('cartButton');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productModal = document.getElementById('productModal');
    const closeModal = document.getElementById('closeModal');
    const modalAddToCart = document.getElementById('modalAddToCart');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalPrice = document.getElementById('modalPrice');
    const modalOldPrice = document.getElementById('modalOldPrice');
    const testimonialCards = document.querySelectorAll('.testimonial-card');

    // Current product in modal
    let currentProduct = null;

    // Initialize
    init();

    function init() {
        renderProducts();
        updateCart();
        setupEventListeners();
        initAnimations();
    }

    function setupEventListeners() {
        // Cart
        cartButton.addEventListener('click', toggleCart);
        closeCart.addEventListener('click', toggleCart);
        
        // Filters
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.dataset.filter;
                renderProducts();
            });
        });

        // Modal
        closeModal.addEventListener('click', () => {
            productModal.classList.add('hidden');
        });

        modalAddToCart.addEventListener('click', () => {
            if (currentProduct) {
                addToCart(currentProduct);
                productModal.classList.add('hidden');
            }
        });

        // Close modal when clicking outside
        productModal.addEventListener('click', (e) => {
            if (e.target === productModal) {
                productModal.classList.add('hidden');
            }
        });
    }

    function renderProducts() {
        productGrid.innerHTML = '';
        
        const filteredProducts = currentFilter === 'all' 
            ? products 
            : products.filter(p => p.category === currentFilter);
        
        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg';
            productCard.innerHTML = `
                <div class="${product.imageColor} h-48 rounded-xl mb-6 flex items-center justify-center">
                    <div class="w-32 h-32 bg-white dark:bg-gray-800 rounded-lg opacity-50"></div>
                </div>
                <h3 class="text-xl font-bold mb-2">${product.name}</h3>
                <p class="text-gray-600 dark:text-gray-300 mb-4">${product.description}</p>
                <div class="flex justify-between items-center">
                    <div>
                        <span class="text-2xl font-bold">$${product.price}</span>
                        ${product.oldPrice ? `<span class="line-through text-gray-500 ml-2">$${product.oldPrice}</span>` : ''}
                    </div>
                    <button class="add-to-cart-btn px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold hover:opacity-90 transition-opacity"
                            data-id="${product.id}">
                        Add to Cart
                    </button>
                </div>
            `;
            
            productGrid.appendChild(productCard);
        });

        // Add event listeners to new buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = parseInt(btn.dataset.id);
                const product = products.find(p => p.id === productId);
                addToCart(product);
                
                // Animation feedback
                btn.textContent = 'Added!';
                btn.style.backgroundColor = '#10B981';
                setTimeout(() => {
                    btn.textContent = 'Add to Cart';
                    btn.style.backgroundColor = '';
                }, 1000);
            });
        });

        // Add click event to product cards for modal
        document.querySelectorAll('.product-card').forEach((card, index) => {
            card.addEventListener('click', () => {
                openProductModal(filteredProducts[index]);
            });
        });
    }

    function openProductModal(product) {
        currentProduct = product;
        modalTitle.textContent = product.name;
        modalDescription.textContent = product.description;
        modalPrice.textContent = `$${product.price}`;
        
        if (product.oldPrice) {
            modalOldPrice.textContent = `$${product.oldPrice}`;
            modalOldPrice.classList.remove('hidden');
        } else {
            modalOldPrice.classList.add('hidden');
        }
        
        productModal.classList.remove('hidden');
    }

    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        updateCart();
        saveCart();
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCart();
        saveCart();
    }

    function updateCart() {
        // Update count
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Update sidebar
        renderCartItems();
        
        // Update total
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
    }

    function renderCartItems() {
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="text-center py-8">
                    <i class="fas fa-shopping-cart text-4xl text-gray-400 mb-4"></i>
                    <p class="text-gray-500">Your cart is empty</p>
                </div>
            `;
            return;
        }
        
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'flex items-center border-b border-gray-200 dark:border-gray-700 pb-4';
            cartItem.innerHTML = `
                <div class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg mr-4"></div>
                <div class="flex-grow">
                    <h4 class="font-bold">${item.name}</h4>
                    <p class="text-gray-500">$${item.price} × ${item.quantity}</p>
                </div>
                <div class="text-right">
                    <p class="font-bold mb-2">$${(item.price * item.quantity).toFixed(2)}</p>
                    <button class="remove-item text-red-500 text-sm" data-id="${item.id}">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            `;
            
            cartItems.appendChild(cartItem);
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = parseInt(btn.dataset.id);
                removeFromCart(productId);
            });
        });
    }

    function toggleCart() {
        cartSidebar.classList.toggle('open');
        document.body.style.overflow = cartSidebar.classList.contains('open') ? 'hidden' : '';
    }

    function saveCart() {
        localStorage.setItem('glovance_cart', JSON.stringify(cart));
    }

    function initAnimations() {
        // GSAP Animations
        if (typeof gsap !== 'undefined') {
            // Hero animation
            gsap.from('nav', { 
                duration: 0.8, 
                y: -50, 
                opacity: 0, 
                ease: "power3.out" 
            });
            
            gsap.from('#home h1', { 
                duration: 1, 
                y: 30, 
                opacity: 0, 
                delay: 0.3, 
                ease: "power3.out" 
            });
            
            gsap.from('#home p', { 
                duration: 1, 
                y: 30, 
                opacity: 0, 
                delay: 0.5, 
                ease: "power3.out" 
            });
            
            gsap.from('#home button', { 
                duration: 0.8, 
                y: 30, 
                opacity: 0, 
                delay: 0.7, 
                stagger: 0.1,
                ease: "power3.out" 
            });
            
            // Scroll animations for testimonials
            if (typeof ScrollTrigger !== 'undefined') {
                gsap.utils.toArray('.testimonial-card').forEach((card, i) => {
                    gsap.from(card, {
                        scrollTrigger: {
                            trigger: card,
                            start: "top 80%",
                            toggleActions: "play none none reverse"
                        },
                        // duration: 0.8,
                        // y: 30,
                        // opacity: 1,
                        // delay: i * 0.2,
                        // ease: "power3.out"
                    });
                });
                
                // Animate product cards on scroll
                gsap.utils.toArray('.product-card').forEach((card, i) => {
                    gsap.from(card, {
                        scrollTrigger: {
                            trigger: card,
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        },
                        duration: 0.6,
                        y: 20,
                        opacity: 0,
                        delay: i * 0.1,
                        ease: "power3.out"
                    });
                });
            }
        }
        
        // Fallback CSS animations
        setTimeout(() => {
            testimonialCards.forEach((card, index) => {
                card.style.animationDelay = `${index * 0.2}s`;
                card.classList.add('slide-up');
                card.style.opacity = '1';
            });
        }, 500);
    }

    // Newsletter form handling
    const newsletterForm = document.querySelector('form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // In a real app, you would send this to your backend
            console.log('Newsletter signup:', email);
            
            // Show success message
            alert('Thank you for subscribing! Check your email for 10% off code.');
            this.reset();
        });
    }
});

// Simple fade in for testimonials on scroll
const testimonialObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.transition = 'opacity 0.6s, transform 0.6s';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.testimonial-card').forEach(card => {
    testimonialObserver.observe(card);
});

