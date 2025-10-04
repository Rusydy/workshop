# Pustaka Ilmu - PHP/Bootstrap Bookstore Website 📚

A modern Indonesian bookstore website built with **PHP**, **Bootstrap 5**, and **MySQL**, complete with comprehensive **Playwright testing**.

## 🚀 Features

- **📱 Responsive Design**: Bootstrap 5 mobile-first responsive layout
- **🗄️ Dynamic Content**: Book data loaded from MySQL database
- **🛒 Shopping Cart**: PHP session-based cart functionality
- **📝 Contact Form**: Working contact form with server-side validation
- **🔒 Security**: XSS prevention, SQL injection protection with PDO
- **🧪 Comprehensive Testing**: Playwright E2E tests for all functionality

## 📁 Project Structure

```
workshop/
├── config/
│   └── database.php          # Database connection & configuration
├── includes/
│   ├── header.php           # Common header with navigation
│   └── footer.php           # Common footer with JavaScript
├── assets/
│   └── js/                  # Additional JavaScript files (if needed)
├── tests/                   # Playwright test files
│   ├── homepage.spec.js     # Homepage tests
│   ├── books-page.spec.js   # Books collection tests
│   ├── about-page.spec.js   # About page tests
│   ├── contact-page.spec.js # Contact form tests
│   ├── api-integration.spec.js # Database & cart integration tests
│   └── cross-browser.spec.js   # Cross-browser compatibility
├── index.php               # Homepage with trending books
├── books.php               # All books listing page
├── about.php               # About us page
├── contact.php             # Contact page with form
├── add_to_cart.php         # AJAX endpoint for cart functionality
├── setup_database.php      # Database initialization script
├── playwright.config.js    # Playwright test configuration
├── package.json           # Node.js dependencies for testing
└── test-all-pages.js      # Test runner script
```

## 🛠️ Technology Stack

- **Backend**: PHP 7.4+
- **Database**: MySQL/MariaDB
- **Frontend**: Bootstrap 5.3.0
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Poppins)
- **Testing**: Playwright with Node.js

## ⚙️ Setup Instructions

### 1. Prerequisites

- PHP 7.4 or higher with PDO MySQL extension
- MySQL/MariaDB server running on port 3316
- Node.js 16+ (for testing)

### 2. Database Setup

The website uses these database credentials:
```php
Host: 127.0.0.1
Port: 3316
Database: db_stik
Username: root
Password: (empty)
```

**Initialize the database:**
```bash
php setup_database.php
```

This will:
- Create the `db_stik` database
- Create the `books` table
- Insert 12 sample books

### 3. Start the Server

```bash
# Using PHP built-in server
php -S localhost:8000

# Or using npm script
npm run serve
```

Visit: http://localhost:8000

### 4. Run Tests (Optional)

```bash
# Install testing dependencies
npm install
npm run install:browsers

# Run all tests
npm test

# Run specific test suites
npm run test:all-pages        # Quick test (Chromium only)
npm run test:all-pages:full   # Full test (all browsers)

# Interactive testing
npm run test:ui
npm run test:debug
```

## 📊 Database Schema

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

## 🎨 Customization

### Colors
Modify CSS variables in `includes/header.php`:
```css
:root {
    --primary-color: #1a7f72;
    --primary-hover: #156a5f;
    --text-color: #2c3e50;
    --light-gray: #f0f2f5;
}
```

### Adding Books
```sql
INSERT INTO books (title, author, price, image_url) VALUES
('New Book Title', 'Author Name', 99000.00, 'https://image-url.com');
```

### Modifying Pages
- **Header/Navigation**: Edit `includes/header.php`
- **Footer**: Edit `includes/footer.php`
- **Styling**: Modify CSS in `includes/header.php` or create separate CSS files

## 🧪 Testing Features

- **Database Integration**: Tests MySQL connection and data loading
- **Cart Functionality**: Tests PHP session-based cart operations
- **Form Validation**: Tests contact form with various scenarios
- **Security**: Tests XSS prevention and input sanitization
- **Responsive Design**: Tests Bootstrap responsive behavior
- **Cross-browser**: Tests compatibility across browsers
- **Performance**: Tests page load times and error handling

## 🔒 Security Features

- **SQL Injection Prevention**: PDO prepared statements
- **XSS Protection**: `htmlspecialchars()` output escaping
- **Input Validation**: Server-side form validation
- **Session Security**: PHP session management for cart

## 📱 Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Production Deployment

1. **Upload files** to your web server
2. **Update database credentials** in `config/database.php`
3. **Create database** and run `setup_database.php`
4. **Configure web server** (Apache/Nginx) for PHP
5. **Set proper file permissions**
6. **Enable PHP extensions**: PDO, PDO_MySQL

### Apache .htaccess Example
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]
```

## 📚 Available Pages

- **Homepage** (`index.php`): Hero section + trending books
- **Books** (`books.php`): Complete book collection
- **About** (`about.php`): Company information and statistics
- **Contact** (`contact.php`): Contact form and company details

## 🛒 Cart Features

- Session-based cart (persists across page loads)
- AJAX add-to-cart functionality
- Live cart counter in navigation
- Success notifications

## 📋 NPM Scripts

```bash
npm run serve          # Start PHP server
npm run dev            # Start PHP server (alias)
npm run setup          # Initialize database
npm run start          # Setup database + start server
npm test              # Run all Playwright tests
npm run test:ui       # Interactive test runner
npm run test:debug    # Debug mode testing
npm run test:report   # View test results
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Run tests: `npm test`
4. Submit pull request

## 📞 Support

For issues or questions:
- Check database connection settings
- Verify PHP version and extensions
- Review error logs
- Run database setup script

---

**Built with ❤️ for Indonesian book lovers**

*© 2025 Toko Buku Pustaka Ilmu - Menyebarkan literasi ke seluruh Indonesia*