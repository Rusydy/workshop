<?php

abstract class Seeder
{
    protected $pdo;
    
    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }
    
    abstract public function run();
    
    protected function insert($table, $data)
    {
        if (empty($data)) {
            return;
        }
        
        // Handle single record or array of records
        $records = isset($data[0]) && is_array($data[0]) ? $data : [$data];
        
        foreach ($records as $record) {
            $columns = array_keys($record);
            $placeholders = array_map(function($col) { return ":{$col}"; }, $columns);
            
            $sql = "INSERT INTO `{$table}` (`" . implode('`, `', $columns) . "`) VALUES (" . implode(', ', $placeholders) . ")";
            
            try {
                $stmt = $this->pdo->prepare($sql);
                $stmt->execute($record);
                echo "✓ Inserted record into {$table}\n";
            } catch (PDOException $e) {
                echo "✗ Error inserting into {$table}: " . $e->getMessage() . "\n";
                throw $e;
            }
        }
    }
    
    protected function truncate($table)
    {
        try {
            $this->pdo->exec("SET FOREIGN_KEY_CHECKS = 0");
            $this->pdo->exec("TRUNCATE TABLE `{$table}`");
            $this->pdo->exec("SET FOREIGN_KEY_CHECKS = 1");
            echo "✓ Truncated table {$table}\n";
        } catch (PDOException $e) {
            echo "✗ Error truncating {$table}: " . $e->getMessage() . "\n";
            throw $e;
        }
    }
    
    protected function tableExists($table)
    {
        $stmt = $this->pdo->prepare("SHOW TABLES LIKE ?");
        $stmt->execute([$table]);
        return $stmt->rowCount() > 0;
    }
    
    protected function getLastInsertId()
    {
        return $this->pdo->lastInsertId();
    }
    
    protected function count($table)
    {
        try {
            $stmt = $this->pdo->query("SELECT COUNT(*) FROM `{$table}`");
            return $stmt->fetchColumn();
        } catch (PDOException $e) {
            // Table might not exist yet
            return 0;
        }
    }
}