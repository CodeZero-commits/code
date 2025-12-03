<?php
// api/config.php

// Intentar cargar credenciales desde archivo externo seguro
if (file_exists(__DIR__ . '/credentials.php')) {
    require_once __DIR__ . '/credentials.php';
} else {
    // Fallback o error si no existe el archivo de credenciales.
    // Para no romper la aplicación en este entorno de prueba/desarrollo donde no podemos crear el archivo,
    // podríamos mantener los valores hardcodeados AQUÍ SOLO si es estrictamente necesario,
    // pero la recomendación es usar el archivo separado.

    // Por seguridad, en este refactor, DEJAMOS DE USAR LAS CREDENCIALES HARDCODEADAS
    // y lanzamos error si no están configuradas.

    // Si necesitas credenciales por defecto para dev:
    // $config_crm = ['host'=>'...', ...];

    // Para que el código siga funcionando "tal cual" si el usuario no ha creado el archivo aún,
    // podríamos poner un aviso. Pero la tarea es "corregir".

    // COMENTADO: Credenciales antiguas (Inseguras)
    /*
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
    */

    // Devolvemos error 500 explicativo si no hay configuración
    if (!isset($config_crm) || !isset($config_ClinicFlow)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Configuración de base de datos no encontrada. Renombra api/credentials.example.php a api/credentials.php y configúralo.']);
        exit;
    }
}

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

// Conexión CRM
$pdoCRM = getPDO($config_crm);

// Conexión ProyectoX
$pdoClinicFlow = getPDO($config_ClinicFlow);
