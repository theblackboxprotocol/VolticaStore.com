/* =========================================================
   VOLTICA STORE
   PRODUCT-VIEW.JS
   Clean Product Detail Engine
   Compatible with the rebuilt products.js
   ========================================================= */

"use strict";


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

    renderGallery(product);

    renderVariants(product);

    renderFeatures(product);

    renderSpecifications(product);

    renderCompatibility(product);

    setupPurchaseButtons(product);

    document.title =
        `${product.name} — Voltica Store`;

}


/* =========================================================
   PRODUCT FROM URL
   ========================================================= */

function getProductIdFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return params.get("id");

}


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

        return null;

    }

    return window.volticaProducts.find(
        product =>
            String(product.id) ===
            String(productId)
    ) || null;

}


/* =========================================================
   MAIN PRODUCT INFORMATION
   ========================================================= */

function renderProduct(product) {

    setText(
        "productName",
        product.name || "VOLTICA PRODUCT"
    );

    setText(
        "finalProductName",
        product.name || "DISCOVER THE FUTURE."
    );

    setText(
        "productCategory",
        product.category || "TECHNOLOGY"
    );

    setText(
        "productShortDescription",
        product.shortDescription ||
        product.description ||
        ""
    );

    setText(
        "productPrice",
        formatPrice(product.price)
    );

    setText(
        "productCurrency",
        product.currency || "USD"
    );

    setText(
        "productBadge",
        product.badge || "PREMIUM"
    );

    renderDescription(product);

    renderAvailability(product);

    renderReferencePrice(product);

}


/* =========================================================
   GALLERY
   ========================================================= */

function renderGallery(product) {

    const mainImage =
        document.getElementById(
            "mainProductImage"
        );

    const thumbnails =
        document.getElementById(
            "productThumbnails"
        );

    if (!mainImage || !thumbnails) {

        return;

    }

    const images =
        getProductImages(product);

    thumbnails.innerHTML = "";

    if (!images.length) {

        mainImage.removeAttribute("src");

        return;

    }

    mainImage.src =
        images[0];

    mainImage.alt =
        product.name || "Voltica Product";


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

            if (index === 0) {

                button.classList.add(
                    "active"
                );

            }

            const thumbnail =
                document.createElement(
                    "img"
                );

            thumbnail.src =
                image;

            thumbnail.alt =
                `${product.name || "Product"} image ${index + 1}`;

            thumbnail.loading =
                "lazy";

            button.appendChild(
                thumbnail
            );

            button.addEventListener(
                "click",
                () => {

                    mainImage.src =
                        image;

                    document
                        .querySelectorAll(
                            ".product-thumbnail"
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active"
                                )
                        );

                    button.classList.add(
                        "active"
                    );

                }
            );

            thumbnails.appendChild(
                button
            );

        }
    );

}


/* =========================================================
   PRODUCT IMAGES
   ========================================================= */

function getProductImages(product) {

    if (
        !product ||
        !Array.isArray(
            product.images
        )
    ) {

        return [];

    }

    return product.images
        .filter(
            image =>
                typeof image === "string" &&
                image.trim() !== ""
        );

}


/* =========================================================
   DESCRIPTION
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

    container.innerHTML = "";

    if (
        !Array.isArray(features) ||
        !features.length
    ) {

        return;

    }

    features.forEach(
        (feature, index) => {

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "feature-card";

            const title =
                typeof feature === "string"
                    ? `FEATURE ${String(
                        index + 1
                    ).padStart(2, "0")}`
                    : feature.title ||
                      feature.name ||
                      `FEATURE ${String(
                          index + 1
                      ).padStart(2, "0")}`;

            const description =
                typeof feature === "string"
                    ? feature
                    : feature.description ||
                      feature.value ||
                      "";

            card.innerHTML = `

                <span class="pulse-dot"></span>

                <span class="feature-number">
                    ${escapeHTML(title)}
                </span>

                <p>
                    ${escapeHTML(description)}
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

    container.innerHTML = "";


    if (
        Array.isArray(
            specifications
        )
    ) {

        specifications.forEach(
            specification => {

                if (
                    !specification ||
                    specification.label === undefined
                ) {

                    return;

                }

                createSpecification(
                    container,
                    specification.label,
                    specification.value
                );

            }
        );

        return;

    }


    Object.entries(
        specifications
    ).forEach(
        ([label, value]) => {

            createSpecification(
                container,
                label,
                value
            );

        }
    );

}


function createSpecification(
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

        <strong class="specification-value">
            ${escapeHTML(
                Array.isArray(value)
                    ? value.join(", ")
                    : value
            )}
        </strong>

    `;

    container.appendChild(
        row
    );

}


/* =========================================================
   COMPATIBILITY
   ========================================================= */

function renderCompatibility(product) {

    const section =
        document.getElementById(
            "optionsSection"
        );

    const container =
        document.getElementById(
            "productOptions"
        );

    if (!container) {

        return;

    }

    const compatibility =
        product.compatibility ||
        product.compatibleWith ||
        [];

    if (
        !Array.isArray(
            compatibility
        ) ||
        !compatibility.length
    ) {

        if (section) {

            section.style.display =
                "none";

        }

        return;

    }

    container.innerHTML = `

        <div class="options-list">

            ${compatibility
                .map(
                    item => `
                        <div class="option-item">

                            <span class="pulse-dot"></span>

                            <span>
                                ${escapeHTML(item)}
                            </span>

                        </div>
                    `
                )
                .join("")
            }

        </div>

    `;

}


/* =========================================================
   VARIANTS
   ========================================================= */

function renderVariants(product) {

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
        !variants.length
    ) {

        return;

    }

    const title =
        document.createElement(
            "span"
        );

    title.className =
        "variant-title";

    title.textContent =
        "SELECT OPTION";

    container.appendChild(
        title
    );


    const options =
        document.createElement(
            "div"
        );

    options.className =
        "variant-options";


    variants.forEach(
        (variant, index) => {

            const option =
                document.createElement(
                    "button"
                );

            option.type =
                "button";

            option.className =
                "variant-option";


            const name =
                typeof variant === "string"
                    ? variant
                    : variant.name ||
                      variant.color ||
                      variant.title ||
                      `OPTION ${index + 1}`;


            option.textContent =
                name;


            if (index === 0) {

                option.classList.add(
                    "active"
                );

                product._selectedVariant =
                    name;

            }


            option.addEventListener(
                "click",
                () => {

                    options
                        .querySelectorAll(
                            ".variant-option"
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active"
                                )
                        );

                    option.classList.add(
                        "active"
                    );

                    product._selectedVariant =
                        name;

                }
            );


            options.appendChild(
                option
            );

        }
    );


    container.appendChild(
        options
    );

}


/* =========================================================
   AVAILABILITY
   ========================================================= */

function renderAvailability(product) {

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

        element.textContent =
            product.availability;

        return;

    }

    element.innerHTML = `

        <span class="pulse-dot"></span>

        <span>
            AVAILABLE FOR PRE-ORDER
        </span>

    `;

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

    if (
        product.referencePrice ===
        undefined ||
        product.referencePrice ===
        null
    ) {

        element.style.display =
            "none";

        return;

    }

    element.textContent =
        `Reference price: ${formatPrice(
            product.referencePrice
        )}`;

}


/* =========================================================
   PURCHASE BUTTONS
   ========================================================= */

function setupPurchaseButtons(product) {

    const stripeLink =
        product.stripeLink ||
        product.stripe ||
        product.stripeUrl ||
        "";


    const primaryButton =
        document.getElementById(
            "stripeButton"
        );


    const finalButton =
        document.getElementById(
            "finalStripeButton"
        );


    if (stripeLink) {

        configureStripeButton(
            primaryButton,
            stripeLink
        );

        configureStripeButton(
            finalButton,
            stripeLink
        );

    } else {

        hideButton(
            primaryButton
        );

        hideButton(
            finalButton
        );

    }

}


/* =========================================================
   STRIPE CONFIGURATION
   ========================================================= */

function configureStripeButton(
    button,
    url
) {

    if (!button) {

        return;

    }

    button.href =
        url;

    button.target =
        "_blank";

    button.rel =
        "noopener noreferrer";

    button.style.display =
        "flex";

}


function hideButton(button) {

    if (!button) {

        return;

    }

    button.style.display =
        "none";

}


/* =========================================================
   ERROR
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

function formatPrice(value) {

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
   SECURITY
   ========================================================= */

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
   READY
   ========================================================= */

console.log(
    "VOLTICA PRODUCT VIEW — ONLINE"
);
