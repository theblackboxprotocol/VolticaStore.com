/* =========================================================
   VOLTICA STORE — STORE.JS
   Product Render + Shopping Cart Engine
   Single Collection System
   No Product Sections
   ========================================================= */

"use strict";


/* =========================================================
   STORE INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("VOLTICA: STORE START");


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const cartButton =
        document.getElementById("cartButton");

    const cartCount =
        document.getElementById("cartCount");

    const cartOverlay =
        document.getElementById("cartOverlay");

    const cartDrawer =
        document.getElementById("cartDrawer");

    const cartClose =
        document.getElementById("cartClose");

    const cartItems =
        document.getElementById("cartItems");

    const cartTotal =
        document.getElementById("cartTotal");

    const checkoutButton =
        document.getElementById("checkoutButton");


    const productGrid =
        document.getElementById("productGrid");


    /* =====================================================
       PRODUCT DATABASE CHECK
       ===================================================== */

    if (
        typeof window.volticaProducts === "undefined" ||
        !Array.isArray(window.volticaProducts)
    ) {

        console.error(
            "VOLTICA: products.js introuvable ou invalide."
        );

        if (productGrid) {

            productGrid.innerHTML = `

                <div class="store-empty">

                    <strong>
                        COLLECTION UNAVAILABLE
                    </strong>

                    <span>
                        Product database could not be loaded.
                    </span>

                </div>

            `;

        }

        return;
    }


    const products =
        window.volticaProducts;


    console.log(
        "VOLTICA: PRODUCTS =",
        products.length
    );


    /* =====================================================
       CART STORAGE
       ===================================================== */

    let cart = [];


    try {

        const savedCart =
            localStorage.getItem("volticaCart");


        if (savedCart) {

            const parsed =
                JSON.parse(savedCart);


            if (Array.isArray(parsed)) {

                cart =
                    parsed
                        .filter(
                            item =>
                                item &&
                                item.id
                        )
                        .map(
                            item => ({

                                id:
                                    String(item.id),

                                name:
                                    String(
                                        item.name || ""
                                    ),

                                price:
                                    Number(
                                        item.price || 0
                                    ),

                                image:
                                    String(
                                        item.image || ""
                                    ),

                                quantity:
                                    Math.max(
                                        1,
                                        Number(
                                            item.quantity || 1
                                        )
                                    )

                            })
                        );

            }

        }

    } catch (error) {

        console.warn(
            "VOLTICA: Impossible de charger le panier.",
            error
        );

        cart = [];

    }


    /* =====================================================
       SAVE CART
       ===================================================== */

    function saveCart() {

        try {

            localStorage.setItem(
                "volticaCart",
                JSON.stringify(cart)
            );

        } catch (error) {

            console.warn(
                "VOLTICA: Impossible de sauvegarder le panier.",
                error
            );

        }

    }


    /* =====================================================
       OPEN CART
       ===================================================== */

    function openCart() {

        if (!cartDrawer) {

            console.error(
                "VOLTICA: #cartDrawer introuvable."
            );

            return;
        }


        if (cartOverlay) {

            cartOverlay.hidden = false;

            cartOverlay.setAttribute(
                "aria-hidden",
                "false"
            );

        }


        cartDrawer.classList.add(
            "open"
        );


        document.body.classList.add(
            "cart-is-open"
        );


        renderCart();

    }


    /* =====================================================
       CLOSE CART
       ===================================================== */

    function closeCart() {

        if (cartDrawer) {

            cartDrawer.classList.remove(
                "open"
            );

        }


        if (cartOverlay) {

            cartOverlay.hidden = true;

            cartOverlay.setAttribute(
                "aria-hidden",
                "true"
            );

        }


        document.body.classList.remove(
            "cart-is-open"
        );

    }


    /* =====================================================
       CART BUTTON
       ===================================================== */

    if (cartButton) {

        cartButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                openCart();

            }
        );

    }


    /* =====================================================
       CLOSE BUTTON
       ===================================================== */

    if (cartClose) {

        cartClose.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                closeCart();

            }
        );

    }


    /* =====================================================
       OVERLAY CLOSE
       ===================================================== */

    if (cartOverlay) {

        cartOverlay.addEventListener(
            "click",
            closeCart
        );

    }


    /* =====================================================
       ESC KEY
       ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                cartDrawer &&
                cartDrawer.classList.contains("open")
            ) {

                closeCart();

            }

        }
    );


    /* =====================================================
       CREATE PRODUCT CARD
       ===================================================== */

    function createProductCard(product) {

        const card =
            document.createElement(
                "article"
            );


        card.className =
            "store-product";


        const image =
            Array.isArray(product.images) &&
            product.images.length
                ? product.images[0]
                : "";


        const price =
            Number(
                product.price || 0
            );


        const referencePrice =
            Number(
                product.referencePrice || 0
            );


        /* =================================================
           COLORS
           ================================================= */

        let colorsHTML = "";


        if (
            Array.isArray(product.colors) &&
            product.colors.length
        ) {

            colorsHTML = `

                <div class="product-colors">

                    <span>
                        COLORS
                    </span>

                    <div class="color-list">

                        ${product.colors
                            .map(
                                color => `

                                    <span
                                        class="color-chip"
                                        title="${escapeHTML(color)}"
                                        aria-label="${escapeHTML(color)}"
                                    ></span>

                                `
                            )
                            .join("")}

                    </div>

                </div>

            `;

        }


        /* =================================================
           REFERENCE PRICE
           ================================================= */

        let referenceHTML = "";


        if (
            referencePrice > price
        ) {

            referenceHTML = `

                <span class="product-reference-price">
                    $${referencePrice.toFixed(2)}
                </span>

            `;

        }


        /* =================================================
           PRODUCT CARD
           ================================================= */

        card.innerHTML = `

            <div class="product-image">

                <img
                    src="${escapeHTML(image)}"
                    alt="${escapeHTML(
                        product.name ||
                        "Voltica Product"
                    )}"
                    loading="lazy"
                >

                <div
                    class="image-reflection"
                    aria-hidden="true"
                ></div>

            </div>


            <div class="product-info">

                <span class="product-category">
                    ${escapeHTML(
                        product.category ||
                        "VOLTICA COLLECTION"
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
                        ""
                    )}
                </p>


                <div class="product-price-row">

                    <strong class="product-price">
                        $${price.toFixed(2)}
                    </strong>

                    ${referenceHTML}

                </div>


                ${colorsHTML}


                <div class="product-actions">

                    <a
                        href="product-view.html?id=${encodeURIComponent(
                            product.id
                        )}"
                        class="acrylic-button product-view-button"
                    >
                        VIEW PRODUCT
                    </a>


                    <button
                        type="button"
                        class="acrylic-button product-buy-button"
                        data-product-id="${escapeHTML(
                            product.id
                        )}"
                    >
                        ADD TO CART
                    </button>

                </div>

            </div>

        `;


        return card;

    }


    /* =====================================================
       RENDER PRODUCTS
       ===================================================== */

    function renderProducts() {

        if (!productGrid) {

            console.error(
                "VOLTICA: #productGrid introuvable."
            );

            return;

        }


        productGrid.innerHTML = "";


        const activeProducts =
            products.filter(
                product =>
                    product &&
                    product.active !== false
            );


        console.log(
            "VOLTICA: ACTIVE PRODUCTS =",
            activeProducts.length
        );


        if (!activeProducts.length) {

            productGrid.innerHTML = `

                <div class="store-empty">

                    <div
                        class="cart-empty-pulsar"
                        aria-hidden="true"
                    ></div>

                    <strong>
                        COLLECTION COMING SOON
                    </strong>

                    <span>
                        New products are being prepared.
                    </span>

                </div>

            `;


            console.warn(
                "VOLTICA: NO ACTIVE PRODUCTS"
            );

            return;

        }


        /* =================================================
           RENDER EVERY PRODUCT INTO ONE GRID
           ================================================= */

        activeProducts.forEach(
            function (product) {

                productGrid.appendChild(
                    createProductCard(
                        product
                    )
                );

            }
        );


        console.log(
            "VOLTICA: PRODUCTS RENDERED =",
            activeProducts.length
        );

    }


    /* =====================================================
       ADD TO CART
       ===================================================== */

    function addToCart(productId) {

        const product =
            products.find(
                item =>
                    item &&
                    String(item.id) ===
                    String(productId)
            );


        if (!product) {

            console.error(
                "VOLTICA: Produit introuvable :",
                productId
            );

            return;

        }


        const existing =
            cart.find(
                item =>
                    String(item.id) ===
                    String(product.id)
            );


        if (existing) {

            existing.quantity += 1;

        } else {

            cart.push({

                id:
                    String(product.id),

                name:
                    product.name ||
                    "Voltica Product",

                price:
                    Number(
                        product.price || 0
                    ),

                image:
                    Array.isArray(product.images) &&
                    product.images.length
                        ? product.images[0]
                        : "",

                quantity:
                    1

            });

        }


        saveCart();

        updateCartCount();

        renderCart();


        console.log(
            "VOLTICA: ADDED TO CART",
            product.name
        );

    }


    /* =====================================================
       PRODUCT BUTTON DELEGATION
       ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    ".product-buy-button"
                );


            if (!button) {
                return;
            }


            event.preventDefault();


            const productId =
                button.dataset.productId;


            if (productId) {

                addToCart(
                    productId
                );

            }

        }
    );


    /* =====================================================
       REMOVE ITEM
       ===================================================== */

    function removeFromCart(productId) {

        cart =
            cart.filter(
                item =>
                    String(item.id) !==
                    String(productId)
            );


        saveCart();

        updateCartCount();

        renderCart();

    }


    /* =====================================================
       CHANGE QUANTITY
       ===================================================== */

    function changeQuantity(
        productId,
        amount
    ) {

        const item =
            cart.find(
                product =>
                    String(product.id) ===
                    String(productId)
            );


        if (!item) {
            return;
        }


        item.quantity =
            Number(item.quantity || 1) +
            Number(amount || 0);


        if (item.quantity <= 0) {

            removeFromCart(
                productId
            );

            return;

        }


        saveCart();

        updateCartCount();

        renderCart();

    }


    /* =====================================================
       CART COUNT
       ===================================================== */

    function updateCartCount() {

        if (!cartCount) {
            return;
        }


        const totalQuantity =
            cart.reduce(
                function (total, item) {

                    return total +
                        Number(
                            item.quantity || 0
                        );

                },
                0
            );


        cartCount.textContent =
            totalQuantity;


        cartCount.classList.toggle(
            "visible",
            totalQuantity > 0
        );

    }


    /* =====================================================
       CART RENDER
       ===================================================== */

    function renderCart() {

        if (!cartItems) {
            return;
        }


        if (!cart.length) {

            cartItems.innerHTML = `

                <div class="cart-empty">

                    <div
                        class="cart-empty-pulsar"
                        aria-hidden="true"
                    ></div>

                    <strong>
                        YOUR CART IS EMPTY
                    </strong>

                    <span>
                        Add something from the collection.
                    </span>

                </div>

            `;


            if (cartTotal) {

                cartTotal.textContent =
                    "$0.00";

            }


            return;

        }


        cartItems.innerHTML = "";


        let total = 0;


        cart.forEach(
            function (item) {

                const quantity =
                    Math.max(
                        1,
                        Number(
                            item.quantity || 1
                        )
                    );


                const price =
                    Number(
                        item.price || 0
                    );


                total +=
                    price * quantity;


                const element =
                    document.createElement(
                        "div"
                    );


                element.className =
                    "cart-item";


                element.innerHTML = `

                    <div class="cart-item-image">

                        <img
                            src="${escapeHTML(
                                item.image || ""
                            )}"
                            alt="${escapeHTML(
                                item.name ||
                                "Product"
                            )}"
                        >

                    </div>


                    <div class="cart-item-info">

                        <strong>
                            ${escapeHTML(
                                item.name ||
                                "Voltica Product"
                            )}
                        </strong>

                        <span>
                            $${price.toFixed(2)}
                        </span>


                        <div class="cart-quantity">

                            <button
                                type="button"
                                data-action="decrease"
                                data-id="${escapeHTML(
                                    item.id
                                )}"
                                aria-label="Decrease quantity"
                            >
                                −
                            </button>


                            <span>
                                ${quantity}
                            </span>


                            <button
                                type="button"
                                data-action="increase"
                                data-id="${escapeHTML(
                                    item.id
                                )}"
                                aria-label="Increase quantity"
                            >
                                +
                            </button>

                        </div>

                    </div>


                    <button
                        type="button"
                        class="cart-remove"
                        data-action="remove"
                        data-id="${escapeHTML(
                            item.id
                        )}"
                        aria-label="Remove ${escapeHTML(
                            item.name ||
                            "product"
                        )}"
                    >
                        ×
                    </button>

                `;


                cartItems.appendChild(
                    element
                );

            }
        );


        if (cartTotal) {

            cartTotal.textContent =
                "$" + total.toFixed(2);

        }

    }


    /* =====================================================
       CART ITEM ACTIONS
       ===================================================== */

    if (cartItems) {

        cartItems.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "button[data-action]"
                    );


                if (!button) {
                    return;
                }


                const action =
                    button.dataset.action;


                const productId =
                    button.dataset.id;


                if (!productId) {
                    return;
                }


                if (
                    action === "increase"
                ) {

                    changeQuantity(
                        productId,
                        1
                    );

                }


                if (
                    action === "decrease"
                ) {

                    changeQuantity(
                        productId,
                        -1
                    );

                }


                if (
                    action === "remove"
                ) {

                    removeFromCart(
                        productId
                    );

                }

            }
        );

    }


    /* =====================================================
       CHECKOUT
       ===================================================== */

    if (checkoutButton) {

        checkoutButton.addEventListener(
            "click",
            function () {

                if (!cart.length) {

                    console.log(
                        "VOLTICA: CART EMPTY"
                    );

                    return;

                }


                console.log(
                    "VOLTICA: CHECKOUT",
                    cart
                );


                /*
                 * Stripe checkout logic
                 * will be connected here.
                 */

            }
        );

    }


    /* =====================================================
       HTML ESCAPE
       ===================================================== */

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


    /* =====================================================
       INITIAL STATE
       ===================================================== */

    renderProducts();

    updateCartCount();

    renderCart();

    closeCart();


    console.log(
        "VOLTICA: STORE READY"
    );

});
