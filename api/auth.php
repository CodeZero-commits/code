<?php
// api/auth.php
// Middleware to validate JWT on protected routes

require_once 'jwt_utils.php';

function validateAuth() {
    $headers = apache_request_headers();
    $authHeader = $headers['Authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';

    if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Token no proporcionado']);
        exit;
    }

    $token = $matches[1];
    $jwt_secret = getenv('JWT_SECRET') ?: 'ChangeMeToSomethingSecureAndLongRandomString123!';

    $payload = JWT::decode($token, $jwt_secret);

    if (!$payload) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Token inválido o expirado']);
        exit;
    }

    // Return user info attached to the request context if needed
    return $payload;
}

// Usage example for other files:
// require_once 'auth.php';
// $user = validateAuth();
