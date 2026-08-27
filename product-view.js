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
            "productTitle"
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
            "colorOptions"
        );

    const selectedOption =
        document.getElementById(
            "selectedOption"
        );

    const stripeButton =
        document.getElementById(
            "buyNowButton"
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
            "featureList"
        );

    const specifications =
        document.getElementById(
            "specificationTable"
        );

    const finalProductName =
        document.getElementById(
            "finalProductName"
        );


    /* =====================================================
       LOADING FINISH
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
       READ PRODUCT ID
       ===================================================== */

    const params =
        new URLSearchParams(
            window.location.search
        );


    const requestedId =
        params.get(
            "id"
        );


    console.log(
        "VOLTICA: REQUESTED PRODUCT ID =",
        requestedId
    );


    if (!requestedId) {

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
        Number(
            product.price
        );


    if (price) {

        price.textContent =
            Number.isFinite(
                productPrice
            )
                ? "$" +
                  productPrice.toFixed(2)
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
                    : "AVAILABLE NOW"
            );

    }


    /* =====================================================
       STRIPE
       ===================================================== */

    configureStripeButton(
        stripeButton,
        product.stripeLink
    );


    configureStripeButton(
        finalStripeButton,
        product.stripeLink
    );


    /* =====================================================
       DESCRIPTION
       ===================================================== */

    renderDescription(
        description,
        product.description ||
        product.fullDescription ||
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
        []
    );


    /* =====================================================
       OPTIONS + VARIANTS
       ===================================================== */

    renderProductOptions(
        variantsContainer,
        selectedOption,
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
       CUSTOM CTA
       ===================================================== */

    renderCustomCTA(
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
   STRIPE BUTTON
   ========================================================= */

function configureStripeButton(
    button,
    link
) {

    if (!button) {
        return;
    }


    if (
        typeof link === "string" &&
        link.trim()
    ) {

        button.href =
            link.trim();

        button.style.display =
            "";

    } else {

        button.removeAttribute(
            "href"
        );

        button.style.display =
            "none";

    }

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
            .split(
                /\n\s*\n/
            )
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


    if (
        typeof featureData === "string"
    ) {

        featureData =
            featureData
                .split("\n")
                .map(
                    item =>
                        item.trim()
                )
                .filter(Boolean);

    }


    if (!Array.isArray(featureData)) {
        return;
    }


    featureData.forEach(
        (feature, index) => {

            let title = "";
            let text = "";


            if (
                typeof feature ===
                "string"
            ) {

                const separator =
                    feature.indexOf(":");


                if (
                    separator !== -1
                ) {

                    title =
                        feature
                            .slice(
                                0,
                                separator
                            )
                            .trim();

                    text =
                        feature
                            .slice(
                                separator + 1
                            )
                            .trim();

                } else {

                    title =
                        feature.trim();

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


            if (!title && !text) {
                return;
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
        typeof data === "string"
    ) {

        data =
            data
                .split("\n")
                .map(
                    item =>
                        item.trim()
                )
                .filter(Boolean);

    }


    if (Array.isArray(data)) {

        data.forEach(
            item => {

                if (
                    typeof item !==
                    "string"
                ) {

                    return;

                }


                const separator =
                    item.indexOf(":");


                let key =
                    separator !== -1
                        ? item
                            .slice(
                                0,
                                separator
                            )
                            .trim()
                        : "SPECIFICATION";


                let value =
                    separator !== -1
                        ? item
                            .slice(
                                separator + 1
                            )
                            .trim()
                        : item;


                appendSpecification(
                    container,
                    key,
                    value
                );

            }
        );

        return;

    }


    if (
        !data ||
        typeof data !== "object"
    ) {

        return;

    }


    Object.entries(data)
        .forEach(
            ([key, value]) => {

                appendSpecification(
                    container,
                    key,
                    value
                );

            }
        );

}


function appendSpecification(
    container,
    key,
    value
) {

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
/* =========================================================
   PRODUCT OPTIONS
   ========================================================= */

function renderProductOptions(
    container,
    selectedOption,
    product
) {

    if (!container) {
        return;
    }


    container.innerHTML = "";


    const colors =
        normalizeArray(
            product.colors
        );


    const variants =
        normalizeArray(
            product.variants
        );


    /*
     * Build one unified list of selectable options.
     */

    const options = [];


    colors.forEach(
        color => {

            const value =
                typeof color === "string"
                    ? color.trim()
                    : "";


            if (value) {

                options.push({
                    type: "COLOR",
                    name: value
                });

            }

        }
    );


    variants.forEach(
        variant => {

            let variantName = "";


            if (
                typeof variant ===
                "string"
            ) {

                variantName =
                    variant
                        .split("—")[0]
                        .split("-")[0]
                        .trim();

            } else if (
                variant &&
                typeof variant ===
                "object"
            ) {

                variantName =
                    variant.name ||
                    variant.title ||
                    variant.color ||
                    variant.sku ||
                    "";

            }


            if (variantName) {

                options.push({
                    type: "VARIANT",
                    name: String(
                        variantName
                    ).trim()
                });

            }

        }
    );


    /*
     * Remove duplicate options.
     */

    const uniqueOptions =
        options.filter(
            (option, index, array) =>
                array.findIndex(
                    item =>
                        item.name.toLowerCase() ===
                        option.name.toLowerCase()
                ) === index
        );


    /*
     * No options.
     */

    if (!uniqueOptions.length) {

        if (selectedOption) {

            selectedOption.textContent =
                product.name ||
                "—";

        }

        return;

    }


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
        colors.length
            ? "COLOR"
            : "OPTIONS";


    group.appendChild(
        label
    );


    uniqueOptions.forEach(
        (option, index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "variant-option";


            button.textContent =
                option.name;


            if (
                index === 0
            ) {

                button.classList.add(
                    "selected"
                );

                if (selectedOption) {

                    selectedOption.textContent =
                        option.name;

                }

            }


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


                    if (selectedOption) {

                        selectedOption.textContent =
                            option.name;

                    }

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


/* =========================================================
   ARRAY NORMALIZATION
   ========================================================= */

function normalizeArray(
    value
) {

    if (
        Array.isArray(value)
    ) {

        return value;

    }


    if (
        typeof value ===
        "string"
    ) {

        return value
            .split(/\n|,/)
            .map(
                item =>
                    item.trim()
            )
            .filter(Boolean);

    }


    return [];

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
        normalizeArray(
            product.images
        )
            .filter(Boolean)
            .map(
                image =>
                    normalizeImagePath(
                        image
                    )
            )
            .filter(Boolean);


    if (!images.length) {

        mainImage.removeAttribute(
            "src"
        );


        mainImage.alt =
            product.name ||
            "Voltica Product";


        if (thumbnails) {

            thumbnails.innerHTML =
                "";

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
                    (
                        button,
                        buttonIndex
                    ) => {

                        button.classList.toggle(
                            "active",
                            buttonIndex ===
                            currentIndex
                        );

                    }
                );

        }

    }


    setMainImage(
        images[0],
        0
    );


    if (!thumbnails) {
        return;
    }


    thumbnails.innerHTML =
        "";


    images.forEach(
        (
            imagePath,
            index
        ) => {

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
                () => {

                    button.style.display =
                        "none";

                };


            button.appendChild(
                image
            );


            button.addEventListener(
                "click",
                () => {

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
            "http://"
        ) ||
        value.startsWith(
            "https://"
        ) ||
        value.startsWith(
            "data:"
        ) ||
        value.startsWith(
            "blob:"
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
            "assets/images/"
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
        document.querySelector(
            ".product-lightbox"
        );


    if (!lightbox || !mainImage) {
        return;
    }


    const lightboxImage =
        lightbox.querySelector(
            "img"
        );


    const lightboxClose =
        lightbox.querySelector(
            ".lightbox-close"
        );


    if (!lightboxImage) {
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


    /*
     * Allow clicking the main image itself
     * to open the lightbox.
     */

    mainImage.style.cursor =
        "zoom-in";


    mainImage.addEventListener(
        "click",
        openLightbox
    );


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
   CUSTOM CTA
   ========================================================= */

function renderCustomCTA(
    product
) {

    /*
     * Find the existing final CTA.
     * No HTML rewrite is required.
     */

    const cta =
        document.querySelector(
            ".product-final-cta"
        );


    if (!cta) {

        console.warn(
            "VOLTICA: Final CTA container not found."
        );

        return;

    }


    const glass =
        cta.querySelector(
            ".cta-glass"
        );


    if (!glass) {

        return;

    }


    const title =
        product.customCtaTitle
            ? String(
                product.customCtaTitle
            ).trim()
            : "";


    const rawLines =
        product.customCtaLines;


    let lines = [];


    if (
        Array.isArray(rawLines)
    ) {

        lines =
            rawLines
                .map(
                    line =>
                        String(
                            line
                        ).trim()
                )
                .filter(Boolean);

    } else if (
        typeof rawLines ===
        "string"
    ) {

        lines =
            rawLines
                .split("\n")
                .map(
                    line =>
                        line.trim()
                )
                .filter(Boolean);

    }


    /*
     * Remove the old generic CTA paragraph.
     */

    const genericParagraph =
        glass.querySelector(
            "p"
        );


    if (genericParagraph) {

        genericParagraph.remove();

    }


    /*
     * Find the CTA title.
     */

    const ctaTitle =
        glass.querySelector(
            "#finalProductName"
        );


    if (ctaTitle) {

        if (title) {

            ctaTitle.textContent =
                title;

        } else {

            ctaTitle.textContent =
                product.name ||
                "DISCOVER THE FUTURE.";

        }

    }


    /*
     * Render custom CTA lines.
     */

    if (lines.length) {

        const content =
            document.createElement(
                "div"
            );


        content.className =
            "custom-cta-content";


        lines.forEach(
            line => {

                const paragraph =
                    document.createElement(
                        "p"
                    );


                paragraph.textContent =
                    line;


                content.appendChild(
                    paragraph
                );

            }
        );


        /*
         * Insert the custom content
         * immediately before BUY NOW.
         */

        const finalButton =
            glass.querySelector(
                "#finalStripeButton"
            );


        if (finalButton) {

            glass.insertBefore(
                content,
                finalButton
            );

        } else {

            glass.appendChild(
                content
            );

        }

    }


    /*
     * If neither a custom title nor custom
     * content exists, retain the default CTA.
     */

    if (
        !title &&
        !lines.length
    ) {

        const fallback =
            document.createElement(
                "p"
            );


        fallback.textContent =
            "Premium technology selected for the next generation.";


        if (ctaTitle) {

            ctaTitle.insertAdjacentElement(
                "afterend",
                fallback
            );

        } else {

            glass.appendChild(
                fallback
            );

        }

    }

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
                    width:min(700px,100%);
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
                        font-size:clamp(30px,6vw,56px);
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
    event => {

        console.error(
            "VOLTICA PRODUCT VIEW ERROR:",
            event.error ||
            event.message
        );

    }
);


window.addEventListener(
    "unhandledrejection",
    event => {

        console.error(
            "VOLTICA PRODUCT VIEW PROMISE ERROR:",
            event.reason
        );

    }
);
