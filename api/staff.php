<?php
// api/staff.php - Versión corregida
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Headers CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Debug log
error_log("STAFF.PHP: Iniciando - Método: " . $_SERVER['REQUEST_METHOD']);

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    error_log("STAFF.PHP: OPTIONS request recibido");
    http_response_code(200);
    exit();
}

try {
    // Incluir configuración
    require_once 'config.php';
    error_log("STAFF.PHP: config.php cargado exitosamente");
    
    // CORECCIÓN CRÍTICA: Usar la variable correcta del config.php
    $pdo = null;
    
    // Intentar usar la conexión CRM primero
    if (isset($pdoCRM) && $pdoCRM !== null) {
        $pdo = $pdoCRM;
        error_log("STAFF.PHP: Usando conexión CRM");
    } 
    // Si no está disponible, intentar ClinicFlow
    elseif (isset($pdoClinicFlow) && $pdoClinicFlow !== null) {
        $pdo = $pdoClinicFlow;
        error_log("STAFF.PHP: Usando conexión ClinicFlow");
    } 
    else {
        error_log("STAFF.PHP: ERROR - Ninguna conexión PDO disponible");
        throw new Exception("No hay conexiones PDO disponibles");
    }
    
    // Verificar que tenemos una conexión válida
    if (!$pdo) {
        throw new Exception("PDO no disponible");
    }
    
    // Probar la conexión
    $pdo->query("SELECT 1");
    error_log("STAFF.PHP: Conexión PDO verificada exitosamente");
    
} catch(Exception $e) {
    error_log("STAFF.PHP: ERROR en configuración - " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error de configuración del servidor',
        'debug' => $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s'),
        'available_connections' => [
            'pdoCRM' => isset($pdoCRM) ? 'disponible' : 'no disponible',
            'pdoClinicFlow' => isset($pdoClinicFlow) ? 'disponible' : 'no disponible'
        ]
    ]);
    exit;
}

// Crear tabla staff si no existe
try {
    $createTableSQL = "
        CREATE TABLE IF NOT EXISTS staff (
            id INT AUTO_INCREMENT PRIMARY KEY,
            usuario VARCHAR(100) NOT NULL UNIQUE,
            email VARCHAR(255) NOT NULL UNIQUE,
            telefono VARCHAR(20) NOT NULL,
            password VARCHAR(255) NOT NULL,
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_usuario (usuario),
            INDEX idx_email (email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ";
    
    $pdo->exec($createTableSQL);
    error_log("STAFF.PHP: Tabla staff verificada/creada exitosamente");
    
} catch(Exception $e) {
    error_log("STAFF.PHP: Error al crear tabla staff - " . $e->getMessage());
    // Continúar, la tabla podría existir ya
}

class StaffController {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
        error_log("STAFF.PHP: StaffController inicializado");
    }

    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        error_log("STAFF.PHP: Procesando método: " . $method);

        try {
            switch($method) {
                case 'GET':
                    $this->getStaff();
                    break;
                case 'POST':
                    $this->createStaff();
                    break;
                case 'PUT':
                    $this->updateStaff();
                    break;
                case 'DELETE':
                    $this->deleteStaff();
                    break;
                default:
                    $this->sendError('Método no permitido: ' . $method, 405);
            }
        } catch(Exception $e) {
            error_log("STAFF.PHP: Exception en handleRequest - " . $e->getMessage());
            $this->sendError('Error interno: ' . $e->getMessage(), 500);
        }
    }

    private function getStaff() {
        error_log("STAFF.PHP: Ejecutando getStaff()");
        
        try {
            // Verificar si la tabla existe
            $stmt = $this->pdo->query("SHOW TABLES LIKE 'staff'");
            if ($stmt->rowCount() === 0) {
                error_log("STAFF.PHP: Tabla staff no existe, devolviendo array vacío");
                $this->sendResponse([
                    'success' => true,
                    'staff' => [],
                    'message' => 'Tabla staff no existe, se creará automáticamente al agregar el primer registro'
                ]);
                return;
            }
            
            $stmt = $this->pdo->query("
                SELECT id, usuario, email, telefono, 
                       DATE_FORMAT(fecha_creacion, '%Y-%m-%d') as fecha_creacion,
                       fecha_creacion as fecha_creacion_timestamp
                FROM staff 
                ORDER BY fecha_creacion DESC
            ");
            
            $staff = $stmt->fetchAll(PDO::FETCH_ASSOC);
            error_log("STAFF.PHP: Staff obtenido - total: " . count($staff));
            
            $response = [
                'success' => true,
                'staff' => $staff,
                'total' => count($staff),
                'debug' => [
                    'method' => $_SERVER['REQUEST_METHOD'],
                    'timestamp' => date('Y-m-d H:i:s'),
                    'table_exists' => true
                ]
            ];
            
            $this->sendResponse($response);
            
        } catch(Exception $e) {
            error_log("STAFF.PHP: Error en getStaff - " . $e->getMessage());
            $this->sendError('Error al obtener staff: ' . $e->getMessage(), 500);
        }
    }
    
    private function createStaff() {
        $input = json_decode(file_get_contents('php://input'), true);
        error_log("STAFF.PHP: Creando staff - datos recibidos: " . json_encode($input));
        
        try {
            if (json_last_error() !== JSON_ERROR_NONE) {
                $this->sendError('JSON inválido: ' . json_last_error_msg(), 400);
                return;
            }
            
            // Validar datos requeridos
            $required = ['usuario', 'email', 'telefono', 'password'];
            foreach($required as $field) {
                if (!isset($input[$field]) || empty(trim($input[$field]))) {
                    error_log("STAFF.PHP: Campo requerido faltante: " . $field);
                    $this->sendError("El campo '$field' es requerido", 400);
                    return;
                }
            }
            
            // Validar email
            if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
                $this->sendError('Email inválido', 400);
                return;
            }
            
            // Validar longitud de contraseña
            if (strlen($input['password']) < 6) {
                $this->sendError('La contraseña debe tener al menos 6 caracteres', 400);
                return;
            }
            
            // Verificar si el usuario o email ya existe
            $stmt = $this->pdo->prepare("SELECT id FROM staff WHERE usuario = ? OR email = ?");
            $stmt->execute([$input['usuario'], $input['email']]);
            
            if ($stmt->fetch()) {
                $this->sendError('Usuario o email ya existe', 409);
                return;
            }
            
            // Insertar nuevo staff
            $stmt = $this->pdo->prepare("
                INSERT INTO staff (usuario, email, telefono, password, fecha_creacion) 
                VALUES (?, ?, ?, ?, NOW())
            ");
            
            $hashedPassword = password_hash($input['password'], PASSWORD_DEFAULT);
            
            $result = $stmt->execute([
                trim($input['usuario']),
                trim($input['email']),
                trim($input['telefono']),
                $hashedPassword
            ]);
            
            if ($result) {
                $newId = $this->pdo->lastInsertId();
                error_log("STAFF.PHP: Staff creado exitosamente con ID: " . $newId);
                
                // Obtener el registro recién creado
                $getStmt = $this->pdo->prepare("SELECT id, usuario, email, telefono, DATE_FORMAT(fecha_creacion, '%Y-%m-%d') as fecha_creacion FROM staff WHERE id = ?");
                $getStmt->execute([$newId]);
                $newStaff = $getStmt->fetch(PDO::FETCH_ASSOC);
                
                $this->sendResponse([
                    'success' => true,
                    'message' => 'Staff creado exitosamente',
                    'id' => (int)$newId,
                    'staff' => $newStaff
                ]);
            } else {
                $this->sendError('Error al crear staff', 500);
            }
            
        } catch(Exception $e) {
            error_log("STAFF.PHP: Exception en createStaff - " . $e->getMessage());
            $this->sendError('Error al crear staff: ' . $e->getMessage(), 500);
        }
    }
    
    private function updateStaff() {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $_GET['id'] ?? null;
        
        error_log("STAFF.PHP: Actualizando staff ID: " . $id);
        
        try {
            if (!$id || !is_numeric($id)) {
                $this->sendError('ID válido requerido', 400);
                return;
            }
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                $this->sendError('JSON inválido: ' . json_last_error_msg(), 400);
                return;
            }
            
            // Verificar que el staff existe
            $checkStmt = $this->pdo->prepare("SELECT id FROM staff WHERE id = ?");
            $checkStmt->execute([$id]);
            if (!$checkStmt->fetch()) {
                $this->sendError('Staff no encontrado', 404);
                return;
            }
            
            // Validar datos requeridos
            $required = ['usuario', 'email', 'telefono'];
            foreach($required as $field) {
                if (!isset($input[$field]) || empty(trim($input[$field]))) {
                    $this->sendError("El campo '$field' es requerido", 400);
                    return;
                }
            }
            
            // Validar email
            if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
                $this->sendError('Email inválido', 400);
                return;
            }
            
            // Verificar duplicados (excluyendo el actual)
            $stmt = $this->pdo->prepare("SELECT id FROM staff WHERE (usuario = ? OR email = ?) AND id != ?");
            $stmt->execute([$input['usuario'], $input['email'], $id]);
            
            if ($stmt->fetch()) {
                $this->sendError('Usuario o email ya existe', 409);
                return;
            }
            
            // Preparar campos de actualización
            $updateFields = ['usuario = ?', 'email = ?', 'telefono = ?', 'actualizado_en = NOW()'];
            $updateValues = [trim($input['usuario']), trim($input['email']), trim($input['telefono'])];
            
            // Manejar password si se proporciona
            if (!empty($input['password'])) {
                if (strlen($input['password']) < 6) {
                    $this->sendError('La contraseña debe tener al menos 6 caracteres', 400);
                    return;
                }
                $updateFields[] = 'password = ?';
                $updateValues[] = password_hash($input['password'], PASSWORD_DEFAULT);
            }
            
            $updateValues[] = $id; // Para el WHERE
            
            // Ejecutar actualización
            $sql = "UPDATE staff SET " . implode(', ', $updateFields) . " WHERE id = ?";
            $stmt = $this->pdo->prepare($sql);
            $result = $stmt->execute($updateValues);
            
            if ($stmt->rowCount() === 0) {
                error_log("STAFF.PHP: No se actualizó ningún registro");
            }
            
            // Obtener el registro actualizado
            $getStmt = $this->pdo->prepare("SELECT id, usuario, email, telefono, DATE_FORMAT(fecha_creacion, '%Y-%m-%d') as fecha_creacion FROM staff WHERE id = ?");
            $getStmt->execute([$id]);
            $updatedStaff = $getStmt->fetch(PDO::FETCH_ASSOC);
            
            error_log("STAFF.PHP: Staff actualizado exitosamente ID: " . $id);
            $this->sendResponse([
                'success' => true,
                'message' => 'Staff actualizado exitosamente',
                'staff' => $updatedStaff
            ]);
            
        } catch(Exception $e) {
            error_log("STAFF.PHP: Exception en updateStaff - " . $e->getMessage());
            $this->sendError('Error al actualizar staff: ' . $e->getMessage(), 500);
        }
    }
    
    private function deleteStaff() {
        $id = $_GET['id'] ?? null;
        error_log("STAFF.PHP: Eliminando staff ID: " . $id);
        
        try {
            if (!$id || !is_numeric($id)) {
                $this->sendError('ID válido requerido', 400);
                return;
            }
            
            // Verificar que el staff existe
            $checkStmt = $this->pdo->prepare("SELECT usuario FROM staff WHERE id = ?");
            $checkStmt->execute([$id]);
            $staff = $checkStmt->fetch();
            
            if (!$staff) {
                $this->sendError('Staff no encontrado', 404);
                return;
            }
            
            // Eliminar el staff
            $stmt = $this->pdo->prepare("DELETE FROM staff WHERE id = ?");
            $result = $stmt->execute([$id]);
            
            if ($stmt->rowCount() === 0) {
                $this->sendError('No se pudo eliminar el staff', 500);
                return;
            }
            
            error_log("STAFF.PHP: Staff eliminado exitosamente ID: " . $id);
            $this->sendResponse([
                'success' => true,
                'message' => "Staff '{$staff['usuario']}' eliminado exitosamente"
            ]);
            
        } catch(Exception $e) {
            error_log("STAFF.PHP: Exception en deleteStaff - " . $e->getMessage());
            $this->sendError('Error al eliminar staff: ' . $e->getMessage(), 500);
        }
    }
    
    private function sendResponse($data, $statusCode = 200) {
        http_response_code($statusCode);
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }
    
    private function sendError($message, $statusCode = 400) {
        error_log("STAFF.PHP: Enviando error - " . $message . " (Código: " . $statusCode . ")");
        $this->sendResponse([
            'success' => false,
            'error' => $message,
            'timestamp' => date('Y-m-d H:i:s')
        ], $statusCode);
    }
}

// Ejecutar controlador
try {
    error_log("STAFF.PHP: Iniciando controlador con PDO");
    $controller = new StaffController($pdo);
    $controller->handleRequest();
} catch(Exception $e) {
    error_log("STAFF.PHP: Error crítico al inicializar controlador - " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error crítico del servidor',
        'debug' => $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}
?>