/* =========================================================
   VOLTICA STORE — STORE.JS
   Stable store engine
   ========================================================= */

"use strict";


/* =========================================================
   CONFIG
   ========================================================= */

const VOLTICA_CART_KEY = "volticaCart";


/* =========================================================
   STATE
   ========================================================= */

let storeProducts = [];
let storeCart = [];


/* =========================================================
   INIT
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeStore
);


function initializeStore() {

    loadProducts();

    loadCart();

    setupEvents();

    renderProducts();

    renderCart();

    updateCartCount();

}


/* =========================================================
   PRODUCT DATABASE
   ========================================================= */

function loadProducts() {

    /*
     * products.js is the single source of truth.
     * No dependency on admin localStorage.
     */

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

}


/* =========================================================
   RENDER PRODUCTS
   ========================================================= */

function renderProducts() {

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

        grid.innerHTML = `

            <div class="store-empty-state">

                <span>VOLTICA</span>

                <h2>
                    COLLECTION COMING SOON
                </h2>

            </div>

        `;

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

function createProductCard(product) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "store-product";


    const image =
        getProductImage(
            product
        );


    const price =
        formatPrice(
            product.price
        );


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
                                product.name
                            )}"
                            loading="lazy"
                        >
                    `
                    : ""
            }

        </div>


        <div class="product-info">

            <span class="product-category">

                ${escapeHTML(
                    product.category ||
                    "VOLTICA"
                )}

            </span>


            <h2 class="product-title">

                ${escapeHTML(
                    product.name ||
                    "Voltica Product"
                )}

            </h2>


            <p class="product-description">

                ${escapeHTML(
                    product.shortDescription ||
                    ""
                )}

            </p>


            <div class="product-price-row">

                <strong class="product-price">

                    ${price}

                </strong>

                ${
                    product.referencePrice
                        ? `
                            <span class="product-reference-price">
                                ${formatPrice(
                                    product.referencePrice
                                )}
                            </span>
                        `
                        : ""
                }

            </div>


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
                    BUY NOW
                </button>

            </div>

        </div>

    `;


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

            buyProduct(
                product
            );

        }
    );


    return article;

}


/* =========================================================
   PRODUCT IMAGE
   ========================================================= */

function getProductImage(product) {

    if (
        !product
    ) {

        return "";

    }


    if (
        Array.isArray(
            product.images
        ) &&
        product.images.length
    ) {

        return normalizeImagePath(
            product.images[0]
        );

    }


    if (
        product.image
    ) {

        return normalizeImagePath(
            product.image
        );

    }


    return "";

}


/* =========================================================
   IMAGE PATH NORMALIZER
   ========================================================= */

function normalizeImagePath(image) {

    if (
        typeof image !== "string"
    ) {

        return "";

    }


    const value =
        image.trim();


    if (!value) {

        return "";

    }


    /*
     * Keep absolute URLs untouched.
     */

    if (
        /^https?:\/\//i.test(
            value
        )
    ) {

        return value;

    }


    /*
     * Keep root-relative paths.
     */

    if (
        value.startsWith("/")
    ) {

        return value;

    }


    /*
     * Keep already-correct asset paths.
     */

    if (
        value.startsWith(
            "assets/"
        )
    ) {

        return value;

    }


    /*
     * Filename only.
     */

    return (
        "assets/images/" +
        value
    );

}


/* =========================================================
   OPEN PRODUCT
   ========================================================= */

function openProduct(productId) {

    if (
        productId === undefined ||
        productId === null
    ) {

        return;

    }


    window.location.href =
        "product-view.html?id=" +
        encodeURIComponent(
            productId
        );

}


/* =========================================================
   BUY PRODUCT
   ========================================================= */

function buyProduct(product) {

    if (
        !product
    ) {

        return;

    }


    const stripeLink =
        product.stripeLink ||
        product.stripe ||
        product.stripeUrl ||
        "";


    if (
        stripeLink
    ) {

        window.location.href =
            stripeLink;

        return;

    }


    addToCart(
        product.id
    );

    openCart();

}


/* =========================================================
   CART LOAD
   ========================================================= */

function loadCart() {

    try {

        const saved =
            localStorage.getItem(
                VOLTICA_CART_KEY
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


/* =========================================================
   CART SAVE
   ========================================================= */

function saveCart() {

    localStorage.setItem(
        VOLTICA_CART_KEY,
        JSON.stringify(
            storeCart
        )
    );

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

        return;

    }


    const qty =
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
                String(
                    productId
                ) &&
                item.variant ===
                variant
        );


    if (existing) {

        existing.quantity += qty;

    } else {

        storeCart.push({

            productId:
                product.id,

            quantity:
                qty,

            variant:
                variant

        });

    }


    saveCart();

    renderCart();

    updateCartCount();

}


/* =========================================================
   FIND PRODUCT
   ========================================================= */

function findProduct(productId) {

    return storeProducts.find(
        product =>
            String(
                product.id
            ) ===
            String(
                productId
            )
    ) || null;

}


/* =========================================================
   REMOVE CART ITEM
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
                    String(
                        productId
                    ) &&
                    item.variant ===
                    variant
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
    variant = null
) {

    const item =
        storeCart.find(
            entry =>
                String(
                    entry.productId
                ) ===
                String(
                    productId
                ) &&
                entry.variant ===
                variant
        );


    if (!item) {

        return;

    }


    const qty =
        Number(quantity);


    if (
        !Number.isFinite(qty) ||
        qty <= 0
    ) {

        removeFromCart(
            productId,
            variant
        );

        return;

    }


    item.quantity =
        Math.floor(qty);


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


            const image =
                getProductImage(
                    product
                );


            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "cart-item";


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
                    () =>
                        updateCartQuantity(
                            item.productId,
                            item.quantity - 1,
                            item.variant
                        )
                );


            element
                .querySelector(
                    '[data-action="plus"]'
                )
                ?.addEventListener(
                    "click",
                    () =>
                        updateCartQuantity(
                            item.productId,
                            item.quantity + 1,
                            item.variant
                        )
                );


            element
                .querySelector(
                    '[data-action="remove"]'
                )
                ?.addEventListener(
                    "click",
                    () =>
                        removeFromCart(
                            item.productId,
                            item.variant
                        )
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
   CART OPEN
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


    overlay?.classList.add(
        "open"
    );


    document.body.classList.add(
        "cart-open"
    );


    renderCart();

}


/* =========================================================
   CART CLOSE
   ========================================================= */

function closeCart() {

    document
        .getElementById(
            "cartDrawer"
        )
        ?.classList.remove(
            "open"
        );


    document
        .getElementById(
            "cartOverlay"
        )
        ?.classList.remove(
            "open"
        );


    document.body.classList.remove(
        "cart-open"
    );

}


/* =========================================================
   CHECKOUT
   ========================================================= */

function checkoutCart() {

    if (
        storeCart.length === 0
    ) {

        return;

    }


    /*
     * Stripe Payment Links are
     * product-specific.
     *
     * For now, one product per
     * Stripe checkout.
     */

    if (
        storeCart.length !== 1
    ) {

        return;

    }


    const item =
        storeCart[0];


    const product =
        findProduct(
            item.productId
        );


    if (
        !product
    ) {

        return;

    }


    const stripeLink =
        product.stripeLink ||
        product.stripe ||
        product.stripeUrl;


    if (
        stripeLink
    ) {

        window.location.href =
            stripeLink;

    }

}


/* =========================================================
   PRICE
   ========================================================= */

function formatPrice(value) {

    const number =
        Number(value);


    if (
        !Number.isFinite(
            number
        )
    ) {

        return "—";

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


function escapeAttribute(value) {

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

        renderProducts();

    },

    addToCart,

    removeFromCart,

    updateCartQuantity,

    openCart,

    closeCart,

    checkoutCart,

    openProduct,

    buyProduct,

    renderProducts,

    renderCart

};
