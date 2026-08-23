/* =========================================================
VOLTICA STORE
PRODUCT DATABASE
========================================================= */

const volticaProducts = [

/* =========================================================
   PRODUCT 01 — VOLTICA Q17
   ========================================================= */

{
    id: "earbuds1",

    sku: "CJYP266383702BY",

    name: "Voltica Q17",

    category: "SPORT AUDIO",

    badge: "NEW",

    price: 69.97,

    referencePrice: null,

    currency: "USD",

    description:
        "Wireless neckband earbuds designed for movement, workouts and everyday listening.",

    longDescription:
        "The Voltica Q17 combines a secure ear-hook design with wireless freedom and practical everyday controls. Built for movement, workouts and active lifestyles, it delivers comfortable audio without getting in the way.",

    features: [
        {
            title: "Secure Fit",
            description: "Ear-hook design built for movement."
        },
        {
            title: "8+ Hour Battery",
            description: "Designed for extended everyday listening."
        },
        {
            title: "Bluetooth",
            description: "Wireless connectivity up to 10 meters."
        },
        {
            title: "Digital Display",
            description: "Quick battery information at a glance."
        }
    ],

    colors: [
        "Black"
    ],

    images: [
        "assets/images/earbuds1-1.webp",
        "assets/images/earbuds1-2.webp",
        "assets/images/earbuds1-3.webp",
        "assets/images/earbuds1-4.webp",
        "assets/images/earbuds1-5.webp",
        "assets/images/earbuds1-6.webp",
        "assets/images/earbuds1-7.webp",
        "assets/images/earbuds1-8.webp",
        "assets/images/earbuds1-9.jpg"
    ],

    availability: "Available",

    shipping: "Calculated at checkout"
},


/* =========================================================
   PRODUCT 02 — VOLTICA TWS PRO
   ========================================================= */

{
    id: "earbuds2",

    sku: "VLT-AUD-TWS-PRO-001",

    name: "Voltica TWS Pro",

    category: "WIRELESS AUDIO",

    badge: "FEATURED",

    price: 59.97,

    referencePrice: null,

    currency: "USD",

    description:
        "Premium true wireless earbuds designed for everyday listening.",

    longDescription:
        "Voltica TWS Pro brings a clean wireless experience to everyday life. Compact, comfortable and designed around simple controls, these earbuds are made for music, calls and everything in between.",

    features: [
        {
            title: "True Wireless",
            description: "Freedom from cables for everyday listening."
        },
        {
            title: "Compact Design",
            description: "Designed for comfortable everyday carry."
        },
        {
            title: "Touch Controls",
            description: "Simple controls at your fingertips."
        },
        {
            title: "Everyday Audio",
            description: "A versatile audio experience for daily use."
        }
    ],

    colors: [
        "Black",
        "White"
    ],

    images: [
        "assets/images/earbuds2-1.webp",
        "assets/images/earbuds2-2.webp",
        "assets/images/earbuds2-3.webp",
        "assets/images/earbuds2-4.webp",
        "assets/images/earbuds2-5.webp"
    ],

    availability: "Available",

    shipping: "Calculated at checkout"
},


/* =========================================================
   PRODUCT 03 — VOLTICA T75
   ========================================================= */

{
    id: "t75",

    sku: "VLT-AUD-T75-001",

    name: "Voltica T75",

    category: "OPEN-EAR AUDIO",

    badge: "NEW",

    price: 34.99,

    referencePrice: 39.99,

    currency: "USD",

    description:
        "Open-ear wireless earbuds with an ear-clip design built for comfort and movement.",

    longDescription:
        "The Voltica T75 features an open-ear clip design that keeps you connected to your surroundings while delivering wireless audio. With low-latency mode, touch controls and IPX5 water and sweat resistance, it is built for everyday movement.",

    features: [
        {
            title: "Open-Ear Design",
            description: "Stay aware of your surroundings while listening."
        },
        {
            title: "Low Latency",
            description: "Designed for responsive audio and gaming."
        },
        {
            title: "IPX5",
            description: "Water and sweat resistant for active use."
        },
        {
            title: "Touch Controls",
            description: "Easy control without reaching for your phone."
        }
    ],

    colors: [
        "Black",
        "White",
        "Beige"
    ],

    images: [
        "assets/images/t75-1.webp",
        "assets/images/t75-2.webp",
        "assets/images/t75-3.webp",
        "assets/images/t75-4.webp",
        "assets/images/t75-5.webp"
    ],

    availability: "Available",

    shipping: "Calculated at checkout",

    supplier: {
        platform: "AliExpress",

        model: "T75",

        supplierSku: null,

        productCost: 9.03,

        shippingCost: 9.00,

        totalCost: 18.03
    }
},


/* =========================================================
   PRODUCT 04 — J10 GAMING SET
   ========================================================= */

{
    id: "j10",

    sku: "CJXFSPYX00075-Keyboard + mouse",

    name: "Voltica J10 Gaming Set",

    category: "GAMING GEAR",

    badge: "GAMING",

    price: 43.99,

    referencePrice: null,

    currency: "USD",

    description:
        "Tricolor backlight wired gaming keyboard and mouse set.",

    longDescription:
        "The Voltica J10 Gaming Set brings together a wired gaming keyboard and mouse with a tricolor backlight design. A straightforward setup for gamers looking for an affordable way to upgrade their desk.",

    features: [
        {
            title: "Gaming Keyboard",
            description: "Full-size wired keyboard for gaming and everyday use."
        },
        {
            title: "Gaming Mouse",
            description: "Matching wired mouse included."
        },
        {
            title: "Tricolor Backlight",
            description: "Gaming-inspired illuminated design."
        },
        {
            title: "Complete Set",
            description: "Keyboard and mouse included together."
        }
    ],

    colors: [
        "Black"
    ],

    images: [
        "assets/images/keyboard1-1.webp",
        "assets/images/keyboard1-2.webp",
        "assets/images/keyboard1-3.webp",
        "assets/images/keyboard1-4.webp",
        "assets/images/keyboard1-5.webp",
        "assets/images/keyboard1-6.webp",
        "assets/images/keyboard1-7.webp",
        "assets/images/keyboard1-8.webp"
    ],

    availability: "Available",

    shipping: "Calculated at checkout",

    supplier: {
        platform: "CJdropshipping",

        model: null,

        supplierSku:
            "CJXFSPYX00075-Keyboard + mouse",

        productCost: 8.78,

        shippingCost: 18.37,

        totalCost: 27.15
    }
}

];

/* =========================================================
PRODUCT HELPERS
========================================================= */

/**

* Find a product by its Voltica ID.
  */
  function getProductById(id) {
  
  return volticaProducts.find(
  product => product.id === id
  );

}

/**

* Find a product by SKU.
  */
  function getProductBySku(sku) {
  
  return volticaProducts.find(
  product => product.sku === sku
  );

}

/**

* Return all products.
  */
  function getAllProducts() {
  
  return volticaProducts;

}

/**

* Return products by category.
  */
  function getProductsByCategory(category) {
  
  if (
  !category ||
  category.toLowerCase() === "all"
  ) {
  
   return volticaProducts;
  
  }
  
  return volticaProducts.filter(
  product =>
  product.category.toLowerCase() ===
  category.toLowerCase()
  );

}

/**

* Return featured/new products.
  */
  function getFeaturedProducts() {
  
  return volticaProducts.filter(
  product =>
  product.badge === "FEATURED" ||
  product.badge === "NEW"
  );

  }
