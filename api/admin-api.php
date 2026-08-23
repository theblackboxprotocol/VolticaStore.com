<?php

/* =====================================================
   VOLTICA STORE
   ADMIN API
   GITHUB PRODUCT WRITER
   VERSION — STABLE / ROBUST
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
$githubRepo  = "VolticaStore.com";

$productsPath = "products.js";
$imagePath    = "assets/images";

$envPath = "/home/u379666423/.env";

$lockPath =
    sys_get_temp_dir() .
    "/voltica-product-manager.lock";

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
        "Access-Control-Allow-Origin: " .
        $origin
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
                "error"   => $message
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
                    "error"   => "PHP fatal error",
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
    ($_SERVER["REQUEST_METHOD"] ?? "") ===
    "OPTIONS"
) {

    http_response_code(204);

    exit;
}


/* =====================================================
   POST ONLY
   ===================================================== */

if (
    ($_SERVER["REQUEST_METHOD"] ?? "") !==
    "POST"
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


$envLines = file(
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


foreach (
    $envLines as $line
) {

    $line = trim($line);

    if (
        $line === "" ||
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
            "step" => $step
        ]
    );

}


if (
    strlen($product) >
    $maxProductBytes
) {

    failResponse(
        "Product data is too large",
        413,
        [
            "step" => $step,
            "maximum_bytes" =>
                $maxProductBytes
        ]
    );

}


/* =====================================================
   PRODUCT BASIC VALIDATION
   ===================================================== */

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
            "status"   => 0,
            "error" =>
                "PHP cURL extension is not available"
        ];

    }


    $ch =
        curl_init($url);


    if ($ch === false) {

        return [
            "response" => "",
            "status"   => 0,
            "error" =>
                "Unable to initialize cURL"
        ];

    }


    $headers = [

        "Authorization: Bearer " .
        $token,

        "Accept: application/vnd.github+json",

        "X-GitHub-Api-Version: 2022-11-28",

        "User-Agent: Voltica-Store-API",

        "Content-Type: application/json"

    ];


    $options = [

        CURLOPT_RETURNTRANSFER => true,

        CURLOPT_CUSTOMREQUEST =>
            strtoupper($method),

        CURLOPT_HTTPHEADER =>
            $headers,

        CURLOPT_CONNECTTIMEOUT => 15,

        CURLOPT_TIMEOUT => 60,

        CURLOPT_FOLLOWLOCATION => false,

        CURLOPT_SSL_VERIFYPEER => true,

        CURLOPT_SSL_VERIFYHOST => 2

    ];


    if (
        $payload !== null
    ) {

        $encoded =
            json_encode(
                $payload,
                JSON_UNESCAPED_SLASHES |
                JSON_UNESCAPED_UNICODE
            );


        if (
            $encoded === false
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
            $encoded;

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
   GITHUB REPOSITORY
   ===================================================== */

$repoUrl =
    "https://api.github.com/repos/" .
    rawurlencode($githubOwner) .
    "/" .
    rawurlencode($githubRepo);


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

    $message =
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

        $message =
            $decoded["message"];

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
                $message
        ]
    );

}


/* =====================================================
   PRODUCT LOCK
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

    fclose(
        $lockHandle
    );

    failResponse(
        "Unable to lock product manager",
        500,
        [
            "step" => $step
        ]
    );

}


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
    $repoUrl .
    "/contents/" .
    str_replace(
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

    $message =
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

        $message =
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
                $message
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


if (
    $currentProducts === false
) {

    failResponse(
        "Unable to decode products.js",
        500,
        [
            "step" => $step
        ]
    );

}


/* =====================================================
   VALIDATE PRODUCT DATABASE
   ===================================================== */

if (
    strpos(
        $currentProducts,
        "volticaProducts"
    ) === false
) {

    failResponse(
        "volticaProducts array not found in products.js",
        500,
        [
            "step" =>
                "PRODUCTS.JS VALIDATION"
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
        $matches
    )
) {

    $existingIds =
        $matches[1];

}


if (
    preg_match_all(
        '/\bsku\s*:\s*"([^"]+)"/',
        $currentProducts,
        $matches
    )
) {

    $existingSkus =
        $matches[1];

}


/* =====================================================
   PRODUCT NUMBER
   ===================================================== */

$productNumbers = [];


if (
    preg_match_all(
        '/PRODUCT\s+(\d+)/i',
        $currentProducts,
        $matches
    )
) {

    foreach (
        $matches[1] as $number
    ) {

        $productNumbers[] =
            intval($number);

    }

}


$nextProductNumber = 1;


if (
    !empty($productNumbers)
) {

    $nextProductNumber =
        max($productNumbers) + 1;

}


/* =====================================================
   PRODUCT ID
   ===================================================== */

if (
    !preg_match(
        '/\bid\s*:\s*"([^"]+)"/',
        $product,
        $match
    )
) {

    failResponse(
        "Product ID missing",
        400,
        [
            "step" =>
                "PRODUCT VALIDATION"
        ]
    );

}


$newProductId =
    trim($match[1]);


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
   PRODUCT SKU
   ===================================================== */

if (
    !preg_match(
        '/\bsku\s*:\s*"([^"]+)"/',
        $product,
        $match
    )
) {

    failResponse(
        "Product SKU missing",
        400,
        [
            "step" =>
                "PRODUCT VALIDATION"
        ]
    );

}


$newProductSku =
    trim($match[1]);


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
   RENAME PRODUCT HEADER
   ===================================================== */

$product =
    preg_replace(
        '/PRODUCT\s+AUTO/i',
        "PRODUCT " .
        $nextProductNumber,
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
   FIND ARRAY OPENING
   ===================================================== */

$step =
    "BUILDING PRODUCTS.JS";


$arrayPattern =
    '/volticaProducts\s*=\s*\[/';


if (
    !preg_match(
        $arrayPattern,
        $currentProducts,
        $arrayMatch,
        PREG_OFFSET_CAPTURE
    )
) {

    failResponse(
        "volticaProducts array opening not found",
        500,
        [
            "step" => $step
        ]
    );

}


$arrayStart =
    $arrayMatch[0][1];


/* =====================================================
   FIND MATCHING ARRAY CLOSING BRACKET
   ===================================================== */

$openBracket =
    strpos(
        $currentProducts,
        "[",
        $arrayStart
    );


if (
    $openBracket === false
) {

    failResponse(
        "Products array opening bracket not found",
        500,
        [
            "step" => $step
        ]
    );

}


/*
   Scan the JavaScript and find the matching
   closing bracket.

   This does NOT assume the file ends with ];
*/

$length =
    strlen($currentProducts);

$depth = 0;

$inString = false;

$stringQuote = "";

$escaped = false;

$closingBracket = false;


for (
    $i = $openBracket;
    $i < $length;
    $i++
) {

    $char =
        $currentProducts[$i];


    if ($inString) {

        if ($escaped) {

            $escaped = false;

            continue;

        }


        if ($char === "\\") {

            $escaped = true;

            continue;

        }


        if (
            $char === $stringQuote
        ) {

            $inString = false;

        }

        continue;

    }


    if (
        $char === '"' ||
        $char === "'" ||
        $char === "`"
    ) {

        $inString = true;

        $stringQuote =
            $char;

        continue;

    }


    if ($char === "[") {

        $depth++;

        continue;

    }


    if ($char === "]") {

        $depth--;

        if ($depth === 0) {

            $closingBracket =
                $i;

            break;

        }

    }

}


if (
    $closingBracket === false
) {

    failResponse(
        "Unable to find closing bracket of volticaProducts array",
        500,
        [
            "step" => $step
        ]
    );

}


/* =====================================================
   INSERT PRODUCT
   ===================================================== */

$before =
    substr(
        $currentProducts,
        0,
        $closingBracket
    );


$after =
    substr(
        $currentProducts,
        $closingBracket
    );


$trimmedBefore =
    rtrim($before);


/*
   Make sure the previous product has
   a comma before inserting the new one.
*/

if (
    substr(
        $trimmedBefore,
        -1
    ) !== ","
) {

    $trimmedBefore .= ",";

}


$updatedProducts =
    $trimmedBefore .
    "\n\n" .
    trim($product) .
    "\n" .
    $after;


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
   IMAGE VALIDATION
   ===================================================== */

$step =
    "VALIDATING PRODUCT IMAGES";


$validatedFiles = [];


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
            "step" => $step
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
            "step" => $step
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


for (
    $i = 0;
    $i < $imageCount;
    $i++
) {

    $error =
        $_FILES["images"]["error"][$i]
        ?? UPLOAD_ERR_NO_FILE;


    if (
        $error !== UPLOAD_ERR_OK
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
                    $error
            ]
        );

    }


    $name =
        $_FILES["images"]["name"][$i]
        ?? "";


    $tmp =
        $_FILES["images"]["tmp_name"][$i]
        ?? "";


    $size =
        intval(
            $_FILES["images"]["size"][$i]
            ?? 0
        );


    if (
        $name === "" ||
        $tmp === ""
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
        !is_uploaded_file($tmp)
    ) {

        failResponse(
            "Invalid upload source",
            400,
            [
                "step" => $step,
                "image" => $name
            ]
        );

    }


    if (
        $size <= 0
    ) {

        failResponse(
            "Image file is empty",
            400,
            [
                "step" => $step,
                "image" => $name
            ]
        );

    }


    if (
        $size > $maxImageBytes
    ) {

        failResponse(
            "Image exceeds maximum size",
            413,
            [
                "step" => $step,
                "image" => $name,
                "maximum_bytes" =>
                    $maxImageBytes
            ]
        );

    }


    $extension =
        strtolower(
            pathinfo(
                $name,
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
                "image" => $name
            ]
        );

    }


    $mime = "";


    if (
        $finfo instanceof finfo
    ) {

        $mime =
            $finfo->file($tmp);

    }
    else {

        $mime =
            mime_content_type($tmp);

    }


    if (
        !in_array(
            $mime,
            $allowedMimeTypes,
            true
        )
    ) {

        failResponse(
            "Invalid image MIME type",
            400,
            [
                "step" => $step,
                "image" => $name,
                "mime" => $mime
            ]
        );

    }


    $safeName =
        preg_replace(
            "/[^a-zA-Z0-9._-]/",
            "-",
            basename($name)
        );


    if (
        !is_string($safeName) ||
        $safeName === ""
    ) {

        failResponse(
            "Unable to create safe image filename",
            400,
            [
                "step" => $step,
                "image" => $name
            ]
        );

    }


    $safeName =
        preg_replace(
            "/-+/",
            "-",
            $safeName
        );


    $validatedFiles[] = [

        "original" =>
            $name,

        "safe" =>
            $safeName,

        "tmp" =>
            $tmp,

        "size" =>
            $size,

        "mime" =>
            $mime

    ];

}


/* =====================================================
   IMAGE UPLOAD TO GITHUB
   ===================================================== */

$step =
    "UPLOADING PRODUCT IMAGES";


$uploadedImages = [];


foreach (
    $validatedFiles as $file
) {

    $binary =
        file_get_contents(
            $file["tmp"]
        );


    if (
        $binary === false
    ) {

        failResponse(
            "Unable to read uploaded image",
            500,
            [
                "step" => $step,
                "image" =>
                    $file["original"]
            ]
        );

    }


    $base64 =
        base64_encode($binary);


    $imageGithubPath =
        $imagePath .
        "/" .
        $file["safe"];


    $imageUrl =
        $repoUrl .
        "/contents/" .
        str_replace(
            "%2F",
            "/",
            rawurlencode(
                $imageGithubPath
            )
        );


    /*
       Check whether the image already exists.
    */

    $existingImage =
        githubRequest(
            "GET",
            $imageUrl,
            $githubToken
        );


    $imagePayload = [

        "message" =>
            "Add product image: " .
            $file["safe"],

        "content" =>
            $base64

    ];


    if (
        $existingImage["status"] === 200
    ) {

        $existingImageData =
            json_decode(
                $existingImage["response"],
                true
            );


        if (
            is_array($existingImageData) &&
            !empty($existingImageData["sha"])
        ) {

            $imagePayload["sha"] =
                $existingImageData["sha"];

            $imagePayload["message"] =
                "Update product image: " .
                $file["safe"];

        }

    }


    $imageResult =
        githubRequest(
            "PUT",
            $imageUrl,
            $githubToken,
            $imagePayload
        );


    if (
        $imageResult["status"] !== 200 &&
        $imageResult["status"] !== 201
    ) {

        $message =
            "GitHub image upload failed";


        $decoded =
            json_decode(
                $imageResult["response"],
                true
            );


        if (
            is_array($decoded) &&
            !empty($decoded["message"])
        ) {

            $message =
                $decoded["message"];

        }


        failResponse(
            $message,
            502,
            [
                "step" => $step,

                "image" =>
                    $file["safe"],

                "github_status" =>
                    $imageResult["status"],

                "github_error" =>
                    $imageResult["error"]
            ]
        );

    }


    $uploadedImages[] =
        $imagePath .
        "/" .
        $file["safe"];

}


/* =====================================================
   UPDATE PRODUCTS.JS ON GITHUB
   ===================================================== */

$step =
    "UPDATING PRODUCTS.JS";


$productsPayload = [

    "message" =>
        "Add product: " .
        $newProductId,

    "content" =>
        base64_encode(
            $updatedProducts
        ),

    "sha" =>
        $productsData["sha"]

];


$updateResult =
    githubRequest(
        "PUT",
        $productsUrl,
        $githubToken,
        $productsPayload
    );


if (
    $updateResult["status"] !== 200
) {

    $message =
        "GitHub products.js update failed";


    $decoded =
        json_decode(
            $updateResult["response"],
            true
        );


    if (
        is_array($decoded) &&
        !empty($decoded["message"])
    ) {

        $message =
            $decoded["message"];

    }


    failResponse(
        $message,
        502,
        [
            "step" =>
                $step,

            "github_status" =>
                $updateResult["status"],

            "github_error" =>
                $updateResult["error"]
        ]
    );

}


/* =====================================================
   SUCCESS
   ===================================================== */

sendJson(
    [

        "success" => true,

        "message" =>
            "Product successfully published",

        "product_id" =>
            $newProductId,

        "sku" =>
            $newProductSku,

        "product_number" =>
            $nextProductNumber,

        "images" =>
            $uploadedImages,

        "github" => [

            "repository" =>
                $githubOwner .
                "/" .
                $githubRepo,

            "products_file" =>
                $productsPath

        ]

    ],
    200
);
