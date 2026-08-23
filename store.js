<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <meta
        name="description"
        content="Voltica Q45 — Premium ANC headphones. The future of everyday."
    >

    <meta
        name="theme-color"
        content="#030303"
    >

    <title>Voltica Q45 — The Future of Everyday</title>

    <link
        rel="stylesheet"
        href="store.css"
    >

</head>


<body>


<!-- =====================================================
     BACKGROUND
     ===================================================== -->

<div
    class="pulsar-field"
    aria-hidden="true"
>

    <span class="pulsar p1"></span>
    <span class="pulsar p2"></span>
    <span class="pulsar p3"></span>
    <span class="pulsar p4"></span>
    <span class="pulsar p5"></span>
    <span class="pulsar p6"></span>

</div>


<div
    class="tech-grid"
    aria-hidden="true"
></div>



<!-- =====================================================
     HEADER
     ===================================================== -->

<header class="store-header">


    <a
        href="index.html"
        class="logo-acrylic"
        aria-label="Voltica Home"
    >

        <span class="logo-v">
            V
        </span>

        <span class="logo-text">
            VOLTICA
        </span>

    </a>


    <nav class="store-nav">

        <a
            href="index.html"
            class="nav-active"
        >
            HOME
        </a>

        <a href="store.html">
            STORE
        </a>

        <a href="#contact">
            CONTACT
        </a>

    </nav>


    <button
        type="button"
        class="cart-acrylic"
        id="cartButton"
        aria-label="Open shopping cart"
    >

        <span class="cart-icon">

            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >

                <path
                    d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.5L21 7H6"
                />

                <circle
                    cx="10"
                    cy="20"
                    r="1"
                />

                <circle
                    cx="18"
                    cy="20"
                    r="1"
                />

            </svg>

        </span>


        <span
            class="cart-count"
            id="cartCount"
        >
            0
        </span>

    </button>


</header>



<!-- =====================================================
     MAIN
     ===================================================== -->

<main>


<!-- =====================================================
     HERO
     ===================================================== -->

<section class="store-hero">


    <div
        class="hero-pulsar"
        aria-hidden="true"
    >

        <span></span>

    </div>


    <span class="product-category">
        VOLTICA AUDIO
    </span>


    <h1 class="future-title">

        <span>
            VOLTICA
        </span>

        <span class="future-second">
            Q45
        </span>

    </h1>


    <p
        class="product-description"
        style="
            position:relative;
            z-index:3;
            max-width:620px;
            margin-top:24px;
            color:rgba(255,255,255,.58);
            text-align:center;
        "
    >

        Premium wireless headphones engineered
        for immersive sound, active noise cancellation
        and everyday comfort.

    </p>


    <div class="opening-acrylic">

        <span class="opening-pulse"></span>

        <span>
            PRE-ORDER
        </span>

        <strong>
            NOW OPEN
        </strong>

    </div>


</section>



<!-- =====================================================
     FEATURED PRODUCT
     ===================================================== -->

<section
    class="products-section"
    aria-label="Voltica Q45"
>


    <article class="store-product">


        <!-- =================================================
             PRODUCT IMAGE
             ================================================= -->

        <div class="product-image">


            <span class="product-badge">
                PRE-ORDER
            </span>


            <img
                src="assets/images/q451-1.webp"
                alt="Voltica Q45 headphones"
                loading="eager"
            >


            <div
                class="image-reflection"
                aria-hidden="true"
            ></div>


        </div>



        <!-- =================================================
             PRODUCT INFORMATION
             ================================================= -->

        <div class="product-info">


            <span class="product-category">
                PREMIUM AUDIO
            </span>


            <h2 class="product-title">
                VOLTICA Q45
            </h2>


            <p class="product-description">

                Experience powerful wireless audio
                with immersive sound, premium comfort
                and advanced active noise cancellation.

            </p>



            <!-- PRICE -->

            <div
                class="product-price-row"
                style="margin-top:18px;"
            >

                <strong class="product-price">
                    $189.99 USD
                </strong>

            </div>


            <p
                style="
                    margin-top:10px;
                    color:rgba(255,255,255,.55);
                    font-size:12px;
                    line-height:1.6;
                "
            >

                Includes your exclusive
                <strong style="color:#fff;">
                    15% OFF FOR LIFE
                </strong>
                customer benefit.

            </p>



            <!-- =================================================
                 ACTIONS
                 ================================================= -->

            <div
                class="product-actions"
                style="margin-top:24px;"
            >


                <button
                    type="button"
                    class="acrylic-button product-view-button"
                    id="openProductButton"
                >
                    VIEW PRODUCT
                </button>


                <a
                    href="https://buy.stripe.com/eVqeVe2hNgILbyoaWK2Ji0j"
                    class="acrylic-button product-buy-button"
                    target="_blank"
                    rel="noopener noreferrer"
                >

                    PRE-ORDER

                </a>


            </div>


        </div>


    </article>


</section>



<!-- =====================================================
     PRODUCT MODAL
     ===================================================== -->

<div
    class="product-modal"
    id="productModal"
    aria-hidden="true"
>


    <div
        class="product-modal-overlay"
        id="productModalOverlay"
    ></div>


    <div
        class="product-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalProductName"
    >


        <button
            type="button"
            class="product-modal-close"
            id="productModalClose"
            aria-label="Close product"
        >
            ×
        </button>



        <!-- =================================================
             GALLERY
             ================================================= -->

        <div class="product-modal-gallery">


            <div class="product-modal-main-image">

                <img
                    id="modalMainImage"
                    src="assets/images/q451-1.webp"
                    alt="Voltica Q45"
                >

            </div>


            <div
                class="product-modal-thumbnails"
                id="modalThumbnails"
            >


                <button
                    type="button"
                    class="modal-thumb active"
                    data-image="assets/images/q451-1.webp"
                >

                    <img
                        src="assets/images/q451-1.webp"
                        alt="Voltica Q45 image 1"
                    >

                </button>


                <button
                    type="button"
                    class="modal-thumb"
                    data-image="assets/images/q451-2.webp"
                >

                    <img
                        src="assets/images/q451-2.webp"
                        alt="Voltica Q45 image 2"
                    >

                </button>


                <button
                    type="button"
                    class="modal-thumb"
                    data-image="assets/images/q451-3.webp"
                >

                    <img
                        src="assets/images/q451-3.webp"
                        alt="Voltica Q45 image 3"
                    >

                </button>


                <button
                    type="button"
                    class="modal-thumb"
                    data-image="assets/images/q451-4.webp"
                >

                    <img
                        src="assets/images/q451-4.webp"
                        alt="Voltica Q45 image 4"
                    >

                </button>


                <button
                    type="button"
                    class="modal-thumb"
                    data-image="assets/images/q451-6.webp"
                >

                    <img
                        src="assets/images/q451-6.webp"
                        alt="Voltica Q45 image 6"
                    >

                </button>


                <button
                    type="button"
                    class="modal-thumb"
                    data-image="assets/images/q451-7.webp"
                >

                    <img
                        src="assets/images/q451-7.webp"
                        alt="Voltica Q45 image 7"
                    >

                </button>


            </div>

        </div>



        <!-- =================================================
             DETAILS
             ================================================= -->

        <div class="product-modal-details">


            <span class="product-category">
                PREMIUM AUDIO
            </span>


            <h2 id="modalProductName">
                VOLTICA Q45
            </h2>


            <div class="modal-price">
                $189.99 USD
            </div>


            <div class="modal-life-offer">

                <span class="pulse-dot"></span>

                <strong>
                    15% OFF FOR LIFE
                </strong>

            </div>


            <p>

                Meet the Voltica Q45 — premium wireless
                headphones designed for immersive everyday
                listening.

                <br><br>

                Active noise cancellation helps reduce
                unwanted surroundings while the comfortable
                over-ear design keeps you focused on your music,
                videos, games and calls.

                <br><br>

                Built for people who want premium audio
                without compromising everyday comfort.

            </p>



            <!-- FEATURES -->

            <div class="modal-features">


                <div>
                    <strong>
                        ANC
                    </strong>

                    <span>
                        Active Noise Cancellation
                    </span>
                </div>


                <div>
                    <strong>
                        WIRELESS
                    </strong>

                    <span>
                        Bluetooth audio
                    </span>
                </div>


                <div>
                    <strong>
                        PREMIUM
                    </strong>

                    <span>
                        Over-ear comfort
                    </span>
                </div>


                <div>
                    <strong>
                        VOLTICA
                    </strong>

                    <span>
                        Selected premium collection
                    </span>
                </div>


            </div>



            <!-- PURCHASE -->

            <a
                href="https://buy.stripe.com/eVqeVe2hNgILbyoaWK2Ji0j"
                class="modal-buy-button"
                target="_blank"
                rel="noopener noreferrer"
            >

                PRE-ORDER Q45

                <strong>
                    →
                </strong>

            </a>


            <p
                style="
                    margin-top:12px;
                    font-size:10px;
                    color:rgba(255,255,255,.38);
                    text-align:center;
                    letter-spacing:.08em;
                "
            >

                SECURE CHECKOUT POWERED BY STRIPE

            </p>


        </div>


    </div>

</div>



<!-- =====================================================
     CONTACT
     ===================================================== -->

<section
    id="contact"
    class="contact-section"
>


    <div class="contact-acrylic">


        <div
            class="contact-pulsar"
            aria-hidden="true"
        ></div>


        <div class="contact-content">


            <span class="contact-label">
                VOLTICA SUPPORT
            </span>


            <h2>
                CONTACT US
            </h2>


            <p>
                Need help with your order?
            </p>


            <a
                href="mailto:support@volticastore.com"
                class="contact-button"
            >

                <span>
                    CONTACT US
                </span>

                <strong>
                    →
                </strong>

            </a>


        </div>


    </div>


</section>


</main>



<!-- =====================================================
     FOOTER
     ===================================================== -->

<footer class="store-footer">


    <div class="footer-acrylic">


        <span>
            VOLTICA
        </span>


        <span>
            THE FUTURE OF EVERYDAY
        </span>


        <span>
            © 2026
        </span>


    </div>


</footer>



<!-- =====================================================
     MODAL SCRIPT
     ===================================================== -->

<script>

"use strict";


document.addEventListener(
    "DOMContentLoaded",
    function () {


        const openButton =
            document.getElementById(
                "openProductButton"
            );


        const modal =
            document.getElementById(
                "productModal"
            );


        const overlay =
            document.getElementById(
                "productModalOverlay"
            );


        const closeButton =
            document.getElementById(
                "productModalClose"
            );


        const mainImage =
            document.getElementById(
                "modalMainImage"
            );


        const thumbnails =
            document.querySelectorAll(
                ".modal-thumb"
            );


        function openModal() {

            if (!modal) {
                return;
            }


            modal.classList.add(
                "active"
            );


            modal.setAttribute(
                "aria-hidden",
                "false"
            );


            document.body.style.overflow =
                "hidden";

        }


        function closeModal() {

            if (!modal) {
                return;
            }


            modal.classList.remove(
                "active"
            );


            modal.setAttribute(
                "aria-hidden",
                "true"
            );


            document.body.style.overflow =
                "";

        }


        openButton?.addEventListener(
            "click",
            openModal
        );


        closeButton?.addEventListener(
            "click",
            closeModal
        );


        overlay?.addEventListener(
            "click",
            closeModal
        );


        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape"
                ) {

                    closeModal();

                }

            }
        );


        thumbnails.forEach(
            function (thumbnail) {

                thumbnail.addEventListener(
                    "click",
                    function () {


                        const image =
                            thumbnail.dataset.image;


                        if (!image || !mainImage) {
                            return;
                        }


                        mainImage.src =
                            image;


                        thumbnails.forEach(
                            function (item) {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                        thumbnail.classList.add(
                            "active"
                        );

                    }
                );

            }
        );


    }
);

</script>


</body>

</html>
