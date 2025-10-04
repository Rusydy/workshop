<?php
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Clear all cart data
    $_SESSION['cart_items'] = [];
    $_SESSION['cart_count'] = 0;
    
    echo json_encode([
        'success' => true,
        'message' => 'Cart cleared successfully',
        'cart_count' => 0,
        'items_count' => 0
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method'
    ]);
}
?>