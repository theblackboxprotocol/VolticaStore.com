/* =========================================================
   VOLTICA STORE — PRODUCT RENDERER
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const grid = document.getElementById("product-grid");

    if (!grid || typeof volticaProducts === "undefined") {
        return;
    }


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
                    loading="lazy">

                <div class="image-reflection"></div>

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

                        <small>
                            ${product.currency}
                        </small>

                    </strong>


                    <a
                        href="${product.stripe}"
                        class="product-button">

                        VIEW

                        <span>
                            →
                        </span>

                    </a>

                </div>

            </div>

        `;


        grid.appendChild(card);

    });

});
