
document.addEventListener("DOMContentLoaded", () => {

    const grid = document.getElementById("product-grid");

    if (!grid || typeof volticaProducts === "undefined") {
        return;
    }

    grid.innerHTML = "";

    volticaProducts.forEach(product => {

        const card = document.createElement("article");

        card.className = "store-product";

        card.innerHTML = `
            <div class="product-image">

                <span class="product-badge">
                    ${product.badge}
                </span>

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    style="
                        display:block;
                        width:100%;
                        height:300px;
                        object-fit:contain;
                        position:relative;
                        z-index:999;
                        opacity:1;
                        visibility:visible;
                    "
                >

            </div>

            <div class="product-info">

                <div class="product-category">
                    ${product.category}
                </div>

                <h3>
                    ${product.name}
                </h3>

                <p>
                    ${product.description}
                </p>

                <div class="product-bottom">

                    <strong class="product-price">
                        $${product.price}
                        <small>${product.currency}</small>
                    </strong>

                    <a
                        href="${product.stripe}"
                        class="product-button">

                        VIEW <span>→</span>

                    </a>

                </div>

            </div>
        `;

        grid.appendChild(card);

    });

});
