<?php
session_start();
if (!isset($_SESSION['cart_count'])) {
    $_SESSION['cart_count'] = 0;
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($page_title) ? $page_title : 'Toko Buku Pustaka Ilmu'; ?></title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap" rel="stylesheet">
    
    <!-- Custom CSS -->
    <style>
        :root {
            --primary-color: #1a7f72;
            --primary-hover: #156a5f;
            --text-color: #2c3e50;
            --light-gray: #f0f2f5;
        }
        
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #fdfdfd;
            color: var(--text-color);
            line-height: 1.6;
        }
        
        .navbar-brand {
            color: var(--primary-color) !important;
            font-weight: 700;
            font-size: 1.5rem;
        }
        
        .navbar {
            background-color: rgba(255, 255, 255, 0.95) !important;
            backdrop-filter: blur(10px);
            border-bottom: 1px solid var(--light-gray);
            padding: 1rem 0;
        }
        
        .nav-link {
            font-weight: 500;
            color: #64748b !important;
            transition: color 0.3s ease;
        }
        
        .nav-link:hover {
            color: var(--primary-color) !important;
        }
        
        .nav-link.active {
            color: var(--primary-color) !important;
            font-weight: 700;
        }
        
        .btn-primary {
            background-color: var(--primary-color);
            border-color: var(--primary-color);
            font-weight: 500;
            padding: 0.75rem 2rem;
            border-radius: 50px;
            transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
            background-color: var(--primary-hover);
            border-color: var(--primary-hover);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(26, 127, 114, 0.3);
        }
        
        .cart-icon {
            position: relative;
            color: #6c757d;
            font-size: 1.2rem;
        }
        
        .cart-badge {
            position: absolute;
            top: -8px;
            right: -8px;
            background-color: #dc3545;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            font-size: 0.75rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }
        
        .hero-section {
            background-color: var(--light-gray);
            padding: 6rem 0;
        }
        
        .book-card {
            background: white;
            border-radius: 15px;
            box-shadow: 0 8px 24px rgba(44, 62, 80, 0.1);
            overflow: hidden;
            transition: all 0.3s ease;
            position: relative;
        }
        
        .book-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 30px rgba(44, 62, 80, 0.15);
        }
        
        .book-card img {
            width: 100%;
            height: 320px;
            object-fit: cover;
        }
        
        .book-card .card-body {
            padding: 1.5rem;
            text-align: center;
        }
        
        .book-price {
            color: var(--primary-color);
            font-weight: 700;
            font-size: 1.25rem;
        }
        
        .btn-buy {
            position: absolute;
            bottom: 1rem;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            opacity: 0;
            transition: all 0.4s ease;
            width: 80%;
        }
        
        .book-card:hover .btn-buy,
        .book-card.touch-active .btn-buy {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        
        /* Mobile-specific styles for better touch interaction */
        @media (hover: none) and (pointer: coarse) {
            .btn-buy {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
                position: static;
                width: 100%;
                margin-top: 1rem;
            }
            
            .book-card {
                padding-bottom: 1rem;
            }
        }
        
        .footer {
            background-color: var(--text-color);
            color: var(--light-gray);
            padding: 3rem 0;
        }
        
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #28a745;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1050;
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light fixed-top">
        <div class="container">
            <a class="navbar-brand" href="index.php">Pustaka Ilmu 📚</a>
            
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <a class="nav-link <?php echo basename($_SERVER['PHP_SELF']) == 'index.php' ? 'active' : ''; ?>" href="index.php">Beranda</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?php echo basename($_SERVER['PHP_SELF']) == 'books.php' ? 'active' : ''; ?>" href="books.php">Koleksi</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?php echo basename($_SERVER['PHP_SELF']) == 'about.php' ? 'active' : ''; ?>" href="about.php">Tentang</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?php echo basename($_SERVER['PHP_SELF']) == 'contact.php' ? 'active' : ''; ?>" href="contact.php">Kontak</a>
                    </li>
                </ul>
                
                <div class="d-flex align-items-center">
                    <a href="admin/login.php" class="nav-link me-3" title="Admin Panel">
                        <i class="fas fa-user-shield"></i>
                    </a>
                    <a href="cart.php" class="cart-icon text-decoration-none">
                        <i class="fas fa-shopping-cart"></i>
                        <?php if ($_SESSION['cart_count'] > 0): ?>
                            <span class="cart-badge"><?php echo $_SESSION['cart_count']; ?></span>
                        <?php endif; ?>
                    </a>
                </div>
            </div>
        </div>
    </nav>
    
    <!-- Add top margin to account for fixed navbar -->
    <div style="margin-top: 80px;"></div>