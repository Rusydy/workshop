<?php
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['book_id'])) {
    // Initialize cart count if not set
    if (!isset($_SESSION['cart_count'])) {
        $_SESSION['cart_count'] = 0;
    }
    
    // Increment cart count
    $_SESSION['cart_count']++;
    
    // You can add more complex cart logic here
    // For example, storing actual book data in session
    if (!isset($_SESSION['cart_items'])) {
        $_SESSION['cart_items'] = [];
    }
    
    $book_id = (int)$_POST['book_id'];
    
    // Add or increment book quantity in cart
    if (isset($_SESSION['cart_items'][$book_id])) {
        $_SESSION['cart_items'][$book_id]++;
    } else {
        $_SESSION['cart_items'][$book_id] = 1;
    }
    
    echo json_encode([
        'success' => true,
        'cart_count' => $_SESSION['cart_count'],
        'message' => 'Item added to cart successfully'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request'
    ]);
}
?>