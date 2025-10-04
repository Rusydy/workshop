<?php
// Admin authentication helper
session_start();

// Check if admin is logged in
function requireAdminAuth() {
    if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
        header('Location: ' . getAdminUrl('login.php'));
        exit();
    }
}

// Check if admin has specific role
function requireAdminRole($required_role = 'admin') {
    requireAdminAuth();
    
    if ($_SESSION['admin_role'] !== $required_role && $_SESSION['admin_role'] !== 'admin') {
        header('Location: ' . getAdminUrl('index.php?error=access_denied'));
        exit();
    }
}

// Get admin URL relative to current location
function getAdminUrl($path = '') {
    // Get current script directory
    $current_dir = dirname($_SERVER['SCRIPT_NAME']);
    
    // If we're already in admin directory, use relative path
    if (basename($current_dir) === 'admin') {
        return $path;
    }
    
    // Otherwise, build path to admin directory
    return 'admin/' . $path;
}

// Check if current user is logged in admin
function isCurrentUser($user_id) {
    return isset($_SESSION['admin_id']) && $_SESSION['admin_id'] == $user_id;
}

// Get current admin info
function getCurrentAdmin() {
    if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
        return null;
    }
    
    return [
        'id' => $_SESSION['admin_id'] ?? null,
        'username' => $_SESSION['admin_username'] ?? '',
        'name' => $_SESSION['admin_name'] ?? '',
        'role' => $_SESSION['admin_role'] ?? 'moderator'
    ];
}

// Check if admin has permission
function hasPermission($permission) {
    $admin = getCurrentAdmin();
    if (!$admin) {
        return false;
    }
    
    // Admin role has all permissions
    if ($admin['role'] === 'admin') {
        return true;
    }
    
    // Define permissions for different roles
    $permissions = [
        'moderator' => [
            'view_dashboard',
            'view_books',
            'add_books',
            'edit_books',
            'delete_books',
            'view_orders',
            'update_order_status',
            'view_settings'
        ],
        'admin' => ['*'] // All permissions
    ];
    
    $role_permissions = $permissions[$admin['role']] ?? [];
    
    return in_array('*', $role_permissions) || in_array($permission, $role_permissions);
}

// Generate CSRF token
function generateCSRFToken() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

// Verify CSRF token
function verifyCSRFToken($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

// Sanitize output
function e($string) {
    return htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
}

// Format date for display
function formatDate($date, $format = 'M d, Y H:i') {
    if (!$date) return 'N/A';
    return date($format, strtotime($date));
}

// Format currency
function formatCurrency($amount) {
    return '$' . number_format($amount, 2);
}

// Generate avatar initials
function getAvatarInitials($name) {
    $words = explode(' ', trim($name));
    if (count($words) >= 2) {
        return strtoupper(substr($words[0], 0, 1) . substr($words[1], 0, 1));
    }
    return strtoupper(substr($name, 0, 1));
}

// Get status badge class
function getStatusBadgeClass($status) {
    $classes = [
        'active' => 'success',
        'inactive' => 'secondary',
        'pending' => 'warning',
        'completed' => 'success',
        'cancelled' => 'danger',
        'admin' => 'danger',
        'moderator' => 'primary'
    ];
    
    return $classes[strtolower($status)] ?? 'secondary';
}

// Log admin activity (simple logging)
function logAdminActivity($action, $details = '') {
    $admin = getCurrentAdmin();
    if (!$admin) return;
    
    $log_entry = date('Y-m-d H:i:s') . " - " . $admin['username'] . " ({$admin['role']}): $action";
    if ($details) {
        $log_entry .= " - $details";
    }
    $log_entry .= "\n";
    
    // Simple file logging (in production, use proper logging system)
    $log_file = __DIR__ . '/../logs/admin_activity.log';
    $log_dir = dirname($log_file);
    
    if (!is_dir($log_dir)) {
        mkdir($log_dir, 0755, true);
    }
    
    file_put_contents($log_file, $log_entry, FILE_APPEND | LOCK_EX);
}