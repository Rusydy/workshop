<?php
$page_title = "Keranjang Belanja - Pustaka Ilmu";
include 'includes/header.php';
require_once 'config/database.php';

// Get cart items from session
$cart_items = $_SESSION['cart_items'] ?? [];
$cart_books = [];
$total_price = 0;

if (!empty($cart_items)) {
    try {
        $book_ids = array_keys($cart_items);
        $placeholders = str_repeat('?,', count($book_ids) - 1) . '?';
        $stmt = $pdo->prepare("SELECT * FROM books WHERE id IN ($placeholders)");
        $stmt->execute($book_ids);
        $books_data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($books_data as $book) {
            $quantity = $cart_items[$book['id']];
            $subtotal = $book['price'] * $quantity;
            $total_price += $subtotal;
            
            $cart_books[] = [
                'id' => $book['id'],
                'title' => $book['title'],
                'author' => $book['author'],
                'price' => $book['price'],
                'image_url' => $book['image_url'],
                'quantity' => $quantity,
                'subtotal' => $subtotal
            ];
        }
    } catch(PDOException $e) {
        $error_message = "Error loading cart items: " . $e->getMessage();
    }
}
?>

<!-- Page Header -->
<section class="hero-section">
    <div class="container">
        <div class="row justify-content-center text-center">
            <div class="col-lg-8">
                <h1 class="display-4 fw-bold mb-3">Keranjang Belanja</h1>
                <p class="lead text-muted">
                    Tinjau dan kelola item yang akan dibeli
                </p>
            </div>
        </div>
    </div>
</section>

<!-- Cart Content -->
<section class="py-5">
    <div class="container">
        <?php if (empty($cart_books)): ?>
            <!-- Empty Cart -->
            <div class="row justify-content-center">
                <div class="col-lg-6 text-center">
                    <div class="card border-0 shadow-sm">
                        <div class="card-body py-5">
                            <i class="fas fa-shopping-cart fa-4x text-muted mb-4"></i>
                            <h3 class="card-title">Keranjang Kosong</h3>
                            <p class="card-text text-muted mb-4">
                                Belum ada buku yang ditambahkan ke keranjang. 
                                Mari jelajahi koleksi buku kami!
                            </p>
                            <a href="books.php" class="btn btn-primary btn-lg">
                                <i class="fas fa-book me-2"></i>
                                Lihat Koleksi Buku
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        <?php else: ?>
            <!-- Cart Items -->
            <div class="row">
                <!-- Cart Items List -->
                <div class="col-lg-8">
                    <div class="card shadow-sm">
                        <div class="card-header bg-white">
                            <h5 class="mb-0">
                                <i class="fas fa-shopping-cart me-2"></i>
                                Item di Keranjang (<?php echo count($cart_books); ?> jenis buku)
                            </h5>
                        </div>
                        <div class="card-body p-0">
                            <?php foreach ($cart_books as $index => $item): ?>
                                <div class="cart-item p-4 <?php echo $index < count($cart_books) - 1 ? 'border-bottom' : ''; ?>">
                                    <div class="row align-items-center">
                                        <!-- Book Image -->
                                        <div class="col-md-2">
                                            <img src="<?php echo htmlspecialchars($item['image_url']); ?>" 
                                                 alt="<?php echo htmlspecialchars($item['title']); ?>"
                                                 class="img-fluid rounded shadow-sm"
                                                 style="max-height: 100px; object-fit: cover;">
                                        </div>
                                        
                                        <!-- Book Details -->
                                        <div class="col-md-5">
                                            <h6 class="fw-bold mb-1"><?php echo htmlspecialchars($item['title']); ?></h6>
                                            <p class="text-muted small mb-2">oleh <?php echo htmlspecialchars($item['author']); ?></p>
                                            <p class="text-primary fw-bold mb-0">
                                                Rp <?php echo number_format($item['price'], 0, ',', '.'); ?>
                                            </p>
                                        </div>
                                        
                                        <!-- Quantity Controls -->
                                        <div class="col-md-3">
                                            <div class="d-flex align-items-center justify-content-center">
                                                <button class="btn btn-sm btn-outline-secondary" 
                                                        onclick="updateQuantity(<?php echo $item['id']; ?>, -1)">
                                                    <i class="fas fa-minus"></i>
                                                </button>
                                                <span class="mx-3 fw-bold" id="qty-<?php echo $item['id']; ?>">
                                                    <?php echo $item['quantity']; ?>
                                                </span>
                                                <button class="btn btn-sm btn-outline-secondary" 
                                                        onclick="updateQuantity(<?php echo $item['id']; ?>, 1)">
                                                    <i class="fas fa-plus"></i>
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <!-- Subtotal & Remove -->
                                        <div class="col-md-2 text-end">
                                            <p class="fw-bold text-success mb-2" id="subtotal-<?php echo $item['id']; ?>">
                                                Rp <?php echo number_format($item['subtotal'], 0, ',', '.'); ?>
                                            </p>
                                            <button class="btn btn-sm btn-outline-danger" 
                                                    onclick="removeItem(<?php echo $item['id']; ?>)">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                    
                    <!-- Continue Shopping -->
                    <div class="mt-3">
                        <a href="books.php" class="btn btn-outline-primary">
                            <i class="fas fa-arrow-left me-2"></i>
                            Lanjut Belanja
                        </a>
                    </div>
                </div>
                
                <!-- Order Summary -->
                <div class="col-lg-4">
                    <div class="card shadow-sm sticky-top" style="top: 2rem;">
                        <div class="card-header bg-primary text-white">
                            <h5 class="mb-0">
                                <i class="fas fa-receipt me-2"></i>
                                Ringkasan Pesanan
                            </h5>
                        </div>
                        <div class="card-body">
                            <div class="d-flex justify-content-between mb-2">
                                <span>Total Item:</span>
                                <span id="total-items"><?php echo array_sum($cart_items); ?> buku</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span>Subtotal:</span>
                                <span id="subtotal-amount">Rp <?php echo number_format($total_price, 0, ',', '.'); ?></span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span>Ongkos Kirim:</span>
                                <span class="text-success">Gratis</span>
                            </div>
                            <hr>
                            <div class="d-flex justify-content-between mb-3">
                                <strong>Total:</strong>
                                <strong class="text-primary" id="total-amount">
                                    Rp <?php echo number_format($total_price, 0, ',', '.'); ?>
                                </strong>
                            </div>
                            
                            <button class="btn btn-success btn-lg w-100 mb-3" onclick="proceedToCheckout()">
                                <i class="fas fa-credit-card me-2"></i>
                                Lanjut ke Pembayaran
                            </button>
                            
                            <button class="btn btn-outline-danger btn-sm w-100" onclick="clearCart()">
                                <i class="fas fa-trash me-2"></i>
                                Kosongkan Keranjang
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        <?php endif; ?>
    </div>
</section>

<!-- Checkout Modal -->
<div class="modal fade" id="checkoutModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">
                    <i class="fas fa-shopping-bag me-2"></i>
                    Informasi Pengiriman
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form id="checkoutForm" method="POST" action="process_order.php">
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="customer_name" class="form-label">Nama Lengkap *</label>
                                <input type="text" class="form-control" id="customer_name" name="customer_name" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="customer_email" class="form-label">Email *</label>
                                <input type="email" class="form-control" id="customer_email" name="customer_email" required>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="customer_phone" class="form-label">Nomor Telepon *</label>
                                <input type="tel" class="form-control" id="customer_phone" name="customer_phone" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="payment_method" class="form-label">Metode Pembayaran *</label>
                                <select class="form-select" id="payment_method" name="payment_method" required>
                                    <option value="">Pilih Metode Pembayaran</option>
                                    <option value="transfer">Transfer Bank</option>
                                    <option value="cod">Bayar di Tempat (COD)</option>
                                    <option value="ewallet">E-Wallet</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="customer_address" class="form-label">Alamat Lengkap *</label>
                        <textarea class="form-control" id="customer_address" name="customer_address" rows="3" required
                                  placeholder="Masukkan alamat lengkap termasuk kode pos"></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="notes" class="form-label">Catatan Pesanan (Opsional)</label>
                        <textarea class="form-control" id="notes" name="notes" rows="2"
                                  placeholder="Catatan khusus untuk pesanan Anda"></textarea>
                    </div>
                    
                    <!-- Order Summary in Modal -->
                    <div class="card bg-light">
                        <div class="card-body">
                            <h6 class="card-title">Ringkasan Pesanan</h6>
                            <div class="d-flex justify-content-between">
                                <span>Total Pembayaran:</span>
                                <strong class="text-primary">Rp <?php echo number_format($total_price, 0, ',', '.'); ?></strong>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                    <button type="submit" class="btn btn-success">
                        <i class="fas fa-check me-2"></i>
                        Konfirmasi Pesanan
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
// Cart management functions
function updateQuantity(bookId, change) {
    fetch('update_cart.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `book_id=${bookId}&change=${change}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            if (data.quantity === 0) {
                location.reload(); // Reload if item removed
            } else {
                // Update quantity display
                document.getElementById(`qty-${bookId}`).textContent = data.quantity;
                document.getElementById(`subtotal-${bookId}`).textContent = 
                    `Rp ${data.subtotal.toLocaleString('id-ID')}`;
                
                // Update totals
                updateTotals();
            }
        }
    })
    .catch(error => console.error('Error:', error));
}

function removeItem(bookId) {
    if (confirm('Hapus item ini dari keranjang?')) {
        fetch('remove_from_cart.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `book_id=${bookId}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

function clearCart() {
    if (confirm('Kosongkan semua item dari keranjang?')) {
        fetch('clear_cart.php', {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

function updateTotals() {
    // Recalculate totals (simplified - in real app, get from server)
    location.reload();
}

function proceedToCheckout() {
    const modal = new bootstrap.Modal(document.getElementById('checkoutModal'));
    modal.show();
}
</script>

<?php include 'includes/footer.php'; ?>