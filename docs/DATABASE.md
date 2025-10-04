# Database Documentation

This document explains the database structure and management system for the Pustaka Ilmu Bookstore application.

## Migration System

The project uses a Laravel-style migration and seeder system for database management. This provides version control for your database schema and allows easy setup, rollback, and data seeding.

### Quick Start

```bash
# First time setup (creates tables and seeds data)
php migrate.php db:setup

# Fresh database (drops all tables and recreates with data)
php migrate.php db:fresh

# Run only migrations
php migrate.php migrate

# Run only seeders
php migrate.php seed
```

## Available Commands

### Migration Commands

```bash
# Run pending migrations
php migrate.php migrate

# Run fresh migration (drops all tables first)
php migrate.php migrate --fresh
php migrate.php migrate:fresh

# Run migrations and seeders together
php migrate.php migrate:seed

# Show migration status
php migrate.php migrate:status

# Rollback last batch of migrations
php migrate.php rollback
```

### Seeder Commands

```bash
# Run all seeders
php migrate.php seed

# Run specific seeder
php migrate.php seed BooksSeeder
php migrate.php seed OrdersSeeder
```

### Development Commands

```bash
# Create new migration
php migrate.php make:migration create_example_table

# Create new seeder
php migrate.php make:seeder ExampleSeeder

# Fresh database with sample data
php migrate.php db:fresh

# Initial setup (first time only)
php migrate.php db:setup
```

## Database Structure

### Tables

#### 1. Books Table
Stores book information for the bookstore catalog.

| Column     | Type         | Description                    |
|------------|--------------|--------------------------------|
| id         | int(11)      | Primary key, auto-increment    |
| title      | varchar(255) | Book title                     |
| author     | varchar(100) | Book author                    |
| price      | decimal(10,2)| Book price in Rupiah          |
| image_url  | varchar(255) | URL to book cover image        |
| created_at | timestamp    | Record creation time           |
| updated_at | timestamp    | Record last update time        |

#### 2. Orders Table
Stores customer order information.

| Column           | Type         | Description                    |
|------------------|--------------|--------------------------------|
| id               | int(11)      | Primary key, auto-increment    |
| customer_name    | varchar(100) | Customer full name             |
| customer_email   | varchar(100) | Customer email address         |
| customer_phone   | varchar(20)  | Customer phone number          |
| customer_address | text         | Customer shipping address      |
| total_amount     | decimal(10,2)| Total order amount             |
| status           | enum         | pending/processing/completed/cancelled |
| notes            | text         | Optional order notes           |
| created_at       | timestamp    | Order creation time            |
| updated_at       | timestamp    | Order last update time         |

#### 3. Order Items Table
Stores individual items within each order.

| Column     | Type         | Description                    |
|------------|--------------|--------------------------------|
| id         | int(11)      | Primary key, auto-increment    |
| order_id   | int(11)      | Foreign key to orders table    |
| book_id    | int(11)      | Foreign key to books table     |
| quantity   | int(11)      | Quantity of books ordered      |
| price      | decimal(10,2)| Price per book at time of order|
| created_at | timestamp    | Record creation time           |

#### 4. Migrations Table
Tracks executed migrations (automatically created).

| Column     | Type         | Description                    |
|------------|--------------|--------------------------------|
| id         | int(11)      | Primary key, auto-increment    |
| migration  | varchar(255) | Migration filename             |
| batch      | int(11)      | Batch number for rollbacks     |
| executed_at| timestamp    | When migration was executed    |

### Foreign Key Relationships

- `order_items.order_id` → `orders.id` (CASCADE on DELETE/UPDATE)
- `order_items.book_id` → `books.id` (CASCADE on DELETE/UPDATE)

### Indexes

- Primary keys on all `id` columns
- Index on `order_items.order_id` for fast order lookup
- Index on `order_items.book_id` for fast book lookup
- Unique index on `migrations.migration` for tracking

## File Structure

```
database/
├── Migration.php              # Base migration class
├── Seeder.php                 # Base seeder class
├── MigrationManager.php       # Migration management system
├── migrations/                # Migration files
│   ├── 2025_10_04_120001_create_books_table.php
│   ├── 2025_10_04_120002_create_orders_table.php
│   ├── 2025_10_04_120003_create_order_items_table.php
│   └── 2025_10_04_120004_add_foreign_keys_to_order_items.php
└── seeders/                   # Seeder files
    ├── BooksSeeder.php        # Sample books data
    └── OrdersSeeder.php       # Sample orders data
```

## Sample Data

### Books (12 records)
The `BooksSeeder` creates 12 sample books across different genres:
- Fiction, Business, Children's books
- History, Novels, Sci-Fi
- Biography, Mystery, Fantasy
- Horror, Comedy, Science

### Orders (5 records)
The `OrdersSeeder` creates 5 sample orders with different statuses:
- Completed orders with customer details
- Processing orders
- Pending orders
- Associated order items (7 total items)

## Creating New Migrations

### Example: Create Users Table

```bash
php migrate.php make:migration create_users_table
```

This creates a new file: `database/migrations/YYYY_MM_DD_HHMMSS_create_users_table.php`

```php
<?php

class CreateUsersTable extends Migration
{
    public function up()
    {
        $this->createTable('users', [
            $this->id(),
            $this->string('name'),
            $this->string('email'),
            $this->string('password'),
            ...$this->timestamps()
        ]);
    }

    public function down()
    {
        $this->dropTable('users');
    }
}
```

## Creating New Seeders

### Example: Create Users Seeder

```bash
php migrate.php make:seeder UsersSeeder
```

This creates: `database/seeders/UsersSeeder.php`

```php
<?php

class UsersSeeder extends Seeder
{
    public function run()
    {
        // Check if data already exists
        if ($this->count('users') > 0) {
            echo "   Users table already has data, skipping...\n";
            return;
        }

        $this->insert('users', [
            [
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => password_hash('password', PASSWORD_DEFAULT)
            ],
            [
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => password_hash('password', PASSWORD_DEFAULT)
            ]
        ]);
        
        echo "   Inserted 2 users\n";
    }
}
```

## Migration Helper Methods

### Table Operations
- `createTable($name, $columns, $options)` - Create new table
- `dropTable($name)` - Drop table (with foreign key safety)
- `tableExists($name)` - Check if table exists

### Column Operations
- `addColumn($table, $definition)` - Add column to existing table
- `dropColumn($table, $column)` - Remove column from table
- `columnExists($table, $column)` - Check if column exists

### Column Types
- `id($autoIncrement = true)` - Primary key column
- `string($name, $length = 255, $nullable = false)` - VARCHAR column
- `text($name, $nullable = false)` - TEXT column
- `integer($name, $length = 11, $nullable = false)` - INT column
- `decimal($name, $precision = 10, $scale = 2, $nullable = false)` - DECIMAL column
- `enum($name, $values, $nullable = false, $default = null)` - ENUM column
- `timestamps()` - Creates created_at and updated_at columns

### Index and Constraint Operations
- `addIndex($table, $name, $columns, $type = '')` - Add index
- `dropIndex($table, $name)` - Drop index
- `addForeignKey($table, $name, $column, $refTable, $refColumn)` - Add foreign key
- `dropForeignKey($table, $name)` - Drop foreign key (with safety checks)

## Seeder Helper Methods

### Data Operations
- `insert($table, $data)` - Insert data (single row or array of rows)
- `insertIgnore($table, $data)` - Insert with duplicate ignore
- `truncate($table)` - Empty table (resets auto-increment)
- `exists($table, $where, $params)` - Check if records exist
- `count($table, $where, $params)` - Count records

### Utility Methods
- `tableExists($tableName)` - Check table existence
- `execute($sql, $params)` - Execute raw SQL with parameters

### Faker Data Helper
The seeder includes a simple faker class for generating test data:

```php
$faker = $this->faker();

$faker->name()                    // Random Indonesian name
$faker->email()                   // Random email address
$faker->phone()                   // Indonesian phone format
$faker->address()                 // Indonesian address
$faker->sentence($words)          // Random sentence
$faker->randomElement($array)     // Pick random array element
$faker->numberBetween($min, $max) // Random number in range
```

## Best Practices

### Migration Guidelines
1. **One change per migration** - Keep migrations focused on single changes
2. **Always provide rollback** - Implement the `down()` method properly
3. **Test migrations** - Test both up and down methods thoroughly
4. **Use descriptive names** - Make migration purpose clear from filename
5. **Foreign keys last** - Add constraints after all tables exist
6. **Backup before production** - Always backup before running migrations in production

### Seeder Guidelines
1. **Check for existing data** - Use count/exists to avoid duplicates
2. **Use realistic data** - Make testing and development meaningful
3. **Consider dependencies** - Seed parent tables before child tables
4. **Make it repeatable** - Seeders should be safe to run multiple times
5. **Use transactions for large datasets** - Wrap large inserts in transactions

## Database Configuration

Database connection settings are in `config/database.php`:

```php
$host = "127.0.0.1";  // Database host
$user = "root";       // Database username
$pass = "";           // Database password
$name = "db_stik";    // Database name
$port = 3316;         // Database port (3306 for standard MySQL)
```

## Troubleshooting

### Common Issues

1. **Foreign Key Constraint Errors**
   ```bash
   # Check migration order - foreign keys need parent tables first
   php migrate.php migrate:status
   
   # Run fresh migration if tables are in bad state
   php migrate.php db:fresh
   ```

2. **Migration Class Not Found**
   - Check migration file naming convention (YYYY_MM_DD_HHMMSS_name.php)
   - Ensure class name matches pattern (CamelCase without timestamp)
   - Verify file is in `database/migrations/` directory

3. **Database Connection Failed**
   - Check MySQL/MariaDB server is running
   - Verify credentials in `config/database.php`
   - Ensure database exists (create manually if needed)
   - Check firewall and port accessibility

4. **Permission Denied Errors**
   - Verify database user has CREATE, DROP, ALTER privileges
   - Check file system permissions on migration files
   - Ensure PHP has write access to project directory

5. **Rollback Issues**
   ```bash
   # If rollback fails due to foreign keys, drop tables manually
   php -r "
   require_once 'config/database.php';
   \$pdo->exec('SET FOREIGN_KEY_CHECKS = 0');
   \$pdo->exec('DROP TABLE IF EXISTS order_items, orders, books, migrations');
   \$pdo->exec('SET FOREIGN_KEY_CHECKS = 1');
   "
   
   # Then run fresh migration
   php migrate.php migrate:seed
   ```

## Production Deployment

### Pre-deployment Checklist
- [ ] Backup existing database
- [ ] Test migrations in staging environment
- [ ] Verify all dependencies are met
- [ ] Check database user permissions
- [ ] Plan rollback strategy

### Deployment Steps

1. **Backup Current Database**
   ```bash
   mysqldump -u username -p database_name > backup_$(date +%Y%m%d_%H%M%S).sql
   ```

2. **Run Migrations Only** (no seeders in production)
   ```bash
   php migrate.php migrate
   ```

3. **Verify Migration Success**
   ```bash
   php migrate.php migrate:status
   ```

4. **Test Application** - Verify all functionality works

### Rollback Plan
If issues occur:
```bash
# Rollback last batch of migrations
php migrate.php rollback

# Or restore from backup
mysql -u username -p database_name < backup_file.sql
```

## Monitoring and Maintenance

### Regular Tasks
- Monitor migration status: `php migrate.php migrate:status`
- Check database performance and optimize indexes as needed
- Regular backups of production database
- Review and clean up old migration files if necessary

### Performance Considerations
- Add indexes for frequently queried columns
- Consider partitioning for large tables
- Monitor slow query logs
- Optimize foreign key relationships

## Integration with Application

The migration system integrates seamlessly with the PHP application:

1. **Database Connection** - Uses same `config/database.php` as main app
2. **Session Management** - Cart data stored in PHP sessions
3. **Order Processing** - Orders saved via migrations-created schema
4. **Testing** - Playwright tests use seeded data for consistency

## Legacy System Migration

The old setup scripts have been completely replaced:
- ❌ `setup_database.php` (removed)
- ❌ `setup_orders_table.php` (removed)
- ✅ Modern migration system with version control
- ✅ Rollback capabilities
- ✅ Organized seeders
- ✅ Better error handling
- ✅ Production-ready deployment process