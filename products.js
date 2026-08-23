const STORAGE_KEY = 'voltica_products_database';

// Retrieve all active inventory
function getProducts() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// Save or update a single hardware entry
function saveSingleProduct(product) {
    let products = getProducts();
    if (!product.id) product.id = 'vlt_' + Date.now();

    const existingIndex = products.findIndex(p => p.id === product.id);
    if (existingIndex > -1) {
        products[existingIndex] = product;
    } else {
        products.push(product);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// Remove item from inventory
function deleteProduct(id) {
    let products = getProducts().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// Fetch single product by ID
function getProductById(id) {
    return getProducts().find(p => p.id === id);
}

// Render dynamic storefront grid
function renderStoreFront() {
    const products = getProducts();
    const categories = ['earbuds', 'gaming', 'creator', 'headphones', 'tech', 'lifestyle'];

    categories.forEach(cat => {
        const grid = document.getElementById(`grid-${cat}`);
        if (!grid) return;

        const catProducts = products.filter(p => p.category === cat);

        if (catProducts.length === 0) {
            grid.innerHTML = `<p style="opacity: 0.3; grid-column: 1 / -1; font-size: 11px; letter-spacing: 0.15em;">NO PRODUCTS AVAILABLE IN THIS COLLECTION.</p>`;
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
