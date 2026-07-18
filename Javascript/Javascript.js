document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Theme Toggle (Dark/Light Mode) ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const icon = themeToggleBtn.querySelector('i');
    
    // Check local storage for theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if(theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // --- 2. Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const menuIcon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-xmark');
            } else {
                menuIcon.classList.remove('fa-xmark');
                menuIcon.classList.add('fa-bars');
            }
        });
    }

    // --- 3. Counter Animation (Intersection Observer) ---
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000; // ms
                    const increment = target / (duration / 16); // 60fps
                    
                    let current = 0;
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.innerText = Math.ceil(current).toLocaleString();
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target.toLocaleString();
                            if(target === 99) counter.innerText += '%'; // specific styling for %
                        }
                    };
                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    // --- 4. Dynamic Price Calculator (buy-now.html) ---
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        const productSelect = document.getElementById('product');
        const quantityInput = document.getElementById('quantity');
        const customCheck = document.getElementById('custom-name');
        
        const sumBase = document.getElementById('summary-base');
        const sumQty = document.getElementById('summary-qty');
        const sumCustom = document.getElementById('summary-custom');
        const sumTotal = document.getElementById('summary-total');
        const checkoutBtn = document.getElementById('checkout-btn');
        const checkoutMsg = document.getElementById('checkout-msg');

        const calculateTotal = () => {
            const selectedOption = productSelect.options[productSelect.selectedIndex];
            const basePrice = parseFloat(selectedOption.getAttribute('data-price')) || 0;
            const qty = parseInt(quantityInput.value) || 1;
            const customPrice = customCheck.checked ? parseFloat(customCheck.value) : 0;

            const totalCustom = customPrice * qty;
            const subtotal = (basePrice * qty) + totalCustom;

            sumBase.innerText = `$${basePrice.toFixed(2)}`;
            sumQty.innerText = `x ${qty}`;
            sumCustom.innerText = `$${totalCustom.toFixed(2)}`;
            sumTotal.innerText = `$${subtotal.toFixed(2)}`;
        };

        productSelect.addEventListener('change', calculateTotal);
        quantityInput.addEventListener('input', calculateTotal);
        customCheck.addEventListener('change', calculateTotal);

        checkoutBtn.addEventListener('click', () => {
            if (productSelect.value === "0") {
                alert("Please select a kit to proceed.");
                return;
            }
            checkoutBtn.disabled = true;
            checkoutBtn.innerText = "Processing...";
            checkoutMsg.classList.remove('hidden');
            setTimeout(() => {
                checkoutBtn.innerText = "Proceed to Payment";
                checkoutBtn.disabled = false;
                checkoutMsg.classList.add('hidden');
                alert("This is a demo. In production, you would be redirected to Stripe/PayPal.");
            }, 2000);
        });
    }

    // --- 5. Form Validation (request-form.html & contact.html) ---
    const validateForm = (formId, successId) => {
        const form = document.getElementById(formId);
        const successMsg = document.getElementById(successId);
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                let isValid = true;
                const inputs = form.querySelectorAll('input, select, textarea');
                
                inputs.forEach(input => {
                    if (input.hasAttribute('required') && !input.value.trim()) {
                        input.parentElement.classList.add('invalid');
                        isValid = false;
                    } else {
                        input.parentElement.classList.remove('invalid');
                    }
                });

                if (isValid) {
                    successMsg.classList.remove('hidden');
                    form.reset();
                    setTimeout(() => successMsg.classList.add('hidden'), 4000);
                }
            });

            // Remove invalid class on input
            form.querySelectorAll('input, select, textarea').forEach(input => {
                input.addEventListener('input', () => {
                    input.parentElement.classList.remove('invalid');
                });
            });
        }
    };

    validateForm('request-form', 'req-success');
    validateForm('contact-form', 'contact-success');

    // --- 6. FAQ Accordion (contact.html) ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            header.classList.toggle('active');
            if (header.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = 0;
            }
        });
    });
});