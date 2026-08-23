/* =========================================================
   VOLTICA STORE — PRODUCTS DATABASE
   ========================================================= */

const volticaProducts = [

    /* =================================================
       PRODUCT 01 — VOLTICA Q45
       ================================================= */

    {
        id: "q45",

        productNumber: 1,

        sku: "CJYP272510404DW",

        name: "Voltica Q45",

        category: "ELITE AUDIO",

        badge: "LIMITED",

        price: 189.99,

        cost: null,

        supplier: "CJdropshipping",

        supplierLink:
            "https://www.cjdropshipping.com/product/-p-2601110810071616400.html",


        /* =================================================
           STRIPE
           ================================================= */

        stripeLink:
            "https://buy.stripe.com/eVqeVe2hNgILbyoaWK2Ji0j",


        /* =================================================
           IMAGES
           ================================================= */

        images: [

            "assets/Q451-1.webp",

            "assets/Q451-2.webp",

            "assets/Q451-3.webp",

            "assets/Q451-4.webp",

            "assets/Q451-6.webp",

            "assets/Q451-7.webp"

        ],


        /* =================================================
           SHORT DESCRIPTION
           ================================================= */

        shortDescription:
            "Premium over-ear wireless headphones engineered for immersive listening, long-distance travel, intensive workflows and everyday entertainment.",


        /* =================================================
           DESCRIPTION
           ================================================= */

        description:
            "The Voltica Q45 brings premium wireless audio, adaptive active noise cancellation and long-lasting battery performance together in a refined over-ear design. Built for travel, work, gaming and everyday listening, the Q45 delivers an immersive listening experience while keeping you connected throughout the day.",


        /* =================================================
           ELITE PASS
           ================================================= */

        elitePass: {

            enabled: true,

            limitedUnits: 200,

            discount:
                "15% OFF 4 LIFE",

            description:
                "The first 200 customers purchasing the Voltica Q45 through Voltica Store receive an exclusive laser-engraved metal Voltica Elite Pass Card.",

            benefit:
                "Lifetime 15% discount on future Voltica Store purchases."

        },


        /* =================================================
           KEY FEATURES
           ================================================= */

        features: [

            "Up to 65 hours of battery life",

            "Adaptive active noise cancellation",

            "Up to 98% ambient noise reduction",

            "Hi-Res Audio",

            "Bluetooth 5.3",

            "Multipoint wireless connectivity",

            "AI dual-microphone call noise reduction",

            "Fast charging capability",

            "Over-ear closed-back design",

            "Premium acoustic tuning"

        ],


        /* =================================================
           TECHNICAL SPECIFICATIONS
           ================================================= */

        specifications: {

            manufacturer:
                "Soundcore by Anker",

            retailer:
                "Voltica Store",

            formFactor:
                "Over-Ear / Closed-Back",

            wireless:
                "Bluetooth 5.3",

            connectivity:
                "Bluetooth 5.3 with multipoint connection",

            audio:
                "Hi-Res Audio",

            noiseCancellation:
                "Triple-Stage Dynamic ANC",

            microphones:
                "Dual Mic with AI Call Noise Reduction",

            battery:
                "Up to 65 Hours with ANC Off",

            charging:
                "Fast Charge Capable"

        },


        /* =================================================
           COLORWAYS
           ================================================= */

        variants: [

            {
                name: "Moon Rock Black",
                value: "moon-rock-black"
            },

            {
                name: "Crescent White",
                value: "crescent-white"
            },

            {
                name: "Moonlit Night Blue",
                value: "moonlit-night-blue"
            }

        ],


        /* =================================================
           WHY VOLTICA
           ================================================= */

        whyVoltica: [

            "Premium high-tech gear selected for innovators and tech enthusiasts.",

            "Exclusive Voltica Elite Pass available for the first 200 customers.",

            "Dedicated customer support."

        ],


        /* =================================================
           AVAILABILITY
           ================================================= */

        availability:
            "200 Limited Units",

        available: true

    },


    /* =================================================
       PRODUCT 02 — XREAL AIR 1S
       ================================================= */

    {
        id: "xreal-air-1s",

        productNumber: 2,

        sku: null,

        name: "XREAL Air 1S",

        category: "SMART TECH",

        badge: "FEATURED",

        price: 579.99,

        cost: 464.76,

        supplier: "Alibaba",

        supplierLink:
            "https://www.alibaba.com/x/B2LdQW?ck=pdp",


        /* =================================================
           STRIPE
           ================================================= */

        stripeLink:
            "https://buy.stripe.com/14A28se0v78bauk4ym2Ji0o",


        /* =================================================
           IMAGES
           ================================================= */

        images: [

            "assets/glass1-1.jpg",

            "assets/glass1-2.jpg",

            "assets/glass1-3.jpg",

            "assets/glass1-4.jpg",

            "assets/glass1-5.jpg",

            "assets/glass1-6.jpg"

        ],


        /* =================================================
           SHORT DESCRIPTION
           ================================================= */

        shortDescription:
            "Step into a new dimension of portable display with the XREAL Air 1S. Intelligent AR glasses that project an ultra-bright giant virtual screen directly into your field of vision for immersive gaming, movies and mobile productivity.",


        /* =================================================
           DESCRIPTION
           ================================================= */

        description:
            "The XREAL Air 1S bridges the digital and physical worlds with an immersive 52° field of view and an adjustable virtual display ranging from 31 to 500 inches. Designed for gaming, entertainment and mobile productivity, it combines advanced AI capabilities, premium audio and ultra-fluid visuals in a compact wearable display.",


        /* =================================================
           KEY FEATURES
           ================================================= */

        features: [

            "52° immersive field of view",

            "Virtual display from 31 to 500 inches",

            "Automatic electrochromic lenses",

            "AI voice wake-up",

            "Real-time photo object recognition",

            "Instant image text translation",

            "TÜV Rheinland certified eye comfort",

            "Low blue light technology",

            "Flicker-free technology",

            "USB-CDP Plug & Play",

            "Compatible with smartphones",

            "Compatible with portable gaming handhelds",

            "Compatible with tablets",

            "Compatible with laptops",

            "Premium integrated audio",

            "Advanced X1 chipset",

            "Under 1% TV distortion"

        ],


        /* =================================================
           TECHNICAL SPECIFICATIONS
           ================================================= */

        specifications: {

            model:
                "XREAL Air 1S",

            fieldOfView:
                "52° immersive wide view",

            virtualScreen:
                "31–500 inches",

            controls:
                "Intuitive tactile buttons + AI voice assistant",

            connectivity:
                "USB-CDP Plug & Play",

            displayControl:
                "Pixel-level image alignment accuracy",

            response:
                "Low-latency response"

        },


        /* =================================================
           WHY VOLTICA
           ================================================= */

        whyVoltica: [

            "Premium high-tech gear selected for innovators and tech enthusiasts.",

            "Dedicated customer support."

        ],


        /* =================================================
           AVAILABILITY
           ================================================= */

        availability:
            "Available",

        available: true

    }

];


/* =========================================================
   VOLTICA PRODUCT HELPERS
   ========================================================= */

function getVolticaProduct(productId) {

    return volticaProducts.find(
        product => product.id === productId
    );

}


function getVolticaProductByNumber(productNumber) {

    return volticaProducts.find(
        product => product.productNumber === productNumber
    );

}


/* =========================================================
   GLOBAL EXPORT
   ========================================================= */

window.volticaProducts =
    volticaProducts;

window.getVolticaProduct =
    getVolticaProduct;

window.getVolticaProductByNumber =
    getVolticaProductByNumber;
