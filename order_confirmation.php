<?php
$page_title = "Konfirmasi Pesanan - Pustaka Ilmu";
include 'includes/header.php';
require_once 'config/database.php';

// Check if order_id is provided
$order_id = $_GET['order_id'] ?? null;
$order = null;
$order_items = [];

if ($order_id) {
    try {
        // Get order details
        $stmt = $pdo->prepare("SELECT * FROM orders WHERE id = ?");
        $stmt->execute([$order_id]);
        $order = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($order) {
            // Get order items with book details
            $stmt = $pdo->prepare("
                SELECT oi.*, b.title, b.author, b.image_url 
                FROM order_items oi
                JOIN books b ON oi.book_id = b.id
                WHERE oi.order_id = ?
            ");
            $stmt->execute([$order_id]);
            $order_items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
    } catch(PDOException $e) {
        $error_message = "Error loading order details.";
    }
}

if (!$order) {
    header('Location: index.php');
    exit;
}
?>

<!-- Page Header -->
<section class="hero-section">
    <div class="container">
        <div class="row justify-content-center text-center">
            <div class="col-lg-8">
                <div class="success-icon mb-4">
                    <i class="fas fa-check-circle fa-5x text-success"></i>
                </div>
                <h1 class="display-4 fw-bold mb-3 text-success">Pesanan Berhasil!</h1>
                <p class="lead text-muted">
                    Terima kasih atas pesanan Anda. Kami akan segera memproses pesanan Anda.
                </p>
            </div>
        </div>
    </div>
</section>

<!-- Order Details -->
<section class="py-5">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <!-- Order Summary -->
                <div class="card shadow-sm mb-4">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0">
                            <i class="fas fa-receipt me-2"></i>
                            Detail Pesanan #<?php echo str_pad($order['id'], 6, '0', STR_PAD_LEFT); ?>
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <h6 class="fw-bold text-primary">Informasi Pelanggan</h6>
                                <p class="mb-1"><strong>Nama:</strong> <?php echo htmlspecialchars($order['customer_name']); ?></p>
                                <p class="mb-1"><strong>Email:</strong> <?php echo htmlspecialchars($order['customer_email']); ?></p>
                                <p class="mb-1"><strong>Telepon:</strong> <?php echo htmlspecialchars($order['customer_phone']); ?></p>
                                <p class="mb-0"><strong>Alamat:</strong><br>
                                    <?php echo nl2br(htmlspecialchars($order['customer_address'])); ?>
                                </p>
                            </div>
                            <div class="col-md-6">
                                <h6 class="fw-bold text-primary">Informasi Pesanan</h6>
                                <p class="mb-1"><strong>Tanggal Pesanan:</strong> 
                                    <?php echo date('d/m/Y H:i', strtotime($order['created_at'])); ?>
                                </p>
                                <p class="mb-1"><strong>Status:</strong> 
                                    <span class="badge bg-warning text-dark">
                                        <?php 
                                        $status_text = [
                                            'pending' => 'Menunggu Konfirmasi',
                                            'processing' => 'Sedang Diproses',
                                            'completed' => 'Selesai',
                                            'cancelled' => 'Dibatalkan'
                                        ];
                                        echo $status_text[$order['status']] ?? $order['status'];
                                        ?>
                                    </span>
                                </p>
                                <p class="mb-1"><strong>Total Pembayaran:</strong> 
                                    <span class="text-success fw-bold fs-5">
                                        Rp <?php echo number_format($order['total_amount'], 0, ',', '.'); ?>
                                    </span>
                                </p>
                                <?php if (!empty($order['notes'])): ?>
                                <p class="mb-0"><strong>Catatan:</strong><br>
                                    <?php echo nl2br(htmlspecialchars($order['notes'])); ?>
                                </p>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Order Items -->
                <div class="card shadow-sm mb-4">
                    <div class="card-header bg-light">
                        <h5 class="mb-0">
                            <i class="fas fa-list me-2"></i>
                            Item yang Dipesan
                        </h5>
                    </div>
                    <div class="card-body p-0">
                        <?php foreach ($order_items as $index => $item): ?>
                            <div class="order-item p-3 <?php echo $index < count($order_items) - 1 ? 'border-bottom' : ''; ?>">
                                <div class="row align-items-center">
                                    <div class="col-md-2">
                                        <img src="<?php echo htmlspecialchars($item['image_url']); ?>" 
                                             alt="<?php echo htmlspecialchars($item['title']); ?>"
                                             class="img-fluid rounded shadow-sm"
                                             style="max-height: 80px; object-fit: cover;">
                                    </div>
                                    <div class="col-md-6">
                                        <h6 class="fw-bold mb-1"><?php echo htmlspecialchars($item['title']); ?></h6>
                                        <p class="text-muted small mb-0">oleh <?php echo htmlspecialchars($item['author']); ?></p>
                                    </div>
                                    <div class="col-md-2 text-center">
                                        <span class="fw-bold"><?php echo $item['quantity']; ?>x</span>
                                    </div>
                                    <div class="col-md-2 text-end">
                                        <p class="fw-bold text-primary mb-0">
                                            Rp <?php echo number_format($item['price'] * $item['quantity'], 0, ',', '.'); ?>
                                        </p>
                                        <small class="text-muted">
                                            @ Rp <?php echo number_format($item['price'], 0, ',', '.'); ?>
                                        </small>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                    <div class="card-footer bg-light">
                        <div class="row">
                            <div class="col-md-8">
                                <p class="mb-0"><strong>Total Item:</strong> <?php echo array_sum(array_column($order_items, 'quantity')); ?> buku</p>
                            </div>
                            <div class="col-md-4 text-end">
                                <p class="mb-0 fs-5"><strong>Total: Rp <?php echo number_format($order['total_amount'], 0, ',', '.'); ?></strong></p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Next Steps -->
                <div class="card shadow-sm mb-4">
                    <div class="card-header bg-info text-white">
                        <h5 class="mb-0">
                            <i class="fas fa-info-circle me-2"></i>
                            Langkah Selanjutnya
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-4 text-center mb-3">
                                <i class="fas fa-envelope fa-2x text-primary mb-2"></i>
                                <h6>1. Konfirmasi Email</h6>
                                <p class="small text-muted">Anda akan menerima email konfirmasi pesanan dalam beberapa menit.</p>
                            </div>
                            <div class="col-md-4 text-center mb-3">
                                <i class="fas fa-credit-card fa-2x text-success mb-2"></i>
                                <h6>2. Pembayaran</h6>
                                <p class="small text-muted">Tim kami akan mengirim detail pembayaran melalui WhatsApp/Email.</p>
                            </div>
                            <div class="col-md-4 text-center mb-3">
                                <i class="fas fa-shipping-fast fa-2x text-warning mb-2"></i>
                                <h6>3. Pengiriman</h6>
                                <p class="small text-muted">Pesanan akan diproses dan dikirim dalam 1-3 hari kerja.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Contact Information -->
                <div class="card shadow-sm mb-4">
                    <div class="card-body text-center">
                        <h6 class="card-title">Butuh Bantuan?</h6>
                        <p class="card-text text-muted">
                            Jika Anda memiliki pertanyaan tentang pesanan ini, jangan ragu untuk menghubungi kami.
                        </p>
                        <div class="row justify-content-center">
                            <div class="col-auto">
                                <a href="mailto:kontak@pustakailmu.com" class="btn btn-outline-primary btn-sm">
                                    <i class="fas fa-envelope me-1"></i>
                                    Email
                                </a>
                            </div>
                            <div class="col-auto">
                                <a href="tel:02112345678" class="btn btn-outline-success btn-sm">
                                    <i class="fas fa-phone me-1"></i>
                                    Telepon
                                </a>
                            </div>
                            <div class="col-auto">
                                <a href="contact.php" class="btn btn-outline-info btn-sm">
                                    <i class="fas fa-comments me-1"></i>
                                    Kontak
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="text-center">
                    <a href="index.php" class="btn btn-primary btn-lg me-3">
                        <i class="fas fa-home me-2"></i>
                        Kembali ke Beranda
                    </a>
                    <a href="books.php" class="btn btn-outline-primary btn-lg">
                        <i class="fas fa-book me-2"></i>
                        Belanja Lagi
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Print Order Button -->
<div class="d-print-none">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-8 text-center">
                <button onclick="window.print()" class="btn btn-secondary">
                    <i class="fas fa-print me-2"></i>
                    Cetak Pesanan
                </button>
            </div>
        </div>
    </div>
</div>

<style>
@media print {
    .hero-section {
        page-break-inside: avoid;
    }
    .btn, .d-print-none {
        display: none !important;
    }
}
</style>

<?php include 'includes/footer.php'; ?>