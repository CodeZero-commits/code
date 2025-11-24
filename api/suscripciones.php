<?php
// api/suscripciones.php
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
    echo json_encode(['success'=>false,'error'=>'Error de configuración','debug'=>$e->getMessage()]);
    exit;
}

class SuscripcionesController {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        try {
            switch($method) {
                case 'GET': $this->getSuscripciones(); break;
                case 'POST': $this->createSuscripcion(); break;
                case 'PUT': $this->updateSuscripcion(); break;
                case 'DELETE': $this->deleteSuscripcion(); break;
                default: $this->sendError("Método no permitido: $method", 405);
            }
        } catch(Exception $e) {
            $this->sendError("Error interno: ".$e->getMessage(), 500);
        }
    }

    private function updateEstados() {
        // Actualiza estados según fechas
        $today = new DateTime();
        $stmt = $this->pdo->query("SELECT id, fecha_inicio, fecha_fin, estado FROM suscripciones");
        $subs = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach($subs as $sub) {
            if($sub['estado'] === 'cancelado') continue;

            $fecha_inicio = new DateTime($sub['fecha_inicio']);
            $fecha_fin = new DateTime($sub['fecha_fin']);
            $nuevo_estado = 'activo';

            if($today < $fecha_inicio) {
                $nuevo_estado = 'activo'; // futuro
            } elseif($today > $fecha_fin) {
                $nuevo_estado = 'vencido';
            } else {
                $nuevo_estado = 'activo';
            }

            if($nuevo_estado !== $sub['estado']) {
                $update = $this->pdo->prepare("UPDATE suscripciones SET estado = :estado, actualizado_en = NOW() WHERE id = :id");
                $update->execute([
                    'estado' => $nuevo_estado,
                    'id' => $sub['id']
                ]);
            }
        }
    }

    private function getSuscripciones() {
        $this->updateEstados(); // 🔹 Actualizamos estados antes de listar

        $stmt = $this->pdo->query("
            SELECT s.*, p.nombre AS plan_nombre, e.nombre_empresa AS empresa_nombre
            FROM suscripciones s
            JOIN planes p ON p.id = s.plan_id
            JOIN empresas e ON e.id = s.empresa_id
            ORDER BY s.fecha_inicio DESC
        ");
        $subs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $this->sendResponse(['success'=>true, 'suscripciones'=>$subs]);
    }

    private function createSuscripcion() {
        $input = json_decode(file_get_contents('php://input'), true);
        $required = ['empresa_id','plan_id','fecha_inicio','fecha_fin'];
        foreach($required as $f) {
            if(!isset($input[$f]) || empty($input[$f])) $this->sendError("El campo '$f' es requerido");
        }

        $fecha_inicio = new DateTime($input['fecha_inicio']);
        $fecha_fin = new DateTime($input['fecha_fin']);
        $today = new DateTime();
        $estado = 'activo';
        if($fecha_fin < $today) $estado = 'vencido';

        $stmt = $this->pdo->prepare("
            INSERT INTO suscripciones (empresa_id, plan_id, fecha_inicio, fecha_fin, estado, creado_en)
            VALUES (:empresa_id, :plan_id, :fecha_inicio, :fecha_fin, :estado, NOW())
        ");
        $stmt->execute([
            'empresa_id' => $input['empresa_id'],
            'plan_id' => $input['plan_id'],
            'fecha_inicio' => $input['fecha_inicio'],
            'fecha_fin' => $input['fecha_fin'],
            'estado' => $estado
        ]);

        $this->sendResponse(['success'=>true,'message'=>'Suscripción creada','id'=>$this->pdo->lastInsertId()]);
    }

    private function updateSuscripcion() {
        $id = $_GET['id'] ?? null;
        if(!$id) $this->sendError("ID requerido");

        $input = json_decode(file_get_contents('php://input'), true);
        $required = ['empresa_id','plan_id','fecha_inicio','fecha_fin'];
        foreach($required as $f) {
            if(!isset($input[$f]) || empty($input[$f])) $this->sendError("El campo '$f' es requerido");
        }

        $fecha_inicio = new DateTime($input['fecha_inicio']);
        $fecha_fin = new DateTime($input['fecha_fin']);
        $today = new DateTime();

        $estado = $input['estado'] ?? 'activo';
        if($estado !== 'cancelado') {
            if($fecha_fin < $today) $estado = 'vencido';
            elseif($today >= $fecha_inicio && $today <= $fecha_fin) $estado = 'activo';
        }

        $stmt = $this->pdo->prepare("
            UPDATE suscripciones SET
                empresa_id = :empresa_id,
                plan_id = :plan_id,
                fecha_inicio = :fecha_inicio,
                fecha_fin = :fecha_fin,
                estado = :estado,
                actualizado_en = NOW()
            WHERE id = :id
        ");
        $stmt->execute([
            'empresa_id'=>$input['empresa_id'],
            'plan_id'=>$input['plan_id'],
            'fecha_inicio'=>$input['fecha_inicio'],
            'fecha_fin'=>$input['fecha_fin'],
            'estado'=>$estado,
            'id'=>$id
        ]);

        $this->sendResponse(['success'=>true,'message'=>'Suscripción actualizada']);
    }

    private function deleteSuscripcion() {
        $id = $_GET['id'] ?? null;
        if(!$id) $this->sendError("ID requerido");

        $stmt = $this->pdo->prepare("DELETE FROM suscripciones WHERE id = ?");
        $stmt->execute([$id]);

        $this->sendResponse(['success'=>true,'message'=>'Suscripción eliminada']);
    }

    private function sendResponse($data, $status=200) {
        http_response_code($status);
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    private function sendError($msg, $status=400) {
        $this->sendResponse(['success'=>false,'error'=>$msg], $status);
    }
}

$controller = new SuscripcionesController($pdo);
$controller->handleRequest();
?>
