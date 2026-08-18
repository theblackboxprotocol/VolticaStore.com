<?php

/* =====================================================
   VOLTICA STORE API
   ADMIN AUTHENTICATION + GITHUB CONNECTION
   ===================================================== */


/* =====================================================
   CORS
   ===================================================== */

$allowedOrigins = [
    "https://theblackboxprotocol.github.io",
    "https://volticastore.com",
    "https://www.volticastore.com"
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

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {

    http_response_code(204);

    exit;

}


/* =====================================================
   ONLY POST
   ===================================================== */

if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    http_response_code(405);

    echo json_encode([
        "success" => false,
        "error" => "POST request required"
    ]);

    exit;

}


/* =====================================================
   LOAD .ENV
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


/* =====================================================
   READ .ENV
   ===================================================== */

$envLines = file(
    $envPath,
    FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES
);


$env = [];


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
        trim($value, "\"'");


    $env[$key] =
        $value;

}


/* =====================================================
   GITHUB TOKEN
   ===================================================== */

$githubToken =
    $env["GITHUB_TOKEN"] ?? "";


if (!$githubToken) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "error" => "GitHub token not found"
    ]);

    exit;

}


/* =====================================================
   ADMIN PASSWORD
   ===================================================== */

$adminPassword =
    $env["ADMIN_PASSWORD"] ?? "";


if (!$adminPassword) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "error" => "Admin password not configured"
    ]);

    exit;

}


/* =====================================================
   READ JSON
   ===================================================== */

$input =
    json_decode(
        file_get_contents("php://input"),
        true
    );


if (!is_array($input)) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "error" => "Invalid JSON request"
    ]);

    exit;

}


$password =
    $input["password"] ?? "";


/* =====================================================
   VERIFY PASSWORD
   ===================================================== */

if (
    !is_string($password) ||
    !hash_equals(
        $adminPassword,
        $password
    )
) {

    http_response_code(401);

    echo json_encode([
        "success" => false,
        "error" => "Invalid password"
    ]);

    exit;

}


/* =====================================================
   GITHUB REPOSITORY
   ===================================================== */

$githubOwner =
    "theblackboxprotocol";


$githubRepo =
    "VolticaStore.com";


$githubUrl =
    "https://api.github.com/repos/"
    . $githubOwner
    . "/"
    . $githubRepo;


/* =====================================================
   GITHUB API REQUEST
   ===================================================== */

$ch =
    curl_init($githubUrl);


curl_setopt_array(
    $ch,
    [

        CURLOPT_RETURNTRANSFER => true,

        CURLOPT_HTTPHEADER => [

            "Authorization: Bearer "
            . $githubToken,

            "Accept: application/vnd.github+json",

            "X-GitHub-Api-Version: 2022-11-28",

            "User-Agent: Voltica-Store-API"

        ],

        CURLOPT_TIMEOUT => 20

    ]
);


$githubResponse =
    curl_exec($ch);


$githubStatus =
    curl_getinfo(
        $ch,
        CURLINFO_HTTP_CODE
    );


$curlError =
    curl_error($ch);


curl_close($ch);


/* =====================================================
   CURL ERROR
   ===================================================== */

if ($githubResponse === false) {

    http_response_code(502);

    echo json_encode([
        "success" => false,
        "error" => "GitHub connection failed",
        "details" => $curlError
    ]);

    exit;

}


/* =====================================================
   GITHUB ERROR
   ===================================================== */

if ($githubStatus !== 200) {

    http_response_code(502);

    echo json_encode([
        "success" => false,
        "error" =>
            "GitHub API returned HTTP "
            . $githubStatus
    ]);

    exit;

}


/* =====================================================
   SUCCESS
   ===================================================== */

echo json_encode([

    "success" => true,

    "message" =>
        "Admin authentication successful",

    "github" =>
        "Connection successful",

    "repository" =>
        $githubOwner . "/" . $githubRepo

]);
