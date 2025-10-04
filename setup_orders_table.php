<?php
// Setup orders and order_items tables for the bookstore
require_once 'config/database.php';

try {
    // Create orders table
    $createOrdersTableSQL = "
    CREATE TABLE IF NOT EXISTS `orders` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `customer_name` varchar(100) NOT NULL,
        `customer_email` varchar(100) NOT NULL,
        `customer_phone` varchar(20) NOT NULL,
        `customer_address` text NOT NULL,
        `total_amount` decimal(10,2) NOT NULL,
        `status` enum('pending','processing','completed','cancelled') DEFAULT 'pending',
        `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
        `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ";
    
    $pdo->exec($createOrdersTableSQL);
    echo "Table 'orders' created successfully.\n";
    
    // Create order_items table
    $createOrderItemsTableSQL = "
    CREATE TABLE IF NOT EXISTS `order_items` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `order_id` int(11) NOT NULL,
        `book_id` int(11) NOT NULL,
        `quantity` int(11) NOT NULL,
        `price` decimal(10,2) NOT NULL,
        `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        KEY `order_id` (`order_id`),
        KEY `book_id` (`book_id`),
        CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
        CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ";
    
    $pdo->exec($createOrderItemsTableSQL);
    echo "Table 'order_items' created successfully.\n";
    
    echo "\n";
    echo "=================================\n";
    echo "ORDERS TABLES SETUP COMPLETED!\n";
    echo "=================================\n";
    echo "Tables created:\n";
    echo "- orders (customer info, total, status)\n";
    echo "- order_items (individual book items)\n";
    echo "\n";
    
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>