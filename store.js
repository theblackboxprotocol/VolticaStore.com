/* =====================================================
   VOLTICA STORE
   DYNAMIC PRODUCT RENDERER
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const grid =
        document.getElementById("product-grid");

    if (
        !grid ||
        typeof volticaProducts === "undefined"
    ) {
        return;
    }


    /* =================================================
       CLEAR STATIC PRODUCTS
       ================================================= */

    grid.innerHTML = "";


    /* =================================================
       RENDER PRODUCTS
       ================================================= */

    volticaProducts.forEach(function (product) {

        const images =
            product.images ||
            [product.image];


        const article =
            document.createElement("article");

        article.className =
            "store-product";


        /* =================================================
           SHORT DESCRIPTION
        ================================================= */

        let shortDescription =
            product.description || "";


        /*
         * Keep the store card clean.
         * Full description remains available
         * on product-view.html.
         */

        if (shortDescription.length > 115) {

            shortDescription =
                shortDescription.substring(
                    0,
                    115
                ).trim() + "…";

        }


        /* =================================================
           PRODUCT HTML
        ================================================= */

        article.innerHTML = `

            <div class="product-image">

                <span class="product-badge">
                    ${product.badge || "NEW"}
                </span>


                <div class="product-main-photo">

                    <img
                        src="${images[0]}"
                        alt="${product.name}"
                        class="main-product-img">

                    <div class="image-scan"></div>

                </div>


                <div class="product-thumbnails">

                    ${images.map(function (image, index) {

                        return `

                            <button
                                type="button"
                                class="product-thumb ${
                                    index === 0
                                        ? "active"
                                        : ""
                                }"
                                data-image="${image}"
                                aria-label="View image ${
                                    index + 1
                                }">

                                <img
                                    src="${image}"
                                    alt="${product.name} view ${
                                        index + 1
                                    }">

                                <span>
                                    ${String(
                                        index + 1
                                    ).padStart(2, "0")}
                                </span>

                            </button>

                        `;

                    }).join("")}

                </div>

            </div>


            <div class="product-info">

                <div class="product-category">
                    ${product.category || ""}
                </div>


                <h3>
                    ${product.name}
                </h3>


                <p>
                    ${shortDescription}
                </p>


                <div class="product-bottom">

                    <strong class="product-price">

                        $${product.price}

                        <small>
                            ${product.currency || "USD"}
                        </small>

                    </strong>


                    <a
                        href="product-view.html?id=${product.id}"
                        class="product-button">

                        VIEW

                        <span>
                            →
                        </span>

                    </a>

                </div>

            </div>

        `;


        grid.appendChild(article);


        /* =================================================
           PRODUCT GALLERY
        ================================================= */

        const mainImage =
            article.querySelector(
                ".main-product-img"
            );


        const thumbnails =
            article.querySelectorAll(
                ".product-thumb"
            );


        thumbnails.forEach(function (thumbnail) {

            thumbnail.addEventListener(
                "click",
                function () {

                    const newImage =
                        thumbnail.dataset.image;


                    if (
                        mainImage.src.endsWith(
                            newImage
                        )
                    ) {
                        return;
                    }


                    /* Fade out */

                    mainImage.style.opacity =
                        "0";


                    setTimeout(function () {

                        mainImage.src =
                            newImage;

                        mainImage.style.opacity =
                            "1";

                    }, 160);


                    /* Active thumbnail */

                    thumbnails.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    thumbnail.classList.add(
                        "active"
                    );

                }
            );

        });

    });

});
