<?php
// Database setup script
// Run this file to create the database and populate it with sample data

$host = "127.0.0.1";
$user = "root";
$pass = "";
$name = "db_stik";
$port = 3316;

try {
    // First, connect without specifying database to create it
    $pdo = new PDO("mysql:host=$host;port=$port;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database if it doesn't exist
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$name` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "Database '$name' created successfully or already exists.\n";
    
    // Now connect to the specific database
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$name;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create books table
    $createTableSQL = "
    CREATE TABLE IF NOT EXISTS `books` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `title` varchar(255) NOT NULL,
        `author` varchar(100) NOT NULL,
        `price` decimal(10,2) NOT NULL,
        `image_url` varchar(255) NOT NULL,
        PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ";
    
    $pdo->exec($createTableSQL);
    echo "Table 'books' created successfully.\n";
    
    // Check if data already exists
    $stmt = $pdo->query("SELECT COUNT(*) FROM books");
    $count = $stmt->fetchColumn();
    
    if ($count == 0) {
        // Insert sample data
        $insertSQL = "
        INSERT INTO `books` (`id`, `title`, `author`, `price`, `image_url`) VALUES
        (1, 'Judul Buku Fiksi', 'Penulis A', 99000.00, 'https://placehold.co/270x380/1a7f72/FFFFFF?text=Fiksi'),
        (2, 'Buku Pengembangan Diri', 'Penulis B', 125000.00, 'https://placehold.co/270x380/f0ad4e/FFFFFF?text=Bisnis'),
        (3, 'Cerita Anak Edukatif', 'Penulis C', 75000.00, 'https://placehold.co/270x380/5cb85c/FFFFFF?text=Anak'),
        (4, 'Sejarah Nusantara', 'Penulis D', 150000.00, 'https://placehold.co/270x380/d9534f/FFFFFF?text=Sejarah'),
        (5, 'Novel Senja', 'Penulis E', 88000.00, 'https://placehold.co/270x380/6f42c1/FFFFFF?text=Novel'),
        (6, 'Galaksi Andromeda', 'Penulis F', 110000.00, 'https://placehold.co/270x380/fd7e14/FFFFFF?text=Sci-Fi'),
        (7, 'Jejak Sang Pemimpin', 'Penulis G', 135000.00, 'https://placehold.co/270x380/20c997/FFFFFF?text=Biografi'),
        (8, 'Misteri Pulau Hilang', 'Penulis H', 95000.00, 'https://placehold.co/270x380/343a40/FFFFFF?text=Misteri'),
        (9, 'Kerajaan Naga', 'Penulis I', 140000.00, 'https://placehold.co/270x380/007bff/FFFFFF?text=Fantasi'),
        (10, 'Rumah di Ujung Jalan', 'Penulis J', 89000.00, 'https://placehold.co/270x380/dc3545/FFFFFF?text=Horor'),
        (11, 'Kumpulan Kisah Lucu', 'Penulis K', 70000.00, 'https://placehold.co/270x380/ffc107/000000?text=Komedi'),
        (12, 'Rahasia Alam Semesta', 'Penulis L', 160000.00, 'https://placehold.co/270x380/17a2b8/FFFFFF?text=Sains')
        ";
        
        $pdo->exec($insertSQL);
        echo "Sample data inserted successfully.\n";
    } else {
        echo "Data already exists in the books table. Skipping data insertion.\n";
    }
    
    // Display success message
    echo "\n";
    echo "=================================\n";
    echo "DATABASE SETUP COMPLETED!\n";
    echo "=================================\n";
    echo "Database: $name\n";
    echo "Host: $host:$port\n";
    echo "Books in database: " . $pdo->query("SELECT COUNT(*) FROM books")->fetchColumn() . "\n";
    echo "\nYou can now access your website:\n";
    echo "- Home: index.php\n";
    echo "- Books: books.php\n";
    echo "- About: about.php\n";
    echo "- Contact: contact.php\n";
    echo "\n";
    
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "\nPlease check:\n";
    echo "1. MySQL/MariaDB is running\n";
    echo "2. Connection details are correct\n";
    echo "3. User has sufficient privileges\n";
}
?>