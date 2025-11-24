<?php
// api/planes.php
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

class PlanesController {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        try {
            switch($method) {
                case 'GET': $this->getPlanes(); break;
                case 'POST': $this->createPlan(); break;
                case 'PUT': $this->updatePlan(); break;
                case 'DELETE': $this->deletePlan(); break;
                default: $this->sendError("Método no permitido: $method", 405);
            }
        } catch(Exception $e) {
            $this->sendError("Error interno: " . $e->getMessage(), 500);
        }
    }

    private function getPlanes() {
        try {
            $stmt = $this->pdo->query("
                SELECT id, nombre, precio, limite_usuarios, limite_proyectos, caracteristicas, creado_en, actualizado_en
                FROM planes
                ORDER BY creado_en DESC
            ");
            $planes = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $this->sendResponse([
                'success' => true,
                'planes' => $planes,
                'debug' => [
                    'total_records' => count($planes),
                    'timestamp' => date('Y-m-d H:i:s')
                ]
            ]);
        } catch(Exception $e) {
            $this->sendError("Error al obtener planes: " . $e->getMessage(), 500);
        }
    }

    private function createPlan() {
        $input = json_decode(file_get_contents('php://input'), true);

        $required = ['proyecto_id', 'nombre', 'precio', 'limite_usuarios', 'limite_proyectos', 'caracteristicas'];
        foreach($required as $field) {
            if (!isset($input[$field]) || $input[$field] === '') {
                $this->sendError("El campo '$field' es requerido");
                return;
            }
        }

        $stmt = $this->pdo->prepare("
            INSERT INTO planes (proyecto_id, nombre, precio, limite_usuarios, limite_proyectos, caracteristicas, creado_en, actualizado_en)
            VALUES (:proyecto_id, :nombre, :precio, :limite_usuarios, :limite_proyectos, :caracteristicas, NOW(), NOW())
        ");
        $stmt->execute([
            'proyecto_id' => $input['proyecto_id'],
            'nombre' => trim($input['nombre']),
            'precio' => $input['precio'],
            'limite_usuarios' => $input['limite_usuarios'],
            'limite_proyectos' => $input['limite_proyectos'],
            'caracteristicas' => json_encode($input['caracteristicas'])
        ]);

        $this->sendResponse([
            'success' => true,
            'message' => 'Plan creado exitosamente',
            'id' => $this->pdo->lastInsertId()
        ]);
    }

    private function updatePlan() {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $_GET['id'] ?? null;

        if (!$id) {
            $this->sendError("ID requerido");
            return;
        }

        $required = ['proyecto_id', 'nombre', 'precio', 'limite_usuarios', 'limite_proyectos', 'caracteristicas'];
        foreach($required as $field) {
            if (!isset($input[$field]) || $input[$field] === '') {
                $this->sendError("El campo '$field' es requerido");
                return;
            }
        }

        $stmt = $this->pdo->prepare("
            UPDATE planes SET
                proyecto_id = :proyecto_id,
                nombre = :nombre,
                precio = :precio,
                limite_usuarios = :limite_usuarios,
                limite_proyectos = :limite_proyectos,
                caracteristicas = :caracteristicas,
                actualizado_en = NOW()
            WHERE id = :id
        ");
        $stmt->execute([
            'proyecto_id' => $input['proyecto_id'],
            'nombre' => trim($input['nombre']),
            'precio' => $input['precio'],
            'limite_usuarios' => $input['limite_usuarios'],
            'limite_proyectos' => $input['limite_proyectos'],
            'caracteristicas' => json_encode($input['caracteristicas']),
            'id' => $id
        ]);

        $this->sendResponse([
            'success' => true,
            'message' => 'Plan actualizado exitosamente'
        ]);
    }

    private function deletePlan() {
        $id = $_GET['id'] ?? null;
        if (!$id) $this->sendError("ID requerido");

        $stmt = $this->pdo->prepare("DELETE FROM planes WHERE id = ?");
        $stmt->execute([$id]);

        if ($stmt->rowCount() === 0) {
            $this->sendError("Plan no encontrado", 404);
        }

        $this->sendResponse([
            'success' => true,
            'message' => 'Plan eliminado exitosamente'
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

$controller = new PlanesController($pdo);
$controller->handleRequest();