<?php
// cron_actualizar_estado.php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'config.php';

if(!isset($pdoClinicFlow)){
    error_log("CRON: PDO no disponible");
    exit;
}

try {
    // Marcar suscripciones como EXPIRADAS si la fecha_fin ya pasó
    $stmt = $pdoClinicFlow->prepare("
        UPDATE suscripciones 
        SET estado='expirado', actualizado_en=NOW()
        WHERE fecha_fin < CURDATE() AND estado='activo'
    ");
    $stmt->execute();
    $expiradas = $stmt->rowCount();

    // Actualizar estado de empresas basado en si tienen suscripciones activas
    $stmt = $pdoClinicFlow->prepare("
        UPDATE empresas e
        SET estado = CASE 
            WHEN EXISTS (
                SELECT 1 FROM suscripciones s 
                WHERE s.empresa_id = e.id 
                AND s.estado = 'activo' 
                AND s.fecha_fin >= CURDATE()
            ) THEN 'activo'
            ELSE 'inactivo'
        END,
        actualizado_en = NOW()
    ");
    $stmt->execute();
    $empresasActualizadas = $stmt->rowCount();

    error_log("CRON: Suscripciones expiradas: $expiradas, empresas actualizadas: $empresasActualizadas");

} catch(Exception $e){
    error_log("CRON ERROR: " . $e->getMessage());
    exit;
}