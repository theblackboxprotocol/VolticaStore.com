/* ============================================================
   VOLTICA STORE — STORE ENGINE
   ============================================================ */

(function () {

    "use strict";


    /* =========================================================
       ENGINE READY
       ========================================================= */

    function initVolticaStore() {

        console.log(
            "%cVOLTICA STORE ENGINE",
            "font-weight:bold;font-size:18px;"
        );


        /* =====================================================
           CHECK PRODUCT DATABASE
           ===================================================== */

        if (
            typeof volticaProducts === "undefined" ||
            !Array.isArray(volticaProducts)
        ) {

            console.error(
                "VOLTICA STORE ERROR: products.js was not loaded."
            );

            return;

        }


        console.log(
            "VOLTICA STORE: Product database detected.",
            volticaProducts.length,
            "products."
        );


        /* =====================================================
           CATEGORY → SECTION MAP
           ===================================================== */

        const categoryMap = {

            /* AUDIO */

            "SPORT AUDIO":
                "earbuds",

            "WIRELESS AUDIO":
                "earbuds",

            "OPEN-EAR AUDIO":
                "earbuds",

            "EARBUDS":
                "earbuds",

            "EARPHONES":
                "earbuds",


            /* GAMING */

            "GAMING":
                "gaming",

            "GAMING GEAR":
                "gaming",


            /* CREATOR */

            "CREATOR":
                "creator",

            "CREATOR GEAR":
                "creator",


            /* HEADPHONES */

            "HEADPHONES":
                "headphones",

            "PREMIUM HEADPHONES":
                "headphones",


            /* TECH */

            "TECH":
                "tech",

            "TECHNOLOGY":
                "tech",

            "TECH / LAPTOP ACCESSORIES":
                "tech",

            "TECH / SMART SECURITY":
                "tech",

            "SMART SECURITY":
                "tech",


            /* LIFESTYLE */

            "LIFESTYLE":
                "lifestyle",

            "LIFESTYLE / AUTOMOTIVE":
                "lifestyle",

            "LIFESTYLE / AUTOMOTIVE ACCESSORIES":
                "lifestyle",

            "LIFESTYLE / SMART LIGHTING":
                "lifestyle",

            "LIFESTYLE / AMBIENT AUDIO":
                "lifestyle"

        };


        /* =====================================================
           SECTION TITLES
           ===================================================== */

        const sectionTitles = {

            earbuds:
                "Wireless Earbuds.",

            gaming:
                "Gaming Gear.",

            creator:
                "Creator Gear.",

            headphones:
                "Premium Headphones.",

            tech:
                "Smart Tech.",

            lifestyle:
                "Smart Lifestyle."

        };


        /* =====================================================
           NORMALIZE TEXT
           ===================================================== */

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


        /* =====================================================
           ESCAPE HTML
           ===================================================== */

        function escapeHTML(value) {

            return String(value ?? "")
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");

        }


        /* =====================================================
           ESCAPE ATTRIBUTE
           ===================================================== */

        function escapeAttribute(value) {

            return escapeHTML(value);

        }


        /* =====================================================
           NORMALIZE CATEGORY
           ===================================================== */

        function normalizeCategory(category) {

            return cleanText(category)
                .toUpperCase()
                .replace(/\s+/g, " ");

        }


        /* =====================================================
           DETECT STORE SECTION
           ===================================================== */

        function getSectionId(product) {

            const category =
                normalizeCategory(
                    product.category
                );


            /* ---------------------------------------------
               Exact category match
               --------------------------------------------- */

            if (
                categoryMap[category]
            ) {

                return categoryMap[category];

            }


            /* ---------------------------------------------
               Audio
               --------------------------------------------- */

            if (
                category.includes("EARBUD") ||
                category.includes("EARPHONE") ||
                category.includes("OPEN-EAR") ||
                category.includes("WIRELESS AUDIO") ||
                category.includes("SPORT AUDIO")
            ) {

                return "earbuds";

            }


            /* ---------------------------------------------
               Gaming
               --------------------------------------------- */

            if (
                category.includes("GAMING")
            ) {

                return "gaming";

            }


            /* ---------------------------------------------
               Creator
               --------------------------------------------- */

            if (
                category.includes("CREATOR")
            ) {

                return "creator";

            }


            /* ---------------------------------------------
               Headphones
               --------------------------------------------- */

            if (
                category.includes("HEADPHONE")
            ) {

                return "headphones";

            }


            /* ---------------------------------------------
               Tech
               --------------------------------------------- */

            if (
                category.includes("TECH") ||
                category.includes("SMART SECURITY") ||
                category.includes("SMART DEVICE") ||
                category.includes("LAPTOP") ||
                category.includes("ELECTRONIC")
            ) {

                return "tech";

            }


            /* ---------------------------------------------
               Lifestyle
               --------------------------------------------- */

            if (
                category.includes("LIFESTYLE") ||
                category.includes("AUTOMOTIVE") ||
                category.includes("SMART LIGHTING") ||
                category.includes("AMBIENT")
            ) {

                return "lifestyle";

            }


            /* ---------------------------------------------
               Unknown
               --------------------------------------------- */

            return null;

        }


        /* =====================================================
           SHORT DESCRIPTION
           ===================================================== */

        function shortDescription(product) {

            let text =
                cleanText(
                    product.shortDescription ||
                    product.description ||
                    ""
                );


            const maxLength = 145;


            if (
                text.length > maxLength
            ) {

                text =
                    text
                        .substring(
                            0,
                            maxLength
                        )
                        .replace(
                            /\s+\S*$/,
                            ""
                        )
                        .trim();

                text += "...";

            }


            return text;

        }


        /* =====================================================
           IMAGE PATH
           ===================================================== */

        function getMainImage(product) {

            /* ---------------------------------------------
               Preferred database format
               --------------------------------------------- */

            if (
                Array.isArray(product.images)
            ) {

                const firstImage =
                    product.images.find(
                        function (image) {

                            return cleanText(
                                image
                            ) !== "";

                        }
                    );


                if (
                    firstImage
                ) {

                    return cleanText(
                        firstImage
                    );

                }

            }


            /* ---------------------------------------------
               Legacy image property
               --------------------------------------------- */

            if (
                product.image
            ) {

                return cleanText(
                    product.image
                );

            }


            return "";

        }


        /* =====================================================
           FORMAT PRICE
           ===================================================== */

        function formatPrice(price) {

            if (
                price === undefined ||
                price === null ||
                price === ""
            ) {

                return "—";

            }


            const number =
                Number(price);


            if (
                Number.isFinite(number)
            ) {

                return number.toFixed(2);

            }


            return cleanText(price);

        }


        /* =====================================================
           GET CURRENCY
           ===================================================== */

        function getCurrency(product) {

            const currency =
                cleanText(
                    product.currency
                );


            return currency || "USD";

        }


        /* =====================================================
           GET BADGE
           ===================================================== */

        function getBadge(product) {

            const badge =
                cleanText(
                    product.badge
                );


            return badge || "NEW";

        }


        /* =====================================================
           CREATE MISSING SECTION
           ===================================================== */

        function createMissingSection(sectionId) {

            console.warn(
                "VOLTICA STORE: Missing section detected:",
                sectionId
            );


            const section =
                document.createElement(
                    "section"
                );


            section.className =
                "store-section";


            section.id =
                sectionId;


            const title =
                sectionTitles[sectionId] ||
                sectionId.toUpperCase();


            section.innerHTML = `

                <div class="store-section-heading">

                    <div>

                        <span class="section-index">
                            VOLTICA COLLECTION
                        </span>

                        <h2>
                            ${escapeHTML(title)}
                        </h2>

                    </div>

                </div>


                <div class="store-product-grid"></div>

            `;


            const storePage =
                document.querySelector(
                    ".store-page"
                );


            const footer =
                document.querySelector(
                    ".store-footer"
                );


            if (
                storePage &&
                footer
            ) {

                storePage.insertBefore(
                    section,
                    footer
                );

            }
            else if (
                storePage
            ) {

                storePage.appendChild(
                    section
                );

            }
            else {

                document.body.appendChild(
                    section
                );

            }


            return section;

        }


        /* =====================================================
           FIND SECTION
           ===================================================== */

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


        /* =====================================================
           CREATE PRODUCT CARD
           ===================================================== */

        function createProductCard(product) {

            const article =
                document.createElement(
                    "article"
                );


            article.className =
                "store-product";


            const productId =
                cleanText(
                    product.id
                );


            article.dataset.productId =
                productId;


            const name =
                cleanText(
                    product.name
                ) ||
                "Voltica Product";


            const category =
                cleanText(
                    product.category
                ) ||
                "TECH";


            const badge =
                getBadge(product);


            const description =
                shortDescription(product);


            const price =
                formatPrice(
                    product.price
                );


            const currency =
                getCurrency(product);


            const image =
                getMainImage(product);


            const encodedProductId =
                encodeURIComponent(
                    productId
                );


            /* =================================================
               IMAGE
               ================================================= */

            let imageHTML = "";


            if (
                image
            ) {

                imageHTML = `

                    <img
                        src="${escapeAttribute(image)}"
                        alt="${escapeAttribute(name)}"
                        loading="lazy"
                        decoding="async"
                    >

                `;

            }
            else {

                imageHTML = `

                    <div class="product-image-placeholder">

                        VOLTICA

                    </div>

                `;

            }


            /* =================================================
               PRODUCT CARD HTML
               ================================================= */

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
                            aria-label="View ${escapeAttribute(name)}"
                        >

                            VIEW

                            <span>
                                →
                            </span>

                        </a>

                    </div>

                </div>

            `;


            /* =================================================
               IMAGE ERROR HANDLING
               ================================================= */

            const imageElement =
                article.querySelector(
                    ".product-image img"
                );


            if (
                imageElement
            ) {

                imageElement.addEventListener(
                    "error",
                    function () {

                        console.warn(
                            "VOLTICA STORE: Image failed to load:",
                            image,
                            "| Product:",
                            name
                        );


                        this.style.display =
                            "none";


                        const container =
                            this.closest(
                                ".product-image"
                            );


                        if (
                            container
                        ) {

                            container.classList.add(
                                "image-missing"
                            );

                        }

                    }
                );

            }


            return article;

        }


        /* =====================================================
           GET ALL STORE SECTIONS
           ===================================================== */

        const sections =
            document.querySelectorAll(
                ".store-section"
            );


        /* =====================================================
           CLEAR STATIC PRODUCT CARDS
           ===================================================== */

        sections.forEach(
            function (section) {

                const grid =
                    section.querySelector(
                        ".store-product-grid"
                    );


                if (
                    !grid
                ) {

                    return;

                }


                grid.innerHTML = "";

            }
        );


        /* =====================================================
           RENDER PRODUCTS
           ===================================================== */

        let rendered = 0;
        let skipped = 0;


        volticaProducts.forEach(
            function (product, index) {

                try {

                    /* -----------------------------------------
                       Validate product
                       ----------------------------------------- */

                    if (
                        !product ||
                        typeof product !== "object"
                    ) {

                        console.warn(
                            "VOLTICA STORE: Invalid product:",
                            index,
                            product
                        );

                        skipped++;

                        return;

                    }


                    const productId =
                        cleanText(
                            product.id
                        );


                    if (
                        !productId
                    ) {

                        console.warn(
                            "VOLTICA STORE: Product has no ID:",
                            index,
                            product
                        );

                        skipped++;

                        return;

                    }


                    /* -----------------------------------------
                       Detect section
                       ----------------------------------------- */

                    const sectionId =
                        getSectionId(
                            product
                        );


                    if (
                        !sectionId
                    ) {

                        console.warn(
                            "VOLTICA STORE: Unknown category.",
                            {
                                name:
                                    product.name,

                                category:
                                    product.category,

                                id:
                                    product.id
                            }
                        );

                        skipped++;

                        return;

                    }


                    /* -----------------------------------------
                       Find / create section
                       ----------------------------------------- */

                    const section =
                        getStoreSection(
                            sectionId
                        );


                    if (
                        !section
                    ) {

                        console.error(
                            "VOLTICA STORE: Section unavailable:",
                            sectionId
                        );

                        skipped++;

                        return;

                    }


                    /* -----------------------------------------
                       Find / create grid
                       ----------------------------------------- */

                    let grid =
                        section.querySelector(
                            ".store-product-grid"
                        );


                    if (
                        !grid
                    ) {

                        grid =
                            document.createElement(
                                "div"
                            );


                        grid.className =
                            "store-product-grid";


                        section.appendChild(
                            grid
                        );

                    }


                    /* -----------------------------------------
                       Create card
                       ----------------------------------------- */

                    const card =
                        createProductCard(
                            product
                        );


                    grid.appendChild(
                        card
                    );


                    rendered++;


                    console.log(
                        "VOLTICA STORE: Rendered →",
                        cleanText(product.name),
                        "| ID:",
                        productId,
                        "| CATEGORY:",
                        cleanText(product.category),
                        "| SECTION:",
                        sectionId
                    );

                }
                catch (error) {

                    console.error(
                        "VOLTICA STORE: Product render error at index",
                        index,
                        product,
                        error
                    );

                    skipped++;

                }

            }
        );


        /* =====================================================
           HIDE EMPTY SECTIONS
           ===================================================== */

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
                        !grid
                    ) {

                        section.style.display =
                            "none";

                        return;

                    }


                    const productCards =
                        grid.querySelectorAll(
                            ".store-product"
                        );


                    if (
                        productCards.length === 0
                    ) {

                        section.style.display =
                            "none";

                    }
                    else {

                        section.style.display =
                            "";

                    }

                }
            );


        /* =====================================================
           UPDATE CATEGORY NAVIGATION
           ===================================================== */

        document
            .querySelectorAll(
                ".category-glass"
            )
            .forEach(
                function (button) {

                    const href =
                        button.getAttribute(
                            "href"
                        );


                    if (
                        !href ||
                        !href.startsWith("#")
                    ) {

                        return;

                    }


                    const target =
                        document.getElementById(
                            href.substring(1)
                        );


                    if (
                        !target ||
                        target.style.display === "none"
                    ) {

                        button.style.display =
                            "none";

                    }
                    else {

                        button.style.display =
                            "";

                    }

                }
            );


        /* =====================================================
           STORE STATUS
           ===================================================== */

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


        /* =====================================================
           DIAGNOSTIC SUMMARY
           ===================================================== */

        if (
            rendered === 0 &&
            volticaProducts.length > 0
        ) {

            console.error(
                "VOLTICA STORE: Database contains products, but none were rendered."
            );

        }


        if (
            skipped > 0
        ) {

            console.warn(
                "VOLTICA STORE:",
                skipped,
                "product(s) were skipped."
            );

        }

    }


    /* =========================================================
       DOM READY
       ========================================================= */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initVolticaStore
        );

    }
    else {

        initVolticaStore();

    }


})();
