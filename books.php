<?php
$page_title = "Koleksi Buku - Pustaka Ilmu";
include 'includes/header.php';
include 'config/database.php';

// Get all books from database
try {
    $stmt = $pdo->prepare("SELECT * FROM books ORDER BY id");
    $stmt->execute();
    $books = $stmt->fetchAll();
} catch(PDOException $e) {
    $books = [];
}
?>

<!-- Page Header -->
<section class="hero-section">
    <div class="container">
        <div class="row justify-content-center text-center">
            <div class="col-lg-8">
                <h1 class="display-4 fw-bold mb-3">Semua Koleksi Buku</h1>
                <p class="lead text-muted">
                    Temukan buku favoritmu di sini.
                </p>
            </div>
        </div>
    </div>
</section>

<!-- Books Collection -->
<section id="koleksi" class="py-5">
    <div class="container">
        <?php if (empty($books)): ?>
            <div class="row justify-content-center">
                <div class="col-md-6 text-center">
                    <div class="alert alert-warning">
                        <h5>No books available</h5>
                        <p class="mb-0">Our collection is being updated. Please check back later.</p>
                    </div>
                </div>
            </div>
        <?php else: ?>
            <div class="row g-4">
                <?php foreach ($books as $book): ?>
                    <div class="col-sm-6 col-md-4 col-lg-3">
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
    </div>
</section>

<?php include 'includes/footer.php'; ?>