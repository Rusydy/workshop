<?php

class AdminUsersSeeder extends Seeder
{
    public function run()
    {
        // Check if admin users already exist
        $stmt = $this->pdo->prepare("SELECT COUNT(*) as count FROM admin_users");
        $stmt->execute();
        $count = $stmt->fetch()['count'];
        
        if ($count > 0) {
            echo "Admin users already exist, skipping seeder.\n";
            return;
        }
        
        // Create default admin user
        $adminData = [
            'username' => 'admin',
            'email' => 'admin@bookstore.com',
            'full_name' => 'System Administrator',
            'password' => password_hash('admin123', PASSWORD_DEFAULT),
            'role' => 'admin',
            'is_active' => 1
        ];
        
        $stmt = $this->pdo->prepare("
            INSERT INTO admin_users (username, email, full_name, password, role, is_active, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
        ");
        
        $stmt->execute([
            $adminData['username'],
            $adminData['email'],
            $adminData['full_name'],
            $adminData['password'],
            $adminData['role'],
            $adminData['is_active']
        ]);
        
        echo "✓ Created default admin user: {$adminData['username']} / admin123\n";
        
        // Create a moderator user
        $moderatorData = [
            'username' => 'moderator',
            'email' => 'moderator@bookstore.com',
            'full_name' => 'Content Moderator',
            'password' => password_hash('moderator123', PASSWORD_DEFAULT),
            'role' => 'moderator',
            'is_active' => 1
        ];
        
        $stmt->execute([
            $moderatorData['username'],
            $moderatorData['email'],
            $moderatorData['full_name'],
            $moderatorData['password'],
            $moderatorData['role'],
            $moderatorData['is_active']
        ]);
        
        echo "✓ Created default moderator user: {$moderatorData['username']} / moderator123\n";
    }
}