/* =========================================================
   VOLTICA STORE — STORE.JS
   Product Render + Shopping Cart Engine
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

    const grid = document.getElementById("productGrid");

    const cartButton = document.getElementById("cartButton");
    const cartCount = document.getElementById("cartCount");

    const cartOverlay = document.getElementById("cartOverlay");
    const cartDrawer = document.getElementById("cartDrawer");

    const cartClose = document.getElementById("cartClose");

    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    const checkoutButton =
        document.getElementById("checkoutButton");


    /* =====================================================
       PRODUCT DATABASE CHECK
       ===================================================== */

    console.log(
        "VOLTICA: PRODUCTS =",
        typeof volticaProducts !== "undefined"
            ? volticaProducts
            : "UNDEFINED"
    );


    if (!grid) {

        console.error(
            "VOLTICA: productGrid introuvable."
        );

        return;
    }


    if (
        typeof volticaProducts === "undefined" ||
        !Array.isArray(volticaProducts)
    ) {

        console.error(
            "VOLTICA: products.js introuvable ou invalide."
        );

        return;
    }


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
                cart = parsed;
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
                "VOLTICA: cartDrawer introuvable."
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

        cartDrawer.classList.add("open");

        document.body.classList.add(
            "cart-is-open"
        );

        renderCart();

        console.log(
            "VOLTICA: CART OPEN"
        );

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

        console.log(
            "VOLTICA: CART CLOSED"
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

    } else {

        console.error(
            "VOLTICA: #cartButton introuvable."
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
            function () {

                closeCart();

            }
        );

    }


    /* =====================================================
       ESC KEY
       ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                closeCart();

            }

        }
    );


    /* =====================================================
       PRODUCT RENDER
       ===================================================== */

    function renderProducts() {

        grid.innerHTML = "";


        const activeProducts =
            volticaProducts.filter(
                product =>
                    product &&
                    product.active !== false
            );


        if (!activeProducts.length) {

            grid.innerHTML = `

                <div class="store-empty-state">

                    <div class="store-empty-pulsar"></div>

                    <span>
                        VOLTICA STORE
                    </span>

                    <h2>
                        COLLECTION EMPTY
                    </h2>

                    <p>
                        New products are coming soon.
                    </p>

                </div>

            `;

            return;
        }


        activeProducts.forEach(
            function (product) {

                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "store-product";


                const image =
                    product.images?.[0] || "";


                const price =
                    Number(
                        product.price || 0
                    );


                const referencePrice =
                    Number(
                        product.referencePrice || 0
                    );


                let colorsHTML = "";


                if (
                    Array.isArray(
                        product.colors
                    ) &&
                    product.colors.length
                ) {

                    colorsHTML = `

                        <div class="product-colors">

                            <span>
                                COLORS
                            </span>

                            <div class="color-list">

                                ${product.colors.map(
                                    color => `

                                    <span
                                        class="color-chip"
                                        title="${color}"
                                        aria-label="${color}"
                                    ></span>

                                `
                                ).join("")}

                            </div>

                        </div>

                    `;

                }


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


                card.innerHTML = `

                    <div class="product-image">

                        <img
                            src="${image}"
                            alt="${product.name || "Voltica Product"}"
                            loading="lazy"
                        >

                        <div
                            class="image-reflection"
                            aria-hidden="true"
                        ></div>

                    </div>


                    <div class="product-info">

                        <span class="product-category">
                            ${product.category || "VOLTICA COLLECTION"}
                        </span>


                        <h2 class="product-title">
                            ${product.name || "VOLTICA PRODUCT"}
                        </h2>


                        <p class="product-description">
                            ${product.shortDescription || ""}
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
                                href="product.html?id=${encodeURIComponent(product.id)}"
                                class="acrylic-button product-view-button"
                            >
                                VIEW PRODUCT
                            </a>


                            <button
                                type="button"
                                class="acrylic-button product-buy-button"
                                data-product-id="${product.id}"
                            >
                                ADD TO CART
                            </button>

                        </div>

                    </div>

                `;


                grid.appendChild(card);

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
            volticaProducts.find(
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

                id: product.id,

                name: product.name,

                price: Number(
                    product.price || 0
                ),

                image:
                    product.images?.[0] || "",

                quantity: 1

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

    grid.addEventListener(
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

                addToCart(productId);

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


        item.quantity += amount;


        if (item.quantity <= 0) {

            removeFromCart(productId);

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


        if (totalQuantity > 0) {

            cartCount.classList.add(
                "visible"
            );

        } else {

            cartCount.classList.remove(
                "visible"
            );

        }

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

                    <div class="cart-empty-pulsar"></div>

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
                    Number(
                        item.quantity || 1
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
                            src="${item.image || ""}"
                            alt="${item.name || "Product"}"
                        >

                    </div>


                    <div class="cart-item-info">

                        <strong>
                            ${item.name || "Voltica Product"}
                        </strong>

                        <span>
                            $${price.toFixed(2)}
                        </span>


                        <div class="cart-quantity">

                            <button
                                type="button"
                                data-action="decrease"
                                data-id="${item.id}"
                            >
                                −
                            </button>

                            <span>
                                ${quantity}
                            </span>

                            <button
                                type="button"
                                data-action="increase"
                                data-id="${item.id}"
                            >
                                +
                            </button>

                        </div>

                    </div>


                    <button
                        type="button"
                        class="cart-remove"
                        data-action="remove"
                        data-id="${item.id}"
                        aria-label="Remove ${item.name || "product"}"
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


                if (action === "increase") {

                    changeQuantity(
                        productId,
                        1
                    );

                }


                if (action === "decrease") {

                    changeQuantity(
                        productId,
                        -1
                    );

                }


                if (action === "remove") {

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
                 * can be connected here.
                 */

            }
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
