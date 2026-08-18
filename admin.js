/* =====================================================
   VOLTICA STORE
   ADMIN PRODUCT MANAGER
   GITHUB PUBLISHER
   ===================================================== */

const API_URL =
    "https://api.volticastore.com/api/admin-api.php";


/* =====================================================
   PUBLISH PRODUCT
   ===================================================== */

async function publishProduct(password, product) {

    const formData = new FormData();

    formData.append(
        "password",
        password
    );

    formData.append(
        "product",
        product
    );


    /* =================================================
       IMAGES
       ================================================= */

    const imageInput =
        document.getElementById(
            "productImages"
        );


    if (
        imageInput &&
        imageInput.files &&
        imageInput.files.length
    ) {

        Array.from(
            imageInput.files
        ).forEach(function(file) {

            formData.append(
                "images[]",
                file,
                file.name
            );

        });

    }


    /* =================================================
       SEND
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


        const text =
            await response.text();


        console.log(
            "VOLTICA RAW API RESPONSE:",
            text
        );
/* =====================================================
   IMAGE PREVIEW
   ===================================================== */

const imageInput =
    document.getElementById("productImages");

const imagePreview =
    document.getElementById("imagePreview");


if (imageInput && imagePreview) {

    imageInput.addEventListener(
        "change",
        function() {

            imagePreview.innerHTML = "";

            const files =
                Array.from(this.files);


            if (!files.length) {
                return;
            }


            files.forEach(function(file) {

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

        let result;


        try {

            result =
                JSON.parse(text);

        } catch (error) {

            alert(
                "API RETURNED INVALID RESPONSE\n\n" +
                text
            );

            return false;

        }


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
            "✓ Images uploaded\n\n" +
            "Repository:\n" +
            result.repository
        );


        console.log(
            "Uploaded images:",
            result.uploaded_images
        );


        return true;


    } catch (error) {

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
   GET ADMIN PASSWORD
   ===================================================== */

async function requestAdminPassword() {

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
   GENERATE PRODUCT
   ===================================================== */

function generateProduct() {

    const name =
        document
            .getElementById("productName")
            ?.value
            .trim();


    const sku =
        document
            .getElementById("productSku")
            ?.value
            .trim();


    const cjSku =
        document
            .getElementById("cjSku")
            ?.value
            .trim();


    const category =
        document
            .getElementById("category")
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


    const description =
        document
            .getElementById("description")
            ?.value
            .trim();


    const features =
        document
            .getElementById("features")
            ?.value
            .trim();


    const specifications =
        document
            .getElementById("specifications")
            ?.value
            .trim();


    if (!name) {

        alert(
            "Please enter a Product Name."
        );

        return null;

    }


    if (!sku) {

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
       PRODUCT ID
       ================================================= */

    const productId =
        name
            .toLowerCase()
            .replace(/^voltica\s*/i, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");


    /* =================================================
       IMAGES
       ================================================= */

    const imageInput =
        document.getElementById(
            "productImages"
        );


    const images =
        imageInput &&
        imageInput.files
            ? Array.from(
                imageInput.files
            ).map(function(file) {

                return (
                    "assets/images/" +
                    file.name
                );

            })
            : [];


    /* =================================================
       FEATURES
       ================================================= */

    const featureArray =
        features
            ? features
                .split(/\r?\n/)
                .map(function(line) {

                    return line
                        .trim();

                })
                .filter(Boolean)
            : [];


    /* =================================================
       SPECIFICATIONS
       ================================================= */

    const specificationArray =
        specifications
            ? specifications
                .split(/\r?\n/)
                .map(function(line) {

                    return line
                        .trim();

                })
                .filter(Boolean)
            : [];


    /* =================================================
       CREATE PRODUCT BLOCK
       ================================================= */

    return `
// =================================================
// PRODUCT XX — ${name.toUpperCase()}
// =================================================

{
    id: "${productId}",
    sku: "${sku}",
    cjSku: "${cjSku}",
    name: "${name}",
    category: "${category}",
    badge: "NEW",

    price: "${price}",
    currency: "USD",

    images: [
${images
    .map(function(image) {

        return `        "${image}"`;

    })
    .join(",\n")}
    ],

    description:
        "${description}",

    features:
        ${JSON.stringify(featureArray)},

    specifications:
        ${JSON.stringify(specificationArray)}
},`;

}


/* =====================================================
   ADD PRODUCT BUTTON
   ===================================================== */

const addProductButton =
    document.querySelector(
        ".button-primary"
    );


if (addProductButton) {

    addProductButton.addEventListener(
        "click",
        async function(event) {

            event.preventDefault();


            const product =
                generateProduct();


            if (!product) {

                return;

            }


            const password =
                await requestAdminPassword();


            if (!password) {

                return;

            }


            this.disabled = true;

            const originalText =
                this.textContent;


            this.textContent =
                "PUBLISHING...";


            try {

                await publishProduct(
                    password,
                    product
                );

            } finally {

                this.disabled = false;

                this.textContent =
                    originalText ||
                    "ADD PRODUCT";

            }

        }
    );

}


/* =====================================================
   CLEAR IMAGES
   ===================================================== */

const clearImagesButton =
    document.getElementById(
        "clearImages"
    );


if (clearImagesButton) {

    clearImagesButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();


            const imageInput =
                document.getElementById(
                    "productImages"
                );


            const imagePreview =
                document.getElementById(
                    "imagePreview"
                );


            if (imageInput) {

                imageInput.value = "";

            }


            if (imagePreview) {

                imagePreview.innerHTML = "";

            }

        }
    );

}


console.log(
    "✓ VOLTICA ADMIN.JS LOADED"
);

console.log(
    "✓ API:",
    API_URL
);
