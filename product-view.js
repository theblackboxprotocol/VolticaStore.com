/* =========================================================
   VOLTICA STORE
   PRODUCT VIEW ENGINE
   DYNAMIC PRODUCT LOADER
   ========================================================= */

"use strict";


/* =========================================================
   IMMEDIATE LOADING SAFETY
   ========================================================= */

document.documentElement.classList.add(
    "product-engine-starting"
);


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeProductPage
);


function initializeProductPage() {

    console.log(
        "VOLTICA: PRODUCT VIEW START"
    );


    /* =====================================================
       DOM REFERENCES
       ===================================================== */

    const mainImage =
        document.getElementById(
            "mainProductImage"
        );

    const thumbnails =
        document.getElementById(
            "productThumbnails"
        );

    const category =
        document.getElementById(
            "productCategory"
        );

    const badge =
        document.getElementById(
            "productBadge"
        );

    const name =
        document.getElementById(
            "productName"
        );

    const shortDescription =
        document.getElementById(
            "productShortDescription"
        );

    const price =
        document.getElementById(
            "productPrice"
        );

    const referencePrice =
        document.getElementById(
            "referencePrice"
        );

    const currency =
        document.getElementById(
            "productCurrency"
        );

    const variantsContainer =
        document.getElementById(
            "productVariants"
        );

    const stripeButton =
        document.getElementById(
            "stripeButton"
        );

    const finalStripeButton =
        document.getElementById(
            "finalStripeButton"
        );

    const availability =
        document.getElementById(
            "productAvailability"
        );

    const description =
        document.getElementById(
            "productDescription"
        );

    const features =
        document.getElementById(
            "productFeatures"
        );

    const specifications =
        document.getElementById(
            "productSpecifications"
        );

    const options =
        document.getElementById(
            "productOptions"
        );

    const finalProductName =
        document.getElementById(
            "finalProductName"
        );

    const status =
        document.getElementById(
            "productStatus"
        );


    /* =====================================================
       REMOVE LOADING STATE — ALWAYS
       ===================================================== */

    function finishLoading() {

        document.body.classList.add(
            "product-loaded"
        );

        document.body.classList.remove(
            "product-loading"
        );

        document.documentElement.classList.remove(
            "product-engine-starting"
        );

    }


    /* =====================================================
       DATABASE CHECK
       ===================================================== */

    if (
        typeof window.volticaProducts ===
        "undefined"
    ) {

        console.error(
            "VOLTICA: products.js was not loaded."
        );

        showProductError(
            "PRODUCT DATABASE UNAVAILABLE",
            "The Voltica product database could not be loaded."
        );

        finishLoading();

        return;

    }


    if (
        !Array.isArray(
            window.volticaProducts
        )
    ) {

        console.error(
            "VOLTICA: Product database is invalid."
        );

        showProductError(
            "PRODUCT DATABASE ERROR",
            "The product database format is invalid."
        );

        finishLoading();

        return;

    }


    console.log(
        "VOLTICA: DATABASE READY —",
        window.volticaProducts.length,
        "product(s)"
    );


    /* =====================================================
       READ PRODUCT ID FROM URL
       ===================================================== */

    const params =
        new URLSearchParams(
            window.location.search
        );


    const requestedId =
        params.get("id");


    console.log(
        "VOLTICA: REQUESTED PRODUCT ID =",
        requestedId
    );


    if (!requestedId) {

        console.error(
            "VOLTICA: No product ID supplied."
        );

        showProductError(
            "PRODUCT NOT SPECIFIED",
            "No product was specified in this URL."
        );

        finishLoading();

        return;

    }


    /* =====================================================
       FIND PRODUCT
       ===================================================== */

    const product =
        window.volticaProducts.find(
            item =>
                item &&
                String(item.id).trim() ===
                String(requestedId).trim()
        );


    if (!product) {

        console.error(
            "VOLTICA: Product not found:",
            requestedId
        );

        showProductError(
            "PRODUCT NOT FOUND",
            "The requested product does not exist in the Voltica database."
        );

        finishLoading();

        return;

    }


    console.log(
        "VOLTICA: PRODUCT FOUND =",
        product.name
    );


    /* =====================================================
       PAGE TITLE
       ===================================================== */

    document.title =
        product.name
            ? `${product.name} — Voltica Store`
            : "Voltica Store — Product";


    /* =====================================================
       BASIC INFORMATION
       ===================================================== */

    if (category) {

        category.textContent =
            product.category ||
            "VOLTICA COLLECTION";

    }


    if (badge) {

        badge.textContent =
            product.badge ||
            "AVAILABLE";

    }


    if (name) {

        name.textContent =
            product.name ||
            "Voltica Product";

    }


    if (finalProductName) {

        finalProductName.textContent =
            product.name ||
            "DISCOVER THE FUTURE.";

    }


    if (shortDescription) {

        shortDescription.textContent =
            product.shortDescription ||
            "";

    }


    /* =====================================================
       PRICE
       ===================================================== */

    const productPrice =
        Number(product.price);


    if (price) {

        price.textContent =
            Number.isFinite(productPrice)
                ? "$" + productPrice.toFixed(2)
                : "$0.00";

    }


    if (currency) {

        currency.textContent =
            product.currency ||
            "USD";

    }


    /* =====================================================
       REFERENCE PRICE
       ===================================================== */

    const reference =
        Number(
            product.referencePrice
        );


    if (referencePrice) {

        if (
            Number.isFinite(reference) &&
            Number.isFinite(productPrice) &&
            reference > productPrice
        ) {

            referencePrice.textContent =
                "$" +
                reference.toFixed(2);

        } else {

            referencePrice.textContent =
                "";

        }

    }


    /* =====================================================
       AVAILABILITY
       ===================================================== */

    if (availability) {

        availability.textContent =
            product.availability ||
            (
                product.active === false
                    ? "CURRENTLY UNAVAILABLE"
                    : "PRE-ORDER AVAILABLE"
            );

    }


    /* =====================================================
       PRODUCT STATUS
       ===================================================== */

    if (status) {

        if (
            product.active === false
        ) {

            status.classList.add(
                "inactive"
            );

        } else {

            status.classList.remove(
                "inactive"
            );

        }

    }


    /* =====================================================
       STRIPE
       ===================================================== */

    if (stripeButton) {

        if (product.stripeLink) {

            stripeButton.href =
                product.stripeLink;

            stripeButton.style.display =
                "";

        } else {

            stripeButton.removeAttribute(
                "href"
            );

            stripeButton.style.display =
                "none";

        }

    }


    if (finalStripeButton) {

        if (product.stripeLink) {

            finalStripeButton.href =
                product.stripeLink;

            finalStripeButton.style.display =
                "";

        } else {

            finalStripeButton.removeAttribute(
                "href"
            );

            finalStripeButton.style.display =
                "none";

        }

    }


    /* =====================================================
       DESCRIPTION
       ===================================================== */

    renderDescription(
        description,
        product.description ||
        product.shortDescription ||
        ""
    );


    /* =====================================================
       FEATURES
       ===================================================== */

    renderFeatures(
        features,
        product.features ||
        product.keyFeatures ||
        []
    );


    /* =====================================================
       SPECIFICATIONS
       ===================================================== */

    renderSpecifications(
        specifications,
        product.specifications ||
        product.technicalSpecifications ||
        {}
    );


    /* =====================================================
       OPTIONS
       ===================================================== */

    renderOptions(
        options,
        product
    );


    /* =====================================================
       VARIANTS
       ===================================================== */

    renderVariants(
        variantsContainer,
        product
    );


    /* =====================================================
       GALLERY
       ===================================================== */

    initializeGallery(
        mainImage,
        thumbnails,
        product
    );


    /* =====================================================
       LIGHTBOX
       ===================================================== */

    initializeLightbox(
        mainImage,
        product
    );


    /* =====================================================
       FINALIZE
       ===================================================== */

    finishLoading();


    console.log(
        "VOLTICA: PRODUCT READY —",
        product.name
    );

}


/* =========================================================
   DESCRIPTION
   ========================================================= */

function renderDescription(
    container,
    text
) {

    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (!text) {
        return;
    }


    const paragraphs =
        String(text)
            .split(/\n\s*\n/)
            .map(
                paragraph =>
                    paragraph.trim()
            )
            .filter(Boolean);


    paragraphs.forEach(
        paragraph => {

            const element =
                document.createElement(
                    "p"
                );


            element.textContent =
                paragraph;


            container.appendChild(
                element
            );

        }
    );

}


/* =========================================================
   FEATURES
   ========================================================= */

function renderFeatures(
    container,
    featureData
) {

    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (!Array.isArray(featureData)) {

        return;

    }


    featureData.forEach(
        (feature, index) => {

            let title =
                "";

            let text =
                "";


            if (
                typeof feature ===
                "string"
            ) {

                const parts =
                    feature.split(
                        ":"
                    );


                if (parts.length > 1) {

                    title =
                        parts
                            .shift()
                            .trim();

                    text =
                        parts
                            .join(":")
                            .trim();

                } else {

                    title =
                        feature;

                }

            } else if (
                feature &&
                typeof feature ===
                "object"
            ) {

                title =
                    feature.title ||
                    feature.name ||
                    `FEATURE ${index + 1}`;

                text =
                    feature.description ||
                    feature.text ||
                    "";

            }


            const article =
                document.createElement(
                    "article"
                );


            article.className =
                "feature-card";


            const inner =
                document.createElement(
                    "div"
                );


            inner.className =
                "feature-card-inner";


            const number =
                document.createElement(
                    "span"
                );


            number.className =
                "feature-number";


            number.textContent =
                String(index + 1)
                    .padStart(
                        2,
                        "0"
                    );


            const heading =
                document.createElement(
                    "h3"
                );


            heading.textContent =
                title;


            const paragraph =
                document.createElement(
                    "p"
                );


            paragraph.textContent =
                text;


            inner.appendChild(
                number
            );

            inner.appendChild(
                heading
            );

            inner.appendChild(
                paragraph
            );

            article.appendChild(
                inner
            );

            container.appendChild(
                article
            );

        }
    );

}


/* =========================================================
   SPECIFICATIONS
   ========================================================= */

function renderSpecifications(
    container,
    data
) {

    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (
        !data ||
        typeof data !== "object" ||
        Array.isArray(data)
    ) {

        return;

    }


    Object.entries(data)
        .forEach(
            ([key, value]) => {

                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "specification-row";


                const label =
                    document.createElement(
                        "span"
                    );


                label.className =
                    "specification-label";


                label.textContent =
                    key;


                const content =
                    document.createElement(
                        "strong"
                    );


                content.className =
                    "specification-value";


                content.textContent =
                    value;


                row.appendChild(
                    label
                );


                row.appendChild(
                    content
                );


                container.appendChild(
                    row
                );

            }
        );

}


/* =========================================================
   OPTIONS
   ========================================================= */

function renderOptions(
    container,
    product
) {

    if (!container) {
        return;
    }


    container.innerHTML = "";


    const hasColors =
        Array.isArray(product.colors) &&
        product.colors.length > 0;


    const hasVariants =
        Array.isArray(product.variants) &&
        product.variants.length > 0;


    if (
        !hasColors &&
        !hasVariants
    ) {

        const group =
            document.createElement(
                "div"
            );


        group.className =
            "option-group";


        const label =
            document.createElement(
                "span"
            );


        label.className =
            "option-label";


        label.textContent =
            "PRODUCT";


        const value =
            document.createElement(
                "strong"
            );


        value.textContent =
            product.name ||
            "Voltica Product";


        group.appendChild(
            label
        );

        group.appendChild(
            value
        );


        container.appendChild(
            group
        );


        return;

    }


    if (hasColors) {

        const group =
            document.createElement(
                "div"
            );


        group.className =
            "option-group";


        const label =
            document.createElement(
                "span"
            );


        label.className =
            "option-label";


        label.textContent =
            "COLOR";


        const value =
            document.createElement(
                "strong"
            );


        value.textContent =
            product.colors.join(
                " / "
            );


        group.appendChild(
            label
        );

        group.appendChild(
            value
        );


        container.appendChild(
            group
        );

    }


    if (hasVariants) {

        product.variants.forEach(
            variant => {

                const group =
                    document.createElement(
                        "div"
                    );


                group.className =
                    "option-group";


                const label =
                    document.createElement(
                        "span"
                    );


                label.className =
                    "option-label";


                label.textContent =
                    "VARIANT";


                const value =
                    document.createElement(
                        "strong"
                    );


                if (
                    typeof variant ===
                    "string"
                ) {

                    value.textContent =
                        variant;

                } else {

                    value.textContent =
                        variant.name ||
                        variant.sku ||
                        "";

                }


                group.appendChild(
                    label
                );

                group.appendChild(
                    value
                );


                container.appendChild(
                    group
                );

            }
        );

    }

}


/* =========================================================
   VARIANTS
   ========================================================= */

function renderVariants(
    container,
    product
) {

    if (!container) {
        return;
    }


    container.innerHTML = "";


    const colors =
        Array.isArray(product.colors)
            ? product.colors
            : [];


    const variants =
        Array.isArray(product.variants)
            ? product.variants
            : [];


    if (
        !colors.length &&
        !variants.length
    ) {

        return;

    }


    if (colors.length) {

        const group =
            document.createElement(
                "div"
            );


        group.className =
            "variant-group";


        const label =
            document.createElement(
                "span"
            );


        label.className =
            "variant-label";


        label.textContent =
            "COLOR";


        group.appendChild(
            label
        );


        colors.forEach(
            (color, index) => {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


                button.className =
                    "variant-option";


                if (
                    index === 0
                ) {

                    button.classList.add(
                        "selected"
                    );

                }


                button.textContent =
                    color;


                button.addEventListener(
                    "click",
                    () => {

                        group
                            .querySelectorAll(
                                ".variant-option"
                            )
                            .forEach(
                                item =>
                                    item.classList.remove(
                                        "selected"
                                    )
                            );


                        button.classList.add(
                            "selected"
                        );

                    }
                );


                group.appendChild(
                    button
                );

            }
        );


        container.appendChild(
            group
        );

    }


    if (variants.length) {

        const group =
            document.createElement(
                "div"
            );


        group.className =
            "variant-group";


        const label =
            document.createElement(
                "span"
            );


        label.className =
            "variant-label";


        label.textContent =
            "OPTIONS";


        group.appendChild(
            label
        );


        variants.forEach(
            (variant, index) => {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


                button.className =
                    "variant-option";


                if (
                    !colors.length &&
                    index === 0
                ) {

                    button.classList.add(
                        "selected"
                    );

                }


                const variantName =
                    typeof variant ===
                    "string"
                        ? variant
                        : (
                            variant.name ||
                            variant.sku ||
                            "OPTION"
                        );


                button.textContent =
                    variantName;


                group.appendChild(
                    button
                );

            }
        );


        container.appendChild(
            group
        );

    }

}


/* =========================================================
   GALLERY
   ========================================================= */

function initializeGallery(
    mainImage,
    thumbnails,
    product
) {

    if (!mainImage) {
        return;
    }


    const images =
        Array.isArray(product.images)
            ? product.images
                .filter(Boolean)
                .map(
                    image =>
                        normalizeImagePath(
                            image
                        )
                )
            : [];


    if (!images.length) {

        mainImage.removeAttribute(
            "src"
        );

        mainImage.alt =
            product.name ||
            "Voltica Product";


        if (thumbnails) {

            thumbnails.innerHTML = "";

        }


        return;

    }


    let currentIndex =
        0;


    function setMainImage(
        imagePath,
        index
    ) {

        mainImage.src =
            imagePath;

        mainImage.alt =
            product.name ||
            "Voltica Product";


        currentIndex =
            index;


        if (thumbnails) {

            thumbnails
                .querySelectorAll(
                    ".product-thumbnail"
                )
                .forEach(
                    (button, buttonIndex) => {

                        button.classList.toggle(
                            "active",
                            buttonIndex ===
                            currentIndex
                        );

                    }
                );

        }

    }


    mainImage.addEventListener(
        "error",
        function () {

            console.warn(
                "VOLTICA: Image failed:",
                mainImage.src
            );

        }
    );


    setMainImage(
        images[0],
        0
    );


    if (!thumbnails) {
        return;
    }


    thumbnails.innerHTML = "";


    images.forEach(
        (imagePath, index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "product-thumbnail";


            if (
                index === 0
            ) {

                button.classList.add(
                    "active"
                );

            }


            const image =
                document.createElement(
                    "img"
                );


            image.src =
                imagePath;


            image.alt =
                `${product.name || "Product"} image ${index + 1}`;


            image.loading =
                "lazy";


            image.onerror =
                function () {

                    button.style.display =
                        "none";

                };


            button.appendChild(
                image
            );


            button.addEventListener(
                "click",
                function () {

                    setMainImage(
                        imagePath,
                        index
                    );

                }
            );


            thumbnails.appendChild(
                button
            );

        }
    );

}


/* =========================================================
   IMAGE PATH NORMALIZATION
   ========================================================= */

function normalizeImagePath(
    image
) {

    const value =
        String(
            image || ""
        ).trim();


    if (!value) {
        return "";
    }


    if (
        value.startsWith(
            "assets/images/"
        )
    ) {

        return value;

    }


    if (
        value.startsWith(
            "/assets/images/"
        )
    ) {

        return value.substring(
            1
        );

    }


    if (
        value.startsWith(
            "http://"
        ) ||
        value.startsWith(
            "https://"
        ) ||
        value.startsWith(
            "data:"
        )
    ) {

        return value;

    }


    return (
        "assets/images/" +
        value.split("/").pop()
    );

}


/* =========================================================
   LIGHTBOX
   ========================================================= */

function initializeLightbox(
    mainImage,
    product
) {

    const lightbox =
        document.getElementById(
            "productLightbox"
        );


    const lightboxImage =
        document.getElementById(
            "lightboxImage"
        );


    const lightboxClose =
        document.getElementById(
            "lightboxClose"
        );


    const zoomButton =
        document.getElementById(
            "imageZoomButton"
        );


    if (
        !lightbox ||
        !lightboxImage ||
        !mainImage
    ) {

        return;

    }


    function openLightbox() {

        if (
            !mainImage.src
        ) {

            return;

        }


        lightboxImage.src =
            mainImage.src;


        lightboxImage.alt =
            product.name ||
            "Voltica Product";


        lightbox.classList.add(
            "active"
        );


        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "lightbox-open"
        );

    }


    function closeLightbox() {

        lightbox.classList.remove(
            "active"
        );


        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "lightbox-open"
        );

    }


    if (zoomButton) {

        zoomButton.addEventListener(
            "click",
            openLightbox
        );

    }


    if (lightboxClose) {

        lightboxClose.addEventListener(
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
                event.key ===
                "Escape"
            ) {

                closeLightbox();

            }

        }
    );

}


/* =========================================================
   ERROR PAGE
   ========================================================= */

function showProductError(
    title,
    message
) {

    const productPage =
        document.getElementById(
            "productPage"
        );


    if (!productPage) {

        return;

    }


    productPage.innerHTML = `

        <section
            style="
                min-height:70vh;
                display:grid;
                place-items:center;
                padding:80px 20px;
            "
        >

            <div
                style="
                    width:min(700px, 100%);
                    padding:50px;
                    text-align:center;
                    border:1px solid rgba(255,255,255,.12);
                    border-radius:28px;
                    background:rgba(255,255,255,.035);
                    backdrop-filter:blur(24px);
                "
            >

                <span
                    style="
                        display:block;
                        margin-bottom:18px;
                        color:#777;
                        font-size:11px;
                        letter-spacing:.22em;
                    "
                >
                    VOLTICA STORE
                </span>

                <h1
                    style="
                        margin:0 0 16px;
                        color:#fff;
                        font-size:clamp(30px, 6vw, 56px);
                    "
                >
                    ${escapeHtml(title)}
                </h1>

                <p
                    style="
                        margin:0 auto 30px;
                        max-width:500px;
                        color:#999;
                        line-height:1.7;
                    "
                >
                    ${escapeHtml(message)}
                </p>

                <a
                    href="store.html"
                    style="
                        display:inline-flex;
                        align-items:center;
                        justify-content:center;
                        min-height:52px;
                        padding:0 28px;
                        border-radius:14px;
                        color:#fff;
                        text-decoration:none;
                        border:1px solid rgba(255,255,255,.15);
                        background:rgba(255,255,255,.06);
                    "
                >
                    ← BACK TO STORE
                </a>

            </div>

        </section>

    `;

}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHtml(
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
   GLOBAL ERROR SAFETY
   ========================================================= */

window.addEventListener(
    "error",
    function (event) {

        console.error(
            "VOLTICA PRODUCT VIEW ERROR:",
            event.error || event.message
        );

    }
);


window.addEventListener(
    "unhandledrejection",
    function (event) {

        console.error(
            "VOLTICA PRODUCT VIEW PROMISE ERROR:",
            event.reason
        );

    }
);
