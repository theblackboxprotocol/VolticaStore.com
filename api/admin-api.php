<?php

/* =====================================================
   VOLTICA STORE
   ADMIN API
   CORS + AUTHENTICATION TEST
   ===================================================== */


/* =====================================================
   CORS
   ===================================================== */

$allowedOrigins = [
    "https://volticastore.com",
    "https://www.volticastore.com",
    "https://theblackboxprotocol.github.io"
];

$origin = $_SERVER["HTTP_ORIGIN"] ?? "";

if (in_array($origin, $allowedOrigins, true)) {

    header(
        "Access-Control-Allow-Origin: " . $origin
    );

}

header("Vary: Origin");

header(
    "Access-Control-Allow-Methods: POST, OPTIONS"
);

header(
    "Access-Control-Allow-Headers: Content-Type"
);

header(
    "Access-Control-Max-Age: 86400"
);

header(
    "Content-Type: application/json; charset=UTF-8"
);


/* =====================================================
   PREFLIGHT
   ===================================================== */

if (
    $_SERVER["REQUEST_METHOD"] === "OPTIONS"
) {

    http_response_code(204);

    exit;

}


/* =====================================================
   POST ONLY
   ===================================================== */

if (
    $_SERVER["REQUEST_METHOD"] !== "POST"
) {

    http_response_code(405);

    echo json_encode([
        "success" => false,
        "error" => "POST request required"
    ]);

    exit;

}


/* =====================================================
   LOAD ENV
   ===================================================== */

$envPath =
    "/home/u379666423/.env";


if (!file_exists($envPath)) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "error" => "ENV file not found"
    ]);

    exit;

}


$envLines = file(
    $envPath,
    FILE_IGNORE_NEW_LINES |
    FILE_SKIP_EMPTY_LINES
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


    [$key, $value] =
        explode("=", $line, 2);


    $key =
        trim($key);


    $value =
        trim($value);


    $value =
        trim(
            $value,
            "\"'"
        );


    if (
        $key === "ADMIN_PASSWORD"
    ) {

        $adminPassword =
            $value;

    }

}


/* =====================================================
   PASSWORD CONFIGURATION
   ===================================================== */

if ($adminPassword === "") {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "error" =>
            "ADMIN_PASSWORD not configured"
    ]);

    exit;

}


/* =====================================================
   READ JSON
   ===================================================== */

$rawInput =
    file_get_contents(
        "php://input"
    );


$data =
    json_decode(
        $rawInput,
        true
    );


$password =
    $data["password"] ?? "";


/* =====================================================
   PASSWORD REQUIRED
   ===================================================== */

if ($password === "") {

    http_response_code(401);

    echo json_encode([
        "success" => false,
        "error" =>
            "Admin password required"
    ]);

    exit;

}


/* =====================================================
   AUTHENTICATION
   ===================================================== */

if (
    !hash_equals(
        $adminPassword,
        $password
    )
) {

    http_response_code(401);

    echo json_encode([
        "success" => false,
        "error" =>
            "Invalid password"
    ]);

    exit;

}


/* =====================================================
   SUCCESS
   ===================================================== */

echo json_encode([

    "success" => true,

    "message" =>
        "Admin authentication successful"

]);

exit;

?>
