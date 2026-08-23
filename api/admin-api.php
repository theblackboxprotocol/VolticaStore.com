<?php

/* =====================================================
   VOLTICA STORE
   ADMIN API
   GITHUB PRODUCT WRITER
   VERSION — STABLE / HARDENED / DIAGNOSTIC
   ===================================================== */


/* =====================================================
   ERROR HANDLING
   ===================================================== */

ini_set("display_errors", "0");
ini_set("log_errors", "1");

error_reporting(E_ALL);


/* =====================================================
   JSON RESPONSE
   ===================================================== */

header(
    "Content-Type: application/json; charset=UTF-8"
);


/* =====================================================
   CONFIGURATION
   ===================================================== */

$allowedOrigins = [

    "https://volticastore.com",

    "https://www.volticastore.com",

    "https://theblackboxprotocol.github.io"

];


$githubOwner =
    "theblackboxprotocol";


$githubRepo =
    "VolticaStore.com";


$productsPath =
    "products.js";


$imagePath =
    "assets/images";


$envPath =
    "/home/u379666423/.env";


$lockPath =
    sys_get_temp_dir()
    . "/voltica-product-manager.lock";


/*
   Maximum product block size.
*/

$maxProductBytes =
    1024 * 1024;


/*
   Maximum image size.
   15 MB per image.
*/

$maxImageBytes =
    15 * 1024 * 1024;


/*
   Maximum number of images.
*/

$maxImages =
    50;


/*
   Allowed image extensions.
*/

$allowedExtensions = [

    "jpg",
    "jpeg",
    "png",
    "webp",
    "gif"

];


/*
   Allowed MIME types.
*/

$allowedMimeTypes = [

    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif"

];


/* =====================================================
   CORS
   ===================================================== */

$origin =
    $_SERVER["HTTP_ORIGIN"] ?? "";


if (
    in_array(
        $origin,
        $allowedOrigins,
        true
    )
) {

    header(
        "Access-Control-Allow-Origin: "
        . $origin
    );

}
else {

    /*
       No wildcard here.
       We only allow the Voltica origins above.
    */

}


header(
    "Vary: Origin"
);


header(
    "Access-Control-Allow-Methods: POST, OPTIONS"
);


header(
    "Access-Control-Allow-Headers: Content-Type"
);


header(
    "Access-Control-Max-Age: 86400"
);


/* =====================================================
   HELPER — JSON RESPONSE
   ===================================================== */

function sendJson(
    array $data,
    int $status = 200
): void {

    http_response_code(
        $status
    );

    echo json_encode(

        $data,

        JSON_UNESCAPED_SLASHES |
        JSON_UNESCAPED_UNICODE

    );

    exit;

}


/* =====================================================
   HELPER — ERROR RESPONSE
   ===================================================== */

function failResponse(
    string $message,
    int $status = 500,
    array $extra = []
): void {

    sendJson(

        array_merge(

            [

                "success" => false,

                "error" =>
                    $message

            ],

            $extra

        ),

        $status

    );

}


/* =====================================================
   HELPER — GITHUB ERROR MESSAGE
   ===================================================== */

function githubErrorMessage(
    array $result,
    string $fallback
): string {

    if (
        !empty($result["response"])
    ) {

        $decoded =
            json_decode(

                $result["response"],

                true

            );


        if (
            is_array($decoded) &&
            !empty($decoded["message"])
        ) {

            return
                (string)$decoded["message"];

        }

    }


    if (
        !empty($result["error"])
    ) {

        return
            (string)$result["error"];

    }


    return $fallback;

}


/* =====================================================
   FATAL ERROR HANDLER
   ===================================================== */

register_shutdown_function(

    function () {

        $error =
            error_get_last();


        if (
            !$error
        ) {

            return;

        }


        $fatalTypes = [

            E_ERROR,
            E_PARSE,
            E_CORE_ERROR,
            E_COMPILE_ERROR

        ];


        if (
            !in_array(
                $error["type"],
                $fatalTypes,
                true
            )
        ) {

            return;

        }


        if (
            !headers_sent()
        ) {

            http_response_code(
                500
            );


            header(
                "Content-Type: application/json; charset=UTF-8"
            );


            echo json_encode(

                [

                    "success" => false,

                    "error" =>
                        "PHP fatal error",

                    "diagnostic" => [

                        "message" =>
                            $error["message"],

                        "file" =>
                            basename(
                                $error["file"]
                            ),

                        "line" =>
                            $error["line"]

                    ]

                ],

                JSON_UNESCAPED_SLASHES |
                JSON_UNESCAPED_UNICODE

            );

        }

    }

);


/* =====================================================
   PREFLIGHT
   ===================================================== */

if (
    ($_SERVER["REQUEST_METHOD"] ?? "")
    === "OPTIONS"
) {

    http_response_code(
        204
    );

    exit;

}


/* =====================================================
   POST ONLY
   ===================================================== */

if (
    ($_SERVER["REQUEST_METHOD"] ?? "")
    !== "POST"
) {

    failResponse(

        "POST request required",

        405,

        [

            "method" =>
                $_SERVER["REQUEST_METHOD"]
                ?? "UNKNOWN"

        ]

    );

}


/* =====================================================
   ORIGIN CHECK
   ===================================================== */

if (
    $origin !== "" &&
    !in_array(
        $origin,
        $allowedOrigins,
        true
    )
) {

    failResponse(

        "Origin not allowed",

        403,

        [

            "origin" =>
                $origin

        ]

    );

}


/* =====================================================
   DIAGNOSTIC STEP
   ===================================================== */

$step =
    "REQUEST RECEIVED";


/* =====================================================
   LOAD ENV
   ===================================================== */

$step =
    "LOADING ENV";


if (
    !is_file($envPath)
) {

    failResponse(

        "ENV file not found",

        500,

        [

            "step" =>
                $step,

            "env_path" =>
                $envPath

        ]

    );

}


if (
    !is_readable($envPath)
) {

    failResponse(

        "ENV file is not readable",

        500,

        [

            "step" =>
                $step

        ]

    );

}


$envLines =
    file(

        $envPath,

        FILE_IGNORE_NEW_LINES |
        FILE_SKIP_EMPTY_LINES

    );


if (
    $envLines === false
) {

    failResponse(

        "Unable to read ENV file",

        500,

        [

            "step" =>
                $step

        ]

    );

}


$env = [];


foreach (
    $envLines
    as $line
) {

    $line =
        trim($line);


    if (
        $line === ""
    ) {

        continue;

    }


    if (
        strpos(
            $line,
            "#"
        ) === 0
    ) {

        continue;

    }


    if (
        strpos(
            $line,
            "="
        ) === false
    ) {

        continue;

    }


    [$key, $value] =
        explode(
            "=",
            $line,
            2
        );


    $key =
        trim($key);


    $value =
        trim($value);


    $value =
        trim(
            $value,
            "\"'"
        );


    $env[$key] =
        $value;

}


/* =====================================================
   SECRETS
   ===================================================== */

$githubToken =
    trim(
        $env["GITHUB_TOKEN"]
        ?? ""
    );


$adminPassword =
    $env["ADMIN_PASSWORD"]
    ?? "";


if (
    $adminPassword === ""
) {

    failResponse(

        "ADMIN_PASSWORD not configured",

        500,

        [

            "step" =>
                "ENV VALIDATION"

        ]

    );

}


if (
    $githubToken === ""
) {

    failResponse(

        "GITHUB_TOKEN not configured",

        500,

        [

            "step" =>
                "ENV VALIDATION"

        ]

    );

}


/* =====================================================
   ADMIN AUTHENTICATION
   ===================================================== */

$step =
    "AUTHENTICATION";


$password =
    $_POST["password"]
    ?? "";


if (
    !is_string($password) ||
    $password === ""
) {

    failResponse(

        "Admin password required",

        401,

        [

            "step" =>
                $step

        ]

    );

}


if (
    !hash_equals(
        $adminPassword,
        $password
    )
) {

    failResponse(

        "Invalid admin password",

        401,

        [

            "step" =>
                $step

        ]

    );

}


/* =====================================================
   PRODUCT DATA
   ===================================================== */

$step =
    "PRODUCT VALIDATION";


$product =
    trim(
        $_POST["product"]
        ?? ""
    );


if (
    $product === ""
) {

    failResponse(

        "Product data missing",

        400,

        [

            "step" =>
                $step

        ]

    );

}


if (
    strlen($product)
    > $maxProductBytes
) {

    failResponse(

        "Product data is too large",

        413,

        [

            "step" =>
                $step,

            "maximum_bytes" =>
                $maxProductBytes

        ]

    );

}


/* =====================================================
   BASIC PRODUCT STRUCTURE VALIDATION
   ===================================================== */

if (
    strpos(
        $product,
        "{"
    ) === false ||
    strpos(
        $product,
        "}"
    ) === false
) {

    failResponse(

        "Invalid product block",

        400,

        [

            "step" =>
                $step

        ]

    );

}


/* =====================================================
   GITHUB REQUEST HELPER
   ===================================================== */

function githubRequest(

    string $method,

    string $url,

    string $token,

    ?array $payload = null

): array {

    if (
        !function_exists("curl_init")
    ) {

        return [

            "response" => "",

            "status" => 0,

            "error" =>
                "PHP cURL extension is not available"

        ];

    }


    $ch =
        curl_init($url);


    if (
        $ch === false
    ) {

        return [

            "response" => "",

            "status" => 0,

            "error" =>
                "Unable to initialize cURL"

        ];

    }


    $headers = [

        "Authorization: Bearer "
            . $token,

        "Accept: application/vnd.github+json",

        "X-GitHub-Api-Version: 2022-11-28",

        "User-Agent: Voltica-Store-API",

        "Content-Type: application/json"

    ];


    $options = [

        CURLOPT_RETURNTRANSFER =>
            true,

        CURLOPT_CUSTOMREQUEST =>
            strtoupper($method),

        CURLOPT_HTTPHEADER =>
            $headers,

        CURLOPT_CONNECTTIMEOUT =>
            15,

        CURLOPT_TIMEOUT =>
            120,

        CURLOPT_FOLLOWLOCATION =>
            false,

        CURLOPT_SSL_VERIFYPEER =>
            true,

        CURLOPT_SSL_VERIFYHOST =>
            2

    ];


    if (
        $payload !== null
    ) {

        $encodedPayload =
            json_encode(

                $payload,

                JSON_UNESCAPED_SLASHES |
                JSON_UNESCAPED_UNICODE

            );


        if (
            $encodedPayload === false
        ) {

            curl_close($ch);


            return [

                "response" => "",

                "status" => 0,

                "error" =>
                    "Unable to encode GitHub payload"

            ];

        }


        $options[
            CURLOPT_POSTFIELDS
        ] =
            $encodedPayload;

    }


    curl_setopt_array(
        $ch,
        $options
    );


    $response =
        curl_exec($ch);


    $status =
        curl_getinfo(

            $ch,

            CURLINFO_HTTP_CODE

        );


    $error =
        curl_error($ch);


    curl_close($ch);


    if (
        $response === false
    ) {

        $response = "";

    }


    return [

        "response" =>
            $response,

        "status" =>
            $status,

        "error" =>
            $error

    ];

}


/* =====================================================
   GITHUB BASE URL
   ===================================================== */

$repoUrl =
    "https://api.github.com/repos/"
    . rawurlencode($githubOwner)
    . "/"
    . rawurlencode($githubRepo);


/* =====================================================
   GITHUB REPOSITORY CHECK
   ===================================================== */

$step =
    "GITHUB REPOSITORY";


$repoResult =
    githubRequest(

        "GET",

        $repoUrl,

        $githubToken

    );


if (
    $repoResult["status"] !== 200
) {

    failResponse(

        "GitHub repository access failed",

        502,

        [

            "step" =>
                $step,

            "github_status" =>
                $repoResult["status"],

            "github_error" =>
                $repoResult["error"],

            "github_message" =>
                githubErrorMessage(
                    $repoResult,
                    "Unknown GitHub error"
                )

        ]

    );

}


/* =====================================================
   LOCK
   ===================================================== */

$step =
    "ACQUIRING PRODUCT LOCK";


$lockHandle =
    @fopen(
        $lockPath,
        "c"
    );


if (
    $lockHandle === false
) {

    failResponse(

        "Unable to create product manager lock",

        500,

        [

            "step" =>
                $step

        ]

    );

}


if (
    !flock(
        $lockHandle,
        LOCK_EX
    )
) {

    fclose(
        $lockHandle
    );


    failResponse(

        "Unable to lock product manager",

        500,

        [

            "step" =>
                $step

        ]

    );

}


/* =====================================================
   CLEANUP LOCK
   ===================================================== */

register_shutdown_function(

    function () use (
        $lockHandle
    ) {

        if (
            is_resource($lockHandle)
        ) {

            @flock(
                $lockHandle,
                LOCK_UN
            );


            @fclose(
                $lockHandle
            );

        }

    }

);


/* =====================================================
   GET PRODUCTS.JS
   ===================================================== */

$step =
    "READING PRODUCTS.JS";


$productsUrl =
    $repoUrl
    . "/
