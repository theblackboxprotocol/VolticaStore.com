/* =========================================================
   VOLTICA STORE — PRODUCTS DATABASE
   =========================================================

   Central product database for:

   - store.html
   - product-view.html
   - adminproductmanager.html

   The ADMIN PRODUCT MANAGER is the source of truth.

   Products are stored in localStorage and exposed through:

       window.volticaProducts

   ========================================================= */

"use strict";


/* =========================================================
   STORAGE
   ========================================================= */

const VOLTICA_PRODUCTS_STORAGE_KEY =
    "volticaProducts";


/* =========================================================
   LOAD PRODUCT DATABASE
   ========================================================= */

function loadVolticaProductsDatabase() {

    try {

        const saved =
            localStorage.getItem(
                VOLTICA_PRODUCTS_STORAGE_KEY
            );


        if (
            saved
        ) {

            const parsed =
                JSON.parse(
                    saved
                );


            if (
                Array.isArray(
                    parsed
                )
            ) {

                return parsed;

            }

        }

    } catch (error) {

        console.error(
            "VOLTICA: Unable to load product database.",
            error
        );

    }


    return [];

}


/* =========================================================
   GLOBAL DATABASE
   ========================================================= */

window.volticaProducts =
    loadVolticaProductsDatabase();


/*
 * Local reference for the helper functions.
 */

const volticaProducts =
    window.volticaProducts;


/* =========================================================
   PRODUCT HELPERS
   ========================================================= */


/*
   Find a product by ID.
*/

function getVolticaProduct(
    productId
) {

    return volticaProducts.find(
        product =>
            String(
                product.id
            ) ===
            String(
                productId
            )
    );

}


/*
   Get all products.
*/

function getAllVolticaProducts() {

    return volticaProducts;

}


/*
   Get only active products.
*/

function getActiveVolticaProducts() {

    return volticaProducts.filter(
        product =>
            product &&
            product.active !== false
    );

}


/*
   Get only featured products.
*/

function getFeaturedVolticaProducts() {

    return volticaProducts.filter(
        product =>
            product &&
            product.featured === true
    );

}


/*
   Get products by category.
*/

function getVolticaProductsByCategory(
    category
) {

    if (
        !category
    ) {

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
   DATABASE STATUS
   ========================================================= */

console.log(
    "VOLTICA PRODUCTS DATABASE LOADED:",
    volticaProducts.length,
    "products"
);


/* =========================================================
   DEBUG
   ========================================================= */

console.table(
    volticaProducts
);


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
        getVolticaProduct

};


/* =========================================================
   DATABASE READY
   ========================================================= */

console.log(
    "VOLTICA PRODUCT DATABASE — ONLINE"
);
