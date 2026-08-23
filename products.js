/* =========================================================
   VOLTICA STORE — PRODUCTS DATABASE
   =========================================================

   Product database for:

   - store.html
   - product-view.html
   - adminproductmanager.html

   IMPORTANT:
   No products are currently registered.

   ========================================================= */


/* =========================================================
   VOLTICA PRODUCTS
   ========================================================= */

const volticaProducts = [];


/* =========================================================
   PRODUCT DATABASE HELPERS
   ========================================================= */

/*
   Find a product by its ID.

   Example:
   const product = getVolticaProduct("product-01");
*/

function getVolticaProduct(productId) {

    return volticaProducts.find(
        product => product.id === productId
    );

}


/*
   Get all products.
*/

function getAllVolticaProducts() {

    return volticaProducts;

}


/*
   Get only featured products.
*/

function getFeaturedVolticaProducts() {

    return volticaProducts.filter(
        product => product.featured === true
    );

}


/*
   Get products by category.
*/

function getVolticaProductsByCategory(category) {

    return volticaProducts.filter(
        product =>
            product.category &&
            product.category.toLowerCase() ===
            category.toLowerCase()
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
