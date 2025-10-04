<?php
$page_title = "Kontak - Pustaka Ilmu";
include 'includes/header.php';

// Handle form submission
$message_sent = false;
$error_message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $message = trim($_POST['message'] ?? '');
    
    if (empty($name) || empty($email) || empty($message)) {
        $error_message = 'Semua field harus diisi.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error_message = 'Format email tidak valid.';
    } else {
        // Here you would typically save to database or send email
        // For now, we'll just show success message
        $message_sent = true;
    }
}
?>

<!-- Page Header -->
<section class="hero-section">
    <div class="container">
        <div class="row justify-content-center text-center">
            <div class="col-lg-8">
                <h1 class="display-4 fw-bold mb-3">Hubungi Kami</h1>
                <p class="lead text-muted">
                    Ada pertanyaan atau masukan? Kami siap membantu!
                </p>
            </div>
        </div>
    </div>
</section>

<!-- Contact Content -->
<section class="py-5">
    <div class="container">
        <div class="row g-5">
            <!-- Contact Information -->
            <div class="col-lg-6">
                <h2 class="display-6 fw-bold mb-4">Detail Kontak</h2>
                
                <div class="mb-4">
                    <div class="d-flex align-items-start mb-3">
                        <i class="fas fa-map-marker-alt fa-lg text-primary me-3 mt-1"></i>
                        <div>
                            <h5 class="fw-semibold mb-1">Alamat</h5>
                            <p class="text-muted mb-0">Jl. Literasi No. 123, Bekasi, Jawa Barat, 17145</p>
                        </div>
                    </div>
                    
                    <div class="d-flex align-items-start mb-3">
                        <i class="fas fa-envelope fa-lg text-primary me-3 mt-1"></i>
                        <div>
                            <h5 class="fw-semibold mb-1">Email</h5>
                            <p class="mb-0">
                                <a href="mailto:kontak@pustakailmu.com" class="text-primary text-decoration-none">
                                    kontak@pustakailmu.com
                                </a>
                            </p>
                        </div>
                    </div>
                    
                    <div class="d-flex align-items-start mb-3">
                        <i class="fas fa-phone fa-lg text-primary me-3 mt-1"></i>
                        <div>
                            <h5 class="fw-semibold mb-1">Telepon</h5>
                            <p class="text-muted mb-0">(021) 1234 5678</p>
                        </div>
                    </div>
                    
                    <div class="d-flex align-items-start mb-3">
                        <i class="fas fa-clock fa-lg text-primary me-3 mt-1"></i>
                        <div>
                            <h5 class="fw-semibold mb-1">Jam Operasional</h5>
                            <p class="text-muted mb-0">Senin - Jumat, 09:00 - 17:00 WIB</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Contact Form -->
            <div class="col-lg-6">
                <h2 class="display-6 fw-bold mb-4">Kirim Pesan</h2>
                
                <?php if ($message_sent): ?>
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        <i class="fas fa-check-circle me-2"></i>
                        Terima kasih! Pesan Anda telah berhasil dikirim. Kami akan segera menghubungi Anda.
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>
                <?php endif; ?>
                
                <?php if ($error_message): ?>
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <i class="fas fa-exclamation-circle me-2"></i>
                        <?php echo htmlspecialchars($error_message); ?>
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>
                <?php endif; ?>
                
                <form method="POST" action="contact.php">
                    <div class="mb-3">
                        <label for="name" class="form-label fw-semibold">Nama Lengkap</label>
                        <input type="text" 
                               class="form-control form-control-lg" 
                               id="name" 
                               name="name" 
                               value="<?php echo htmlspecialchars($_POST['name'] ?? ''); ?>"
                               required>
                    </div>
                    
                    <div class="mb-3">
                        <label for="email" class="form-label fw-semibold">Alamat Email</label>
                        <input type="email" 
                               class="form-control form-control-lg" 
                               id="email" 
                               name="email" 
                               value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>"
                               required>
                    </div>
                    
                    <div class="mb-4">
                        <label for="message" class="form-label fw-semibold">Pesan Anda</label>
                        <textarea class="form-control form-control-lg" 
                                  id="message" 
                                  name="message" 
                                  rows="5" 
                                  required><?php echo htmlspecialchars($_POST['message'] ?? ''); ?></textarea>
                    </div>
                    
                    <div class="d-grid">
                        <button type="submit" class="btn btn-primary btn-lg">
                            <i class="fas fa-paper-plane me-2"></i>
                            Kirim Pesan
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
        <!-- Additional Info -->
        <div class="row mt-5">
            <div class="col-12">
                <div class="bg-light rounded-3 p-4 p-md-5 text-center">
                    <h3 class="fw-bold mb-3">Mengapa Memilih Pustaka Ilmu?</h3>
                    <div class="row g-4">
                        <div class="col-md-4">
                            <i class="fas fa-shipping-fast fa-2x text-primary mb-3"></i>
                            <h5 class="fw-semibold">Pengiriman Cepat</h5>
                            <p class="text-muted mb-0">Buku sampai dalam 1-3 hari kerja</p>
                        </div>
                        <div class="col-md-4">
                            <i class="fas fa-shield-alt fa-2x text-primary mb-3"></i>
                            <h5 class="fw-semibold">Kualitas Terjamin</h5>
                            <p class="text-muted mb-0">100% buku original dan berkualitas</p>
                        </div>
                        <div class="col-md-4">
                            <i class="fas fa-headset fa-2x text-primary mb-3"></i>
                            <h5 class="fw-semibold">Customer Support</h5>
                            <p class="text-muted mb-0">Tim support siap membantu 24/7</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<?php include 'includes/footer.php'; ?>