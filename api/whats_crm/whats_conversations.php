<?php
require_once 'whats_base.php';

try {
    $contactId = isset($_GET['contact_id']) ? intval($_GET['contact_id']) : null;

    if ($contactId) {
        // Obtener mensajes de un contacto
        $stmt = $pdo->prepare("
            SELECT wm.id, wm.message, wm.direction, wm.created_at, wc.phone, wc.name
            FROM whats_messages wm
            JOIN whats_contacts wc ON wm.contact_id = wc.id
            WHERE wm.contact_id = ?
            ORDER BY wm.created_at ASC
        ");
        $stmt->execute([$contactId]);
        $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

        sendResponse([
            'success' => true,
            'contact_id' => $contactId,
            'messages' => $messages
        ]);
    } else {
        // Lista de conversaciones con último mensaje
        $stmt = $pdo->query("
            SELECT wc.id AS contact_id, wc.phone, wc.name,
                   (SELECT wm.message FROM whats_messages wm WHERE wm.contact_id = wc.id ORDER BY wm.created_at DESC LIMIT 1) AS last_message,
                   (SELECT wm.created_at FROM whats_messages wm WHERE wm.contact_id = wc.id ORDER BY wm.created_at DESC LIMIT 1) AS last_time
            FROM whats_contacts wc
            ORDER BY last_time DESC
        ");
        $conversations = $stmt->fetchAll(PDO::FETCH_ASSOC);

        sendResponse([
            'success' => true,
            'conversations' => $conversations
        ]);
    }

} catch (Exception $e) {
    sendError($e->getMessage(), 500);
}