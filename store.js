"use strict";

/* =========================================================
   VOLTICA STORE
   STORE ENGINE
   ========================================================= */


/* =========================================================
   CONFIGURATION
   ========================================================= */

const VOLTICA_IMAGE_PATH = "assets/images/";

const VOLTICA_CURRENCY = "USD";


/* =========================================================
   STATE
   ========================================================= */

let storeProducts = [];

let currentProduct = null;

let currentImageIndex = 0;


/* =========================================================
   DOM
   ========================================================= */

const storeProductContainer =
    document.getElementById("storeProductContainer");

const storeProductModal =
    document.getElementById("storeProductModal");

const storeModalOverlay =
    document.getElementById("storeModalOverlay");

const storeModalClose =
    document.getElementById("storeModalClose");

const storeModalMainImage =
    document.getElementById("storeModalMainImage");

const storeModalThumbnails =
    document.getElementById("storeModalThumbnails");

const storeModalCategory =
    document.getElementById("storeModalCategory");

const storeModalBadge =
    document.getElementById("storeModalBadge");

const storeModalName =
    document.getElementById("storeModalName");

const storeModalPrice =
    document.getElementById("storeModalPrice");

const storeModalReferencePrice =
    document.getElementById("storeModalReferencePrice");

const storeModalDescription =
    document.getElementById("storeModalDescription");

const storeModalFeatures =
    document.getElementById("storeModalFeatures");

const storeModalSpecifications =
    document.getElementById("storeModalSpecifications");

const storeModalColors =
    document.getElementById("storeModalColors");

const storeModalBuy =
    document.getElementById("storeModalBuy");


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeStore
);


function initializeStore() {

    loadProducts();

    renderStore();

    bindStoreEvents();

}


/* =========================================================
   LOAD PRODUCTS
   ========================================================= */

function loadProducts() {

    if (
        Array.isArray(
            window.volticaProducts
        )
    ) {

        storeProducts =
            window.volticaProducts
                .filter(
                    product =>
                        product &&
                        product.active !== false
                )
                .map(
                    normalizeProduct
                );

        return;

    }


    console.error(
        "Voltica Store: products.js was not loaded."
    );


    storeProducts = [];

}


/* =========================================================
   NORMALIZE PRODUCT
   ========================================================= */

function normalizeProduct(product) {

    return {

        id:
            cleanText(product.id),

        name:
            cleanText(product.name),

        category:
            cleanText(product.category),

        badge:
            cleanText(product.badge),

        sku:
            cleanText(product.sku),

        cost:
            numberValue(product.cost),

        shipping:
            numberValue(product.shipping),

        price:
            numberValue(product.price),

        referencePrice:
            numberValue(
                product.referencePrice
            ),

        shortDescription:
            cleanText(
                product.shortDescription
            ),

        description:
            cleanText(
                product.description
            ),

        keyFeatures:
            Array.isArray(
                product.keyFeatures
            )
                ? product.keyFeatures
                : [],

        specifications:
            product.specifications &&
            typeof product.specifications === "object"
                ? product.specifications
                : {},

        colors:
            Array.isArray(product.colors)
                ? product.colors
                : [],

        variants:
            Array.isArray(product.variants)
                ? product.variants
                : [],

        images:
            normalizeImages(
                product.images
            ),

        stripeLink:
            cleanText(
                product.stripeLink
            ),

        supplierLink:
            cleanText(
                product.supplierLink
            ),

        active:
            product.active !== false

    };

}


/* =========================================================
   IMAGE NORMALIZATION
   ========================================================= */

function normalizeImages(images) {

    if (
        !Array.isArray(images)
    ) {

        return [];

    }


    return images
        .map(
            image => {

                let path = "";


                if (
                    typeof image ===
                    "string"
                ) {

                    path = image;

                } else if (
                    image &&
                    typeof image ===
                    "object"
                ) {

                    path =
                        image.path ||
                        image.src ||
                        image.url ||
                        "";

                }


                path =
                    cleanImagePath(
                        path
                    );


                return path;

            }
        )
        .filter(Boolean);

}


/* =========================================================
   CLEAN IMAGE PATH
   ========================================================= */

function cleanImagePath(path) {

    path =
        cleanText(path);


    if (!path) {

        return "";

    }


    /*
     * Already a complete URL.
     */

    if (
        /^https?:\/\//i.test(path)
    ) {

        return path;

    }


    /*
     * Root-relative path.
     */

    if (
        path.startsWith("/")
    ) {

        return path;

    }


    /*
     * Already points to assets/images.
     */

    if (
        path.startsWith(
            "assets/images/"
        )
    ) {

        return path;

    }


    /*
     * Only filename supplied.
     */

    return (
        VOLTICA_IMAGE_PATH +
        path
    );

}


/* =========================================================
   RENDER STORE
   ========================================================= */

function renderStore() {

    if (
        !storeProductContainer
    ) {

        /*
         * The current static store.html
         * may not contain the dynamic
         * container yet.
         */

        return;

    }


    storeProductContainer.innerHTML = "";


    if (
        storeProducts.length === 0
    ) {

        renderEmptyStore();

        return;

    }


    storeProducts.forEach(
        product => {

            const card =
                createProductCard(
                    product
                );


            storeProductContainer.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   PRODUCT CARD
   ========================================================= */

function createProductCard(product) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "store-product";


    article.dataset.productId =
        product.id;


    const firstImage =
        product.images[0] || "";


    const badge =
        product.badge
            ? `
                <span class="product-badge">
                    ${escapeHTML(product.badge)}
                </span>
              `
            : "";


    const referencePrice =
        product.referencePrice > product.price
            ? `
                <span class="product-reference-price">
                    ${formatPrice(product.referencePrice)}
                </span>
              `
            : "";


    article.innerHTML = `

        <div class="product-image">

            ${badge}

            ${
                firstImage
                    ? `
                        <img
                            src="${escapeAttribute(firstImage)}"
                            alt="${escapeAttribute(product.name)}"
                            loading="lazy"
                        >
                    `
                    : `
                        <div class="product-image-empty">
                            NO IMAGE
                        </div>
                    `
            }

            <div
                class="image-reflection"
                aria-hidden="true"
            ></div>

        </div>


        <div class="product-info">

            ${
                product.category
                    ? `
                        <span class="product-category">
                            ${escapeHTML(product.category)}
                        </span>
                      `
                    : ""
            }


            <h2 class="product-title">
                ${escapeHTML(product.name)}
            </h2>


            ${
                product.shortDescription
                    ? `
                        <p class="product-description">
                            ${escapeHTML(
                                product.shortDescription
                            )}
                        </p>
                      `
                    : ""
            }


            <div class="product-price-row">

                <strong class="product-price">
                    ${formatPrice(product.price)}
                </strong>

                ${referencePrice}

            </div>


            <div class="product-actions">

                <button
                    type="button"
                    class="acrylic-button product-view-button"
                    data-action="view"
                    data-product-id="${escapeAttribute(product.id)}"
                >
                    VIEW PRODUCT
                </button>


                ${
                    product.stripeLink
                        ? `
                            <a
                                href="${escapeAttribute(product.stripeLink)}"
                                class="acrylic-button product-buy-button"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                PRE-ORDER
                            </a>
                          `
                        : ""
                }

            </div>

        </div>

    `;


    return article;

}


/* =========================================================
   EMPTY STORE
   ========================================================= */

function renderEmptyStore() {

    storeProductContainer.innerHTML = `

        <div class="store-empty">

            <span>
                VOLTICA
            </span>

            <strong>
                STORE READY
            </strong>

            <p>
                No active products are currently available.
            </p>

        </div>

    `;

}


/* =========================================================
   STORE EVENTS
   ========================================================= */

function bindStoreEvents() {

    document.addEventListener(
        "click",
        handleStoreClick
    );


    storeModalClose?.addEventListener(
        "click",
        closeProductModal
    );


    storeModalOverlay?.addEventListener(
        "click",
        closeProductModal
    );


    document.addEventListener(
        "keydown",
        handleKeyboard
    );

}


/* =========================================================
   STORE CLICK ROUTER
   ========================================================= */

function handleStoreClick(event) {

    const button =
        event.target.closest(
            "[data-action='view']"
        );


    if (!button) {

        return;

    }


    const productId =
        button.dataset.productId;


    openProductModal(
        productId
    );

}


/* =========================================================
   OPEN PRODUCT MODAL
   ========================================================= */

function openProductModal(productId) {

    const product =
        storeProducts.find(
            item =>
                item.id === productId
        );


    if (!product) {

        console.error(
            "Voltica Store: product not found:",
            productId
        );

        return;

    }


    currentProduct =
        product;


    currentImageIndex = 0;


    renderProductModal(
        product
    );


    if (
        storeProductModal
    ) {

        storeProductModal.classList.add(
            "active"
        );


        storeProductModal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.style.overflow =
            "hidden";

    }

}


/* =========================================================
   RENDER PRODUCT MODAL
   ========================================================= */

function renderProductModal(product) {

    if (
        storeModalCategory
    ) {

        storeModalCategory.textContent =
            product.category ||
            "VOLTICA";

    }


    if (
        storeModalBadge
    ) {

        if (product.badge) {

            storeModalBadge.textContent =
                product.badge;

            storeModalBadge.hidden =
                false;

        } else {

            storeModalBadge.hidden =
                true;

        }

    }


    if (
        storeModalName
    ) {

        storeModalName.textContent =
            product.name;

    }


    if (
        storeModalPrice
    ) {

        storeModalPrice.textContent =
            formatPrice(
                product.price
            );

    }


    if (
        storeModalReferencePrice
    ) {

        if (
            product.referencePrice >
            product.price
        ) {

            storeModalReferencePrice.textContent =
                formatPrice(
                    product.referencePrice
                );

            storeModalReferencePrice.hidden =
                false;

        } else {

            storeModalReferencePrice.hidden =
                true;

        }

    }


    if (
        storeModalDescription
    ) {

        storeModalDescription.innerHTML =
            formatDescription(
                product.description ||
                product.shortDescription
            );

    }


    renderModalImages(
        product
    );


    renderModalFeatures(
        product
    );


    renderModalSpecifications(
        product
    );


    renderModalColors(
        product
    );


    if (
        storeModalBuy
    ) {

        if (
            product.stripeLink
        ) {

            storeModalBuy.href =
                product.stripeLink;

            storeModalBuy.hidden =
                false;

        } else {

            storeModalBuy.hidden =
                true;

        }

    }

}


/* =========================================================
   MODAL IMAGES
   ========================================================= */

function renderModalImages(product) {

    if (
        !storeModalMainImage
    ) {

        return;

    }


    const images =
        product.images;


    if (
        images.length === 0
    ) {

        storeModalMainImage.removeAttribute(
            "src"
        );

        storeModalMainImage.alt =
            "No product image";

        if (
            storeModalThumbnails
        ) {

            storeModalThumbnails.innerHTML =
                "";

        }

        return;

    }


    currentImageIndex = Math.min(
        currentImageIndex,
        images.length - 1
    );


    storeModalMainImage.src =
        images[currentImageIndex];


    storeModalMainImage.alt =
        product.name;


    if (
        !storeModalThumbnails
    ) {

        return;

    }


    storeModalThumbnails.innerHTML =
        "";


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
                "modal-thumb";


            if (
                index ===
                currentImageIndex
            ) {

                button.classList.add(
                    "active"
                );

            }


            button.dataset.imageIndex =
                index;


            button.innerHTML = `

                <img
                    src="${escapeAttribute(image)}"
                    alt="${escapeAttribute(product.name)} ${index + 1}"
                    loading="lazy"
                >

            `;


            button.addEventListener(
                "click",
                () => {

                    setModalImage(
                        index
                    );

                }
            );


            storeModalThumbnails.appendChild(
                button
            );

        }
    );

}


/* =========================================================
   SET MODAL IMAGE
   ========================================================= */

function setModalImage(index) {

    if (
        !currentProduct
    ) {

        return;

    }


    if (
        index < 0 ||
        index >=
        currentProduct.images.length
    ) {

        return;

    }


    currentImageIndex =
        index;


    if (
        storeModalMainImage
    ) {

        storeModalMainImage.src =
            currentProduct.images[index];

    }


    if (
        storeModalThumbnails
    ) {

        storeModalThumbnails
            .querySelectorAll(
                ".modal-thumb"
            )
            .forEach(
                (
                    thumb,
                    thumbIndex
                ) => {

                    thumb.classList.toggle(
                        "active",
                        thumbIndex === index
                    );

                }
            );

    }

}


/* =========================================================
   FEATURES
   ========================================================= */

function renderModalFeatures(product) {

    if (
        !storeModalFeatures
    ) {

        return;

    }


    storeModalFeatures.innerHTML =
        "";


    if (
        !product.keyFeatures.length
    ) {

        storeModalFeatures.hidden =
            true;

        return;

    }


    storeModalFeatures.hidden =
        false;


    product.keyFeatures.forEach(
        feature => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "modal-feature";


            item.innerHTML = `

                <span class="feature-pulse"></span>

                <span>
                    ${escapeHTML(feature)}
                </span>

            `;


            storeModalFeatures.appendChild(
                item
            );

        }
    );

}


/* =========================================================
   SPECIFICATIONS
   ========================================================= */

function renderModalSpecifications(product) {

    if (
        !storeModalSpecifications
    ) {

        return;

    }


    storeModalSpecifications.innerHTML =
        "";


    const entries =
        Object.entries(
            product.specifications || {}
        );


    if (
        entries.length === 0
    ) {

        storeModalSpecifications.hidden =
            true;

        return;

    }


    storeModalSpecifications.hidden =
        false;


    entries.forEach(
        ([key, value]) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "modal-specification";


            item.innerHTML = `

                <span>
                    ${escapeHTML(key)}
                </span>

                <strong>
                    ${escapeHTML(value)}
                </strong>

            `;


            storeModalSpecifications.appendChild(
                item
            );

        }
    );

}


/* =========================================================
   COLORS
   ========================================================= */

function renderModalColors(product) {

    if (
        !storeModalColors
    ) {

        return;

    }


    storeModalColors.innerHTML =
        "";


    if (
        product.colors.length === 0
    ) {

        storeModalColors.hidden =
            true;

        return;

    }


    storeModalColors.hidden =
        false;


    product.colors.forEach(
        color => {

            const item =
                document.createElement(
                    "span"
                );


            item.className =
                "product-color";

            item.textContent =
                color;


            storeModalColors.appendChild(
                item
            );

        }
    );

}


/* =========================================================
   CLOSE PRODUCT MODAL
   ========================================================= */

function closeProductModal() {

    if (
        !storeProductModal
    ) {

        return;

    }


    storeProductModal.classList.remove(
        "active"
    );


    storeProductModal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";


    currentProduct =
        null;

}


/* =========================================================
   KEYBOARD
   ========================================================= */

function handleKeyboard(event) {

    if (
        event.key === "Escape"
    ) {

        closeProductModal();

        return;

    }


    if (
        !currentProduct
    ) {

        return;

    }


    if (
        event.key === "ArrowRight"
    ) {

        if (
            currentProduct.images.length
        ) {

            const next =
                (
                    currentImageIndex + 1
                ) %
                currentProduct.images.length;


            setModalImage(
                next
            );

        }

    }


    if (
        event.key === "ArrowLeft"
    ) {

        if (
            currentProduct.images.length
        ) {

            const previous =
                (
                    currentImageIndex -
                    1 +
                    currentProduct.images.length
                ) %
                currentProduct.images.length;


            setModalImage(
                previous
            );

        }

    }

}


/* =========================================================
   DESCRIPTION FORMATTER
   ========================================================= */

function formatDescription(
    description
) {

    if (!description) {

        return "";

    }


    return escapeHTML(
        description
    )
    .replace(
        /\r?\n\r?\n/g,
        "<br><br>"
    )
    .replace(
        /\r?\n/g,
        "<br>"
    );

}


/* =========================================================
   PRICE
   ========================================================= */

function formatPrice(value) {

    const price =
        Number(value);


    if (
        Number.isNaN(price)
    ) {

        return "$0.00 USD";

    }


    return (
        "$" +
        price.toFixed(2) +
        " " +
        VOLTICA_CURRENCY
    );

}


/* =========================================================
   HELPERS
   ========================================================= */

function cleanText(value) {

    return String(
        value ?? ""
    ).trim();

}


function numberValue(value) {

    const number =
        Number(value);


    return Number.isFinite(number)
        ? number
        : 0;

}


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


function escapeAttribute(value) {

    return escapeHTML(
        value
    );

}


/* =========================================================
   GLOBAL API
   ========================================================= */

window.VolticaStore = {

    getProducts() {

        return storeProducts;

    },


    getProduct(id) {

        return storeProducts.find(
            product =>
                product.id === id
        ) || null;

    },


    openProduct(id) {

        openProductModal(id);

    },


    closeProduct() {

        closeProductModal();

    },


    refresh() {

        loadProducts();

        renderStore();

    }

};
