/* =========================================================
   VOLTICA STORE — PRODUCT VIEW.JS
   Universal Product Detail Engine
   Compatible with admin localStorage + products.js
   ========================================================= */

"use strict";


/* =========================================================
   CONFIGURATION
   ========================================================= */

const VOLTICA_STORAGE_KEY =
    "voltica_products_admin";


/* =========================================================
   START
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
   LOAD PRODUCT DATABASE
   ========================================================= */

function getProductDatabase() {

    /*
     * FIRST:
     * Try the admin database used by store.js
     */

    try {

        const saved =
            localStorage.getItem(
                VOLTICA_STORAGE_KEY
            );


        if (saved) {

            const parsed =
                JSON.parse(
                    saved
                );


            if (
                Array.isArray(parsed)
            ) {

                return parsed.filter(
                    product =>
                        product &&
                        product.active !== false
                );

            }

        }

    } catch (error) {

        console.warn(
            "VOLTICA: Local product database unavailable.",
            error
        );

    }


    /*
     * SECOND:
     * Fallback to products.js
     */

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

function getProductFromURL() {

    const productId =
        getProductIdFromURL();


    if (!productId) {

        return null;

    }


    const database =
        getProductDatabase();


    if (!database.length) {

        return null;

    }


    return database.find(
        product =>

            String(
                product.id
            ) ===
            String(
                productId
            )

    ) || null;

}


/* =========================================================
   RENDER PRODUCT
   ========================================================= */

function renderProduct(product) {


    /* CATEGORY */

    setText(
        "productCategory",
        product.category ||
        "TECHNOLOGY"
    );


    /* NAME */

    setText(
        "productName",
        product.name ||
        "Voltica Product"
    );


    /* SHORT DESCRIPTION */

    setText(
        "productShortDescription",
        product.shortDescription ||
        product.description ||
        ""
    );


    /* PRICE */

    setText(
        "productPrice",
        formatPrice(
            product.price
        )
    );


    /* CURRENCY */

    setText(
        "productCurrency",
        product.currency ||
        "USD"
    );


    /* BADGE */

    setText(
        "productBadge",
        product.badge ||
        "PREMIUM"
    );


    /* MAIN IMAGE */

    renderMainImage(
        product
    );


    /* THUMBNAILS */

    renderThumbnails(
        product
    );


    /* DESCRIPTION */

    renderDescription(
        product
    );


    /* FEATURES */

    renderFeatures(
        product
    );


    /* SPECIFICATIONS */

    renderSpecifications(
        product
    );


    /* OPTIONS */

    renderOptions(
        product
    );


    /* AVAILABILITY */

    renderAvailability(
        product
    );


    /* STRIPE */

    setupStripeButtons(
        product
    );


    /* FINAL PRODUCT NAME */

    setText(
        "finalProductName",
        product.name ||
        "DISCOVER THE FUTURE."
    );


    /* PAGE TITLE */

    document.title =
        `${product.name || "Product"} — Voltica Store`;

}


/* =========================================================
   MAIN IMAGE
   ========================================================= */

function renderMainImage(
    product
) {

    const mainImage =
        document.getElementById(
            "mainProductImage"
        );


    if (!mainImage) {

        return;

    }


    const images =
        getProductImages(
            product
        );


    if (!images.length) {

        mainImage.removeAttribute(
            "src"
        );

        mainImage.alt =
            product.name ||
            "Voltica Product";

        return;

    }


    mainImage.src =
        images[0];


    mainImage.alt =
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
        (image, index) => {

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


            button.innerHTML = `

                <img
                    src="${escapeAttribute(image)}"
                    alt="${escapeAttribute(
                        product.name ||
                        "Product"
                    )} ${index + 1}"
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

            openImageViewer(
                mainImage.src
            );

        }
    );

}


/* =========================================================
   IMAGE VIEWER
   ========================================================= */

function openImageViewer(
    image
) {

    if (!image) {

        return;

    }


    let viewer =
        document.getElementById(
            "volticaImageViewer"
        );


    if (!viewer) {

        viewer =
            document.createElement(
                "div"
            );


        viewer.id =
            "volticaImageViewer";


        viewer.innerHTML = `

            <div class="voltica-image-viewer">

                <button
                    type="button"
                    class="voltica-image-close"
                    aria-label="Close image"
                >
                    ×
                </button>

                <img
                    src=""
                    alt="Product image"
                >

            </div>

        `;


        document.body.appendChild(
            viewer
        );


        viewer.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    viewer ||
                    event.target.classList.contains(
                        "voltica-image-close"
                    )
                ) {

                    viewer.classList.remove(
                        "active"
                    );

                    document.body.style.overflow =
                        "";

                }

            }
        );

    }


    const viewerImage =
        viewer.querySelector(
            "img"
        );


    viewerImage.src =
        image;


    viewer.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";

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
        product.longDescription ||
        product.description ||
        product.shortDescription ||
        "";


    if (!description) {

        container.innerHTML = `

            <p>
                Premium technology selected
                for the Voltica collection.
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
        !Array.isArray(features) ||
        features.length === 0
    ) {

        container.innerHTML = `

            <div class="feature-card">

                <span>
                    VOLTICA
                </span>

                <h3>
                    PREMIUM TECHNOLOGY
                </h3>

                <p>
                    Selected for modern lifestyles.
                </p>

            </div>

        `;

        return;

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

                <span>
                    0${index + 1}
                </span>

                <h3>
                    ${escapeHTML(
                        typeof feature === "string"
                            ? feature
                            : feature.title ||
                              feature.name ||
                              "FEATURE"
                    )}
                </h3>

                ${
                    typeof feature === "object" &&
                    feature.description
                        ? `
                            <p>
                                ${escapeHTML(
                                    feature.description
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


    const specifications =
        product.specifications ||
        product.specs ||
        {};


    container.innerHTML = "";


    if (
        Array.isArray(
            specifications
        )
    ) {

        specifications.forEach(
            specification => {

                if (
                    !specification
                ) {

                    return;

                }


                const label =
                    specification.label ||
                    specification.name;


                const value =
                    specification.value;


                if (!label) {

                    return;

                }


                addSpecification(
                    container,
                    label,
                    value
                );

            }
        );

    } else {

        Object.entries(
            specifications
        ).forEach(
            ([label, value]) => {

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
                    PRODUCT
                </span>

                <strong>
                    VOLTICA COLLECTION
                </strong>

            </div>

        `;

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

        <span>
            ${escapeHTML(label)}
        </span>

        <strong>
            ${escapeHTML(
                value ?? "—"
            )}
        </strong>

    `;


    container.appendChild(
        row
    );

}


/* =========================================================
   OPTIONS / COLORS
   ========================================================= */

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
        !Array.isArray(variants) ||
        variants.length === 0
    ) {

        container.innerHTML = `

            <div class="option-empty">

                STANDARD CONFIGURATION

            </div>

        `;

        return;

    }


    variants.forEach(
        (variant, index) => {

            const name =
                typeof variant === "string"
                    ? variant
                    : variant.name ||
                      variant.color ||
                      `Option ${index + 1}`;


            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "product-option";


            button.textContent =
                name;


            if (
                index === 0
            ) {

                button.classList.add(
                    "active"
                );

            }


            button.addEventListener(
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


                    button.classList.add(
                        "active"
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
   VARIANTS
   ========================================================= */

function initializeVariants(
    product
) {

    const variants =
        product.variants ||
        product.colors ||
        [];


    if (
        !Array.isArray(
            variants
        ) ||
        !variants.length
    ) {

        return;

    }


    const first =
        typeof variants[0] === "string"
            ? variants[0]
            : variants[0].name ||
              variants[0].color ||
              "";


    setText(
        "productAvailability",
        first
            ? `AVAILABLE — ${first}`
            : "AVAILABLE"
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


    if (
        product.stock === 0 ||
        product.available === false
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
   STRIPE BUTTONS
   ========================================================= */

function setupStripeButtons(
    product
) {

    const buttons = [

        document.getElementById(
            "stripeButton"
        ),

        document.getElementById(
            "finalStripeButton"
        )

    ];


    const stripeLink =
        product.stripeLink ||
        product.stripe ||
        product.stripeUrl ||
        "";


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

function getProductImages(
    product
) {

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


                    if (
                        image &&
                        typeof image.path ===
                        "string"
                    ) {

                        return image.path;

                    }


                    if (
                        image &&
                        typeof image.name ===
                        "string"
                    ) {

                        return (
                            "assets/images/" +
                            image.name
                        );

                    }


                    return "";

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


/* =========================================================
   PRICE
   ========================================================= */

function formatPrice(
    price
) {

    if (
        price === undefined ||
        price === null ||
        price === ""
    ) {

        return "—";

    }


    const number =
        Number(price);


    if (
        Number.isNaN(number)
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


function escapeAttribute(
    value
) {

    return escapeHTML(
        value
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


console.log(
    "VOLTICA PRODUCT VIEW — ONLINE"
);
