# Pustaka Ilmu Bookstore 📚

A modern PHP bookstore website with shopping cart functionality, built with Bootstrap and MySQL.

## Features

- 📖 **Book Catalog** - Browse and view book collection
- 🛒 **Shopping Cart** - Add books to cart with quantity management
- 📦 **Order System** - Complete checkout process with customer information
- 💳 **Order Tracking** - View order confirmations and details
- 📱 **Responsive Design** - Mobile-friendly Bootstrap interface
- 🗄️ **Database Management** - Laravel-style migrations and seeders

## Tech Stack

- **Backend:** PHP 7.4+
- **Database:** MySQL/MariaDB
- **Frontend:** Bootstrap 5.3, Font Awesome, Google Fonts
- **JavaScript:** Vanilla JS for cart interactions
- **Migration System:** Custom Laravel-style migration and seeder system

## Quick Start

### Prerequisites

- PHP 7.4 or higher
- MySQL/MariaDB server
- Web server (Apache/Nginx) or PHP built-in server

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd workshop
   ```

2. **Configure database**
   
   Update `config/database.php` with your database settings:
   ```php
   $host = "127.0.0.1";
   $user = "root";
   $pass = "your_password";
   $name = "db_stik";
   $port = 3306;
   ```

3. **Setup database**
   ```bash
   # First time setup (creates tables and sample data)
   php migrate.php db:setup
   ```

4. **Start the server**
   ```bash
   # Using PHP built-in server
   php -S localhost:8000
   
   # Or configure your web server to point to the project root
   ```

5. **Access the website**
   
   Open your browser and navigate to `http://localhost:8000`

## Database Management

This project uses a modern migration and seeder system for database management.

### Available Commands

```bash
# Database setup and management
php migrate.php db:setup          # First time setup
php migrate.php db:fresh          # Fresh database with sample data
php migrate.php migrate           # Run pending migrations
php migrate.php seed              # Run seeders
php migrate.php migrate:status    # Show migration status
php migrate.php rollback          # Rollback last batch

# Development
php migrate.php make:migration name    # Create new migration
php migrate.php make:seeder name       # Create new seeder
php migrate.php help                   # Show all commands
```

### Database Structure

- **books** - Book catalog (title, author, price, image)
- **orders** - Customer orders (contact info, total, status)  
- **order_items** - Individual items within orders
- **migrations** - Migration tracking

## Project Structure

```
workshop/
├── config/
│   └── database.php           # Database configuration
├── database/
│   ├── migrations/            # Database schema migrations
│   ├── seeders/              # Sample data seeders
│   └── *.php                 # Migration system classes
├── includes/
│   ├── header.php            # Common header with navigation
│   └── footer.php            # Common footer with scripts
├── docs/                     # 📖 Complete documentation
│   ├── DATABASE.md           # Database & migration guide
│   ├── API.md               # API endpoints documentation
│   ├── TESTING.md           # Testing with Playwright
│   └── DEPLOYMENT.md        # Production deployment
├── tests/                    # 🧪 Playwright E2E tests
├── *.php                     # 🌐 Main application pages
└── migrate.php               # ⚙️ Migration CLI tool
```

## Main Pages

- **index.php** - Homepage with featured books
- **books.php** - Complete book catalog  
- **about.php** - About the bookstore
- **contact.php** - Contact form and information
- **cart.php** - Shopping cart management
- **order_confirmation.php** - Order success page

## API Endpoints

- **add_to_cart.php** - Add book to cart (AJAX)
- **update_cart.php** - Update item quantities (AJAX)
- **remove_from_cart.php** - Remove items from cart (AJAX)
- **clear_cart.php** - Clear entire cart (AJAX)
- **process_order.php** - Process order submission

## Testing

The project includes Playwright end-to-end tests for comprehensive functionality testing.

```bash
# Install Playwright (if not already installed)
npm install

# Run all tests
npx playwright test

# Run tests with HTML reporter
npx playwright test --reporter=html

# Run specific test file
npx playwright test tests/cart-functionality.spec.js
```

## Documentation

For detailed documentation, see the `docs/` folder:

- **[Database Documentation](docs/DATABASE.md)** - Migration system, database structure, and seeding
- **[API Documentation](docs/API.md)** - AJAX endpoints, request/response formats
- **[Testing Documentation](docs/TESTING.md)** - Playwright E2E testing setup and guidelines  
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment instructions and security

## Development Workflow

### Adding New Features

1. **Database Changes**
   ```bash
   # Create migration for schema changes
   php migrate.php make:migration add_feature_to_table
   
   # Create seeder for sample data
   php migrate.php make:seeder FeatureSeeder
   
   # Run migrations and seeders
   php migrate.php migrate:seed
   ```

2. **Code Changes**
   - Add new PHP pages or modify existing ones
   - Update navigation in `includes/header.php` if needed
   - Add corresponding JavaScript for dynamic features

3. **Testing**
   ```bash
   # Test functionality manually
   php -S localhost:8000
   
   # Run automated tests
   npx playwright test
   ```

## Sample Data

The seeder system includes:
- **12 sample books** across different genres
- **5 sample orders** with various statuses
- **Realistic customer data** for testing

## Security Features

- SQL injection protection via prepared statements
- XSS protection via `htmlspecialchars()`
- CSRF protection for form submissions
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with proper testing
4. Update database schema via migrations if needed
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues or questions:
1. **Documentation:** Check the comprehensive guides in `docs/` folder
2. **Database:** Run `php migrate.php help` for migration commands
3. **Testing:** Review Playwright test results for functionality verification
4. **Debugging:** Check browser console for JavaScript errors
5. **Deployment:** Follow the production deployment guide in `docs/DEPLOYMENT.md`

---

**Built with ❤️ for learning PHP, Bootstrap, and modern web development practices.**