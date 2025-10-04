<?php
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['book_id']) && isset($_POST['change'])) {
    $book_id = (int)$_POST['book_id'];
    $change = (int)$_POST['change'];
    
    // Initialize cart if not exists
    if (!isset($_SESSION['cart_items'])) {
        $_SESSION['cart_items'] = [];
    }
    
    // Update quantity
    if (isset($_SESSION['cart_items'][$book_id])) {
        $new_quantity = $_SESSION['cart_items'][$book_id] + $change;
        
        if ($new_quantity <= 0) {
            // Remove item if quantity becomes 0 or negative
            unset($_SESSION['cart_items'][$book_id]);
            $_SESSION['cart_count'] = max(0, $_SESSION['cart_count'] - 1);
            
            echo json_encode([
                'success' => true,
                'quantity' => 0,
                'removed' => true,
                'cart_count' => $_SESSION['cart_count']
            ]);
        } else {
            // Update quantity
            $_SESSION['cart_items'][$book_id] = $new_quantity;
            
            // Update cart count
            if ($change > 0) {
                $_SESSION['cart_count']++;
            } else if ($change < 0) {
                $_SESSION['cart_count'] = max(0, $_SESSION['cart_count'] - 1);
            }
            
            // Calculate subtotal (need book price from database)
            require_once 'config/database.php';
            try {
                $stmt = $pdo->prepare("SELECT price FROM books WHERE id = ?");
                $stmt->execute([$book_id]);
                $book = $stmt->fetch();
                
                if ($book) {
                    $subtotal = $book['price'] * $new_quantity;
                    
                    echo json_encode([
                        'success' => true,
                        'quantity' => $new_quantity,
                        'subtotal' => $subtotal,
                        'cart_count' => $_SESSION['cart_count']
                    ]);
                } else {
                    echo json_encode([
                        'success' => false,
                        'message' => 'Book not found'
                    ]);
                }
            } catch(PDOException $e) {
                echo json_encode([
                    'success' => false,
                    'message' => 'Database error'
                ]);
            }
        }
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Item not in cart'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request'
    ]);
}
?>