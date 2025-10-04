<?php

abstract class Migration
{
    protected $pdo;
    
    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }
    
    abstract public function up();
    abstract public function down();
    
    protected function createTable($tableName, $columns)
    {
        $sql = "CREATE TABLE IF NOT EXISTS `{$tableName}` (\n";
        $sql .= implode(",\n", $columns);
        $sql .= "\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        
        $this->execute($sql);
    }
    
    protected function dropTable($tableName)
    {
        $sql = "DROP TABLE IF EXISTS `{$tableName}`";
        $this->execute($sql);
    }
    
    protected function addColumn($tableName, $columnDefinition)
    {
        $sql = "ALTER TABLE `{$tableName}` ADD COLUMN {$columnDefinition}";
        $this->execute($sql);
    }
    
    protected function dropColumn($tableName, $columnName)
    {
        $sql = "ALTER TABLE `{$tableName}` DROP COLUMN `{$columnName}`";
        $this->execute($sql);
    }
    
    protected function addIndex($tableName, $indexName, $columnNames)
    {
        $columns = is_array($columnNames) ? implode('`, `', $columnNames) : $columnNames;
        $sql = "CREATE INDEX `{$indexName}` ON `{$tableName}` (`{$columns}`)";
        $this->execute($sql);
    }
    
    protected function dropIndex($tableName, $indexName)
    {
        $sql = "ALTER TABLE `{$tableName}` DROP INDEX `{$indexName}`";
        $this->execute($sql);
    }
    
    protected function addForeignKey($tableName, $constraintName, $columnName, $referencedTable, $referencedColumn = 'id')
    {
        $sql = "ALTER TABLE `{$tableName}` ADD CONSTRAINT `{$constraintName}` FOREIGN KEY (`{$columnName}`) REFERENCES `{$referencedTable}` (`{$referencedColumn}`) ON DELETE CASCADE ON UPDATE CASCADE";
        $this->execute($sql);
    }
    
    protected function dropForeignKey($tableName, $constraintName)
    {
        $sql = "ALTER TABLE `{$tableName}` DROP FOREIGN KEY `{$constraintName}`";
        $this->execute($sql);
    }
    
    // Column type methods
    protected function id()
    {
        return "`id` INT AUTO_INCREMENT PRIMARY KEY";
    }
    
    protected function string($name, $length = 255)
    {
        return "`{$name}` VARCHAR({$length}) NOT NULL";
    }
    
    protected function text($name, $nullable = false)
    {
        $definition = "`{$name}` TEXT";
        return $nullable ? str_replace(' NOT NULL', '', $definition) : $definition;
    }
    
    protected function integer($name)
    {
        return "`{$name}` INT NOT NULL";
    }
    
    protected function decimal($name, $precision = 8, $scale = 2)
    {
        return "`{$name}` DECIMAL({$precision},{$scale}) NOT NULL";
    }
    
    protected function boolean($name)
    {
        return "`{$name}` BOOLEAN DEFAULT FALSE";
    }
    
    protected function datetime($name)
    {
        return "`{$name}` DATETIME";
    }
    
    protected function timestamp($name)
    {
        return "`{$name}` TIMESTAMP DEFAULT CURRENT_TIMESTAMP";
    }
    
    protected function enum($name, $values, $nullable = false, $default = null)
    {
        $enumValues = "'" . implode("','", $values) . "'";
        $definition = "`{$name}` ENUM({$enumValues})";
        
        if (!$nullable) {
            $definition .= " NOT NULL";
        }
        
        if ($default !== null) {
            $definition .= " DEFAULT '{$default}'";
        }
        
        return $definition;
    }
    
    protected function timestamps()
    {
        return [
            "`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
            "`updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ];
    }
    
    protected function nullable($columnDefinition)
    {
        return str_replace(' NOT NULL', '', $columnDefinition);
    }
    
    protected function unique($columnDefinition)
    {
        return $columnDefinition . ' UNIQUE';
    }
    
    protected function default($columnDefinition, $defaultValue)
    {
        if (is_string($defaultValue)) {
            $defaultValue = "'{$defaultValue}'";
        } elseif (is_null($defaultValue)) {
            $defaultValue = 'NULL';
        }
        return $columnDefinition . " DEFAULT {$defaultValue}";
    }
    
    protected function tableExists($tableName)
    {
        $stmt = $this->pdo->prepare("SHOW TABLES LIKE ?");
        $stmt->execute([$tableName]);
        return $stmt->rowCount() > 0;
    }
    
    protected function execute($sql)
    {
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            echo "✓ Executed: " . substr($sql, 0, 50) . "...\n";
        } catch (PDOException $e) {
            echo "✗ Error executing SQL: " . $e->getMessage() . "\n";
            echo "SQL: {$sql}\n";
            throw $e;
        }
    }
}