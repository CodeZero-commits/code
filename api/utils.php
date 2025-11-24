<?php
// api/test.php - Archivo para probar la configuración

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Test básico del servidor
$tests = [];

// Test 1: Información del servidor
$tests['server_info'] = [
    'php_version' => PHP_VERSION,
    'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
    'request_method' => $_SERVER['REQUEST_METHOD'],
    'timestamp' => date('Y-m-d H:i:s')
];

// Test 2: Conexión a base de datos
try {
    require_once 'config.php';
    
    if (isset($pdo)) {
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM staff");
        $result = $stmt->fetch();
        
        $tests['database'] = [
            'status' => 'connected',
            'total_staff' => $result['total']
        ];
    } else {
        $tests['database'] = [
            'status' => 'error',
            'message' => 'PDO not initialized'
        ];
    }
    
} catch(Exception $e) {
    $tests['database'] = [
        'status' => 'error',
        'message' => $e->getMessage()
    ];
}

// Test 3: Permisos de escritura
$tests['permissions'] = [
    'error_log_writable' => is_writable(ini_get('error_log')) || is_writable('./')
];

// Test 4: Variables de entorno
$tests['environment'] = [
    'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'Not set',
    'script_name' => $_SERVER['SCRIPT_NAME'] ?? 'Not set',
    'request_uri' => $_SERVER['REQUEST_URI'] ?? 'Not set'
];

echo json_encode([
    'success' => true,
    'message' => 'Test endpoint funcionando correctamente',
    'tests' => $tests
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>