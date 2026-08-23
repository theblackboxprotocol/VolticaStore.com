/* =========================================================
   VOLTICA STORE
   PRODUCT-VIEW.JS
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

    console.log(
        "VOLTICA PRODUCT:",
        product
    );

    renderProduct(product);

    initializeGallery();

    initializeLightbox();

    initializeVariants(product);

}


/* =========================================================
   GET PRODUCT ID
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

        console.warn(
            "VOLTICA: No product ID in URL."
        );

        return null;

    }


    /*
     * FIRST:
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
     * SECOND:
     * Admin product database
     */

    try {

        const saved =
            localStorage.getItem(
                "voltica_products_admin"
            );

        if (saved) {

            const parsed =
                JSON.parse(saved);

            if (
                Array.isArray(parsed)
            ) {

                const product =
                    parsed.find(
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
            "VOLTICA: Unable to read admin product database.",
            error
        );

    }


    console.warn(
        "VOLTICA: Product not found:",
        productId
    );

    return null;

}


/* =========================================================
   RENDER PRODUCT
   ========================================================= */

function renderProduct(product) {


    /* CATEGORY */

    setText(
        "productCategory",
        product.category ||
        "TECHNOLOGY"
    );


    /* NAME */

    setText(
        "productName",
        product.name ||
        "Voltica Product"
    );


    /* SHORT DESCRIPTION */

    setText(
        "productShortDescription",
        product.shortDescription ||
        product.description ||
        ""
    );


    /* PRICE */

    setText(
        "productPrice",
        formatPrice(
            product.price
        )
    );


    /* CURRENCY */

    setText(
        "productCurrency",
        product.currency ||
        "USD"
    );


    /* BADGE */

    setText(
        "productBadge",
        product.badge ||
        "PREMIUM"
    );


    /* MAIN IMAGE */

    renderMainImage(
        product
    );


    /* THUMBNAILS */

    renderThumbnails(
        product
    );


    /* DESCRIPTION */

    renderDescription(
        product
    );


    /* FEATURES */

    renderFeatures(
        product
    );


    /* SPECIFICATIONS */

    renderSpecifications(
        product
    );


    /* OPTIONS */

    renderOptions(
        product
    );


    /* AVAILABILITY */

    renderAvailability(
        product
    );


    /* STRIPE */

    setupStripeButtons(
        product
    );


    /* FINAL PRODUCT NAME */

    setText(
        "finalProductName",
        product.name ||
        "DISCOVER THE FUTURE."
    );


    /* PAGE TITLE */

    document.title =
        `${product.name || "Product"} — Voltica Store`;

}


/* =========================================================
   IMAGE PATH NORMALIZER
   ========================================================= */

function normalizeImagePath(
    image
) {

    if (!image) {

        return "";

    }


    let path = "";


    /*
     * String image
     */

    if (
        typeof image ===
        "string"
    ) {

        path = image;

    }


    /*
     * Object image
     */

    else if (
        typeof image ===
        "object"
    ) {

        path =
            image.path ||
            image.src ||
            image.url ||
            image.name ||
            "";

    }


    if (!path) {

        return "";

    }


    path =
        String(path)
            .trim();


    /*
     * Fix Windows paths
     */

    path =
        path.replace(
            /\\/g,
            "/"
        );


    /*
     * If already correct
     */

    if (
        path.startsWith(
            "assets/images/"
        )
    ) {

        return path;

    }


    /*
     * Remove leading slash
     */

    path =
        path.replace(
            /^\/+/,
            ""
        );


    /*
     * If only filename
     *
     * g451-1.webp
     */

    if (
        !path.includes("/")
    ) {

        return (
            "assets/images/" +
            path
        );

    }


    /*
     * If path contains assets
     */

    const assetsIndex =
        path.indexOf(
            "assets/images/"
        );

    if (
        assetsIndex !== -1
    ) {

        return path.substring(
            assetsIndex
        );

    }


    return path;

}


/* =========================================================
   GET PRODUCT IMAGES
   ========================================================= */

function getProductImages(
    product
) {

    let images = [];


    /*
     * Standard images array
     */

    if (
        Array.isArray(
            product.images
        )
    ) {

        images =
            product.images
                .map(
                    normalizeImagePath
                )
                .filter(Boolean);

    }


    /*
     * Single image fallback
     */

    if (
        images.length === 0 &&
        product.image
    ) {

        images = [
            normalizeImagePath(
                product.image
            )
        ];

    }


    /*
     * Thumbnail fallback
     */

    if (
        images.length === 0 &&
        product.thumbnail
    ) {

        images = [
            normalizeImagePath(
                product.thumbnail
            )
        ];

    }


    /*
     * G451 DIRECT FALLBACK
     *
     * Your actual Voltica files:
     *
     * g451-1.webp
     * g451-2.webp
     * g451-3.webp
     * g451-4.webp
     * g451-6.webp
     * g451-7.webp
     */

    if (
        images.length === 0 &&
        (
            String(product.id)
                .toLowerCase()
                .includes("g451")
            ||
            String(product.name || "")
                .toLowerCase()
                .includes("g451")
        )
    ) {

        images = [

            "assets/images/g451-1.webp",

            "assets/images/g451-2.webp",

            "assets/images/g451-3.webp",

            "assets/images/g451-4.webp",

            "assets/images/g451-6.webp",

            "assets/images/g451-7.webp"

        ];

    }


    return images;

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


            /*
             * If an image fails,
             * hide only that thumbnail.
             */

            img.addEventListener(
                "error",
                () => {

                    console.warn(
                        "VOLTICA IMAGE ERROR:",
                        image
                    );

                    button.style.display =
                        "none";

                }
            );


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

            if (
                mainImage.src
            ) {

                openLightbox(
                    mainImage.src
                );

            }

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


/* =========================================================
   OPEN LIGHTBOX
   ========================================================= */

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


/* =========================================================
   CLOSE LIGHTBOX
   ========================================================= */

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
                Premium technology selected by Voltica.
            </p>
        `;

        return;

    }


    /*
     * Preserve existing HTML
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

        container.innerHTML = `

            <div class="feature-card">

                <span class="pulse-dot"></span>

                <h3>
                    PREMIUM TECHNOLOGY
                </h3>

                <p>
                    Selected for the Voltica collection.
                </p>

            </div>

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
                typeof feature === "object"
                    ? (
                        feature.title ||
                        feature.name ||
                        `FEATURE ${index + 1}`
                    )
                    : `FEATURE ${index + 1}`;


            const text =
                typeof feature === "object"
                    ? (
                        feature.description ||
                        feature.value ||
                        feature.text ||
                        ""
                    )
                    : String(feature);


            card.innerHTML = `

                <span class="pulse-dot"></span>

                <h3>
                    ${escapeHTML(title)}
                </h3>

                <p>
                    ${escapeHTML(text)}
                </p>

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


    /*
     * Array format
     */

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
                    specification.name;


                const value =
                    specification.value ||
                    specification.description ||
                    "";


                if (
                    label
                ) {

                    addSpecification(
                        container,
                        label,
                        value
                    );

                }

            }
        );

    }


    /*
     * Object format
     */

    else if (
        typeof specifications ===
        "object"
    ) {

        Object.entries(
            specifications
        ).forEach(
            (
                [label, value]
            ) => {

                addSpecification(
                    container,
                    label,
                    value
                );

            }
        );

    }


    /*
     * Fallback
     */

    if (
        container.children.length ===
        0
    ) {

        container.innerHTML = `

            <div class="specification-row">

                <span>
                    PRODUCT
                </span>

                <strong>
                    VOLTICA
                </strong>

            </div>

        `;

    }

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
            ${escapeHTML(label)}
        </span>

        <strong>
            ${escapeHTML(value)}
        </strong>

    `;


    container.appendChild(
        row
    );

}


/* =========================================================
   OPTIONS / COLORS
   ========================================================= */

function renderOptions(
    product
) {

    const container =
        document.getElementById(
            "productOptions"
        );


    const variantContainer =
        document.getElementById(
            "productVariants"
        );


    const variants =
        product.variants ||
        product.colors ||
        [];


    if (
        !Array.isArray(
            variants
        ) ||
        variants.length === 0
    ) {

        if (container) {

            container.innerHTML = `
                <p>
                    Standard configuration.
                </p>
            `;

        }

        return;

    }


    if (variantContainer) {

        variantContainer.innerHTML = "";

    }


    if (container) {

        container.innerHTML = "";

    }


    variants.forEach(
        (
            variant,
            index
        ) => {

            const name =
                typeof variant === "string"
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


            if (container) {

                container.appendChild(
                    button
                );

            }


            if (
                variantContainer
            ) {

                const clone =
                    button.cloneNode(
                        true
                    );


                if (
                    index !== 0
                ) {

                    clone.classList.remove(
                        "active"
                    );

                }


                variantContainer.appendChild(
                    clone
                );

            }

        }
    );

}


/* =========================================================
   VARIANTS COMPATIBILITY
   ========================================================= */

function initializeVariants(
    product
) {

    /*
     * Kept for compatibility
     * with older Voltica code.
     */

    renderOptions(
        product
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


    const availability =
        product.availability ||
        product.stockStatus ||
        "AVAILABLE";


    element.innerHTML = `

        <span class="pulse-dot"></span>

        <span>
            ${escapeHTML(
                availability
            )}
        </span>

    `;

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


    const number =
        Number(price);


    if (
        Number.isNaN(number)
    ) {

        return String(price);

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
        number
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


    getProductImages(product) {

        return getProductImages(
            product
        );

    }

};


console.log(
    "VOLTICA PRODUCT VIEW — ONLINE"
);
