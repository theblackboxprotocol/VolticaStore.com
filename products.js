/* =========================================================
VOLTICA STORE — PRODUCTS.JS
Product Database
========================================================= */

"use strict";

/* =========================================================
VOLTICA Q45
========================================================= */

const volticaProducts = [

{
    id: "q45",

    productNumber: 1,

    name: "VOLTICA Q45",

    model: "Q45",

    category: "PREMIUM AUDIO",

    badge: "PRE-ORDER",

    active: true,


    /* =================================================
       PRICING
       ================================================= */

    price: 189.99,

    currency: "USD",

    referencePrice: 219.99,

    lifetimeDiscount: 15,

    lifetimeOffer: true,

    offerText: "15% OFF FOR LIFE",


    /* =================================================
       IMAGES
       ================================================= */

    images: [

        "assets/images/q451-1.webp",

        "assets/images/q451-2.webp",

        "assets/images/q451-3.webp",

        "assets/images/q451-4.webp",

        "assets/images/q451-6.webp",

        "assets/images/q451-7.webp"

    ],


    image:
        "assets/images/q451-1.webp",

    thumbnail:
        "assets/images/q451-1.webp",


    /* =================================================
       DESCRIPTION
       ================================================= */

    shortDescription:
        "Premium wireless headphones engineered for immersive sound, everyday comfort and next-generation listening.",

    description:
        "Meet the Voltica Q45 — premium wireless headphones designed for listeners who expect powerful sound, refined comfort and modern technology in one experience.\n\nThe Q45 combines an immersive listening experience with a premium over-ear design made for everyday use. Whether you're working, travelling, gaming or simply enjoying your favourite music, the Q45 is built to deliver a rich and focused audio experience.\n\nThe Voltica Q45 is part of the premium Voltica collection and is available for pre-order.",


    /* =================================================
       FEATURES
       ================================================= */

    features: [

        "Premium over-ear wireless design",

        "Immersive high-quality audio",

        "Active noise cancellation",

        "Long-lasting wireless listening",

        "Comfort-focused ear cushions",

        "Bluetooth wireless connectivity",

        "Built for everyday listening",

        "Premium Voltica design"

    ],


    keyFeatures: [

        "Premium wireless audio",

        "Active noise cancellation",

        "Comfortable over-ear construction",

        "Bluetooth connectivity",

        "Long listening sessions",

        "Immersive sound experience"

    ],


    highlights: [

        "Premium Audio",

        "Wireless",

        "Noise Cancellation",

        "Over-Ear",

        "Voltica Collection"

    ],


    /* =================================================
       SPECIFICATIONS
       ================================================= */

    specifications: {

        "Product": "Voltica Q45",

        "Model": "Q45",

        "Category": "Premium Audio",

        "Type": "Wireless Over-Ear Headphones",

        "Connectivity": "Bluetooth",

        "Audio": "High-Quality Wireless Audio",

        "Noise Control": "Active Noise Cancellation",

        "Design": "Over-Ear",

        "Use": "Music, Gaming, Travel & Everyday Listening",

        "Brand": "Voltica"

    },


    /* =================================================
       VARIANTS
       ================================================= */

    variants: [

        {
            name: "Black",
            color: "Black",
            sku: "VLT-Q45-BLK"
        },

        {
            name: "White",
            color: "White",
            sku: "VLT-Q45-WHT"
        }

    ],


    colors: [

        "Black",

        "White"

    ],


    /* =================================================
       PRE-ORDER
       ================================================= */

    preorder: true,

    preOrder: true,

    availability:
        "PRE-ORDER — VOLTICA COLLECTION",

    availabilityText:
        "Pre-order now. Limited launch availability.",

    releaseText:
        "VOLTICA COLLECTION OPEN",


    /* =================================================
       LIFETIME OFFER
       ================================================= */

    promo: {

        type: "lifetime",

        discount: 15,

        label: "15% OFF FOR LIFE",

        description:
            "Pre-order the Voltica Q45 and receive 15% off future purchases for life."

    },


    /* =================================================
       STRIPE
       ================================================= */

    stripeLink:
        "https://buy.stripe.com/eVqeVe2hNgILbyoaWK2Ji0j",

    stripe:
        "https://buy.stripe.com/eVqeVe2hNgILbyoaWK2Ji0j",

    stripeUrl:
        "https://buy.stripe.com/eVqeVe2hNgILbyoaWK2Ji0j",


    /* =================================================
       PRODUCT METADATA
       ================================================= */

    sku:
        "VLT-Q45-001",

    brand:
        "Voltica",

    collection:
        "Premium Audio",

    tags: [

        "headphones",

        "wireless",

        "premium audio",

        "Q45",

        "noise cancelling",

        "Voltica"

    ]

}

];

/* =========================================================
GLOBAL DATABASE
========================================================= */

window.volticaProducts =
volticaProducts;

/* =========================================================
PRODUCT HELPERS
========================================================= */

window.VolticaProducts = {

getAll() {

    return volticaProducts;

},


getById(id) {

    return volticaProducts.find(
        product =>
            String(product.id) ===
            String(id)
    ) || null;

},


getActive() {

    return volticaProducts.filter(
        product =>
            product.active !== false
    );

},


getBySKU(sku) {

    return volticaProducts.find(
        product =>
            String(product.sku) ===
            String(sku)
    ) || null;

}

};

/* =========================================================
READY
========================================================= */

console.log(
"VOLTICA PRODUCTS — DATABASE ONLINE",
volticaProducts
);
