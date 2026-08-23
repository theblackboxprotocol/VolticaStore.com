/* =========================================================
   VOLTICA STORE — PRODUCT VIEW.JS
   Q45 Product Detail Engine
   Robust / Mobile / Stripe Ready
   ========================================================= */

"use strict";


/* =========================================================
   CONFIG
   ========================================================= */

const VOLTICA_PRODUCTS_KEY =
    "voltica_products_admin";

const DEFAULT_STRIPE_LINK =
    "https://buy.stripe.com/eVqeVe2hNgILbyoaWK2Ji0j";


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeProductView
);


/* =========================================================
   INITIALIZATION
   ========================================================= */

function initializeProductView() {

    const product =
        getProductFromURL();

    if (!product) {

        showProductError();

        return;

    }

    renderProduct(product);

    initializeGallery();

    initializeLightbox();

    initializeVariants(product);

}


/* =========================================================
   GET ID
   ========================================================= */

function getProductIdFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return params.get("id");

}


/* =========================================================
   FIND PRODUCT
   ========================================================= */

function getProductFromURL() {

    const productId =
        getProductIdFromURL();

    if (!productId) {
        return null;
    }


    /*
     * First source:
     * products.js
     */

    if (
        Array.isArray(
            window.volticaProducts
        )
    ) {

        const product =
            window.volticaProducts.find(
                item =>
                    String(item.id) ===
                    String(productId)
            );

        if (product) {
            return product;
        }

    }


    /*
     * Second source:
     * admin localStorage
     */

    try {

        const saved =
            localStorage.getItem(
                VOLTICA_PRODUCTS_KEY
            );

        if (saved) {

            const products =
                JSON.parse(saved);

            if (
                Array.isArray(products)
            ) {

                const product =
                    products.find(
                        item =>
                            String(item.id) ===
                            String(productId)
                    );

                if (product) {
                    return product;
                }

            }

        }

    } catch (error) {

        console.warn(
            "VOLTICA: local product database unavailable.",
            error
        );

    }


    /*
     * Q45 emergency fallback.
     *
     * This prevents the product page
     * from breaking if the database
     * has not synchronized yet.
     */

    if (
        String(productId).toLowerCase()
            === "q45"
        ||
        String(productId).toLowerCase()
            === "headphones"
        ||
        String(productId).toLowerCase()
            === "voltca-q45"
    ) {

        return createQ45Fallback();

    }


    return null;

}


/* =========================================================
   Q45 FALLBACK
   ========================================================= */

function createQ45Fallback() {

    return {

        id: "q45",

        productNumber: 1,

        name: "VOLTICA Q45",

        category: "PREMIUM AUDIO",

        badge: "PRE-ORDER",

        price: 189.99,

        referencePrice: 229.99,

        currency: "USD",

        images: [

            "assets/images/q451-1.webp",
            "assets/images/q451-2.webp",
            "assets/images/q451-3.webp",
            "assets/images/q451-4.webp",
            "assets/images/q451-6.webp",
            "assets/images/q451-7.webp"

        ],

        shortDescription:
            "Premium wireless headphones engineered for immersive everyday listening.",

        description:
            "Meet the Voltica Q45 — premium wireless audio designed for listeners who expect powerful sound, modern comfort and a refined technology experience.",

        features: [

            "Premium wireless audio",

            "Immersive listening experience",

            "Comfort-focused over-ear design",

            "Modern premium construction",

            "Designed for everyday use",

            "Voltica premium audio collection"

        ],

        specifications: {

            "Product": "Voltica Q45",

            "Category": "Premium Audio",

            "Connectivity": "Wireless Bluetooth",

            "Design": "Over-ear",

            "Use": "Music / Gaming / Everyday",

            "Color": "Black",

            "Currency": "USD"

        },

        variants: [

            "Black"

        ],

        stripeLink:
            DEFAULT_STRIPE_LINK

    };

}


/* =========================================================
   RENDER PRODUCT
   ========================================================= */

function renderProduct(product) {

    setText(
        "productCategory",
        product.category ||
        "PREMIUM AUDIO"
    );


    setText(
        "productName",
        product.name ||
        "VOLTICA PRODUCT"
    );


    setText(
        "productShortDescription",
        product.shortDescription ||
        product.description ||
        ""
    );


    setText(
        "productPrice",
        formatPrice(
            product.price
        )
    );


    setText(
        "productCurrency",
        product.currency ||
        "USD"
    );


    setText(
        "productBadge",
        product.badge ||
        "PRE-ORDER"
    );


    setText(
        "finalProductName",
        product.name ||
        "VOLTICA PRODUCT"
    );


    renderMainImage(product);

    renderThumbnails(product);

    renderDescription(product);

    renderFeatures(product);

    renderSpecifications(product);

    renderOptions(product);

    renderLifetimeOffer();

    setupStripeButtons(product);

    renderAvailability(product);


    document.title =
        `${product.name || "Product"} — Voltica Store`;

}


/* =========================================================
   MAIN IMAGE
   ========================================================= */

function renderMainImage(product) {

    const image =
        document.getElementById(
            "mainProductImage"
        );

    if (!image) {
        return;
    }


    const images =
        getProductImages(product);


    if (!images.length) {

        image.removeAttribute(
            "src"
        );

        image.alt =
            product.name ||
            "Voltica Product";

        return;

    }


    image.src =
        images[0];

    image.alt =
        product.name ||
        "Voltica Product";

}


/* =========================================================
   THUMBNAILS
   ========================================================= */

function renderThumbnails(product) {

    const container =
        document.getElementById(
            "productThumbnails"
        );

    if (!container) {
        return;
    }


    container.innerHTML = "";


    const images =
        getProductImages(product);


    images.forEach(
        (image, index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";

            button.className =
                "product-thumbnail";


            if (
                index === 0
            ) {

                button.classList.add(
                    "active"
                );

            }


            const img =
                document.createElement(
                    "img"
                );


            img.src =
                image;

            img.alt =
                `${product.name || "Product"} image ${index + 1}`;

            img.loading =
                index === 0
                    ? "eager"
                    : "lazy";


            img.onerror =
                () => {

                    button.style.display =
                        "none";

                };


            button.appendChild(
                img
            );


            button.addEventListener(
                "click",
                () => {

                    changeMainImage(
                        image,
                        button
                    );

                }
            );


            container.appendChild(
                button
            );

        }
    );

}


/* =========================================================
   CHANGE MAIN IMAGE
   ========================================================= */

function changeMainImage(
    image,
    thumbnail
) {

    const mainImage =
        document.getElementById(
            "mainProductImage"
        );

    if (!mainImage) {
        return;
    }


    mainImage.src =
        image;


    document
        .querySelectorAll(
            ".product-thumbnail"
        )
        .forEach(
            item => {

                item.classList.remove(
                    "active"
                );

            }
        );


    thumbnail?.classList.add(
        "active"
    );

}


/* =========================================================
   GALLERY
   ========================================================= */

function initializeGallery() {

    const mainImage =
        document.getElementById(
            "mainProductImage"
        );


    if (!mainImage) {
        return;
    }


    mainImage.style.cursor =
        "zoom-in";


    mainImage.addEventListener(
        "click",
        () => {

            openLightbox(
                mainImage.src
            );

        }
    );

}


/* =========================================================
   LIGHTBOX
   ========================================================= */

function initializeLightbox() {

    const lightbox =
        document.querySelector(
            ".product-lightbox"
        );


    if (!lightbox) {
        return;
    }


    const closeButton =
        lightbox.querySelector(
            ".lightbox-close"
        );


    closeButton?.addEventListener(
        "click",
        closeLightbox
    );


    lightbox.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                lightbox
            ) {

                closeLightbox();

            }

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape"
            ) {

                closeLightbox();

            }

        }
    );

}


function openLightbox(
    image
) {

    const lightbox =
        document.querySelector(
            ".product-lightbox"
        );


    const lightboxImage =
        lightbox?.querySelector(
            "img"
        );


    if (
        !lightbox ||
        !lightboxImage ||
        !image
    ) {

        return;

    }


    lightboxImage.src =
        image;


    lightbox.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";

}


function closeLightbox() {

    const lightbox =
        document.querySelector(
            ".product-lightbox"
        );


    if (!lightbox) {
        return;
    }


    lightbox.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";

}


/* =========================================================
   DESCRIPTION
   ========================================================= */

function renderDescription(
    product
) {

    const container =
        document.getElementById(
            "productDescription"
        );


    if (!container) {
        return;
    }


    const description =
        product.longDescription ||
        product.description ||
        product.shortDescription ||
        "";


    if (!description) {

        container.innerHTML =
            "<p>Premium technology selected by Voltica.</p>";

        return;

    }


    if (
        /<[a-z][\s\S]*>/i.test(
            description
        )
    ) {

        container.innerHTML =
            description;

        return;

    }


    container.innerHTML =
        String(description)
            .split(/\n\s*\n/)
            .filter(Boolean)
            .map(
                paragraph =>
                    `<p>${escapeHTML(
                        paragraph
                    ).replace(
                        /\n/g,
                        "<br>"
                    )}</p>`
            )
            .join("");

}


/* =========================================================
   FEATURES
   ========================================================= */

function renderFeatures(
    product
) {

    const container =
        document.getElementById(
            "productFeatures"
        );


    if (!container) {
        return;
    }


    const features =
        product.features ||
        product.keyFeatures ||
        product.highlights ||
        [];


    container.innerHTML = "";


    if (
        !Array.isArray(features) ||
        features.length === 0
    ) {

        return;

    }


    features.forEach(
        feature => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "feature-card";


            const title =
                typeof feature === "object"
                    ? feature.title ||
                      feature.name ||
                      feature.label ||
                      "FEATURE"
                    : String(feature);


            const description =
                typeof feature === "object"
                    ? feature.description ||
                      feature.value ||
                      ""
                    : "";


            card.innerHTML = `

                <h3>
                    ${escapeHTML(title)}
                </h3>

                ${
                    description
                        ? `
                            <p>
                                ${escapeHTML(
                                    description
                                )}
                            </p>
                        `
                        : ""
                }

            `;


            container.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   SPECIFICATIONS
   ========================================================= */

function renderSpecifications(
    product
) {

    const container =
        document.getElementById(
            "productSpecifications"
        );


    if (!container) {
        return;
    }


    const specifications =
        product.specifications ||
        product.specs ||
        {};


    container.innerHTML = "";


    if (
        Array.isArray(
            specifications
        )
    ) {

        specifications.forEach(
            item => {

                if (!item) {
                    return;
                }


                addSpecification(
                    container,
                    item.label ||
                    item.name ||
                    "SPECIFICATION",
                    item.value ||
                    ""
                );

            }
        );

        return;

    }


    Object.entries(
        specifications
    ).forEach(
        ([label, value]) => {

            addSpecification(
                container,
                label,
                value
            );

        }
    );

}


function addSpecification(
    container,
    label,
    value
) {

    const row =
        document.createElement(
            "div"
        );


    row.className =
        "specification-row";


    row.innerHTML = `

        <span class="specification-label">
            ${escapeHTML(label)}
        </span>

        <span class="specification-value">
            ${escapeHTML(
                formatSpecificationValue(
                    value
                )
            )}
        </span>

    `;


    container.appendChild(
        row
    );

}


function formatSpecificationValue(
    value
) {

    if (
        Array.isArray(value)
    ) {

        return value.join(
            ", "
        );

    }


    if (
        value &&
        typeof value === "object"
    ) {

        return Object.entries(
            value
        )
        .map(
            ([key, val]) =>
                `${key}: ${val}`
        )
        .join(
            " • "
        );

    }


    return String(
        value ?? ""
    );

}


/* =========================================================
   OPTIONS
   ========================================================= */

function renderOptions(
    product
) {

    const container =
        document.getElementById(
            "productOptions"
        );


    if (!container) {
        return;
    }


    const variants =
        product.variants ||
        product.colors ||
        [];


    container.innerHTML = "";


    if (
        !Array.isArray(variants) ||
        variants.length === 0
    ) {

        container.innerHTML = `

            <span class="section-kicker">
                STANDARD CONFIGURATION
            </span>

        `;

        return;

    }


    variants.forEach(
        (variant, index) => {

            const name =
                typeof variant === "string"
                    ? variant
                    : variant.name ||
                      variant.color ||
                      `OPTION ${index + 1}`;


            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "variant-option";


            button.textContent =
                name;


            if (
                index === 0
            ) {

                button.classList.add(
                    "active"
                );

            }


            button.addEventListener(
                "click",
                () => {

                    container
                        .querySelectorAll(
                            ".variant-option"
                        )
                        .forEach(
                            option =>
                                option.classList.remove(
                                    "active"
                                )
                        );


                    button.classList.add(
                        "active"
                    );

                }
            );


            container.appendChild(
                button
            );

        }
    );

}


/* =========================================================
   VARIANT INITIALIZATION
   ========================================================= */

function initializeVariants(
    product
) {

    const container =
        document.getElementById(
            "productVariants"
        );


    if (!container) {
        return;
    }


    const variants =
        product.variants ||
        product.colors ||
        [];


    container.innerHTML = "";


    if (
        !Array.isArray(variants) ||
        variants.length === 0
    ) {

        return;

    }


    variants.forEach(
        (variant, index) => {

            const name =
                typeof variant === "string"
                    ? variant
                    : variant.name ||
                      variant.color ||
                      `Option ${index + 1}`;


            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "color-option";


            button.textContent =
                name;


            if (
                index === 0
            ) {

                button.classList.add(
                    "active"
                );

            }


            button.addEventListener(
                "click",
                () => {

                    container
                        .querySelectorAll(
                            ".color-option"
                        )
                        .forEach(
                            option =>
                                option.classList.remove(
                                    "active"
                                )
                        );


                    button.classList.add(
                        "active"
                    );

                }
            );


            container.appendChild(
                button
            );

        }
    );

}


/* =========================================================
   LIFETIME OFFER
   ========================================================= */

function renderLifetimeOffer() {

    if (
        document.querySelector(
            ".lifetime-offer"
        )
    ) {

        return;

    }


    const pricePanel =
        document.querySelector(
            ".product-price-panel"
        );


    if (!pricePanel) {
        return;
    }


    const offer =
        document.createElement(
            "div"
        );


    offer.className =
        "lifetime-offer";


    offer.innerHTML = `

        <span class="offer-pulse"></span>

        <div>

            <strong>
                15% OFF FOR LIFE
            </strong>

            <p>
                Your exclusive Voltica customer
                benefit — 15% off future purchases
                for life.
            </p>

        </div>

    `;


    pricePanel.after(
        offer
    );

}


/* =========================================================
   STRIPE
   ========================================================= */

function setupStripeButtons(
    product
) {

    const stripeLink =
        product.stripeLink ||
        product.stripe ||
        product.stripeUrl ||
        DEFAULT_STRIPE_LINK;


    const primary =
        document.getElementById(
            "stripeButton"
        );


    const final =
        document.getElementById(
            "finalStripeButton"
        );


    [primary, final]
        .filter(Boolean)
        .forEach(
            button => {

                button.href =
                    stripeLink;

                button.target =
                    "_blank";

                button.rel =
                    "noopener noreferrer";

                button.style.display =
                    "flex";

            }
        );

}


/* =========================================================
   AVAILABILITY
   ========================================================= */

function renderAvailability(
    product
) {

    const element =
        document.getElementById(
            "productAvailability"
        );


    if (!element) {
        return;
    }


    element.innerHTML = `

        <span class="pulse-dot"></span>

        PRE-ORDER AVAILABLE

    `;

}


/* =========================================================
   IMAGES
   ========================================================= */

function getProductImages(
    product
) {

    if (
        Array.isArray(
            product.images
        )
    ) {

        return product.images
            .map(
                normalizeImagePath
            )
            .filter(Boolean);

    }


    if (
        typeof product.image ===
        "string"
    ) {

        return [
            normalizeImagePath(
                product.image
            )
        ];

    }


    if (
        typeof product.thumbnail ===
        "string"
    ) {

        return [
            normalizeImagePath(
                product.thumbnail
            )
        ];

    }


    return [];

}


function normalizeImagePath(
    image
) {

    if (
        typeof image ===
        "object" &&
        image
    ) {

        image =
            image.path ||
            image.src ||
            image.url ||
            image.name ||
            "";

    }


    if (!image) {
        return "";
    }


    image =
        String(image).trim();


    /*
     * Keep complete URLs.
     */

    if (
        /^https?:\/\//i.test(
            image
        )
    ) {

        return image;

    }


    /*
     * Keep correctly rooted
     * local paths.
     */

    if (
        image.startsWith(
            "assets/"
        )
    ) {

        return image;

    }


    if (
        image.startsWith(
            "./assets/"
        )
    ) {

        return image.substring(
            2
        );

    }


    /*
     * If only the filename is
     * stored, point to the image
     * directory.
     */

    if (
        !image.includes("/")
    ) {

        return (
            "assets/images/" +
            image
        );

    }


    return image;

}


/* =========================================================
   ERROR
   ========================================================= */

function showProductError() {

    const page =
        document.querySelector(
            ".product-page"
        );


    if (!page) {
        return;
    }


    page.innerHTML = `

        <section class="acrylic-panel product-error">

            <span class="section-kicker">
                VOLTICA STORE
            </span>

            <h1>
                PRODUCT NOT FOUND
            </h1>

            <p>
                This product could not be found
                in the current collection.
            </p>

            <a
                href="store.html"
                class="back-store-button"
            >
                RETURN TO STORE
            </a>

        </section>

    `;

}


/* =========================================================
   PRICE
   ========================================================= */

function formatPrice(
    value
) {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {

        return "—";

    }


    const number =
        Number(value);


    if (
        Number.isNaN(number)
    ) {

        return String(value);

    }


    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    ).format(
        number
    );

}


/* =========================================================
   TEXT
   ========================================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {
        return;
    }


    element.textContent =
        value ?? "";

}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

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


/* =========================================================
   PUBLIC API
   ========================================================= */

window.VolticaProductView = {

    reload() {

        initializeProductView();

    },

    getCurrentProduct() {

        return getProductFromURL();

    },

    getProductImages,

    formatPrice

};


/* =========================================================
   ONLINE
   ========================================================= */

console.log(
    "VOLTICA PRODUCT VIEW — ONLINE"
);
