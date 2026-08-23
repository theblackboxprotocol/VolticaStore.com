/* =========================================================
   VOLTICA STORE
   PRODUCT-VIEW.JS
   Q45 PRODUCT ENGINE
   ========================================================= */

"use strict";


/* =========================================================
   VOLTICA Q45 DATABASE
   ========================================================= */

const VOLTICA_Q45 = {

    id: "q45",

    name: "Voltica Q45",

    category: "PREMIUM AUDIO",

    badge: "FEATURED",

    price: 189.99,

    currency: "USD",

    referencePrice: null,

    shortDescription:
        "Premium ANC Wireless Headphones.",

    description:
        "Meet the Voltica Q45 — premium wireless headphones built for immersive sound, active noise cancellation and comfortable everyday listening. Designed for music, travel, work and everything in between.",

    images: [

        "assets/images/q451-1.webp",
        "assets/images/q451-2.webp",
        "assets/images/q451-3.webp",
        "assets/images/q451-4.webp",
        "assets/images/q451-6.webp",
        "assets/images/q451-7.webp"

    ],

    variants: [

        "Black"

    ],

    features: [

        {
            title: "ACTIVE NOISE CANCELLATION",
            value: "ANC"
        },

        {
            title: "AUDIO",
            value: "HI-FI"
        },

        {
            title: "CONNECTIVITY",
            value: "WIRELESS"
        },

        {
            title: "DESIGN",
            value: "OVER-EAR"
        },

        {
            title: "COMFORT",
            value: "EXTENDED LISTENING"
        },

        {
            title: "USE",
            value: "MUSIC · TRAVEL · WORK"
        }

    ],

    specifications: {

        "Product": "Voltica Q45",

        "Type": "Wireless Over-Ear Headphones",

        "Audio": "Hi-Fi",

        "Noise Cancellation":
            "Active Noise Cancellation",

        "Connectivity":
            "Bluetooth Wireless",

        "Design":
            "Over-Ear",

        "Color":
            "Black",

        "Currency":
            "USD"

    },

    stripeLink:
        "https://buy.stripe.com/eVqeVe2hNgILbyoaWK2Ji0j"

};


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeProductView
);


function initializeProductView() {

    const product =
        getProductFromURL();


    if (!product) {

        showProductError();

        return;

    }


    renderProduct(product);

    initializeGallery();

    initializeVariants(product);

    initializePurchaseButtons(product);

    initializeLightbox();

}


/* =========================================================
   GET PRODUCT ID
   ========================================================= */

function getProductIdFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    return (
        params.get("id") ||
        "q45"
    ).toLowerCase();

}


/* =========================================================
   FIND PRODUCT
   ========================================================= */

function getProductFromURL() {

    const productId =
        getProductIdFromURL();


    /*
     * Q45 is the current Voltica product.
     */

    if (
        productId === "q45" ||
        productId === "q451" ||
        productId === "q45-1"
    ) {

        return VOLTICA_Q45;

    }


    /*
     * If products.js exists,
     * allow other products to work too.
     */

    if (
        Array.isArray(
            window.volticaProducts
        )
    ) {

        const externalProduct =
            window.volticaProducts.find(
                product =>
                    String(
                        product.id
                    ).toLowerCase() ===
                    productId
            );


        if (externalProduct) {

            return normalizeProduct(
                externalProduct
            );

        }

    }


    return null;

}


/* =========================================================
   NORMALIZE EXTERNAL PRODUCT
   ========================================================= */

function normalizeProduct(product) {

    return {

        ...product,

        images:
            getProductImages(
                product
            ),

        features:
            product.features ||
            product.keyFeatures ||
            product.highlights ||
            [],

        specifications:
            product.specifications ||
            product.specs ||
            {},

        stripeLink:
            product.stripeLink ||
            product.stripe ||
            product.stripeUrl ||
            ""

    };

}


/* =========================================================
   RENDER PRODUCT
   ========================================================= */

function renderProduct(product) {

    /*
     * Category
     */

    setText(
        "productCategory",
        product.category ||
        "PREMIUM AUDIO"
    );


    /*
     * Product name
     */

    setText(
        "productName",
        product.name ||
        "Voltica Product"
    );


    /*
     * Short description
     */

    setText(
        "productShortDescription",
        product.shortDescription ||
        product.description ||
        ""
    );


    /*
     * Price
     */

    setText(
        "productPrice",
        formatPrice(
            product.price
        )
    );


    /*
     * Currency
     */

    setText(
        "productCurrency",
        product.currency ||
        "USD"
    );


    /*
     * Badge
     */

    setText(
        "productBadge",
        product.badge ||
        "PREMIUM"
    );


    /*
     * Main image
     */

    renderMainImage(
        product
    );


    /*
     * Thumbnails
     */

    renderThumbnails(
        product
    );


    /*
     * Description
     */

    renderDescription(
        product
    );


    /*
     * Features
     */

    renderFeatures(
        product
    );


    /*
     * Specifications
     */

    renderSpecifications(
        product
    );


    /*
     * Options
     */

    renderOptions(
        product
    );


    /*
     * Availability
     */

    renderAvailability(
        product
    );


    /*
     * Final product name
     */

    setText(
        "finalProductName",
        product.name ||
        "DISCOVER THE FUTURE."
    );


    /*
     * Document title
     */

    document.title =
        `${product.name || "Voltica Product"} — Voltica Store`;

}


/* =========================================================
   MAIN IMAGE
   ========================================================= */

function renderMainImage(product) {

    const mainImage =
        document.getElementById(
            "mainProductImage"
        );


    if (!mainImage) {

        return;

    }


    const images =
        getProductImages(
            product
        );


    if (!images.length) {

        mainImage.removeAttribute(
            "src"
        );

        mainImage.alt =
            product.name || "Voltica Product";

        return;

    }


    mainImage.src =
        images[0];

    mainImage.alt =
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
        getProductImages(
            product
        );


    images.forEach(
        (
            image,
            index
        ) => {

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


            button.innerHTML = `

                <img
                    src="${escapeAttribute(image)}"
                    alt="${escapeAttribute(
                        product.name ||
                        "Voltica Product"
                    )}"
                    loading="lazy"
                >

            `;


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
            button => {

                button.classList.remove(
                    "active"
                );

            }
        );


    if (thumbnail) {

        thumbnail.classList.add(
            "active"
        );

    }

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


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeLightbox
        );

    }


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
        product.description ||
        product.longDescription ||
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


    const paragraphs =
        String(
            description
        )
        .split(
            /\n\s*\n/
        )
        .filter(
            Boolean
        );


    container.innerHTML =
        paragraphs
            .map(
                paragraph => {

                    return `

                        <p>
                            ${escapeHTML(
                                paragraph
                            ).replace(
                                /\n/g,
                                "<br>"
                            )}
                        </p>

                    `;

                }
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


    container.innerHTML = "";


    const features =
        product.features ||
        [];


    if (
        !Array.isArray(
            features
        ) ||
        !features.length
    ) {

        return;

    }


    features.forEach(
        feature => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "feature-card";


            let title = "";
            let value = "";


            if (
                typeof feature ===
                "string"
            ) {

                title =
                    "FEATURE";

                value =
                    feature;

            } else {

                title =
                    feature.title ||
                    feature.name ||
                    feature.label ||
                    "FEATURE";

                value =
                    feature.value ||
                    feature.description ||
                    feature.text ||
                    "";

            }


            card.innerHTML = `

                <span class="pulse-dot"></span>

                <strong>
                    ${escapeHTML(
                        title
                    )}
                </strong>

                <span>
                    ${escapeHTML(
                        value
                    )}
                </span>

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


    container.innerHTML = "";


    const specifications =
        product.specifications ||
        product.specs ||
        {};


    if (
        Array.isArray(
            specifications
        )
    ) {

        specifications.forEach(
            specification => {

                if (
                    !specification
                ) {

                    return;

                }


                addSpecification(
                    container,
                    specification.label ||
                    specification.name ||
                    "SPECIFICATION",
                    specification.value ||
                    ""
                );

            }
        );

        return;

    }


    Object.entries(
        specifications
    ).forEach(
        (
            [
                label,
                value
            ]
        ) => {

            addSpecification(
                container,
                label,
                value
            );

        }
    );

}


/* =========================================================
   ADD SPECIFICATION
   ========================================================= */

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

        <span>
            ${escapeHTML(
                label
            )}
        </span>

        <strong>
            ${escapeHTML(
                value
            )}
        </strong>

    `;


    container.appendChild(
        row
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


    container.innerHTML = "";


    const variants =
        product.variants ||
        product.colors ||
        [];


    if (
        !Array.isArray(
            variants
        ) ||
        !variants.length
    ) {

        container.innerHTML = `

            <div class="option-item">

                <span>
                    COLOR
                </span>

                <strong>
                    BLACK
                </strong>

            </div>

        `;

        return;

    }


    variants.forEach(
        (
            variant,
            index
        ) => {

            const name =
                typeof variant ===
                "string"

                    ? variant

                    : (
                        variant.name ||
                        variant.color ||
                        `OPTION ${index + 1}`
                    );


            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "product-option-button";


            if (
                index === 0
            ) {

                button.classList.add(
                    "active"
                );

            }


            button.textContent =
                name;


            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".product-option-button"
                        )
                        .forEach(
                            item => {

                                item.classList.remove(
                                    "active"
                                );

                            }
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
   VARIANTS
   ========================================================= */

function initializeVariants(
    product
) {

    /*
     * The HTML has a productVariants
     * container as well as productOptions.
     */

    const container =
        document.getElementById(
            "productVariants"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    const variants =
        product.variants ||
        product.colors ||
        [];


    if (
        !Array.isArray(
            variants
        ) ||
        !variants.length
    ) {

        return;

    }


    const label =
        document.createElement(
            "span"
        );


    label.className =
        "variant-label";


    label.textContent =
        "SELECT OPTION";


    container.appendChild(
        label
    );


    variants.forEach(
        (
            variant,
            index
        ) => {

            const name =
                typeof variant ===
                "string"

                    ? variant

                    : (
                        variant.name ||
                        variant.color ||
                        `OPTION ${index + 1}`
                    );


            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "variant-button";


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
                            ".variant-button"
                        )
                        .forEach(
                            item => {

                                item.classList.remove(
                                    "active"
                                );

                            }
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

        <span>
            PRE-ORDER AVAILABLE
        </span>

    `;

}


/* =========================================================
   PURCHASE BUTTONS
   ========================================================= */

function initializePurchaseButtons(
    product
) {

    const stripeLink =
        product.stripeLink ||
        "";


    const primary =
        document.getElementById(
            "stripeButton"
        );


    const final =
        document.getElementById(
            "finalStripeButton"
        );


    if (primary) {

        if (stripeLink) {

            primary.href =
                stripeLink;

            primary.target =
                "_blank";

            primary.rel =
                "noopener noreferrer";

            primary.style.display =
                "flex";

        } else {

            primary.style.display =
                "none";

        }

    }


    if (final) {

        if (stripeLink) {

            final.href =
                stripeLink;

            final.target =
                "_blank";

            final.rel =
                "noopener noreferrer";

            final.style.display =
                "inline-flex";

        } else {

            final.style.display =
                "none";

        }

    }

}


/* =========================================================
   PRODUCT ERROR
   ========================================================= */

function showProductError() {

    const page =
        document.getElementById(
            "productPage"
        );


    if (!page) {

        return;

    }


    page.innerHTML = `

        <section
            class="product-error"
        >

            <span class="pulse-dot"></span>

            <h1>
                PRODUCT NOT FOUND
            </h1>

            <p>
                The requested Voltica product
                is not available.
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
   IMAGE HELPERS
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
                image => {

                    if (
                        typeof image ===
                        "string"
                    ) {

                        return image;

                    }


                    if (
                        image &&
                        typeof image.path ===
                        "string"
                    ) {

                        return image.path;

                    }


                    if (
                        image &&
                        typeof image.name ===
                        "string"
                    ) {

                        return (
                            "assets/images/" +
                            image.name
                        );

                    }


                    return "";

                }
            )
            .filter(
                Boolean
            );

    }


    if (
        product.image
    ) {

        return [
            product.image
        ];

    }


    if (
        product.thumbnail
    ) {

        return [
            product.thumbnail
        ];

    }


    return [];

}


/* =========================================================
   PRICE
   ========================================================= */

function formatPrice(
    price
) {

    const numericPrice =
        Number(price);


    if (
        Number.isNaN(
            numericPrice
        )
    ) {

        return String(
            price ?? "—"
        );

    }


    return new Intl.NumberFormat(
        "en-US",
        {

            style:
                "currency",

            currency:
                "USD",

            minimumFractionDigits:
                2,

            maximumFractionDigits:
                2

        }
    ).format(
        numericPrice
    );

}


/* =========================================================
   TEXT HELPER
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
   SECURITY
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


function escapeAttribute(
    value
) {

    return escapeHTML(
        value
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

    getProduct() {

        return VOLTICA_Q45;

    }

};


/* =========================================================
   READY
   ========================================================= */

console.log(
    "VOLTICA Q45 PRODUCT ENGINE — ONLINE"
);
