<?php

/* =====================================================
   VOLTICA STORE
   ADMIN API
   GITHUB PRODUCT WRITER
   VERSION — STABLE / ROBUST ARRAY PARSER
   ===================================================== */

ini_set("display_errors", "0");
ini_set("log_errors", "1");

error_reporting(E_ALL);

header("Content-Type: application/json; charset=UTF-8");


/* =====================================================
   CONFIGURATION
   ===================================================== */

$allowedOrigins = [

    "https://volticastore.com",
    "https://www.volticastore.com",
    "https://theblackboxprotocol.github.io"

];

$githubOwner = "theblackboxprotocol";

$githubRepo = "VolticaStore.com";

$productsPath = "products.js";

$imagePath = "assets/images";

$envPath = "/home/u379666423/.env";

$lockPath =
    sys_get_temp_dir()
    . "/voltica-product-manager.lock";

$maxProductBytes = 1024 * 1024;

$maxImageBytes = 15 * 1024 * 1024;

$allowedExtensions = [

    "jpg",
    "jpeg",
    "png",
    "webp",
    "gif"

];

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


/* =====================================================
   JSON RESPONSE
   ===================================================== */

function sendJson(
    array $data,
    int $status = 200
): void {

    http_response_code($status);

    echo json_encode(

        $data,

        JSON_UNESCAPED_SLASHES |
        JSON_UNESCAPED_UNICODE

    );

    exit;

}


/* =====================================================
   ERROR RESPONSE
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
                "error" => $message
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

        if (!$error) {
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

        if (!headers_sent()) {

            http_response_code(500);

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

    http_response_code(204);

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


$step = "REQUEST RECEIVED";


/* =====================================================
   LOAD ENV
   ===================================================== */

$step = "LOADING ENV";

if (!is_file($envPath)) {

    failResponse(

        "ENV file not found",

        500,

        [

            "step" => $step,
            "env_path" => $envPath

        ]

    );

}

if (!is_readable($envPath)) {

    failResponse(

        "ENV file is not readable",

        500,

        [

            "step" => $step

        ]

    );

}

$envLines =
    file(

        $envPath,

        FILE_IGNORE_NEW_LINES |
        FILE_SKIP_EMPTY_LINES

    );

if ($envLines === false) {

    failResponse(

        "Unable to read ENV file",

        500,

        [

            "step" => $step

        ]

    );

}

$env = [];

foreach ($envLines as $line) {

    $line =
        trim($line);

    if ($line === "") {
        continue;
    }

    if (
        strpos($line, "#") === 0
    ) {
        continue;
    }

    if (
        strpos($line, "=") === false
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

if ($adminPassword === "") {

    failResponse(

        "ADMIN_PASSWORD not configured",

        500,

        [

            "step" =>
                "ENV VALIDATION"

        ]

    );

}

if ($githubToken === "") {

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

$step = "AUTHENTICATION";

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

            "step" => $step

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

            "step" => $step

        ]

    );

}


/* =====================================================
   PRODUCT DATA
   ===================================================== */

$step = "PRODUCT VALIDATION";

$product =
    trim(
        $_POST["product"]
        ?? ""
    );

if ($product === "") {

    failResponse(

        "Product data missing",

        400,

        [

            "step" => $step

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

            "step" => $step,
            "maximum_bytes" => $maxProductBytes

        ]

    );

}

if (
    strpos($product, "{") === false ||
    strpos($product, "}") === false
) {

    failResponse(

        "Invalid product block",

        400,

        [

            "step" => $step

        ]

    );

}


/* =====================================================
   GITHUB REQUEST
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

    if ($ch === false) {

        return [

            "response" => "",
            "status" => 0,
            "error" =>
                "Unable to initialize cURL"

        ];

    }

    $headers = [

        "Authorization: Bearer " . $token,

        "Accept: application/vnd.github+json",

        "X-GitHub-Api-Version: 2022-11-28",

        "User-Agent: Voltica-Store-API",

        "Content-Type: application/json"

    ];

    $options = [

        CURLOPT_RETURNTRANSFER => true,

        CURLOPT_CUSTOMREQUEST =>
            strtoupper($method),

        CURLOPT_HTTPHEADER => $headers,

        CURLOPT_CONNECTTIMEOUT => 15,

        CURLOPT_TIMEOUT => 60,

        CURLOPT_FOLLOWLOCATION => false,

        CURLOPT_SSL_VERIFYPEER => true,

        CURLOPT_SSL_VERIFYHOST => 2

    ];

    if ($payload !== null) {

        $encodedPayload =
            json_encode(

                $payload,

                JSON_UNESCAPED_SLASHES |
                JSON_UNESCAPED_UNICODE

            );

        if ($encodedPayload === false) {

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

    if ($response === false) {
        $response = "";
    }

    return [

        "response" => $response,
        "status" => $status,
        "error" => $error

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
   CHECK REPOSITORY
   ===================================================== */

$step = "GITHUB REPOSITORY";

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

    failResponse(

        "GitHub repository access failed",

        502,

        [

            "step" => $step,

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

if ($lockHandle === false) {

    failResponse(

        "Unable to create product manager lock",

        500,

        [

            "step" => $step

        ]

    );

}

if (
    !flock(
        $lockHandle,
        LOCK_EX
    )
) {

    fclose($lockHandle);

    failResponse(

        "Unable to lock product manager",

        500,

        [

            "step" => $step

        ]

    );

}

register_shutdown_function(

    function () use ($lockHandle) {

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
   READ PRODUCTS.JS
   ===================================================== */

$step =
    "READING PRODUCTS.JS";

$productsUrl =
    $repoUrl
    . "/contents/"
    . str_replace(
        "%2F",
        "/",
        rawurlencode($productsPath)
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

            "step" => $step,

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

            "step" => $step

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

            "step" => $step

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

            "step" => $step

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

if ($currentProducts === false) {

    failResponse(

        "Unable to decode products.js",

        500,

        [

            "step" => $step

        ]

    );

}


/* =====================================================
   FIND VOLTICA PRODUCTS ARRAY
   ===================================================== */

$step =
    "FINDING VOLTICA PRODUCTS ARRAY";


/*
   We deliberately DO NOT use:

       strrpos($currentProducts, "];")

   because products.js can contain multiple arrays.

   Instead we locate:

       volticaProducts = [

   and then scan character-by-character until
   the matching ] is found.

   Strings and comments are ignored.
*/

function findVolticaProductsArrayEnd(
    string $source
): array {

    $pattern =
        '/(?:const|let|var)\s+volticaProducts\s*=\s*\[/i';

    if (
        !preg_match(
            $pattern,
            $source,
            $match,
            PREG_OFFSET_CAPTURE
        )
    ) {

        return [

            "success" => false,

            "error" =>
                "Unable to find volticaProducts array declaration"

        ];

    }

    $matchText =
        $match[0][0];

    $matchStart =
        $match[0][1];

    $openingBracket =
        strpos(
            $matchText,
            "["
        );

    if (
        $openingBracket === false
    ) {

        return [

            "success" => false,

            "error" =>
                "Opening bracket of volticaProducts not found"

        ];

    }

    $arrayStart =
        $matchStart
        + $openingBracket;

    $length =
        strlen($source);

    $depth = 0;

    $inString = false;

    $stringQuote = "";

    $escape = false;

    $inLineComment = false;

    $inBlockComment = false;


    for (
        $i = $arrayStart;
        $i < $length;
        $i++
    ) {

        $char =
            $source[$i];

        $next =
            ($i + 1 < $length)
            ? $source[$i + 1]
            : "";


        /* =============================================
           LINE COMMENT
           ============================================= */

        if ($inLineComment) {

            if (
                $char === "\n" ||
                $char === "\r"
            ) {

                $inLineComment = false;

            }

            continue;

        }


        /* =============================================
           BLOCK COMMENT
           ============================================= */

        if ($inBlockComment) {

            if (
                $char === "*" &&
                $next === "/"
            ) {

                $inBlockComment = false;

                $i++;

            }

            continue;

        }


        /* =============================================
           STRING
           ============================================= */

        if ($inString) {

            if ($escape) {

                $escape = false;

                continue;

            }

            if ($char === "\\") {

                $escape = true;

                continue;

            }

            if (
                $char === $stringQuote
            ) {

                $inString = false;

                $stringQuote = "";

            }

            continue;

        }


        /* =============================================
           COMMENT START
           ============================================= */

        if (
            $char === "/" &&
            $next === "/"
        ) {

            $inLineComment = true;

            $i++;

            continue;

        }

        if (
            $char === "/" &&
            $next === "*"
        ) {

            $inBlockComment = true;

            $i++;

            continue;

        }


        /* =============================================
           STRING START
           ============================================= */

        if (
            $char === '"' ||
            $char === "'" ||
            $char === "`"
        ) {

            $inString = true;

            $stringQuote = $char;

            continue;

        }


        /* =============================================
           ARRAY DEPTH
           ============================================= */

        if ($char === "[") {

            $depth++;

            continue;

        }

        if ($char === "]") {

            $depth--;

            if ($depth === 0) {

                return [

                    "success" => true,

                    "arrayStart" =>
                        $arrayStart,

                    "arrayEnd" =>
                        $i

                ];

            }

        }

    }


    return [

        "success" => false,

        "error" =>
            "Unable to find closing bracket of volticaProducts array"

    ];

}


$arrayResult =
    findVolticaProductsArrayEnd(
        $currentProducts
    );

if (
    !$arrayResult["success"]
) {

    failResponse(

        "Unable to find closing brackets of volticaProducts array",

        500,

        [

            "step" => $step,

            "diagnostic" =>
                $arrayResult["error"]

        ]

    );

}

$arrayStart =
    $arrayResult["arrayStart"];

$arrayEnd =
    $arrayResult["arrayEnd"];


/* =====================================================
   VALIDATE DATABASE
   ===================================================== */

$step =
    "PRODUCTS.JS VALIDATION";

$databaseDeclaration =
    substr(
        $currentProducts,
        0,
        $arrayEnd + 1
    );

if (
    stripos(
        $databaseDeclaration,
        "volticaProducts"
    ) === false
) {

    failResponse(

        "products.js does not contain volticaProducts",

        500,

        [

            "step" => $step

        ]

    );

}


/* =====================================================
   EXISTING IDS
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
   PRODUCT NUMBERS
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
        max($productNumbers) + 1;

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
   EXTRACT SKU
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
   SKU VALIDATION
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
   DUPLICATE ID
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
   DUPLICATE SKU
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
   PRODUCT HEADER
   ===================================================== */

$product =
    preg_replace(

        '/PRODUCT\s+AUTO/i',

        "PRODUCT "
        . str_pad(
            (string)$nextProductNumber,
            2,
            "0",
            STR_PAD_LEFT
        ),

        $product,

        1

    );

if ($product === null) {

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
   IMAGE VALIDATION
   ===================================================== */

$step =
    "VALIDATING PRODUCT IMAGES";

$validatedFiles = [];

$uploadedImages = [];

if (
    !isset($_FILES["images"])
) {

    failResponse(

        "At least one product image is required",

        400,

        [

            "step" => $step

        ]

    );

}

if (
    !isset($_FILES["images"]["name"]) ||
    !is_array($_FILES["images"]["name"])
) {

    failResponse(

        "Invalid image upload structure",

        400,

        [

            "step" => $step

        ]

    );

}

$imageCount =
    count(
        $_FILES["images"]["name"]
    );

if ($imageCount < 1) {

    failResponse(

        "At least one product image is required",

        400,

        [

            "step" => $step

        ]

    );

}

if ($imageCount > 50) {

    failResponse(

        "Too many product images",

        413,

        [

            "step" => $step,

            "maximum_images" => 50

        ]

    );

}

$finfo = null;

if (
    class_exists("finfo")
) {

    $finfo =
        new finfo(
            FILEINFO_MIME_TYPE
        );

}

$usedNames = [];

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

                "step" => $step,

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

                "step" => $step

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

                "step" => $step,

                "image" =>
                    $originalName

            ]

        );

    }

    if ($fileSize <= 0) {

        failResponse(

            "Image file is empty",

            400,

            [

                "step" => $step,

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

                "step" => $step,

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

                "step" => $step,

                "image" =>
                    $originalName

            ]

        );

    }

    $mimeType = "";

    if ($finfo !== null) {

        $mimeType =
            $finfo->file(
                $tmpFile
            );

    }
    else {

        $mimeType =
            mime_content_type(
                $tmpFile
            );

    }

    if (
        $mimeType === false ||
        !in_array(
            $mimeType,
            $allowedMimeTypes,
            true
        )
    ) {

        failResponse(

            "Invalid image MIME type",

            400,

            [

                "step" => $step,

                "image" =>
                    $originalName,

                "mime" =>
                    $mimeType

            ]

        );

    }


    /* =============================================
       SAFE FILE NAME
       ============================================= */

    $baseName =
        pathinfo(
            basename($originalName),
            PATHINFO_FILENAME
        );

    $safeBaseName =
        preg_replace(
            "/[^a-zA-Z0-9_-]/",
            "-",
            $baseName
        );

    if (
        !is_string($safeBaseName)
    ) {

        failResponse(

            "Unable to create safe image name",

            400,

            [

                "step" => $step,

                "image" =>
                    $originalName

            ]

        );

    }

    $safeBaseName =
        trim(
            $safeBaseName,
            "-"
        );

    if ($safeBaseName === "") {

        $safeBaseName =
            "product-image";

    }

    $safeName =
        $safeBaseName
        . "."
        . $extension;


    /* =============================================
       PREVENT DUPLICATE FILE NAMES
       ============================================= */

    $safeNameKey =
        strtolower($safeName);

    if (
        isset(
            $usedNames[$safeNameKey]
        )
    ) {

        $safeName =
            $safeBaseName
            . "-"
            . ($i + 1)
            . "."
            . $extension;

    }

    $usedNames[
        strtolower($safeName)
    ] = true;


    $validatedFiles[] = [

        "originalName" =>
            $originalName,

        "safeName" =>
            $safeName,

        "tmpFile" =>
            $tmpFile,

        "extension" =>
            $extension,

        "mime" =>
            $mimeType,

        "size" =>
            $fileSize

    ];

}


/* =====================================================
   UPDATE IMAGE PATHS IN PRODUCT BLOCK
   ===================================================== */

foreach (
    $validatedFiles
    as $file
) {

    $oldPath =
        "assets/images/"
        . $file["originalName"];

    $newPath =
        "assets/images/"
        . $file["safeName"];

    $product =
        str_replace(
            $oldPath,
            $newPath,
            $product
        );

}


/* =====================================================
   BUILD UPDATED PRODUCTS.JS
   ===================================================== */

$step =
    "BUILDING PRODUCTS.JS";


/*
   Insert BEFORE the closing ] of volticaProducts.
*/

$before =
    substr(
        $currentProducts,
        0,
        $arrayEnd
    );

$after =
    substr(
        $currentProducts,
        $arrayEnd
    );

$trimmedBefore =
    rtrim($before);

$separator =
    "";

if (
    $trimmedBefore !== "" &&
    substr(
        $trimmedBefore,
        -1
    ) !== ","
) {

    $separator = ",";

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

            "step" => $step

        ]

    );

}


/* =====================================================
   GITHUB — UPDATE PRODUCTS.JS
   ===================================================== */

$step =
    "UPDATING PRODUCTS.JS ON GITHUB";

$newProductsEncoded =
    base64_encode(
        $updatedProducts
    );

$productPayload = [

    "message" =>
        "Add product: "
        . $newProductId,

    "content" =>
        $newProductsEncoded,

    "sha" =>
        $productsData["sha"]

];

$productUpdateResult =
    githubRequest(

        "PUT",

        $productsUrl,

        $githubToken,

        $productPayload

    );

if (
    $productUpdateResult["status"] < 200 ||
    $productUpdateResult["status"] >= 300
) {

    $githubMessage =
        "Unable to update products.js";

    $decoded =
        json_decode(
            $productUpdateResult["response"],
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

        "Unable to update products.js",

        502,

        [

            "step" => $step,

            "github_status" =>
                $productUpdateResult["status"],

            "github_error" =>
                $productUpdateResult["error"],

            "github_message" =>
                $githubMessage

        ]

    );

}


/* =====================================================
   UPLOAD IMAGES TO GITHUB
   ===================================================== */

$step =
    "UPLOADING PRODUCT IMAGES";


foreach (
    $validatedFiles
    as $file
) {

    $imageFullPath =
        $imagePath
        . "/"
        . $file["safeName"];

    $imageUrl =
        $repoUrl
        . "/contents/"
        . str_replace(
            "%2F",
            "/",
            rawurlencode(
                $imageFullPath
            )
        );


    /*
       Read binary image.
    */

    $imageBinary =
        file_get_contents(
            $file["tmpFile"]
        );

    if (
        $imageBinary === false
    ) {

        failResponse(

            "Unable to read uploaded image",

            500,

            [

                "step" => $step,

                "image" =>
                    $file["safeName"]

            ]

        );

    }


    /*
       Check if image already exists.
    */

    $existingImageResult =
        githubRequest(

            "GET",

            $imageUrl,

            $githubToken

        );


    $imageSha = null;

    if (
        $existingImageResult["status"] === 200
    ) {

        $existingImageData =
            json_decode(
                $existingImageResult["response"],
                true
            );

        if (
            is_array($existingImageData) &&
            !empty($existingImageData["sha"])
        ) {

            $imageSha =
                $existingImageData["sha"];

        }

    }
    elseif (
        $existingImageResult["status"] !== 404
    ) {

        failResponse(

            "Unable to check existing image",

            502,

            [

                "step" => $step,

                "image" =>
                    $file["safeName"],

                "github_status" =>
                    $existingImageResult["status"],

                "github_error" =>
                    $existingImageResult["error"]

            ]

        );

    }


    $imagePayload = [

        "message" =>
            (
                $imageSha !== null
                ? "Update product image: "
                : "Add product image: "
            )
            . $file["safeName"],

        "content" =>
            base64_encode(
                $imageBinary
            )

    ];


    if (
        $imageSha !== null
    ) {

        $imagePayload["sha"] =
            $imageSha;

    }


    $imageResult =
        githubRequest(

            "PUT",

            $imageUrl,

            $githubToken,

            $imagePayload

        );

    if (
        $imageResult["status"] < 200 ||
        $imageResult["status"] >= 300
    ) {

        $githubMessage =
            "Unable to upload image";

        $decoded =
            json_decode(
                $imageResult["response"],
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

            "Unable to upload product image",

            502,

            [

                "step" => $step,

                "image" =>
                    $file["safeName"],

                "github_status" =>
                    $imageResult["status"],

                "github_error" =>
                    $imageResult["error"],

                "github_message" =>
                    $githubMessage

            ]

        );

    }


    $uploadedImages[] =
        $file["safeName"];

}


/* =====================================================
   SUCCESS
   ===================================================== */

sendJson(

    [

        "success" => true,

        "message" =>
            "Product successfully published",

        "product" => [

            "id" =>
                $newProductId,

            "sku" =>
                $newProductSku,

            "product_number" =>
                $nextProductNumber,

            "images" =>
                $uploadedImages

        ],

        "github" => [

            "repository" =>
                $githubOwner
                . "/"
                . $githubRepo,

            "products_file" =>
                $productsPath,

            "image_directory" =>
                $imagePath

        ]

    ],

    200

);
