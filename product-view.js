/* =========================================================
   VOLTICA STORE — PRODUCT VIEW.JS
   Product detail engine
   ========================================================= */


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeProductView();

});


/* =========================================================
   INITIALIZATION
   ========================================================= */

function initializeProductView() {

    const product =
        getProductFromURL();


    if (!product) {

        showProductError();

        return;

    }


    renderProduct(product);

    initializeGallery();

    initializeLightbox();

    initializeVariants(product);

}


/* =========================================================
   GET PRODUCT ID
   ========================================================= */

function getProductIdFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    return params.get("id");

}


/* =========================================================
   FIND PRODUCT
   ========================================================= */

function getProductFromURL() {

    const productId =
        getProductIdFromURL();


    if (!productId) {

        return null;

    }


    if (
        !Array.isArray(
            window.volticaProducts
        )
    ) {

        console.error(
            "Voltica Store: products.js was not loaded."
        );

        return null;

    }


    return window.volticaProducts.find(
        product =>
            String(product.id) ===
            String(productId)
    ) || null;

}


/* =========================================================
   RENDER PRODUCT
   ========================================================= */

function renderProduct(product) {

    setText(
        "productCategory",
        product.category || "TECHNOLOGY"
    );


    setText(
        "productTitle",
        product.name || "Voltica Product"
    );


    setText(
        "productShortDescription",
        product.shortDescription ||
        product.description ||
        ""
    );


    setText(
        "productPrice",
        formatPrice(product.price)
    );


    /*
     * Product number
     */

    setText(
        "productNumber",
        formatProductNumber(
            product.productNumber ||
            getProductIndex(product) + 1
        )
    );


    /*
     * Badge
     */

    setText(
        "productBadgeText",
        product.badge || "VOLTiCA"
    );


    /*
     * Main image
     */

    renderMainImage(product);


    /*
     * Thumbnails
     */

    renderThumbnails(product);


    /*
     * Description
     */

    renderDescription(product);


    /*
     * Features
     */

    renderFeatures(product);


    /*
     * Specifications
     */

    renderSpecifications(product);


    /*
     * Why Voltica
     */

    renderWhyVoltica(product);


    /*
     * Stripe button
     */

    setupStripeButton(product);


    /*
     * Reference price
     */

    renderReferencePrice(product);


    /*
     * Page title
     */

    document.title =
        `${product.name || "Product"} — Voltica Store`;

}


/* =========================================================
   PRODUCT INDEX
   ========================================================= */

function getProductIndex(product) {

    if (
        !Array.isArray(
            window.volticaProducts
        )
    ) {

        return 0;

    }


    return window.volticaProducts.indexOf(
        product
    );

}


/* =========================================================
   MAIN IMAGE
   ========================================================= */

function renderMainImage(product) {

    const image =
        getMainImage(product);


    const mainImage =
        document.getElementById(
            "mainProductImage"
        );


    if (!mainImage) {

        return;

    }


    if (!image) {

        mainImage.removeAttribute(
            "src"
        );

        mainImage.alt =
            product.name || "Voltica Product";

        return;

    }


    mainImage.src =
        image;


    mainImage.alt =
        product.name || "Voltica Product";

}


/* =========================================================
   THUMBNAILS
   ========================================================= */

function renderThumbnails(product) {

    const container =
        document.getElementById(
            "productThumbnails"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    const images =
        getProductImages(product);


    if (images.length === 0) {

        return;

    }


    images.forEach(
        (image, index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "product-thumbnail";


            if (index === 0) {

                button.classList.add(
                    "active"
                );

            }


            button.dataset.image =
                image;


            button.innerHTML = `

                <img
                    src="${escapeHTML(image)}"
                    alt="${escapeHTML(product.name || "Product")} ${index + 1}"
                    loading="lazy"
                >

            `;


            button.addEventListener(
                "click",
                () => {

                    changeMainImage(
                        image,
                        button
                    );

                }
            );


            container.appendChild(
                button
            );

        }
    );

}


/* =========================================================
   CHANGE MAIN IMAGE
   ========================================================= */

function changeMainImage(
    image,
    thumbnail
) {

    const mainImage =
        document.getElementById(
            "mainProductImage"
        );


    if (!mainImage) {

        return;

    }


    mainImage.src =
        image;


    document
        .querySelectorAll(
            ".product-thumbnail"
        )
        .forEach(
            button => {

                button.classList.remove(
                    "active"
                );

            }
        );


    if (thumbnail) {

        thumbnail.classList.add(
            "active"
        );

    }

}


/* =========================================================
   GALLERY INITIALIZATION
   ========================================================= */

function initializeGallery() {

    const mainImage =
        document.getElementById(
            "mainProductImage"
        );


    const zoomButton =
        document.querySelector(
            ".image-zoom-button"
        );


    if (mainImage) {

        mainImage.addEventListener(
            "click",
            () => {

                openLightbox(
                    mainImage.src
                );

            }
        );

    }


    if (zoomButton) {

        zoomButton.addEventListener(
            "click",
            () => {

                if (mainImage) {

                    openLightbox(
                        mainImage.src
                    );

                }

            }
        );

    }

}


/* =========================================================
   LIGHTBOX
   ========================================================= */

function initializeLightbox() {

    const lightbox =
        document.querySelector(
            ".product-lightbox"
        );


    const closeButton =
        document.querySelector(
            ".lightbox-close"
        );


    if (!lightbox) {

        return;

    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeLightbox
        );

    }


    lightbox.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                lightbox
            ) {

                closeLightbox();

            }

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeLightbox();

            }

        }
    );

}


function openLightbox(image) {

    const lightbox =
        document.querySelector(
            ".product-lightbox"
        );


    const lightboxImage =
        document.querySelector(
            ".product-lightbox img"
        );


    if (
        !lightbox ||
        !lightboxImage ||
        !image
    ) {

        return;

    }


    lightboxImage.src =
        image;


    lightbox.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";

}


function closeLightbox() {

    const lightbox =
        document.querySelector(
            ".product-lightbox"
        );


    if (!lightbox) {

        return;

    }


    lightbox.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";

}


/* =========================================================
   DESCRIPTION
   ========================================================= */

function renderDescription(product) {

    const container =
        document.getElementById(
            "productDescription"
        );


    if (!container) {

        return;

    }


    const description =
        product.description ||
        product.longDescription ||
        product.shortDescription ||
        "";


    if (!description) {

        container.innerHTML =
            "<p>Premium technology selected by Voltica.</p>";

        return;

    }


    /*
     * If description is already HTML,
     * preserve it.
     */

    if (
        /<[a-z][\s\S]*>/i.test(
            description
        )
    ) {

        container.innerHTML =
            description;

        return;

    }


    /*
     * Convert normal text into paragraphs.
     */

    const paragraphs =
        String(description)
            .split(/\n\s*\n/)
            .filter(Boolean);


    container.innerHTML =
        paragraphs
            .map(
                paragraph =>
                    `<p>${escapeHTML(
                        paragraph
                    ).replace(
                        /\n/g,
                        "<br>"
                    )}</p>`
            )
            .join("");

}


/* =========================================================
   FEATURES
   ========================================================= */

function renderFeatures(product) {

    const container =
        document.getElementById(
            "featureList"
        );


    if (!container) {

        return;

    }


    const features =
        product.features ||
        product.keyFeatures ||
        product.highlights ||
        [];


    container.innerHTML = "";


    if (
        !Array.isArray(features) ||
        features.length === 0
    ) {

        container.innerHTML = `

            <li>
                Premium Voltica technology.
            </li>

            <li>
                Selected for modern lifestyles.
            </li>

        `;

        return;

    }


    features.forEach(
        feature => {

            const li =
                document.createElement(
                    "li"
                );


            li.textContent =
                feature;


            container.appendChild(
                li
            );

        }
    );

}


/* =========================================================
   SPECIFICATIONS
   ========================================================= */

function renderSpecifications(product) {

    const container =
        document.getElementById(
            "specificationTable"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    const specifications =
        product.specifications ||
        product.specs ||
        {};


    if (
        Array.isArray(
            specifications
        )
    {

        specifications.forEach(
            specification => {

                if (
                    !specification ||
                    !specification.label
                ) {

                    return;

                }


                addSpecificationRow(
                    container,
                    specification.label,
                    specification.value
                );

            }
        );

        return;

    }


    Object.entries(
        specifications
    ).forEach(
        ([label, value]) => {

            addSpecificationRow(
                container,
                label,
                value
            );

        }
    );

}


/* =========================================================
   ADD SPECIFICATION ROW
   ========================================================= */

function addSpecificationRow(
    container,
    label,
    value
) {

    const row =
        document.createElement(
            "tr"
        );


    row.innerHTML = `

        <td>
            ${escapeHTML(label)}
        </td>

        <td>
            ${escapeHTML(value)}
        </td>

    `;


    container.appendChild(
        row
    );

}


/* =========================================================
   WHY VOLTICA
   ========================================================= */

function renderWhyVoltica(product) {

    const container =
        document.getElementById(
            "whyVoltica"
        );


    if (!container) {

        return;

    }


    container.innerHTML = `

        <div class="why-card">

            <span class="pulse-dot"></span>

            <h3>
                PREMIUM SELECTION
            </h3>

            <p>
                High-tech products selected
                for the Voltica collection.
            </p>

        </div>


        <div class="why-card">

            <span class="pulse-dot"></span>

            <h3>
                SECURE CHECKOUT
            </h3>

            <p>
                Secure payment processing
                through Stripe.
            </p>

        </div>


        <div class="why-card">

            <span class="pulse-dot"></span>

            <h3>
                VOLTICA SUPPORT
            </h3>

            <p>
                Dedicated customer support
                for your purchase.
            </p>

        </div>

    `;

}


/* =========================================================
   VARIANTS
   ========================================================= */

function initializeVariants(product) {

    const container =
        document.getElementById(
            "colorOptions"
        );


    if (!container) {

        return;

    }


    const variants =
        product.variants ||
        product.colors ||
        [];


    container.innerHTML = "";


    if (
        !Array.isArray(variants) ||
        variants.length === 0
    ) {

        return;

    }


    variants.forEach(
        (variant, index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "color-option";


            const name =
                typeof variant === "string"
                    ? variant
                    : variant.name ||
                      variant.color ||
                      `Option ${index + 1}`;


            button.textContent =
                name;


            if (index === 0) {

                button.classList.add(
                    "active"
                );

                updateSelectedOption(
                    name
                );

            }


            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".color-option"
                        )
                        .forEach(
                            option => {

                                option.classList.remove(
                                    "active"
                                );

                            }
                        );


                    button.classList.add(
                        "active"
                    );


                    updateSelectedOption(
                        name
                    );

                }
            );


            container.appendChild(
                button
            );

        }
    );

}


function updateSelectedOption(
    value
) {

    const selected =
        document.getElementById(
            "selectedOption"
        );


    if (selected) {

        selected.textContent =
            value;

    }

}


/* =========================================================
   STRIPE BUTTON
   ========================================================= */

function setupStripeButton(product) {

    const button =
        document.getElementById(
            "buyNowButton"
        );


    if (!button) {

        return;

    }


    const stripeLink =
        product.stripeLink ||
        product.stripe ||
        product.stripeUrl ||
        "";


    if (!stripeLink) {

        button.style.display =
            "none";

        return;

    }


    button.href =
        stripeLink;


    button.target =
        "_blank";


    button.rel =
        "noopener noreferrer";


    button.style.display =
        "flex";

}


/* =========================================================
   REFERENCE PRICE
   ========================================================= */

function renderReferencePrice(product) {

    const element =
        document.getElementById(
            "referencePrice"
        );


    if (!element) {

        return;

    }


    if (
        product.referencePrice ===
        undefined ||
        product.referencePrice ===
        null ||
        product.referencePrice === ""
    ) {

        element.style.display =
            "none";

        return;

    }


    element.textContent =
        `Reference price: ${formatPrice(
            product.referencePrice
        )}`;

}


/* =========================================================
   ERROR
   ========================================================= */

function showProductError() {

    const page =
        document.querySelector(
            ".product-page"
        );


    if (!page) {

        return;

    }


    page.innerHTML = `

        <div class="product-error">

            <span class="pulse-dot"></span>

            <h1>
                PRODUCT NOT FOUND
            </h1>

            <p>
                This Voltica product could not
                be located in the current collection.
            </p>

            <a
                href="store.html"
                class="back-store-button"
            >
                RETURN TO STORE
            </a>

        </div>

    `;

}


/* =========================================================
   IMAGE HELPERS
   ========================================================= */

function getProductImages(product) {

    if (
        Array.isArray(product.images)
    ) {

        return product.images
            .filter(Boolean);

    }


    if (product.image) {

        return [
            product.image
        ];

    }


    if (product.thumbnail) {

        return [
            product.thumbnail
        ];

    }


    return [];

}


function getMainImage(product) {

    const images =
        getProductImages(product);


    return images.length
        ? images[0]
        : "";

}


/* =========================================================
   PRICE
   ========================================================= */

function formatPrice(price) {

    if (
        price === undefined ||
        price === null ||
        price === ""
    ) {

        return "—";

    }


    const numericPrice =
        Number(price);


    if (
        Number.isNaN(
            numericPrice
        )
    ) {

        return String(price);

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
        numericPrice
    );

}


/* =========================================================
   PRODUCT NUMBER
   ========================================================= */

function formatProductNumber(number) {

    const numericNumber =
        Number(number);


    if (
        Number.isNaN(
            numericNumber
        )
    ) {

        return String(number);

    }


    return `PRODUCT ${numericNumber
        .toString()
        .padStart(2, "0")}`;

}


/* =========================================================
   TEXT HELPER
   ========================================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {

        return;

    }


    element.textContent =
        value ?? "";

}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHTML(value) {

    return String(value)
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
   PUBLIC API
   ========================================================= */

window.VolticaProductView = {

    reload: function () {

        initializeProductView();

    },

    getCurrentProduct: function () {

        return getProductFromURL();

    }

};
