/* =========================================================
   VOLTICA STORE
   PRODUCT VIEW ENGINE
   ========================================================= */

"use strict";


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeProductView
);


function initializeProductView() {

    console.log("VOLTICA PRODUCT VIEW STARTING...");

    const product =
        getProductFromURL();

    if (!product) {

        showProductError();

        return;

    }

    console.log(
        "VOLTICA PRODUCT FOUND:",
        product
    );

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

        console.error(
            "VOLTICA: No product ID in URL."
        );

        return null;

    }


    if (
        !Array.isArray(
            window.volticaProducts
        )
    ) {

        console.error(
            "VOLTICA: products.js is not loaded."
        );

        return null;

    }


    const product =
        window.volticaProducts.find(
            item =>
                String(item.id).trim() ===
                String(productId).trim()
        );


    if (!product) {

        console.error(
            "VOLTICA: Product ID not found:",
            productId
        );

        console.error(
            "Available IDs:",
            window.volticaProducts.map(
                item => item.id
            )
        );

    }


    return product || null;

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
        "productName",
        product.name || "Voltica Product"
    );


    setText(
        "finalProductName",
        product.name || "DISCOVER THE FUTURE."
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


    setText(
        "productCurrency",
        "USD"
    );


    setText(
        "productBadge",
        product.badge || "PREMIUM"
    );


    renderMainImage(product);

    renderThumbnails(product);

    renderDescription(product);

    renderFeatures(product);

    renderSpecifications(product);

    renderOptions(product);

    setupStripeButtons(product);

    renderAvailability(product);

    document.title =
        `${product.name || "Product"} — Voltica Store`;

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


            const img =
                document.createElement(
                    "img"
                );


            img.src =
                image;

            img.alt =
                `${product.name || "Product"} ${index + 1}`;

            img.loading =
                "lazy";


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
   CHANGE IMAGE
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


    const closeButton =
        document.querySelector(
            ".lightbox-close"
        );


    if (!lightbox) {

        return;

    }


    closeButton?.addEventListener(
        "click",
        closeLightbox
    );


    lightbox.addEventListener(
        "click",
        event => {

            if (
                event.target === lightbox
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

        container.innerHTML = `
            <p>
                Premium technology selected
                by Voltica.
            </p>
        `;

        return;

    }


    if (
        /<[a-z][\s\S]*>/i.test(
            description
        )
    ) {

        container.innerHTML =
            description;

        return;

    }


    container.innerHTML =
        String(description)
            .split(/\n\s*\n/)
            .filter(Boolean)
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
            "productFeatures"
        );


    const section =
        document.getElementById(
            "featuresSection"
        );


    if (!container) {

        return;

    }


    const features =
        product.keyFeatures ||
        product.features ||
        product.highlights ||
        [];


    container.innerHTML = "";


    if (
        !Array.isArray(features) ||
        features.length === 0
    ) {

        if (section) {

            section.hidden =
                true;

        }

        return;

    }


    if (section) {

        section.hidden =
            false;

    }


    features.forEach(
        (feature, index) => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "feature-card";


            card.innerHTML = `

                <span class="feature-number">
                    ${String(index + 1).padStart(2, "0")}
                </span>

                <span class="pulse-dot"></span>

                <h3>
                    ${escapeHTML(feature)}
                </h3>

            `;


            container.appendChild(
                card
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
            "productSpecifications"
        );


    const section =
        document.getElementById(
            "specificationsSection"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    const specifications =
        product.specifications ||
        product.specs ||
        {};


    let entries = [];


    if (
        Array.isArray(
            specifications
        )
    ) {

        entries =
            specifications
                .filter(Boolean)
                .map(
                    item => [

                        item.label ||
                        item.name ||
                        "",

                        item.value ||
                        ""

                    ]
                );

    } else if (
        typeof specifications ===
        "object"
    ) {

        entries =
            Object.entries(
                specifications
            );

    }


    entries =
        entries.filter(
            ([label]) =>
                String(label).trim()
        );


    if (entries.length === 0) {

        if (section) {

            section.hidden =
                true;

        }

        return;

    }


    if (section) {

        section.hidden =
            false;

    }


    entries.forEach(
        ([label, value]) => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "specification-row";


            row.innerHTML = `

                <span>
                    ${escapeHTML(label)}
                </span>

                <strong>
                    ${escapeHTML(value)}
                </strong>

            `;


            container.appendChild(
                row
            );

        }
    );

}


/* =========================================================
   OPTIONS
   ========================================================= */

function renderOptions(product) {

    const container =
        document.getElementById(
            "productOptions"
        );


    const section =
        document.getElementById(
            "optionsSection"
        );


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
        colors.length === 0 &&
        variants.length === 0
    ) {

        if (section) {

            section.hidden =
                true;

        }

        return;

    }


    if (section) {

        section.hidden =
            false;

    }


    if (colors.length) {

        const title =
            document.createElement(
                "div"
            );


        title.className =
            "option-title";


        title.textContent =
            "COLOR";


        container.appendChild(
            title
        );


        const colorGroup =
            document.createElement(
                "div"
            );


        colorGroup.className =
            "option-group";


        colors.forEach(
            (color, index) => {

                const button =
                    createOptionButton(
                        color,
                        index === 0
                    );


                colorGroup.appendChild(
                    button
                );

            }
        );


        container.appendChild(
            colorGroup
        );

    }


    if (variants.length) {

        const title =
            document.createElement(
                "div"
            );


        title.className =
            "option-title";


        title.textContent =
            "VARIANT";


        container.appendChild(
            title
        );


        const variantGroup =
            document.createElement(
                "div"
            );


        variantGroup.className =
            "option-group";


        variants.forEach(
            (variant, index) => {

                const name =
                    typeof variant === "string"
                        ? variant
                        : variant.name ||
                          variant.color ||
                          `Option ${index + 1}`;


                const button =
                    createOptionButton(
                        name,
                        index === 0
                    );


                variantGroup.appendChild(
                    button
                );

            }
        );


        container.appendChild(
            variantGroup
        );

    }

}


function createOptionButton(
    name,
    active
) {

    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";


    button.className =
        "product-option-button";


    if (active) {

        button.classList.add(
            "active"
        );

    }


    button.textContent =
        name;


    button.addEventListener(
        "click",
        () => {

            button
                .parentElement
                ?.querySelectorAll(
                    ".product-option-button"
                )
                .forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


            button.classList.add(
                "active"
            );

        }
    );


    return button;

}


/* =========================================================
   VARIANTS — HERO
   ========================================================= */

function initializeVariants(product) {

    const container =
        document.getElementById(
            "productVariants"
        );


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


    const options = [
        ...colors,
        ...variants
    ];


    if (!options.length) {

        return;

    }


    options.forEach(
        (option, index) => {

            const name =
                typeof option === "string"
                    ? option
                    : option.name ||
                      option.color ||
                      `Option ${index + 1}`;


            const button =
                createOptionButton(
                    name,
                    index === 0
                );


            container.appendChild(
                button
            );

        }
    );

}


/* =========================================================
   STRIPE
   ========================================================= */

function setupStripeButtons(product) {

    const stripeLink =
        product.stripeLink ||
        product.stripe ||
        product.stripeUrl ||
        "";


    const buttons = [

        document.getElementById(
            "stripeButton"
        ),

        document.getElementById(
            "finalStripeButton"
        )

    ].filter(Boolean);


    buttons.forEach(
        button => {

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
    );

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


    if (
        product.active === false
    ) {

        element.innerHTML = `
            <span class="pulse-dot"></span>
            CURRENTLY UNAVAILABLE
        `;

        return;

    }


    element.innerHTML = `
        <span class="pulse-dot"></span>
        AVAILABLE — READY TO ORDER
    `;

}


/* =========================================================
   IMAGES
   ========================================================= */

function getProductImages(product) {

    if (
        Array.isArray(
            product.images
        )
    ) {

        return product.images
            .map(
                image => {

                    if (
                        typeof image ===
                        "string"
                    ) {

                        return image;

                    }


                    return image?.path ||
                           "";

                }
            )
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

    const number =
        Number(price);


    if (
        Number.isNaN(number)
    ) {

        return "—";

    }


    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2
        }
    ).format(number);

}


/* =========================================================
   TEXT
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
   ESCAPE
   ========================================================= */

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


/* =========================================================
   ERROR
   ========================================================= */

function showProductError() {

    const page =
        document.getElementById(
            "productPage"
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
   PUBLIC API
   ========================================================= */

window.VolticaProductView = {

    reload() {

        initializeProductView();

    },

    getCurrentProduct() {

        return getProductFromURL();

    }

};
