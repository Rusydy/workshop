<?php

require_once __DIR__ . '/Migration.php';
require_once __DIR__ . '/Seeder.php';

class MigrationManager
{
    private $pdo;
    private $migrationsPath;
    private $seedersPath;
    
    public function __construct($pdo)
    {
        $this->pdo = $pdo;
        $this->migrationsPath = __DIR__ . '/migrations/';
        $this->seedersPath = __DIR__ . '/seeders/';
        
        // Create migrations table if it doesn't exist
        $this->createMigrationsTable();
    }
    
    private function createMigrationsTable()
    {
        $sql = "CREATE TABLE IF NOT EXISTS `migrations` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `migration` VARCHAR(255) NOT NULL UNIQUE,
            `batch` INT NOT NULL DEFAULT 1,
            `executed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        
        $this->pdo->exec($sql);
    }
    
    public function migrate()
    {
        echo "Running migrations...\n";
        
        $migrations = $this->getMigrationFiles();
        $executed = $this->getExecutedMigrations();
        
        foreach ($migrations as $migration) {
            if (!in_array($migration, $executed)) {
                $this->runMigration($migration);
            } else {
                echo "- Skipping {$migration} (already executed)\n";
            }
        }
        
        echo "Migrations completed.\n\n";
    }
    
    public function rollback($steps = 1)
    {
        echo "Rolling back {$steps} migration(s)...\n";
        
        $executed = $this->getExecutedMigrations();
        $toRollback = array_slice(array_reverse($executed), 0, $steps);
        
        foreach ($toRollback as $migration) {
            $this->rollbackMigration($migration);
        }
        
        echo "Rollback completed.\n\n";
    }
    
    public function fresh()
    {
        echo "Dropping all tables and re-running migrations...\n";
        
        // Drop all tables except migrations
        $this->dropAllTables();
        
        // Recreate migrations table
        $this->createMigrationsTable();
        
        // Clear migration records
        $this->pdo->exec("DELETE FROM migrations");
        
        // Run all migrations
        $this->migrate();
    }
    
    public function seed($seederClass = null)
    {
        echo "Running seeders...\n";
        
        if ($seederClass) {
            $this->runSeeder($seederClass);
        } else {
            $seeders = $this->getSeederFiles();
            foreach ($seeders as $seeder) {
                $this->runSeeder($seeder);
            }
        }
        
        echo "Seeding completed.\n\n";
    }
    
    private function getMigrationFiles()
    {
        if (!is_dir($this->migrationsPath)) {
            return [];
        }
        
        $files = scandir($this->migrationsPath);
        $migrations = [];
        
        foreach ($files as $file) {
            if (preg_match('/^\d{4}_\d{2}_\d{2}_\d{6}_.+\.php$/', $file)) {
                $migrations[] = $file;
            }
        }
        
        sort($migrations);
        return $migrations;
    }
    
    private function getSeederFiles()
    {
        if (!is_dir($this->seedersPath)) {
            return [];
        }
        
        $files = scandir($this->seedersPath);
        $seeders = [];
        
        foreach ($files as $file) {
            if (preg_match('/^.+Seeder\.php$/', $file)) {
                $seeders[] = str_replace('.php', '', $file);
            }
        }
        
        return $seeders;
    }
    
    private function getExecutedMigrations()
    {
        try {
            $stmt = $this->pdo->query("SELECT migration FROM migrations ORDER BY executed_at");
            return $stmt->fetchAll(PDO::FETCH_COLUMN);
        } catch (PDOException $e) {
            return [];
        }
    }
    
    private function runMigration($migrationFile)
    {
        echo "- Running {$migrationFile}...\n";
        
        require_once $this->migrationsPath . $migrationFile;
        
        // Extract class name from filename
        $className = $this->getMigrationClassName($migrationFile);
        
        if (!class_exists($className)) {
            throw new Exception("Migration class {$className} not found in {$migrationFile}");
        }
        
        $migration = new $className($this->pdo);
        $migration->up();
        
        // Record migration as executed
        $batch = $this->getNextBatchNumber();
        $stmt = $this->pdo->prepare("INSERT INTO migrations (migration, batch) VALUES (?, ?)");
        $stmt->execute([$migrationFile, $batch]);
        
        echo "  ✓ {$migrationFile} executed successfully\n";
    }
    
    private function rollbackMigration($migrationFile)
    {
        echo "- Rolling back {$migrationFile}...\n";
        
        require_once $this->migrationsPath . $migrationFile;
        
        // Extract class name from filename
        $className = $this->getMigrationClassName($migrationFile);
        
        if (!class_exists($className)) {
            throw new Exception("Migration class {$className} not found in {$migrationFile}");
        }
        
        $migration = new $className($this->pdo);
        $migration->down();
        
        // Remove migration record
        $stmt = $this->pdo->prepare("DELETE FROM migrations WHERE migration = ?");
        $stmt->execute([$migrationFile]);
        
        echo "  ✓ {$migrationFile} rolled back successfully\n";
    }
    
    private function runSeeder($seederClass)
    {
        echo "- Running {$seederClass}...\n";
        
        $seederFile = $this->seedersPath . $seederClass . '.php';
        
        if (!file_exists($seederFile)) {
            echo "  ✗ Seeder file not found: {$seederFile}\n";
            return;
        }
        
        require_once $seederFile;
        
        if (!class_exists($seederClass)) {
            throw new Exception("Seeder class {$seederClass} not found");
        }
        
        $seeder = new $seederClass($this->pdo);
        $seeder->run();
        
        echo "  ✓ {$seederClass} executed successfully\n";
    }
    
    private function getMigrationClassName($filename)
    {
        // Convert filename like "2025_10_04_120001_create_books_table.php" 
        // to class name like "CreateBooksTable"
        $parts = explode('_', $filename);
        $nameParts = array_slice($parts, 4); // Skip timestamp parts
        $className = '';
        
        foreach ($nameParts as $part) {
            $className .= ucfirst(str_replace('.php', '', $part));
        }
        
        return $className;
    }
    
    private function dropAllTables()
    {
        // Disable foreign key checks
        $this->pdo->exec("SET FOREIGN_KEY_CHECKS = 0");
        
        // Get all table names
        $stmt = $this->pdo->query("SHOW TABLES");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        // Drop each table
        foreach ($tables as $table) {
            if ($table !== 'migrations') {
                $this->pdo->exec("DROP TABLE IF EXISTS `{$table}`");
                echo "- Dropped table: {$table}\n";
            }
        }
        
        // Re-enable foreign key checks
        $this->pdo->exec("SET FOREIGN_KEY_CHECKS = 1");
    }
    
    public function status()
    {
        echo "Migration Status:\n";
        echo "================\n";
        
        $migrations = $this->getMigrationFiles();
        $executed = $this->getExecutedMigrations();
        
        if (empty($migrations)) {
            echo "No migrations found.\n";
            return;
        }
        
        foreach ($migrations as $migration) {
            $status = in_array($migration, $executed) ? "✓ Executed" : "✗ Pending";
            echo "{$status} - {$migration}\n";
        }
        
        echo "\n";
    }
    
    private function getNextBatchNumber()
    {
        try {
            $stmt = $this->pdo->query("SELECT MAX(batch) as max_batch FROM migrations");
            $result = $stmt->fetch();
            return ($result['max_batch'] ?? 0) + 1;
        } catch (PDOException $e) {
            return 1;
        }
    }
}