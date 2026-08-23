/* =========================================================
   VOLTICA STORE — PRODUCT-VIEW.JS
   Product Detail Engine
   ========================================================= */

"use strict";


/* =========================================================
   CONFIGURATION
   ========================================================= */

const VOLTICA_PRODUCT_IMAGE_ROOT =
    "assets/images/";


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


    renderProduct(
        product
    );


    initializeGallery(
        product
    );


    initializeVariants(
        product
    );


    initializePurchaseButtons(
        product
    );


    document.title =
        `${product.name || "Product"} — Voltica Store`;

}


/* =========================================================
   GET PRODUCT ID
   ========================================================= */

function getProductIdFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    return params.get(
        "id"
    );

}


/* =========================================================
   FIND PRODUCT
   ========================================================= */

function getProductFromURL() {

    const productId =
        getProductIdFromURL();


    if (
        !productId
    ) {

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

function renderProduct(
    product
) {

    setText(
        "productCategory",
        product.category ||
        "VOLTICA COLLECTION"
    );


    setText(
        "productName",
        product.name ||
        "VOLTICA PRODUCT"
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
        "productCurrency",
        product.currency ||
        "USD"
    );


    setText(
        "productBadge",
        product.badge ||
        "PREMIUM"
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


    renderReferencePrice(
        product
    );


    setText(
        "finalProductName",
        product.name ||
        "DISCOVER THE FUTURE."
    );


    renderAvailability(
        product
    );

}


/* =========================================================
   IMAGES
   ========================================================= */

function getProductImages(
    product
) {

    if (
        !product
    ) {

        return [];

    }


    let images = [];


    if (
        Array.isArray(
            product.images
        )
    ) {

        images =
            product.images
                .map(
                    image =>
                        typeof image === "string"
                            ? image
                            : image?.path ||
                              image?.src ||
                              image?.url ||
                              image?.name ||
                              ""
                )
                .filter(Boolean);

    }


    if (
        images.length === 0 &&
        product.image
    ) {

        images = [
            product.image
        ];

    }


    return images.map(
        normalizeImagePath
    );

}


/* =========================================================
   IMAGE PATH
   ========================================================= */

function normalizeImagePath(
    image
) {

    if (
        !image
    ) {

        return "";

    }


    let path =
        String(image).trim();


    if (
        path.startsWith(
            "http://"
        ) ||
        path.startsWith(
            "https://"
        ) ||
        path.startsWith(
            "data:"
        )
    ) {

        return path;

    }


    path =
        path.replace(
            /^\.?\//,
            ""
        );


    if (
        path.startsWith(
            "assets/images/"
        )
    ) {

        return path;

    }


    if (
        path.startsWith(
            "assets/"
        )
    ) {

        return path;

    }


    if (
        path.startsWith(
            "images/"
        )
    ) {

        return `assets/${path}`;

    }


    return (
        VOLTICA_PRODUCT_IMAGE_ROOT +
        path
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


    if (
        !image
    ) {

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


    image.dataset.index =
        "0";

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


    if (
        !container
    ) {

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


            button.dataset.index =
                index;


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
                        index
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
    index
) {

    const mainImage =
        document.getElementById(
            "mainProductImage"
        );


    if (
        !mainImage
    ) {

        return;

    }


    mainImage.src =
        image;


    mainImage.dataset.index =
        String(index);


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


    const active =
        document.querySelector(
            `.product-thumbnail[data-index="${index}"]`
        );


    active?.classList.add(
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


    if (
        !image
    ) {

        return;

    }


    image.addEventListener(
        "click",
        () => {

            openImageViewer(
                image.src
            );

        }
    );

}


/* =========================================================
   SIMPLE MOBILE LIGHTBOX
   ========================================================= */

function openImageViewer(
    imageSource
) {

    if (
        !imageSource
    ) {

        return;

    }


    const viewer =
        document.createElement(
            "div"
        );


    viewer.className =
        "voltica-image-viewer";


    viewer.innerHTML = `

        <button
            type="button"
            class="voltica-image-viewer-close"
            aria-label="Close image"
        >
            ×
        </button>


        <img
            src="${escapeAttribute(imageSource)}"
            alt="Voltica product"
        >

    `;


    viewer
        .querySelector(
            ".voltica-image-viewer-close"
        )
        ?.addEventListener(
            "click",
            () => {

                viewer.remove();

                document.body.style.overflow =
                    "";

            }
        );


    viewer.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                viewer
            ) {

                viewer.remove();

                document.body.style.overflow =
                    "";

            }

        }
    );


    document.body.appendChild(
        viewer
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


    if (
        !container
    ) {

        return;

    }


    const description =
        product.longDescription ||
        product.description ||
        product.shortDescription ||
        "";


    if (
        !description
    ) {

        container.innerHTML = `
            <p>
                Premium technology selected by Voltica.
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


    const paragraphs =
        String(
            description
        )
        .split(
            /\n\s*\n/
        )
        .filter(
            Boolean
        );


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

function renderFeatures(
    product
) {

    const container =
        document.getElementById(
            "productFeatures"
        );


    if (
        !container
    ) {

        return;

    }


    const features =
        product.features ||
        product.keyFeatures ||
        product.highlights ||
        [];


    container.innerHTML =
        "";


    if (
        !Array.isArray(
            features
        ) ||
        features.length === 0
    ) {

        return;

    }


    features.forEach(
        (
            feature,
            index
        ) => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "feature-card";


            const title =
                typeof feature === "string"
                    ? feature
                    : feature.title ||
                      feature.name ||
                      `FEATURE ${index + 1}`;


            const description =
                typeof feature === "string"
                    ? ""
                    : feature.description ||
                      feature.text ||
                      "";


            card.innerHTML = `

                <span class="feature-number">
                    ${String(
                        index + 1
                    ).padStart(
                        2,
                        "0"
                    )}
                </span>


                <h3>
                    ${escapeHTML(
                        title
                    )}
                </h3>


                ${
                    description
                        ? `
                            <p>
                                ${escapeHTML(
                                    description
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


    if (
        !container
    ) {

        return;

    }


    container.innerHTML =
        "";


    const specs =
        product.specifications ||
        product.specs ||
        {};


    if (
        Array.isArray(
            specs
        )
    ) {

        specs.forEach(
            spec => {

                if (
                    !spec
                ) {

                    return;

                }


                const label =
                    spec.label ||
                    spec.name;


                if (
                    !label
                ) {

                    return;

                }


                addSpecification(
                    container,
                    label,
                    spec.value
                );

            }
        );

        return;

    }


    if (
        typeof specs !==
        "object"
    ) {

        return;

    }


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
            ${escapeHTML(
                label
            )}
        </span>


        <strong>
            ${escapeHTML(
                Array.isArray(value)
                    ? value.join(", ")
                    : value ?? "—"
            )}
        </strong>

    `;


    container.appendChild(
        row
    );

}


/* =========================================================
   OPTIONS
   ========================================================= */

function renderOptions(
    product
) {

    const container =
        document.getElementById(
            "productOptions"
        );


    if (
        !container
    ) {

        return;

    }


    const variants =
        product.variants ||
        product.colors ||
        [];


    container.innerHTML =
        "";


    if (
        !Array.isArray(
            variants
        ) ||
        variants.length === 0
    ) {

        container.innerHTML = `

            <div class="option-empty">

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
                typeof variant === "string"
                    ? variant
                    : variant.name ||
                      variant.color ||
                      `OPTION ${index + 1}`;


            const option =
                document.createElement(
                    "button"
                );


            option.type =
                "button";


            option.className =
                "product-option";


            if (
                index === 0
            ) {

                option.classList.add(
                    "active"
                );

            }


            option.textContent =
                name;


            option.dataset.value =
                name;


            option.addEventListener(
                "click",
                () => {

                    container
                        .querySelectorAll(
                            ".product-option"
                        )
                        .forEach(
                            element => {

                                element.classList.remove(
                                    "active"
                                );

                            }
                        );


                    option.classList.add(
                        "active"
                    );


                    window.VolticaSelectedVariant =
                        name;

                }
            );


            container.appendChild(
                option
            );

        }
    );


    window.VolticaSelectedVariant =
        typeof variants[0] === "string"
            ? variants[0]
            : variants[0]?.name ||
              variants[0]?.color ||
              "";

}


/* =========================================================
   REFERENCE PRICE
   ========================================================= */

function renderReferencePrice(
    product
) {

    const possibleElements = [

        "referencePrice",

        "productReferencePrice"

    ];


    const value =
        product.referencePrice;


    possibleElements.forEach(
        id => {

            const element =
                document.getElementById(
                    id
                );


            if (
                !element
            ) {

                return;

            }


            if (
                value === undefined ||
                value === null ||
                value === ""
            ) {

                element.style.display =
                    "none";

                return;

            }


            element.textContent =
                `Reference price: ${formatPrice(
                    value
                )}`;

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


    if (
        !element
    ) {

        return;

    }


    const availability =
        product.availability ||
        product.stockStatus ||
        "AVAILABLE";


    element.innerHTML = `

        <span class="pulse-dot"></span>

        <strong>
            ${escapeHTML(
                availability
            )}
        </strong>

    `;

}


/* =========================================================
   PURCHASE BUTTONS
   ========================================================= */

function initializePurchaseButtons(
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
        ),

        document.getElementById(
            "buyNowButton"
        )

    ].filter(Boolean);


    buttons.forEach(
        button => {

            if (
                !stripeLink
            ) {

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


            button.addEventListener(
                "click",
                () => {

                    savePurchaseIntent(
                        product
                    );

                }
            );

        }
    );

}


/* =========================================================
   PURCHASE INTENT
   ========================================================= */

function savePurchaseIntent(
    product
) {

    try {

        localStorage.setItem(
            "voltica_last_product",
            JSON.stringify({

                id:
                    product.id,

                name:
                    product.name,

                variant:
                    window.VolticaSelectedVariant ||
                    null,

                timestamp:
                    Date.now()

            })
        );

    } catch {

        /* Storage unavailable */

    }

}


/* =========================================================
   ERROR
   ========================================================= */

function showProductError() {

    const page =
        document.getElementById(
            "productPage"
        ) ||
        document.querySelector(
            ".product-page"
        );


    if (
        !page
    ) {

        return;

    }


    page.innerHTML = `

        <div class="product-error">

            <span class="pulse-dot"></span>

            <span>
                VOLTICA STORE
            </span>


            <h1>
                PRODUCT NOT FOUND
            </h1>


            <p>
                This product could not be
                located in the Voltica collection.
            </p>


            <a
                href="store.html"
                class="back-store-button"
            >
                ← RETURN TO STORE
            </a>

        </div>

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


    if (
        !element
    ) {

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

    },


    getProductImages,

    formatPrice

};


/* =========================================================
   READY
   ========================================================= */

console.log(
    "VOLTICA PRODUCT VIEW ENGINE — ONLINE"
);
