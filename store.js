document.addEventListener("DOMContentLoaded", function () {

    const grid =
        document.getElementById("product-grid");

    if (
        !grid ||
        typeof volticaProducts === "undefined"
    ) {
        return;
    }


    /* =====================================================
       STORE PRODUCT RENDERER
       ===================================================== */

    grid.innerHTML = "";


    volticaProducts.forEach(function (product) {

        const images =
            Array.isArray(product.images) &&
            product.images.length
                ? product.images
                : [product.image];


        const article =
            document.createElement("article");

        article.className =
            "store-product";


        /* =================================================
           PRODUCT CARD
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
                        class="main-product-img"
                        loading="lazy">

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
                                aria-label="View image ${index + 1}">

                                <img
                                    src="${image}"
                                    alt="${product.name} view ${index + 1}"
                                    loading="lazy">

                                <span>
                                    ${String(index + 1).padStart(2, "0")}
                                </span>

                            </button>

                        `;

                    }).join("")}

                </div>

            </div>


            <div class="product-info">

                <div class="product-category">
                    ${product.category || "VOLTICA"}
                </div>


                <h3 class="store-product-title">
                    ${product.name}
                </h3>


                <p class="store-product-description">
                    ${product.description || ""}
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

                        <span>→</span>

                    </a>

                </div>

            </div>

        `;


        grid.appendChild(article);


        /* =================================================
           PRODUCT TITLE LIMIT
           ================================================= */

        const title =
            article.querySelector(
                ".store-product-title"
            );


        if (title) {

            title.style.display =
                "-webkit-box";

            title.style.webkitLineClamp =
                "2";

            title.style.webkitBoxOrient =
                "vertical";

            title.style.overflow =
                "hidden";

        }


        /* =================================================
           DESCRIPTION LIMIT
           ================================================= */

        const description =
            article.querySelector(
                ".store-product-description"
            );


        if (description) {

            description.style.display =
                "-webkit-box";

            description.style.webkitLineClamp =
                "2";

            description.style.webkitBoxOrient =
                "vertical";

            description.style.overflow =
                "hidden";

        }


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


        thumbnails.forEach(
            function (thumbnail) {

                thumbnail.addEventListener(
                    "click",
                    function () {

                        const newImage =
                            thumbnail.dataset.image;


                        if (
                            !newImage ||
                            !mainImage
                        ) {
                            return;
                        }


                        mainImage.style.opacity =
                            "0";


                        setTimeout(
                            function () {

                                mainImage.src =
                                    newImage;

                                mainImage.style.opacity =
                                    "1";

                            },
                            150
                        );


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

            }
        );

    });

});
