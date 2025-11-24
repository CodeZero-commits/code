<?php
// api/articles.php
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

class ArticlesController {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        try {
            switch($method) {
                case 'GET': $this->getArticles(); break;
                case 'POST': $this->createArticle(); break;
                case 'PUT': $this->updateArticle(); break;
                case 'DELETE': $this->deleteArticle(); break;
                default: $this->sendError("Método no permitido: $method", 405);
            }
        } catch(Exception $e) {
            $this->sendError("Error interno: " . $e->getMessage(), 500);
        }
    }

    private function getArticles() {
        try {
            $stmt = $this->pdo->query("SELECT id, title, excerpt, content, author, image_url, status, is_featured, display_order, created_at, updated_at FROM articles ORDER BY display_order ASC, created_at DESC");
            $articles = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $this->sendResponse([
                'success' => true,
                'articles' => $articles,
                'total' => count($articles)
            ]);
        } catch(Exception $e) {
            $this->sendError("Error al obtener artículos: " . $e->getMessage(), 500);
        }
    }

    private function createArticle() {
        $data = $this->getJsonInput();
        if (empty($data['title'])) return $this->sendError("El título es requerido", 400);

        try {
            $stmt = $this->pdo->prepare("INSERT INTO articles (title, excerpt, content, author, image_url, status, is_featured, display_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())");
            $stmt->execute([
                trim($data['title']),
                trim($data['excerpt'] ?? ''),
                trim($data['content'] ?? ''),
                trim($data['author'] ?? ''),
                trim($data['image_url'] ?? ''),
                trim($data['status'] ?? 'draft'),
                !empty($data['is_featured']) ? 1 : 0,
                intval($data['display_order'] ?? 1),
            ]);

            $this->sendResponse([
                'success' => true,
                'message' => 'Artículo creado',
                'id' => $this->pdo->lastInsertId(),
            ], 201);
        } catch(Exception $e) {
            $this->sendError("Error al crear artículo: " . $e->getMessage(), 500);
        }
    }

    private function updateArticle() {
        $id = $_GET['id'] ?? null;
        if (!$id) return $this->sendError("ID requerido", 400);

        $data = $this->getJsonInput();

        try {
            $stmt = $this->pdo->prepare("UPDATE articles SET title = ?, excerpt = ?, content = ?, author = ?, image_url = ?, status = ?, is_featured = ?, display_order = ?, updated_at = NOW() WHERE id = ?");
            $stmt->execute([
                trim($data['title'] ?? ''),
                trim($data['excerpt'] ?? ''),
                trim($data['content'] ?? ''),
                trim($data['author'] ?? ''),
                trim($data['image_url'] ?? ''),
                trim($data['status'] ?? 'draft'),
                !empty($data['is_featured']) ? 1 : 0,
                intval($data['display_order'] ?? 1),
                $id
            ]);

            $this->sendResponse([
                'success' => true,
                'message' => 'Artículo actualizado'
            ]);
        } catch(Exception $e) {
            $this->sendError("Error al actualizar artículo: " . $e->getMessage(), 500);
        }
    }

    private function deleteArticle() {
        $id = $_GET['id'] ?? null;
        if (!$id) return $this->sendError("ID requerido", 400);

        try {
            $stmt = $this->pdo->prepare("DELETE FROM articles WHERE id = ?");
            $stmt->execute([$id]);
            $this->sendResponse([
                'success' => true,
                'message' => 'Artículo eliminado'
            ]);
        } catch(Exception $e) {
            $this->sendError("Error al eliminar artículo: " . $e->getMessage(), 500);
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

$controller = new ArticlesController($pdo);
$controller->handleRequest();
