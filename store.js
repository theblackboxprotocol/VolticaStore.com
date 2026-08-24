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

let StoreDOM = {};


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


    cacheDOM();

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


    console.log(
        "VOLTICA STORE — ONLINE",
        VolticaStoreState.products
    );

}


/* =========================================================
   CACHE DOM
   ========================================================= */

function cacheDOM() {

    StoreDOM = {

        productGrid:
            document.getElementById(
                "productGrid"
            ),

        cartButton:
            document.getElementById(
                "cartButton"
            ),

        cartCount:
            document.getElementById(
                "cartCount"
            ),

        cartDrawer:
            document.getElementById(
                "cartDrawer"
            ),

        cartOverlay:
            document.getElementById(
                "cartOverlay"
            ),

        cartClose:
            document.getElementById(
                "cartClose"
            ),

        cartItems:
            document.getElementById(
                "cartItems"
            ),

        cartTotal:
            document.getElementById(
                "cartTotal"
            ),

        checkoutButton:
            document.getElementById(
                "checkoutButton"
            )

    };

}


/* =========================================================
   LOAD PRODUCTS
   ========================================================= */

function loadProducts() {

    /*
       products.js exposes:

       const volticaProducts = [...]

       IMPORTANT:

       products.js is loaded BEFORE store.js in
       store.html.

       The database uses a top-level const, so
       we access the lexical variable directly.
    */

    if (
        typeof volticaProducts === "undefined"
    ) {

        console.error(
            "VOLTICA ERROR: products.js was not loaded."
        );

        VolticaStoreState.products =
            [];

        return;

    }


    if (
        !Array.isArray(
            volticaProducts
        )
    ) {

        console.error(
            "VOLTICA ERROR: volticaProducts is not an array."
        );

        VolticaStoreState.products =
            [];

        return;

    }


    VolticaStoreState.products =
        volticaProducts.filter(
            product => {

                return (
                    product &&
                    product.active !== false
                );

            }
        );


    console.log(
        "VOLTICA PRODUCTS LOADED:",
        VolticaStoreState.products.length
    );


    VolticaStoreState.products.forEach(
        product => {

            console.log(
                "PRODUCT:",
                product.id,
                product.name
            );

        }
    );

}


/* =========================================================
   RENDER PRODUCTS
   ========================================================= */

function renderProducts() {

    const grid =
        StoreDOM.productGrid;


    if (!grid) {

        console.warn(
            "VOLTICA: #productGrid not found."
        );

        return;

    }


    grid.innerHTML = "";


    const products =
        VolticaStoreState.products;


    if (
        products.length === 0
    ) {

        grid.innerHTML = `

            <div class="store-empty-state">

                <div class="store-empty-pulsar"></div>

                <span>
                    VOLTICA
                </span>

                <h2>
                    COLLECTION EMPTY
                </h2>

                <p>
                    New products are arriving soon.
                </p>

            </div>

        `;

        return;

    }


    products.forEach(
        product => {

            const card =
                createProductCard(
                    product
                );


            if (card) {

                grid.appendChild(
                    card
                );

            }

        }
    );

}


/* =========================================================
   CREATE PRODUCT CARD
   ========================================================= */

function createProductCard(
    product
) {

    if (!product) {

        return null;

    }


    const article =
        document.createElement(
            "article"
        );


    article.className =
        "store-product";


    article.dataset.productId =
        String(
            product.id || ""
        );


    const category =
        product.category ||
        "VOLTICA COLLECTION";


    const badge =
        product.badge ||
        "";


    const description =
        product.shortDescription ||
        product.description ||
        "Premium technology engineered for everyday life.";


    const price =
        Number(
            product.price || 0
        );


    const referencePrice =
        Number(
            product.referencePrice || 0
        );


    const productImage =
        getProductImage(
            product
        );


    const productId =
        String(
            product.id || ""
        );


    const productUrl =
        "product.html?id=" +
        encodeURIComponent(
            productId
        );


    const stripeLink =
        product.stripeLink ||
        product.stripe ||
        product.stripeUrl ||
        VOLTICA_STORE_CONFIG.stripeCheckout;


    const isPreorder =
        product.preorder === true ||
        product.preOrder === true ||
        String(
            product.badge || ""
        ).toUpperCase()
        === "PRE-ORDER";


    article.innerHTML = `

        <!-- PRODUCT IMAGE -->

        <div class="product-image">

            ${
                badge
                    ? `
                        <span class="product-badge">
                            ${escapeHTML(badge)}
                        </span>
                    `
                    : ""
            }


            ${
                productImage
                    ? `
                        <img
                            src="${escapeAttribute(productImage)}"
                            alt="${escapeAttribute(
                                product.name ||
                                "Voltica Product"
                            )}"
                            loading="lazy"
                            decoding="async"
                        >

                        <div
                            class="image-reflection"
                            aria-hidden="true"
                        ></div>
                    `
                    : `
                        <div class="product-no-image">
                            VOLTICA
                        </div>
                    `
            }

        </div>


        <!-- PRODUCT INFORMATION -->

        <div class="product-info">


            <span class="product-category">

                ${escapeHTML(
                    category
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
                    description
                )}

            </p>


            <!-- PRICE -->

            <div class="product-price-row">

                <strong class="product-price">

                    ${formatPrice(
                        price
                    )}

                </strong>


                ${
                    referencePrice > price
                        ? `
                            <span class="product-reference-price">

                                ${formatPrice(
                                    referencePrice
                                )}

                            </span>
                        `
                        : ""
                }

            </div>


            <!-- COLORS -->

            ${
                Array.isArray(
                    product.colors
                ) &&
                product.colors.length > 0
                    ? `
                        <div class="product-colors">

                            <span>
                                COLORS
                            </span>

                            <div class="color-list">

                                ${product.colors
                                    .map(
                                        color =>
                                            createColorChip(
                                                color
                                            )
                                    )
                                    .join("")
                                }

                            </div>

                        </div>
                    `
                    : ""
            }


            <!-- ACTIONS -->

            <div class="product-actions">


                <a
                    href="${escapeAttribute(productUrl)}"
                    class="acrylic-button product-view-button"
                    data-action="view"
                    data-product-id="${escapeAttribute(productId)}"
                >

                    VIEW PRODUCT

                </a>


                <a
                    href="${escapeAttribute(stripeLink)}"
                    class="acrylic-button product-buy-button"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-action="buy"
                    data-product-id="${escapeAttribute(productId)}"
                >

                    ${
                        isPreorder
                            ? "PRE-ORDER"
                            : "BUY NOW"
                    }

                </a>


            </div>


        </div>

    `;


    return article;

}


/* =========================================================
   CREATE COLOR CHIP
   ========================================================= */

function createColorChip(
    color
) {

    const safeColor =
        String(
            color || ""
        );


    const normalized =
        safeColor
            .toLowerCase()
            .trim();


    let background;


    if (
        normalized.includes(
            "black"
        )
    ) {

        background =
            "linear-gradient(145deg,#444,#050505)";

    }
    else if (
        normalized.includes(
            "white"
        )
    ) {

        background =
            "linear-gradient(145deg,#ffffff,#999999)";

    }
    else if (
        normalized.includes(
            "beige"
        ) ||
        normalized.includes(
            "cream"
        )
    ) {

        background =
            "linear-gradient(145deg,#eee0c5,#9c8b70)";

    }
    else if (
        normalized.includes(
            "red"
        )
    ) {

        background =
            "linear-gradient(145deg,#ff5555,#6b0000)";

    }
    else if (
        normalized.includes(
            "blue"
        )
    ) {

        background =
            "linear-gradient(145deg,#4da6ff,#082d62)";

    }
    else {

        background =
            "linear-gradient(145deg,#eeeeee,#444444)";

    }


    return `

        <span
            class="color-chip"
            title="${escapeAttribute(safeColor)}"
            aria-label="${escapeAttribute(safeColor)}"
            style="background:${background};"
        ></span>

    `;

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
            JSON.parse(
                saved
            );


        VolticaStoreState.cart =
            Array.isArray(parsed)
                ? parsed.filter(
                    item =>
                        item &&
                        item.id
                )
                : [];

    }
    catch (error) {

        console.warn(
            "VOLTICA: Cart could not be loaded.",
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
            "VOLTICA: Cart could not be saved.",
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
        "open"
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
        "open"
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
                String(
                    item.id
                ) === id
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
                product.name ||
                "VOLTICA PRODUCT",

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

    openCart();

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
                String(
                    item.id
                ) !==
                String(
                    productId
                )
        );


    saveCart();

    updateCartUI();

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
                String(
                    cartItem.id
                ) ===
                String(
                    productId
                )
        );


    if (!item) {

        return;

    }


    item.quantity =
        Number(
            item.quantity || 1
        ) +
        Number(
            change || 0
        );


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

}


/* =========================================================
   CLEAR CART
   ========================================================= */

function clearCart() {

    VolticaStoreState.cart =
        [];


    saveCart();

    updateCartUI();

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
                    Math.max(
                        0,
                        Number(
                            item.quantity || 0
                        )
                    )
                );

            },
            0
        );


    StoreDOM.cartCount.textContent =
        count;


    StoreDOM.cartCount.classList.toggle(
        "visible",
        count > 0
    );


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

function createCartItem(
    item
) {

    const element =
        document.createElement(
            "div"
        );


    element.className =
        "cart-item";


    const image =
        item.image
            ?
