<?php

/* =====================================================
   VOLTICA STORE
   ADMIN API
   GITHUB PRODUCT WRITER
   VERSION — HARDENED / DIAGNOSTIC
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
   Maximum image size per file.
   15 MB.
*/

$maxImageBytes =
    15 * 1024 * 1024;


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


        /*
           If headers have not been sent,
           return a clean JSON diagnostic.
        */

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

    /*
       Deliberately generic.
       Do not reveal whether password
       or account information is correct.
    */

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
            60,

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

    $githubMessage =
        "Unknown GitHub error";


    if (
        $repoResult["response"] !== ""
    ) {

        $decoded =
            json_decode(

                $repoResult["response"],

                true

            );


        if (
            is_array($decoded) &&
            !empty($decoded["message"])
        ) {

            $githubMessage =
                $decoded["message"];

        }

    }


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
                $githubMessage

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
    . "/contents/"
    . str_replace(
        "%2F",
        "/",
        rawurlencode(
            $productsPath
        )
    );


$productsResult =
    githubRequest(

        "GET",

        $productsUrl,

        $githubToken

    );


if (
    $productsResult["status"] !== 200
) {

    $githubMessage =
        "Unable to read products.js";


    $decoded =
        json_decode(

            $productsResult["response"],

            true

        );


    if (
        is_array($decoded) &&
        !empty($decoded["message"])
    ) {

        $githubMessage =
            $decoded["message"];

    }


    failResponse(

        "Unable to read products.js",

        502,

        [

            "step" =>
                $step,

            "github_status" =>
                $productsResult["status"],

            "github_error" =>
                $productsResult["error"],

            "github_message" =>
                $githubMessage

        ]

    );

}


$productsData =
    json_decode(

        $productsResult["response"],

        true

    );


if (
    !is_array($productsData)
) {

    failResponse(

        "Invalid GitHub response for products.js",

        500,

        [

            "step" =>
                $step

        ]

    );

}


if (
    empty($productsData["content"])
) {

    failResponse(

        "products.js content missing",

        500,

        [

            "step" =>
                $step

        ]

    );

}


if (
    empty($productsData["sha"])
) {

    failResponse(

        "products.js SHA missing",

        500,

        [

            "step" =>
                $step

        ]

    );

}


/* =====================================================
   DECODE PRODUCTS.JS
   ===================================================== */

$step =
    "DECODING PRODUCTS.JS";


$encodedProducts =
    preg_replace(

        "/\s+/",

        "",

        $productsData["content"]

    );


$currentProducts =
    base64_decode(

        $encodedProducts,

        true

    );


if (
    $currentProducts === false
) {

    failResponse(

        "Unable to decode products.js",

        500,

        [

            "step" =>
                $step

        ]

    );

}


/* =====================================================
   BASIC PRODUCTS.JS VALIDATION
   ===================================================== */

if (
    strpos(
        $currentProducts,
        "const volticaProducts"
    ) === false &&
    strpos(
        $currentProducts,
        "volticaProducts"
    ) === false
) {

    failResponse(

        "products.js does not appear to contain the Voltica product database",

        500,

        [

            "step" =>
                "PRODUCTS.JS VALIDATION"

        ]

    );

}


/* =====================================================
   EXTRACT EXISTING IDS / SKUS
   ===================================================== */

$existingIds = [];

$existingSkus = [];


if (
    preg_match_all(

        '/\bid\s*:\s*"([^"]+)"/',

        $currentProducts,

        $idMatches

    )
) {

    $existingIds =
        $idMatches[1];

}


if (
    preg_match_all(

        '/\bsku\s*:\s*"([^"]+)"/',

        $currentProducts,

        $skuMatches

    )
) {

    $existingSkus =
        $skuMatches[1];

}


/* =====================================================
   EXTRACT PRODUCT NUMBERS
   ===================================================== */

$productNumbers = [];


if (
    preg_match_all(

        '/PRODUCT\s+(\d+)/i',

        $currentProducts,

        $numberMatches

    )
) {

    foreach (
        $numberMatches[1]
        as $number
    ) {

        $productNumbers[] =
            intval($number);

    }

}


$nextProductNumber =
    1;


if (
    !empty($productNumbers)
) {

    $nextProductNumber =
        max(
            $productNumbers
        ) + 1;

}


/* =====================================================
   EXTRACT PRODUCT ID
   ===================================================== */

if (
    preg_match(

        '/\bid\s*:\s*"([^"]+)"/',

        $product,

        $productIdMatch

    )
) {

    $newProductId =
        trim(
            $productIdMatch[1]
        );

}
else {

    failResponse(

        "Product ID missing",

        400,

        [

            "step" =>
                "PRODUCT VALIDATION"

        ]

    );

}


/* =====================================================
   VALIDATE PRODUCT ID
   ===================================================== */

if (
    !preg_match(
        '/^[a-z0-9][a-z0-9-]*$/',
        $newProductId
    )
) {

    failResponse(

        "Invalid Product ID format",

        400,

        [

            "step" =>
                "PRODUCT VALIDATION",

            "product_id" =>
                $newProductId

        ]

    );

}


/* =====================================================
   EXTRACT PRODUCT SKU
   ===================================================== */

if (
    preg_match(

        '/\bsku\s*:\s*"([^"]+)"/',

        $product,

        $productSkuMatch

    )
) {

    $newProductSku =
        trim(
            $productSkuMatch[1]
        );

}
else {

    failResponse(

        "Product SKU missing",

        400,

        [

            "step" =>
                "PRODUCT VALIDATION"

        ]

    );

}


/* =====================================================
   VALIDATE SKU
   ===================================================== */

if (
    strlen($newProductSku) > 200
) {

    failResponse(

        "Supplier SKU is too long",

        400,

        [

            "step" =>
                "PRODUCT VALIDATION"

        ]

    );

}


/* =====================================================
   DUPLICATE ID CHECK
   ===================================================== */

if (
    in_array(

        $newProductId,

        $existingIds,

        true

    )
) {

    failResponse(

        "Product ID already exists",

        409,

        [

            "step" =>
                "DUPLICATE CHECK",

            "id" =>
                $newProductId

        ]

    );

}


/* =====================================================
   DUPLICATE SKU CHECK
   ===================================================== */

if (
    in_array(

        $newProductSku,

        $existingSkus,

        true

    )
) {

    failResponse(

        "Supplier SKU already exists",

        409,

        [

            "step" =>
                "DUPLICATE CHECK",

            "sku" =>
                $newProductSku

        ]

    );

}


/* =====================================================
   RENAME PRODUCT HEADER
   ===================================================== */

$product =
    preg_replace(

        '/PRODUCT\s+AUTO/i',

        "PRODUCT "
        . $nextProductNumber,

        $product,

        1

    );


if (
    $product === null
) {

    failResponse(

        "Unable to rename product header",

        500,

        [

            "step" =>
                "PRODUCT GENERATION"

        ]

    );

}


/* =====================================================
   FIND PRODUCTS ARRAY CLOSING
   ===================================================== */

$step =
    "BUILDING PRODUCTS.JS";


$closingPosition =
    strrpos(

        $currentProducts,

        "];"

    );


if (
    $closingPosition === false
) {

    failResponse(

        "products.js closing array not found",

        500,

        [

            "step" =>
                $step

        ]

    );

}


/* =====================================================
   BUILD UPDATED PRODUCTS.JS
   ===================================================== */

$before =
    substr(

        $currentProducts,

        0,

        $closingPosition

    );


$after =
    substr(

        $currentProducts,

        $closingPosition

    );


$trimmedBefore =
    rtrim($before);


$separator =
    "";


if (
    substr(
        $trimmedBefore,
        -1
    ) !== ","
) {

    $separator =
        ",";

}


$updatedProducts =
    $trimmedBefore
    . $separator
    . "\n\n"
    . trim($product)
    . "\n"
    . $after;


if (
    $updatedProducts === ""
) {

    failResponse(

        "Unable to build updated products.js",

        500,

        [

            "step" =>
                $step

        ]

    );

}


/* =====================================================
   IMAGE UPLOAD PREPARATION
   ===================================================== */

$step =
    "VALIDATING PRODUCT IMAGES";


$uploadedImages = [];

$createdImagePaths = [];

$updatedImagePaths = [];


if (
    isset($_FILES["images"])
) {

    if (
        !isset(
            $_FILES["images"]["name"]
        ) ||
        !is_array(
            $_FILES["images"]["name"]
        )
    ) {

        failResponse(

            "Invalid image upload structure",

            400,

            [

                "step" =>
                    $step

            ]

        );

    }


    $imageCount =
        count(
            $_FILES["images"]["name"]
        );


    if (
        $imageCount < 1
    ) {

        failResponse(

            "At least one product image is required",

            400,

            [

                "step" =>
                    $step

            ]

        );

    }


    if (
        $imageCount > 50
    ) {

        failResponse(

            "Too many product images",

            413,

            [

                "step" =>
                    $step,

                "maximum_images" =>
                    50

            ]

        );

    }


    /*
       Validate all files BEFORE uploading
       anything to GitHub.
    */

    $validatedFiles = [];


    $finfo =
        null;


    if (
        class_exists("finfo")
    ) {

        $finfo =
            new finfo(
                FILEINFO_MIME_TYPE
            );

    }


    for (
        $i = 0;
        $i < $imageCount;
        $i++
    ) {

        $uploadError =
            $_FILES["images"]["error"][$i]
            ?? UPLOAD_ERR_NO_FILE;


        if (
            $uploadError !== UPLOAD_ERR_OK
        ) {

            failResponse(

                "Image upload error",

                400,

                [

                    "step" =>
                        $step,

                    "image" =>
                        $_FILES["images"]["name"][$i]
                        ?? "unknown",

                    "upload_error" =>
                        $uploadError

                ]

            );

        }


        $originalName =
            $_FILES["images"]["name"][$i]
            ?? "";


        $tmpFile =
            $_FILES["images"]["tmp_name"][$i]
            ?? "";


        $fileSize =
            intval(
                $_FILES["images"]["size"][$i]
                ?? 0
            );


        if (
            $originalName === "" ||
            $tmpFile === ""
        ) {

            failResponse(

                "Invalid uploaded image",

                400,

                [

                    "step" =>
                        $step

                ]

            );

        }


        if (
            !is_uploaded_file($tmpFile)
        ) {

            failResponse(

                "Invalid upload source",

                400,

                [

                    "step" =>
                        $step,

                    "image" =>
                        $originalName

                ]

            );

        }


        if (
            $fileSize <= 0
        ) {

            failResponse(

                "Image file is empty",

                400,

                [

                    "step" =>
                        $step,

                    "image" =>
                        $originalName

                ]

            );

        }


        if (
            $fileSize >
            $maxImageBytes
        ) {

            failResponse(

                "Image exceeds maximum size",

                413,

                [

                    "step" =>
                        $step,

                    "image" =>
                        $originalName,

                    "maximum_bytes" =>
                        $maxImageBytes

                ]

            );

        }


        $extension =
            strtolower(
                pathinfo(

                    $originalName,

                    PATHINFO_EXTENSION

                )
            );


        if (
            !in_array(

                $extension,

                $allowedExtensions,

                true

            )
        ) {

            failResponse(

                "Unsupported image extension",

                400,

                [

                    "step" =>
                        $step,

                    "image" =>
                        $originalName

                ]

            );

        }


        /*
           Sanitize filename.
        */

        $safeName =
            preg_replace(

                "/[^a-zA-Z0-9._-]/",

                "-",

                basename($originalName)

            );


        if (
            !is_string($safeName) ||
            $safe
