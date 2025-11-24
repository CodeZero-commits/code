<?php
// api/content.php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    require_once 'config.php';
    $pdo = $pdoClinicFlow;
    if (!$pdo) throw new Exception("PDO no disponible");
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error de configuración del servidor',
        'debug' => $e->getMessage()
    ]);
    exit;
}

class ContentController {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        try {
            switch($method) {
                case 'GET': $this->getContent(); break;
                case 'POST': $this->createSection(); break;
                case 'PUT': $this->updateSection(); break;
                case 'DELETE': $this->deleteSection(); break;
                default: $this->sendError("Método no permitido: $method", 405);
            }
        } catch(Exception $e) {
            $this->sendError("Error interno: " . $e->getMessage(), 500);
        }
    }

    private function getContent() {
        $section = $_GET['section'] ?? null;
        try {
            if ($section) {
                $stmt = $this->pdo->prepare("SELECT id, section, data_json, updated_at FROM content_home WHERE section = ? LIMIT 1");
                $stmt->execute([trim($section)]);
                $content = $stmt->fetch(PDO::FETCH_ASSOC);
                $content['data'] = $this->decodeData($content['data_json'] ?? '{}');
                return $this->sendResponse([
                    'success' => true,
                    'section' => $content
                ]);
            }

            $stmt = $this->pdo->query("SELECT id, section, data_json, updated_at FROM content_home ORDER BY updated_at DESC");
            $all = $stmt->fetchAll(PDO::FETCH_ASSOC);
            foreach($all as &$row) {
                $row['data'] = $this->decodeData($row['data_json']);
            }
            $this->sendResponse([
                'success' => true,
                'content' => $all
            ]);
        } catch(Exception $e) {
            $this->sendError("Error al obtener contenido: " . $e->getMessage(), 500);
        }
    }

    private function createSection() {
        $data = $this->getJsonInput();
        if (empty($data['section'])) return $this->sendError("La sección es requerida", 400);

        try {
            $stmt = $this->pdo->prepare("INSERT INTO content_home (section, data_json, updated_at) VALUES (?, ?, NOW())");
            $stmt->execute([
                trim($data['section']),
                json_encode($data['data'] ?? new stdClass())
            ]);
            $this->sendResponse([
                'success' => true,
                'message' => 'Sección creada',
                'id' => $this->pdo->lastInsertId()
            ], 201);
        } catch(Exception $e) {
            $this->sendError("Error al crear sección: " . $e->getMessage(), 500);
        }
    }

    private function updateSection() {
        $section = $_GET['section'] ?? null;
        $data = $this->getJsonInput();
        if (!$section && empty($data['section'])) return $this->sendError("Sección requerida", 400);
        $sectionName = $section ?: $data['section'];

        try {
            $stmt = $this->pdo->prepare("INSERT INTO content_home (section, data_json, updated_at) VALUES (?, ?, NOW()) ON DUPLICATE KEY UPDATE data_json = VALUES(data_json), updated_at = NOW()");
            $stmt->execute([
                trim($sectionName),
                json_encode($data['data'] ?? new stdClass())
            ]);
            $this->sendResponse([
                'success' => true,
                'message' => 'Sección actualizada'
            ]);
        } catch(Exception $e) {
            $this->sendError("Error al actualizar sección: " . $e->getMessage(), 500);
        }
    }

    private function deleteSection() {
        $id = $_GET['id'] ?? null;
        if (!$id) return $this->sendError("ID requerido", 400);

        try {
            $stmt = $this->pdo->prepare("DELETE FROM content_home WHERE id = ?");
            $stmt->execute([$id]);
            $this->sendResponse([
                'success' => true,
                'message' => 'Sección eliminada'
            ]);
        } catch(Exception $e) {
            $this->sendError("Error al eliminar sección: " . $e->getMessage(), 500);
        }
    }

    private function decodeData($json) {
        if (!$json) return new stdClass();
        $decoded = json_decode($json, true);
        return is_array($decoded) ? $decoded : new stdClass();
    }

    private function getJsonInput() {
        $raw = file_get_contents('php://input');
        $decoded = json_decode($raw, true);
        return is_array($decoded) ? $decoded : [];
    }

    private function sendResponse($data, $code = 200) {
        http_response_code($code);
        echo json_encode($data);
        exit;
    }

    private function sendError($message, $code = 400) {
        http_response_code($code);
        echo json_encode([
            'success' => false,
            'error' => $message
        ]);
        exit;
    }
}

$controller = new ContentController($pdo);
$controller->handleRequest();
