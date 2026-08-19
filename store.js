/* ============================================================
   VOLTICA STORE — STORE ENGINE
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    /* =========================================================
       CHECK DATABASE
    ========================================================= */

    if (
        typeof volticaProducts === "undefined" ||
        !Array.isArray(volticaProducts)
    ) {
        console.error("VOLTICA STORE: products.js not loaded.");
        return;
    }


    /* =========================================================
       CATEGORY → STORE SECTION
       ========================================================= */

    const categoryMap = {

    "SPORT AUDIO": "earbuds",
    "WIRELESS AUDIO": "earbuds",
    "OPEN-EAR AUDIO": "earbuds",
    "EARBUDS": "earbuds",

    "GAMING GEAR": "gaming",
    "GAMING": "gaming",

    "CREATOR GEAR": "creator",
    "CREATOR": "creator",

    "HEADPHONES": "headphones",

    "TECH": "tech",
    "TECH / LAPTOP ACCESSORIES": "tech",

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
        ).toUpperCase().trim();


        if (categoryMap[category]) {
            return categoryMap[category];
        }


        /* Flexible detection */

        if (
            category.includes("AUDIO") ||
            category.includes("EARBUD")
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

        if (!value) {
            return "";
        }

        return String(value)
            .replace(/\s+/g, " ")
            .trim();
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
         * Store cards stay short.
         * Full description remains available
         * on product-view.html.
         */

        if (text.length > 145) {

            text =
                text.substring(0, 145)
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
            product.images.length > 0
        ) {
            return product.images[0];
        }


        if (product.image) {
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


        if (Number.isNaN(number)) {
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
            product.id || "";


        const image =
            getMainImage(product);


        const name =
            cleanText(product.name);


        const category =
            cleanText(product.category);


        const badge =
            cleanText(product.badge) || "NEW";


        const description =
            shortDescription(product);


        const price =
            formatPrice(product.price);


        const currency =
            cleanText(product.currency) || "USD";


        article.innerHTML = `

            <div class="product-image">

                <span class="product-badge">
                    ${badge}
                </span>


                <img
                    src="${image}"
                    alt="${name}"
                    loading="lazy"
                    onerror="this.style.display='none';">


                <div class="image-reflection"></div>

            </div>


            <div class="product-info">

                <div class="product-category">
                    VOLTICA / ${category}
                </div>


                <h3>
                    ${name}
                </h3>


                <p>
                    ${description}
                </p>


                <div class="product-bottom">

                    <strong class="product-price">

                        $${price}

                        <small>
                            ${currency}
                        </small>

                    </strong>


                    <a
                        href="product-view.html?id=${encodeURIComponent(product.id)}"
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
       FIND PRODUCT GRIDS
       ========================================================= */

    const sections =
        document.querySelectorAll(
            ".store-section"
        );


    /* =========================================================
       REMOVE STATIC PRODUCT CARDS
       ========================================================= */

    sections.forEach(function (section) {

        const grid =
            section.querySelector(
                ".store-product-grid"
            );


        if (!grid) {
            return;
        }


        /*
         * The HTML product cards are now
         * controlled by products.js.
         */

        grid.innerHTML = "";

    });


    /* =========================================================
       RENDER PRODUCTS
       ========================================================= */

    let rendered = 0;


    volticaProducts.forEach(function (product) {

        if (!product || !product.id) {
            return;
        }


        const sectionId =
            getSectionId(product);


        if (!sectionId) {

            console.warn(
                "VOLTICA STORE: Unknown category:",
                product.category,
                product.name
            );

            return;
        }


        const section =
            document.getElementById(
                sectionId
            );


        if (!section) {

            console.warn(
                "VOLTICA STORE: Section not found:",
                sectionId
            );

            return;
        }


        const grid =
            section.querySelector(
                ".store-product-grid"
            );


        if (!grid) {
            return;
        }


        grid.appendChild(
            createProductCard(product)
        );


        rendered++;

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


        if (products.length === 0) {

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
        "VOLTICA STORE:",
        rendered,
        "products loaded."
    );

});
