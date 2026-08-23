/* =====================================================
   VOLTICA STORE
   ADMIN PRODUCT MANAGER
   admin.js
   ===================================================== */

"use strict";


/* =====================================================
   API CONFIGURATION
   ===================================================== */

const API_URL =
    "https://api.volticastore.com/api/admin-api.php";


/* =====================================================
   ELEMENTS
   ===================================================== */

const imageInput =
    document.getElementById("productImages");

const imagePreview =
    document.getElementById("imagePreview");

const clearImagesButton =
    document.getElementById("clearImages");

const addProductButton =
    document.getElementById("addProduct");


/* =====================================================
   IMAGE PREVIEW
   ===================================================== */

if (imageInput) {

    imageInput.addEventListener(
        "change",
        function () {

            if (!imagePreview) {
                return;
            }

            imagePreview.innerHTML = "";

            const files =
                Array.from(this.files || []);

            if (!files.length) {
                return;
            }

            const count =
                document.createElement("div");

            count.className =
                "image-preview-count";

            count.textContent =
                files.length +
                (
                    files.length === 1
                        ? " image selected"
                        : " images selected"
                );

            imagePreview.appendChild(count);


            files.forEach(
                function (file) {

                    if (
                        !file.type.startsWith("image/")
                    ) {
                        return;
                    }


                    const item =
                        document.createElement("div");

                    item.className =
                        "image-preview-item";


                    const image =
                        document.createElement("img");

                    const objectUrl =
                        URL.createObjectURL(file);

                    image.src =
                        objectUrl;

                    image.alt =
                        file.name;


                    image.onload =
                        function () {

                            URL.revokeObjectURL(
                                objectUrl
                            );

                        };


                    const name =
                        document.createElement("div");

                    name.className =
                        "image-preview-name";

                    name.textContent =
                        file.name;


                    item.appendChild(image);

                    item.appendChild(name);

                    imagePreview.appendChild(item);

                }
            );

        }
    );

}


/* =====================================================
   CLEAR IMAGES
   ===================================================== */

if (clearImagesButton) {

    clearImagesButton.addEventListener(
        "click",
        function () {

            if (imageInput) {
                imageInput.value = "";
            }

            if (imagePreview) {
                imagePreview.innerHTML = "";
            }

        }
    );

}


/* =====================================================
   ESCAPE JAVASCRIPT STRING
   ===================================================== */

function escapeJS(value) {

    return String(value ?? "")
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .replace(/\r?\n/g, "\\n");

}


/* =====================================================
   CREATE SAFE PRODUCT ID
   ===================================================== */

function createProductId(name) {

    const id =
        String(name || "")
            .toLowerCase()
            .replace(/^voltica\s*/i, "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

    return id || "product";

}


/* =====================================================
   CREATE SAFE IMAGE NAME
   ===================================================== */

function createSafeImageName(
    filename,
    index
) {

    const original =
        String(filename || "")
            .trim();

    const extension =
        (
            original
                .split(".")
                .pop() || "webp"
        )
        .toLowerCase();


    let base =
        original
            .replace(
                /\.[^/.]+$/,
                ""
            )
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(
                /[^a-z0-9]+/g,
                "-"
            )
            .replace(
                /^-+|-+$/g,
                "");


    if (!base) {
        base = "product-image";
    }


    return (
        base +
        "-" +
        String(index + 1) +
        "." +
        extension
    );

}


/* =====================================================
   PARSE FEATURES
   ===================================================== */

function parseFeatures(text) {

    if (
        !String(text || "").trim()
    ) {

        return [];

    }


    return text
        .split(/\r?\n/)
        .map(
            line =>
                line.trim()
        )
        .filter(Boolean)
        .map(
            function (
                line,
                index
            ) {

                const parts =
                    line
                        .split("—")
                        .map(
                            part =>
                                part.trim()
                        );


                if (
                    parts.length >= 3
                ) {

                    return [

                        parts[0],

                        parts[1],

                        parts
                            .slice(2)
                            .join(" — ")

                    ];

                }


                return [

                    String(index + 1)
                        .padStart(2, "0"),

                    parts[0] || "",

                    parts
                        .slice(1)
                        .join(" — ")

                ];

            }
        );

}


/* =====================================================
   PARSE SPECIFICATIONS
   ===================================================== */

function parseSpecifications(text) {

    if (
        !String(text || "").trim()
    ) {

        return [];

    }


    return text
        .split(/\r?\n/)
        .map(
            line =>
                line.trim()
        )
        .filter(Boolean)
        .map(
            function (line) {

                const separator =
                    line.indexOf(":");


                if (
                    separator === -1
                ) {

                    return [

                        line,

                        ""

                    ];

                }


                return [

                    line
                        .substring(
                            0,
                            separator
                        )
                        .trim(),

                    line
                        .substring(
                            separator + 1
                        )
                        .trim()

                ];

            }
        );

}


/* =====================================================
   GET IMAGE PATHS
   ===================================================== */

function getImagePaths() {

    if (
        !imageInput ||
        !imageInput.files ||
        !imageInput.files.length
    ) {

        return [];

    }


    return Array
        .from(imageInput.files)
        .map(
            function (
                file,
                index
            ) {

                const safeName =
                    createSafeImageName(
                        file.name,
                        index
                    );


                return {

                    originalName:
                        file.name,

                    safeName:
                        safeName,

                    path:
                        "assets/images/" +
                        safeName

                };

            }
        );

}


/* =====================================================
   GENERATE PRODUCT
   ===================================================== */

function generateProduct() {

    const name =
        document
            .getElementById("productName")
            ?.value
            .trim();


    const category =
        document
            .getElementById("category")
            ?.value
            .trim();


    const supplierLink =
        document
            .getElementById("supplierLink")
            ?.value
            .trim();


    const sku =
        document
            .getElementById("cjSku")
            ?.value
            .trim();


    const cost =
        document
            .getElementById("cost")
            ?.value
            .trim();


    const price =
        document
            .getElementById("price")
            ?.value
            .trim();


    const stripe =
        document
            .getElementById("stripe")
            ?.value
            .trim();


    const description =
        document
            .getElementById("description")
            ?.value
            .trim();


    const featuresText =
        document
            .getElementById("features")
            ?.value || "";


    const specificationsText =
        document
            .getElementById("specifications")
            ?.value || "";


    /* =================================================
       VALIDATION
       ================================================= */

    if (!name) {

        alert(
            "Please enter a Product Name."
        );

        return null;

    }


    if (!category) {

        alert(
            "Please select a Category."
        );

        return null;

    }


    if (!supplierLink) {

        alert(
            "Please enter the Supplier Product Link."
        );

        return null;

    }


    if (!sku) {

        alert(
            "Please enter the Supplier SKU."
        );

        return null;

    }


    if (!price) {

        alert(
            "Please enter the Voltica Price."
        );

        return null;

    }


    if (
        !imageInput ||
        !imageInput.files ||
        !imageInput.files.length
    ) {

        alert(
            "Please select at least one product image."
        );

        return null;

    }


    /* =================================================
       PRODUCT DATA
       ================================================= */

    const productId =
        createProductId(name);


    const imageData =
        getImagePaths();


    const features =
        parseFeatures(
            featuresText
        );


    const specifications =
        parseSpecifications(
            specificationsText
        );


    /* =================================================
       PRODUCT BLOCK
       ================================================= */

    let product = `
// =================================================
// PRODUCT AUTO — ${name.toUpperCase()}
// =================================================

{
    id: "${escapeJS(productId)}",

    sku: "${escapeJS(sku)}",

    name: "${escapeJS(name)}",

    category: "${escapeJS(category)}",

    badge: "NEW",

    supplierLink:
        "${escapeJS(supplierLink)}",

    cost:
        "${escapeJS(cost)}",

    price:
        "${escapeJS(price)}",

    currency: "USD",

    images: [
`;


    product +=
        imageData
            .map(
                image =>
                    `        "${escapeJS(image.path)}"`
            )
            .join(",\n");


    product += `
    ],

    description:
        "${escapeJS(description)}",

    specifications: [
`;


    product +=
        specifications
            .map(
                spec =>
                    `        ["${escapeJS(spec[0])}", "${escapeJS(spec[1])}"]`
            )
            .join(",\n");


    product += `
    ],

    features: [
`;


    product +=
        features
            .map(
                feature =>
                    `        ["${escapeJS(feature[0])}", "${escapeJS(feature[1])}", "${escapeJS(feature[2])}"]`
            )
            .join(",\n");


    product += `
    ]`;


    if (stripe) {

        product += `,

    stripe:
        "${escapeJS(stripe)}"`;

    }


    product += `
},`;


    return {

        block:
            product,

        images:
            imageData

    };

}


/* =====================================================
   PUBLISH PRODUCT
   ===================================================== */

async function publishProduct(
    password,
    productData
) {

    if (
        !productData ||
        !productData.block
    ) {

        return false;

    }


    const formData =
        new FormData();


    formData.append(
        "password",
        password
    );


    formData.append(
        "product",
        productData.block
    );


    /* =================================================
       IMAGE UPLOAD
       ================================================= */

    if (
        imageInput &&
        imageInput.files &&
        imageInput.files.length
    ) {

        Array
            .from(imageInput.files)
            .forEach(
                function (file) {

                    /*
                       IMPORTANT:
                       The PHP API expects:

                       images[]

                       and receives the actual
                       uploaded file.

                       We keep the original filename
                       here. The PHP API is responsible
                       for generating its safe filename.
                    */

                    formData.append(
                        "images[]",
                        file,
                        file.name
                    );

                }
            );

    }


    /* =================================================
       DEBUG
       ================================================= */

    console.log(
        "======================================"
    );

    console.log(
        "VOLTICA API REQUEST"
    );

    console.log(
        "API:",
        API_URL
    );

    console.log(
        "Images:",
        imageInput?.files?.length || 0
    );

    console.log(
        "======================================"
    );


    try {

        const response =
            await fetch(
                API_URL,
                {

                    method:
                        "POST",

                    body:
                        formData,

                    headers: {

                        "Accept":
                            "application/json"

                    },

                    cache:
                        "no-store"

                }
            );


        /* =================================================
           READ RESPONSE
           ================================================= */

        const responseText =
            await response.text();


        console.log(
            "VOLTICA RAW API RESPONSE:",
            responseText
        );


        let result;


        try {

            result =
                JSON.parse(
                    responseText
                );

        }

        catch (jsonError) {

            console.error(
                "API returned invalid JSON:",
                jsonError
            );


            alert(

                "API CONNECTION FAILED\n\n" +

                "HTTP STATUS: " +
                response.status +
                "\n\n" +

                "The server did not return valid JSON.\n\n" +

                responseText.substring(
                    0,
                    1000
                )

            );


            return false;

        }


        console.log(
            "VOLTICA API RESPONSE:",
            result
        );


        /* =================================================
           API ERROR
           ================================================= */

        if (
            !response.ok ||
            !result.success
        ) {

            let message =
                result.error ||
                "Unknown API error";


            if (
                result.step
            ) {

                message +=
                    "\n\nSTEP: " +
                    result.step;

            }


            if (
                result.github_message
            ) {

                message +=
                    "\n\nGITHUB: " +
                    result.github_message;

            }


            alert(

                "PUBLISH FAILED\n\n" +
                message

            );


            return false;

        }


        /* =================================================
           SUCCESS
           ================================================= */

        alert(

            "🔥 PRODUCT PUBLISHED!\n\n" +

            "✓ GitHub updated\n" +

            "✓ products.js updated\n" +

            "✓ Images uploaded\n" +

            "✓ Product ID verified"

        );


        return true;

    }


    catch (error) {

        console.error(
            "VOLTICA API ERROR:",
            error
        );


        alert(

            "API CONNECTION FAILED\n\n" +

            (
                error?.message ||
                "Network request failed."
            ) +

            "\n\n" +

            "Check that api.volticastore.com is online."

        );


        return false;

    }

}


/* =====================================================
   ADMIN AUTHENTICATION
   ===================================================== */

async function authenticateAPI() {

    const password =
        prompt(
            "VOLTICA STORE\n\nADMIN PASSWORD"
        );


    if (!password) {

        alert(
            "Admin password required."
        );

        return null;

    }


    return password;

}


/* =====================================================
   ADD PRODUCT
   ===================================================== */

if (addProductButton) {

    addProductButton.addEventListener(
        "click",
        async function () {

            /* =================================================
               GENERATE
               ================================================= */

            const productData =
                generateProduct();


            if (!productData) {
                return;
            }


            /* =================================================
               PASSWORD
               ================================================= */

            const password =
                await authenticateAPI();


            if (!password) {
                return;
            }


            /* =================================================
               LOCK BUTTON
               ================================================= */

            this.disabled =
                true;


            this.textContent =
                "PUBLISHING...";


            /* =================================================
               PUBLISH
               ================================================= */

            const published =
                await publishProduct(
                    password,
                    productData
                );


            /* =================================================
               SUCCESS MODAL
               ================================================= */

            if (published) {

                showGeneratedProduct(
                    productData.block
                );

            }


            /* =================================================
               UNLOCK
               ================================================= */

            this.disabled =
                false;


            this.textContent =
                "ADD PRODUCT";

        }
    );

}


/* =====================================================
   SHOW GENERATED PRODUCT
   ================================================= */

function showGeneratedProduct(
    product
) {

    let modal =
        document.getElementById(
            "generatedProduct"
        );


    if (modal) {
        modal.remove();
    }


    modal =
        document.createElement(
            "div"
        );


    modal.id =
        "generatedProduct";


    modal.style.cssText = `

        position: fixed;
        inset: 0;
        z-index: 99999;

        background:
            rgba(0,0,0,.92);

        backdrop-filter:
            blur(20px);

        padding: 20px;

        overflow: auto;

    `;


    modal.innerHTML = `

        <div style="

            max-width:900px;
            margin:20px auto;

            background:#111318;

            border:
                1px solid
                rgba(255,255,255,.12);

            border-radius:20px;

            padding:20px;

            color:white;

            box-shadow:
                0 30px 100px
                rgba(0,0,0,.7);

        ">


            <div style="

                display:flex;
                justify-content:space-between;
                align-items:center;
                gap:15px;
                margin-bottom:16px;

            ">


                <strong style="
                    font-size:18px;
                    letter-spacing:.05em;
                ">

                    PRODUCT PUBLISHED

                </strong>


                <button
                    type="button"
                    id="closeGeneratedProduct"
                    style="
                        background:
                            rgba(255,255,255,.06);

                        border:
                            1px solid
                            rgba(255,255,255,.15);

                        color:white;

                        border-radius:10px;

                        padding:9px 13px;

                        cursor:pointer;
                    "
                >

                    CLOSE

                </button>


            </div>


            <div style="

                padding:14px;

                margin-bottom:14px;

                border-radius:12px;

                background:
                    rgba(0,255,140,.08);

                border:
                    1px solid
                    rgba(0,255,140,.20);

                color:#9fffc8;

                font-weight:600;

            ">

                ✓ PRODUCT SUCCESSFULLY
                PUBLISHED TO GITHUB

            </div>


            <textarea
                id="generatedProductText"
                readonly
                style="
                    width:100%;
                    min-height:520px;
                    box-sizing:border-box;
                    background:#050608;
                    color:#f4f4f5;
                    border:
                        1px solid
                        rgba(255,255,255,.1);
                    border-radius:14px;
                    padding:16px;
                    font-family:monospace;
                    font-size:12px;
                    line-height:1.6;
                    resize:vertical;
                "
            ></textarea>


            <button
                type="button"
                id="copyGeneratedProduct"
                style="
                    width:100%;
                    margin-top:14px;
                    padding:15px;
                    border:0;
                    border-radius:12px;
                    background:white;
                    color:black;
                    font-weight:700;
                    cursor:pointer;
                "
            >

                COPY PRODUCT BLOCK

            </button>


        </div>

    `;


    document.body.appendChild(
        modal
    );


    /* =================================================
       PRODUCT TEXT
       ================================================= */

    const textarea =
        document.getElementById(
            "generatedProductText"
        );


    if (textarea) {

        textarea.value =
            product;

    }


    /* =================================================
       CLOSE
       ================================================= */

    const closeButton =
        document.getElementById(
            "closeGeneratedProduct"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            function () {

                modal.remove();

            }
        );

    }


    /* =================================================
       COPY
       ================================================= */

    const copyButton =
        document.getElementById(
            "copyGeneratedProduct"
        );


    if (copyButton) {

        copyButton.addEventListener(
            "click",
            async function () {

                try {

                    await navigator
                        .clipboard
                        .writeText(product);


                    this.textContent =
                        "✓ COPIED";


                    setTimeout(
                        function () {

                            if (
                                copyButton
                            ) {

                                copyButton.textContent =
                                    "COPY PRODUCT BLOCK";

                            }

                        },
                        1800
                    );

                }

                catch (error) {

                    console.error(
                        "COPY ERROR:",
                        error
                    );


                    alert(
                        "Copy failed. Please copy manually."
                    );

                }

            }
        );

    }

}


/* =====================================================
   API TEST HELPER
   ===================================================== */

async function testAPIConnection() {

    console.log(
        "Testing Voltica API..."
    );


    try {

        const response =
            await fetch(
                API_URL,
                {

                    method:
                        "OPTIONS",

                    cache:
                        "no-store"

                }
            );


        console.log(
            "API OPTIONS STATUS:",
            response.status
        );


        return true;

    }

    catch (error) {

        console.error(
            "API TEST FAILED:",
            error
        );


        return false;

    }

}


/* =====================================================
   ADMIN JS READY
   ===================================================== */

console.log(
    "✓ VOLTICA ADMIN PRODUCT MANAGER READY"
);

console.log(
    "✓ API:",
    API_URL
);
