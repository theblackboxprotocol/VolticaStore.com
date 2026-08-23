/* =========================================================
   VOLTICA STORE — PRODUCT VIEW.JS
   Complete Product Detail Engine
   ========================================================= */

"use strict";


/* =========================================================
   GLOBAL
   ========================================================= */

let currentProduct = null;

let selectedVariant = null;


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


    currentProduct =
        product;


    renderProduct(
        product
    );


    initializeGallery();


    initializeVariants(
        product
    );


    initializePurchaseButtons(
        product
    );


    initializeKeyboard();


    console.log(
        "VOLTICA PRODUCT VIEW READY"
    );

}


/* =========================================================
   GET PRODUCT ID
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

function renderProduct(
    product
) {

    /*
     * Category
     */

    setText(
        "productCategory",
        product.category ||
        "COLLECTION"
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
        ""
    );


    /*
     * Badge
     */

    setText(
        "productBadge",
        product.badge ||
        "AVAILABLE"
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
     * Reference price
     */

    renderReferencePrice(
        product
    );


    /*
     * Final CTA
     */

    setText(
        "finalProductName",
        product.name ||
        "DISCOVER THE FUTURE."
    );


    /*
     * Page title
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


    if (!images.length) {

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


    mainImage.dataset.currentImage =
        images[0];

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


    if (!images.length) {

        container.innerHTML = `

            <div class="thumbnail-empty">
                NO IMAGES
            </div>

        `;

        return;

    }


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


            button.setAttribute(
                "aria-label",
                `View image ${index + 1}`
            );


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


    mainImage.dataset.currentImage =
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

function openLightbox(
    image
) {

    if (!image) {

        return;

    }


    let lightbox =
        document.getElementById(
            "volticaLightbox"
        );


    if (!lightbox) {

        lightbox =
            document.createElement(
                "div"
            );


        lightbox.id =
            "volticaLightbox";


        lightbox.className =
            "voltica-lightbox";


        lightbox.innerHTML = `

            <button
                type="button"
                class="voltica-lightbox-close"
                aria-label="Close image"
            >
                ×
            </button>

            <img
                src=""
                alt=""
            >

        `;


        document.body.appendChild(
            lightbox
        );


        lightbox
            .querySelector(
                ".voltica-lightbox-close"
            )
            .addEventListener(
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

    }


    const imageElement =
        lightbox.querySelector(
            "img"
        );


    imageElement.src =
        image;


    imageElement.alt =
        currentProduct?.name ||
        "Product";


    lightbox.classList.add(
        "active"
    );


    document.body.classList.add(
        "lightbox-open"
    );

}


function closeLightbox() {

    const lightbox =
        document.getElementById(
            "volticaLightbox"
        );


    if (!lightbox) {

        return;

    }


    lightbox.classList.remove(
        "active"
    );


    document.body.classList.remove(
        "lightbox-open"
    );

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
                Premium technology selected
                for the Voltica collection.
            </p>

        `;

        return;

    }


    /*
     * Plain text only.
     * Prevents accidental HTML injection.
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
        Array.isArray(
            product.keyFeatures
        )
            ? product.keyFeatures
            : [];


    container.innerHTML =
        "";


    if (!features.length) {

        document.getElementById(
            "featuresSection"
        )?.setAttribute(
            "hidden",
            ""
        );

        return;

    }


    document.getElementById(
        "featuresSection"
    )?.removeAttribute(
        "hidden"
    );


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


            card.innerHTML = `

                <span class="feature-number">
                    ${String(
                        index + 1
                    ).padStart(
                        2,
                        "0"
                    )}
                </span>


                <span class="feature-pulse"></span>


                <p>
                    ${escapeHTML(
                        feature
                    )}
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


    container.innerHTML =
        "";


    const specifications =
        product.specifications ||
        {};


    const entries =
        Array.isArray(
            specifications
        )
            ? specifications.map(
                item => [
                    item.label ||
                    item.name ||
                    "Specification",
                    item.value ||
                    ""
                ]
            )
            : Object.entries(
                specifications
            );


    if (!entries.length) {

        document.getElementById(
            "specificationsSection"
        )?.setAttribute(
            "hidden",
            ""
        );

        return;

    }


    document.getElementById(
        "specificationsSection"
    )?.removeAttribute(
        "hidden"
    );


    entries.forEach(
        (
            [
                label,
                value
            ]
        ) => {

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


    if (!container) {

        return;

    }


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


    container.innerHTML =
        "";


    if (
        !variants.length &&
        !colors.length
    ) {

        document.getElementById(
            "optionsSection"
        )?.setAttribute(
            "hidden",
            ""
        );

        return;

    }


    document.getElementById(
        "optionsSection"
    )?.removeAttribute(
        "hidden"
    );


    const title =
        document.createElement(
            "span"
        );


    title.className =
        "option-label";


    title.textContent =
        variants.length
            ? "SELECT YOUR CONFIGURATION"
            : "AVAILABLE COLORS";


    container.appendChild(
        title
    );


    const list =
        document.createElement(
            "div"
        );


    list.className =
        "product-option-list";


    if (
        variants.length
    ) {

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


                const sku =
                    typeof variant === "object"
                        ? (
                            variant.sku ||
                            ""
                        )
                        : "";


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


                    selectedVariant =
                        variant;

                }


                button.innerHTML = `

                    <span>
                        ${escapeHTML(
                            name
                        )}
                    </span>

                    ${
                        sku
                            ? `
                                <small>
                                    SKU: ${escapeHTML(
                                        sku
                                    )}
                                </small>
                            `
                            : ""
                    }

                `;


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


                        selectedVariant =
                            variant;


                        updateVariantAvailability(
                            product,
                            variant
                        );

                    }
                );


                list.appendChild(
                    button
                );

            }
        );

    } else {

        colors.forEach(
            (
                color,
                index
            ) => {

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


                    selectedVariant =
                        color;

                }


                button.textContent =
                    color;


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


                        selectedVariant =
                            color;

                    }
                );


                list.appendChild(
                    button
                );

            }
        );

    }


    container.appendChild(
        list
    );

}


/* =========================================================
   LEGACY VARIANT SUPPORT
   ========================================================= */

function initializeVariants(
    product
) {

    /*
     * The new HTML uses #productOptions.
     *
     * This function exists only to keep
     * compatibility with older markup.
     */

    const oldContainer =
        document.getElementById(
            "colorOptions"
        );


    if (
        !oldContainer
    ) {

        return;

    }


    oldContainer.innerHTML =
        "";

}


/* =========================================================
   VARIANT AVAILABILITY
   ========================================================= */

function updateVariantAvailability(
    product,
    variant
) {

    const availability =
        document.getElementById(
            "productAvailability"
        );


    if (!availability) {

        return;

    }


    const name =
        typeof variant === "string"
            ? variant
            : (
                variant?.name ||
                variant?.color ||
                ""
            );


    const sku =
        typeof variant === "object"
            ? (
                variant.sku ||
                ""
            )
            : "";


    if (
        sku
    ) {

        availability.innerHTML = `

            <span class="pulse-dot"></span>

            <span>
                ${escapeHTML(
                    name
                )}
            </span>

            <small>
                SKU ${escapeHTML(
                    sku
                )}
            </small>

        `;

    } else {

        availability.innerHTML = `

            <span class="pulse-dot"></span>

            <span>
                ${escapeHTML(
                    name ||
                    "AVAILABLE"
                )}
            </span>

        `;

    }

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


    container.innerHTML = `

        <span class="pulse-dot"></span>

        <span>
            AVAILABLE
        </span>

    `;


    if (
        Array.isArray(
            product.variants
        ) &&
        product.variants.length
    ) {

        const first =
            product.variants[0];


        updateVariantAvailability(
            product,
            first
        );

    }

}


/* =========================================================
   REFERENCE PRICE
   ========================================================= */

function renderReferencePrice(
    product
) {

    const pricePanel =
        document.querySelector(
            ".product-price-panel"
        );


    if (!pricePanel) {

        return;

    }


    const oldReference =
        pricePanel.querySelector(
            ".product-reference-price"
        );


    if (
        oldReference
    ) {

        oldReference.remove();

    }


    const reference =
        Number(
            product.referencePrice
        );


    if (
        !reference ||
        reference <= 0
    ) {

        return;

    }


    const element =
        document.createElement(
            "span"
        );


    element.className =
        "product-reference-price";


    element.textContent =
        formatPrice(
            reference
        );


    pricePanel.appendChild(
        element
    );

}


/* =========================================================
   PURCHASE BUTTONS
   ========================================================= */

function initializePurchaseButtons(
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


    if (
        mainButton
    ) {

        configurePurchaseButton(
            mainButton,
            stripeLink,
            product
        );

    }


    if (
        finalButton
    ) {

        configurePurchaseButton(
            finalButton,
            stripeLink,
            product
        );

    }

}


/* =========================================================
   CONFIGURE PURCHASE BUTTON
   ========================================================= */

function configurePurchaseButton(
    button,
    stripeLink,
    product
) {

    if (
        stripeLink
    ) {

        button.href =
            stripeLink;


        button.target =
            "_blank";


        button.rel =
            "noopener noreferrer";


        button.classList.remove(
            "disabled"
        );


        return;

    }


    /*
     * No Stripe link yet.
     */

    button.removeAttribute(
        "href"
    );


    button.removeAttribute(
        "target"
    );


    button.classList.add(
        "disabled"
    );


    button.addEventListener(
        "click",
        event => {

            event.preventDefault();


            showProductMessage(
                "CHECKOUT COMING SOON"
            );

        }
    );

}


/* =========================================================
   KEYBOARD
   ========================================================= */

function initializeKeyboard() {

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

        <section class="product-error">

            <div class="error-pulsar"></div>


            <span>
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
                ← RETURN TO STORE
            </a>

        </section>

    `;

}


/* =========================================================
   PRODUCT MESSAGE
   ========================================================= */

function showProductMessage(
    message
) {

    let notification =
        document.getElementById(
            "productNotification"
        );


    if (!notification) {

        notification =
            document.createElement(
                "div"
            );


        notification.id =
            "productNotification";


        notification.className =
            "product-notification";


        document.body.appendChild(
            notification
        );

    }


    notification.textContent =
        message;


    notification.classList.add(
        "show"
    );


    clearTimeout(
        notification._timer
    );


    notification._timer =
        setTimeout(
            () => {

                notification.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* =========================================================
   IMAGE HELPERS
   ========================================================= */

function getProductImages(
    product
) {

    if (
        !product
    ) {

        return [];

    }


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


                    return image?.path ||
                           image?.url ||
                           "";

                }
            )
            .filter(Boolean);

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
    value
) {

    const number =
        Number(value);


    if (
        Number.isNaN(number)
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

        return currentProduct;

    },


    getSelectedVariant() {

        return selectedVariant;

    }

};


/* =========================================================
   VOLTICA PRODUCT VIEW — ONLINE
   ========================================================= */
