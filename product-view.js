/* =========================================================
   VOLTICA STORE — PRODUCT VIEW.JS
   Complete Product Detail Engine
   ========================================================= */

"use strict";


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
            "VOLTICA: products.js was not loaded."
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
        product.category ||
        "TECHNOLOGY"
    );


    /*
     * IMPORTANT:
     * Your HTML uses productName,
     * not productTitle.
     */

    setText(
        "productName",
        product.name ||
        "Voltica Product"
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


    /*
     * BADGE
     */

    setText(
        "productBadge",
        product.badge ||
        "PREMIUM"
    );


    /*
     * REFERENCE PRICE
     */

    renderReferencePrice(
        product
    );


    /*
     * MAIN IMAGE
     */

    renderMainImage(
        product
    );


    /*
     * THUMBNAILS
     */

    renderThumbnails(
        product
    );


    /*
     * DESCRIPTION
     */

    renderDescription(
        product
    );


    /*
     * FEATURES
     */

    renderFeatures(
        product
    );


    /*
     * SPECIFICATIONS
     */

    renderSpecifications(
        product
    );


    /*
     * OPTIONS
     */

    renderOptions(
        product
    );


    /*
     * AVAILABILITY
     */

    renderAvailability(
        product
    );


    /*
     * STRIPE
     */

    setupStripeButton(
        product
    );


    /*
     * FINAL CTA
     */

    setText(
        "finalProductName",
        product.name ||
        "DISCOVER THE FUTURE."
    );


    /*
     * PAGE TITLE
     */

    document.title =
        `${product.name || "Product"} — Voltica Store`;

}


/* =========================================================
   IMAGE SYSTEM
   ========================================================= */

function getProductImages(product) {

    /*
     * STANDARD DATABASE FORMAT
     *
     * images: [
     *   "assets/images/xxx-1.webp",
     *   ...
     * ]
     */

    if (
        Array.isArray(
            product.images
        )
    ) {

        const images =
            product.images
                .map(
                    image =>
                        normalizeImagePath(
                            image
                        )
                )
                .filter(Boolean);


        if (
            images.length
        ) {

            return images;

        }

    }


    /*
     * SINGLE IMAGE
     */

    if (
        product.image
    ) {

        return [
            normalizeImagePath(
                product.image
            )
        ];

    }


    /*
     * THUMBNAIL
     */

    if (
        product.thumbnail
    ) {

        return [
            normalizeImagePath(
                product.thumbnail
            )
        ];

    }


    /*
     * G451 FALLBACK
     *
     * This guarantees the correct
     * image paths for the G451 product.
     *
     * g451-1.webp
     * g451-2.webp
     * g451-3.webp
     * g451-4.webp
     * g451-6.webp
     * g451-7.webp
     */

    if (
        String(
            product.id
        ).toLowerCase() ===
        "g451"
    ) {

        return [

            "assets/images/g451-1.webp",

            "assets/images/g451-2.webp",

            "assets/images/g451-3.webp",

            "assets/images/g451-4.webp",

            "assets/images/g451-6.webp",

            "assets/images/g451-7.webp"

        ];

    }


    return [];

}


/* =========================================================
   NORMALIZE IMAGE PATH
   ========================================================= */

function normalizeImagePath(
    image
) {

    if (
        !image
    ) {

        return "";

    }


    /*
     * Already a normal URL/path.
     */

    if (
        typeof image ===
        "string"
    ) {

        /*
         * Full URL
         */

        if (
            image.startsWith(
                "http://"
            ) ||
            image.startsWith(
                "https://"
            ) ||
            image.startsWith(
                "data:"
            )
        ) {

            return image;

        }


        /*
         * Correct assets path
         */

        if (
            image.startsWith(
                "assets/"
            )
        ) {

            return image;

        }


        /*
         * If database only contains
         * filename, put it in assets/images.
         */

        return (
            "assets/images/" +
            image
                .split("/")
                .pop()
        );

    }


    /*
     * Object image format
     */

    if (
        typeof image ===
        "object"
    ) {

        if (
            typeof image.path ===
            "string"
        ) {

            return normalizeImagePath(
                image.path
            );

        }


        if (
            typeof image.url ===
            "string"
        ) {

            return normalizeImagePath(
                image.url
            );

        }


        if (
            typeof image.name ===
            "string"
        ) {

            return normalizeImagePath(
                image.name
            );

        }

    }


    return "";

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


    if (
        !mainImage
    ) {

        return;

    }


    const images =
        getProductImages(
            product
        );


    if (
        !images.length
    ) {

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


    mainImage.dataset.imageIndex =
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


    if (
        !images.length
    ) {

        return;

    }


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


            button.dataset.image =
                image;


            button.dataset.index =
                index;


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


    if (
        !mainImage
    ) {

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


    if (
        thumbnail
    ) {

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


    if (
        !mainImage
    ) {

        return;

    }


    mainImage.addEventListener(
        "click",
        () => {

            if (
                mainImage.src
            ) {

                openLightbox(
                    mainImage.src
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


    if (
        !lightbox
    ) {

        return;

    }


    const closeButton =
        lightbox.querySelector(
            ".lightbox-close"
        );


    if (
        closeButton
    ) {

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


    if (
        !lightbox
    ) {

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


    const paragraphs =
        String(
            description
        )
        .split(
            /\n\s*\n/
        )
        .filter(Boolean);


    container.innerHTML =
        paragraphs
            .map(
                paragraph =>
                    `
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
        !features.length
    ) {

        container.innerHTML = `

            <div class="feature-card">

                <span class="pulse-dot"></span>

                <h3>
                    PREMIUM TECHNOLOGY
                </h3>

                <p>
                    Selected for the
                    Voltica collection.
                </p>

            </div>

            <div class="feature-card">

                <span class="pulse-dot"></span>

                <h3>
                    MODERN DESIGN
                </h3>

                <p>
                    Designed for everyday
                    technology.
                </p>

            </div>

        `;

        return;

    }


    features.forEach(
        (
            feature,
            index
        ) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "feature-card";


            const title =
                typeof feature ===
                "object"
                    ? (
                        feature.title ||
                        feature.name ||
                        `FEATURE ${index + 1}`
                    )
                    : `FEATURE ${index + 1}`;


            const text =
                typeof feature ===
                "object"
                    ? (
                        feature.description ||
                        feature.value ||
                        feature.text ||
                        ""
                    )
                    : feature;


            card.innerHTML = `

                <span class="pulse-dot"></span>

                <h3>
                    ${escapeHTML(
                        title
                    )}
                </h3>

                <p>
                    ${escapeHTML(
                        text
                    )}
                </p>

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


    const specifications =
        product.specifications ||
        product.specs ||
        {};


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


                if (
                    !label
                ) {

                    return;

                }


                addSpecificationRow(
                    container,
                    label,
                    specification.value ??
                    specification.description ??
                    ""
                );

            }
        );

        return;

    }


    Object.entries(
        specifications
    ).forEach(
        (
            [
                label,
                value
            ]
        ) => {

            addSpecificationRow(
                container,
                label,
                value
            );

        }
    );

}


/* =========================================================
   SPECIFICATION ROW
   ========================================================= */

function addSpecificationRow(
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


        <strong class="specification-value">

            ${escapeHTML(
                value
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
        !variants.length
    ) {

        container.innerHTML = `

            <div class="option-empty">

                <span class="pulse-dot"></span>

                <p>
                    Standard configuration
                </p>

            </div>

        `;

        return;

    }


    const heading =
        document.createElement(
            "div"
        );


    heading.className =
        "option-heading";


    heading.textContent =
        "SELECT OPTION";


    container.appendChild(
        heading
    );


    const options =
        document.createElement(
            "div"
        );


    options.className =
        "product-option-list";


    variants.forEach(
        (
            variant,
            index
        ) => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "product-option";


            const name =
                typeof variant ===
                "string"
                    ? variant
                    : (
                        variant.name ||
                        variant.color ||
                        variant.label ||
                        `OPTION ${index + 1}`
                    );


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

                    options
                        .querySelectorAll(
                            ".product-option"
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

                }
            );


            options.appendChild(
                button
            );

        }
    );


    container.appendChild(
        options
    );

}


/* =========================================================
   VARIANTS
   ========================================================= */

function initializeVariants(
    product
) {

    /*
     * Compatibility with older HTML.
     */

    const container =
        document.getElementById(
            "colorOptions"
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


    variants.forEach(
        (
            variant,
            index
        ) => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "color-option";


            const name =
                typeof variant ===
                "string"
                    ? variant
                    : (
                        variant.name ||
                        variant.color ||
                        `Option ${index + 1}`
                    );


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

                }
            );


            container.appendChild(
                button
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

        <span>
            ${escapeHTML(
                availability
            )}
        </span>

    `;

}


/* =========================================================
   STRIPE BUTTON
   ========================================================= */

function setupStripeButton(
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

            if (
                !button
            ) {

                return;

            }


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


            button.style.display =
                "flex";

        }
    );

}


/* =========================================================
   REFERENCE PRICE
   ========================================================= */

function renderReferencePrice(
    product
) {

    const reference =
        document.getElementById(
            "referencePrice"
        );


    if (
        !reference
    ) {

        return;

    }


    if (
        product.referencePrice ===
        undefined ||
        product.referencePrice ===
        null ||
        product.referencePrice ===
        ""
    ) {

        reference.style.display =
            "none";

        return;

    }


    reference.textContent =
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


    if (
        !page
    ) {

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


    const numericPrice =
        Number(
            price
        );


    if (
        Number.isNaN(
            numericPrice
        )
    ) {

        return String(
            price
        );

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
        numericPrice
    );

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


    if (
        !element
    ) {

        return;

    }


    element.textContent =
        value ?? "";

}


/* =========================================================
   HTML ESCAPE
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

    },


    getProductImages

};


/* =========================================================
   READY
   ========================================================= */

console.log(
    "VOLTICA PRODUCT VIEW ENGINE — ONLINE"
);
