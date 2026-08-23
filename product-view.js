/* =========================================================
   VOLTICA STORE — PRODUCT-VIEW.JS
   Product Detail Engine
   ========================================================= */

"use strict";


/* =========================================================
   INIT
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeProductView
);


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

    const id =
        getProductIdFromURL();


    if (!id) {

        return null;

    }


    if (
        !Array.isArray(
            window.volticaProducts
        )
    ) {

        return null;

    }


    return window.volticaProducts.find(
        product =>
            String(product.id) ===
            String(id)
    ) || null;

}


/* =========================================================
   RENDER PRODUCT
   ========================================================= */

function renderProduct(product) {

    setText(
        "productName",
        product.name ||
        "VOLTICA PRODUCT"
    );


    setText(
        "finalProductName",
        product.name ||
        "DISCOVER THE FUTURE."
    );


    setText(
        "productCategory",
        product.category ||
        "TECHNOLOGY"
    );


    setText(
        "productShortDescription",
        product.shortDescription ||
        product.description ||
        ""
    );


    setText(
        "productPrice",
        formatPrice(
            product.price
        )
    );


    setText(
        "productBadge",
        product.badge ||
        "VOLTICA"
    );


    setText(
        "productCurrency",
        product.currency ||
        "USD"
    );


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


    renderOptions(
        product
    );


    renderAvailability(
        product
    );


    setupStripeButtons(
        product
    );


    document.title =
        `${product.name || "Product"} — Voltica Store`;

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
                normalizeImagePath
            )
            .filter(Boolean);

    }


    if (
        product.image
    ) {

        return [
            normalizeImagePath(
                product.image
            )
        ];

    }


    return [];

}


/* =========================================================
   IMAGE PATH
   ========================================================= */

function normalizeImagePath(
    image
) {

    if (
        typeof image !==
        "string"
    ) {

        return "";

    }


    const value =
        image.trim();


    if (!value) {

        return "";

    }


    /*
     * Full URL
     */

    if (
        /^https?:\/\//i.test(
            value
        )
    ) {

        return value;

    }


    /*
     * Root path
     */

    if (
        value.startsWith("/")
    ) {

        return value;

    }


    /*
     * Already correct
     */

    if (
        value.startsWith(
            "assets/"
        )
    ) {

        return value;

    }


    /*
     * Filename only
     */

    return (
        "assets/images/" +
        value
    );

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


    if (
        images.length === 0
    ) {

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


    container.innerHTML = "";


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


            const thumbnail =
                document.createElement(
                    "img"
                );


            thumbnail.src =
                image;


            thumbnail.alt =
                `${product.name || "Product"} ${index + 1}`;


            thumbnail.loading =
                "lazy";


            button.appendChild(
                thumbnail
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

    const image =
        document.getElementById(
            "mainProductImage"
        );


    if (!image) {

        return;

    }


    image.addEventListener(
        "click",
        () => {

            if (
                image.src
            ) {

                openLightbox(
                    image.src
                );

            }

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


    const close =
        lightbox.querySelector(
            ".lightbox-close"
        );


    close?.addEventListener(
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

function renderFeatures(
    product
) {

    const container =
        document.getElementById(
            "productFeatures"
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
        !Array.isArray(
            features
        ) ||
        features.length === 0
    ) {

        container.innerHTML = `

            <div class="feature-card">

                <h3>
                    VOLTICA SELECTION
                </h3>

                <p>
                    Premium technology selected
                    for modern everyday life.
                </p>

            </div>

        `;

        return;

    }


    features.forEach(
        feature => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "feature-card";


            const title =
                typeof feature ===
                "string"
                    ? feature
                    : feature.title ||
                      feature.name ||
                      "FEATURE";


            const text =
                typeof feature ===
                "string"
                    ? ""
                    : feature.description ||
                      feature.text ||
                      "";


            card.innerHTML = `

                <span class="pulse-dot"></span>

                <h3>
                    ${escapeHTML(title)}
                </h3>

                ${
                    text
                        ? `
                            <p>
                                ${escapeHTML(text)}
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
   SPECIFICATIONS
   ========================================================= */

function renderSpecifications(
    product
) {

    const container =
        document.getElementById(
            "productSpecifications"
        );


    if (!container) {

        return;

    }


    const specs =
        product.specifications ||
        product.specs ||
        {};


    container.innerHTML = "";


    if (
        Array.isArray(
            specs
        )
    ) {

        specs.forEach(
            spec => {

                if (
                    !spec ||
                    !spec.label
                ) {

                    return;

                }


                addSpecification(
                    container,
                    spec.label,
                    spec.value
                );

            }
        );

    } else {

        Object.entries(
            specs
        ).forEach(
            (
                [
                    label,
                    value
                ]
            ) => {

                addSpecification(
                    container,
                    label,
                    value
                );

            }
        );

    }


    if (
        !container.children.length
    ) {

        container.innerHTML = `

            <div class="specification-row">

                <span>
                    Product
                </span>

                <strong>
                    ${escapeHTML(
                        product.name ||
                        "Voltica"
                    )}
                </strong>

            </div>

        `;

    }

}


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


/* =========================================================
   OPTIONS / VARIANTS
   ========================================================= */

function initializeVariants(
    product
) {

    renderOptions(
        product
    );

}


function renderOptions(
    product
) {

    const container =
        document.getElementById(
            "productOptions"
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
        !Array.isArray(
            variants
        ) ||
        variants.length === 0
    ) {

        container.innerHTML = `

            <div class="option-row">

                <span>
                    CONFIGURATION
                </span>

                <strong>
                    STANDARD
                </strong>

            </div>

        `;

        return;

    }


    variants.forEach(
        (
            variant,
            index
        ) => {

            const name =
                typeof variant ===
                "string"
                    ? variant
                    : variant.name ||
                      variant.color ||
                      `OPTION ${index + 1}`;


            const row =
                document.createElement(
                    "button"
                );


            row.type =
                "button";


            row.className =
                "product-option";


            if (
                index === 0
            ) {

                row.classList.add(
                    "active"
                );

            }


            row.textContent =
                name;


            row.addEventListener(
                "click",
                () => {

                    container
                        .querySelectorAll(
                            ".product-option"
                        )
                        .forEach(
                            option =>
                                option.classList.remove(
                                    "active"
                                )
                        );


                    row.classList.add(
                        "active"
                    );

                }
            );


            container.appendChild(
                row
            );

        }
    );

}


/* =========================================================
   AVAILABILITY
   ========================================================= */

function renderAvailability(
    product
) {

    const element =
        document.getElementById(
            "productAvailability"
        );


    if (!element) {

        return;

    }


    const availability =
        product.availability ||
        product.stockStatus ||
        "AVAILABLE";


    element.innerHTML = `

        <span class="pulse-dot"></span>

        <span>
            ${escapeHTML(
                availability
            )}
        </span>

    `;

}


/* =========================================================
   STRIPE
   ========================================================= */

function setupStripeButtons(
    product
) {

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

    ];


    buttons.forEach(
        button => {

            if (!button) {

                return;

            }


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

        <section class="product-error">

            <span class="pulse-dot"></span>

            <h1>
                PRODUCT NOT FOUND
            </h1>

            <p>
                This Voltica product could not
                be found in the current collection.
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

function formatPrice(
    value
) {

    const number =
        Number(value);


    if (
        !Number.isFinite(
            number
        )
    ) {

        return "—";

    }


    return new Intl.NumberFormat(
        "en-US",
        {
            style:
                "currency",

            currency:
                "USD",

            minimumFractionDigits:
                2,

            maximumFractionDigits:
                2
        }
    ).format(
        number
    );

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
   SECURITY
   ========================================================= */

function escapeHTML(
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


/* =========================================================
   READY
   ========================================================= */

console.log(
    "VOLTICA PRODUCT VIEW — ONLINE"
);
