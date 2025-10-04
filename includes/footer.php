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
        // Cart functionality
        function addToCart(bookId) {
            fetch('add_to_cart.php', {
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
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
        
        function showNotification() {
            const notification = document.getElementById('notification');
            notification.classList.remove('d-none');
            
            setTimeout(() => {
                notification.classList.add('d-none');
            }, 2000);
        }
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    </script>
</body>
</html>