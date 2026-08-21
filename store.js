/* ============================================================
   VOLTICA STORE — STORE ENGINE
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";


    /* =========================================================
       ENGINE START
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
       SECTION TITLES
       ========================================================= */

    const sectionTitles = {

        earbuds: "AUDIO",
        gaming: "GAMING GEAR",
        creator: "CREATOR GEAR",
        headphones: "HEADPHONES",
        tech: "TECHNOLOGY",
        lifestyle: "LIFESTYLE"

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


        /* Direct match */

        if (categoryMap[category]) {

            return categoryMap[category];

        }


        /* Flexible detection */

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


        if (
            text.length > 145
        ) {

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
       CREATE MISSING SECTION
       ========================================================= */

    function createMissingSection(sectionId) {

        console.warn(
            "VOLTICA STORE: Missing section detected →",
            sectionId,
            "Creating automatically."
        );


        const section =
            document.createElement("section");


        section.id =
            sectionId;


        section.className =
            "store-section";


        const title =
            sectionTitles[sectionId] ||
            sectionId.toUpperCase();


        section.innerHTML = `

            <div class="store-section-header">

                <div>

                    <span class="store-section-label">
                        VOLTICA COLLECTION
                    </span>

                    <h2>
                        ${escapeHTML(title)}
                    </h2>

                </div>

            </div>


            <div class="store-product-grid"></div>

        `;


        /*
         * Append after existing store sections.
         */

        const existingSections =
            document.querySelectorAll(
                ".store-section"
            );


        if (
            existingSections.length > 0
        ) {

            existingSections[
                existingSections.length - 1
            ].after(section);

        } else {

            document.body.appendChild(section);

        }


        return section;

    }


    /* =========================================================
       FIND OR CREATE SECTION
       ========================================================= */

    function getStoreSection(sectionId) {

        let section =
            document.getElementById(
                sectionId
            );


        if (
            section
        ) {

            return section;

        }


        return createMissingSection(
            sectionId
        );

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


        /* Product data */

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
            encodeURIComponent(
                productId
            );


        /* Image */

        let imageHTML = "";


        if (
            image
        ) {

            imageHTML = `

                <img
                    src="${escapeHTML(image)}"
                    alt="${escapeHTML(name)}"
                    loading="lazy"
                    onerror="
                        this.style.display='none';
                        this.parentElement.classList.add('image-missing');
                    "
                >

            `;

        } else {

            imageHTML = `

                <div class="product-image-placeholder">
                    VOLTICA
                </div>

            `;

        }


        /* Product card */

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
                        class="product-button"
                        aria-label="View ${escapeHTML(name)}"
                    >

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
       FIND EXISTING STORE SECTIONS
       ========================================================= */

    const sections =
        document.querySelectorAll(
            ".store-section"
        );


    /*
     * We intentionally do NOT stop the engine
     * when no sections exist.
     *
     * Missing sections will be created automatically
     * when products are rendered.
     */


    /* =========================================================
       CLEAR STATIC PRODUCT CARDS
       ========================================================= */

    sections.forEach(function (section) {

        const grid =
            section.querySelector(
                ".store-product-grid"
            );


        if (!grid) {

            return;

        }


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
           Validate
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


        if (
            !sectionId
        ) {

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
           Get or create section
           ----------------------------------------------------- */

        const section =
            getStoreSection(
                sectionId
            );


        if (
            !section
        ) {

            console.error(
                "VOLTICA STORE: Unable to create section.",
                sectionId
            );

            skipped++;

            return;

        }


        /* -----------------------------------------------------
           Get grid
           ----------------------------------------------------- */

        let grid =
            section.querySelector(
                ".store-product-grid"
            );


        /*
         * If the section exists but has no grid,
         * create one automatically.
         */

        if (
            !grid
        ) {

            console.warn(
                "VOLTICA STORE: Missing product grid.",
                sectionId,
                "Creating automatically."
            );


            grid =
                document.createElement("div");


            grid.className =
                "store-product-grid";


            section.appendChild(
                grid
            );

        }


        /* -----------------------------------------------------
           Create card
           ----------------------------------------------------- */

        const card =
            createProductCard(
                product
            );


        grid.appendChild(
            card
        );


        rendered++;


        /* -----------------------------------------------------
           Diagnostic
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

    document
        .querySelectorAll(".store-section")
        .forEach(function (section) {

            const grid =
                section.querySelector(
                    ".store-product-grid"
                );


            if (
                !grid
            ) {

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
       SMART MIRROR DIAGNOSTIC
       ========================================================= */

    const smartMirrorProducts =
        volticaProducts.filter(function (product) {

            const name =
                String(
                    product.name || ""
                ).toUpperCase();


            return (
                name.includes("SMART MIRROR") ||
                name.includes("MIRROR PRO")
            );

        });


    if (
        smartMirrorProducts.length > 0
    ) {

        smartMirrorProducts.forEach(function (product) {

            console.log(
                "%cSMART MIRROR PRODUCT DETECTED →",
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


    /* =========================================================
       KIWI EARS DIAGNOSTIC
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
