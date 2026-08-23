const STORAGE_KEY = 'voltica_products_data';

// Obtenir tous les produits
function getProducts() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// Sauvegarder un produit (Admin)
function saveSingleProduct(product) {
    let products = getProducts();
    if (!product.id) product.id = 'prod_' + Date.now();
    
    const index = products.findIndex(p => p.id === product.id);
    if (index > -1) {
        products[index] = product;
    } else {
        products.push(product);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// Supprimer un produit
function deleteProduct(id) {
    let products = getProducts().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// Obtenir un seul produit par ID
function getProductById(id) {
    return getProducts().find(p => p.id === id);
}

// Affichage dynamique dans store.html
function renderStoreFront() {
    const products = getProducts();
    const categories = ['earbuds', 'gaming', 'creator', 'headphones', 'tech', 'lifestyle'];

    categories.forEach(cat => {
        const grid = document.getElementById(`grid-${cat}`);
        if (!grid) return;

        const catProducts = products.filter(p => p.category === cat);
        
        if (catProducts.length === 0) {
            grid.innerHTML = `<p style="opacity:0.4; grid-column:1/-1;">Aucun produit disponible dans cette catégorie.</p>`;
            return;
        }

        grid.innerHTML = catProducts.map(p => `
            <article class="store-product">
                <div class="product-image">
                    ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
                    <img src="${p.imageUrl}" alt="${p.name}">
                    <div class="image-reflection"></div>
                </div>
                <div class="product-info">
                    <div class="product-category">VOLTICA / ${cat.toUpperCase()}</div>
                    <h3>${p.name}</h3>
                    <p>${p.description}</p>
                    <div class="product-bottom">
                        <strong class="product-price">$${parseFloat(p.price).toFixed(2)} <small>USD</small></strong>
                        <a href="product-view.html?id=${p.id}" class="product-button">VIEW <span>→</span></a>
                    </div>
                </div>
            </article>
        `).join('');
    });
}
