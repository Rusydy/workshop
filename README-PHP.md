# Pustaka Ilmu - PHP/Bootstrap Version

This is a converted version of the Pustaka Ilmu bookstore website, now using PHP, Bootstrap, and MySQL instead of the original TailwindCSS and static JSON data.

## Features

- **Responsive Design**: Built with Bootstrap 5 for mobile-first responsive design
- **Dynamic Content**: Books data loaded from MySQL database
- **Shopping Cart**: Session-based cart functionality
- **Contact Form**: Working contact form with validation
- **Clean PHP Architecture**: Modular structure with includes and proper separation

## File Structure

```
workshop/
├── config/
│   └── database.php          # Database connection configuration
├── includes/
│   ├── header.php           # Common header with navigation
│   └── footer.php           # Common footer with scripts
├── index.php                # Homepage with trending books
├── books.php               # All books listing page
├── about.php               # About us page
├── contact.php             # Contact page with form
├── add_to_cart.php         # AJAX endpoint for cart functionality
├── setup_database.php      # Database setup script
└── README-PHP.md           # This file
```

## Database Configuration

The website uses the following database configuration (as specified in `config/database.php`):

```php
$host = "127.0.0.1";
$user = "root";
$pass = "";
$name = "db_stik";
$port = 3316;
```

## Setup Instructions

### 1. Database Setup

First, ensure your MySQL/MariaDB server is running on port 3316, then run:

```bash
php setup_database.php
```

This will:
- Create the `db_stik` database if it doesn't exist
- Create the `books` table with the correct structure
- Insert sample book data (12 books)

### 2. Web Server

You can run the website using PHP's built-in server:

```bash
php -S localhost:8000
```

Then visit: http://localhost:8000

### 3. Production Setup

For production deployment:
1. Copy all files to your web server
2. Update database credentials in `config/database.php`
3. Ensure your web server has PHP 7.4+ with PDO MySQL extension
4. Configure proper file permissions

## Database Schema

### Books Table

```sql
CREATE TABLE `books` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `author` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Key Changes from Original

### 1. CSS Framework Migration
- **From**: TailwindCSS with custom configuration
- **To**: Bootstrap 5 with custom CSS variables for brand colors

### 2. JavaScript Framework Migration
- **From**: Alpine.js for reactivity
- **To**: Vanilla JavaScript with Bootstrap components

### 3. Data Source Migration
- **From**: Static JSON file (`data/books.json`)
- **To**: MySQL database with PDO

### 4. Architecture Migration
- **From**: Static HTML files
- **To**: Dynamic PHP with includes and session management

## Features Implementation

### Shopping Cart
- Session-based cart count tracking
- AJAX add-to-cart functionality
- Visual cart badge in navigation
- Success notifications

### Navigation
- Active page highlighting
- Responsive mobile menu
- Consistent header/footer across all pages

### Book Display
- Dynamic book loading from database
- Hover effects and animations
- Price formatting for Indonesian Rupiah
- Responsive grid layout

### Contact Form
- Server-side validation
- Error and success message display
- Form data retention on error
- Professional styling

## Customization

### Colors
The website uses CSS custom properties for easy color customization:

```css
:root {
    --primary-color: #1a7f72;
    --primary-hover: #156a5f;
    --text-color: #2c3e50;
    --light-gray: #f0f2f5;
}
```

### Adding Books
Add books directly to the database:

```sql
INSERT INTO books (title, author, price, image_url) VALUES
('Your Book Title', 'Author Name', 99000.00, 'https://your-image-url.com');
```

### Styling
Custom styles are defined in the `<style>` section of `includes/header.php`. For larger projects, consider moving these to separate CSS files.

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

### PHP Extensions Required
- PDO
- PDO MySQL Driver
- Session support

### External Libraries
- Bootstrap 5.3.0 (CSS + JS)
- Font Awesome 6.4.0
- Google Fonts (Poppins)

## Security Considerations

- SQL injection prevention using PDO prepared statements
- XSS prevention with `htmlspecialchars()`
- Input validation on contact form
- Session-based cart (not cookie-based for security)

## Performance

- Optimized database queries
- Minimal external dependencies
- Responsive images with proper sizing
- CSS and JS loaded from CDN for caching

## Support

If you encounter any issues:
1. Check MySQL connection and credentials
2. Verify PHP version and extensions
3. Check file permissions
4. Review error logs

For development questions, refer to:
- [Bootstrap Documentation](https://getbootstrap.com/docs/5.3/)
- [PHP PDO Documentation](https://www.php.net/manual/en/book.pdo.php)
- [MySQL Documentation](https://dev.mysql.com/doc/)