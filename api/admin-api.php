<?php

/* =====================================================
   VOLTICA STORE
   ADMIN API
   PRODUCT PUBLISHER
   ===================================================== */

header("Content-Type: application/json; charset=UTF-8");


/* =====================================================
   CONFIGURATION
   ===================================================== */

$allowedOrigins = [
    "https://theblackboxprotocol.github.io",
    "https://volticastore.com",
    "https://www.volticastore.com"
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

    http_response_code(405);

    echo json_encode([
        "success" => false,
        "error" => "POST request required"
    ]);

    exit;

}


/* =====================================================
   LOAD ENVIRONMENT
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


if ($githubToken === "") {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "error" => "GitHub token not configured"
    ]);

    exit;

}


if ($adminPassword === "") {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "error" => "Admin password not configured"
    ]);

    exit;

}


/* =====================================================
   RECEIVE FORM DATA
   ===================================================== */

$password =
    $_POST["password"] ?? null;

$product =
    $_POST["product"] ?? null;


/* =====================================================
   PASSWORD VALIDATION
   ===================================================== */

if (
    $password === null ||
    $password === ""
) {

    http_response_code(401);

    echo json_encode([
        "success" => false,
        "error" => "Admin password required"
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
        "error" => "Invalid password"
    ]);

    exit;

}


/* =====================================================
   PRODUCT VALIDATION
   ===================================================== */

if (
    $product === null ||
    trim($product) === ""
) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "error" => "Product data missing"
    ]);

    exit;

}


/* =====================================================
   GITHUB REQUEST
   ===================================================== */

function githubRequest(
    string $method,
    string $url,
    string $token,
    ?array $payload = null
) {

    $curl =
        curl_init($url);


    $headers = [

        "Authorization: Bearer " . $token,

        "Accept: application/vnd.github+json",

        "X-GitHub-Api-Version: 2022-11-28",

        "User-Agent: Voltica-Store-Admin-API",

        "Content-Type: application/json"

    ];


    curl_setopt_array(
        $curl,
        [

            CURLOPT_RETURNTRANSFER => true,

            CURLOPT_CUSTOMREQUEST => $method,

            CURLOPT_HTTPHEADER => $headers,

            CURLOPT_TIMEOUT => 60,

            CURLOPT_FOLLOWLOCATION => true

        ]
    );


    if ($payload !== null) {

        curl_setopt(
            $curl,
            CURLOPT_POSTFIELDS,
            json_encode($payload)
        );

    }


    $response =
        curl_exec($curl);


    $status =
        curl_getinfo(
            $curl,
            CURLINFO_HTTP_CODE
        );


    $error =
        curl_error($curl);


    curl_close($curl);


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


/* =====================================================
   DECODE GITHUB RESPONSE
   ===================================================== */

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


$currentProducts =
    base64_decode(
        preg_replace(
            "/\s+/",
            "",
            $productsData["content"]
        )
    );


if (
    $currentProducts === false
) {

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
   BUILD NEW PRODUCTS.JS
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
   UPLOAD IMAGES
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
            ($_FILES["images"]["error"][$i]
            ?? UPLOAD_ERR_NO_FILE)
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
                    $uploadResult["status"]

            ]);

            exit;

        }


        $uploadedImages[] =
            $githubImagePath;

    }

}


/* =====================================================
   UPDATE PRODUCTS.JS
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
            $uploadedImages

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

?>
