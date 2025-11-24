<?php
// api/login.php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    require_once 'config.php';
    if (!isset($pdoCRM)) {
        throw new Exception("Conexión no disponible");
    }
    $pdo = $pdoCRM;
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(['success'=>false,'error'=>'Error de configuración','debug'=>$e->getMessage()]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);
$usuario = $input['usuario'] ?? '';
$password = $input['password'] ?? '';

if (!$usuario || !$password) {
    echo json_encode(['success'=>false,'error'=>'Usuario y contraseña requeridos']);
    exit;
}

$stmt = $pdo->prepare("SELECT id, usuario, email, telefono, password FROM staff WHERE usuario = ?");
$stmt->execute([$usuario]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(['success'=>false,'error'=>'Usuario no encontrado']);
    exit;
}

// Verificar contraseña usando password_verify
if (!password_verify($password, $user['password'])) {
    echo json_encode(['success'=>false,'error'=>'Contraseña incorrecta']);
    exit;
}


// Generar "token" sencillo (puedes usar JWT en el futuro)
$token = base64_encode(random_bytes(24));

echo json_encode([
    'success'=>true,
    'message'=>'Login exitoso',
    'token'=>$token,
    'user'=>[
        'id'=>$user['id'],
        'usuario'=>$user['usuario'],
        'email'=>$user['email'],
        'telefono'=>$user['telefono']
    ]
]);