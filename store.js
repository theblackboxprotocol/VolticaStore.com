/* =========================================================
   VOLTICA STORE
   STORE.JS
   Dynamic Store Engine
   Compatible with products.js
   ========================================================= */

"use strict";


/* =========================================================
   STATE
   ========================================================= */

let storeProducts = [];
let storeCart = [];

const CART_STORAGE_KEY = "voltica_cart";


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeStore
);


function initializeStore() {

    loadProducts();

    loadCart();

    setupEvents();

    renderStore();

    renderCart();

    updateCartCount();

    console.log(
        "VOLTICA STORE — ONLINE"
    );

}


/* =========================================================
   PRODUCTS
   ========================================================= */

function loadProducts() {

    if (
        Array.isArray(
            window.volticaProducts
        )
    ) {

        storeProducts =
            window.volticaProducts.filter(
                product =>
                    product &&
                    product.active !== false
            );

        return;

    }


    storeProducts = [];

    console.error(
        "VOLTICA: products.js is missing or invalid."
    );

}


/* =========================================================
   EVENTS
   ========================================================= */

function setupEvents() {

    const cartButton =
        document.getElementById(
            "cartButton"
        );

    const cartClose =
        document.getElementById(
            "cartClose"
        );

    const cartOverlay =
        document.getElementById(
            "cartOverlay"
        );

    const checkoutButton =
        document.getElementById(
            "checkoutButton"
        );


    cartButton?.addEventListener(
        "click",
        openCart
    );


    cartClose?.addEventListener(
        "click",
        closeCart
    );


    cartOverlay?.addEventListener(
        "click",
        closeCart
    );


    checkoutButton?.addEventListener(
        "click",
        checkoutCart
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeCart();

            }

        }
    );

}


/* =========================================================
   STORE RENDER
   ========================================================= */

function renderStore() {

    const grid =
        document.getElementById(
            "productGrid"
        );

    if (!grid) {

        return;

    }


    grid.innerHTML = "";


    if (
        storeProducts.length === 0
    ) {

        renderEmptyStore(
            grid
        );

        return;

    }


    storeProducts.forEach(
        product => {

            grid.appendChild(
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


    const image =
        getFirstImage(
            product
        );


    const price =
        formatPrice(
            product.price
        );


    const referencePrice =
        product.referencePrice !==
        undefined
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
                            alt="${escapeAttribute(
                                product.name ||
                                "Voltica Product"
                            )}"
                            loading="lazy"
                        >
                    `
                    : `
                        <div class="product-no-image">
                            VOLTICA
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
                    product.name ||
                    "VOLTICA PRODUCT"
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


            ${renderColorPreview(product)}


            <div class="product-actions">

                <button
                    type="button"
                    class="acrylic-button product-view-button"
                >
                    VIEW PRODUCT
                </button>


                <button
                    type="button"
                    class="acrylic-button product-buy-button"
                >
                    ${
                        product.stripeLink
                            ? "BUY NOW"
                            : "ADD TO CART"
                    }
                </button>

            </div>

        </div>

    `;


    attachCardEvents(
        article,
        product
    );


    return article;

}


/* =========================================================
   COLOR PREVIEW
   ========================================================= */

function renderColorPreview(
    product
) {

    const colors =
        Array.isArray(
            product.colors
        )
            ? product.colors
            : Array.isArray(
                product.variants
            )
                ? product.variants
                : [];


    if (!colors.length) {

        return "";

    }


    return `

        <div class="product-colors">

            <span>
                OPTIONS
            </span>

            <div class="color-list">

                ${colors
                    .slice(0, 6)
                    .map(
                        color => {

                            const name =
                                typeof color ===
                                "string"
                                    ? color
                                    : color.name ||
                                      color.color ||
                                      "OPTION";

                            return `

                                <span
                                    class="color-chip"
                                    title="${escapeAttribute(
                                        name
                                    )}"
                                    aria-label="${escapeAttribute(
                                        name
                                    )}"
                                ></span>

                            `;

                        }
                    )
                    .join("")
                }

            </div>

        </div>

    `;

}


/* =========================================================
   CARD EVENTS
   ========================================================= */

function attachCardEvents(
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


    viewButton?.addEventListener(
        "click",
        () => {

            openProduct(
                product.id
            );

        }
    );


    buyButton?.addEventListener(
        "click",
        () => {

            if (
                product.stripeLink
            ) {

                window.location.href =
                    product.stripeLink;

                return;

            }


            addToCart(
                product.id
            );

        }
    );


    const image =
        article.querySelector(
            ".product-image img"
        );


    image?.addEventListener(
        "click",
        () => {

            openProduct(
                product.id
            );

        }
    );


    if (image) {

        image.style.cursor =
            "pointer";

    }

}


/* =========================================================
   OPEN PRODUCT
   ========================================================= */

function openProduct(
    productId
) {

    if (
        productId === undefined ||
        productId === null
    ) {

        return;

    }


    window.location.href =
        `product-view.html?id=${encodeURIComponent(
            productId
        )}`;

}


/* =========================================================
   CART
   ========================================================= */

function loadCart() {

    try {

        const saved =
            localStorage.getItem(
                CART_STORAGE_KEY
            );


        if (!saved) {

            storeCart = [];

            return;

        }


        const parsed =
            JSON.parse(
                saved
            );


        storeCart =
            Array.isArray(parsed)
                ? parsed
                : [];

    } catch {

        storeCart = [];

    }

}


function saveCart() {

    try {

        localStorage.setItem(
            CART_STORAGE_KEY,
            JSON.stringify(
                storeCart
            )
        );

    } catch {

        console.warn(
            "VOLTICA: Could not save cart."
        );

    }

}


/* =========================================================
   ADD TO CART
   ========================================================= */

function addToCart(
    productId,
    quantity = 1,
    variant = null
) {

    const product =
        findProduct(
            productId
        );


    if (!product) {

        notify(
            "PRODUCT NOT FOUND"
        );

        return;

    }


    const amount =
        Math.max(
            1,
            Number(quantity) || 1
        );


    const existing =
        storeCart.find(
            item =>
                String(
                    item.productId
                ) ===
                String(productId)
                &&
                item.variant ===
                variant
        );


    if (existing) {

        existing.quantity +=
            amount;

    } else {

        storeCart.push({

            productId:
                product.id,

            quantity:
                amount,

            variant:
                variant

        });

    }


    saveCart();

    renderCart();

    updateCartCount();

    notify(
        "ADDED TO CART"
    );

}


/* =========================================================
   REMOVE
   ========================================================= */

function removeFromCart(
    productId,
    variant = null
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
                    item.variant ===
                    variant
                )
        );


    saveCart();

    renderCart();

    updateCartCount();

}


/* =========================================================
   QUANTITY
   ========================================================= */

function updateCartQuantity(
    productId,
    quantity,
    variant = null
) {

    const item =
        storeCart.find(
            entry =>
                String(
                    entry.productId
                ) ===
                String(productId)
                &&
                entry.variant ===
                variant
        );


    if (!item) {

        return;

    }


    const amount =
        Number(quantity);


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        removeFromCart(
            productId,
            variant
        );

        return;

    }


    item.quantity =
        Math.floor(
            amount
        );


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


    container.innerHTML = "";


    if (
        storeCart.length === 0
    ) {

        container.innerHTML = `

            <div class="cart-empty">

                <strong>
                    YOUR CART IS EMPTY
                </strong>

                <span>
                    Your selected products
                    will appear here.
                </span>

            </div>

        `;

        updateCartTotal();

        return;

    }


    storeCart.forEach(
        item => {

            const product =
                findProduct(
                    item.productId
                );


            if (!product) {

                return;

            }


            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "cart-item";


            const image =
                getFirstImage(
                    product
                );


            element.innerHTML = `

                <div class="cart-item-image">

                    ${
                        image
                            ? `
                                <img
                                    src="${escapeAttribute(
                                        image
                                    )}"
                                    alt="${escapeAttribute(
                                        product.name
                                    )}"
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
                        item.variant
                            ? `
                                <span>
                                    ${escapeHTML(
                                        item.variant
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
                            data-action="minus"
                        >
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            type="button"
                            data-action="plus"
                        >
                            +
                        </button>

                    </div>

                </div>


                <button
                    type="button"
                    class="cart-remove"
                    data-action="remove"
                    aria-label="Remove product"
                >
                    ×
                </button>

            `;


            element
                .querySelector(
                    '[data-action="minus"]'
                )
                ?.addEventListener(
                    "click",
                    () => {

                        updateCartQuantity(
                            item.productId,
                            item.quantity - 1,
                            item.variant
                        );

                    }
                );


            element
                .querySelector(
                    '[data-action="plus"]'
                )
                ?.addEventListener(
                    "click",
                    () => {

                        updateCartQuantity(
                            item.productId,
                            item.quantity + 1,
                            item.variant
                        );

                    }
                );


            element
                .querySelector(
                    '[data-action="remove"]'
                )
                ?.addEventListener(
                    "click",
                    () => {

                        removeFromCart(
                            item.productId,
                            item.variant
                        );

                    }
                );


            container.appendChild(
                element
            );

        }
    );


    updateCartTotal();

}


/* =========================================================
   CART TOTAL
   ========================================================= */

function updateCartTotal() {

    const element =
        document.getElementById(
            "cartTotal"
        );


    if (!element) {

        return;

    }


    const total =
        storeCart.reduce(
            (
                sum,
                item
            ) => {

                const product =
                    findProduct(
                        item.productId
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


    element.textContent =
        formatPrice(
            total
        );

}


/* =========================================================
   CART OPEN / CLOSE
   ========================================================= */

function openCart() {

    const drawer =
        document.getElementById(
            "cartDrawer"
        );

    const overlay =
        document.getElementById(
            "cartOverlay"
        );


    if (!drawer) {

        return;

    }


    drawer.classList.add(
        "open"
    );


    if (overlay) {

        overlay.hidden =
            false;

        overlay.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    document.body.classList.add(
        "cart-open"
    );


    renderCart();

}


function closeCart() {

    const drawer =
        document.getElementById(
            "cartDrawer"
        );

    const overlay =
        document.getElementById(
            "cartOverlay"
        );


    drawer?.classList.remove(
        "open"
    );


    if (overlay) {

        overlay.hidden =
            true;

        overlay.setAttribute(
            "aria-hidden",
            "true"
        );

    }


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

        notify(
            "YOUR CART IS EMPTY"
        );

        return;

    }


    if (
        storeCart.length !== 1
    ) {

        notify(
            "PLEASE CHECK OUT ONE PRODUCT AT A TIME"
        );

        return;

    }


    const item =
        storeCart[0];


    const product =
        findProduct(
            item.productId
        );


    if (
        !product ||
        !product.stripeLink
    ) {

        notify(
            "CHECKOUT UNAVAILABLE"
        );

        return;

    }


    window.location.href =
        product.stripeLink;

}


/* =========================================================
   HELPERS
   ========================================================= */

function findProduct(
    productId
) {

    return storeProducts.find(
        product =>
            String(product.id) ===
            String(productId)
    ) || null;

}


function getFirstImage(
    product
) {

    if (
        !product
    ) {

        return "";

    }


    if (
        Array.isArray(
            product.images
        )
    ) {

        const image =
            product.images.find(
                value =>
                    typeof value ===
                    "string" &&
                    value.trim()
            );

        if (image) {

            return image;

        }

    }


    if (
        typeof product.image ===
        "string"
    ) {

        return product.image;

    }


    return "";

}


function formatPrice(
    value
) {

    const number =
        Number(value);


    if (
        !Number.isFinite(number)
    ) {

        return "—";

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
   EMPTY STORE
   ========================================================= */

function renderEmptyStore(
    container
) {

    container.innerHTML = `

        <div class="store-empty-state">

            <span>
                VOLTICA
            </span>

            <h2>
                COLLECTION COMING SOON
            </h2>

            <p>
                New products are arriving soon.
            </p>

        </div>

    `;

}


/* =========================================================
   NOTIFICATION
   ========================================================= */

let notificationTimer = null;


function notify(
    message
) {

    let element =
        document.getElementById(
            "storeNotification"
        );


    if (!element) {

        element =
            document.createElement(
                "div"
            );

        element.id =
            "storeNotification";

        element.className =
            "store-notification";

        document.body.appendChild(
            element
        );

    }


    element.textContent =
        message;


    element.classList.add(
        "show"
    );


    clearTimeout(
        notificationTimer
    );


    notificationTimer =
        setTimeout(
            () => {

                element.classList.remove(
                    "show"
                );

            },
            2400
        );

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

window.VolticaStore = {

    getProducts() {

        return storeProducts;

    },

    getCart() {

        return storeCart;

    },

    reloadProducts() {

        loadProducts();

        renderStore();

    },

    addToCart,

    removeFromCart,

    updateCartQuantity,

    openCart,

    closeCart,

    checkoutCart,

    openProduct,

    renderStore,

    renderCart

};


/* =========================================================
   ENGINE READY
   ========================================================= */

console.log(
    "VOLTICA STORE ENGINE — READY"
);
