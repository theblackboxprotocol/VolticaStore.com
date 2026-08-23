/* =========================================================
   VOLTICA STORE — STORE.JS
   Product rendering engine
   ========================================================= */


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeStore();

});


/* =========================================================
   STORE INITIALIZATION
   ========================================================= */

function initializeStore() {

    renderProducts();

    updateProductCounter();

    setupStoreNavigation();

}


/* =========================================================
   GET PRODUCT DATABASE
   ========================================================= */

function getProducts() {

    /*
     * products.js must expose:
     *
     * window.volticaProducts
     *
     */

    if (
        !Array.isArray(window.volticaProducts)
    ) {

        console.warn(
            "Voltica Store: products.js was not loaded or volitcaProducts is missing."
        );

        return [];

    }

    return window.volticaProducts;

}


/* =========================================================
   RENDER PRODUCTS
   ========================================================= */

function renderProducts() {

    const productGrid =
        document.getElementById("productGrid");


    if (!productGrid) {

        console.warn(
            "Voltica Store: #productGrid not found."
        );

        return;

    }


    const products =
        getProducts();


    productGrid.innerHTML = "";


    /*
     * No products yet
     */

    if (products.length === 0) {

        renderEmptyStore(productGrid);

        return;

    }


    /*
     * Render every product
     */

    products.forEach((product, index) => {

        const card =
            createProductCard(
                product,
                index
            );

        productGrid.appendChild(card);

    });

}


/* =========================================================
   CREATE PRODUCT CARD
   ========================================================= */

function createProductCard(product, index) {

    const article =
        document.createElement("article");


    article.className =
        "product-card";


    /*
     * Product ID
     */

    if (product.id) {

        article.dataset.productId =
            product.id;

    }


    /*
     * Safe values
     */

    const productName =
        product.name ||
        "Voltica Product";


    const category =
        product.category ||
        "TECHNOLOGY";


    const description =
        product.shortDescription ||
        product.description ||
        "Discover this Voltica product.";


    const price =
        product.price !== undefined &&
        product.price !== null
            ? formatPrice(product.price)
            : "—";


    /*
     * Main image
     */

    const image =
        getMainProductImage(product);


    /*
     * Product number
     */

    const productNumber =
        formatProductNumber(
            product.productNumber ||
            index + 1
        );


    /*
     * Badge
     */

    const badge =
        product.badge ||
        "VOLTiCA";


    article.innerHTML = `

        <div class="product-image">

            ${
                image
                ?
                `
                <img
                    src="${escapeHTML(image)}"
                    alt="${escapeHTML(productName)}"
                    loading="lazy"
                    onerror="this.style.display='none';"
                >
                `
                :
                `
                <div class="product-image-placeholder">
                    <span class="pulse-dot"></span>
                </div>
                `
            }


            <div class="product-status">

                <span class="pulse-dot"></span>

                ${escapeHTML(badge)}

            </div>


            <span class="product-number">

                ${productNumber}

            </span>

        </div>


        <div class="product-content">


            <span class="product-category">

                ${escapeHTML(category)}

            </span>


            <h3>

                ${escapeHTML(productName)}

            </h3>


            <p class="product-description">

                ${escapeHTML(description)}

            </p>


            <div class="product-bottom">


                <div class="product-price">

                    ${price}

                    <small>USD</small>

                </div>


                <a
                    class="view-button"
                    href="product-view.html?id=${encodeURIComponent(product.id || "")}"
                    aria-label="View ${escapeHTML(productName)}"
                >

                    VIEW PRODUCT

                    <strong>→</strong>

                </a>


            </div>


        </div>

    `;


    return article;

}


/* =========================================================
   MAIN PRODUCT IMAGE
   ========================================================= */

function getMainProductImage(product) {

    /*
     * Preferred format:
     *
     * images: [
     *   "assets/images/product1-1.jpg",
     *   ...
     * ]
     */

    if (
        Array.isArray(product.images) &&
        product.images.length > 0
    ) {

        return product.images[0];

    }


    /*
     * Alternative:
     *
     * image
     */

    if (product.image) {

        return product.image;

    }


    /*
     * Alternative:
     *
     * thumbnail
     */

    if (product.thumbnail) {

        return product.thumbnail;

    }


    return "";

}


/* =========================================================
   EMPTY STORE
   ========================================================= */

function renderEmptyStore(container) {

    const empty =
        document.createElement("div");


    empty.className =
        "empty-store";


    empty.innerHTML = `

        <span class="pulse-dot"></span>

        <h3>

            VOLTICA COLLECTION LOADING

        </h3>

        <p>

            New technology is being prepared
            for the September 1st launch.

        </p>

    `;


    container.appendChild(empty);

}


/* =========================================================
   PRODUCT COUNTER
   ========================================================= */

function updateProductCounter() {

    const counter =
        document.getElementById(
            "productCounter"
        );


    if (!counter) {

        return;

    }


    const products =
        getProducts();


    counter.textContent =
        `${products.length
            .toString()
            .padStart(2, "0")
        } PRODUCTS`;

}


/* =========================================================
   PRICE FORMATTER
   ========================================================= */

function formatPrice(price) {

    const numericPrice =
        Number(price);


    if (Number.isNaN(numericPrice)) {

        return escapeHTML(
            String(price)
        );

    }


    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    ).format(numericPrice);

}


/* =========================================================
   PRODUCT NUMBER
   ========================================================= */

function formatProductNumber(number) {

    const numericNumber =
        Number(number);


    if (
        Number.isNaN(numericNumber)
    ) {

        return escapeHTML(
            String(number)
        );

    }


    return `PRODUCT ${numericNumber
        .toString()
        .padStart(2, "0")}`;

}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function setupStoreNavigation() {

    const links =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    links.forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const targetId =
                    link.getAttribute("href");


                if (
                    !targetId ||
                    targetId === "#"
                ) {

                    return;

                }


                const target =
                    document.querySelector(
                        targetId
                    );


                if (!target) {

                    return;

                }


                event.preventDefault();


                target.scrollIntoView({

                    behavior: "smooth",

                    block: "start"

                });

            }
        );

    });

}


/* =========================================================
   REFRESH STORE
   ========================================================= */

/*
 * Useful later for adminproductmanager.html.
 *
 * Example:
 *
 * window.VolticaStore.refresh();
 *
 */

function refreshStore() {

    renderProducts();

    updateProductCounter();

}


/* =========================================================
   PUBLIC STORE API
   ========================================================= */

window.VolticaStore = {

    refresh: refreshStore,


    getProducts: function () {

        return getProducts();

    },


    openProduct: function (productId) {

        if (!productId) {

            return;

        }


        window.location.href =
            `product-view.html?id=${encodeURIComponent(productId)}`;

    }

};
