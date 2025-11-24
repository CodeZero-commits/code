<?php
// api/whats_webhook.php

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// 🔐 Token de verificación (el mismo que pusiste en Meta Developers)
$verify_token = "EAFmgA2qZC1JYBPVCru5ZBanrgbnZBrl9lAd5h9rzoUQjsgFEw2B5r8gfwUlM1B4Bq7WAOpfVmX1dPgO5luRrw5h6lZAwZB0QZAQLg44fmnZBu4iiZAftLsbImpRRUHoEjCGKeU0Wowqm1hwBLu99mN3eMHpEBBD0sKpnU51BlffPNxlVZCSKVON9L8mAKfFZBTUtC8pwZDZD";

// ✅ Conexión y helpers centralizados
require_once 'whats_base.php';

class WhatsWebhook {
    private $pdo;
    private $verify_token;

    public function __construct($pdo, $verify_token) {
        $this->pdo = $pdo;
        $this->verify_token = $verify_token;
    }

    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];

        if ($method === 'GET') {
            $this->verifyWebhook();
        } elseif ($method === 'POST') {
            $this->processMessage();
        } elseif ($method === 'OPTIONS') {
            http_response_code(200);
            exit();
        } else {
            $this->sendResponse(['success' => false, 'error' => 'Método no permitido'], 405);
        }
    }

    private function verifyWebhook() {
        if (
            isset($_GET['hub_mode']) &&
            $_GET['hub_mode'] === 'subscribe' &&
            $_GET['hub_verify_token'] === $this->verify_token
        ) {
            echo $_GET['hub_challenge'];
            exit();
        }
        http_response_code(403);
        echo "Verificación fallida";
        exit();
    }

    private function processMessage() {
        $input = file_get_contents("php://input");
        $data = json_decode($input, true);

        // Log para debug
        logWhats("Webhook recibido: " . $input);

        if (!isset($data['entry'][0]['changes'][0]['value']['messages'][0])) {
            $this->sendResponse(['success' => false, 'error' => 'Sin mensajes'], 200);
            return;
        }

        $message = $data['entry'][0]['changes'][0]['value']['messages'][0];
        $from = $message['from']; // número de cliente
        $text = $message['text']['body'] ?? '';
        $timestamp = date("Y-m-d H:i:s");

        try {
            // Verificar si contacto existe
            $stmt = $this->pdo->prepare("SELECT id FROM whats_contacts WHERE phone = ?");
            $stmt->execute([$from]);
            $contact = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$contact) {
                $stmt = $this->pdo->prepare("INSERT INTO whats_contacts (phone, name) VALUES (?, ?)");
                $stmt->execute([$from, "Desconocido"]);
                $contact_id = $this->pdo->lastInsertId();
                logWhats("Nuevo contacto creado: $from con ID $contact_id");
            } else {
                $contact_id = $contact['id'];
                logWhats("Contacto existente encontrado: $from con ID $contact_id");
            }

            // Guardar mensaje
            $stmt = $this->pdo->prepare("
                INSERT INTO whats_messages (contact_id, message, direction, created_at) 
                VALUES (?, ?, 'in', ?)
            ");
            $stmt->execute([$contact_id, $text, $timestamp]);

            $this->sendResponse(['success' => true, 'message' => 'Mensaje recibido y guardado']);
        } catch (Exception $e) {
            logWhats("Error al procesar mensaje: " . $e->getMessage());
            $this->sendResponse(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    private function sendResponse($data, $statusCode = 200) {
        http_response_code($statusCode);
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }
}

// Ejecutar
$controller = new WhatsWebhook($pdo, $verify_token);
$controller->handleRequest();