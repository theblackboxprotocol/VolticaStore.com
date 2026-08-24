/* =========================================================
   VOLTICA STORE — EMERGENCY PRODUCT RENDER
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", function () {

    const grid = document.getElementById("productGrid");

    console.log("VOLTICA: STORE START");
    console.log("VOLTICA: GRID =", grid);
    console.log("VOLTICA: PRODUCTS =", volticaProducts);

    if (!grid) {
        console.error("VOLTICA: productGrid introuvable.");
        return;
    }

    if (
        typeof volticaProducts === "undefined" ||
        !Array.isArray(volticaProducts)
    ) {
        console.error("VOLTICA: products.js introuvable.");
        return;
    }

    grid.innerHTML = "";

    volticaProducts
        .filter(product => product && product.active !== false)
        .forEach(product => {

            const card = document.createElement("article");

            card.className = "store-product";

            card.innerHTML = `

                <div class="product-image">

                    <img
                        src="${product.images?.[0] || ""}"
                        alt="${product.name || "Voltica Product"}"
                        loading="lazy"
                    >

                </div>

                <div class="product-info">

                    <span class="product-category">
                        ${product.category || "VOLTICA COLLECTION"}
                    </span>

                    <h2 class="product-title">
                        ${product.name || "VOLTICA PRODUCT"}
                    </h2>

                    <p class="product-description">
                        ${product.shortDescription || ""}
                    </p>

                    <div class="product-price-row">

                        <strong class="product-price">
                            $${Number(product.price || 0).toFixed(2)}
                        </strong>

                        ${
                            product.referencePrice &&
                            product.referencePrice > product.price
                            ? `
                                <span class="product-reference-price">
                                    $${Number(product.referencePrice).toFixed(2)}
                                </span>
                            `
                            : ""
                        }

                    </div>

                    ${
                        Array.isArray(product.colors)
                        ? `
                            <div class="product-colors">

                                <span>
                                    COLORS
                                </span>

                                <div class="color-list">

                                    ${product.colors.map(color => `
                                        <span
                                            class="color-chip"
                                            title="${color}"
                                        ></span>
                                    `).join("")}

                                </div>

                            </div>
                        `
                        : ""
                    }

                    <div class="product-actions">

                        <a
                            href="product.html?id=${encodeURIComponent(product.id)}"
                            class="acrylic-button product-view-button"
                        >
                            VIEW PRODUCT
                        </a>

                        <a
                            href="${product.stripeLink || "#"}"
                            class="acrylic-button product-buy-button"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            BUY NOW
                        </a>

                    </div>

                </div>

            `;

            grid.appendChild(card);

        });

    console.log(
        "VOLTICA: PRODUCTS RENDERED =",
        grid.children.length
    );

});
