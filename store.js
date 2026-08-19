/* =====================================================
   VOLTICA STORE
   DYNAMIC PRODUCT ENGINE
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* =================================================
           CHECK PRODUCT DATABASE
           ================================================= */

        if (
            typeof volticaProducts === "undefined"
        ) {

            console.error(
                "VOLTICA: products.js not loaded."
            );

            return;

        }


        if (
            !Array.isArray(volticaProducts)
        ) {

            console.error(
                "VOLTICA: volticaProducts is not an array."
            );

            return;

        }


        console.log(
            "VOLTICA: Products loaded:",
            volticaProducts.length
        );


        /* =================================================
           FIND STORE GRIDS
           ================================================= */

        const grids =
            document.querySelectorAll(
                ".store-product-grid"
            );


        if (!grids.length) {

            console.error(
                "VOLTICA: No product grids found."
            );

            return;

        }


        /*
         * Clear the hard-coded products.
         *
         * From now on products.js is the source
         * of truth.
         */

        grids.forEach(
            function (grid) {

                grid.innerHTML = "";

            }
        );


        /* =================================================
           CATEGORY → SECTION
           ================================================= */

        function getCategorySection(
            product
        ) {

            const category =
                String(
                    product.category || ""
                ).toLowerCase();


            if (
                category.includes("earbud") ||
                category.includes("audio") ||
                category.includes("sport")
            ) {

                return "earbuds";

            }


            if (
                category.includes("gaming")
            ) {

                return "gaming";

            }


            if (
                category.includes("creator")
            ) {

                return "creator";

            }


            if (
                category.includes("headphone")
            ) {

                return "headphones";

            }


            if (
                category.includes("tech")
            ) {

                return "tech";

            }


            if (
                category.includes("lifestyle")
            ) {

                return "lifestyle";

            }


            /*
             * Unknown category:
             * put it in TECH rather than hiding it.
             */

            return "tech";

        }


        /* =================================================
           GET GRID FOR SECTION
           ================================================= */

        function getGrid(
            sectionId
        ) {

            const section =
                document.getElementById(
                    sectionId
                );


            if (!section) {

                return null;

            }


            return section.querySelector(
                ".store-product-grid"
            );

        }


        /* =================================================
           ESCAPE HTML
           ================================================= */

        function escapeHTML(
            value
        ) {

            return String(
                value ?? ""
            )

                .replace(
                    /&/g,
                    "&amp;"
                )

                .replace(
                    /</g,
                    "&lt;"
                )

                .replace(
                    />/g,
                    "&gt;"
                )

                .replace(
                    /"/g,
                    "&quot;"
                )

                .replace(
                    /'/g,
                    "&#039;"
                );

        }


        /* =================================================
           CREATE PRODUCT CARD
           ================================================= */

        function createProductCard(
            product
        ) {

            const images =
                Array.isArray(
                    product.images
                )
                    ? product.images
                    : (
                        product.image
                            ? [product.image]
                            : []
                    );


            if (!images.length) {

                console.warn(
                    "VOLTICA: Product has no images:",
                    product.name
                );

            }


            const firstImage =
                images[0] ||
                "assets/images/placeholder.webp";


            const article =
                document.createElement(
                    "article"
                );


            article.className =
                "store-product";


            article.dataset.productId =
                product.id || "";


            article.innerHTML = `

                <div class="product-image">

                    <span class="product-badge">
                        ${escapeHTML(
                            product.badge || "NEW"
                        )}
                    </span>


                    <div class="product-main-photo">

                        <img
                            src="${escapeHTML(
                                firstImage
                            )}"
                            alt="${escapeHTML(
                                product.name
                            )}"
                            class="main-product-img"
                            loading="lazy">

                        <div class="image-scan"></div>

                        <div class="image-reflection"></div>

                    </div>


                    ${
                        images.length > 1
                            ? `

                        <div class="product-thumbnails">

                            ${images
                                .map(
                                    function (
                                        image,
                                        index
                                    ) {

                                        return `

                                            <button
                                                type="button"
                                                class="
                                                    product-thumb
                                                    ${
                                                        index === 0
                                                            ? "active"
                                                            : ""
                                                    }
                                                "
                                                data-image="${escapeHTML(
                                                    image
                                                )}"
                                                aria-label="
                                                    View image
                                                    ${
                                                        index + 1
                                                    }
                                                ">

                                                <img
                                                    src="${escapeHTML(
                                                        image
                                                    )}"
                                                    alt="${escapeHTML(
                                                        product.name
                                                    )} view ${
                                                        index + 1
                                                    }"
                                                    loading="lazy">

                                                <span>
                                                    ${
                                                        String(
                                                            index + 1
                                                        ).padStart(
                                                            2,
                                                            "0"
                                                        )
                                                    }
                                                </span>

                                            </button>

                                        `;

                                    }
                                )
                                .join("")}

                        </div>

                    `
                            : ""
                    }

                </div>


                <div class="product-info">

                    <div class="product-category">

                        VOLTICA /
                        ${escapeHTML(
                            product.category || ""
                        )}

                    </div>


                    <h3>
                        ${escapeHTML(
                            product.name
                        )}
                    </h3>


                    <p>
                        ${escapeHTML(
                            product.description || ""
                        )}
                    </p>


                    <div class="product-bottom">

                        <strong class="product-price">

                            $${escapeHTML(
                                product.price
                            )}

                            <small>
                                ${escapeHTML(
                                    product.currency || "USD"
                                )}
                            </small>

                        </strong>


                        <a
                            href="
                                product-view.html?id=${
                                    encodeURIComponent(
                                        product.id || ""
                                    )
                                }
                            "
                            class="product-button">

                            VIEW

                            <span>
                                →
                            </span>

                        </a>

                    </div>

                </div>

            `;


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


                            if (
                                mainImage.getAttribute(
                                    "src"
                                ) === newImage
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
                                160
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


            return article;

        }


        /* =================================================
           RENDER PRODUCTS
           ================================================= */

        volticaProducts.forEach(
            function (product) {

                if (!product) {

                    return;

                }


                const sectionId =
                    getCategorySection(
                        product
                    );


                const grid =
                    getGrid(
                        sectionId
                    );


                if (!grid) {

                    console.warn(
                        "VOLTICA: Section not found:",
                        sectionId,
                        product.name
                    );

                    return;

                }


                const card =
                    createProductCard(
                        product
                    );


                grid.appendChild(
                    card
                );


                console.log(
                    "VOLTICA: Product rendered:",
                    product.name,
                    "→",
                    sectionId
                );

            }
        );


        /* =================================================
           EMPTY COLLECTION HANDLING
           ================================================= */

        document
            .querySelectorAll(
                ".store-section"
            )
            .forEach(
                function (section) {

                    const grid =
                        section.querySelector(
                            ".store-product-grid"
                        );


                    if (
                        !grid ||
                        grid.children.length
                    ) {

                        return;

                    }


                    section.style.display =
                        "none";

                }
            );


        /* =================================================
           FINISHED
           ================================================= */

        console.log(
            "✓ VOLTICA STORE DYNAMIC ENGINE READY"
        );

    }
);
