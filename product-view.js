/* =========================================================
   VOLTICA STORE — PRODUCT VIEW.JS
   Complete Product Detail Engine
   ========================================================= */

"use strict";


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
   GET PRODUCT ID FROM URL
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


    if (
        !Array.isArray(
            window.volticaProducts
        )
    ) {

        console.error(
            "VOLTICA: products.js was not loaded."
        );

        return null;

    }


    return window.volticaProducts.find(
        product =>
            String(product.id) ===
            String(productId)
    ) || null;

}


/* =========================================================
   RENDER PRODUCT
   ========================================================= */

function renderProduct(product) {

    /*
     * CATEGORY
     */

    setText(
        "productCategory",
        product.category ||
        "TECHNOLOGY"
    );


    /*
     * PRODUCT NAME
     */

    setText(
        "productName",
        product.name ||
        "Voltica Product"
    );


    /*
     * SHORT DESCRIPTION
     */

    setText(
        "productShortDescription",
        product.shortDescription ||
        product.description ||
        ""
    );


    /*
     * PRICE
     */

    setText(
        "productPrice",
        formatPrice(
            product.price
        )
    );


    /*
     * CURRENCY
     */

    setText(
        "productCurrency",
        product.currency ||
        "USD"
    );


    /*
     * BADGE
     */

    setText(
        "productBadge",
        product.badge ||
        "PREMIUM"
    );


    /*
     * MAIN IMAGE
     */

    renderMainImage(
        product
    );


    /*
     * THUMBNAILS
     */

    renderThumbnails(
        product
    );


    /*
     * DESCRIPTION
     */

    renderDescription(
        product
    );


    /*
     * FEATURES
     */

    renderFeatures(
        product
    );


    /*
     * SPECIFICATIONS
     */

    renderSpecifications(
        product
    );


    /*
     * OPTIONS
     */

    renderOptions(
        product
    );


    /*
     * VARIANTS
     */

    initializeVariants(
        product
    );


    /*
     * STRIPE
     */

    setupStripeButtons(
        product
    );


    /*
     * AVAILABILITY
     */

    renderAvailability(
        product
    );


    /*
     * REFERENCE PRICE
     */

    renderReferencePrice(
        product
    );


    /*
     * FINAL PRODUCT NAME
     */

    setText(
        "finalProductName",
        product.name ||
        "DISCOVER THE FUTURE."
    );


    /*
     * PAGE TITLE
     */

    document.title =
        `${product.name || "Product"} — Voltica Store`;

}


/* =========================================================
   MAIN IMAGE
   ========================================================= */

function renderMainImage(
    product
) {

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


    if (
        images.length === 0
    ) {

        mainImage.removeAttribute(
            "src"
        );

        mainImage.alt =
            product.name ||
            "Voltica Product";

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

function renderThumbnails(
    product
) {

    const container =
        document.getElementById(
            "productThumbnails"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        "";


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


            button.dataset.image =
                image;


            const img =
                document.createElement(
                    "img"
                );


            img.src =
                image;


            img.alt =
                `${product.name || "Product"} ${index + 1}`;


            img.loading =
                "lazy";


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


    const closeButton =
        document.querySelector(
            ".lightbox-close"
        );


    if (!lightbox) {

        return;

    }


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
        document.querySelector(
            ".product-lightbox img"
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

        container.innerHTML = `

            <p>
                Premium technology selected
                by Voltica.
            </p>

        `;

        return;

    }


    /*
     * Existing HTML
     */

    if (
        /<[a-z][\s\S]*>/i.test(
            description
        )
    ) {

        container.innerHTML =
            description;

        return;

    }


    /*
     * Normal text
     */

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


    container.innerHTML =
        "";


    if (
        !Array.isArray(
            features
        ) ||
        features.length === 0
    ) {

        container.innerHTML = `

            <article class="feature-card">

                <span class="pulse-dot"></span>

                <h3>
                    PREMIUM TECHNOLOGY
                </h3>

                <p>
                    Selected for the
                    Voltica collection.
                </p>

            </article>

        `;

        return;

    }


    features.forEach(
        (
            feature,
            index
        ) => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "feature-card";


            const title =
                typeof feature ===
                "string"
                    ? feature
                    : feature.title ||
                      feature.name ||
                      `FEATURE ${index + 1}`;


            const text =
                typeof feature ===
                "string"
                    ? ""
                    : feature.description ||
                      feature.text ||
                      "";


            card.innerHTML = `

                <span class="pulse-dot"></span>

                <h3>
                    ${escapeHTML(
                        title
                    )}
                </h3>

                ${
                    text
                        ? `
                            <p>
                                ${escapeHTML(
                                    text
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


    container.innerHTML =
        "";


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


                const label =
                    specification.label ||
                    specification.name ||
                    "";


                const value =
                    specification.value ||
                    "";


                if (!label) {

                    return;

                }


                addSpecificationRow(
                    container,
                    label,
                    value
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

            addSpecificationRow(
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

function addSpecificationRow(
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

            ${escapeHTML(
                label
            )}

        </span>


        <strong class="specification-value">

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


    const variants =
        product.variants ||
        product.colors ||
        [];


    container.innerHTML =
        "";


    if (
        !Array.isArray(
            variants
        ) ||
        variants.length === 0
    ) {

        container.innerHTML = `

            <div class="option-empty">

                <span>
                    STANDARD CONFIGURATION
                </span>

                <strong>
                    ONE CONFIGURATION AVAILABLE
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

            const option =
                document.createElement(
                    "div"
                );


            option.className =
                "product-option";


            const name =
                typeof variant ===
                "string"
                    ? variant
                    : variant.name ||
                      variant.color ||
                      `OPTION ${index + 1}`;


            option.innerHTML = `

                <span>
                    OPTION ${index + 1}
                </span>

                <strong>
                    ${escapeHTML(
                        name
                    )}
                </strong>

            `;


            container.appendChild(
                option
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


    container.innerHTML =
        "";


    if (
        !Array.isArray(
            variants
        ) ||
        variants.length === 0
    ) {

        return;

    }


    const label =
        document.createElement(
            "div"
        );


    label.className =
        "variant-label";


    label.innerHTML = `

        <span>
            SELECT OPTION
        </span>

        <strong id="selectedVariant">
            ${escapeHTML(
                getVariantName(
                    variants[0],
                    0
                )
            )}
        </strong>

    `;


    container.appendChild(
        label
    );


    const buttons =
        document.createElement(
            "div"
        );


    buttons.className =
        "variant-buttons";


    variants.forEach(
        (
            variant,
            index
        ) => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "variant-button";


            const name =
                getVariantName(
                    variant,
                    index
                );


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

                    buttons
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


                    const selected =
                        document.getElementById(
                            "selectedVariant"
                        );


                    if (selected) {

                        selected.textContent =
                            name;

                    }

                }
            );


            buttons.appendChild(
                button
            );

        }
    );


    container.appendChild(
        buttons
    );

}


/* =========================================================
   VARIANT NAME
   ========================================================= */

function getVariantName(
    variant,
    index
) {

    if (
        typeof variant ===
        "string"
    ) {

        return variant;

    }


    if (
        variant &&
        typeof variant ===
        "object"
    ) {

        return (
            variant.name ||
            variant.color ||
            variant.title ||
            `Option ${index + 1}`
        );

    }


    return `Option ${index + 1}`;

}


/* =========================================================
   STRIPE BUTTONS
   ========================================================= */

function setupStripeButtons(
    product
) {

    const stripeLink =
        product.stripeLink ||
        product.stripe ||
        product.stripeUrl ||
        "";


    const buttons = [

        document.getElementById(
            "stripeButton"
        ),

        document.getElementById(
            "finalStripeButton"
        )

    ];


    buttons.forEach(
        button => {

            if (!button) {

                return;

            }


            if (!stripeLink) {

                button.style.display =
                    "none";

                return;

            }


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


    if (
        product.availability
    ) {

        element.innerHTML = `

            <span class="pulse-dot"></span>

            <span>
                ${escapeHTML(
                    product.availability
                )}
            </span>

        `;

        return;

    }


    element.innerHTML = `

        <span class="pulse-dot"></span>

        <span>
            AVAILABLE NOW
        </span>

    `;

}


/* =========================================================
   REFERENCE PRICE
   ========================================================= */

function renderReferencePrice(
    product
) {

    /*
     * The current HTML does not have
     * a dedicated reference-price element.
     *
     * We add it directly under the price
     * panel when necessary.
     */

    if (
        product.referencePrice ===
        undefined ||
        product.referencePrice ===
        null ||
        product.referencePrice === ""
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


    const referencePrice =
        Number(
            product.referencePrice
        );


    if (
        Number.isNaN(
            referencePrice
        ) ||
        referencePrice <= 0
    ) {

        return;

    }


    let element =
        document.getElementById(
            "referencePrice"
        );


    if (!element) {

        element =
            document.createElement(
                "span"
            );


        element.id =
            "referencePrice";


        element.className =
            "product-reference-price";


        pricePanel.appendChild(
            element
        );

    }


    element.textContent =
        `Reference price: ${formatPrice(
            referencePrice
        )}`;

}


/* =========================================================
   IMAGE SYSTEM
   ========================================================= */

function getProductImages(
    product
) {

    const productId =
        String(
            product.id || ""
        )
        .toLowerCase();


    const productName =
        String(
            product.name || ""
        )
        .toLowerCase();


    /*
     * =====================================================
     * G451 — EXACT IMAGE SET
     * =====================================================
     *
     * These are the confirmed Voltica files.
     */

    if (
        productId.includes("g451") ||
        productName.includes("g451")
    ) {

        return [

            "assets/images/g451-1.webp",

            "assets/images/g451-2.webp",

            "assets/images/g451-3.webp",

            "assets/images/g451-4.webp",

            "assets/images/g451-6.webp",

            "assets/images/g451-7.webp"

        ];

    }


    /*
     * =====================================================
     * NORMAL IMAGE DATABASE
     * =====================================================
     */

    if (
        Array.isArray(
            product.images
        )
    ) {

        return product.images
            .map(
                image => {

                    /*
                     * Plain filename/path
                     */

                    if (
                        typeof image ===
                        "string"
                    ) {

                        return normalizeImagePath(
                            image
                        );

                    }


                    /*
                     * Object with path
                     */

                    if (
                        image &&
                        typeof image.path ===
                        "string"
                    ) {

                        return normalizeImagePath(
                            image.path
                        );

                    }


                    /*
                     * Object with name
                     */

                    if (
                        image &&
                        typeof image.name ===
                        "string"
                    ) {

                        return normalizeImagePath(
                            image.name
                        );

                    }


                    return "";

                }
            )
            .filter(Boolean);

    }


    /*
     * SINGLE IMAGE
     */

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


    /*
     * THUMBNAIL
     */

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


/* =========================================================
   NORMALIZE IMAGE PATH
   ========================================================= */

function normalizeImagePath(
    image
) {

    if (!image) {

        return "";

    }


    const value =
        String(
            image
        ).trim();


    if (!value) {

        return "";

    }


    /*
     * Full URL
     */

    if (
        /^https?:\/\//i.test(
            value
        )
    ) {

        return value;

    }


    /*
     * Already correct
     */

    if (
        value.startsWith(
            "assets/images/"
        )
    ) {

        return value;

    }


    /*
     * Relative ./assets/images/
     */

    if (
        value.startsWith(
            "./assets/images/"
        )
    ) {

        return value.substring(
            2
        );

    }


    /*
     * Filename only
     */

    if (
        !value.includes("/")
    ) {

        return (
            "assets/images/" +
            value
        );

    }


    return value;

}


/* =========================================================
   PRICE
   ========================================================= */

function formatPrice(
    price
) {

    if (
        price === undefined ||
        price === null ||
        price === ""
    ) {

        return "—";

    }


    const numericPrice =
        Number(
            price
        );


    if (
        Number.isNaN(
            numericPrice
        )
    ) {

        return String(
            price
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
   PRODUCT ERROR
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

        <div class="product-error">

            <span class="pulse-dot"></span>

            <h1>
                PRODUCT NOT FOUND
            </h1>

            <p>
                This Voltica product could not
                be located in the current collection.
            </p>

            <a
                href="store.html"
                class="back-store-button"
            >
                RETURN TO STORE
            </a>

        </div>

    `;

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

    reload: function () {

        initializeProductView();

    },


    getCurrentProduct: function () {

        return getProductFromURL();

    },


    getProductImages: function (
        product
    ) {

        return getProductImages(
            product
        );

    }

};


/* =========================================================
   READY
   ========================================================= */

console.log(
    "VOLTICA PRODUCT VIEW ENGINE — ONLINE"
);
