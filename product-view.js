/* =========================================================
   VOLTICA STORE
   ANKER SOUNDCORE SPACE Q45
   HARD-CODED PRODUCT VIEW ENGINE
   ========================================================= */

/*
   IMPORTANT
   ---------------------------------------------------------
   This page is intentionally HARD-CODED for the
   Anker Soundcore Space Q45.

   It does NOT read product data from products.js.

   products.js can therefore remain completely untouched.
*/


/* =========================================================
   GLOBAL ERROR PROTECTION
   ========================================================= */

(function () {

    "use strict";


    /*
       If anything unexpected happens during initialization,
       ALWAYS remove the loading state.
    */

    function forceProductLoaded() {

        try {

            document.body.classList.add(
                "product-loaded"
            );

            document.documentElement.classList.add(
                "product-loaded"
            );

        } catch (error) {

            console.error(
                "VOLTICA: Unable to remove loading state.",
                error
            );

        }

    }


    /*
       Global safety net.
    */

    window.addEventListener(
        "error",
        function (event) {

            console.error(
                "VOLTICA PRODUCT ERROR:",
                event.error || event.message
            );

            forceProductLoaded();

        }
    );


    window.addEventListener(
        "unhandledrejection",
        function (event) {

            console.error(
                "VOLTICA PRODUCT PROMISE ERROR:",
                event.reason
            );

            forceProductLoaded();

        }
    );


    /* =====================================================
       WAIT FOR DOM
       ===================================================== */

    function initializeProductPage() {

        /*
           Safety:
           Never allow the page to remain in a loading state
           simply because an optional element is missing.
        */

        try {

            initializeQ45();

        } catch (error) {

            console.error(
                "VOLTICA: Q45 initialization failed.",
                error
            );

        } finally {

            /*
               THIS IS THE MOST IMPORTANT PART.

               Even if something above fails,
               the page leaves the loading state.
            */

            forceProductLoaded();

        }

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeProductPage,
            {
                once: true
            }
        );

    } else {

        initializeProductPage();

    }


    /* =====================================================
       Q45 PRODUCT
       ===================================================== */

    function initializeQ45() {


        /* =================================================
           PRODUCT DATA
           ================================================= */

        const product = {

            id:
                "anker-soundcore-space-q45-wireless-headphones-selected-by-voltica-store",

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

            offerTitle:
                "15% OFF FOR LIFE",

            offerDescription:
                "Pre-order today and receive your exclusive lifetime 15% discount with the Voltica Elite Pass.",

            availability:
                "PRE-ORDER AVAILABLE",

            stripeLink:
                "https://buy.stripe.com/eVqeVe2hNgILbyoaWK2Ji0j",

            supplierLink:
                "https://www.cjdropshipping.com/product/-p-2601110810071616400.html",


            /* =============================================
               FEATURES
               ============================================= */

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


            /* =============================================
               SPECIFICATIONS
               ============================================= */

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


            colors:
                [],

            variants:
                []

        };


        /* =================================================
           PRODUCT IMAGES
           ================================================= */

        const productImages = [
    "assets/images/Q45.1.jpg",
    "assets/images/Q45.2.jpg",
    "assets/images/Q45.3.jpg",
    "assets/images/Q45.4.jpg",
    "assets/images/Q45.6.jpg"
];
        /* =================================================
           DOM HELPERS
           ================================================= */

        const $ =
            id =>
                document.getElementById(id);


        /* =================================================
           DOM REFERENCES
           ================================================= */

        const mainImage =
            $("mainProductImage");

        const thumbnails =
            $("productThumbnails");

        const category =
            $("productCategory");

        const status =
            $("productStatus");

        const badge =
            $("productBadge");

        const name =
            $("productName");

        const shortDescription =
            $("productShortDescription");

        const price =
            $("productPrice");

        const referencePrice =
            $("referencePrice");

        const currency =
            $("productCurrency");

        const variants =
            $("productVariants");

        const stripeButton =
            $("stripeButton");

        const finalStripeButton =
            $("finalStripeButton");

        const availability =
            $("productAvailability");

        const description =
            $("productDescription");

        const features =
            $("productFeatures");

        const specifications =
            $("productSpecifications");

        const options =
            $("productOptions");

        const finalProductName =
            $("finalProductName");

        const lightbox =
            $("productLightbox");

        const lightboxImage =
            $("lightboxImage");

        const lightboxClose =
            $("lightboxClose");

        const imageZoomButton =
            $("imageZoomButton");


        /* =================================================
           BASIC INFORMATION
           ================================================= */

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


        /* =================================================
           STATUS
           ================================================= */

        if (status) {

            status.classList.add(
                "available"
            );

        }


        /* =================================================
           STRIPE
           ================================================= */

        if (stripeButton) {

            stripeButton.href =
                product.stripeLink;

            stripeButton.target =
                "_blank";

            stripeButton.rel =
                "noopener noreferrer";

        }


        if (finalStripeButton) {

            finalStripeButton.href =
                product.stripeLink;

            finalStripeButton.target =
                "_blank";

            finalStripeButton.rel =
                "noopener noreferrer";

        }


        /* =================================================
           DESCRIPTION
           ================================================= */

        if (description) {

            description.innerHTML = "";

            const paragraph =
                document.createElement(
                    "p"
                );

            paragraph.textContent =
                product.description;

            description.appendChild(
                paragraph
            );

        }


        /* =================================================
           FEATURES
           ================================================= */

        renderFeatures();


        function renderFeatures() {

            if (!features) {
                return;
            }


            features.innerHTML = "";


            product.features.forEach(
                (feature, index) => {

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
                        String(
                            index + 1
                        ).padStart(
                            2,
                            "0"
                        );


                    const title =
                        document.createElement(
                            "h3"
                        );


                    title.textContent =
                        feature.title;


                    const text =
                        document.createElement(
                            "p"
                        );


                    text.textContent =
                        feature.description;


                    inner.appendChild(
                        number
                    );

                    inner.appendChild(
                        title
                    );

                    inner.appendChild(
                        text
                    );


                    article.appendChild(
                        inner
                    );


                    features.appendChild(
                        article
                    );

                }
            );

        }


        /* =================================================
           SPECIFICATIONS
           ================================================= */

        renderSpecifications();


        function renderSpecifications() {

            if (!specifications) {
                return;
            }


            specifications.innerHTML = "";


            Object.entries(
                product.specifications
            )
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


        /* =================================================
           OPTIONS
           ================================================= */

        renderOptions();


        function renderOptions() {

            if (!options) {
                return;
            }


            options.innerHTML = "";


            const productGroup =
                document.createElement(
                    "div"
                );


            productGroup.className =
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
                product.name;


            productGroup.appendChild(
                label
            );


            productGroup.appendChild(
                value
            );


            options.appendChild(
                productGroup
            );


            /*
               Lifetime offer option.
            */

            const offerGroup =
                document.createElement(
                    "div"
                );


            offerGroup.className =
                "option-group";


            const offerLabel =
                document.createElement(
                    "span"
                );


            offerLabel.className =
                "option-label";


            offerLabel.textContent =
                "VOLTiCA ELITE PASS";


            const offerValue =
                document.createElement(
                    "strong"
                );


            offerValue.textContent =
                "15% OFF FOR LIFE";


            offerGroup.appendChild(
                offerLabel
            );


            offerGroup.appendChild(
                offerValue
            );


            options.appendChild(
                offerGroup
            );

        }


        /* =================================================
           VARIANTS
           ================================================= */

        renderVariants();


        function renderVariants() {

            if (!variants) {
                return;
            }


            variants.innerHTML = "";


            /*
               Q45 currently has no selectable color/SKU
               variants supplied for this hard-coded page.

               Therefore we intentionally do not display
               an empty variant selector.
            */

            if (
                !product.colors.length &&
                !product.variants.length
            ) {

                return;

            }


            if (
                product.colors.length
            ) {

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


                        button.textContent =
                            color;


                        if (
                            index === 0
                        ) {

                            button.classList.add(
                                "selected"
                            );

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


        /* =================================================
           GALLERY
           ================================================= */

        initializeGallery();


        function initializeGallery() {

            if (!mainImage) {

                console.warn(
                    "VOLTICA: mainProductImage not found."
                );

                return;

            }


            /*
               Display the first image immediately.

               We do NOT wait for all images to load.
               This prevents the page from getting stuck.
            */

            if (
                productImages.length
            ) {

                setMainImage(
                    productImages[0]
                );

            }


            if (!thumbnails) {
                return;
            }


            thumbnails.innerHTML = "";


            productImages.forEach(
                (imagePath, index) => {

                    createThumbnail(
                        imagePath,
                        index
                    );

                }
            );

        }


        /* =================================================
           CREATE THUMBNAIL
           ================================================= */

        function createThumbnail(
            imagePath,
            index
        ) {

            if (!thumbnails) {
                return;
            }


            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "product-thumbnail";


            button.dataset.image =
                imagePath;


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
                product.name +
                " image " +
                (index + 1);


            image.loading =
                "lazy";


            /*
               Missing thumbnails should not
               break the rest of the page.
            */

            image.onerror =
                function () {

                    button.classList.add(
                        "image-missing"
                    );

                    this.style.opacity =
                        "0.18";

                };


            button.appendChild(
                image
            );


            button.addEventListener(
                "click",
                function () {

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


        /* =================================================
           SET MAIN IMAGE
           ================================================= */

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


            mainImage.onerror =
                function () {

                    console.warn(
                        "VOLTICA: Image unavailable:",
                        imagePath
                    );


                    this.style.opacity =
                        "0.18";

                };


            mainImage.onload =
                function () {

                    this.style.opacity =
                        "1";

                };

        }


        /* =================================================
           LIGHTBOX
           ================================================= */

        initializeLightbox();


        function initializeLightbox() {

            if (
                !lightbox ||
                !lightboxImage
            ) {

                return;

            }


            if (imageZoomButton) {

                imageZoomButton.addEventListener(
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

        }


        function openLightbox() {

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


            document.body.classList.remove(
                "lightbox-open"
            );

        }


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


        /* =================================================
           IMAGE KEYBOARD / ACCESSIBILITY
           ================================================= */

        if (mainImage) {

            mainImage.setAttribute(
                "draggable",
                "false"
            );

        }


        /* =================================================
           LIFETIME OFFER
           ================================================= */

        const lifetimeOffer =
            document.querySelector(
                ".lifetime-offer"
            );


        if (lifetimeOffer) {

            const offerTitle =
                lifetimeOffer.querySelector(
                    "strong"
                );


            const offerText =
                lifetimeOffer.querySelector(
                    "p"
                );


            if (offerTitle) {

                offerTitle.textContent =
                    product.offerTitle;

            }


            if (offerText) {

                offerText.textContent =
                    product.offerDescription;

            }

        }


        /* =================================================
           FINAL PRODUCT STATE
           ================================================= */

        document.body.dataset.product =
            product.id;


        document.body.dataset.productReady =
            "true";


        /*
           Explicitly remove common loading classes.
        */

        document.body.classList.remove(
            "product-loading"
        );


        document.documentElement.classList.remove(
            "product-loading"
        );


        document.body.classList.add(
            "product-loaded"
        );


        document.documentElement.classList.add(
            "product-loaded"
        );


        /* =================================================
           DEBUG
           ================================================= */

        console.log(
            "----------------------------------------"
        );

        console.log(
            "VOLTICA PRODUCT PAGE"
        );

        console.log(
            "Product:",
            product.name
        );

        console.log(
            "Price:",
            product.price,
            product.currency
        );

        console.log(
            "Images:",
            productImages.length
        );

        console.log(
            "Stripe:",
            product.stripeLink
        );

        console.log(
            "STATUS: READY"
        );

        console.log(
            "----------------------------------------"
        );

    }


})();
