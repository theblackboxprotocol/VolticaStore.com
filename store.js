/* ============================================================
   VOLTICA STORE — STORE ENGINE
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";


    /* =========================================================
       VOLTICA STORE — ENGINE START
       ========================================================= */

    console.log(
        "%cVOLTICA STORE ENGINE",
        "font-weight:bold;font-size:18px;"
    );


    /* =========================================================
       CHECK DATABASE
       ========================================================= */

    if (
        typeof volticaProducts === "undefined" ||
        !Array.isArray(volticaProducts)
    ) {

        console.error(
            "VOLTICA STORE: products.js was not loaded."
        );

        return;
    }


    console.log(
        "VOLTICA STORE: Product database detected.",
        volticaProducts.length,
        "products found."
    );


    /* =========================================================
       CATEGORY → STORE SECTION
       ========================================================= */

    const categoryMap = {

        /* AUDIO */

        "SPORT AUDIO": "earbuds",

        "WIRELESS AUDIO": "earbuds",

        "OPEN-EAR AUDIO": "earbuds",

        "EARBUDS": "earbuds",


        /* GAMING */

        "GAMING GEAR": "gaming",

        "GAMING": "gaming",


        /* CREATOR */

        "CREATOR GEAR": "creator",

        "CREATOR": "creator",


        /* HEADPHONES */

        "HEADPHONES": "headphones",

        "PREMIUM HEADPHONES": "headphones",


        /* TECH */

        "TECH": "tech",

        "TECH / LAPTOP ACCESSORIES": "tech",

        "TECHNOLOGY": "tech",


        /* LIFESTYLE */

        "LIFESTYLE": "lifestyle",

        "LIFESTYLE / AUTOMOTIVE": "lifestyle",

        "LIFESTYLE / AUTOMOTIVE ACCESSORIES": "lifestyle",

        "LIFESTYLE / SMART LIGHTING": "lifestyle",

        "LIFESTYLE / AMBIENT AUDIO": "lifestyle"

    };


    /* =========================================================
       CATEGORY DETECTION
       ========================================================= */

    function getSectionId(product) {

        const category = String(
            product.category || ""
        )
            .toUpperCase()
            .trim();


        /* -----------------------------------------------------
           Direct category match
           ----------------------------------------------------- */

        if (categoryMap[category]) {

            return categoryMap[category];

        }


        /* -----------------------------------------------------
           Flexible detection
           ----------------------------------------------------- */

        if (
            category.includes("EARBUD") ||
            category.includes("EARPHONE") ||
            category.includes("OPEN-EAR") ||
            category.includes("AUDIO")
        ) {

            return "earbuds";

        }


        if (
            category.includes("GAMING")
        ) {

            return "gaming";

        }


        if (
            category.includes("CREATOR")
        ) {

            return "creator";

        }


        if (
            category.includes("HEADPHONE")
        ) {

            return "headphones";

        }


        if (
            category.includes("TECH")
        ) {

            return "tech";

        }


        if (
            category.includes("LIFESTYLE") ||
            category.includes("AUTOMOTIVE") ||
            category.includes("SMART LIGHTING") ||
            category.includes("AMBIENT")
        ) {

            return "lifestyle";

        }


        return null;

    }


    /* =========================================================
       TEXT CLEANER
       ========================================================= */

    function cleanText(value) {

        if (
            value === undefined ||
            value === null
        ) {

            return "";

        }


        return String(value)
            .replace(/\s+/g, " ")
            .trim();

    }


    /* =========================================================
       HTML ESCAPE
       ========================================================= */

    function escapeHTML(value) {

        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =========================================================
       SHORT DESCRIPTION
       ========================================================= */

    function shortDescription(product) {

        let text = cleanText(
            product.shortDescription ||
            product.description ||
            ""
        );


        /*
         * Store cards remain compact.
         * Full product description stays
         * available on product-view.html.
         */

        if (text.length > 145) {

            text =
                text
                    .substring(0, 145)
                    .replace(/\s+\S*$/, "")
                    .trim() + "...";

        }


        return text;

    }


    /* =========================================================
       SAFE IMAGE
       ========================================================= */

    function getMainImage(product) {

        if (
            Array.isArray(product.images) &&
            product.images.length > 0 &&
            product.images[0]
        ) {

            return product.images[0];

        }


        if (
            product.image
        ) {

            return product.image;

        }


        return "";

    }


    /* =========================================================
       FORMAT PRICE
       ========================================================= */

    function formatPrice(price) {

        if (
            price === undefined ||
            price === null ||
            price === ""
        ) {

            return "—";

        }


        const number = Number(price);


        if (
            Number.isNaN(number)
        ) {

            return String(price);

        }


        return number.toFixed(2);

    }


    /* =========================================================
       CREATE PRODUCT CARD
       ========================================================= */

    function createProductCard(product) {

        const article =
            document.createElement("article");


        article.className =
            "store-product";


        article.dataset.productId =
            cleanText(product.id);


        /* -----------------------------------------------------
           PRODUCT DATA
           ----------------------------------------------------- */

        const image =
            getMainImage(product);


        const name =
            cleanText(product.name);


        const category =
            cleanText(product.category);


        const badge =
            cleanText(product.badge) ||
            "NEW";


        const description =
            shortDescription(product);


        const price =
            formatPrice(product.price);


        const currency =
            cleanText(product.currency) ||
            "USD";


        const productId =
            cleanText(product.id);


        const encodedProductId =
            encodeURIComponent(productId);


        /* -----------------------------------------------------
           IMAGE HTML
           ----------------------------------------------------- */

        let imageHTML = "";


        if (image) {

            imageHTML = `

                <img
                    src="${escapeHTML(image)}"
                    alt="${escapeHTML(name)}"
                    loading="lazy"
                    onerror="
                        this.style.display='none';
                        this.parentElement.classList.add('image-missing');
                    ">

            `;

        } else {

            imageHTML = `

                <div class="product-image-placeholder">
                    VOLTICA
                </div>

            `;

        }


        /* -----------------------------------------------------
           PRODUCT CARD
           ----------------------------------------------------- */

        article.innerHTML = `

            <div class="product-image">

                <span class="product-badge">
                    ${escapeHTML(badge)}
                </span>

                ${imageHTML}

                <div class="image-reflection"></div>

            </div>


            <div class="product-info">

                <div class="product-category">
                    VOLTICA / ${escapeHTML(category)}
                </div>


                <h3>
                    ${escapeHTML(name)}
                </h3>


                <p>
                    ${escapeHTML(description)}
                </p>


                <div class="product-bottom">

                    <strong class="product-price">

                        $${escapeHTML(price)}

                        <small>
                            ${escapeHTML(currency)}
                        </small>

                    </strong>


                    <a
                        href="product-view.html?id=${encodedProductId}"
                        class="product-button">

                        VIEW

                        <span>
                            →
                        </span>

                    </a>

                </div>

            </div>

        `;


        return article;

    }


    /* =========================================================
       FIND STORE SECTIONS
       ========================================================= */

    const sections =
        document.querySelectorAll(
            ".store-section"
        );


    if (
        sections.length === 0
    ) {

        console.error(
            "VOLTICA STORE: No .store-section elements found."
        );

        return;

    }


    /* =========================================================
       CLEAR STATIC PRODUCT CARDS
       ========================================================= */

    sections.forEach(function (section) {

        const grid =
            section.querySelector(
                ".store-product-grid"
            );


        if (!grid) {

            console.warn(
                "VOLTICA STORE: Product grid missing in section:",
                section.id
            );

            return;

        }


        /*
         * products.js is now the single
         * source of truth.
         */

        grid.innerHTML = "";

    });


    /* =========================================================
       RENDER PRODUCTS
       ========================================================= */

    let rendered =
        0;


    let skipped =
        0;


    volticaProducts.forEach(function (product, index) {

        /* -----------------------------------------------------
           Validate product
           ----------------------------------------------------- */

        if (
            !product ||
            !product.id
        ) {

            console.warn(
                "VOLTICA STORE: Invalid product at index:",
                index,
                product
            );

            skipped++;

            return;

        }


        /* -----------------------------------------------------
           Detect section
           ----------------------------------------------------- */

        const sectionId =
            getSectionId(product);


        if (!sectionId) {

            console.warn(
                "VOLTICA STORE: Unknown category.",
                {
                    product: product.name,
                    category: product.category,
                    id: product.id
                }
            );

            skipped++;

            return;

        }


        /* -----------------------------------------------------
           Find section
           ----------------------------------------------------- */

        const section =
            document.getElementById(
                sectionId
            );


        if (!section) {

            console.error(
                "VOLTICA STORE: Section not found.",
                {
                    sectionId: sectionId,
                    product: product.name,
                    id: product.id
                }
            );

            skipped++;

            return;

        }


        /* -----------------------------------------------------
           Find product grid
           ----------------------------------------------------- */

        const grid =
            section.querySelector(
                ".store-product-grid"
            );


        if (!grid) {

            console.error(
                "VOLTICA STORE: Product grid not found.",
                {
                    sectionId: sectionId,
                    product: product.name
                }
            );

            skipped++;

            return;

        }


        /* -----------------------------------------------------
           Create card
           ----------------------------------------------------- */

        const card =
            createProductCard(product);


        grid.appendChild(
            card
        );


        rendered++;


        /* -----------------------------------------------------
           Product diagnostic
           ----------------------------------------------------- */

        console.log(
            "VOLTICA STORE: Rendered →",
            product.name,
            "| category:",
            product.category,
            "| section:",
            sectionId,
            "| id:",
            product.id
        );

    });


    /* =========================================================
       HIDE EMPTY COLLECTIONS
       ========================================================= */

    sections.forEach(function (section) {

        const grid =
            section.querySelector(
                ".store-product-grid"
            );


        if (!grid) {

            return;

        }


        const products =
            grid.querySelectorAll(
                ".store-product"
            );


        if (
            products.length === 0
        ) {

            section.style.display =
                "none";

        } else {

            section.style.display =
                "";

        }

    });


    /* =========================================================
       STORE STATUS
       ========================================================= */

    console.log(
        "%cVOLTICA STORE READY",
        "font-weight:bold;font-size:16px;"
    );


    console.log(
        "Products in database:",
        volticaProducts.length
    );


    console.log(
        "Products rendered:",
        rendered
    );


    console.log(
        "Products skipped:",
        skipped
    );


    /* =========================================================
       SPECIAL DIAGNOSTIC — KIWI EARS
       ========================================================= */

    const kiwiProducts =
        volticaProducts.filter(function (product) {

            return String(
                product.name || ""
            )
                .toUpperCase()
                .includes("KIWI EARS");

        });


    if (
        kiwiProducts.length > 0
    ) {

        kiwiProducts.forEach(function (product) {

            console.log(
                "%cKIWI EARS PRODUCT DETECTED →",
                "font-weight:bold;font-size:15px;",
                product.name,
                "| ID:",
                product.id,
                "| CATEGORY:",
                product.category,
                "| SECTION:",
                getSectionId(product),
                "| PRICE:",
                product.price,
                product.currency
            );

        });

    }


});
