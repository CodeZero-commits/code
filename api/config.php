<?php
// api/config.php

// Intentar cargar credenciales desde archivo externo seguro
if (file_exists(__DIR__ . '/credentials.php')) {
    require_once __DIR__ . '/credentials.php';
}

// Fallback logic handled by checking existence of config variables below.

function getPDO($dbConfig) {
    try {
        $pdo = new PDO(
            "mysql:host={$dbConfig['host']};dbname={$dbConfig['dbname']};charset=utf8mb4",
            $dbConfig['username'],
            $dbConfig['password'],
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
            ]
        );
        return $pdo;
    } catch(PDOException $e) {
        error_log("Database connection error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Error de conexión']);
        exit;
    }
}

// Check configuration existence outside the file check block
if (!isset($config_crm) || !isset($config_ClinicFlow)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Configuración de base de datos no encontrada. Renombra api/credentials.example.php a api/credentials.php y configúralo.']);
    exit;
}

// Conexión CRM
$pdoCRM = getPDO($config_crm);

// Conexión ProyectoX
$pdoClinicFlow = getPDO($config_ClinicFlow);
