    <!-- Footer -->
    <footer class="footer text-center mt-5">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <p class="mb-2">&copy; 2025 Toko Buku Pustaka Ilmu. Dibuat di Bekasi.</p>
                    <p class="opacity-75">Hubungi kami: kontak@pustakailmu.com</p>
                </div>
            </div>
        </div>
    </footer>

    <!-- Notification -->
    <div id="notification" class="notification d-none">
        ✅ Added to Cart!
    </div>

    <!-- Bootstrap JavaScript -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Custom JavaScript -->
    <script>
        // Detect if device supports touch
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Cart functionality
        function addToCart(bookId) {
            return fetch('add_to_cart.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'book_id=' + bookId
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update cart count
                    const cartBadge = document.querySelector('.cart-badge');
                    if (cartBadge) {
                        cartBadge.textContent = data.cart_count;
                    } else if (data.cart_count > 0) {
                        // Create badge if it doesn't exist
                        const cartIcon = document.querySelector('.cart-icon');
                        const badge = document.createElement('span');
                        badge.className = 'cart-badge';
                        badge.textContent = data.cart_count;
                        cartIcon.appendChild(badge);
                    }
                    
                    // Show notification
                    showNotification();
                    return data;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                throw error;
            });
        }
        
        function showNotification() {
            const notification = document.getElementById('notification');
            if (notification) {
                notification.classList.remove('d-none');
                
                setTimeout(() => {
                    notification.classList.add('d-none');
                }, 3000); // Longer timeout for mobile
            }
        }
        
        // Enhanced mobile support for book cards
        document.addEventListener('DOMContentLoaded', function() {
            // Add touch support for book cards
            const bookCards = document.querySelectorAll('.book-card');
            
            bookCards.forEach(card => {
                if (isTouchDevice) {
                    // Add touch events for mobile
                    card.addEventListener('touchstart', function() {
                        this.classList.add('touch-active');
                    });
                    
                    card.addEventListener('touchend', function() {
                        setTimeout(() => {
                            this.classList.remove('touch-active');
                        }, 300);
                    });
                }
                
                // Ensure buttons are accessible on mobile
                const buyButton = card.querySelector('.btn-buy');
                if (buyButton && isTouchDevice) {
                    buyButton.style.opacity = '1';
                    buyButton.style.transform = 'translateX(-50%) translateY(0)';
                }
            });
            
            // Improve mobile navigation
            const navbarToggler = document.querySelector('.navbar-toggler');
            const navbarCollapse = document.querySelector('#navbarNav');
            
            if (navbarToggler && navbarCollapse && isTouchDevice) {
                navbarToggler.addEventListener('click', function() {
                    // Add small delay to ensure Bootstrap has time to process
                    setTimeout(() => {
                        const isExpanded = this.getAttribute('aria-expanded') === 'true';
                        if (isExpanded) {
                            navbarCollapse.classList.add('show');
                        }
                    }, 100);
                });
            }
        });
        
        // Smooth scrolling for anchor links with mobile optimization
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Make addToCart globally available
        window.addToCart = addToCart;
    </script>
</body>
</html>