<?php
// api/packages.php
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

class PackagesController {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        try {
            switch($method) {
                case 'GET': $this->getPackages(); break;
                case 'POST': $this->createPackage(); break;
                case 'PUT': $this->updatePackage(); break;
                case 'DELETE': $this->deletePackage(); break;
                default: $this->sendError("Método no permitido: $method", 405);
            }
        } catch(Exception $e) {
            $this->sendError("Error interno: " . $e->getMessage(), 500);
        }
    }

    private function getPackages() {
        try {
            $stmt = $this->pdo->query("SELECT id, name, category, price, description, benefits_json, visibility, display_order, image_url, created_at, updated_at FROM packages ORDER BY display_order ASC, created_at DESC");
            $packages = $stmt->fetchAll(PDO::FETCH_ASSOC);
            foreach ($packages as &$pkg) {
                if (!empty($pkg['benefits_json'])) {
                    $decoded = json_decode($pkg['benefits_json'], true);
                    $pkg['benefits'] = is_array($decoded) ? $decoded : [];
                }
            }
            $this->sendResponse([
                'success' => true,
                'packages' => $packages,
                'total' => count($packages)
            ]);
        } catch(Exception $e) {
            $this->sendError("Error al obtener paquetes: " . $e->getMessage(), 500);
        }
    }

    private function createPackage() {
        $data = $this->getJsonInput();
        if (empty($data['name'])) return $this->sendError("El nombre es requerido", 400);

        try {
            $stmt = $this->pdo->prepare("INSERT INTO packages (name, category, price, description, benefits_json, visibility, display_order, image_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())");
            $stmt->execute([
                trim($data['name']),
                trim($data['category'] ?? 'General'),
                trim($data['price'] ?? ''),
                trim($data['description'] ?? ''),
                $data['benefits_json'] ?? json_encode($data['benefits'] ?? []),
                trim($data['visibility'] ?? 'public'),
                intval($data['display_order'] ?? 1),
                trim($data['image_url'] ?? ''),
            ]);

            $this->sendResponse([
                'success' => true,
                'message' => 'Paquete creado',
                'id' => $this->pdo->lastInsertId(),
            ], 201);
        } catch(Exception $e) {
            $this->sendError("Error al crear paquete: " . $e->getMessage(), 500);
        }
    }

    private function updatePackage() {
        $id = $_GET['id'] ?? null;
        if (!$id) return $this->sendError("ID requerido", 400);

        $data = $this->getJsonInput();

        try {
            $stmt = $this->pdo->prepare("UPDATE packages SET name = ?, category = ?, price = ?, description = ?, benefits_json = ?, visibility = ?, display_order = ?, image_url = ?, updated_at = NOW() WHERE id = ?");
            $stmt->execute([
                trim($data['name'] ?? ''),
                trim($data['category'] ?? 'General'),
                trim($data['price'] ?? ''),
                trim($data['description'] ?? ''),
                $data['benefits_json'] ?? json_encode($data['benefits'] ?? []),
                trim($data['visibility'] ?? 'public'),
                intval($data['display_order'] ?? 1),
                trim($data['image_url'] ?? ''),
                $id
            ]);

            $this->sendResponse([
                'success' => true,
                'message' => 'Paquete actualizado'
            ]);
        } catch(Exception $e) {
            $this->sendError("Error al actualizar paquete: " . $e->getMessage(), 500);
        }
    }

    private function deletePackage() {
        $id = $_GET['id'] ?? null;
        if (!$id) return $this->sendError("ID requerido", 400);

        try {
            $stmt = $this->pdo->prepare("DELETE FROM packages WHERE id = ?");
            $stmt->execute([$id]);
            $this->sendResponse([
                'success' => true,
                'message' => 'Paquete eliminado'
            ]);
        } catch(Exception $e) {
            $this->sendError("Error al eliminar paquete: " . $e->getMessage(), 500);
        }
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

$controller = new PackagesController($pdo);
$controller->handleRequest();
