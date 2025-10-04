<?php
session_start();
require_once 'config/database.php';

// Check if request is POST and cart has items
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || empty($_SESSION['cart_items'])) {
    header('Location: cart.php');
    exit;
}

// Get form data
$customer_name = trim($_POST['customer_name'] ?? '');
$customer_email = trim($_POST['customer_email'] ?? '');
$customer_phone = trim($_POST['customer_phone'] ?? '');
$customer_address = trim($_POST['customer_address'] ?? '');
$payment_method = $_POST['payment_method'] ?? '';
$notes = trim($_POST['notes'] ?? '');

// Validate required fields
if (empty($customer_name) || empty($customer_email) || empty($customer_phone) || empty($customer_address) || empty($payment_method)) {
    $_SESSION['order_error'] = 'Semua field wajib harus diisi.';
    header('Location: cart.php');
    exit;
}

// Validate email format
if (!filter_var($customer_email, FILTER_VALIDATE_EMAIL)) {
    $_SESSION['order_error'] = 'Format email tidak valid.';
    header('Location: cart.php');
    exit;
}

try {
    // Start transaction
    $pdo->beginTransaction();
    
    // Get cart items and calculate total
    $cart_items = $_SESSION['cart_items'];
    $book_ids = array_keys($cart_items);
    
    if (empty($book_ids)) {
        throw new Exception('Keranjang kosong.');
    }
    
    // Get book data and calculate total
    $placeholders = str_repeat('?,', count($book_ids) - 1) . '?';
    $stmt = $pdo->prepare("SELECT * FROM books WHERE id IN ($placeholders)");
    $stmt->execute($book_ids);
    $books_data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $total_amount = 0;
    $order_items = [];
    
    foreach ($books_data as $book) {
        if (isset($cart_items[$book['id']])) {
            $quantity = $cart_items[$book['id']];
            $subtotal = $book['price'] * $quantity;
            $total_amount += $subtotal;
            
            $order_items[] = [
                'book_id' => $book['id'],
                'quantity' => $quantity,
                'price' => $book['price']
            ];
        }
    }
    
    if (empty($order_items)) {
        throw new Exception('Tidak ada item valid dalam keranjang.');
    }
    
    // Insert order
    $order_sql = "INSERT INTO orders (customer_name, customer_email, customer_phone, customer_address, total_amount, status, notes) 
                  VALUES (?, ?, ?, ?, ?, 'pending', ?)";
    $stmt = $pdo->prepare($order_sql);
    $stmt->execute([
        $customer_name,
        $customer_email,
        $customer_phone,
        $customer_address,
        $total_amount,
        $notes
    ]);
    
    $order_id = $pdo->lastInsertId();
    
    // Insert order items
    $item_sql = "INSERT INTO order_items (order_id, book_id, quantity, price) VALUES (?, ?, ?, ?)";
    $stmt = $pdo->prepare($item_sql);
    
    foreach ($order_items as $item) {
        $stmt->execute([
            $order_id,
            $item['book_id'],
            $item['quantity'],
            $item['price']
        ]);
    }
    
    // Commit transaction
    $pdo->commit();
    
    // Clear cart after successful order
    $_SESSION['cart_items'] = [];
    $_SESSION['cart_count'] = 0;
    
    // Store order details for confirmation page
    $_SESSION['last_order'] = [
        'order_id' => $order_id,
        'customer_name' => $customer_name,
        'customer_email' => $customer_email,
        'total_amount' => $total_amount,
        'order_date' => date('Y-m-d H:i:s')
    ];
    
    // Redirect to order confirmation
    header('Location: order_confirmation.php?order_id=' . $order_id);
    exit;
    
} catch (Exception $e) {
    // Rollback transaction on error
    $pdo->rollBack();
    
    $_SESSION['order_error'] = 'Terjadi kesalahan saat memproses pesanan: ' . $e->getMessage();
    header('Location: cart.php');
    exit;
}
?>