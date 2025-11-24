<?php
// api/proyectos.php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Headers CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Preflight OPTIONS
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

class ProyectosController {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        try {
            switch($method) {
                case 'GET': $this->getProyectos(); break;
                case 'POST': $this->createProyecto(); break;
                case 'PUT': $this->updateProyecto(); break;
                case 'DELETE': $this->deleteProyecto(); break;
                default: $this->sendError("Método no permitido: $method", 405);
            }
        } catch(Exception $e) {
            $this->sendError("Error interno: " . $e->getMessage(), 500);
        }
    }

    private function getProyectos() {
        try {
            $stmt = $this->pdo->query("
                SELECT 
                    id, nombre, descripcion, categoria, caracteristicas, creado_en, actualizado_en
                FROM proyectos
                ORDER BY creado_en DESC
            ");
            $proyectos = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $this->sendResponse([
                'success' => true,
                'proyectos' => $proyectos,
                'debug' => [
                    'total_records' => count($proyectos),
                    'timestamp' => date('Y-m-d H:i:s')
                ]
            ]);
        } catch(Exception $e) {
            $this->sendError("Error al obtener proyectos: " . $e->getMessage(), 500);
        }
    }

    private function createProyecto() {
        $input = json_decode(file_get_contents('php://input'), true);

        $required = ['nombre', 'descripcion'];
        foreach($required as $field) {
            if (!isset($input[$field]) || empty(trim($input[$field]))) {
                $this->sendError("El campo '$field' es requerido");
                return;
            }
        }

        $stmt = $this->pdo->prepare("
            INSERT INTO proyectos (
                nombre, descripcion, categoria, caracteristicas, creado_en
            ) VALUES (
                :nombre, :descripcion, :categoria, :caracteristicas, NOW()
            )
        ");

        $stmt->execute([
            'nombre' => trim($input['nombre']),
            'descripcion' => trim($input['descripcion']),
            'categoria' => trim($input['categoria'] ?? ''),
            'caracteristicas' => trim($input['caracteristicas'] ?? '')
        ]);

        $this->sendResponse([
            'success' => true,
            'message' => 'Proyecto creado exitosamente',
            'id' => $this->pdo->lastInsertId()
        ]);
    }

    private function updateProyecto() {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $_GET['id'] ?? null;

        if (!$id) {
            $this->sendError("ID requerido");
            return;
        }

        $required = ['nombre', 'descripcion'];
        foreach($required as $field) {
            if (!isset($input[$field]) || empty(trim($input[$field]))) {
                $this->sendError("El campo '$field' es requerido");
                return;
            }
        }

        $stmt = $this->pdo->prepare("
            UPDATE proyectos SET
                nombre = :nombre,
                descripcion = :descripcion,
                categoria = :categoria,
                caracteristicas = :caracteristicas,
                actualizado_en = NOW()
            WHERE id = :id
        ");

        $stmt->execute([
            'nombre' => trim($input['nombre']),
            'descripcion' => trim($input['descripcion']),
            'categoria' => trim($input['categoria'] ?? ''),
            'caracteristicas' => trim($input['caracteristicas'] ?? ''),
            'id' => $id
        ]);

        $this->sendResponse([
            'success' => true,
            'message' => 'Proyecto actualizado exitosamente'
        ]);
    }

    private function deleteProyecto() {
        $id = $_GET['id'] ?? null;
        if (!$id) $this->sendError("ID requerido");

        $stmt = $this->pdo->prepare("DELETE FROM proyectos WHERE id = ?");
        $stmt->execute([$id]);

        if ($stmt->rowCount() === 0) {
            $this->sendError("Proyecto no encontrado", 404);
        }

        $this->sendResponse([
            'success' => true,
            'message' => 'Proyecto eliminado exitosamente'
        ]);
    }

    private function sendResponse($data, $statusCode = 200) {
        http_response_code($statusCode);
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    private function sendError($message, $statusCode = 400) {
        $this->sendResponse([
            'success' => false,
            'error' => $message
        ], $statusCode);
    }
}

$controller = new ProyectosController($pdo);
$controller->handleRequest();
?>
