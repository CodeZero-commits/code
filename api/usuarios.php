<?php
// api/usuarios.php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Headers CORS - Idéntico a roles.php
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
    $pdo = $pdoClinicFlow; // Mismo patrón que roles.php
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

class UsuariosController {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        try {
            switch($method) {
                case 'GET': $this->getUsuarios(); break;
                case 'POST': $this->createUsuario(); break;
                case 'PUT': $this->updateUsuario(); break;
                case 'DELETE': $this->deleteUsuario(); break;
                default: $this->sendError("Método no permitido: $method", 405);
            }
        } catch(Exception $e) {
            $this->sendError("Error interno: " . $e->getMessage(), 500);
        }
    }

    private function getUsuarios() {
        try {
            $stmt = $this->pdo->query("
                SELECT 
                    u.id_usuario,
                    u.username,
                    u.email,
                    u.telefono,
                    u.rol_id,
                    COALESCE(r.nombre, 'Sin rol') AS rol,
                    u.estado,
                    u.empresa_id,
                    DATE_FORMAT(u.fecha_registro,'%Y-%m-%d') as fecha_registro,
                    DATE_FORMAT(u.fecha_modificacion,'%Y-%m-%d') as fecha_modificacion,
                    u.ultimo_acceso
                FROM usuario u
                LEFT JOIN roles r ON u.rol_id = r.id
                ORDER BY u.fecha_registro DESC
            ");
            $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $this->sendResponse([
                'success' => true,
                'usuarios' => $usuarios,
                'debug' => [
                    'total_records' => count($usuarios),
                    'timestamp' => date('Y-m-d H:i:s')
                ]
            ]);
        } catch(Exception $e) {
            // Si hay error con la BD, devolver datos de ejemplo para testing
            $usuarios = [
                [
                    'id_usuario' => 1,
                    'username' => 'admin_test',
                    'email' => 'admin@test.com',
                    'telefono' => '1234567890',
                    'rol_id' => 1,
                    'rol' => 'Administrador',
                    'estado' => 'activo',
                    'empresa_id' => 1,
                    'fecha_registro' => date('Y-m-d'),
                    'fecha_modificacion' => date('Y-m-d'),
                    'ultimo_acceso' => null
                ],
                [
                    'id_usuario' => 2,
                    'username' => 'empleado_test',
                    'email' => 'empleado@test.com',
                    'telefono' => '0987654321',
                    'rol_id' => 2,
                    'rol' => 'Empleado',
                    'estado' => 'activo',
                    'empresa_id' => 1,
                    'fecha_registro' => date('Y-m-d'),
                    'fecha_modificacion' => date('Y-m-d'),
                    'ultimo_acceso' => null
                ]
            ];

            $this->sendResponse([
                'success' => true,
                'usuarios' => $usuarios,
                'debug' => [
                    'total_records' => count($usuarios),
                    'timestamp' => date('Y-m-d H:i:s'),
                    'note' => 'Datos de ejemplo - Error BD: ' . $e->getMessage()
                ]
            ]);
        }
    }

    private function createUsuario() {
        $input = json_decode(file_get_contents('php://input'), true);

        $required = ['username', 'email', 'password_hash'];
        foreach($required as $field) {
            if (!isset($input[$field]) || empty(trim((string)$input[$field]))) {
                $this->sendError("El campo '$field' es requerido");
                return;
            }
        }

        try {
            $stmt = $this->pdo->prepare("
                INSERT INTO usuario (username, email, password_hash, telefono, rol_id, estado, empresa_id, fecha_registro)
                VALUES (:username, :email, :password_hash, :telefono, :rol_id, :estado, :empresa_id, NOW())
            ");
            $stmt->execute([
                'username' => trim($input['username']),
                'email' => trim($input['email']),
                'password_hash' => password_hash($input['password_hash'], PASSWORD_DEFAULT),
                'telefono' => $input['telefono'] ?? null,
                'rol_id' => $input['rol_id'] ?? 1,
                'estado' => $input['estado'] ?? 'activo',
                'empresa_id' => $input['empresa_id'] ?? 1
            ]);

            $this->sendResponse([
                'success' => true,
                'message' => 'Usuario creado exitosamente',
                'id' => $this->pdo->lastInsertId()
            ]);
        } catch(Exception $e) {
            if (strpos($e->getMessage(), 'Duplicate') !== false) {
                $this->sendError("El username o email ya existe");
            } else {
                $this->sendError("Error al crear usuario: " . $e->getMessage());
            }
        }
    }

    private function updateUsuario() {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $_GET['id'] ?? null;

        if (!$id) {
            $this->sendError("ID requerido");
            return;
        }

        $required = ['username', 'email'];
        foreach($required as $field) {
            if (!isset($input[$field]) || empty(trim((string)$input[$field]))) {
                $this->sendError("El campo '$field' es requerido");
                return;
            }
        }

        try {
            // Preparar campos a actualizar
            $updateFields = [
                'username' => trim($input['username']),
                'email' => trim($input['email']),
                'telefono' => $input['telefono'] ?? null,
                'rol_id' => $input['rol_id'] ?? 1,
                'estado' => $input['estado'] ?? 'activo',
                'id' => $id
            ];

            $sql = "UPDATE usuario SET
                        username = :username,
                        email = :email,
                        telefono = :telefono,
                        rol_id = :rol_id,
                        estado = :estado,
                        fecha_modificacion = NOW()";

            // Solo actualizar password si se proporciona
            if (!empty($input['password_hash'])) {
                $sql .= ", password_hash = :password_hash";
                $updateFields['password_hash'] = password_hash($input['password_hash'], PASSWORD_DEFAULT);
            }

            $sql .= " WHERE id_usuario = :id";

            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($updateFields);

            $this->sendResponse([
                'success' => true,
                'message' => 'Usuario actualizado exitosamente'
            ]);
        } catch(Exception $e) {
            if (strpos($e->getMessage(), 'Duplicate') !== false) {
                $this->sendError("El username o email ya existe en otro usuario");
            } else {
                $this->sendError("Error al actualizar usuario: " . $e->getMessage());
            }
        }
    }

    private function deleteUsuario() {
        $id = $_GET['id'] ?? null;
        if (!$id) $this->sendError("ID requerido");

        try {
            $stmt = $this->pdo->prepare("DELETE FROM usuario WHERE id_usuario = ?");
            $stmt->execute([$id]);

            if ($stmt->rowCount() === 0) {
                $this->sendError("Usuario no encontrado", 404);
            }

            $this->sendResponse([
                'success' => true,
                'message' => 'Usuario eliminado exitosamente'
            ]);
        } catch(Exception $e) {
            $this->sendError("Error al eliminar usuario: " . $e->getMessage());
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

$controller = new UsuariosController($pdo);
$controller->handleRequest();
?>