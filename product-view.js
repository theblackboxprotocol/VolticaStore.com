/* =========================================================
   VOLTICA STORE — PRODUCT VIEW.JS
   Product Detail Engine
   Compatible with product-view.html
   ========================================================= */

"use strict";


/* =========================================================
   CONFIG
   ========================================================= */

const VOLTICA_PRODUCTS_KEY =
    "voltica_products_admin";

const DEFAULT_STRIPE_LINK =
    "https://buy.stripe.com/eVqeVe2hNgILbyoaWK2Ji0j";


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeProductView
);


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


    /* =====================================================
       SOURCE 1 — PRODUCTS.JS
       ===================================================== */

    if (
        Array.isArray(
            window.volticaProducts
        )
    ) {

        const product =
            window.volticaProducts.find(
                item =>
                    String(item.id) ===
                    String(productId)
            );


        if (product) {

            return product;

        }

    }


    /* =====================================================
       SOURCE 2 — ADMIN LOCAL STORAGE
       ===================================================== */

    try {

        const saved =
            localStorage.getItem(
                VOLTICA_PRODUCTS_KEY
            );


        if (saved) {

            const products =
                JSON.parse(saved);


            if (
                Array.isArray(products)
            ) {

                const product =
                    products.find(
                        item =>
                            String(item.id) ===
                            String(productId)
                    );


                if (product) {

                    return product;

                }

            }

        }

    } catch (error) {

        console.warn(
            "VOLTICA: local product database unavailable.",
            error
        );

    }


    return null;

}


/* =========================================================
   RENDER PRODUCT
   ========================================================= */

function renderProduct(product) {

    /* -----------------------------------------------------
       BASIC INFORMATION
       ----------------------------------------------------- */

    setText(
        "productCategory",
        product.category ||
        "PREMIUM TECHNOLOGY"
    );


    setText(
        "productNumber",
        product.productNumber
            ? `PRODUCT ${product.productNumber}`
            : ""
    );


    setText(
        "productTitle",
        product.name ||
        "VOLTICA PRODUCT"
    );


    setText(
        "productShortDescription",
        product.shortDescription ||
        ""
    );


    setText(
        "productBadge",
        product.badge ||
        "VOLTI​CA"
    );


    setText(
        "finalProductName",
        product.name ||
        "DISCOVER THE FUTURE."
    );


    /* -----------------------------------------------------
       PRICE
       ----------------------------------------------------- */

    setText(
        "productPrice",
        formatPrice(
            product.price
        )
    );


    setText(
        "productCurrency",
        product.currency ||
        "USD"
    );


    renderReferencePrice(
        product
    );


    /* -----------------------------------------------------
       MAIN CONTENT
       ----------------------------------------------------- */

    renderMainImage(
        product
    );


    renderThumbnails(
        product
    );


    renderDescription(
        product
    );


    renderFeatures(
        product
    );


    renderSpecifications(
        product
    );


    renderColors(
        product
    );


    /* -----------------------------------------------------
       COMMERCE
       ----------------------------------------------------- */

    setupStripeButtons(
        product
    );


    renderAvailability(
        product
    );


    /* -----------------------------------------------------
       PAGE TITLE
       ----------------------------------------------------- */

    document.title =
        `${product.name || "Product"} — Voltica Store`;

}


/* =========================================================
   REFERENCE PRICE
   ========================================================= */

function renderReferencePrice(
    product
) {

    const element =
        document.getElementById(
            "referencePrice"
        );


    if (!element) {

        return;

    }


    const referencePrice =
        Number(
            product.referencePrice
        );


    const price =
        Number(
            product.price
        );


    if (
        Number.isFinite(referencePrice) &&
        Number.isFinite(price) &&
        referencePrice > price
    ) {

        element.textContent =
            formatPrice(
                referencePrice
            );


        element.style.display =
            "inline-block";

    } else {

        element.textContent =
            "";


        element.style.display =
            "none";

    }

}


/* =========================================================
   MAIN IMAGE
   ========================================================= */

function renderMainImage(
    product
) {

    const image =
        document.getElementById(
            "mainProductImage"
        );


    if (!image) {

        return;

    }


    const images =
        getProductImages(
            product
        );


    if (!images.length) {

        image.removeAttribute(
            "src"
        );


        image.alt =
            product.name ||
            "Voltica Product";


        return;

    }


    image.src =
        images[0];


    image.alt =
        product.name ||
        "Voltica Product";

}


/* =========================================================
   THUMBNAILS
   ========================================================= */

function renderThumbnails(
    product
) {

    const container =
        document.getElementById(
            "productThumbnails"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    const images =
        getProductImages(
            product
        );


    images.forEach(
        (
            image,
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


            const img =
                document.createElement(
                    "img"
                );


            img.src =
                image;


            img.alt =
                `${product.name || "Product"} image ${index + 1}`;


            img.loading =
                index === 0
                    ? "eager"
                    : "lazy";


            img.onerror =
                () => {

                    button.style.display =
                        "none";

                };


            button.appendChild(
                img
            );


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
            item => {

                item.classList.remove(
                    "active"
                );

            }
        );


    thumbnail?.classList.add(
        "active"
    );

}


/* =========================================================
   GALLERY
   ========================================================= */

function initializeGallery() {

    const mainImage =
        document.getElementById(
            "mainProductImage"
        );


    if (!mainImage) {

        return;

    }


    mainImage.style.cursor =
        "zoom-in";


    mainImage.addEventListener(
        "click",
        () => {

            openLightbox(
                mainImage.src
            );

        }
    );

}


/* =========================================================
   LIGHTBOX
   ========================================================= */

function initializeLightbox() {

    const lightbox =
        document.querySelector(
            ".product-lightbox"
        );


    if (!lightbox) {

        return;

    }


    const closeButton =
        lightbox.querySelector(
            ".lightbox-close"
        );


    closeButton?.addEventListener(
        "click",
        closeLightbox
    );


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
   OPEN LIGHTBOX
   ========================================================= */

function openLightbox(
    image
) {

    const lightbox =
        document.querySelector(
            ".product-lightbox"
        );


    const lightboxImage =
        lightbox?.querySelector(
            "img"
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


    lightbox.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   CLOSE LIGHTBOX
   ========================================================= */

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


    lightbox.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";

}


/* =========================================================
   FULL DESCRIPTION
   ========================================================= */

function renderDescription(
    product
) {

    const container =
        document.getElementById(
            "productDescription"
        );


    if (!container) {

        return;

    }


    /*
       IMPORTANT:

       Full Description is intentionally separate
       from shortDescription.

       Store page:
       shortDescription

       Product page:
       description / fullDescription
    */

    const description =
        product.fullDescription ||
        product.longDescription ||
        product.description ||
        "";


    container.innerHTML =
        "";


    if (!description) {

        return;

    }


    /*
       Allow intentionally supplied HTML.
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
       Plain text storytelling.

       Empty lines create paragraphs.
    */

    const paragraphs =
        String(description)
            .split(
                /\n\s*\n/
            )
            .map(
                paragraph =>
                    paragraph.trim()
            )
            .filter(Boolean);


    container.innerHTML =
        paragraphs
            .map(
                paragraph => `

                    <p>
                        ${escapeHTML(
                            paragraph
                        ).replace(
                            /\n/g,
                            "<br>"
                        )}
                    </p>

                `
            )
            .join("");

}


/* =========================================================
   FEATURES
   ========================================================= */

function renderFeatures(
    product
) {

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
        [];


    container.innerHTML =
        "";


    if (
        !Array.isArray(features) ||
        !features.length
    ) {

        return;

    }


    features.forEach(
        feature => {

            const parsed =
                parseFeature(
                    feature
                );


            if (!parsed.title) {

                return;

            }


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "feature-card";


            card.innerHTML = `

                <h3>
                    ${escapeHTML(
                        parsed.title
                    )}
                </h3>

                ${
                    parsed.description
                        ? `

                            <p>
                                ${escapeHTML(
                                    parsed.description
                                )}
                            </p>

                        `
                        : ""
                }

            `;


            container.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   PARSE FEATURE
   ========================================================= */

function parseFeature(
    feature
) {

    /*
       SUPPORTED ADMIN FORMAT:

       Bluetooth Audio:
       Powerful wireless audio for everyday listening.

       OR:

       {
           title: "Bluetooth Audio",
           description:
               "Powerful wireless audio..."
       }
    */


    if (
        feature &&
        typeof feature ===
        "object"
    ) {

        return {

            title:
                feature.title ||
                feature.name ||
                feature.label ||
                feature.feature ||
                "",

            description:
                feature.description ||
                feature.value ||
                ""

        };

    }


    const text =
        String(
            feature ?? ""
        ).trim();


    if (!text) {

        return {

            title: "",
            description: ""

        };

    }


    const separator =
        text.indexOf(":");


    if (
        separator === -1
    ) {

        return {

            title: text,
            description: ""

        };

    }


    return {

        title:
            text
                .slice(
                    0,
                    separator
                )
                .trim(),

        description:
            text
                .slice(
                    separator + 1
                )
                .trim()

    };

}


/* =========================================================
   SPECIFICATIONS
   ========================================================= */

function renderSpecifications(
    product
) {

    const container =
        document.getElementById(
            "specificationTable"
        );


    if (!container) {

        return;

    }


    const specifications =
        product.specifications ||
        product.specs ||
        {};


    container.innerHTML =
        "";


    /*
       Array format
    */

    if (
        Array.isArray(
            specifications
        )
    ) {

        specifications.forEach(
            item => {

                if (!item) {

                    return;

                }


                addSpecification(
                    container,
                    item.label ||
                    item.name ||
                    item.title ||
                    "SPECIFICATION",
                    item.value ||
                    ""
                );

            }
        );


        return;

    }


    /*
       Object format
    */

    if (
        specifications &&
        typeof specifications ===
        "object"
    ) {

        Object.entries(
            specifications
        ).forEach(
            (
                [label, value]
            ) => {

                addSpecification(
                    container,
                    label,
                    value
                );

            }
        );

    }

}


/* =========================================================
   ADD SPECIFICATION
   ========================================================= */

function addSpecification(
    container,
    label,
    value
) {

    const row =
        document.createElement(
            "div"
        );


    row.className =
        "specification-row";


    row.innerHTML = `

        <span class="specification-label">
            ${escapeHTML(
                label
            )}
        </span>

        <span class="specification-value">
            ${escapeHTML(
                formatSpecificationValue(
                    value
                )
            )}
        </span>

    `;


    container.appendChild(
        row
    );

}


/* =========================================================
   SPECIFICATION VALUE
   ========================================================= */

function formatSpecificationValue(
    value
) {

    if (
        Array.isArray(value)
    ) {

        return value.join(
            ", "
        );

    }


    if (
        value &&
        typeof value ===
        "object"
    ) {

        return Object.entries(
            value
        )
        .map(
            (
                [key, val]
            ) =>
                `${key}: ${val}`
        )
        .join(
            " • "
        );

    }


    return String(
        value ?? ""
    );

}


/* =========================================================
   COLOR / VARIANT BUTTONS
   ========================================================= */

function renderColors(
    product
) {

    const container =
        document.getElementById(
            "colorOptions"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    /*
       Prefer variants because they can contain
       individual SKU information.

       Fall back to colors.
    */

    const variants =
        Array.isArray(
            product.variants
        )
            ? product.variants
            : [];


    const colors =
        Array.isArray(
            product.colors
        )
            ? product.colors
            : [];


    const options =
        variants.length
            ? variants
            : colors;


    if (!options.length) {

        const selected =
            document.querySelector(
                ".selected-option-row"
            );


        if (selected) {

            selected.style.display =
                "none";

        }


        return;

    }


    const selectedOption =
        document.getElementById(
            "selectedOption"
        );


    options.forEach(
        (
            option,
            index
        ) => {

            const data =
                parseVariant(
                    option,
                    index
                );


            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            /*
               IMPORTANT:

               Text buttons only.
               No color swatches.
            */

            button.className =
                "color-option";


            button.textContent =
                data.name;


            button.dataset.variantName =
                data.name;


            if (data.sku) {

                button.dataset.sku =
                    data.sku;

            }


            if (
                index === 0
            ) {

                button.classList.add(
                    "active"
                );


                if (
                    selectedOption
                ) {

                    selectedOption.textContent =
                        data.name;

                }

            }


            button.addEventListener(
                "click",
                () => {

                    container
                        .querySelectorAll(
                            ".color-option"
                        )
                        .forEach(
                            optionButton => {

                                optionButton.classList.remove(
                                    "active"
                                );

                            }
                        );


                    button.classList.add(
                        "active"
                    );


                    if (
                        selectedOption
                    ) {

                        selectedOption.textContent =
                            data.name;

                    }


                    /*
                       Keep the selected SKU available
                       for future checkout integration.
                    */

                    container.dataset.selectedVariant =
                        data.name;


                    container.dataset.selectedSku =
                        data.sku || "";

                }
            );


            container.appendChild(
                button
            );

        }
    );

}


/* =========================================================
   PARSE VARIANT
   ========================================================= */

function parseVariant(
    variant,
    index
) {

    if (
        variant &&
        typeof variant ===
        "object"
    ) {

        return {

            name:
                String(
                    variant.name ||
                    variant.color ||
                    variant.label ||
                    `OPTION ${index + 1}`
                ).trim(),

            sku:
                String(
                    variant.sku ||
                    variant.SKU ||
                    ""
                ).trim()

        };

    }


    const text =
        String(
            variant ?? ""
        ).trim();


    /*
       Admin format:

       Black — SKU-001
    */

    const separator =
        text.indexOf("—");


    if (
        separator !== -1
    ) {

        return {

            name:
                text
                    .slice(
                        0,
                        separator
                    )
                    .trim(),

            sku:
                text
                    .slice(
                        separator + 1
                    )
                    .trim()

        };

    }


    /*
       Simple color:

       Black
    */

    return {

        name:
            text ||
            `OPTION ${index + 1}`,

        sku: ""

    };

}
/* =========================================================
   CONTINUATION — PRODUCT VIEW.JS
   ========================================================= */

/* =========================================================
   CUSTOM CTA
   ========================================================= */

function renderCustomCTA(product) {

    document
        .querySelectorAll(".voltica-custom-product-cta")
        .forEach(element => element.remove());

    const customCTA =
        product.customCTA ||
        product.customCta ||
        product.cta;

    if (!customCTA) {
        return;
    }

    let title = "";
    let lines = [];

    if (
        typeof customCTA === "object" &&
        !Array.isArray(customCTA)
    ) {

        title =
            customCTA.title ||
            customCTA.heading ||
            customCTA.name ||
            "WHY SHOP WITH US?";

        if (Array.isArray(customCTA.lines)) {
            lines = customCTA.lines;
        }

        else if (Array.isArray(customCTA.items)) {
            lines = customCTA.items;
        }

        else if (typeof customCTA.text === "string") {
            lines = customCTA.text
                .split(/\n+/)
                .filter(Boolean);
        }

    }

    else if (Array.isArray(customCTA)) {

        title = "WHY SHOP WITH US?";
        lines = customCTA;

    }

    else if (typeof customCTA === "string") {

        title = "WHY SHOP WITH US?";
        lines = customCTA
            .split(/\n+/)
            .filter(Boolean);

    }

    title =
        String(title).trim();

    lines =
        lines
            .map(line => String(line ?? "").trim())
            .filter(Boolean);

    if (!title && !lines.length) {
        return;
    }

    const finalCTA =
        document.querySelector(".product-final-cta");

    const section =
        document.createElement("section");

    section.className =
        "voltica-custom-product-cta";

    section.innerHTML = `

        <div class="acrylic-panel custom-cta-panel">

            <span class="section-kicker">
                VOLTICA STORE
            </span>

            <h2>
                ${escapeHTML(title)}
            </h2>

            <div class="custom-cta-content">

                ${lines
                    .map(
                        line => `
                            <p>
                                ${escapeHTML(line)}
                            </p>
                        `
                    )
                    .join("")
                }

            </div>

        </div>

    `;

    if (
        finalCTA &&
        finalCTA.parentNode
    ) {

        finalCTA.before(section);

    }

    else {

        document
            .getElementById("productPage")
            ?.appendChild(section);

    }

}


/* =========================================================
   LIFETIME OFFER
   ========================================================= */

function renderLifetimeOffer() {

    if (
        document.querySelector(".lifetime-offer")
    ) {
        return;
    }

    const pricePanel =
        document.querySelector(
            ".product-price-panel"
        );

    if (!pricePanel) {
        return;
    }

    const offer =
        document.createElement("div");

    offer.className =
        "lifetime-offer";

    offer.innerHTML = `

        <span class="offer-pulse"></span>

        <div>

            <strong>
                15% OFF FOR LIFE
            </strong>

            <p>
                Your exclusive Voltica customer
                benefit — 15% off future purchases
                for life.
            </p>

        </div>

    `;

    pricePanel.after(offer);

}


/* =========================================================
   STRIPE
   ========================================================= */

function setupStripeButtons(product) {

    const stripeLink =
        product.stripeLink ||
        product.stripe ||
        product.stripeUrl ||
        DEFAULT_STRIPE_LINK;

    const buyNowButton =
        document.getElementById(
            "buyNowButton"
        );

    const finalStripeButton =
        document.getElementById(
            "finalStripeButton"
        );

    [
        buyNowButton,
        finalStripeButton
    ]
        .filter(Boolean)
        .forEach(button => {

            button.href =
                stripeLink;

            button.target =
                "_blank";

            button.rel =
                "noopener noreferrer";

            button.style.display =
                "flex";

        });

}


/* =========================================================
   AVAILABILITY
   ========================================================= */

function renderAvailability(product) {

    const element =
        document.getElementById(
            "productAvailability"
        );

    if (!element) {
        return;
    }

    element.innerHTML = `

        <span class="pulse-dot"></span>

        PRE-ORDER AVAILABLE

    `;

}


/* =========================================================
   IMAGES
   ========================================================= */

function getProductImages(product) {

    if (
        Array.isArray(product.images)
    ) {

        return product.images
            .map(normalizeImagePath)
            .filter(Boolean);

    }

    if (
        typeof product.image === "string"
    ) {

        return [
            normalizeImagePath(
                product.image
            )
        ];

    }

    if (
        typeof product.thumbnail === "string"
    ) {

        return [
            normalizeImagePath(
                product.thumbnail
            )
        ];

    }

    return [];

}


function normalizeImagePath(image) {

    if (
        typeof image === "object" &&
        image
    ) {

        image =
            image.path ||
            image.src ||
            image.url ||
            image.name ||
            "";

    }

    if (!image) {
        return "";
    }

    image =
        String(image).trim();

    if (
        /^https?:\/\//i.test(image)
    ) {

        return image;

    }

    if (
        image.startsWith("assets/")
    ) {

        return image;

    }

    if (
        image.startsWith("./assets/")
    ) {

        return image.substring(2);

    }

    if (
        !image.includes("/")
    ) {

        return (
            "assets/images/" +
            image
        );

    }

    return image;

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

        <section class="acrylic-panel product-error">

            <span class="section-kicker">
                VOLTICA STORE
            </span>

            <h1>
                PRODUCT NOT FOUND
            </h1>

            <p>
                This product could not be found
                in the current collection.
            </p>

            <a
                href="store.html"
                class="back-store-button"
            >
                RETURN TO STORE
            </a>

        </section>

    `;

}


/* =========================================================
   PRICE
   ========================================================= */

function formatPrice(value) {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {

        return "—";

    }

    const number =
        Number(value);

    if (
        Number.isNaN(number)
    ) {

        return String(value);

    }

    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    ).format(number);

}


/* =========================================================
   TEXT
   ========================================================= */

function setText(id, value) {

    const element =
        document.getElementById(id);

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

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   PUBLIC API
   ========================================================= */

window.VolticaProductView = {

    reload() {

        initializeProductView();

    },

    getCurrentProduct() {

        return getProductFromURL();

    },

    getProductImages,

    formatPrice,

    parseFeature

};


/* =========================================================
   ONLINE
   ========================================================= */

console.log(
    "VOLTICA PRODUCT VIEW — ONLINE"
);
