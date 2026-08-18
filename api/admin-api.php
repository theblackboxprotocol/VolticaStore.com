<?php

/* =====================================================
   VOLTICA STORE
   ADMIN API
   GITHUB PRODUCT WRITER
   ===================================================== */


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


/* =====================================================
   CORS
   ===================================================== */

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
    $env["GITHUB_TOKEN"] ?? "";


$adminPassword =
    $env["ADMIN_PASSWORD"] ?? "";


if ($adminPassword === "") {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "error" =>
            "ADMIN_PASSWORD not configured"
    ]);

    exit;

}


if ($githubToken === "") {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "error" =>
            "GITHUB_TOKEN not configured"
    ]);

    exit;

}


/* =====================================================
   ADMIN AUTHENTICATION
   ===================================================== */

$password =
    $_POST["password"] ?? "";


if ($password === "") {

    http_response_code(401);

    echo json_encode([
        "success" => false,
        "error" =>
            "Admin password required"
    ]);

    exit;

}


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
   PRODUCT DATA
   ===================================================== */

$product =
    $_POST["product"] ?? "";


if (trim($product) === "") {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "error" =>
            "Product data missing"
    ]);

    exit;

}


/* =====================================================
   GITHUB REQUEST HELPER
   ===================================================== */

function githubRequest(
    string $method,
    string $url,
    string $token,
    ?array $payload = null
) {

    $ch =
        curl_init($url);


    $headers = [

        "Authorization: Bearer " . $token,

        "Accept: application/vnd.github+json",

        "X-GitHub-Api-Version: 2022-11-28",

        "User-Agent: Voltica-Store-API",

        "Content-Type: application/json"

    ];


    curl_setopt_array(
        $ch,
        [

            CURLOPT_RETURNTRANSFER => true,

            CURLOPT_CUSTOMREQUEST =>
                $method,

            CURLOPT_HTTPHEADER =>
                $headers,

            CURLOPT_TIMEOUT => 60

        ]
    );


    if ($payload !== null) {

        curl_setopt(
            $ch,
            CURLOPT_POSTFIELDS,
            json_encode($payload)
        );

    }


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


    return [

        "response" => $response,

        "status" => $status,

        "error" => $error

    ];

}


/* =====================================================
   VERIFY GITHUB REPOSITORY
   ===================================================== */

$repoUrl =
    "https://api.github.com/repos/"
    . $githubOwner
    . "/"
    . $githubRepo;


$repoResult =
    githubRequest(
        "GET",
        $repoUrl,
        $githubToken
    );


if (
    $repoResult["status"] !== 200
) {

    http_response_code(502);

    echo json_encode([

        "success" => false,

        "error" =>
            "GitHub repository access failed",

        "github_status" =>
            $repoResult["status"]

    ]);

    exit;

}


/* =====================================================
   GET PRODUCTS.JS
   ===================================================== */

$productsUrl =
    "https://api.github.com/repos/"
    . $githubOwner
    . "/"
    . $githubRepo
    . "/contents/"
    . $productsPath;


$productsResult =
    githubRequest(
        "GET",
        $productsUrl,
        $githubToken
    );


if (
    $productsResult["status"] !== 200
) {

    http_response_code(502);

    echo json_encode([

        "success" => false,

        "error" =>
            "Unable to read products.js",

        "github_status" =>
            $productsResult["status"]

    ]);

    exit;

}


$productsData =
    json_decode(
        $productsResult["response"],
        true
    );


if (
    !is_array($productsData) ||
    empty($productsData["content"]) ||
    empty($productsData["sha"])
) {

    http_response_code(500);

    echo json_encode([

        "success" => false,

        "error" =>
            "Invalid products.js response"

    ]);

    exit;

}


/* =====================================================
   DECODE PRODUCTS.JS
   ===================================================== */

$currentProducts =
    base64_decode(
        preg_replace(
            "/\s+/",
            "",
            $productsData["content"]
        )
    );


if ($currentProducts === false) {

    http_response_code(500);

    echo json_encode([

        "success" => false,

        "error" =>
            "Unable to decode products.js"

    ]);

    exit;

}


/* =====================================================
   FIND PRODUCTS ARRAY CLOSING
   ===================================================== */

$closingPosition =
    strrpos(
        $currentProducts,
        "];"
    );


if (
    $closingPosition === false
) {

    http_response_code(500);

    echo json_encode([

        "success" => false,

        "error" =>
            "products.js closing array not found"

    ]);

    exit;

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


$separator = "";


if (
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


/* =====================================================
   UPLOAD PRODUCT IMAGES
   ===================================================== */

$uploadedImages = [];


if (
    isset($_FILES["images"]) &&
    isset($_FILES["images"]["name"]) &&
    is_array($_FILES["images"]["name"])
) {

    $imageCount =
        count(
            $_FILES["images"]["name"]
        );


    $allowedExtensions = [

        "jpg",
        "jpeg",
        "png",
        "webp",
        "gif"

    ];


    for (
        $i = 0;
        $i < $imageCount;
        $i++
    ) {

        if (
            $_FILES["images"]["error"][$i]
            !== UPLOAD_ERR_OK
        ) {

            continue;

        }


        $originalName =
            $_FILES["images"]["name"][$i];


        $tmpFile =
            $_FILES["images"]["tmp_name"][$i];


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

            continue;

        }


        $safeName =
            preg_replace(
                "/[^a-zA-Z0-9._-]/",
                "-",
                $originalName
            );


        if (
            !$safeName
        ) {

            continue;

        }


        $githubImagePath =
            $imagePath
            . "/"
            . $safeName;


        $imageBinary =
            file_get_contents(
                $tmpFile
            );


        if (
            $imageBinary === false
        ) {

            continue;

        }


        $imageBase64 =
            base64_encode(
                $imageBinary
            );


        $imageUrl =
            "https://api.github.com/repos/"
            . $githubOwner
            . "/"
            . $githubRepo
            . "/contents/"
            . $githubImagePath;


        /* ---------------------------------------------
           CHECK EXISTING IMAGE
           --------------------------------------------- */

        $existingImage =
            githubRequest(
                "GET",
                $imageUrl,
                $githubToken
            );


        $imagePayload = [

            "message" =>
                "Add product image: "
                . $safeName,

            "content" =>
                $imageBase64

        ];


        /* ---------------------------------------------
           UPDATE EXISTING IMAGE
           --------------------------------------------- */

        if (
            $existingImage["status"] === 200
        ) {

            $existingData =
                json_decode(
                    $existingImage["response"],
                    true
                );


            if (
                !empty(
                    $existingData["sha"]
                )
            ) {

                $imagePayload["sha"] =
                    $existingData["sha"];


                $imagePayload["message"] =
                    "Update product image: "
                    . $safeName;

            }

        }


        /* ---------------------------------------------
           UPLOAD TO GITHUB
           --------------------------------------------- */

        $uploadResult =
            githubRequest(
                "PUT",
                $imageUrl,
                $githubToken,
                $imagePayload
            );


        if (
            $uploadResult["status"] !== 200 &&
            $uploadResult["status"] !== 201
        ) {

            http_response_code(502);

            echo json_encode([

                "success" => false,

                "error" =>
                    "Image upload failed",

                "image" =>
                    $safeName,

                "github_status" =>
                    $uploadResult["status"],

                "github_response" =>
                    json_decode(
                        $uploadResult["response"],
                        true
                    )

            ]);

            exit;

        }


        $uploadedImages[] =
            $githubImagePath;

    }

}


/* =====================================================
   UPDATE PRODUCTS.JS ON GITHUB
   ===================================================== */

$productsPayload = [

    "message" =>
        "Add new Voltica product",

    "content" =>
        base64_encode(
            $updatedProducts
        ),

    "sha" =>
        $productsData["sha"]

];


$updateProducts =
    githubRequest(
        "PUT",
        $productsUrl,
        $githubToken,
        $productsPayload
    );


if (
    $updateProducts["status"] !== 200
) {

    http_response_code(502);

    echo json_encode([

        "success" => false,

        "error" =>
            "products.js update failed",

        "github_status" =>
            $updateProducts["status"],

        "uploaded_images" =>
            $uploadedImages,

        "github_response" =>
            json_decode(
                $updateProducts["response"],
                true
            )

    ]);

    exit;

}


/* =====================================================
   SUCCESS
   ===================================================== */

echo json_encode([

    "success" => true,

    "message" =>
        "Product successfully published",

    "repository" =>
        $githubOwner
        . "/"
        . $githubRepo,

    "products_file" =>
        $productsPath,

    "uploaded_images" =>
        $uploadedImages,

    "github_status" =>
        200

]);

exit;

?>
