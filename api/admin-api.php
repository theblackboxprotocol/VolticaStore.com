<?php

header("Content-Type: application/json; charset=UTF-8");

$envPath = "/home/u379666423/.env";

if (!file_exists($envPath)) {
    echo json_encode([
        "success" => false,
        "step" => "env",
        "error" => "ENV file not found"
    ]);
    exit;
}

$envLines = file(
    $envPath,
    FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES
);

$adminPassword = "";

foreach ($envLines as $line) {

    $line = trim($line);

    if (
        $line === "" ||
        strpos($line, "#") === 0 ||
        strpos($line, "=") === false
    ) {
        continue;
    }

    [$key, $value] = explode("=", $line, 2);

    $key = trim($key);
    $value = trim($value);

    $value = trim($value, "\"'");

    if ($key === "ADMIN_PASSWORD") {
        $adminPassword = $value;
    }
}

if ($adminPassword === "") {
    echo json_encode([
        "success" => false,
        "step" => "password",
        "error" => "ADMIN_PASSWORD not found"
    ]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode([
        "success" => false,
        "step" => "method",
        "error" => "POST request required"
    ]);
    exit;
}

$input = file_get_contents("php://input");

$data = json_decode($input, true);

$password = $data["password"] ?? "";

if ($password === "") {
    echo json_encode([
        "success" => false,
        "step" => "input",
        "error" => "Password not received"
    ]);
    exit;
}

if (hash_equals($adminPassword, $password)) {

    echo json_encode([
        "success" => true,
        "step" => "authentication",
        "message" => "PASSWORD MATCH"
    ]);

    exit;
}

echo json_encode([
    "success" => false,
    "step" => "authentication",
    "error" => "PASSWORD DOES NOT MATCH"
]);

exit;
