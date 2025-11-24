<?php
http_response_code(500);
header('Content-Type: application/json');

echo json_encode([
    'error' => 'Error interno del servidor',
    'code' => 500,
    'tips' => 'Revisa los logs del servidor para más detalles'
]);
exit;