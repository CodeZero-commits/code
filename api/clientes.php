<?php
// api/clientes.php
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

class ClientesController {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    // Función para generar URL slug
    private function generateSlug($text) {
        if (empty($text)) return '';
        
        // Convertir a minúsculas y quitar espacios al inicio/final
        $slug = strtolower(trim($text));
        
        // Reemplazar caracteres especiales y acentos
        $slug = iconv('UTF-8', 'ASCII//TRANSLIT', $slug);
        
        // Reemplazar espacios y caracteres especiales con guiones
        $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug);
        $slug = preg_replace('/\s+/', '-', $slug);
        
        // Eliminar guiones múltiples
        $slug = preg_replace('/-+/', '-', $slug);
        
        // Eliminar guiones al inicio y final
        $slug = trim($slug, '-');
        
        return $slug;
    }

    // Verificar si el slug ya existe
    private function isSlugUnique($slug, $excludeId = null) {
        $sql = "SELECT id FROM empresas WHERE url_slug = ?";
        $params = [$slug];
        
        if ($excludeId) {
            $sql .= " AND id != ?";
            $params[] = $excludeId;
        }
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return !$stmt->fetch();
    }

    // Generar slug único
    private function generateUniqueSlug($text, $excludeId = null) {
        $baseSlug = $this->generateSlug($text);
        if (empty($baseSlug)) return '';
        
        $slug = $baseSlug;
        $counter = 1;
        
        while (!$this->isSlugUnique($slug, $excludeId)) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }
        
        return $slug;
    }

    // Crear especialidades individuales en tabla especialidad
    private function createEspecialidades($empresaId, $especialidadesJson) {
        if (empty($especialidadesJson)) return [];
        
        try {
            $especialidades = json_decode($especialidadesJson, true);
            if (!is_array($especialidades)) return [];
            
            $createdIds = [];
            
            foreach ($especialidades as $esp) {
                if (empty($esp['nombre'])) continue;
                
                // Verificar si ya existe esta especialidad para esta empresa
                $stmt = $this->pdo->prepare("
                    SELECT id_especialidad FROM especialidad 
                    WHERE nombre = ? AND empresa_id = ?
                ");
                $stmt->execute([trim($esp['nombre']), $empresaId]);
                
                if ($stmt->fetch()) {
                    continue; // Ya existe, saltar
                }
                
                // Crear nueva especialidad
                $stmt = $this->pdo->prepare("
                    INSERT INTO especialidad (
                        nombre, descripcion, categoria, estado, 
                        fecha_creacion, empresa_id
                    ) VALUES (?, ?, ?, 'Activo', NOW(), ?)
                ");
                
                $stmt->execute([
                    trim($esp['nombre']),
                    trim($esp['descripcion'] ?? ''),
                    trim($esp['categoria'] ?? 'General'),
                    $empresaId
                ]);
                
                $createdIds[] = $this->pdo->lastInsertId();
            }
            
            return $createdIds;
            
        } catch (Exception $e) {
            error_log("Error creando especialidades: " . $e->getMessage());
            return [];
        }
    }

    // Actualizar especialidades (eliminar existentes y crear nuevas)
    private function updateEspecialidades($empresaId, $especialidadesJson) {
        try {
            // Eliminar especialidades existentes de esta empresa
            $stmt = $this->pdo->prepare("DELETE FROM especialidad WHERE empresa_id = ?");
            $stmt->execute([$empresaId]);
            
            // Crear las nuevas
            return $this->createEspecialidades($empresaId, $especialidadesJson);
            
        } catch (Exception $e) {
            error_log("Error actualizando especialidades: " . $e->getMessage());
            return [];
        }
    }

    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        try {
            switch($method) {
                case 'GET': $this->getClientes(); break;
                case 'POST': $this->createCliente(); break;
                case 'PUT': $this->updateCliente(); break;
                case 'DELETE': $this->deleteCliente(); break;
                default: $this->sendError("Método no permitido: $method", 405);
            }
        } catch(Exception $e) {
            $this->sendError("Error interno: " . $e->getMessage(), 500);
        }
    }

    private function getClientes() {
        try {
            $stmt = $this->pdo->query("
                SELECT 
                    e.id, e.nombre_completo, e.nombre_empresa, e.email, e.telefono, e.direccion, 
                    e.rfc, e.razon_social, e.codigo_postal, e.giro, e.notas, e.url_slug, 
                    e.creado_en, e.actualizado_en, e.especialidades_json,
                    COUNT(esp.id_especialidad) as total_especialidades
                FROM empresas e
                LEFT JOIN especialidad esp ON e.id = esp.empresa_id
                GROUP BY e.id
                ORDER BY e.creado_en DESC
            ");
            $clientes = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $this->sendResponse([
                'success' => true,
                'clientes' => $clientes,
                'debug' => [
                    'total_records' => count($clientes),
                    'timestamp' => date('Y-m-d H:i:s')
                ]
            ]);
        } catch(Exception $e) {
            $this->sendError("Error al obtener clientes: " . $e->getMessage(), 500);
        }
    }

    private function createCliente() {
        $input = json_decode(file_get_contents('php://input'), true);

        $required = ['nombre_completo', 'email', 'telefono'];
        foreach($required as $field) {
            if (!isset($input[$field]) || empty(trim($input[$field]))) {
                $this->sendError("El campo '$field' es requerido");
                return;
            }
        }

        if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
            $this->sendError("Email inválido");
            return;
        }

        // Verificar email único
        $stmt = $this->pdo->prepare("SELECT id FROM empresas WHERE email = ?");
        $stmt->execute([trim($input['email'])]);
        if ($stmt->fetch()) {
            $this->sendError("Email ya registrado");
            return;
        }

        // Generar slug único
        $urlSlug = '';
        if (!empty($input['url_slug'])) {
            // Si viene un slug personalizado, usarlo (pero verificar que sea único)
            $urlSlug = $this->generateUniqueSlug($input['url_slug']);
        } elseif (!empty($input['nombre_empresa'])) {
            // Si no hay slug pero sí nombre de empresa, generarlo automáticamente
            $urlSlug = $this->generateUniqueSlug($input['nombre_empresa']);
        }

        try {
            // Iniciar transacción
            $this->pdo->beginTransaction();

            $stmt = $this->pdo->prepare("
                INSERT INTO empresas (
                    nombre_completo, nombre_empresa, email, telefono, direccion, 
                    rfc, razon_social, codigo_postal, giro, notas, url_slug, 
                    especialidades_json, creado_en
                ) VALUES (
                    :nombre_completo, :nombre_empresa, :email, :telefono, :direccion, 
                    :rfc, :razon_social, :codigo_postal, :giro, :notas, :url_slug, 
                    :especialidades_json, NOW()
                )
            ");

            $especialidadesJson = $input['especialidades_json'] ?? null;

            $stmt->execute([
                'nombre_completo' => trim($input['nombre_completo']),
                'nombre_empresa' => trim($input['nombre_empresa'] ?? ''),
                'email' => trim($input['email']),
                'telefono' => trim($input['telefono']),
                'direccion' => trim($input['direccion'] ?? ''),
                'rfc' => trim($input['rfc'] ?? ''),
                'razon_social' => trim($input['razon_social'] ?? ''),
                'codigo_postal' => trim($input['codigo_postal'] ?? ''),
                'giro' => trim($input['giro'] ?? ''),
                'notas' => trim($input['notas'] ?? ''),
                'url_slug' => $urlSlug,
                'especialidades_json' => $especialidadesJson
            ]);

            $empresaId = $this->pdo->lastInsertId();

            // Crear especialidades individuales si las hay
            $especialidadesIds = [];
            if ($especialidadesJson) {
                $especialidadesIds = $this->createEspecialidades($empresaId, $especialidadesJson);
            }

            $this->pdo->commit();

            $this->sendResponse([
                'success' => true,
                'message' => 'Cliente creado exitosamente',
                'id' => $empresaId,
                'url_slug' => $urlSlug,
                'especialidades_creadas' => count($especialidadesIds)
            ]);

        } catch (Exception $e) {
            $this->pdo->rollBack();
            $this->sendError("Error al crear cliente: " . $e->getMessage(), 500);
        }
    }

    private function updateCliente() {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $_GET['id'] ?? null;

        if (!$id) {
            $this->sendError("ID requerido");
            return;
        }

        $required = ['nombre_completo', 'email', 'telefono'];
        foreach($required as $field) {
            if (!isset($input[$field]) || empty(trim($input[$field]))) {
                $this->sendError("El campo '$field' es requerido");
                return;
            }
        }

        if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
            $this->sendError("Email inválido");
            return;
        }

        // Verificar email único
        $stmt = $this->pdo->prepare("SELECT id FROM empresas WHERE email = ? AND id != ?");
        $stmt->execute([trim($input['email']), $id]);
        if ($stmt->fetch()) {
            $this->sendError("Email ya registrado por otro cliente");
            return;
        }

        // Generar slug único
        $urlSlug = '';
        if (!empty($input['url_slug'])) {
            // Si viene un slug personalizado, usarlo (pero verificar que sea único)
            $urlSlug = $this->generateUniqueSlug($input['url_slug'], $id);
        } elseif (!empty($input['nombre_empresa'])) {
            // Si no hay slug pero sí nombre de empresa, generarlo automáticamente
            $urlSlug = $this->generateUniqueSlug($input['nombre_empresa'], $id);
        }

        try {
            // Iniciar transacción
            $this->pdo->beginTransaction();

            $stmt = $this->pdo->prepare("
                UPDATE empresas SET
                    nombre_completo = :nombre_completo,
                    nombre_empresa = :nombre_empresa,
                    email = :email,
                    telefono = :telefono,
                    direccion = :direccion,
                    rfc = :rfc,
                    razon_social = :razon_social,
                    codigo_postal = :codigo_postal,
                    giro = :giro,
                    notas = :notas,
                    url_slug = :url_slug,
                    especialidades_json = :especialidades_json,
                    actualizado_en = NOW()
                WHERE id = :id
            ");

            $especialidadesJson = $input['especialidades_json'] ?? null;

            $stmt->execute([
                'nombre_completo' => trim($input['nombre_completo']),
                'nombre_empresa' => trim($input['nombre_empresa'] ?? ''),
                'email' => trim($input['email']),
                'telefono' => trim($input['telefono']),
                'direccion' => trim($input['direccion'] ?? ''),
                'rfc' => trim($input['rfc'] ?? ''),
                'razon_social' => trim($input['razon_social'] ?? ''),
                'codigo_postal' => trim($input['codigo_postal'] ?? ''),
                'giro' => trim($input['giro'] ?? ''),
                'notas' => trim($input['notas'] ?? ''),
                'url_slug' => $urlSlug,
                'especialidades_json' => $especialidadesJson,
                'id' => $id
            ]);

            // Actualizar especialidades individuales
            $especialidadesIds = [];
            if ($especialidadesJson) {
                $especialidadesIds = $this->updateEspecialidades($id, $especialidadesJson);
            } else {
                // Si no hay especialidades, eliminar las existentes
                $stmt = $this->pdo->prepare("DELETE FROM especialidad WHERE empresa_id = ?");
                $stmt->execute([$id]);
            }

            $this->pdo->commit();

            $this->sendResponse([
                'success' => true,
                'message' => 'Cliente actualizado exitosamente',
                'url_slug' => $urlSlug,
                'especialidades_actualizadas' => count($especialidadesIds)
            ]);

        } catch (Exception $e) {
            $this->pdo->rollBack();
            $this->sendError("Error al actualizar cliente: " . $e->getMessage(), 500);
        }
    }

    private function deleteCliente() {
        $id = $_GET['id'] ?? null;
        if (!$id) $this->sendError("ID requerido");

        try {
            // Iniciar transacción
            $this->pdo->beginTransaction();

            // Eliminar especialidades relacionadas
            $stmt = $this->pdo->prepare("DELETE FROM especialidad WHERE empresa_id = ?");
            $stmt->execute([$id]);

            // Eliminar empresa
            $stmt = $this->pdo->prepare("DELETE FROM empresas WHERE id = ?");
            $stmt->execute([$id]);

            if ($stmt->rowCount() === 0) {
                $this->pdo->rollBack();
                $this->sendError("Cliente no encontrado", 404);
                return;
            }

            $this->pdo->commit();

            $this->sendResponse([
                'success' => true,
                'message' => 'Cliente y sus especialidades eliminados exitosamente'
            ]);

        } catch (Exception $e) {
            $this->pdo->rollBack();
            $this->sendError("Error al eliminar cliente: " . $e->getMessage(), 500);
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

$controller = new ClientesController($pdo);
$controller->handleRequest();
?>