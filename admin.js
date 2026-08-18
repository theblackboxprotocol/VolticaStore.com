/* =====================================================
   VOLTICA STORE
   ADMIN PRODUCT API
   ===================================================== */

const API_URL =
    "https://api.volticastore.com/api/admin-api.php";


/* =====================================================
   PUBLISH PRODUCT
   ===================================================== */

async function publishProduct(
    password,
    product
) {

    const formData =
        new FormData();


    /* -------------------------------------------------
       ADMIN PASSWORD
       ------------------------------------------------- */

    formData.append(
        "password",
        password
    );


    /* -------------------------------------------------
       PRODUCT DATA
       ------------------------------------------------- */

    formData.append(
        "product",
        product
    );


    /* -------------------------------------------------
       PRODUCT IMAGES
       ------------------------------------------------- */

    const imageInput =
        document.getElementById(
            "productImages"
        );


    if (
        imageInput &&
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


    /* -------------------------------------------------
       SEND TO PHP
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
