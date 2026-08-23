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

    removeLargeProductImages: true,

    stripeCheckout:
        "https://buy.stripe.com/eVqeVe2hNgILbyoaWK2Ji0j"

};


/* =========================================================
   DOM
   ========================================================= */

const StoreDOM = {

    cartButton:
        document.getElementById("cartButton"),

    cartCount:
        document.getElementById("cartCount"),

    productModal:
        document.getElementById("productModal"),

    productModalOverlay:
        document.getElementById("productModalOverlay"),

    productModalClose:
        document.getElementById("productModalClose"),

    openProductButton:
        document.getElementById("openProductButton"),

    modalMainImage:
        document.getElementById("modalMainImage"),

    modalThumbnails:
        document.querySelectorAll(".modal-thumb")

};


/* =========================================================
   STATE
   ========================================================= */

const VolticaStore = {

    cart: [],

    currentProduct: null,

    initialized: false

};


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeStore
);


function initializeStore() {

    if (VolticaStore.initialized) {

        return;

    }


    VolticaStore.initialized = true;


    removeLargeProductImages();

    initializeProductModal();

    initializeCart();

    normalizeStripeLinks();

    initializeImageFallbacks();

}


/* =========================================================
   REMOVE LARGE PRODUCT PHOTOS
   ========================================================= */

/*
 * IMPORTANT
 *
 * The large product card image is removed from the
 * public Store layout.
 *
 * The modal gallery is NOT removed.
 *
 * Therefore:
 *
 * STORE PAGE
 *     → clean product information
 *
 * VIEW PRODUCT
 *     → full gallery remains available
 */

function removeLargeProductImages() {

    if (
        !VOLTICA_STORE_CONFIG
            .removeLargeProductImages
    ) {

        return;

    }


    const productImages =
        document.querySelectorAll(
            ".store-product > .product-image"
        );


    productImages.forEach(
        imageContainer => {

            imageContainer.remove();

        }
    );


    /*
     * Safety fallback for layouts where
     * .product-image is nested differently.
     */

    document
        .querySelectorAll(
            ".products-section .product-image"
        )
        .forEach(
            element => {

                if (
                    !element.closest(
                        ".product-modal"
                    )
                ) {

                    element.remove();

                }

            }
        );


    document.body.classList.add(
        "voltica-images-clean"
    );

}


/* =========================================================
   PRODUCT MODAL
   ========================================================= */

function initializeProductModal() {

    const modal =
        StoreDOM.productModal;


    if (!modal) {

        return;

    }


    StoreDOM.openProductButton
        ?.addEventListener(
            "click",
            openProductModal
        );


    StoreDOM.productModalClose
        ?.addEventListener(
            "click",
            closeProductModal
        );


    StoreDOM.productModalOverlay
        ?.addEventListener(
            "click",
            closeProductModal
        );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                modal.classList.contains(
                    "active"
                )
            ) {

                closeProductModal();

            }

        }
    );


    initializeModalGallery();

}


/* =========================================================
   OPEN MODAL
   ========================================================= */

function openProductModal() {

    const modal =
        StoreDOM.productModal;


    if (!modal) {

        return;

    }


    modal.classList.add(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "modal-open"
    );


    document.body.style.overflow =
        "hidden";


    /*
     * Make sure the first image is
     * selected when opening.
     */

    const firstThumbnail =
        document.querySelector(
            ".modal-thumb"
        );


    if (
        firstThumbnail &&
        StoreDOM.modalMainImage
    ) {

        const image =
            firstThumbnail.dataset.image;


        if (image) {

            StoreDOM.modalMainImage.src =
                image;

        }


        document
            .querySelectorAll(
                ".modal-thumb"
            )
            .forEach(
                thumbnail => {

                    thumbnail.classList.remove(
                        "active"
                    );

                }
            );


        firstThumbnail.classList.add(
            "active"
        );

    }

}


/* =========================================================
   CLOSE MODAL
   ========================================================= */

function closeProductModal() {

    const modal =
        StoreDOM.productModal;


    if (!modal) {

        return;

    }


    modal.classList.remove(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "modal-open"
    );


    document.body.style.overflow =
        "";

}


/* =========================================================
   MODAL GALLERY
   ========================================================= */

function initializeModalGallery() {

    if (
        !StoreDOM.modalThumbnails ||
        StoreDOM.modalThumbnails.length === 0
    ) {

        return;

    }


    StoreDOM.modalThumbnails.forEach(
        thumbnail => {

            thumbnail.addEventListener(
                "click",
                () => {

                    const image =
                        thumbnail.dataset.image;


                    if (
                        !image ||
                        !StoreDOM.modalMainImage
                    ) {

                        return;

                    }


                    StoreDOM.modalMainImage.src =
                        image;


                    StoreDOM.modalThumbnails
                        .forEach(
                            item => {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                    thumbnail.classList.add(
                        "active"
                    );

                }
            );

        }
    );

}


/* =========================================================
   CART
   ========================================================= */

function initializeCart() {

    loadCart();

    updateCartCount();


    StoreDOM.cartButton
        ?.addEventListener(
            "click",
            handleCartClick
        );

}


/* =========================================================
   LOAD CART
   ========================================================= */

function loadCart() {

    try {

        const saved =
            localStorage.getItem(
                "voltica_cart"
            );


        if (!saved) {

            VolticaStore.cart = [];

            return;

        }


        const parsed =
            JSON.parse(saved);


        VolticaStore.cart =
            Array.isArray(parsed)
                ? parsed
                : [];

    }
    catch (error) {

        console.warn(
            "Voltica cart could not be loaded.",
            error
        );


        VolticaStore.cart = [];

    }

}


/* =========================================================
   SAVE CART
   ========================================================= */

function saveCart() {

    try {

        localStorage.setItem(
            "voltica_cart",
            JSON.stringify(
                VolticaStore.cart
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
   CART COUNT
   ========================================================= */

function updateCartCount() {

    if (!StoreDOM.cartCount) {

        return;

    }


    const quantity =
        VolticaStore.cart.reduce(
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
        quantity;


    StoreDOM.cartCount.classList.toggle(
        "has-items",
        quantity > 0
    );

}


/* =========================================================
   CART BUTTON
   ========================================================= */

function handleCartClick() {

    /*
     * No separate cart page is required yet.
     *
     * Stripe remains the checkout system
     * for the current Q45 pre-order.
     */

    const stripeLink =
        VOLTICA_STORE_CONFIG
            .stripeCheckout;


    if (stripeLink) {

        window.open(
            stripeLink,
            "_blank",
            "noopener,noreferrer"
        );

    }

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


    const productId =
        product.id ||
        product.sku ||
        product.name;


    const existing =
        VolticaStore.cart.find(
            item =>
                item.id === productId
        );


    if (existing) {

        existing.quantity =
            Number(
                existing.quantity || 1
            ) +
            Number(quantity || 1);

    }
    else {

        VolticaStore.cart.push({

            id:
                productId,

            name:
                product.name || "",

            price:
                Number(
                    product.price || 0
                ),

            quantity:
                Number(
                    quantity || 1
                ),

            image:
                getProductImage(
                    product
                )

        });

    }


    saveCart();

    updateCartCount();

}


/* =========================================================
   REMOVE FROM CART
   ========================================================= */

function removeFromCart(
    productId
) {

    VolticaStore.cart =
        VolticaStore.cart.filter(
            item =>
                item.id !== productId
        );


    saveCart();

    updateCartCount();

}


/* =========================================================
   CLEAR CART
   ========================================================= */

function clearCart() {

    VolticaStore.cart = [];

    saveCart();

    updateCartCount();

}


/* =========================================================
   PRODUCT IMAGE HELPER
   ========================================================= */

function getProductImage(
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
        ) &&
        product.images.length
    ) {

        const first =
            product.images[0];


        if (
            typeof first ===
            "string"
        ) {

            return normalizeImagePath(
                first
            );

        }


        if (
            first &&
            typeof first ===
            "object"
        ) {

            return normalizeImagePath(
                first.path ||
                first.name ||
                ""
            );

        }

    }


    return "";

}


/* =========================================================
   IMAGE PATH NORMALIZATION
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
        value.startsWith(
            "http://"
        ) ||
        value.startsWith(
            "https://"
        ) ||
        value.startsWith(
            "/"
        )
    ) {

        return value;

    }


    if (
        value.startsWith(
            "assets/"
        )
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

    const links =
        document.querySelectorAll(
            'a[href*="buy.stripe.com"]'
        );


    links.forEach(
        link => {

            link.href =
                VOLTICA_STORE_CONFIG
                    .stripeCheckout;


            link.target =
                "_blank";


            link.rel =
                "noopener noreferrer";

        }
    );

}


/* =========================================================
   IMAGE FALLBACKS
   ========================================================= */

function initializeImageFallbacks() {

    const images =
        document.querySelectorAll(
            "img"
        );


    images.forEach(
        image => {

            image.addEventListener(
                "error",
                () => {

                    image.classList.add(
                        "image-load-error"
                    );

                },
                {
                    once: true
                }
            );

        }
    );

}


/* =========================================================
   PRODUCT DATA ACCESS
   ========================================================= */

function getProducts() {

    if (
        Array.isArray(
            window.volticaProducts
        )
    ) {

        return window.volticaProducts;

    }


    return [];

}


/* =========================================================
   FIND PRODUCT
   ========================================================= */

function findProduct(
    productId
) {

    const products =
        getProducts();


    return products.find(
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
   PRODUCT PUBLIC API
   ========================================================= */

window.VolticaStore = {

    getProducts,

    findProduct,

    addToCart,

    removeFromCart,

    clearCart,

    getCart() {

        return [
            ...VolticaStore.cart
        ];

    },

    getCartCount() {

        return VolticaStore.cart.reduce(
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

    openProductModal,

    closeProductModal,

    formatPrice

};


/* =========================================================
   READY
   ========================================================= */

window.dispatchEvent(
    new CustomEvent(
        "volticaStoreReady"
    )
);
