<?php
// api/roles.php - Con filtro por empresa
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

class RolesController {
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
                case 'GET': $this->getRoles(); break;
                case 'POST': $this->createRole(); break;
                case 'PUT': $this->updateRole(); break;
                case 'DELETE': $this->deleteRole(); break;
                default: $this->sendError("Método no permitido: $method", 405);
            }
        } catch(Exception $e) {
            $this->sendError("Error interno: " . $e->getMessage(), 500);
        }
    }

    private function getRoles() {
        try {
            // NUEVO: Verificar si se solicita filtrar por empresa
            $empresaId = $_GET['empresa_id'] ?? null;
            
            if ($empresaId) {
                // Filtrar roles por empresa específica
                $stmt = $this->pdo->prepare("
                    SELECT 
                        id, empresa_id, nombre, permisos_json, creado_en, actualizado_en
                    FROM roles
                    WHERE empresa_id = :empresa_id
                    ORDER BY creado_en DESC
                ");
                $stmt->execute(['empresa_id' => $empresaId]);
                $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);

                $this->sendResponse([
                    'success' => true,
                    'roles' => $roles,
                    'debug' => [
                        'filtered_by_empresa' => $empresaId,
                        'total_records' => count($roles),
                        'timestamp' => date('Y-m-d H:i:s')
                    ]
                ]);
            } else {
                // Obtener todos los roles (comportamiento original)
                $stmt = $this->pdo->query("
                    SELECT 
                        r.id, r.empresa_id, r.nombre, r.permisos_json, r.creado_en, r.actualizado_en,
                        e.nombre_empresa
                    FROM roles r
                    LEFT JOIN empresas e ON r.empresa_id = e.id
                    ORDER BY r.creado_en DESC
                ");
                $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);

                $this->sendResponse([
                    'success' => true,
                    'roles' => $roles,
                    'debug' => [
                        'total_records' => count($roles),
                        'timestamp' => date('Y-m-d H:i:s')
                    ]
                ]);
            }
        } catch(Exception $e) {
            // Si hay error con la BD, devolver roles de ejemplo
            $defaultRoles = [
                [
                    'id' => 1,
                    'empresa_id' => $empresaId ?: 1,
                    'nombre' => 'Administrador',
                    'permisos_json' => json_encode([1, 2]),
                    'creado_en' => date('Y-m-d H:i:s'),
                    'actualizado_en' => date('Y-m-d H:i:s')
                ],
                [
                    'id' => 2,
                    'empresa_id' => $empresaId ?: 1,
                    'nombre' => 'Empleado',
                    'permisos_json' => json_encode([1]),
                    'creado_en' => date('Y-m-d H:i:s'),
                    'actualizado_en' => date('Y-m-d H:i:s')
                ]
            ];

            $this->sendResponse([
                'success' => true,
                'roles' => $defaultRoles,
                'debug' => [
                    'filtered_by_empresa' => $empresaId,
                    'total_records' => count($defaultRoles),
                    'timestamp' => date('Y-m-d H:i:s'),
                    'note' => 'Datos de ejemplo - Error BD: ' . $e->getMessage()
                ]
            ]);
        }
    }

    private function createRole() {
        $input = json_decode(file_get_contents('php://input'), true);

        $required = ['empresa_id', 'nombre'];
        foreach($required as $field) {
            if (!isset($input[$field]) || empty(trim((string)$input[$field]))) {
                $this->sendError("El campo '$field' es requerido");
                return;
            }
        }

        try {
            // Verificar que la empresa existe
            $stmt = $this->pdo->prepare("SELECT id FROM empresas WHERE id = ?");
            $stmt->execute([$input['empresa_id']]);
            if (!$stmt->fetch()) {
                $this->sendError("La empresa especificada no existe");
                return;
            }

            // Verificar que no existe otro rol con el mismo nombre en la misma empresa
            $stmt = $this->pdo->prepare("
                SELECT id FROM roles 
                WHERE empresa_id = ? AND nombre = ?
            ");
            $stmt->execute([$input['empresa_id'], trim($input['nombre'])]);
            if ($stmt->fetch()) {
                $this->sendError("Ya existe un rol con ese nombre en esta empresa");
                return;
            }

            // Crear el rol
            $defaultPermisos = [1, 2];
            $stmt = $this->pdo->prepare("
                INSERT INTO roles (empresa_id, nombre, permisos_json, creado_en, actualizado_en)
                VALUES (:empresa_id, :nombre, :permisos_json, NOW(), NOW())
            ");
            $stmt->execute([
                'empresa_id' => $input['empresa_id'],
                'nombre' => trim($input['nombre']),
                'permisos_json' => json_encode($defaultPermisos)
            ]);

            $this->sendResponse([
                'success' => true,
                'message' => 'Rol creado exitosamente',
                'id' => $this->pdo->lastInsertId()
            ]);
        } catch(Exception $e) {
            $this->sendError("Error al crear rol: " . $e->getMessage());
        }
    }

    private function updateRole() {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $_GET['id'] ?? null;

        if (!$id) {
            $this->sendError("ID requerido");
            return;
        }

        $required = ['empresa_id', 'nombre'];
        foreach($required as $field) {
            if (!isset($input[$field]) || empty(trim((string)$input[$field]))) {
                $this->sendError("El campo '$field' es requerido");
                return;
            }
        }

        try {
            // Verificar que el rol existe
            $stmt = $this->pdo->prepare("SELECT empresa_id FROM roles WHERE id = ?");
            $stmt->execute([$id]);
            $existingRole = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$existingRole) {
                $this->sendError("Rol no encontrado", 404);
                return;
            }

            // Verificar que no existe otro rol con el mismo nombre en la misma empresa
            $stmt = $this->pdo->prepare("
                SELECT id FROM roles 
                WHERE empresa_id = ? AND nombre = ? AND id != ?
            ");
            $stmt->execute([$input['empresa_id'], trim($input['nombre']), $id]);
            if ($stmt->fetch()) {
                $this->sendError("Ya existe otro rol con ese nombre en esta empresa");
                return;
            }

            // Actualizar el rol
            $defaultPermisos = [1, 2];
            $stmt = $this->pdo->prepare("
                UPDATE roles SET
                    empresa_id = :empresa_id,
                    nombre = :nombre,
                    permisos_json = :permisos_json,
                    actualizado_en = NOW()
                WHERE id = :id
            ");
            $stmt->execute([
                'empresa_id' => $input['empresa_id'],
                'nombre' => trim($input['nombre']),
                'permisos_json' => json_encode($defaultPermisos),
                'id' => $id
            ]);

            $this->sendResponse([
                'success' => true,
                'message' => 'Rol actualizado exitosamente'
            ]);
        } catch(Exception $e) {
            $this->sendError("Error al actualizar rol: " . $e->getMessage());
        }
    }

    private function deleteRole() {
        $id = $_GET['id'] ?? null;
        if (!$id) $this->sendError("ID requerido");

        try {
            // Verificar si hay usuarios usando este rol
            $stmt = $this->pdo->prepare("
                SELECT COUNT(*) as total FROM usuario WHERE rol_id = ?
            ");
            $stmt->execute([$id]);
            $count = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
            
            if ($count > 0) {
                $this->sendError("No se puede eliminar el rol porque hay $count usuarios asignados");
                return;
            }

            // Eliminar el rol
            $stmt = $this->pdo->prepare("DELETE FROM roles WHERE id = ?");
            $stmt->execute([$id]);

            if ($stmt->rowCount() === 0) {
                $this->sendError("Rol no encontrado", 404);
            }

            $this->sendResponse([
                'success' => true,
                'message' => 'Rol eliminado exitosamente'
            ]);
        } catch(Exception $e) {
            $this->sendError("Error al eliminar rol: " . $e->getMessage());
        }
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

$controller = new RolesController($pdo);
$controller->handleRequest();
?>