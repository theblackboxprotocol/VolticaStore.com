/* =========================================================
   VOLTICA STORE
   STORE.JS
   Dynamic Product Store Engine
   ========================================================= */

"use strict";


/* =========================================================
   GLOBAL
   ========================================================= */

let storeProducts = [];

let storeCart = [];


/* =========================================================
   CONFIGURATION
   ========================================================= */

const STORE_STORAGE_KEY = "volticaCart";

const PRODUCT_VIEW_PAGE = "product-view.html";


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeStore
);


function initializeStore() {

    loadStoreProducts();

    loadCart();

    setupStoreEvents();

    renderStore();

    renderCart();

    updateCartCount();

    console.log(
        "VOLTICA STORE — READY",
        storeProducts
    );

}


/* =========================================================
   LOAD PRODUCTS
   ========================================================= */

function loadStoreProducts() {

    /*
     * products.js MUST be loaded before store.js.
     */

    if (
        !Array.isArray(
            window.volticaProducts
        )
    ) {

        storeProducts = [];

        console.error(
            "VOLTICA ERROR: volticaProducts is unavailable."
        );

        showStoreNotification(
            "PRODUCT DATABASE NOT LOADED"
        );

        return;

    }


    /*
     * Normalize every product before
     * sending it to the Store engine.
     */

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


    console.log(
        `VOLTICA: ${storeProducts.length} active product(s) loaded.`
    );

}


/* =========================================================
   NORMALIZE PRODUCT
   ========================================================= */

function normalizeProduct(
    product
) {

    const normalized =
        {
            ...product,

            id:
                String(
                    product.id || ""
                ).trim(),

            name:
                String(
                    product.name || ""
                ).trim(),

            category:
                String(
                    product.category || ""
                ).trim(),

            badge:
                String(
                    product.badge || ""
                ).trim(),

            sku:
                String(
                    product.sku || ""
                ).trim(),

            price:
                Number(
                    product.price
                ) || 0,

            referencePrice:
                Number(
                    product.referencePrice
                ) || 0,

            shortDescription:
                String(
                    product.shortDescription || ""
                ).trim(),

            description:
                String(
                    product.description || ""
                ).trim(),

            stripeLink:
                String(
                    product.stripeLink || ""
                ).trim(),

            supplierLink:
                String(
                    product.supplierLink || ""
                ).trim(),

            images:
                normalizeProductImages(
                    product.images
                ),

            colors:
                normalizeColors(
                    product.colors
                ),

            variants:
                Array.isArray(
                    product.variants
                )
                    ? product.variants
                    : []

        };


    return normalized;

}


/* =========================================================
   NORMALIZE IMAGES
   ========================================================= */

function normalizeProductImages(
    images
) {

    if (
        !Array.isArray(images)
    ) {

        return [];

    }


    return images
        .map(
            image => {

                /*
                 * Format 1:
                 * "assets/images/q45-1.jpg"
                 */

                if (
                    typeof image ===
                    "string"
                ) {

                    return image.trim();

                }


                /*
                 * Format 2:
                 * {
                 *     name: "q45-1.jpg",
                 *     path: "assets/images/q45-1.jpg"
                 * }
                 */

                if (
                    image &&
                    typeof image ===
                    "object"
                ) {

                    if (
                        image.path
                    ) {

                        return String(
                            image.path
                        ).trim();

                    }


                    if (
                        image.name
                    ) {

                        return (
                            "assets/images/" +
                            String(
                                image.name
                            ).trim()
                        );

                    }

                }


                return "";

            }
        )
        .filter(Boolean);

}


/* =========================================================
   NORMALIZE COLORS
   ========================================================= */

function normalizeColors(
    colors
) {

    if (
        !Array.isArray(colors)
    ) {

        return [];

    }


    return colors
        .map(
            color =>
                String(
                    color || ""
                ).trim()
        )
        .filter(Boolean);

}


/* =========================================================
   STORE EVENTS
   ========================================================= */

function setupStoreEvents() {

    const searchInput =
        document.getElementById(
            "storeSearch"
        );


    const categoryFilter =
        document.getElementById(
            "storeCategory"
        );


    const cartButton =
        document.getElementById(
            "cartButton"
        );


    const closeCartButton =
        document.getElementById(
            "closeCart"
        );


    const cartOverlay =
        document.getElementById(
            "cartOverlay"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            renderStore
        );

    }


    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            renderStore
        );

    }


    if (cartButton) {

        cartButton.addEventListener(
            "click",
            openCart
        );

    }


    if (closeCartButton) {

        closeCartButton.addEventListener(
            "click",
            closeCart
        );

    }


    if (cartOverlay) {

        cartOverlay.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    cartOverlay
                ) {

                    closeCart();

                }

            }
        );

    }


    setupCategoryFilter();

}


/* =========================================================
   CATEGORY FILTER
   ========================================================= */

function setupCategoryFilter() {

    const filter =
        document.getElementById(
            "storeCategory"
        );


    if (!filter) {

        return;

    }


    const categories =
        [
            ...new Set(
                storeProducts
                    .map(
                        product =>
                            product.category
                    )
                    .filter(Boolean)
            )
        ]
        .sort(
            (a, b) =>
                a.localeCompare(b)
        );


    filter.innerHTML = `

        <option value="all">
            ALL COLLECTIONS
        </option>

    `;


    categories.forEach(
        category => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                category;


            option.textContent =
                category;


            filter.appendChild(
                option
            );

        }
    );

}


/* =========================================================
   RENDER STORE
   ========================================================= */

function renderStore() {

    const container =
        document.getElementById(
            "storeProducts"
        );


    if (!container) {

        console.warn(
            "VOLTICA: #storeProducts not found."
        );

        return;

    }


    const searchInput =
        document.getElementById(
            "storeSearch"
        );


    const categoryFilter =
        document.getElementById(
            "storeCategory"
        );


    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const category =
        categoryFilter
            ? categoryFilter.value
            : "all";


    const filtered =
        storeProducts.filter(
            product => {

                const searchable =
                    [

                        product.name,
                        product.category,
                        product.shortDescription,
                        product.description,
                        product.sku

                    ]
                    .join(" ")
                    .toLowerCase();


                const matchesSearch =
                    !search ||
                    searchable.includes(
                        search
                    );


                const matchesCategory =
                    category === "all" ||
                    product.category ===
                        category;


                return (
                    matchesSearch &&
                    matchesCategory
                );

            }
        );


    container.innerHTML =
        "";


    if (
        !filtered.length
    ) {

        renderEmptyStore(
            container
        );

        return;

    }


    filtered.forEach(
        product => {

            container.appendChild(
                createProductCard(
                    product
                )
            );

        }
    );

}


/* =========================================================
   PRODUCT CARD
   ========================================================= */

function createProductCard(
    product
) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "store-product";


    article.dataset.productId =
        product.id;


    /*
     * IMPORTANT:
     * normalizeProductImages()
     * guarantees that this is
     * a STRING path.
     */

    const image =
        getProductImage(
            product,
            0
        );


    const price =
        formatPrice(
            product.price
        );


    const referencePrice =
        Number(
            product.referencePrice
        ) > 0
            ? formatPrice(
                product.referencePrice
            )
            : "";


    article.innerHTML = `

        <div class="product-image">

            ${
                product.badge
                    ? `
                        <span class="product-badge">
                            ${escapeHTML(
                                product.badge
                            )}
                        </span>
                    `
                    : ""
            }


            ${
                image
                    ? `
                        <img
                            src="${escapeAttribute(image)}"
                            alt="${escapeAttribute(product.name)}"
                            loading="lazy"
                            decoding="async"
                        >
                    `
                    : `
                        <div class="product-no-image">
                            IMAGE UNAVAILABLE
                        </div>
                    `
            }


            <div class="image-reflection"></div>

        </div>


        <div class="product-info">

            <span class="product-category">

                ${escapeHTML(
                    product.category ||
                    "COLLECTION"
                )}

            </span>


            <h2 class="product-title">

                ${escapeHTML(
                    product.name
                )}

            </h2>


            <p class="product-description">

                ${escapeHTML(
                    product.shortDescription ||
                    product.description ||
                    ""
                )}

            </p>


            <div class="product-price-row">

                <strong class="product-price">

                    ${price}

                </strong>


                ${
                    referencePrice
                        ? `
                            <span class="product-reference-price">
                                ${referencePrice}
                            </span>
                        `
                        : ""
                }

            </div>


            ${
                product.colors.length
                    ? createColorPreview(
                        product.colors
                    )
                    : ""
            }


            <div class="product-actions">

                <button
                    type="button"
                    class="acrylic-button product-view-button"
                    data-product-id="${escapeAttribute(product.id)}"
                >
                    VIEW PRODUCT
                </button>


                ${
                    product.stripeLink
                        ? `
                            <button
                                type="button"
                                class="acrylic-button product-buy-button"
                                data-stripe="${escapeAttribute(product.stripeLink)}"
                                data-product-id="${escapeAttribute(product.id)}"
                            >
                                BUY NOW
                            </button>
                        `
                        : ""
                }

            </div>

        </div>

    `;


    attachProductCardEvents(
        article,
        product
    );


    return article;

}


/* =========================================================
   PRODUCT IMAGE
   ========================================================= */

function getProductImage(
    product,
    index = 0
) {

    if (
        !product ||
        !Array.isArray(
            product.images
        )
    ) {

        return "";

    }


    return (
        product.images[index] ||
        ""
    );

}


/* =========================================================
   COLOR PREVIEW
   ========================================================= */

function createColorPreview(
    colors
) {

    const safeColors =
        colors.slice(
            0,
            6
        );


    return `

        <div class="product-colors">

            <span>
                OPTIONS
            </span>

            <div class="color-list">

                ${safeColors
                    .map(
                        color => `

                            <button
                                type="button"
                                class="color-chip"
                                title="${escapeAttribute(color)}"
                                aria-label="${escapeAttribute(color)}"
                            >
                            </button>

                        `
                    )
                    .join("")}

            </div>

        </div>

    `;

}


/* =========================================================
   PRODUCT CARD EVENTS
   ========================================================= */

function attachProductCardEvents(
    article,
    product
) {

    const viewButton =
        article.querySelector(
            ".product-view-button"
        );


    const buyButton =
        article.querySelector(
            ".product-buy-button"
        );


    if (viewButton) {

        viewButton.addEventListener(
            "click",
            () => {

                openProduct(
                    product.id
                );

            }
        );

    }


    if (buyButton) {

        buyButton.addEventListener(
            "click",
            () => {

                if (
                    product.stripeLink
                ) {

                    window.location.href =
                        product.stripeLink;

                }

            }
        );

    }


    const image =
        article.querySelector(
            ".product-image img"
        );


    if (image) {

        image.addEventListener(
            "click",
            () => {

                openProduct(
                    product.id
                );

            }
        );


        image.style.cursor =
            "pointer";


        /*
         * If an image fails,
         * show a clean fallback.
         */

        image.addEventListener(
            "error",
            () => {

                image.style.display =
                    "none";

                const parent =
                    image.parentElement;


                if (
                    parent &&
                    !parent.querySelector(
                        ".product-image-error"
                    )
                ) {

                    const fallback =
                        document.createElement(
                            "div"
                        );


                    fallback.className =
                        "product-image-error";


                    fallback.textContent =
                        "IMAGE UNAVAILABLE";


                    parent.appendChild(
                        fallback
                    );

                }

            }
        );

    }

}


/* =========================================================
   OPEN PRODUCT
   ========================================================= */

function openProduct(
    productId
) {

    const id =
        String(
            productId || ""
        ).trim();


    if (!id) {

        console.error(
            "VOLTICA: Cannot open product without an ID."
        );

        return;

    }


    /*
     * Verify that the product actually
     * exists before navigating.
     */

    const product =
        storeProducts.find(
            item =>
                String(item.id) ===
                id
        );


    if (!product) {

        console.error(
            "VOLTICA: Product not found:",
            id
        );

        showStoreNotification(
            "PRODUCT NOT FOUND"
        );

        return;

    }


    const url =
        `${PRODUCT_VIEW_PAGE}?id=${encodeURIComponent(id)}`;


    console.log(
        "VOLTICA: Opening product",
        product.name,
        id
    );


    window.location.href =
        url;

}


/* =========================================================
   EMPTY STORE
   ========================================================= */

function renderEmptyStore(
    container
) {

    container.innerHTML = `

        <div class="store-empty-state">

            <div class="store-empty-pulsar"></div>


            <span>
                COLLECTION
            </span>


            <h2>
                NOTHING HERE YET
            </h2>


            <p>
                New Voltica products are arriving soon.
            </p>

        </div>

    `;

}


/* =========================================================
   CART
   ========================================================= */

function loadCart() {

    try {

        const saved =
            localStorage.getItem(
                STORE_STORAGE_KEY
            );


        if (saved) {

            const parsed =
                JSON.parse(
                    saved
                );


            if (
                Array.isArray(parsed)
            ) {

                storeCart =
                    parsed;

            }

        }

    } catch (error) {

        console.error(
            "VOLTICA: cart could not be loaded.",
            error
        );


        storeCart = [];

    }

}


/* =========================================================
   SAVE CART
   ========================================================= */

function saveCart() {

    try {

        localStorage.setItem(
            STORE_STORAGE_KEY,
            JSON.stringify(
                storeCart
            )
        );

    } catch (error) {

        console.error(
            "VOLTICA: cart could not be saved.",
            error
        );

    }

}


/* =========================================================
   ADD TO CART
   ========================================================= */

function addToCart(
    productId,
    quantity = 1,
    color = null
) {

    const product =
        storeProducts.find(
            item =>
                String(item.id) ===
                String(productId)
        );


    if (!product) {

        showStoreNotification(
            "PRODUCT NOT FOUND"
        );

        return;

    }


    const selectedColor =
        color
            ? String(color)
            : null;


    const existing =
        storeCart.find(
            item =>

                String(
                    item.productId
                ) ===
                    String(productId)

                &&

                item.color ===
                    selectedColor
        );


    if (existing) {

        existing.quantity +=
            quantity;

    } else {

        storeCart.push({

            productId:
                product.id,

            quantity:
                Math.max(
                    1,
                    Number(quantity) || 1
                ),

            color:
                selectedColor

        });

    }


    saveCart();

    renderCart();

    updateCartCount();

    showStoreNotification(
        "ADDED TO CART"
    );

}


/* =========================================================
   REMOVE FROM CART
   ========================================================= */

function removeFromCart(
    productId,
    color = null
) {

    storeCart =
        storeCart.filter(
            item =>

                !(
                    String(
                        item.productId
                    ) ===
                        String(productId)

                    &&

                    item.color ===
                        color
                )
        );


    saveCart();

    renderCart();

    updateCartCount();

}


/* =========================================================
   UPDATE QUANTITY
   ========================================================= */

function updateCartQuantity(
    productId,
    quantity,
    color = null
) {

    const item =
        storeCart.find(
            entry =>

                String(
                    entry.productId
                ) ===
                    String(productId)

                &&

                entry.color ===
                    color
        );


    if (!item) {

        return;

    }


    const newQuantity =
        Number(quantity);


    if (
        newQuantity <= 0
    ) {

        removeFromCart(
            productId,
            color
        );

        return;

    }


    item.quantity =
        newQuantity;


    saveCart();

    renderCart();

    updateCartCount();

}


/* =========================================================
   CART COUNT
   ========================================================= */

function updateCartCount() {

    const count =
        storeCart.reduce(
            (
                total,
                item
            ) =>
                total +
                (
                    Number(
                        item.quantity
                    ) || 0
                ),
            0
        );


    document
        .querySelectorAll(
            ".cart-count"
        )
        .forEach(
            element => {

                element.textContent =
                    count;

                element.classList.toggle(
                    "visible",
                    count > 0
                );

            }
        );


    const cartCount =
        document.getElementById(
            "cartCount"
        );


    if (cartCount) {

        cartCount.textContent =
            count;

    }

}


/* =========================================================
   RENDER CART
   ========================================================= */

function renderCart() {

    const container =
        document.getElementById(
            "cartItems"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    if (
        !storeCart.length
    ) {

        container.innerHTML = `

            <div class="cart-empty">

                <div class="cart-empty-pulsar"></div>

                <strong>
                    YOUR CART IS EMPTY
                </strong>

                <span>
                    Your selected products will appear here.
                </span>

            </div>

        `;


        updateCartTotal();

        return;

    }


    storeCart.forEach(
        item => {

            const product =
                storeProducts.find(
                    product =>
                        String(
                            product.id
                        ) ===
                        String(
                            item.productId
                        )
                );


            if (!product) {

                return;

            }


            const cartItem =
                document.createElement(
                    "div"
                );


            cartItem.className =
                "cart-item";


            const image =
                getProductImage(
                    product,
                    0
                );


            cartItem.innerHTML = `

                <div class="cart-item-image">

                    ${
                        image
                            ? `
                                <img
                                    src="${escapeAttribute(image)}"
                                    alt="${escapeAttribute(product.name)}"
                                    loading="lazy"
                                >
                            `
                            : ""
                    }

                </div>


                <div class="cart-item-info">

                    <strong>
                        ${escapeHTML(
                            product.name
                        )}
                    </strong>


                    ${
                        item.color
                            ? `
                                <span>
                                    ${escapeHTML(
                                        item.color
                                    )}
                                </span>
                            `
                            : ""
                    }


                    <span>
                        ${formatPrice(
                            product.price
                        )}
                    </span>


                    <div class="cart-quantity">

                        <button
                            type="button"
                            data-cart-action="minus"
                        >
                            −
                        </button>


                        <span>
                            ${item.quantity}
                        </span>


                        <button
                            type="button"
                            data-cart-action="plus"
                        >
                            +
                        </button>

                    </div>

                </div>


                <button
                    type="button"
                    class="cart-remove"
                    data-cart-action="remove"
                >
                    ×
                </button>

            `;


            cartItem
                .querySelector(
                    '[data-cart-action="minus"]'
                )
                .addEventListener(
                    "click",
                    () => {

                        updateCartQuantity(
                            item.productId,
                            item.quantity - 1,
                            item.color
                        );

                    }
                );


            cartItem
                .querySelector(
                    '[data-cart-action="plus"]'
                )
                .addEventListener(
                    "click",
                    () => {

                        updateCartQuantity(
                            item.productId,
                            item.quantity + 1,
                            item.color
                        );

                    }
                );


            cartItem
                .querySelector(
                    '[data-cart-action="remove"]'
                )
                .addEventListener(
                    "click",
                    () => {

                        removeFromCart(
                            item.productId,
                            item.color
                        );

                    }
                );


            container.appendChild(
                cartItem
            );

        }
    );


    updateCartTotal();

}


/* =========================================================
   CART TOTAL
   ========================================================= */

function updateCartTotal() {

    const totalElement =
        document.getElementById(
            "cartTotal"
        );


    if (!totalElement) {

        return;

    }


    const total =
        storeCart.reduce(
            (
                sum,
                item
            ) => {

                const product =
                    storeProducts.find(
                        product =>
                            String(
                                product.id
                            ) ===
                            String(
                                item.productId
                            )
                    );


                if (!product) {

                    return sum;

                }


                return (
                    sum +
                    (
                        Number(
                            product.price
                        ) || 0
                    ) *
                    (
                        Number(
                            item.quantity
                        ) || 0
                    )
                );

            },
            0
        );


    totalElement.textContent =
        formatPrice(
            total
        );

}


/* =========================================================
   OPEN CART
   ========================================================= */

function openCart() {

    const overlay =
        document.getElementById(
            "cartOverlay"
        );


    if (!overlay) {

        return;

    }


    overlay.hidden =
        false;


    document.body.classList.add(
        "cart-open"
    );


    renderCart();

}


/* =========================================================
   CLOSE CART
   ========================================================= */

function closeCart() {

    const overlay =
        document.getElementById(
            "cartOverlay"
        );


    if (!overlay) {

        return;

    }


    overlay.hidden =
        true;


    document.body.classList.remove(
        "cart-open"
    );

}


/* =========================================================
   CHECKOUT
   ========================================================= */

function checkoutCart() {

    if (
        !storeCart.length
    ) {

        showStoreNotification(
            "YOUR CART IS EMPTY"
        );

        return;

    }


    /*
     * Stripe Payment Links are
     * product-specific.
     */

    if (
        storeCart.length === 1
    ) {

        const item =
            storeCart[0];


        const product =
            storeProducts.find(
                product =>
                    String(
                        product.id
                    ) ===
                    String(
                        item.productId
                    )
            );


        if (
            product &&
            product.stripeLink
        ) {

            window.location.href =
                product.stripeLink;

            return;

        }

    }


    showStoreNotification(
        "SELECT ONE PRODUCT AT A TIME FOR STRIPE CHECKOUT"
    );

}


/* =========================================================
   NOTIFICATION
   ========================================================= */

let storeNotificationTimer;


function showStoreNotification(
    message
) {

    let notification =
        document.getElementById(
            "storeNotification"
        );


    if (!notification) {

        notification =
            document.createElement(
                "div"
            );


        notification.id =
            "storeNotification";


        notification.className =
            "store-notification";


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
        storeNotificationTimer
    );


    storeNotificationTimer =
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
   PRICE
   ========================================================= */

function formatPrice(
    value
) {

    const number =
        Number(value) || 0;


    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: "USD"
        }
    ).format(
        number
    );

}


/* =========================================================
   HTML SECURITY
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

window.VolticaStore = {

    getProducts() {

        return storeProducts;

    },


    getCart() {

        return storeCart;

    },


    addToCart,

    removeFromCart,

    updateCartQuantity,

    openCart,

    closeCart,

    checkoutCart,

    openProduct,

    renderStore,

    renderCart,

    formatPrice

};


/* =========================================================
   VOLTICA STORE ENGINE READY
   ========================================================= */

console.log(
    "VOLTICA STORE ENGINE — ONLINE"
);
