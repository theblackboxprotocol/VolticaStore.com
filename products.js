/* =========================================================
   VOLTICA STORE — PRODUCTS DATABASE
   =========================================================

   CENTRAL PRODUCT DATABASE

   Source of truth:
       localStorage
       "voltica_products_admin"

   Used by:

   - store.html
   - product-view.html
   - adminproductmanager.html
   - store.js
   - product-view.js

   IMPORTANT:
   The Admin Product Manager saves products using:

       vol­tica_products_admin

   This file reads that exact database and exposes it as:

       window.volticaProducts

   ========================================================= */

"use strict";


/* =========================================================
   STORAGE CONFIGURATION
   ========================================================= */

const VOLTICA_PRODUCTS_STORAGE_KEY =
    "voltica_products_admin";


/* =========================================================
   LOAD DATABASE
   ========================================================= */

function loadVolticaProducts() {

    try {

        const saved =
            localStorage.getItem(
                VOLTICA_PRODUCTS_STORAGE_KEY
            );


        if (!saved) {

            return [];

        }


        const parsed =
            JSON.parse(
                saved
            );


        if (
            Array.isArray(parsed)
        ) {

            return parsed;

        }


        console.warn(
            "VOLTICA: Product database exists but is not an array."
        );


        return [];

    } catch (error) {

        console.error(
            "VOLTICA: Failed to load product database.",
            error
        );


        return [];

    }

}


/* =========================================================
   GLOBAL PRODUCT DATABASE
   ========================================================= */

window.volticaProducts =
    loadVolticaProducts();


/*
   Local reference.
*/

const volticaProducts =
    window.volticaProducts;


/* =========================================================
   PRODUCT LOOKUP
   ========================================================= */

function getVolticaProduct(
    productId
) {

    return volticaProducts.find(
        product =>
            String(product.id) ===
            String(productId)
    );

}


/* =========================================================
   GET ALL PRODUCTS
   ========================================================= */

function getAllVolticaProducts() {

    return volticaProducts;

}


/* =========================================================
   GET ACTIVE PRODUCTS
   ========================================================= */

function getActiveVolticaProducts() {

    return volticaProducts.filter(
        product =>
            product &&
            product.active !== false
    );

}


/* =========================================================
   GET FEATURED PRODUCTS
   ========================================================= */

function getFeaturedVolticaProducts() {

    return volticaProducts.filter(
        product =>
            product &&
            product.featured === true
    );

}


/* =========================================================
   GET PRODUCTS BY CATEGORY
   ========================================================= */

function getVolticaProductsByCategory(
    category
) {

    if (!category) {

        return [];

    }


    return volticaProducts.filter(
        product =>

            product.category &&

            product.category
                .toLowerCase() ===
            category
                .toLowerCase()
    );

}


/* =========================================================
   REFRESH DATABASE
   =========================================================

   Useful if the Admin Product Manager
   modifies localStorage while another
   page is open.

   ========================================================= */

function refreshVolticaProducts() {

    window.volticaProducts =
        loadVolticaProducts();

    return window.volticaProducts;

}


/* =========================================================
   DATABASE STATUS
   ========================================================= */

console.log(
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
);

console.log(
    "VOLTICA PRODUCTS DATABASE"
);

console.log(
    "STATUS: ONLINE"
);

console.log(
    "PRODUCTS:",
    window.volticaProducts.length
);

console.log(
    "STORAGE:",
    VOLTICA_PRODUCTS_STORAGE_KEY
);

console.log(
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
);


/* =========================================================
   PRODUCT DEBUG TABLE
   ========================================================= */

if (
    window.volticaProducts.length
) {

    console.table(
        window.volticaProducts.map(
            product => ({

                ID:
                    product.id,

                NAME:
                    product.name,

                CATEGORY:
                    product.category,

                SKU:
                    product.sku,

                PRICE:
                    product.price,

                ACTIVE:
                    product.active !== false,

                IMAGES:
                    Array.isArray(
                        product.images
                    )
                        ? product.images.length
                        : 0

            })
        )
    );

} else {

    console.log(
        "VOLTICA: No products registered yet."
    );

}


/* =========================================================
   PUBLIC API
   ========================================================= */

window.VolticaProducts = {

    getAll:
        getAllVolticaProducts,

    getActive:
        getActiveVolticaProducts,

    getFeatured:
        getFeaturedVolticaProducts,

    getByCategory:
        getVolticaProductsByCategory,

    getById:
        getVolticaProduct,

    refresh:
        refreshVolticaProducts

};


/* =========================================================
   DATABASE READY
   ========================================================= */

console.log(
    "VOLTICA PRODUCT DATABASE — READY"
);
