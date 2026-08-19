/* =====================================================
   VOLTICA STORE
   ADMIN PRODUCT MANAGER
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
   ESCAPE PRODUCT DATA
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

        .replace(
            /^voltica\s*/i,
            ""
        )

        .replace(
            /[^a-z0-9]+/g,
            "-"
        )

        .replace(
            /^-+|-+$/g,
            ""
        );

}


/* =====================================================
   PARSE FEATURES
   ===================================================== */

function parseFeatures(text) {

    if (!text.trim()) {

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
            function (line, index) {

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

    if (!text.trim()) {

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
        !imageInput.files.length
    ) {

        return [];

    }


    return Array

        .from(
            imageInput.files
        )

        .map(
            file =>
                "assets/images/" +
                file.name
        );

}


/* =====================================================
   GENERATE PRODUCT
   ===================================================== */

function generateProduct() {

    const name =
        document
            .getElementById("productName")
            .value
            .trim();


    const category =
        document
            .getElementById("category")
            .value
            .trim();


    const supplierLink =
        document
            .getElementById("supplierLink")
            .value
            .trim();


    const cjSku =
        document
            .getElementById("cjSku")
            .value
            .trim();


    const cost =
        document
            .getElementById("cost")
            .value
            .trim();


    const price =
        document
            .getElementById("price")
            .value
            .trim();


    const description =
        document
            .getElementById("description")
            .value
            .trim();


    const featuresText =
        document
            .getElementById("features")
            .value;


    const specificationsText =
        document
            .getElementById("specifications")
            .value;


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


    if (!cjSku) {

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
       PRODUCT BLOCK
       ================================================= */

    return `
// =================================================
// PRODUCT XX — ${name.toUpperCase()}
// =================================================

{
    id: "${escapeJS(productId)}",

    name: "${escapeJS(name)}",

    category: "${escapeJS(category)}",

    badge: "NEW",

    supplierLink:
        "${escapeJS(supplierLink)}",

    cjSku:
        "${escapeJS(cjSku)}",

    cost:
        "${escapeJS(cost)}",

    price:
        "${escapeJS(price)}",

    currency: "USD",

    images: [
${images
    .map(
        image =>
            `        "${escapeJS(image)}"`
    )
    .join(",\n")}
    ],

    description:
        "${escapeJS(description)}",

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

}


/* =====================================================
   PUBLISH PRODUCT
   ===================================================== */

async function publishProduct(
    password,
    product
) {

    const formData =
        new FormData();


    /* =================================================
       PASSWORD
       ================================================= */

    formData.append(
        "password",
        password
    );


    /* =================================================
       PRODUCT
       ================================================= */

    formData.append(
        "product",
        product
    );


    /* =================================================
       IMAGES
       ================================================= */

    if (
        imageInput &&
        imageInput.files.length
    ) {

        Array
            .from(imageInput.files)
            .forEach(
                function (file) {

                    formData.append(
                        "images[]",
                        file,
                        file.name
                    );

                }
            );

    }


    /* =================================================
       SEND API REQUEST
       ================================================= */

    try {

        const response =
            await fetch(
                API_URL,
                {
                    method: "POST",
                    body: formData
                }
            );


        const result =
            await response.json();


        console.log(
            "VOLTICA API RESPONSE:",
            result
        );


        if (
            !response.ok ||
            !result.success
        ) {

            alert(

                "PUBLISH FAILED\n\n" +

                (
                    result.error ||
                    "Unknown API error"
                )

            );

            return false;

        }


        alert(

            "🔥 PRODUCT PUBLISHED!\n\n" +

            "✓ GitHub updated\n" +

            "✓ products.js updated\n" +

            "✓ Images uploaded"

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

            /* -----------------------------------------
               GENERATE PRODUCT
               ----------------------------------------- */

            const product =
                generateProduct();


            if (!product) {

                return;

            }


            /* -----------------------------------------
               PASSWORD
               ----------------------------------------- */

            const password =
                await authenticateAPI();


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

            const published =
                await publishProduct(
                    password,
                    product
                );


            /* -----------------------------------------
               SUCCESS
               ----------------------------------------- */

            if (published) {

                showGeneratedProduct(
                    product
                );

            }


            /* -----------------------------------------
               RESTORE BUTTON
               ----------------------------------------- */

            this.disabled = false;

            this.textContent =
                "ADD PRODUCT";

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

                justify-content:
                    space-between;

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


    const textarea =
        document.getElementById(
            "generatedProductText"
        );


    if (textarea) {

        textarea.value =
            product;

    }


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

                            copyButton.textContent =
                                "COPY PRODUCT BLOCK";

                        },
                        1800
                    );

                }

                catch (error) {

                    alert(
                        "Copy failed. Please copy manually."
                    );

                }

            }
        );

    }

}


/* =====================================================
   ADMIN JS READY
   ===================================================== */

console.log(
    "✓ VOLTICA ADMIN PRODUCT MANAGER READY"
);
