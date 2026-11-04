/* =========================================================
   VOLTICA STORE — STORE.JS
   Category Sections + Filter + Stripe Direct Checkout
   GA4 Analytics Integrated
   STATIC PAGE ROUTING (v2)
   ========================================================= */

"use strict";


/* =========================================================
   STORE INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("VOLTICA: STORE START");


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const productGrid =
        document.getElementById("productGrid");


    /* =====================================================
       CATEGORY SYSTEM
       ===================================================== */

    const CATEGORY_ORDER = [
        "Audio",
        "Gaming Gear",
        "Vlogging and Creator Gear",
        "Tech",
        "Lifestyle",
        "Smart Home"
    ];


    const CATEGORY_TAGLINES = {
        "Audio":
            "Precision listening. Studio-grade sound.",
        "Gaming Gear":
            "Built for competition and immersion.",
        "Vlogging and Creator Gear":
            "Tools for the next generation of creators.",
        "Tech":
            "Innovation you can hold.",
        "Lifestyle":
            "Everyday technology, refined.",
        "Smart Home":
            "Intelligent living spaces."
    };


    /* =====================================================
       CATEGORY NORMALIZATION
       ===================================================== */

    function normalizeCategory(category) {

        const raw =
            String(category || "")
                .trim();


        if (!raw) {
            return "VOLTICA COLLECTION";
        }


        const lower = raw.toLowerCase();


        if (
            lower === "vlogging & streaming gear" ||
            lower === "vlogging and streaming gear" ||
            lower === "vlogging and creator gear" ||
            lower === "vlogging" ||
            lower === "creator gear"
        ) {
            return "Vlogging and Creator Gear";
        }


        return raw;

    }


    function getCategoryTagline(category) {

        return (
            CATEGORY_TAGLINES[category] ||
            "The future of everyday."
        );

    }


    /* =====================================================
       GA4 ANALYTICS
       ===================================================== */

    function trackEvent(
        eventName,
        eventParameters
    ) {

        if (
            typeof window.gtag === "function"
        ) {

            window.gtag(
                "event",
                eventName,
                eventParameters || {}
            );

            console.log(
                "VOLTICA: GA4 EVENT",
                eventName,
                eventParameters || {}
            );

        } else {

            console.warn(
                "VOLTICA: GA4 gtag() unavailable.",
                eventName
            );

        }

    }


    /* =====================================================
       GA4 PRODUCT FORMAT
       ===================================================== */

    function createAnalyticsItem(
        product,
        quantity = 1
    ) {

        if (!product) {
            return null;
        }


        return {

            item_id:
                String(
                    product.id || ""
                ),

            item_name:
                String(
                    product.name ||
                    "Voltica Product"
                ),

            item_category:
                normalizeCategory(
                    product.category
                ),

            price:
                Number(
                    product.price || 0
                ),

            quantity:
                Math.max(
                    1,
                    Number(
                        quantity || 1
                    )
                )

        };

    }


    /* =====================================================
       PRODUCT DATABASE CHECK
       ===================================================== */

    if (
        typeof window.volticaProducts === "undefined" ||
        !Array.isArray(window.volticaProducts)
    ) {

        console.error(
            "VOLTICA: products.js introuvable ou invalide."
        );

        if (productGrid) {

            productGrid.innerHTML = `

                <div class="store-empty">

                    <strong>
                        COLLECTION UNAVAILABLE
                    </strong>

                    <span>
                        Product database could not be loaded.
                    </span>

                </div>

            `;

        }

        return;

    }


    const products =
        window.volticaProducts;


    console.log(
        "VOLTICA: PRODUCTS =",
        products.length
    );


    /* =====================================================
       FIND PRODUCT
       ===================================================== */

    function findProduct(
        productId
    ) {

        return products.find(
            item =>
                item &&
                String(item.id) ===
                String(productId)
        );

    }


    /* =====================================================
       CREATE PRODUCT CARD — BUY NOW (STRIPE DIRECT)
       ===================================================== */

    function createProductCard(product) {

        const card =
            document.createElement(
                "article"
            );


        card.className =
            "store-product";


        const image =
            Array.isArray(product.images) &&
            product.images.length
                ? product.images[0]
                : "";


        const price =
            Number(
                product.price || 0
            );


        const referencePrice =
            Number(
                product.referencePrice || 0
            );


        /* =================================================
           STATIC PAGE ROUTING
           ================================================= */

        const productURL =
            product.staticPage
                ? product.staticPage
                : "product-view.html?id=" +
                  encodeURIComponent(product.id);


        /* =================================================
           STRIPE DIRECT LINK
           ================================================= */

        const stripeLink =
            product.stripeLink || productURL;


        /* =================================================
           COLORS
           ================================================= */

        let colorsHTML = "";


        if (
            Array.isArray(product.colors) &&
            product.colors.length
        ) {

            colorsHTML = `

                <div class="product-colors">

                    <span>
                        COLORS
                    </span>

                    <div class="color-list">

                        ${product.colors
                            .map(
                                color => `

                                    <span
                                        class="color-chip"
                                        title="${escapeHTML(color)}"
                                        aria-label="${escapeHTML(color)}"
                                    ></span>

                                `
                            )
                            .join("")}

                    </div>

                </div>

            `;

        }


        /* =================================================
           REFERENCE PRICE
           ================================================= */

        let referenceHTML = "";


        if (
            referencePrice > price
        ) {

            referenceHTML = `

                <span class="product-reference-price">
                    $${referencePrice.toFixed(2)}
                </span>

            `;

        }


        /* =================================================
           PRODUCT CARD — BUY NOW BUTTON
           ================================================= */

        card.innerHTML = `

            <div class="product-image">

                <img
                    src="${escapeHTML(image)}"
                    alt="${escapeHTML(
                        product.name ||
                        "Voltica Product"
                    )}"
                    loading="lazy"
                >

                <div
                    class="image-reflection"
                    aria-hidden="true"
                ></div>

            </div>


            <div class="product-info">

                <span class="product-category">
                    ${escapeHTML(
                        normalizeCategory(
                            product.category
                        )
                    )}
                </span>


                <h2 class="product-title">
                    ${escapeHTML(
                        product.name ||
                        "VOLTICA PRODUCT"
                    )}
                </h2>


                <p class="product-description">
                    ${escapeHTML(
                        product.shortDescription ||
                        ""
                    )}
                </p>


                <div class="product-price-row">

                    <strong class="product-price">
                        $${price.toFixed(2)}
                    </strong>

                    ${referenceHTML}

                </div>


                ${colorsHTML}


                <div class="product-actions">

                    <a
                        href="${productURL}"
                        class="acrylic-button product-view-button"
                        data-product-id="${escapeHTML(
                            product.id
                        )}"
                    >
                        VIEW PRODUCT
                    </a>


                    <a
                        href="${escapeHTML(stripeLink)}"
                        class="acrylic-button product-buy-button"
                        target="_blank"
                        rel="noopener noreferrer"
                        data-product-id="${escapeHTML(
                            product.id
                        )}"
                        aria-label="Buy ${escapeHTML(product.name || 'product')} on Stripe"
                    >
                        BUY NOW
                    </a>

                </div>

            </div>

        `;


        return card;

    }


    /* =====================================================
       CATEGORY LIST (ordered, present categories only)
       ===================================================== */

    function getCategoryList(activeProducts) {

        const present =
            new Set(
                activeProducts.map(
                    product =>
                        normalizeCategory(
                            product.category
                        )
                )
            );


        const ordered =
            CATEGORY_ORDER.filter(
                category =>
                    present.has(category)
            );


        const extras =
            Array.from(present)
                .filter(
                    category =>
                        !CATEGORY_ORDER.includes(
                            category
                        )
                )
                .sort();


        return ordered.concat(extras);

    }


    /* =====================================================
       CURRENT FILTER STATE
       ===================================================== */

    let currentFilter = "ALL";


    /* =====================================================
       FILTER BAR
       ===================================================== */

    function renderFilterBar(categories) {

        const existingBar =
            document.getElementById(
                "categoryFilterBar"
            );


        if (existingBar) {
            existingBar.remove();
        }


        if (!productGrid || !productGrid.parentNode) {
            return;
        }


        const bar =
            document.createElement("div");


        bar.id = "categoryFilterBar";

        bar.className =
            "category-filter-bar";


        bar.setAttribute(
            "aria-label",
            "Filter products by category"
        );


        bar.appendChild(
            createFilterChip(
                "ALL",
                "ALL CATEGORIES"
            )
        );


        categories.forEach(
            category => {

                bar.appendChild(
                    createFilterChip(
                        category,
                        category
                    )
                );

            }
        );


        productGrid.parentNode.insertBefore(
            bar,
            productGrid
        );

    }


    function createFilterChip(value, label) {

        const button =
            document.createElement("button");


        button.type = "button";


        button.className =
            "category-chip" +
            (
                value === currentFilter
                    ? " active"
                    : ""
            );


        button.dataset.category =
            value;


        button.textContent =
            String(label).toUpperCase();


        button.addEventListener(
            "click",
            function () {

                applyFilter(value);

            }
        );


        return button;

    }


    /* =====================================================
       APPLY FILTER
       ===================================================== */

    function applyFilter(category) {

        currentFilter = category;


        document
            .querySelectorAll(".category-chip")
            .forEach(
                chip => {

                    chip.classList.toggle(
                        "active",
                        chip.dataset.category ===
                        category
                    );

                }
            );


        document
            .querySelectorAll(".category-section")
            .forEach(
                section => {

                    const show =
                        category === "ALL" ||
                        section.dataset.category ===
                        category;


                    section.style.display =
                        show ? "" : "none";

                }
            );


        trackEvent(
            "view_item_list",
            {
                item_list_name:
                    category === "ALL"
                        ? "All Categories"
                        : category
            }
        );


        console.log(
            "VOLTICA: FILTER =",
            category
        );

    }


    /* =====================================================
       RENDER PRODUCTS — CATEGORY SECTIONS
       ===================================================== */

    function renderProducts() {

        if (!productGrid) {

            console.error(
                "VOLTICA: #productGrid introuvable."
            );

            return;

        }


        /* =================================================
           TRANSFORM CONTAINER INTO SECTIONS WRAPPER
           ================================================= */

        productGrid.classList.remove("product-grid");

        productGrid.classList.add("product-sections");

        productGrid.style.display = "block";
        productGrid.style.width = "100%";
        productGrid.style.maxWidth = "none";
        productGrid.style.margin = "0";
        productGrid.style.padding = "0";

        productGrid.innerHTML = "";


        const activeProducts =
            products.filter(
                product =>
                    product &&
                    product.active !== false
            );


        console.log(
            "VOLTICA: ACTIVE PRODUCTS =",
            activeProducts.length
        );


        if (!activeProducts.length) {

            productGrid.innerHTML = `

                <div class="store-empty">

                    <div
                        class="cart-empty-pulsar"
                        aria-hidden="true"
                    ></div>

                    <strong>
                        COLLECTION COMING SOON
                    </strong>

                    <span>
                        New products are being prepared.
                    </span>

                </div>

            `;


            console.warn(
                "VOLTICA: NO ACTIVE PRODUCTS"
            );

            return;

        }


        /* =================================================
           BUILD CATEGORY SECTIONS
           ================================================= */

        const categories =
            getCategoryList(activeProducts);


        renderFilterBar(categories);


        categories.forEach(
            function (category, index) {

                const items =
                    activeProducts.filter(
                        product =>
                            normalizeCategory(
                                product.category
                            ) === category
                    );


                if (!items.length) {
                    return;
                }


                const section =
                    document.createElement("section");


                section.className =
                    "category-section";


                section.dataset.category =
                    category;


                const number =
                    String(index + 1)
                        .padStart(2, "0");


                section.innerHTML = `

                    <div class="category-section-heading">

                        <div>

                            <span class="category-kicker">
                                COLLECTION ${number}
                            </span>

                            <h2 class="category-title">
                                ${escapeHTML(
                                    category.toUpperCase()
                                )}
                            </h2>

                            <p class="category-tagline">
                                ${escapeHTML(
                                    getCategoryTagline(
                                        category
                                    )
                                )}
                            </p>

                        </div>

                        <span class="category-count">
                            ${items.length}
                            PRODUCT${items.length > 1 ? "S" : ""}
                        </span>

                    </div>

                `;


                const grid =
                    document.createElement("div");


                grid.className =
                    "product-grid";


                items.forEach(
                    product => {

                        grid.appendChild(
                            createProductCard(
                                product
                            )
                        );

                    }
                );


                section.appendChild(grid);

                productGrid.appendChild(section);

            }
        );


        console.log(
            "VOLTICA: SECTIONS RENDERED =",
            categories.length
        );

    }


    /* =====================================================
       PRODUCT VIEW ANALYTICS
       ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const viewButton =
                event.target.closest(
                    ".product-view-button"
                );


            if (!viewButton) {
                return;
            }


            const productId =
                viewButton.dataset.productId;


            if (!productId) {
                return;
            }


            const product =
                findProduct(
                    productId
                );


            if (!product) {
                return;
            }


            const analyticsItem =
                createAnalyticsItem(
                    product,
                    1
                );


            if (analyticsItem) {

                trackEvent(
                    "view_item",
                    {

                        currency:
                            "USD",

                        value:
                            Number(
                                product.price || 0
                            ),

                        items:
                            [
                                analyticsItem
                            ]

                    }
                );

            }

        }
    );


    /* =====================================================
       BUY NOW ANALYTICS (STRIPE DIRECT)
       ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const buyButton =
                event.target.closest(
                    ".product-buy-button"
                );


            if (!buyButton) {
                return;
            }


            const productId =
                buyButton.dataset.productId;


            if (!productId) {
                return;
            }


            const product =
                findProduct(
                    productId
                );


            if (!product) {
                return;
            }


            const analyticsItem =
                createAnalyticsItem(
                    product,
                    1
                );


            if (analyticsItem) {

                trackEvent(
                    "begin_checkout",
                    {

                        currency:
                            "USD",

                        value:
                            Number(
                                product.price || 0
                            ),

                        items:
                            [
                                analyticsItem
                            ]

                    }
                );

            }


            console.log(
                "VOLTICA: BUY NOW → STRIPE",
                product.name
            );

        }
    );


    /* =====================================================
       HTML ESCAPE
       ===================================================== */

    function escapeHTML(value) {

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


    /* =====================================================
       INITIAL STATE
       ===================================================== */

    renderProducts();


    console.log(
        "VOLTICA: STORE READY"
    );

});
