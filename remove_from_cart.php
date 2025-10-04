<?php
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['book_id'])) {
    $book_id = (int)$_POST['book_id'];
    
    // Initialize cart if not exists
    if (!isset($_SESSION['cart_items'])) {
        $_SESSION['cart_items'] = [];
    }
    
    if (!isset($_SESSION['cart_count'])) {
        $_SESSION['cart_count'] = 0;
    }
    
    // Remove item from cart
    if (isset($_SESSION['cart_items'][$book_id])) {
        $quantity_removed = $_SESSION['cart_items'][$book_id];
        unset($_SESSION['cart_items'][$book_id]);
        
        // Update cart count
        $_SESSION['cart_count'] = max(0, $_SESSION['cart_count'] - $quantity_removed);
        
        echo json_encode([
            'success' => true,
            'message' => 'Item removed from cart',
            'cart_count' => $_SESSION['cart_count'],
            'items_count' => count($_SESSION['cart_items'])
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Item not found in cart'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request'
    ]);
}
?>