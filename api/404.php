<?php
http_response_code(404);
header('Content-Type: application/json');

echo json_encode([
    'error' => 'Endpoint no encontrado',
    'code' => 404,
    'tips' => 'Verifica la URL o el método usado'
]);
exit;