<?php
require_once 'whats_base.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendError('Método no permitido', 405);
    }

    $input = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        sendError('JSON inválido: ' . json_last_error_msg(), 400);
    }

    $required = ['contact_id', 'message', 'direction'];
    foreach ($required as $field) {
        if (!isset($input[$field]) || empty(trim($input[$field]))) {
            sendError("El campo '$field' es requerido", 400);
        }
    }

    $stmt = $pdo->prepare("
        INSERT INTO whats_messages (contact_id, message, direction, created_at)
        VALUES (?, ?, ?, NOW())
    ");
    $stmt->execute([
        intval($input['contact_id']),
        trim($input['message']),
        trim($input['direction'])
    ]);

    sendResponse([
        'success' => true,
        'message' => 'Mensaje enviado correctamente',
        'id' => $pdo->lastInsertId()
    ]);

} catch (Exception $e) {
    sendError($e->getMessage(), 500);
}