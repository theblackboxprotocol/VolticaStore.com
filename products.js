// Variable centrale de stockage
const STORAGE_KEY = 'voltica_products';

// Charger tous les produits
function getProducts() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// Sauvegarder la liste des produits
function saveProducts(products) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// Ajouter/Modifier un produit
function saveSingleProduct(product) {
    let products = getProducts();
    const existingIndex = products.findIndex(p => p.id === product.id);

    if (existingIndex > -1) {
        products[existingIndex] = product;
    } else {
        product.id = product.id || 'prod_' + Date.now();
        products.push(product);
    }
    saveProducts(products);
}

// Supprimer un produit
function deleteProduct(id) {
    let products = getProducts().filter(p => p.id !== id);
    saveProducts(products);
}
