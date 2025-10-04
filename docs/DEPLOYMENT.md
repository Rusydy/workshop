# Deployment Guide

This guide provides step-by-step instructions for deploying the Pustaka Ilmu Bookstore application to production environments.

## Overview

The application is a PHP-based bookstore with MySQL database, using Bootstrap for frontend and a custom migration system for database management. This guide covers deployment to various hosting environments.

## Pre-Deployment Checklist

### Code Preparation
- [ ] All code committed to version control
- [ ] Database migrations tested in staging
- [ ] Environment-specific configurations prepared
- [ ] Security configurations reviewed
- [ ] Performance optimizations applied
- [ ] Error handling implemented
- [ ] Logging configured

### Security Review
- [ ] SQL injection protection verified (prepared statements)
- [ ] XSS protection implemented (htmlspecialchars)
- [ ] Input validation on all forms
- [ ] File upload security (if applicable)
- [ ] Database credentials secured
- [ ] HTTPS/SSL certificates ready
- [ ] Error messages don't expose sensitive information

### Performance Optimization
- [ ] Database indexes optimized
- [ ] Image optimization completed
- [ ] CSS/JS minification (if applicable)
- [ ] Caching strategy implemented
- [ ] Database connection pooling configured

## Environment Setup

### System Requirements

#### Minimum Requirements
- **PHP:** 7.4 or higher
- **MySQL:** 5.7+ or MariaDB 10.3+
- **Memory:** 512MB RAM minimum
- **Storage:** 1GB free space
- **Bandwidth:** Based on expected traffic

#### Recommended Requirements
- **PHP:** 8.0+ with OPcache enabled
- **MySQL:** 8.0+ or MariaDB 10.5+
- **Memory:** 2GB+ RAM
- **Storage:** 5GB+ SSD storage
- **Bandwidth:** CDN integration for static assets

#### Required PHP Extensions
```bash
php -m | grep -E "(pdo|pdo_mysql|session|json|mbstring|openssl)"
```

Required extensions:
- PDO
- PDO MySQL
- Session
- JSON
- Mbstring
- OpenSSL (for HTTPS)

## Deployment Methods

### Method 1: Shared Hosting (cPanel/Plesk)

#### Step 1: Prepare Files
```bash
# Create deployment package
zip -r bookstore-production.zip . \
  --exclude="node_modules/*" \
  --exclude="tests/*" \
  --exclude="playwright-report/*" \
  --exclude="test-results/*" \
  --exclude=".git/*"
```

#### Step 2: Upload Files
1. Access hosting control panel (cPanel/Plesk)
2. Navigate to File Manager
3. Upload zip file to public_html or www directory
4. Extract files
5. Set proper permissions:
   - Directories: 755
   - Files: 644
   - migrate.php: 755

#### Step 3: Database Setup
1. Create MySQL database through control panel
2. Create database user with full privileges
3. Update `config/database.php`:
```php
<?php
$host = "localhost";        // Usually localhost
$user = "username_dbuser";  // Your database username
$pass = "secure_password";  // Your database password  
$name = "username_dbname";  // Your database name
$port = 3306;              // Standard MySQL port

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$name;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch(PDOException $e) {
    error_log("Database connection failed: " . $e->getMessage());
    die("Database connection failed. Please contact support.");
}
?>
```

#### Step 4: Run Migrations
```bash
# SSH access (if available)
php migrate.php migrate

# Or via web interface (create temporary setup page)
```

### Method 2: VPS/Cloud Server (Ubuntu/CentOS)

#### Step 1: Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install LAMP stack
sudo apt install apache2 mysql-server php8.0 php8.0-mysql php8.0-mbstring php8.0-xml php8.0-curl -y

# Start services
sudo systemctl start apache2
sudo systemctl start mysql
sudo systemctl enable apache2
sudo systemctl enable mysql
```

#### Step 2: Configure Apache
```bash
# Create virtual host
sudo nano /etc/apache2/sites-available/bookstore.conf
```

Virtual host configuration:
```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    ServerAlias www.yourdomain.com
    DocumentRoot /var/www/bookstore
    
    <Directory /var/www/bookstore>
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/bookstore_error.log
    CustomLog ${APACHE_LOG_DIR}/bookstore_access.log combined
</VirtualHost>
```

Enable site:
```bash
sudo a2ensite bookstore
sudo a2enmod rewrite
sudo systemctl reload apache2
```

#### Step 3: Deploy Code
```bash
# Clone repository
cd /var/www/
sudo git clone https://github.com/yourusername/bookstore.git
sudo chown -R www-data:www-data bookstore
sudo chmod -R 755 bookstore
```

#### Step 4: Database Configuration
```bash
# Secure MySQL installation
sudo mysql_secure_installation

# Create database and user
sudo mysql -u root -p
```

```sql
CREATE DATABASE bookstore_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'bookstore_user'@'localhost' IDENTIFIED BY 'secure_random_password';
GRANT ALL PRIVILEGES ON bookstore_prod.* TO 'bookstore_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Step 5: SSL Configuration
```bash
# Install Certbot
sudo apt install certbot python3-certbot-apache -y

# Get SSL certificate
sudo certbot --apache -d yourdomain.com -d www.yourdomain.com
```

#### Step 6: Run Deployment
```bash
cd /var/www/bookstore
php migrate.php migrate
```

### Method 3: Docker Deployment

#### Step 1: Create Dockerfile
```dockerfile
FROM php:8.0-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Enable Apache rewrite module
RUN a2enmod rewrite

# Copy application code
COPY . /var/www/html/

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Expose port
EXPOSE 80
```

#### Step 2: Docker Compose
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "80:80"
    volumes:
      - ./:/var/www/html
    depends_on:
      - db
    environment:
      - DB_HOST=db
      - DB_DATABASE=bookstore
      - DB_USERNAME=bookstore
      - DB_PASSWORD=secret

  db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: bookstore
      MYSQL_USER: bookstore
      MYSQL_PASSWORD: secret
      MYSQL_ROOT_PASSWORD: rootsecret
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

volumes:
  mysql_data:
```

#### Step 3: Deploy with Docker
```bash
# Build and run containers
docker-compose up -d

# Run migrations
docker-compose exec app php migrate.php migrate
```

## Database Migration in Production

### Safe Migration Process

#### Step 1: Backup Database
```bash
# Create backup before migration
mysqldump -u username -p database_name > backup_$(date +%Y%m%d_%H%M%S).sql

# Or using the application's backup feature
php -r "
require_once 'config/database.php';
$backup = shell_exec('mysqldump -u $user -p$pass $name');
file_put_contents('backup_' . date('Y-m-d_H-i-s') . '.sql', $backup);
echo 'Backup created successfully\n';
"
```

#### Step 2: Test Migrations in Staging
```bash
# Run migration status check
php migrate.php migrate:status

# Run migrations
php migrate.php migrate

# Verify data integrity
php -r "
require_once 'config/database.php';
echo 'Books: ' . \$pdo->query('SELECT COUNT(*) FROM books')->fetchColumn() . PHP_EOL;
echo 'Orders: ' . \$pdo->query('SELECT COUNT(*) FROM orders')->fetchColumn() . PHP_EOL;
"
```

#### Step 3: Production Migration
```bash
# Put site in maintenance mode (create maintenance.php)
echo "<?php include 'maintenance.html'; ?>" > maintenance.php

# Run migrations
php migrate.php migrate

# Remove maintenance mode
rm maintenance.php
```

### Rollback Strategy
```bash
# If migration fails, rollback
php migrate.php rollback

# Or restore from backup
mysql -u username -p database_name < backup_file.sql
```

## Environment Configuration

### Production Database Config
```php
<?php
// config/database.php - Production version
$host = getenv('DB_HOST') ?: 'localhost';
$user = getenv('DB_USER') ?: 'production_user';
$pass = getenv('DB_PASS') ?: 'secure_production_password';
$name = getenv('DB_NAME') ?: 'production_database';
$port = getenv('DB_PORT') ?: 3306;

// Production settings
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL & ~E_NOTICE);

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$name;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::ATTR_PERSISTENT => true,  // Connection pooling
    ]);
} catch(PDOException $e) {
    error_log("Database connection failed: " . $e->getMessage());
    http_response_code(503);
    include 'error_pages/503.html';
    exit;
}
?>
```

### Environment Variables
Create `.env` file (not in version control):
```bash
# Database
DB_HOST=localhost
DB_NAME=bookstore_prod
DB_USER=bookstore_user
DB_PASS=secure_random_password_here
DB_PORT=3306

# Application
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Session
SESSION_LIFETIME=7200
SESSION_SECURE=true
SESSION_HTTPONLY=true
```

### Security Hardening

#### 1. File Permissions
```bash
# Set proper permissions
find . -type f -exec chmod 644 {} \;
find . -type d -exec chmod 755 {} \;
chmod 755 migrate.php
chmod 600 config/database.php
chmod 600 .env

# Protect sensitive files
echo "deny from all" > config/.htaccess
echo "deny from all" > database/.htaccess
```

#### 2. Apache Security
Create `.htaccess` in root:
```apache
# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Hide server information
ServerTokens Prod
ServerSignature Off

# Disable directory browsing
Options -Indexes

# Protect sensitive files
<Files "*.php~">
    Deny from all
</Files>
<Files ".env">
    Deny from all
</Files>
<Files ".git*">
    Deny from all
</Files>
<Files "composer.*">
    Deny from all
</Files>
<Files "package*.json">
    Deny from all
</Files>

# Force HTTPS (if SSL is configured)
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

#### 3. PHP Security
Update `php.ini` or create `.user.ini`:
```ini
; Hide PHP version
expose_php = Off

; Disable dangerous functions
disable_functions = exec,passthru,shell_exec,system,proc_open,popen,curl_exec,curl_multi_exec,parse_ini_file,show_source

; Session security
session.cookie_httponly = 1
session.cookie_secure = 1
session.use_strict_mode = 1
session.cookie_samesite = Strict

; File upload security
file_uploads = On
upload_max_filesize = 2M
max_file_uploads = 3

; Memory and execution limits
memory_limit = 256M
max_execution_time = 30
max_input_time = 30
```

## Monitoring and Maintenance

### Health Checks
Create `health.php`:
```php
<?php
header('Content-Type: application/json');

$health = [
    'status' => 'healthy',
    'timestamp' => date('c'),
    'checks' => []
];

// Database check
try {
    require_once 'config/database.php';
    $pdo->query('SELECT 1');
    $health['checks']['database'] = 'ok';
} catch (Exception $e) {
    $health['checks']['database'] = 'error';
    $health['status'] = 'unhealthy';
}

// Disk space check
$freeSpace = disk_free_space('./');
$totalSpace = disk_total_space('./');
$usedPercent = (($totalSpace - $freeSpace) / $totalSpace) * 100;

$health['checks']['disk_space'] = [
    'used_percent' => round($usedPercent, 2),
    'status' => $usedPercent > 85 ? 'warning' : 'ok'
];

// Response time check
$startTime = microtime(true);
file_get_contents('http://localhost' . $_SERVER['REQUEST_URI']);
$responseTime = (microtime(true) - $startTime) * 1000;

$health['checks']['response_time'] = [
    'ms' => round($responseTime, 2),
    'status' => $responseTime > 1000 ? 'warning' : 'ok'
];

http_response_code($health['status'] === 'healthy' ? 200 : 503);
echo json_encode($health, JSON_PRETTY_PRINT);
?>
```

### Logging Setup
Create logging configuration:
```php
<?php
// includes/logger.php
class Logger {
    private static $logFile = '/var/log/bookstore/app.log';
    
    public static function log($level, $message, $context = []) {
        $timestamp = date('Y-m-d H:i:s');
        $contextStr = $context ? ' ' . json_encode($context) : '';
        $logEntry = "[$timestamp] [$level] $message$contextStr" . PHP_EOL;
        
        file_put_contents(self::$logFile, $logEntry, FILE_APPEND | LOCK_EX);
    }
    
    public static function error($message, $context = []) {
        self::log('ERROR', $message, $context);
    }
    
    public static function info($message, $context = []) {
        self::log('INFO', $message, $context);
    }
}

// Usage in application
Logger::info('Order placed', ['order_id' => 123, 'customer_email' => 'user@example.com']);
Logger::error('Database connection failed', ['error' => $e->getMessage()]);
?>
```

### Backup Strategy
```bash
#!/bin/bash
# backup.sh - Daily backup script

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/bookstore"
DB_NAME="bookstore_prod"
DB_USER="bookstore_user"
DB_PASS="password"

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# File backup
tar -czf $BACKUP_DIR/files_backup_$DATE.tar.gz /var/www/bookstore \
    --exclude='/var/www/bookstore/storage/logs' \
    --exclude='/var/www/bookstore/node_modules'

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

Add to cron:
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /path/to/backup.sh >> /var/log/backup.log 2>&1
```

## Performance Optimization

### Database Optimization
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Optimize MySQL configuration
-- Add to /etc/mysql/mysql.conf.d/mysqld.cnf
[mysqld]
innodb_buffer_pool_size = 256M
query_cache_size = 64M
query_cache_type = 1
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2
```

### PHP Optimization
```ini
; Enable OPcache
opcache.enable=1
opcache.memory_consumption=256
opcache.interned_strings_buffer=16
opcache.max_accelerated_files=10000
opcache.revalidate_freq=2
opcache.fast_shutdown=1

; Realpath cache
realpath_cache_size=2M
realpath_cache_ttl=600
```

### Caching Strategy
Create simple file cache:
```php
<?php
// includes/cache.php
class SimpleCache {
    private static $cacheDir = '/tmp/bookstore_cache/';
    
    public static function get($key, $ttl = 3600) {
        $file = self::$cacheDir . md5($key) . '.cache';
        
        if (!file_exists($file)) return null;
        
        $data = unserialize(file_get_contents($file));
        if ($data['expires'] < time()) {
            unlink($file);
            return null;
        }
        
        return $data['value'];
    }
    
    public static function set($key, $value, $ttl = 3600) {
        if (!is_dir(self::$cacheDir)) {
            mkdir(self::$cacheDir, 0755, true);
        }
        
        $file = self::$cacheDir . md5($key) . '.cache';
        $data = [
            'value' => $value,
            'expires' => time() + $ttl
        ];
        
        file_put_contents($file, serialize($data));
    }
}

// Usage
$books = SimpleCache::get('featured_books');
if (!$books) {
    $books = $pdo->query('SELECT * FROM books LIMIT 4')->fetchAll();
    SimpleCache::set('featured_books', $books, 1800); // 30 minutes
}
?>
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Errors
```bash
# Check MySQL service
systemctl status mysql

# Check connection from PHP
php -r "
try {
    \$pdo = new PDO('mysql:host=localhost;dbname=bookstore', 'user', 'pass');
    echo 'Database connection successful\n';
} catch (Exception \$e) {
    echo 'Connection failed: ' . \$e->getMessage() . \"\n\";
}
"
```

#### 2. Permission Issues
```bash
# Fix file permissions
chown -R www-data:www-data /var/www/bookstore
chmod -R 755 /var/www/bookstore
chmod 644 /var/www/bookstore/config/database.php
```

#### 3. Migration Failures
```bash
# Check migration status
php migrate.php migrate:status

# Manually fix and rerun
php migrate.php rollback
php migrate.php migrate
```

#### 4. Performance Issues
```bash
# Check slow query log
tail -f /var/log/mysql/slow.log

# Monitor PHP processes
ps aux | grep php

# Check Apache error logs
tail -f /var/log/apache2/error.log
```

### Emergency Procedures

#### Site Down
1. Check health endpoint: `curl https://yourdomain.com/health.php`
2. Check server logs: `tail -f /var/log/apache2/error.log`
3. Verify database connectivity
4. Check disk space: `df -h`
5. Restart services if needed:
   ```bash
   sudo systemctl restart apache2
   sudo systemctl restart mysql
   ```

#### Data Recovery
1. Stop application access
2. Restore from most recent backup:
   ```bash
   mysql -u username -p database_name < backup_file.sql
   ```
3. Verify data integrity
4. Resume application access

This deployment guide provides comprehensive instructions for deploying the bookstore application to production environments with proper security, monitoring, and maintenance procedures.