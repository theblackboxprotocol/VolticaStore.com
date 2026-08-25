/* =========================================================
   VOLTICA STORE — PRODUCT VIEW.JS
   Product Detail Engine
   Compatible with product-view.html
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


    /* -----------------------------------------------------
       SOURCE 1 — PRODUCTS.JS
       ----------------------------------------------------- */

    if (
        Array.isArray(
            window.volticaProducts
        )
    ) {

        const product =
            window.volticaProducts.find(
                item =>
                    String(item.id).trim().toLowerCase() ===
                    String(productId).trim().toLowerCase()
            );


        if (product) {

            return product;

        }

    }


    /* -----------------------------------------------------
       SOURCE 2 — ADMIN LOCAL STORAGE
       ----------------------------------------------------- */

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
                            String(item.id).trim().toLowerCase() ===
                            String(productId).trim().toLowerCase()
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


    return null;

}


/* =========================================================
   RENDER PRODUCT
   ========================================================= */

function renderProduct(product) {

    /* -----------------------------------------------------
       BASIC INFORMATION
       ----------------------------------------------------- */

    setText(
        "productCategory",
        product.category ||
        "PREMIUM TECHNOLOGY"
    );


    setText(
        "productName",
        product.name ||
        "VOLTICA PRODUCT"
    );


    setText(
        "productShortDescription",
        product.shortDescription ||
        ""
    );


    setText(
        "productBadge",
        product.badge ||
        "AVAILABLE"
    );


    setText(
        "finalProductName",
        product.name ||
        "DISCOVER THE FUTURE."
    );


    /* -----------------------------------------------------
       PRICE
       ----------------------------------------------------- */

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


    renderReferencePrice(
        product
    );


    /* -----------------------------------------------------
       PRODUCT CONTENT
       ----------------------------------------------------- */

    renderMainImage(
        product
    );


    renderThumbnails(
        product
    );


    renderDescription(
        product
    );


    renderFeatures(
        product
    );


    renderSpecifications(
        product
    );


    renderVariants(
        product
    );


    renderCustomCTA(
        product
    );


    /* -----------------------------------------------------
       COMMERCE
       ----------------------------------------------------- */

    setupStripeButtons(
        product
    );


    renderAvailability(
        product
    );


    /* -----------------------------------------------------
       PAGE TITLE
       ----------------------------------------------------- */

    document.title =
        `${product.name || "Product"} — Voltica Store`;

}


/* =========================================================
   REFERENCE PRICE
   ========================================================= */

function renderReferencePrice(product) {

    const element =
        document.getElementById(
            "referencePrice"
        );


    if (!element) {

        return;

    }


    const referencePrice =
        Number(
            product.referencePrice
        );


    const price =
        Number(
            product.price
        );


    if (
        Number.isFinite(referencePrice) &&
        Number.isFinite(price) &&
        referencePrice > price
    ) {

        element.textContent =
            formatPrice(
                referencePrice
            );


        element.style.display =
            "inline-block";

    }

    else {

        element.textContent =
            "";


        element.style.display =
            "none";

    }

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
        getProductImages(
            product
        );


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


    const zoomButton =
        document.getElementById(
            "imageZoomButton"
        );


    if (!mainImage) {

        return;

    }


    mainImage.style.cursor =
        "zoom-in";


    mainImage.addEventListener(
        "click",
        () => {

            if (mainImage.src) {

                openLightbox(
                    mainImage.src
                );

            }

        }
    );


    zoomButton?.addEventListener(
        "click",
        () => {

            if (mainImage.src) {

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
        document.getElementById(
            "productLightbox"
        );


    if (!lightbox) {

        return;

    }


    const closeButton =
        document.getElementById(
            "lightboxClose"
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

function openLightbox(image) {

    const lightbox =
        document.getElementById(
            "productLightbox"
        );


    const lightboxImage =
        document.getElementById(
            "lightboxImage"
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


    lightbox.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   CLOSE LIGHTBOX
   ========================================================= */

function closeLightbox() {

    const lightbox =
        document.getElementById(
            "productLightbox"
        );


    if (!lightbox) {

        return;

    }


    lightbox.classList.remove(
        "active"
    );


    lightbox.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";

}


/* =========================================================
   FULL DESCRIPTION
   ========================================================= */

function renderDescription(product) {

    const container =
        document.getElementById(
            "productDescription"
        );


    if (!container) {

        return;

    }


    const description =
        product.fullDescription ||
        product.longDescription ||
        product.description ||
        "";


    container.innerHTML =
        "";


    if (!description) {

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
        String(description)
            .split(
                /\n\s*\n/
            )
            .map(
                paragraph =>
                    paragraph.trim()
            )
            .filter(Boolean);


    container.innerHTML =
        paragraphs
            .map(
                paragraph => `

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

function renderFeatures(product) {

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
        [];


    container.innerHTML =
        "";


    if (
        !Array.isArray(features) ||
        !features.length
    ) {

        return;

    }


    features.forEach(
        feature => {

            const parsed =
                parseFeature(
                    feature
                );


            if (!parsed.title) {

                return;

            }


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "feature-card";


            card.innerHTML = `

                <h3>
                    ${escapeHTML(
                        parsed.title
                    )}
                </h3>

                ${
                    parsed.description
                        ? `

                            <p>
                                ${escapeHTML(
                                    parsed.description
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
   PARSE FEATURE
   ========================================================= */

function parseFeature(feature) {

    if (
        feature &&
        typeof feature ===
        "object"
    ) {

        return {

            title:
                feature.title ||
                feature.name ||
                feature.label ||
                feature.feature ||
                "",

            description:
                feature.description ||
                feature.value ||
                ""

        };

    }


    const text =
        String(
            feature ?? ""
        ).trim();


    if (!text) {

        return {

            title: "",
            description: ""

        };

    }


    const separator =
        text.indexOf(":");


    if (
        separator === -1
    ) {

        return {

            title: text,
            description: ""

        };

    }


    return {

        title:
            text
                .slice(
                    0,
                    separator
                )
                .trim(),

        description:
            text
                .slice(
                    separator + 1
                )
                .trim()

    };

}


/* =========================================================
   SPECIFICATIONS
   ========================================================= */

function renderSpecifications(product) {

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


    container.innerHTML =
        "";


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
                    item.title ||
                    "SPECIFICATION",
                    item.value ||
                    ""
                );

            }
        );


        return;

    }


    if (
        specifications &&
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


/* =========================================================
   SPECIFICATION VALUE
   ========================================================= */

function formatSpecificationValue(value) {

    if (
        Array.isArray(value)
    ) {

        return value.join(
            ", "
        );

    }


    if (
        value &&
        typeof value ===
        "object"
    ) {

        return Object.entries(
            value
        )
        .map(
            (
                [key, val]
            ) =>
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
   VARIANTS / OPTIONS
   ========================================================= */

function renderVariants(product) {

    const container =
        document.getElementById(
            "productOptions"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    const variants =
        Array.isArray(
            product.variants
        )
            ? product.variants
            : [];


    const colors =
        Array.isArray(
            product.colors
        )
            ? product.colors
            : [];


    const options =
        variants.length
            ? variants
            : colors;


    if (!options.length) {

        container.style.display =
            "none";

        return;

    }


    container.style.display =
        "";


    const heading =
        document.createElement(
            "div"
        );


    heading.className =
        "variant-selector";


    heading.innerHTML = `

        <div class="selected-option-row">

            <span>
                SELECT OPTION
            </span>

            <strong id="selectedOption">
                ${escapeHTML(
                    getVariantName(
                        options[0],
                        0
                    )
                )}
            </strong>

        </div>

        <div class="color-options">
        </div>

    `;


    container.appendChild(
        heading
    );


    const optionsContainer =
        heading.querySelector(
            ".color-options"
        );


    options.forEach(
        (
            option,
            index
        ) => {

            const data =
                parseVariant(
                    option,
                    index
                );


            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "color-option";


            button.textContent =
                data.name;


            button.dataset.variantName =
                data.name;


            if (data.sku) {

                button.dataset.sku =
                    data.sku;

            }


            if (
                index === 0
            ) {

                button.classList.add(
                    "active"
                );

                optionsContainer.dataset.selectedVariant =
                    data.name;

                optionsContainer.dataset.selectedSku =
                    data.sku || "";

            }


            button.addEventListener(
                "click",
                () => {

                    optionsContainer
                        .querySelectorAll(
                            ".color-option"
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
                            "selectedOption"
                        );


                    if (selected) {

                        selected.textContent =
                            data.name;

                    }


                    optionsContainer.dataset.selectedVariant =
                        data.name;


                    optionsContainer.dataset.selectedSku =
                        data.sku || "";

                }
            );


            optionsContainer.appendChild(
                button
            );

        }
    );

}


/* =========================================================
   GET VARIANT NAME
   ========================================================= */

function getVariantName(
    variant,
    index
) {

    if (
        variant &&
        typeof variant ===
        "object"
    ) {

        return String(
            variant.name ||
            variant.color ||
            variant.label ||
            `OPTION ${index + 1}`
        ).trim();

    }


    const text =
        String(
            variant ?? ""
        ).trim();


    return (
        text ||
        `OPTION ${index + 1}`
    );

}


/* =========================================================
   PARSE VARIANT
   ========================================================= */

function parseVariant(
    variant,
    index
) {

    if (
        variant &&
        typeof variant ===
        "object"
    ) {

        return {

            name:
                String(
                    variant.name ||
                    variant.color ||
                    variant.label ||
                    `OPTION ${index + 1}`
                ).trim(),

            sku:
                String(
                    variant.sku ||
                    variant.SKU ||
                    ""
                ).trim()

        };

    }


    const text =
        String(
            variant ?? ""
        ).trim();


    const separator =
        text.indexOf("—");


    if (
        separator !== -1
    ) {

        return {

            name:
                text
                    .slice(
                        0,
                        separator
                    )
                    .trim(),

            sku:
                text
                    .slice(
                        separator + 1
                    )
                    .trim()

        };

    }


    return {

        name:
            text ||
            `OPTION ${index + 1}`,

        sku: ""

    };

}


/* =========================================================
   CUSTOM CTA
   ========================================================= */

function renderCustomCTA(product) {

    document
        .querySelectorAll(
            ".voltica-custom-product-cta"
        )
        .forEach(
            element =>
                element.remove()
        );


    const customCTA =
        product.customCTA ||
        product.customCta ||
        product.cta;


    if (!customCTA) {

        return;

    }


    let title = "";
    let lines = [];


    if (
        typeof customCTA === "object" &&
        !Array.isArray(customCTA)
    ) {

        title =
            customCTA.title ||
            customCTA.heading ||
            customCTA.name ||
            "WHY SHOP WITH US?";


        if (
            Array.isArray(
                customCTA.lines
            )
        ) {

            lines =
                customCTA.lines;

        }

        else if (
            Array.isArray(
                customCTA.items
            )
        ) {

            lines =
                customCTA.items;

        }

        else if (
            typeof customCTA.text ===
            "string"
        ) {

            lines =
                customCTA.text
                    .split(/\n+/)
                    .filter(Boolean);

        }

    }

    else if (
        Array.isArray(customCTA)
    ) {

        title =
            "WHY SHOP WITH US?";

        lines =
            customCTA;

    }

    else if (
        typeof customCTA ===
        "string"
    ) {

        title =
            "WHY SHOP WITH US?";

        lines =
            customCTA
                .split(/\n+/)
                .filter(Boolean);

    }


    title =
        String(
            title
        ).trim();


    lines =
        lines
            .map(
                line =>
                    String(
                        line ?? ""
                    ).trim()
            )
            .filter(Boolean);


    if (
        !title &&
        !lines.length
    ) {

        return;

    }


    const finalCTA =
        document.querySelector(
            ".product-final-cta"
        );


    const section =
        document.createElement(
            "section"
        );


    section.className =
        "voltica-custom-product-cta";


    section.innerHTML = `

        <div class="acrylic-panel custom-cta-panel">

            <span class="section-kicker">
                VOLTICA STORE
            </span>

            <h2>
                ${escapeHTML(title)}
            </h2>

            <div class="custom-cta-content">

                ${lines
                    .map(
                        line => `

                            <p>
                                ${escapeHTML(
                                    line
                                )}
                            </p>

                        `
                    )
                    .join("")
                }

            </div>

        </div>

    `;


    if (
        finalCTA &&
        finalCTA.parentNode
    ) {

        finalCTA.before(
            section
        );

    }

    else {

        document
            .getElementById(
                "productPage"
            )
            ?.appendChild(
                section
            );

    }

       }
