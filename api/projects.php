<?php
// api/projects.php
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

class ProjectsController {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];

        // Enforce Authentication
        require_once 'auth.php';
        try {
            validateAuth();
        } catch(Exception $e) {
            $this->sendError("No autorizado", 401);
            return;
        }

        try {
          switch($method) {
            case 'GET': $this->getProjects(); break;
            case 'POST': $this->createProject(); break;
            case 'PUT': $this->updateProject(); break;
            case 'DELETE': $this->deleteProject(); break;
            default: $this->sendError("Método no permitido: $method", 405);
          }
        } catch(Exception $e) {
          $this->sendError("Error interno: " . $e->getMessage(), 500);
        }
    }

    private function getProjects() {
        try {
            $stmt = $this->pdo->query("SELECT id, title, description, category, image_url, status, is_featured, display_order, created_at, updated_at FROM projects ORDER BY display_order ASC, created_at DESC");
            $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $this->sendResponse([
                'success' => true,
                'projects' => $projects,
                'total' => count($projects)
            ]);
        } catch(Exception $e) {
            $this->sendError("Error al obtener proyectos: " . $e->getMessage(), 500);
        }
    }

    private function createProject() {
        $data = $this->getJsonInput();
        if (empty($data['title'])) {
            return $this->sendError("El título es requerido", 400);
        }

        try {
            $stmt = $this->pdo->prepare("INSERT INTO projects (title, description, category, image_url, status, is_featured, display_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())");
            $stmt->execute([
                trim($data['title']),
                trim($data['description'] ?? ''),
                trim($data['category'] ?? 'General'),
                trim($data['image_url'] ?? ''),
                trim($data['status'] ?? 'draft'),
                !empty($data['is_featured']) ? 1 : 0,
                intval($data['display_order'] ?? 1),
            ]);

            $this->sendResponse([
                'success' => true,
                'message' => 'Proyecto creado',
                'id' => $this->pdo->lastInsertId(),
            ], 201);
        } catch(Exception $e) {
            $this->sendError("Error al crear proyecto: " . $e->getMessage(), 500);
        }
    }

    private function updateProject() {
        $id = $_GET['id'] ?? null;
        if (!$id) return $this->sendError("ID requerido", 400);

        $data = $this->getJsonInput();

        try {
            $stmt = $this->pdo->prepare("UPDATE projects SET title = ?, description = ?, category = ?, image_url = ?, status = ?, is_featured = ?, display_order = ?, updated_at = NOW() WHERE id = ?");
            $stmt->execute([
                trim($data['title'] ?? ''),
                trim($data['description'] ?? ''),
                trim($data['category'] ?? 'General'),
                trim($data['image_url'] ?? ''),
                trim($data['status'] ?? 'draft'),
                !empty($data['is_featured']) ? 1 : 0,
                intval($data['display_order'] ?? 1),
                $id
            ]);

            $this->sendResponse([
                'success' => true,
                'message' => 'Proyecto actualizado'
            ]);
        } catch(Exception $e) {
            $this->sendError("Error al actualizar proyecto: " . $e->getMessage(), 500);
        }
    }

    private function deleteProject() {
        $id = $_GET['id'] ?? null;
        if (!$id) return $this->sendError("ID requerido", 400);

        try {
            $stmt = $this->pdo->prepare("DELETE FROM projects WHERE id = ?");
            $stmt->execute([$id]);
            $this->sendResponse([
                'success' => true,
                'message' => 'Proyecto eliminado'
            ]);
        } catch(Exception $e) {
            $this->sendError("Error al eliminar proyecto: " . $e->getMessage(), 500);
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

$controller = new ProjectsController($pdo);
$controller->handleRequest();
