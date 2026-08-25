/* =========================================================
   VOLTICA STORE
   ANKER SOUNDCORE SPACE Q45
   HARD-CODED PRODUCT PAGE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       PRODUCT DATA
       ===================================================== */

    const product = {

        name:
            "Anker Soundcore Space Q45",

        category:
            "PREMIUM AUDIO",

        badge:
            "FEATURED",

        price:
            189.99,

        referencePrice:
            null,

        currency:
            "USD",

        shortDescription:
            "Industry-leading adaptive active noise cancellation, Hi-Res wireless audio with LDAC, and up to 50 hours of battery life.",

        description:
            "Experience industry-leading adaptive active noise cancellation, stunning Hi-Res wireless audio powered by LDAC, and an exceptional 50-hour battery life. Hand-picked and curated by Voltica Store for ultimate comfort and premium sound performance.",

        features: [

            {
                title:
                    "Adaptive Active Noise Cancellation",

                description:
                    "Industry-leading adaptive ANC intelligently reduces surrounding noise for a more immersive listening experience."
            },

            {
                title:
                    "Hi-Res Wireless Audio",

                description:
                    "Enjoy detailed wireless sound with LDAC support and customized 40mm double-layer diaphragm drivers."
            },

            {
                title:
                    "50-Hour Battery Life",

                description:
                    "Enjoy up to 50 hours of playback with ANC enabled and up to 65 hours with ANC disabled."
            },

            {
                title:
                    "Fast Charging",

                description:
                    "A quick 5-minute charge provides up to 4 hours of listening time."
            },

            {
                title:
                    "Multipoint Connection",

                description:
                    "Connect to multiple devices and move seamlessly between your everyday devices."
            },

            {
                title:
                    "Customizable Sound & Transparency",

                description:
                    "Tailor your audio profile using the Soundcore app's 8-band EQ and switch seamlessly between transparency modes to stay connected to the world around you."
            }

        ],

        specifications: {

            "Bluetooth Version":
                "Bluetooth 5.3",

            "Audio Codecs":
                "LDAC, AAC, SBC",

            "Playtime":
                "Up to 50 hours (ANC on) / Up to 65 hours (ANC off)",

            "Fast Charging":
                "5 minutes charge for 4 hours of playtime",

            "Driver Size":
                "40mm customized double-layer diaphragm drivers",

            "Frequency Response":
                "20Hz - 40kHz (Hi-Res Wired & Wireless)",

            "Connectivity Range":
                "Up to 15 meters / 50 feet",

            "Connection":
                "Multipoint connection supported",

            "Charging Port":
                "USB Type-C",

            "Weight":
                "292 g"

        },

        colors: [],

        variants: [],

        stripeLink:
            "https://buy.stripe.com/eVqeVe2hNgILbyoaWK2Ji0j",

        supplierLink:
            "https://www.cjdropshipping.com/product/-p-2601110810071616400.html",

        availability:
            "PRE-ORDER AVAILABLE"

    };


    /* =====================================================
       PRODUCT IMAGES
       ===================================================== */

    /*
       IMPORTANT:
       These filenames must correspond to the actual images
       placed inside assets/images/.
    */

    const productImages = [

        "assets/images/q45-1.webp",
        "assets/images/q45-2.webp",
        "assets/images/q45-3.webp",
        "assets/images/q45-4.webp",
        "assets/images/q45-5.webp",
        "assets/images/q45-6.webp"

    ];


    /* =====================================================
       DOM
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

    const status =
        document.getElementById(
            "productStatus"
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

    const variants =
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


    /* =====================================================
       BASIC PRODUCT INFORMATION
       ===================================================== */

    if (category) {

        category.textContent =
            product.category;

    }


    if (badge) {

        badge.textContent =
            product.badge;

    }


    if (name) {

        name.textContent =
            product.name;

    }


    if (finalProductName) {

        finalProductName.textContent =
            product.name;

    }


    if (shortDescription) {

        shortDescription.textContent =
            product.shortDescription;

    }


    if (price) {

        price.textContent =
            "$" +
            product.price.toFixed(2);

    }


    if (currency) {

        currency.textContent =
            product.currency;

    }


    if (availability) {

        availability.textContent =
            product.availability;

    }


    /* =====================================================
       REFERENCE PRICE
       ===================================================== */

    if (referencePrice) {

        if (
            product.referencePrice &&
            product.referencePrice >
            product.price
        ) {

            referencePrice.textContent =
                "$" +
                product.referencePrice.toFixed(2);

        } else {

            referencePrice.textContent =
                "";

        }

    }


    /* =====================================================
       STRIPE
       ===================================================== */

    if (stripeButton) {

        stripeButton.href =
            product.stripeLink;

    }


    if (finalStripeButton) {

        finalStripeButton.href =
            product.stripeLink;

    }


    /* =====================================================
       DESCRIPTION
       ===================================================== */

    if (description) {

        description.innerHTML = "";

        const paragraph =
            document.createElement("p");

        paragraph.textContent =
            product.description;

        description.appendChild(
            paragraph
        );

    }


    /* =====================================================
       FEATURES
       ===================================================== */

    if (features) {

        features.innerHTML = "";

        product.features.forEach(
            feature => {

                const article =
                    document.createElement(
                        "article"
                    );

                article.className =
                    "feature-card";

                article.innerHTML = `

                    <div class="feature-card-inner">

                        <span class="feature-number">
                            ${String(
                                product.features.indexOf(feature) + 1
                            ).padStart(2, "0")}
                        </span>

                        <h3></h3>

                        <p></p>

                    </div>

                `;

                article
                    .querySelector("h3")
                    .textContent =
                    feature.title;

                article
                    .querySelector("p")
                    .textContent =
                    feature.description;

                features.appendChild(
                    article
                );

            }
        );

    }


    /* =====================================================
       SPECIFICATIONS
       ===================================================== */

    if (specifications) {

        specifications.innerHTML = "";

        Object.entries(
            product.specifications
        ).forEach(
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

                const data =
                    document.createElement(
                        "strong"
                    );

                data.className =
                    "specification-value";

                data.textContent =
                    value;

                row.appendChild(
                    label
                );

                row.appendChild(
                    data
                );

                specifications.appendChild(
                    row
                );

            }
        );

    }


    /* =====================================================
       OPTIONS
       ===================================================== */

    if (options) {

        options.innerHTML = `

            <div class="option-group">

                <span class="option-label">
                    PRODUCT
                </span>

                <strong>
                    ${escapeHtml(product.name)}
                </strong>

            </div>

        `;

    }


    /* =====================================================
       VARIANTS
       ===================================================== */

    if (variants) {

        variants.innerHTML = "";

        if (
            product.colors.length ||
            product.variants.length
        ) {

            renderVariants();

        }

    }


    function renderVariants() {

        if (product.colors.length) {

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

            label.textContent =
                "COLOR";

            label.className =
                "variant-label";

            group.appendChild(
                label
            );


            product.colors.forEach(
                (color, index) => {

                    const button =
                        document.createElement(
                            "button"
                        );

                    button.type =
                        "button";

                    button.className =
                        "variant-option";

                    if (index === 0) {

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


            variants.appendChild(
                group
            );

        }

    }


    /* =====================================================
       PRODUCT GALLERY
       ===================================================== */

    function initializeGallery() {

        if (!mainImage) {
            return;
        }


        const validImages = [];

        let checked =
            0;


        productImages.forEach(
            imagePath => {

                const image =
                    new Image();

                image.onload = () => {

                    validImages.push(
                        imagePath
                    );

                    checked++;

                    if (
                        checked ===
                        productImages.length
                    ) {

                        finishGallery(
                            validImages
                        );

                    }

                };


                image.onerror = () => {

                    checked++;

                    if (
                        checked ===
                        productImages.length
                    ) {

                        finishGallery(
                            validImages
                        );

                    }

                };


                image.src =
                    imagePath;

            }
        );

    }


    function finishGallery(images) {

        if (!images.length) {

            mainImage.removeAttribute(
                "src"
            );

            mainImage.alt =
                product.name;

            if (thumbnails) {

                thumbnails.innerHTML = "";

            }

            return;

        }


        setMainImage(
            images[0]
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


                if (index === 0) {

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
                    product.name +
                    " image " +
                    (index + 1);

                image.loading =
                    "lazy";


                button.appendChild(
                    image
                );


                button.addEventListener(
                    "click",
                    () => {

                        thumbnails
                            .querySelectorAll(
                                ".product-thumbnail"
                            )
                            .forEach(
                                item =>
                                    item.classList.remove(
                                        "active"
                                    )
                            );

                        button.classList.add(
                            "active"
                        );

                        setMainImage(
                            imagePath
                        );

                    }
                );


                thumbnails.appendChild(
                    button
                );

            }
        );

    }


    function setMainImage(
        imagePath
    ) {

        if (!mainImage) {
            return;
        }


        mainImage.src =
            imagePath;

        mainImage.alt =
            product.name;

    }


    initializeGallery();


    /* =====================================================
       LIGHTBOX
       ===================================================== */

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

    const imageZoomButton =
        document.getElementById(
            "imageZoomButton"
        );


    if (
        imageZoomButton &&
        lightbox &&
        lightboxImage
    ) {

        imageZoomButton.addEventListener(
            "click",
            () => {

                if (
                    !mainImage ||
                    !mainImage.src
                ) {

                    return;

                }


                lightboxImage.src =
                    mainImage.src;

                lightboxImage.alt =
                    product.name;

                lightbox.setAttribute(
                    "aria-hidden",
                    "false"
                );

                lightbox.classList.add(
                    "active"
                );

            }
        );

    }


    function closeLightbox() {

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

    }


    lightboxClose
        ?.addEventListener(
            "click",
            closeLightbox
        );


    lightbox
        ?.addEventListener(
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


    /* =====================================================
       REMOVE LOADING STATE
       ===================================================== */

    document.body.classList.add(
        "product-loaded"
    );


    /* =====================================================
       HARD-CODED PRODUCT READY
       ===================================================== */

    console.log(
        "VOLTICA: Anker Soundcore Space Q45 loaded successfully."
    );

});


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHtml(value) {

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
