<?php
http_response_code(405);
header('Content-Type: application/json');

echo json_encode([
    'error' => 'Método no permitido',
    'code' => 405,
    'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE'], // puedes generarlo dinámicamente
    'tips' => 'Usa uno de los métodos permitidos'
]);
exit;