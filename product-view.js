/* =========================================================
   VOLTICA STORE
   PRODUCT-VIEW.JS
   Complete Product Detail Engine
   Compatible with store.js + products.js + Admin Manager
   ========================================================= */

"use strict";


/* =========================================================
   CONFIGURATION
   ========================================================= */

const VOLTICA_PRODUCT_STORAGE_KEY =
    "voltica_products_admin";


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

        console.error(
            "VOLTICA PRODUCT VIEW: Product not found."
        );

        showProductError();

        return;

    }


    console.log(
        "VOLTICA PRODUCT VIEW:",
        product
    );


    renderProduct(
        product
    );


    initializeGallery();

    initializeLightbox();

    initializeVariants(
        product
    );

}


/* =========================================================
   URL PRODUCT ID
   ========================================================= */

function getProductIdFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    return params.get(
        "id"
    );

}


/* =========================================================
   GET PRODUCT
   ========================================================= */

function getProductFromURL() {

    const productId =
        getProductIdFromURL();


    if (!productId) {

        console.error(
            "VOLTICA: No product ID in URL."
        );

        return null;

    }


    /*
     * -----------------------------------------------------
     * SOURCE 1
     * products.js
     * -----------------------------------------------------
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

            return normalizeProduct(
                product
            );

        }

    }


    /*
     * -----------------------------------------------------
     * SOURCE 2
     * Admin / Store localStorage
     * -----------------------------------------------------
     */

    try {

        const saved =
            localStorage.getItem(
                VOLTICA_PRODUCT_STORAGE_KEY
            );


        if (saved) {

            const parsed =
                JSON.parse(
                    saved
                );


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

                    return normalizeProduct(
                        product
                    );

                }

            }

        }

    } catch (error) {

        console.error(
            "VOLTICA: Unable to read admin product database.",
            error
        );

    }


    /*
     * -----------------------------------------------------
     * SOURCE 3
     * store.js public API
     * -----------------------------------------------------
     */

    if (
        window.VolticaStore &&
        typeof window.VolticaStore.getProducts ===
            "function"
    ) {

        const products =
            window.VolticaStore.getProducts();


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

                return normalizeProduct(
                    product
                );

            }

        }

    }


    console.error(
        "VOLTICA: Product ID not found:",
        productId
    );


    return null;

}


/* =========================================================
   NORMALIZE PRODUCT
   ========================================================= */

function normalizeProduct(
    product
) {

    const normalized = {
        ...product
    };


    /*
     * ID
     */

    normalized.id =
        product.id;


    /*
     * NAME
     */

    normalized.name =
        product.name ||
        product.title ||
        "Voltica Product";


    /*
     * CATEGORY
     */

    normalized.category =
        product.category ||
        "TECHNOLOGY";


    /*
     * PRICE
     */

    normalized.price =
        product.price ?? 0;


    /*
     * SHORT DESCRIPTION
     */

    normalized.shortDescription =
        product.shortDescription ||
        product.short_description ||
        product.description ||
        "";


    /*
     * DESCRIPTION
     */

    normalized.description =
        product.description ||
        product.longDescription ||
        product.long_description ||
        normalized.shortDescription ||
        "";


    /*
     * BADGE
     */

    normalized.badge =
        product.badge ||
        "PREMIUM";


    /*
     * IMAGES
     */

    normalized.images =
        normalizeImages(
            product
        );


    /*
     * FEATURES
     */

    normalized.features =
        product.features ||
        product.keyFeatures ||
        product.highlights ||
        [];


    /*
     * SPECIFICATIONS
     */

    normalized.specifications =
        product.specifications ||
        product.specs ||
        {};


    /*
     * VARIANTS
     */

    normalized.variants =
        product.variants ||
        product.colors ||
        [];


    /*
     * STRIPE
     */

    normalized.stripeLink =
        product.stripeLink ||
        product.stripe ||
        product.stripeUrl ||
        "";


    return normalized;

}


/* =========================================================
   IMAGE NORMALIZATION
   ========================================================= */

function normalizeImages(
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
            product.images;

    }


    /*
     * Single image fallback
     */

    else if (
        product.image
    ) {

        images = [
            product.image
        ];

    }


    /*
     * Thumbnail fallback
     */

    else if (
        product.thumbnail
    ) {

        images = [
            product.thumbnail
        ];

    }


    return images
        .map(
            normalizeImagePath
        )
        .filter(Boolean);

}


/* =========================================================
   IMAGE PATH
   ========================================================= */

function normalizeImagePath(
    image
) {

    if (
        !image
    ) {

        return "";

    }


    /*
     * If image is an object
     */

    if (
        typeof image ===
        "object"
    ) {

        if (
            typeof image.path ===
            "string"
        ) {

            image =
                image.path;

        }

        else if (
            typeof image.url ===
            "string"
        ) {

            image =
                image.url;

        }

        else if (
            typeof image.name ===
            "string"
        ) {

            image =
                image.name;

        }

        else {

            return "";

        }

    }


    image =
        String(
            image
        ).trim();


    if (!image) {

        return "";

    }


    /*
     * Full URL
     */

    if (
        /^https?:\/\//i.test(
            image
        )
    ) {

        return image;

    }


    /*
     * Correct Voltica local images.
     *
     * Examples:
     *
     * g451-1.webp
     * g451-2.webp
     * g451-3.webp
     *
     * become:
     *
     * assets/images/g451-1.webp
     */

    if (
        image.startsWith(
            "assets/images/"
        )
    ) {

        return image;

    }


    if (
        image.startsWith(
            "/assets/images/"
        )
    ) {

        return image.substring(
            1
        );

    }


    /*
     * Any simple filename
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
   RENDER PRODUCT
   ========================================================= */

function renderProduct(
    product
) {

    /*
     * Category
     */

    setText(
        "productCategory",
        product.category
    );


    /*
     * Product name
     */

    setText(
        "productName",
        product.name
    );


    /*
     * Short description
     */

    setText(
        "productShortDescription",
        product.shortDescription
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
        "USD"
    );


    /*
     * Badge
     */

    setText(
        "productBadge",
        product.badge
    );


    /*
     * Final CTA product name
     */

    setText(
        "finalProductName",
        product.name
    );


    /*
     * Main image
     */

    renderMainImage(
        product
    );


    /*
     * Gallery

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
     * Stripe

     */

    setupStripeButtons(
        product
    );


    /*
     * Page title

     */

    document.title =
        `${product.name} — Voltica Store`;

}


/* =========================================================
   MAIN IMAGE
   ========================================================= */

function renderMainImage(
    product
) {

    const image =
        document.getElementById(
            "mainProductImage"
        );


    if (!image) {

        return;

    }


    const images =
        product.images || [];


    if (
        images.length === 0
    ) {

        image.removeAttribute(
            "src"
        );


        image.alt =
            product.name;


        return;

    }


    image.src =
        images[0];


    image.alt =
        product.name;

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
        product.images || [];


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
                `${product.name} ${index + 1}`;


            img.loading =
                "lazy";


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
        product.description ||
        product.longDescription ||
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
     * Preserve HTML descriptions.
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


    const paragraphs =
        String(
            description
        )
        .split(
            /\n\s*\n/
        )
        .filter(Boolean);


    container.innerHTML =
        paragraphs
            .map(
                paragraph =>
                    `
                    <p>
                        ${escapeHTML(
                            paragraph
                        ).replace(
                            /\n/g,
                            "<br>"
                        )}
                    </p>
                    `
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


    const section =
        document.getElementById(
            "featuresSection"
        );


    if (!container) {

        return;

    }


    const features =
        Array.isArray(
            product.features
        )
            ? product.features
            : [];


    container.innerHTML =
        "";


    if (
        features.length === 0
    ) {

        if (section) {

            section.style.display =
                "none";

        }

        return;

    }


    if (section) {

        section.style.display =
            "";

    }


    features.forEach(
        (
            feature,
            index
        ) => {

            let title =
                "";


            let description =
                "";


            if (
                typeof feature ===
                "string"
            ) {

                title =
                    feature;

                description =
                    "Engineered for the Voltica experience.";

            }

            else if (
                feature &&
                typeof feature ===
                    "object"
            ) {

                title =
                    feature.title ||
                    feature.name ||
                    feature.label ||
                    `FEATURE ${index + 1}`;


                description =
                    feature.description ||
                    feature.text ||
                    feature.value ||
                    "";

            }


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "feature-card";


            card.innerHTML = `

                <span class="pulse-dot"></span>

                <h3>
                    ${escapeHTML(
                        title
                    )}
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


    const section =
        document.getElementById(
            "specificationsSection"
        );


    if (!container) {

        return;

    }


    const specs =
        product.specifications ||
        product.specs ||
        {};


    container.innerHTML =
        "";


    let hasSpecs =
        false;


    /*
     * Array format
     */

    if (
        Array.isArray(specs)
    ) {

        specs.forEach(
            spec => {

                if (
                    !spec ||
                    !spec.label
                ) {

                    return;

                }


                addSpecification(
                    container,
                    spec.label,
                    spec.value
                );


                hasSpecs =
                    true;

            }
        );

    }


    /*
     * Object format
     */

    else if (
        specs &&
        typeof specs ===
            "object"
    ) {

        Object.entries(
            specs
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


                hasSpecs =
                    true;

            }
        );

    }


    if (
        section
    ) {

        section.style.display =
            hasSpecs
                ? ""
                : "none";

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
   OPTIONS / VARIANTS
   ========================================================= */

function renderOptions(
    product
) {

    const container =
        document.getElementById(
            "productOptions"
        );


    const section =
        document.getElementById(
            "optionsSection"
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

        if (section) {

            section.style.display =
                "none";

        }

        return;

    }


    if (section) {

        section.style.display =
            "";

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
                "product-option";


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
                            ".product-option"
                        )
                        .forEach(
                            option => {

                                option.classList.remove(
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
   VARIANTS COMPATIBILITY
   ========================================================= */

function initializeVariants(
    product
) {

    /*
     * The current HTML uses
     * productOptions.
     *
     * This function remains as a
     * compatibility layer.
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

    const container =
        document.getElementById(
            "productAvailability"
        );


    if (!container) {

        return;

    }


    const availability =
        product.availability ||
        product.stockStatus ||
        "AVAILABLE";


    container.innerHTML = `

        <span class="pulse-dot"></span>

        <span>
            ${escapeHTML(
                availability
            )}
        </span>

    `;

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
        "";


    const mainButton =
        document.getElementById(
            "stripeButton"
        );


    const finalButton =
        document.getElementById(
            "finalStripeButton"
        );


    if (!stripeLink) {

        if (mainButton) {

            mainButton.style.display =
                "none";

        }


        if (finalButton) {

            finalButton.style.display =
                "none";

        }


        return;

    }


    if (mainButton) {

        mainButton.href =
            stripeLink;


        mainButton.target =
            "_blank";


        mainButton.rel =
            "noopener noreferrer";


        mainButton.style.display =
            "flex";

    }


    if (finalButton) {

        finalButton.href =
            stripeLink;


        finalButton.target =
            "_blank";


        finalButton.rel =
            "noopener noreferrer";


        finalButton.style.display =
            "inline-flex";

    }

}


/* =========================================================
   ERROR PAGE
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

        <section class="product-error">

            <span class="pulse-dot"></span>

            <span class="section-kicker">
                VOLTICA STORE
            </span>

            <h1>
                PRODUCT NOT FOUND
            </h1>

            <p>
                This product could not be found
                in the Voltica collection.
            </p>

            <a
                href="store.html"
                class="back-store-button"
            >
                ← BACK TO STORE
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

    const number =
        Number(
            value
        );


    if (
        Number.isNaN(
            number
        )
    ) {

        return "$0.00";

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


    getProductId() {

        return getProductIdFromURL();

    }

};


/* =========================================================
   ONLINE
   ========================================================= */

console.log(
    "VOLTICA PRODUCT VIEW — ONLINE"
);
