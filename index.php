<?php
$page_title = "Toko Buku Pustaka Ilmu";
include 'includes/header.php';
include 'config/database.php';

// Get trending books from database
try {
    $stmt = $pdo->prepare("SELECT * FROM books WHERE id IN (1, 2, 3, 4) ORDER BY id");
    $stmt->execute();
    $trending_books = $stmt->fetchAll();
} catch(PDOException $e) {
    $trending_books = [];
}
?>

<!-- Hero Section -->
<section class="hero-section">
    <div class="container">
        <div class="row justify-content-center text-center">
            <div class="col-lg-8">
                <h1 class="display-4 fw-bold mb-4">
                    Temukan Dunia Baru dalam Setiap Halaman
                </h1>
                <p class="lead text-muted mb-4">
                    Jelajahi ribuan judul buku dari berbagai genre favorit Anda.
                </p>
                <a href="books.php" class="btn btn-primary btn-lg">
                    Lihat Semua Koleksi
                </a>
            </div>
        </div>
    </div>
</section>

<!-- Trending Books Section -->
<section id="koleksi" class="py-5">
    <div class="container">
        <div class="row">
            <div class="col-12 text-center mb-5">
                <h2 class="display-5 fw-bold">Trending Books This Week 🔥</h2>
            </div>
        </div>
        
        <?php if (empty($trending_books)): ?>
            <div class="row justify-content-center">
                <div class="col-md-6 text-center">
                    <div class="alert alert-info">
                        <h5>No trending books available</h5>
                        <p class="mb-0">Please check back later or browse our full collection.</p>
                    </div>
                </div>
            </div>
        <?php else: ?>
            <div class="row g-4">
                <?php foreach ($trending_books as $book): ?>
                    <div class="col-sm-6 col-lg-3">
                        <div class="book-card h-100">
                            <img src="<?php echo htmlspecialchars($book['image_url']); ?>" 
                                 alt="Cover <?php echo htmlspecialchars($book['title']); ?>" 
                                 class="card-img-top">
                            <div class="card-body">
                                <h5 class="card-title fw-semibold mb-2">
                                    <?php echo htmlspecialchars($book['title']); ?>
                                </h5>
                                <p class="text-muted small mb-3">
                                    oleh <?php echo htmlspecialchars($book['author']); ?>
                                </p>
                                <p class="book-price mb-3">
                                    Rp <?php echo number_format($book['price'], 0, ',', '.'); ?>
                                </p>
                            </div>
                            <button onclick="addToCart(<?php echo $book['id']; ?>)" 
                                    class="btn btn-primary btn-sm btn-buy">
                                Beli Sekarang
                            </button>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
        
        <div class="row mt-5">
            <div class="col-12 text-center">
                <a href="books.php" class="btn btn-outline-primary">
                    Lihat Semua Buku
                </a>
            </div>
        </div>
    </div>
</section>

<?php include 'includes/footer.php'; ?>