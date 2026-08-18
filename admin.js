/* =====================================================
   VOLTICA STORE
   ADMIN PRODUCT MANAGER
   admin.js — COMPLETE CLEAN VERSION
   ===================================================== */

const API_URL =
    "https://api.volticastore.com/api/admin-api.php";


/* =====================================================
   DOM ELEMENTS
   ===================================================== */

const imageInput =
    document.getElementById("productImages");

const imagePreview =
    document.getElementById("imagePreview");

const clearImagesButton =
    document.getElementById("clearImages");

const addProductButton =
    document.querySelector(".button-primary");


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

                    image.src =
                        URL.createObjectURL(file);

                    image.alt =
                        file.name;


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
        function (event) {

            event.preventDefault();

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

    return String(value || "")
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .replace(/\r?\n/g, "\\n");

}


/* =====================================================
   CREATE PRODUCT ID
   ===================================================== */

function createProductId(name) {

    return String(name || "")
        .toLowerCase()
        .replace(/^voltica\s*/i, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

}


/* =====================================================
   PARSE FEATURES
   ===================================================== */

function parseFeatures(text) {

    if (!text || !text.trim()) {
        return [];
    }


    return text
        .split(/\r?\n/)
        .map(
            line => line.trim()
        )
        .filter(Boolean)
        .map(
            function (line, index) {

                const parts =
                    line
                        .split("—")
                        .map(
                            part => part.trim()
                        );


                if (parts.length >= 3) {

                    return [
                        parts[0],
                        parts[1],
                        parts.slice(2).join(" — ")
                    ];

                }


                return [
                    String(index + 1).padStart(2, "0"),
                    parts[0] || "",
                    parts.slice(1).join(" — ")
                ];

            }
        );

}


/* =====================================================
   PARSE SPECIFICATIONS
   ===================================================== */

function parseSpecifications(text) {

    if (!text || !text.trim()) {
        return [];
    }


    return text
        .split(/\r?\n/)
        .map(
            line => line.trim()
        )
        .filter(Boolean)
        .map(
            function (line) {

                const separator =
                    line.indexOf(":");


                if (separator === -1) {

                    return [
                        line,
                        ""
                    ];

                }


                return [

                    line
                        .substring(0, separator)
                        .trim(),

                    line
                        .substring(separator + 1)
                        .trim()

                ];

            }
        );

}


/* =====================================================
   GET FORM VALUE
   ===================================================== */

function getValue(id) {

    const element =
        document.getElementById(id);


    if (!element) {
        return "";
    }


    return String(
        element.value || ""
    ).trim();

}


/* =====================================================
   GET PRODUCT IMAGES
   ===================================================== */

function getProductImages() {

    if (
        !imageInput ||
        !imageInput.files ||
        !imageInput.files.length
    ) {

        return [];

    }


    return Array.from(
        imageInput.files
    );

}


/* =====================================================
   GENERATE PRODUCT
   ===================================================== */

function generateProduct() {

    const name =
        getValue("productName");


    const volticaSku =
        getValue("productSku");


    const cjSku =
        getValue("cjSku");


    const category =
        getValue("category");


    const cost =
        getValue("cost");


    const price =
        getValue("price");


    const description =
        getValue("description");


    const featuresText =
        document.getElementById(
            "features"
        )?.value || "";


    const specificationsText =
        document.getElementById(
            "specifications"
        )?.value || "";


    /* -------------------------------------------------
       VALIDATION
       ------------------------------------------------- */

    if (!name) {

        alert(
            "Please enter a Product Name."
        );

        return null;

    }


    if (!volticaSku) {

        alert(
            "Please enter the Voltica SKU."
        );

        return null;

    }


    if (!category) {

        alert(
            "Please select a Category."
        );

        return null;

    }


    if (!price) {

        alert(
            "Please enter the Voltica Price."
        );

        return null;

    }


    /* -------------------------------------------------
       PRODUCT DATA
       ------------------------------------------------- */

    const productId =
        createProductId(name);


    const images =
        getProductImages();


    const features =
        parseFeatures(
            featuresText
        );


    const specifications =
        parseSpecifications(
            specificationsText
        );


    /* -------------------------------------------------
       IMAGE PATHS
       ------------------------------------------------- */

    const imagePaths =
        images.map(
            function (file) {

                return (
                    "assets/images/" +
                    file.name
                );

            }
        );


    /* -------------------------------------------------
       PRODUCT OBJECT
       ------------------------------------------------- */

    const productObject = {

        id: productId,

        sku: volticaSku,

        cjSku: cjSku,

        name: name,

        category: category,

        badge: "NEW",

        price: price,

        currency: "USD",

        images: imagePaths,

        description: description,

        features: features,

        specifications: specifications,

        cost: cost

    };


    /* -------------------------------------------------
       PRODUCT JAVASCRIPT BLOCK
       ------------------------------------------------- */

    const productCode = `
// =================================================
// PRODUCT XX — ${name.toUpperCase()}
// =================================================

{
    id: "${escapeJS(productObject.id)}",
    sku: "${escapeJS(productObject.sku)}",
    cjSku: "${escapeJS(productObject.cjSku)}",
    name: "${escapeJS(productObject.name)}",
    category: "${escapeJS(productObject.category)}",
    badge: "NEW",

    price: "${escapeJS(productObject.price)}",
    currency: "USD",

    images: [
${imagePaths
    .map(
        image =>
            `        "${escapeJS(image)}"`
    )
    .join(",\n")}
    ],

    description:
        "${escapeJS(productObject.description)}",

    features: [
${features
    .map(
        feature =>
            `        ["${escapeJS(feature[0])}", "${escapeJS(feature[1])}", "${escapeJS(feature[2])}"]`
    )
    .join(",\n")}
    ],

    specifications: [
${specifications
    .map(
        spec =>
            `        ["${escapeJS(spec[0])}", "${escapeJS(spec[1])}"]`
    )
    .join(",\n")}
    ]
},`;


    return {

        productCode:
            productCode,

        productObject:
            productObject,

        images:
            images

    };

}


/* =====================================================
   ADMIN PASSWORD
   ===================================================== */

function askAdminPassword() {

    return new Promise(
        function (resolve) {

            const overlay =
                document.createElement("div");


            overlay.style.cssText = `
                position:fixed;
                inset:0;
                z-index:999999;
                display:flex;
                align-items:center;
                justify-content:center;
                background:rgba(0,0,0,.88);
                backdrop-filter:blur(20px);
                padding:20px;
                box-sizing:border-box;
            `;


            overlay.innerHTML = `

                <div style="
                    width:100%;
                    max-width:430px;
                    background:#111318;
                    border:1px solid rgba(255,255,255,.14);
                    border-radius:22px;
                    padding:28px;
                    box-shadow:0 25px 80px rgba(0,0,0,.65);
                    color:white;
                    box-sizing:border-box;
                ">

                    <div style="
                        font-size:11px;
                        letter-spacing:.18em;
                        opacity:.55;
                        margin-bottom:10px;
                    ">
                        VOLTICA STORE
                    </div>

                    <h2 style="
                        margin:0 0 8px;
                        font-size:24px;
                    ">
                        Admin Authentication
                    </h2>

                    <p style="
                        margin:0 0 22px;
                        color:#aaa;
                        font-size:14px;
                    ">
                        Enter your administrator password.
                    </p>

                    <input
                        id="volticaAdminPassword"
                        type="password"
                        autocomplete="current-password"
                        placeholder="Admin password"
                        style="
                            width:100%;
                            box-sizing:border-box;
                            padding:15px;
                            border-radius:12px;
                            border:1px solid rgba(255,255,255,.15);
                            background:#050608;
                            color:white;
                            outline:none;
                            margin-bottom:14px;
                        "
                    >

                    <div style="
                        display:flex;
                        gap:10px;
                    ">

                        <button
                            type="button"
                            id="cancelAdminPassword"
                            style="
                                flex:1;
                                padding:14px;
                                border-radius:12px;
                                border:1px solid rgba(255,255,255,.15);
                                background:rgba(255,255,255,.06);
                                color:white;
                                font-weight:700;
                            "
                        >
                            CANCEL
                        </button>

                        <button
                            type="button"
                            id="confirmAdminPassword"
                            style="
                                flex:1;
                                padding:14px;
                                border-radius:12px;
                                border:0;
                                background:white;
                                color:#050505;
                                font-weight:800;
                            "
                        >
                            AUTHENTICATE
                        </button>

                    </div>

                </div>
            `;


            document.body.appendChild(
                overlay
            );


            const passwordInput =
                overlay.querySelector(
                    "#volticaAdminPassword"
                );


            const confirmButton =
                overlay.querySelector(
                    "#confirmAdminPassword"
                );


            const cancelButton =
                overlay.querySelector(
                    "#cancelAdminPassword"
                );


            passwordInput.focus();


            confirmButton.addEventListener(
                "click",
                function () {

                    const password =
                        passwordInput.value.trim();


                    overlay.remove();

                    resolve(password);

                }
            );


            cancelButton.addEventListener(
                "click",
                function () {

                    overlay.remove();

                    resolve(null);

                }
            );


            passwordInput.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter"
                    ) {

                        confirmButton.click();

                    }


                    if (
                        event.key === "Escape"
                    ) {

                        cancelButton.click();

                    }

                }
            );

        }
    );

}


/* =====================================================
   PUBLISH PRODUCT TO PHP API
   ===================================================== */

async function publishProduct(
    password,
    productCode,
    images
) {

    const formData =
        new FormData();


    /* -------------------------------------------------
       PASSWORD
       ------------------------------------------------- */

    formData.append(
        "password",
        password
    );


    /* -------------------------------------------------
       PRODUCT
       ------------------------------------------------- */

    formData.append(
        "product",
        productCode
    );


    /* -------------------------------------------------
       IMAGES
       ------------------------------------------------- */

    images.forEach(
        function (file) {

            formData.append(
                "images[]",
                file,
                file.name
            );

        }
    );


    console.log(
        "Sending product to:",
        API_URL
    );


    console.log(
        "Product data length:",
        productCode.length
    );


    console.log(
        "Images:",
        images.length
    );


    /* -------------------------------------------------
       API REQUEST
       ------------------------------------------------- */

    try {

        const response =
            await fetch(
                API_URL,
                {
                    method: "POST",
                    body: formData
                }
            );


        const rawResponse =
            await response.text();


        console.log(
            "VOLTICA API RAW RESPONSE:",
            rawResponse
        );


        let result;


        try {

            result =
                JSON.parse(
                    rawResponse
                );

        } catch (jsonError) {

            throw new Error(
                "API returned invalid JSON:\n\n" +
                rawResponse
            );

        }


        if (
            !response.ok ||
            !result.success
        ) {

            throw new Error(
                result.error ||
                "Product publication failed."
            );

        }


        return result;


    } catch (error) {

        console.error(
            "VOLTICA API ERROR:",
            error
        );

        throw error;

    }

}


/* =====================================================
   SUCCESS MODAL
   ===================================================== */

function showSuccess(result) {

    const message =
        document.createElement("div");


    message.style.cssText = `
        position:fixed;
        inset:0;
        z-index:999999;
        display:flex;
        align-items:center;
        justify-content:center;
        background:rgba(0,0,0,.88);
        backdrop-filter:blur(18px);
        padding:20px;
        box-sizing:border-box;
    `;


    message.innerHTML = `

        <div style="
            width:100%;
            max-width:520px;
            background:#111318;
            border:1px solid rgba(0,255,140,.25);
            border-radius:22px;
            padding:30px;
            color:white;
            box-shadow:0 30px 90px rgba(0,0,0,.7);
            text-align:center;
            box-sizing:border-box;
        ">

            <div style="
                font-size:42px;
                margin-bottom:12px;
            ">
                ✓
            </div>

            <h2 style="
                margin:0 0 10px;
            ">
                PRODUCT PUBLISHED
            </h2>

            <p style="
                color:#aaa;
                line-height:1.6;
                margin-bottom:22px;
            ">
                The product and images were successfully
                sent to the Voltica Store API.
            </p>

            <button
                type="button"
                id="closeSuccessModal"
                style="
                    width:100%;
                    padding:15px;
                    border:0;
                    border-radius:12px;
                    background:white;
                    color:#050505;
                    font-weight:800;
                "
            >
                DONE
            </button>

        </div>
    `;


    document.body.appendChild(
        message
    );


    message
        .querySelector(
            "#closeSuccessModal"
        )
        .addEventListener(
            "click",
            function () {

                message.remove();

            }
        );

}


/* =====================================================
   ADD PRODUCT
   ===================================================== */

if (addProductButton) {

    addProductButton.addEventListener(
        "click",
        async function (event) {

            event.preventDefault();


            const originalText =
                this.textContent;


            try {

                /* -----------------------------------------
                   GENERATE PRODUCT
                   ----------------------------------------- */

                const generated =
                    generateProduct();


                if (!generated) {
                    return;
                }


                /* -----------------------------------------
                   PASSWORD
                   ----------------------------------------- */

                const password =
                    await askAdminPassword();


                if (!password) {
                    return;
                }


                /* -----------------------------------------
                   BUTTON STATE
                   ----------------------------------------- */

                this.disabled = true;

                this.textContent =
                    "PUBLISHING...";


                /* -----------------------------------------
                   PUBLISH
                   ----------------------------------------- */

                const result =
                    await publishProduct(
                        password,
                        generated.productCode,
                        generated.images
                    );


                console.log(
                    "PUBLISH SUCCESS:",
                    result
                );


                /* -----------------------------------------
                   SUCCESS
                   ----------------------------------------- */

                showSuccess(
                    result
                );


            } catch (error) {

                console.error(
                    "PUBLISH ERROR:",
                    error
                );


                alert(
                    "PRODUCT PUBLISH FAILED\n\n" +
                    error.message
                );


            } finally {

                this.disabled = false;

                this.textContent =
                    originalText;

            }

        }
    );

}


/* =====================================================
   READY
   ===================================================== */

console.log(
    "✓ VOLTICA admin.js loaded"
);

console.log(
    "✓ API:",
    API_URL
);
