#!/usr/bin/env php
<?php

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/database/MigrationManager.php';

// Get command line arguments
$command = $argv[1] ?? 'help';
$argument = $argv[2] ?? null;

// Create database connection using variables from config/database.php
try {
    $pdo = new PDO("mysql:host={$host};port={$port};dbname={$name};charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    echo "Database connection failed: " . $e->getMessage() . "\n";
    exit(1);
}

$migrationManager = new MigrationManager($pdo);

switch ($command) {
    case 'migrate':
        $migrationManager->migrate();
        break;
        
    case 'migrate:rollback':
        $steps = is_numeric($argument) ? (int)$argument : 1;
        $migrationManager->rollback($steps);
        break;
        
    case 'migrate:fresh':
        $migrationManager->fresh();
        break;
        
    case 'migrate:status':
        $migrationManager->status();
        break;
        
    case 'db:seed':
        $seederClass = $argument;
        $migrationManager->seed($seederClass);
        break;
        
    case 'db:fresh':
        $migrationManager->fresh();
        $migrationManager->seed();
        break;
        
    case 'migrate:seed':
        $migrationManager->migrate();
        $migrationManager->seed();
        break;
        
    case 'help':
    default:
        echo "Database Migration Tool\n";
        echo "=======================\n\n";
        echo "Available commands:\n";
        echo "  migrate              Run pending migrations\n";
        echo "  migrate:rollback [n] Rollback last n migrations (default: 1)\n";
        echo "  migrate:fresh        Drop all tables and re-run migrations\n";
        echo "  migrate:status       Show migration status\n";
        echo "  migrate:seed         Run migrations then seeders\n";
        echo "  db:seed [SeederName] Run seeders (optionally specify seeder class)\n";
        echo "  db:fresh             Drop tables, run migrations, then seeders\n";
        echo "  help                 Show this help message\n\n";
        echo "Examples:\n";
        echo "  php migrate.php migrate\n";
        echo "  php migrate.php migrate:rollback 2\n";
        echo "  php migrate.php db:seed BooksSeeder\n";
        echo "  php migrate.php db:fresh\n";
        break;
}