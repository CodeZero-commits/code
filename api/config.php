<?php
// api/config.php

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

// Ejemplo de configuraciones
$config_crm = [
    'host' => '193.203.166.21',
    'dbname' => 'u449516874_codezeroCRM',
    'username' => 'u449516874_IsraelOlmec',
    'password' => 'IsraelOlmec123'
];

$config_ClinicFlow = [
    'host' => '193.203.166.21',
    'dbname' => 'u449516874_gestionClinica',
    'username' => 'u449516874_codex',
    'password' => 'CodexZero123'
];

// Conexión CRM
$pdoCRM = getPDO($config_crm);

// Conexión ProyectoX
$pdoClinicFlow = getPDO($config_ClinicFlow);