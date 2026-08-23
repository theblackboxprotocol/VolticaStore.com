/* =========================================================
   VOLTICA STORE
   STORE ENGINE
   ========================================================= */

"use strict";


/* =========================================================
   CONFIGURATION
   ========================================================= */

const VOLTICA_STORE_CONFIG = {

    imageBasePath: "assets/images/",

    currency: "USD",

    stripeCheckout:
        "https://buy.stripe.com/eVqeVe2hNgILbyoaWK2Ji0j",

    storageKey:
        "voltica_cart"

};


/* =========================================================
   STATE
   ========================================================= */

const VolticaStoreState = {

    products: [],

    cart: [],

    initialized: false

};


/* =========================================================
   DOM
   ========================================================= */

const StoreDOM = {

    productGrid:
        document.getElementById("productGrid"),

    cartButton:
        document.getElementById("cartButton"),

    cartCount:
        document.getElementById("cartCount"),

    cartDrawer:
        document.getElementById("cartDrawer"),

    cartOverlay:
        document.getElementById("cartOverlay"),

    cartClose:
        document.getElementById("cartClose"),

    cartItems:
        document.getElementById("cartItems"),

    cartTotal:
        document.getElementById("cartTotal"),

    checkoutButton:
        document.getElementById("checkoutButton")

};


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeStore
);


function initializeStore() {

    if (
        VolticaStoreState.initialized
    ) {

        return;

    }


    VolticaStoreState.initialized =
        true;


    loadProducts();

    loadCart();

    renderProducts();

    initializeCart();

    normalizeStripeLinks();

    updateCartUI();


    window.dispatchEvent(
        new CustomEvent(
            "volticaStoreReady"
        )
    );

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

        VolticaStoreState.products =
            window.volticaProducts.filter(
                product =>
                    product &&
                    product.active !== false
            );

        return;

    }


    VolticaStoreState.products =
        [];

}


/* =========================================================
   RENDER PRODUCTS
   ========================================================= */

function renderProducts() {

    const grid =
        StoreDOM.productGrid;


    if (!grid) {

        return;

    }


    grid.innerHTML = "";


    const products =
        VolticaStoreState.products;


    if (
        products.length === 0
    ) {

        grid.innerHTML = `

            <div class="store-empty">

                <span>
                    VOLTICA
                </span>

                <strong>
                    COLLECTION EMPTY
                </strong>

                <p>
                    New products are arriving soon.
                </p>

            </div>

        `;

        return;

    }


    products.forEach(
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
   CREATE PRODUCT CARD
   ========================================================= */

/*
 * IMPORTANT:
 *
 * NO LARGE PRODUCT IMAGE IS CREATED HERE.
 *
 * The Store grid intentionally displays:
 *
 * CATEGORY
 * PRODUCT NAME
 * DESCRIPTION
 * PRICE
 * VIEW PRODUCT
 * PRE-ORDER / BUY
 *
 * Images remain available in products.js and
 * are handled by product.html.
 */

function createProductCard(product) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "store-product";


    article.dataset.productId =
        product.id || "";


    const category =
        product.category ||
        "VOLtica COLLECTION";


    const badge =
        product.badge ||
        "";


    const description =
        product.shortDescription ||
        product.description ||
        "Premium technology engineered for everyday life.";


    const price =
        formatPrice(
            product.price
        );


    const referencePrice =
        Number(
            product.referencePrice || 0
        );


    const stripeLink =
        product.stripeLink ||
        VOLTICA_STORE_CONFIG.stripeCheckout;


    article.innerHTML = `

        <div class="product-info">

            ${
                badge
                    ? `
                        <span class="product-badge">
                            ${escapeHTML(badge)}
                        </span>
                    `
                    : ""
            }


            <span class="product-category">
                ${escapeHTML(category)}
            </span>


            <h2 class="product-title">
                ${escapeHTML(
                    product.name ||
                    "VOLTICA PRODUCT"
                )}
            </h2>


            <p class="product-description">
                ${escapeHTML(description)}
            </p>


            <div class="product-price-row">

                <strong class="product-price">
                    ${price}
                </strong>

                ${
                    referencePrice > Number(product.price || 0)
                        ? `
                            <span class="product-reference-price">
                                ${formatPrice(referencePrice)}
                            </span>
                        `
                        : ""
                }

            </div>


            <div class="product-actions">

                <a
                    href="product.html?id=${encodeURIComponent(product.id || "")}"
                    class="acrylic-button product-view-button"
                    data-action="view"
                    data-product-id="${escapeAttribute(product.id || "")}"
                >
                    VIEW PRODUCT
                </a>


                <a
                    href="${escapeAttribute(stripeLink)}"
                    class="acrylic-button product-buy-button"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-action="buy"
                    data-product-id="${escapeAttribute(product.id || "")}"
                >
                    ${
                        product.stripeLink
                            ? "BUY NOW"
                            : "PRE-ORDER"
                    }
                </a>

            </div>


            <div class="product-meta">

                ${
                    product.sku
                        ? `
                            <span>
                                SKU ${escapeHTML(product.sku)}
                            </span>
                        `
                        : ""
                }

            </div>

        </div>

    `;


    return article;

}


/* =========================================================
   CART INITIALIZATION
   ========================================================= */

function initializeCart() {

    StoreDOM.cartButton
        ?.addEventListener(
            "click",
            openCart
        );


    StoreDOM.cartClose
        ?.addEventListener(
            "click",
            closeCart
        );


    StoreDOM.cartOverlay
        ?.addEventListener(
            "click",
            closeCart
        );


    StoreDOM.checkoutButton
        ?.addEventListener(
            "click",
            checkout
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
   LOAD CART
   ========================================================= */

function loadCart() {

    try {

        const saved =
            localStorage.getItem(
                VOLTICA_STORE_CONFIG.storageKey
            );


        if (!saved) {

            VolticaStoreState.cart =
                [];

            return;

        }


        const parsed =
            JSON.parse(saved);


        VolticaStoreState.cart =
            Array.isArray(parsed)
                ? parsed
                : [];

    }
    catch (error) {

        console.warn(
            "Voltica cart could not be loaded.",
            error
        );


        VolticaStoreState.cart =
            [];

    }

}


/* =========================================================
   SAVE CART
   ========================================================= */

function saveCart() {

    try {

        localStorage.setItem(
            VOLTICA_STORE_CONFIG.storageKey,
            JSON.stringify(
                VolticaStoreState.cart
            )
        );

    }
    catch (error) {

        console.warn(
            "Voltica cart could not be saved.",
            error
        );

    }

}


/* =========================================================
   OPEN CART
   ========================================================= */

function openCart() {

    if (
        !StoreDOM.cartDrawer
    ) {

        return;

    }


    StoreDOM.cartDrawer.classList.add(
        "active"
    );


    StoreDOM.cartOverlay?.classList.add(
        "active"
    );


    StoreDOM.cartOverlay?.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   CLOSE CART
   ========================================================= */

function closeCart() {

    StoreDOM.cartDrawer?.classList.remove(
        "active"
    );


    StoreDOM.cartOverlay?.classList.remove(
        "active"
    );


    StoreDOM.cartOverlay?.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";

}


/* =========================================================
   ADD TO CART
   ========================================================= */

function addToCart(
    product,
    quantity = 1
) {

    if (!product) {

        return;

    }


    const id =
        String(
            product.id ||
            product.sku ||
            product.name
        );


    const amount =
        Math.max(
            1,
            Number(quantity) || 1
        );


    const existing =
        VolticaStoreState.cart.find(
            item =>
                String(item.id) === id
        );


    if (existing) {

        existing.quantity =
            Number(
                existing.quantity || 1
            ) +
            amount;

    }
    else {

        VolticaStoreState.cart.push({

            id,

            name:
                product.name || "",

            price:
                Number(
                    product.price || 0
                ),

            quantity:
                amount,

            image:
                getProductImage(
                    product
                )

        });

    }


    saveCart();

    updateCartUI();

}


/* =========================================================
   REMOVE FROM CART
   ========================================================= */

function removeFromCart(
    productId
) {

    VolticaStoreState.cart =
        VolticaStoreState.cart.filter(
            item =>
                String(item.id) !==
                String(productId)
        );


    saveCart();

    updateCartUI();

    renderCart();

}


/* =========================================================
   CHANGE CART QUANTITY
   ========================================================= */

function changeCartQuantity(
    productId,
    change
) {

    const item =
        VolticaStoreState.cart.find(
            cartItem =>
                String(cartItem.id) ===
                String(productId)
        );


    if (!item) {

        return;

    }


    item.quantity =
        Number(
            item.quantity || 1
        ) +
        Number(change || 0);


    if (
        item.quantity <= 0
    ) {

        removeFromCart(
            productId
        );

        return;

    }


    saveCart();

    updateCartUI();

    renderCart();

}


/* =========================================================
   CLEAR CART
   ========================================================= */

function clearCart() {

    VolticaStoreState.cart =
        [];


    saveCart();

    updateCartUI();

    renderCart();

}


/* =========================================================
   UPDATE CART UI
   ========================================================= */

function updateCartUI() {

    updateCartCount();

    renderCart();

}


/* =========================================================
   CART COUNT
   ========================================================= */

function updateCartCount() {

    if (
        !StoreDOM.cartCount
    ) {

        return;

    }


    const count =
        VolticaStoreState.cart.reduce(
            (
                total,
                item
            ) => {

                return (
                    total +
                    Number(
                        item.quantity || 1
                    )
                );

            },
            0
        );


    StoreDOM.cartCount.textContent =
        count;


    StoreDOM.cartCount.classList.toggle(
        "has-items",
        count > 0
    );

}


/* =========================================================
   RENDER CART
   ========================================================= */

function renderCart() {

    if (
        !StoreDOM.cartItems
    ) {

        return;

    }


    const cart =
        VolticaStoreState.cart;


    StoreDOM.cartItems.innerHTML =
        "";


    if (
        cart.length === 0
    ) {

        StoreDOM.cartItems.innerHTML = `

            <div class="cart-empty">

                <span>
                    VOLTICA
                </span>

                <strong>
                    YOUR CART IS EMPTY
                </strong>

                <p>
                    Add a product to begin.
                </p>

            </div>

        `;

    }
    else {

        cart.forEach(
            item => {

                StoreDOM.cartItems.appendChild(
                    createCartItem(
                        item
                    )
                );

            }
        );

    }


    updateCartTotal();

}


/* =========================================================
   CREATE CART ITEM
   ========================================================= */

function createCartItem(item) {

    const element =
        document.createElement(
            "div"
        );


    element.className =
        "cart-item";


    element.innerHTML = `

        <div class="cart-item-info">

            <strong>
                ${escapeHTML(
                    item.name ||
                    "VOLTICA PRODUCT"
                )}
            </strong>


            <span>
                ${formatPrice(item.price)}
            </span>

        </div>


        <div class="cart-item-controls">

            <button
                type="button"
                data-cart-action="decrease"
                data-cart-id="${escapeAttribute(item.id)}"
            >
                −
            </button>


            <span>
                ${Number(item.quantity || 1)}
            </span>


            <button
                type="button"
                data-cart-action="increase"
                data-cart-id="${escapeAttribute(item.id)}"
            >
                +
            </button>


            <button
                type="button"
                data-cart-action="remove"
                data-cart-id="${escapeAttribute(item.id)}"
                aria-label="Remove product"
            >
                ×
            </button>

        </div>

    `;


    element
        .querySelectorAll(
            "[data-cart-action]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const action =
                            button.dataset.cartAction;


                        const id =
                            button.dataset.cartId;


                        if (
                            action ===
                            "increase"
                        ) {

                            changeCartQuantity(
                                id,
                                1
                            );

                        }


                        if (
                            action ===
                            "decrease"
                        ) {

                            changeCartQuantity(
                                id,
                                -1
                            );

                        }


                        if (
                            action ===
                            "remove"
                        ) {

                            removeFromCart(
                                id
                            );

                        }

                    }
                );

            }
        );


    return element;

}


/* =========================================================
   CART TOTAL
   ========================================================= */

function updateCartTotal() {

    if (
        !StoreDOM.cartTotal
    ) {

        return;

    }


    const total =
        VolticaStoreState.cart.reduce(
            (
                sum,
                item
            ) => {

                return (
                    sum +
                    (
                        Number(
                            item.price || 0
                        ) *
                        Number(
                            item.quantity || 1
                        )
                    )
                );

            },
            0
        );


    StoreDOM.cartTotal.textContent =
        formatPrice(total);

}


/* =========================================================
   CHECKOUT
   ========================================================= */

function checkout() {

    const stripeLink =
        VOLTICA_STORE_CONFIG
            .stripeCheckout;


    if (!stripeLink) {

        return;

    }


    window.open(
        stripeLink,
        "_blank",
        "noopener,noreferrer"
    );

}


/* =========================================================
   PRODUCT IMAGE
   ========================================================= */

function getProductImage(
    product
) {

    if (
        !product ||
        !Array.isArray(
            product.images
        ) ||
        product.images.length === 0
    ) {

        return "";

    }


    const first =
        product.images[0];


    if (
        typeof first === "string"
    ) {

        return normalizeImagePath(
            first
        );

    }


    if (
        first &&
        typeof first === "object"
    ) {

        return normalizeImagePath(
            first.path ||
            first.name ||
            ""
        );

    }


    return "";

}


/* =========================================================
   IMAGE PATH
   ========================================================= */

function normalizeImagePath(
    path
) {

    if (!path) {

        return "";

    }


    const value =
        String(path).trim();


    if (
        value.startsWith("http://") ||
        value.startsWith("https://") ||
        value.startsWith("/")
    ) {

        return value;

    }


    if (
        value.startsWith("assets/")
    ) {

        return value;

    }


    return (
        VOLTICA_STORE_CONFIG
            .imageBasePath +
        value
    );

}


/* =========================================================
   STRIPE LINKS
   ========================================================= */

function normalizeStripeLinks() {

    document
        .querySelectorAll(
            'a[href*="buy.stripe.com"]'
        )
        .forEach(
            link => {

                link.target =
                    "_blank";

                link.rel =
                    "noopener noreferrer";

            }
        );

}


/* =========================================================
   FIND PRODUCT
   ========================================================= */

function findProduct(
    productId
) {

    return VolticaStoreState.products.find(
        product =>
            String(
                product.id
            ) === String(
                productId
            )
    ) || null;

}


/* =========================================================
   FORMAT PRICE
   ========================================================= */

function formatPrice(
    value
) {

    const price =
        Number(value);


    if (
        !Number.isFinite(price)
    ) {

        return "$0.00 USD";

    }


    return (
        "$" +
        price.toFixed(2) +
        " USD"
    );

}


/* =========================================================
   ESCAPE HTML
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
   ESCAPE ATTRIBUTE
   ========================================================= */

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

        return [
            ...VolticaStoreState.products
        ];

    },


    findProduct,


    addToCart,


    removeFromCart,


    changeCartQuantity,


    clearCart,


    getCart() {

        return [
            ...VolticaStoreState.cart
        ];

    },


    getCartCount() {

        return VolticaStoreState.cart.reduce(
            (
                total,
                item
            ) => {

                return (
                    total +
                    Number(
                        item.quantity || 1
                    )
                );

            },
            0
        );

    },


    openCart,


    closeCart,


    formatPrice,


    renderProducts

};
