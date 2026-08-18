/* =====================================================
   VOLTICA STORE
   ADMIN PRODUCT MANAGER
   COMPLETE VERSION
   ===================================================== */


/* =====================================================
   API CONFIGURATION
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

if (imageInput && imagePreview) {

    imageInput.addEventListener(
        "change",
        function () {

            imagePreview.innerHTML = "";

            const files =
                Array.from(this.files);


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


            files.forEach(function (file) {

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

            });

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
   ESCAPE JAVASCRIPT
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

    return name
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
        .map(line => line.trim())
        .filter(Boolean)
        .map(function (line, index) {

            const parts =
                line
                    .split("—")
                    .map(part => part.trim());


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

        });

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
        .map(line => line.trim())
        .filter(Boolean)
        .map(function (line) {

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

        });

}


/* =====================================================
   GET IMAGE PATHS
   ===================================================== */

function getImagePaths() {

    if (
        !imageInput ||
        !imageInput.files.length
    ) {

        return [];

    }


    return Array
        .from(imageInput.files)
        .map(function (file) {

            return (
                "assets/images/" +
                file.name
            );

        });

}


/* =====================================================
   GENERATE PRODUCT BLOCK
   ===================================================== */

function generateProduct() {

    const name =
        document
            .getElementById("productName")
            ?.value
            .trim() || "";


    const volticaSku =
        document
            .getElementById("productSku")
            ?.value
            .trim() || "";


    const cjSku =
        document
            .getElementById("cjSku")
            ?.value
            .trim() || "";


    const category =
        document
            .getElementById("category")
            ?.value
            .trim() || "";


    const cost =
        document
            .getElementById("cost")
            ?.value
            .trim() || "";


    const price =
        document
            .getElementById("price")
            ?.value
            .trim() || "";


    const description =
        document
            .getElementById("description")
            ?.value
            .trim() || "";


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


    /* =================================================
       PRODUCT DATA
       ================================================= */

    const productId =
        createProductId(name);


    const images =
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
       BUILD PRODUCTS.JS BLOCK
       ================================================= */

    const product = `
// =================================================
// PRODUCT XX — ${escapeJS(name).toUpperCase()}
// =================================================

{
    id: "${escapeJS(productId)}",

    sku: "${escapeJS(volticaSku)}",

    cjSku: "${escapeJS(cjSku)}",

    name: "${escapeJS(name)}",

    category: "${escapeJS(category)}",

    badge: "NEW",

    price: "${escapeJS(price)}",

    currency: "USD",

    images: [
${images
    .map(function (image) {

        return (
            `        "${escapeJS(image)}"`
        );

    })
    .join(",\n")}
    ],

    description:
        "${escapeJS(description)}",

    features: [
${features
    .map(function (feature) {

        return (
            `        ["${escapeJS(feature[0])}", "${escapeJS(feature[1])}", "${escapeJS(feature[2])}"]`
        );

    })
    .join(",\n")}
    ],

    specifications: [
${specifications
    .map(function (spec) {

        return (
            `        ["${escapeJS(spec[0])}", "${escapeJS(spec[1])}"]`
        );

    })
    .join(",\n")}
    ]
},`;


    return product;

}


/* =====================================================
   ADMIN PASSWORD
   ===================================================== */

function askAdminPassword() {

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
   PUBLISH PRODUCT TO PHP API
   ===================================================== */

async function publishProduct(
    password,
    product
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
console.log("PRODUCT SENT TO PHP:", product);
    formData.append(
        "product",
        product
    );


    /* -------------------------------------------------
       IMAGES
       ------------------------------------------------- */

    if (
        imageInput &&
        imageInput.files.length
    ) {

        Array
            .from(imageInput.files)
            .forEach(function (file) {

                formData.append(
                    "images[]",
                    file,
                    file.name
                );

            });

    }


    /* -------------------------------------------------
       SEND
       ------------------------------------------------- */

    try {

        console.log(
            "VOLTICA: Sending product to API..."
        );


        const response =
            await fetch(
                API_URL,
                {
                    method: "POST",
                    body: formData
                }
            );


        const text =
            await response.text();


        console.log(
            "VOLTICA RAW API RESPONSE:",
            text
        );


        let result;


        try {

            result =
                JSON.parse(text);

        } catch (jsonError) {

            alert(
                "API ERROR\n\n" +
                "The server did not return valid JSON.\n\n" +
                text
            );

            return false;

        }


        console.log(
            "VOLTICA API RESPONSE:",
            result
        );


        /* -------------------------------------------------
           API ERROR
           ------------------------------------------------- */

        if (
            !response.ok ||
            !result.success
        ) {

            alert(
                "PUBLISH FAILED\n\n" +
                (
                    result.error ||
                    "Unknown API error."
                )
            );

            return false;

        }


        /* -------------------------------------------------
           SUCCESS
           ------------------------------------------------- */

        alert(
            "🔥 PRODUCT PUBLISHED!\n\n" +
            "✓ Admin authenticated\n" +
            "✓ GitHub repository updated\n" +
            "✓ products.js updated\n" +
            "✓ Images uploaded"
        );


        console.log(
            "Repository:",
            result.repository
        );


        console.log(
            "Products file:",
            result.products_file
        );


        console.log(
            "Uploaded images:",
            result.uploaded_images
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
            error.message
        );


        return false;

    }

}


/* =====================================================
   ADD PRODUCT BUTTON
   ===================================================== */

if (addProductButton) {

    addProductButton.addEventListener(
        "click",
        async function (event) {

            event.preventDefault();


            /* -------------------------------------------------
               DISABLE BUTTON
               ------------------------------------------------- */

            this.disabled = true;

            const originalText =
                this.textContent;

            this.textContent =
                "AUTHENTICATING...";


            try {

                /* ---------------------------------------------
                   GENERATE PRODUCT
                   --------------------------------------------- */

                const product =
                    generateProduct();


                if (!product) {

                    return;

                }


                /* ---------------------------------------------
                   ASK PASSWORD
                   --------------------------------------------- */

                const password =
                    askAdminPassword();


                if (!password) {

                    return;

                }


                /* ---------------------------------------------
                   PUBLISH
                   --------------------------------------------- */

                this.textContent =
                    "PUBLISHING...";


                const success =
                    await publishProduct(
                        password,
                        product
                    );


                /* ---------------------------------------------
                   SHOW GENERATED PRODUCT
                   --------------------------------------------- */

                if (success) {

                    showGeneratedProduct(
                        product
                    );

                }

            }


            finally {

                this.disabled = false;

                this.textContent =
                    originalText;

            }

        }
    );

}


/* =====================================================
   SHOW GENERATED PRODUCT
   ===================================================== */

function showGeneratedProduct(product) {

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
        position:fixed;
        inset:0;
        z-index:999999;
        background:rgba(0,0,0,.92);
        backdrop-filter:blur(20px);
        padding:20px;
        overflow:auto;
    `;


    modal.innerHTML = `

        <div style="
            max-width:900px;
            margin:20px auto;
            background:#111318;
            border:1px solid rgba(255,255,255,.12);
            border-radius:20px;
            padding:20px;
            color:white;
        ">

            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
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
                        background:rgba(255,255,255,.06);
                        border:1px solid rgba(255,255,255,.15);
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
                background:rgba(0,255,140,.08);
                border:1px solid rgba(0,255,140,.20);
                color:#9fffc8;
                font-weight:600;
            ">
                ✓ PRODUCT SUCCESSFULLY SENT TO GITHUB
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
                    border:1px solid rgba(255,255,255,.1);
                    border-radius:14px;
                    padding:16px;
                    font-family:monospace;
                    font-size:12px;
                    line-height:1.6;
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
                COPY TO CLIPBOARD
            </button>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    const textarea =
        document.getElementById(
            "generatedProductText"
        );


    textarea.value =
        product;


    /* =================================================
       CLOSE
       ================================================= */

    document
        .getElementById(
            "closeGeneratedProduct"
        )
        .addEventListener(
            "click",
            function () {

                modal.remove();

            }
        );


    /* =================================================
       COPY
       ================================================= */

    document
        .getElementById(
            "copyGeneratedProduct"
        )
        .addEventListener(
            "click",
            async function () {

                try {

                    await navigator
                        .clipboard
                        .writeText(
                            product
                        );


                    this.textContent =
                        "✓ COPIED";


                    setTimeout(
                        () => {

                            this.textContent =
                                "COPY TO CLIPBOARD";

                        },
                        1800
                    );

                }


                catch (error) {

                    textarea.select();

                    document.execCommand(
                        "copy"
                    );

                    this.textContent =
                        "✓ COPIED";

                }

            }
        );

}


/* =====================================================
   INITIALIZATION CHECK
   ===================================================== */

console.log(
    "✓ VOLTICA ADMIN PRODUCT MANAGER LOADED"
);


console.log(
    "API:",
    API_URL
);


console.log(
    "Image input:",
    imageInput ? "OK" : "MISSING"
);


console.log(
    "Add Product button:",
    addProductButton ? "OK" : "MISSING"
);


console.log(
    "Clear Images button:",
    clearImagesButton ? "OK" : "MISSING"
);
