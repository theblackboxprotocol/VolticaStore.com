/* =========================================================
   VOLTICA STORE
   ADMIN PRODUCT MANAGER
   ========================================================= */

"use strict";


/* =========================================================
   STATE
   ========================================================= */

const AdminProductState = {

    products: [],

    editingIndex: null,

    selectedImages: [],

    confirmAction: null

};


/* =========================================================
   DOM
   ========================================================= */

const AdminDOM = {

    newProductButton:
        document.getElementById("newProductButton"),

    emptyCreateButton:
        document.getElementById("emptyCreateButton"),

    backupProductsButton:
        document.getElementById("backupProductsButton"),

    exportProductsButton:
        document.getElementById("exportProductsButton"),

    productEditor:
        document.getElementById("productEditor"),

    editorTitle:
        document.getElementById("editorTitle"),

    closeEditorButton:
        document.getElementById("closeEditorButton"),

    cancelProductButton:
        document.getElementById("cancelProductButton"),

    saveProductButton:
        document.getElementById("saveProductButton"),

    productId:
        document.getElementById("productId"),

    productName:
        document.getElementById("productName"),

    productCategory:
        document.getElementById("productCategory"),

    productBadge:
        document.getElementById("productBadge"),

    productSku:
        document.getElementById("productSku"),

    productCost:
        document.getElementById("productCost"),

    productShipping:
        document.getElementById("productShipping"),

    productPrice:
        document.getElementById("productPrice"),

    productReferencePrice:
        document.getElementById("productReferencePrice"),

    shortDescription:
        document.getElementById("shortDescription"),

    fullDescription:
        document.getElementById("fullDescription"),

    keyFeatures:
        document.getElementById("keyFeatures"),

    technicalSpecifications:
        document.getElementById("technicalSpecifications"),

    productImageUpload:
        document.getElementById("productImageUpload"),

    imagePreview:
        document.getElementById("imagePreview"),

    productColors:
        document.getElementById("productColors"),

    productVariants:
        document.getElementById("productVariants"),

    stripeLink:
        document.getElementById("stripeLink"),

    supplierLink:
        document.getElementById("supplierLink"),

    productActive:
        document.getElementById("productActive"),

    productList:
        document.getElementById("productList"),

    emptyState:
        document.getElementById("emptyState"),

    productSearch:
        document.getElementById("productSearch"),

    categoryFilter:
        document.getElementById("categoryFilter"),

    statusFilter:
        document.getElementById("statusFilter"),

    totalProducts:
        document.getElementById("totalProducts"),

    activeProducts:
        document.getElementById("activeProducts"),

    totalCategories:
        document.getElementById("totalCategories"),

    adminNotification:
        document.getElementById("adminNotification"),

    notificationText:
        document.getElementById("notificationText"),

    confirmOverlay:
        document.getElementById("confirmOverlay"),

    confirmTitle:
        document.getElementById("confirmTitle"),

    confirmMessage:
        document.getElementById("confirmMessage"),

    confirmCancel:
        document.getElementById("confirmCancel"),

    confirmProceed:
        document.getElementById("confirmProceed")

};


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeAdmin
);


function initializeAdmin() {

    loadProducts();

    initializeEvents();

    updateDashboard();

    populateCategoryFilter();

    renderProductList();

    closeEditor();

    notify(
        "SYSTEM READY"
    );

}


/* =========================================================
   LOAD PRODUCTS
   ========================================================= */

function loadProducts() {

    if (
        Array.isArray(
            window.volticaProducts
        )
    ) {

        AdminProductState.products =
            window.volticaProducts.map(
                product => ({
                    ...product
                })
            );

        return;

    }


    AdminProductState.products = [];

}


/* =========================================================
   EVENTS
   ========================================================= */

function initializeEvents() {


    /* NEW PRODUCT */

    AdminDOM.newProductButton?.addEventListener(
        "click",
        createNewProduct
    );


    /* EMPTY CREATE */

    AdminDOM.emptyCreateButton?.addEventListener(
        "click",
        createNewProduct
    );


    /* CLOSE */

    AdminDOM.closeEditorButton?.addEventListener(
        "click",
        closeEditor
    );


    AdminDOM.cancelProductButton?.addEventListener(
        "click",
        closeEditor
    );


    /* SAVE */

    AdminDOM.saveProductButton?.addEventListener(
        "click",
        saveProduct
    );


    /* IMAGE UPLOAD */

    AdminDOM.productImageUpload?.addEventListener(
        "change",
        handleImageUpload
    );


    /* AUTO ID */

    AdminDOM.productName?.addEventListener(
        "input",
        () => {

            if (
                AdminProductState.editingIndex !== null
            ) {

                return;

            }

            AdminDOM.productId.value =
                slugify(
                    AdminDOM.productName.value
                );

        }
    );


    /* SEARCH */

    AdminDOM.productSearch?.addEventListener(
        "input",
        renderProductList
    );


    /* CATEGORY */

    AdminDOM.categoryFilter?.addEventListener(
        "change",
        renderProductList
    );


    /* STATUS */

    AdminDOM.statusFilter?.addEventListener(
        "change",
        renderProductList
    );


    /* BACKUP */

    AdminDOM.backupProductsButton?.addEventListener(
        "click",
        backupProducts
    );


    /* EXPORT */

    AdminDOM.exportProductsButton?.addEventListener(
        "click",
        exportProductsJS
    );


    /* CONFIRM */

    AdminDOM.confirmCancel?.addEventListener(
        "click",
        closeConfirmation
    );


    AdminDOM.confirmProceed?.addEventListener(
        "click",
        executeConfirmation
    );

}


/* =========================================================
   CREATE NEW PRODUCT
   ========================================================= */

function createNewProduct() {

    AdminProductState.editingIndex =
        null;

    AdminProductState.selectedImages =
        [];


    clearForm();


    if (
        AdminDOM.editorTitle
    ) {

        AdminDOM.editorTitle.textContent =
            "NEW PRODUCT";

    }


    if (
        AdminDOM.productActive
    ) {

        AdminDOM.productActive.checked =
            true;

    }


    renderImagePreview();


    openEditor();


    requestAnimationFrame(
        () => {

            AdminDOM.productName?.focus();

        }
    );


    notify(
        "NEW PRODUCT MODE"
    );

}


/* =========================================================
   OPEN EDITOR
   ========================================================= */

function openEditor() {

    if (
        !AdminDOM.productEditor
    ) {

        return;

    }


    AdminDOM.productEditor.hidden =
        false;


    AdminDOM.productEditor.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =========================================================
   CLOSE EDITOR
   ========================================================= */

function closeEditor() {

    if (
        !AdminDOM.productEditor
    ) {

        return;

    }


    AdminDOM.productEditor.hidden =
        true;


    AdminProductState.editingIndex =
        null;


    AdminProductState.selectedImages =
        [];

}


/* =========================================================
   CLEAR FORM
   ========================================================= */

function clearForm() {

    const fields = [

        AdminDOM.productId,
        AdminDOM.productName,
        AdminDOM.productCategory,
        AdminDOM.productSku,
        AdminDOM.productCost,
        AdminDOM.productShipping,
        AdminDOM.productPrice,
        AdminDOM.productReferencePrice,
        AdminDOM.shortDescription,
        AdminDOM.fullDescription,
        AdminDOM.keyFeatures,
        AdminDOM.technicalSpecifications,
        AdminDOM.productColors,
        AdminDOM.productVariants,
        AdminDOM.stripeLink,
        AdminDOM.supplierLink

    ];


    fields.forEach(
        field => {

            if (field) {

                field.value = "";

            }

        }
    );


    if (
        AdminDOM.productBadge
    ) {

        AdminDOM.productBadge.value =
            "";

    }


    if (
        AdminDOM.productActive
    ) {

        AdminDOM.productActive.checked =
            true;

    }


    if (
        AdminDOM.productImageUpload
    ) {

        AdminDOM.productImageUpload.value =
            "";

    }


    renderImagePreview();

}


/* =========================================================
   IMAGE UPLOAD
   ========================================================= */

function handleImageUpload(event) {

    const files =
        Array.from(
            event.target.files || []
        );


    if (
        files.length === 0
    ) {

        return;

    }


    files.forEach(
        file => {

            const alreadyExists =
                AdminProductState.selectedImages.some(
                    existing =>
                        existing.name ===
                        file.name
                );


            if (
                !alreadyExists
            ) {

                AdminProductState.selectedImages.push(
                    file
                );

            }

        }
    );


    renderImagePreview();


    notify(
        `${AdminProductState.selectedImages.length} IMAGE(S) SELECTED`
    );

}


/* =========================================================
   IMAGE PREVIEW
   ========================================================= */

function renderImagePreview() {

    if (
        !AdminDOM.imagePreview
    ) {

        return;

    }


    AdminDOM.imagePreview.innerHTML =
        "";


    if (
        AdminProductState.selectedImages.length === 0
    ) {

        const empty =
            document.createElement(
                "div"
            );


        empty.className =
            "image-preview-empty";


        empty.textContent =
            "NO IMAGES SELECTED";


        AdminDOM.imagePreview.appendChild(
            empty
        );


        return;

    }


    AdminProductState.selectedImages.forEach(
        (file, index) => {

            const wrapper =
                document.createElement(
                    "div"
                );


            wrapper.className =
                "image-preview-item";


            const image =
                document.createElement(
                    "img"
                );


            image.alt =
                file.name;


            const objectURL =
                URL.createObjectURL(
                    file
                );


            image.src =
                objectURL;


            image.onload =
                () => {

                    URL.revokeObjectURL(
                        objectURL
                    );

                };


            const filename =
                document.createElement(
                    "span"
                );


            filename.className =
                "image-preview-name";


            filename.textContent =
                file.name;


            const remove =
                document.createElement(
                    "button"
                );


            remove.type =
                "button";


            remove.className =
                "image-preview-remove";


            remove.textContent =
                "×";


            remove.setAttribute(
                "aria-label",
                `Remove ${file.name}`
            );


            remove.addEventListener(
                "click",
                () => {

                    AdminProductState
                        .selectedImages
                        .splice(
                            index,
                            1
                        );


                    renderImagePreview();

                }
            );


            wrapper.appendChild(
                image
            );


            wrapper.appendChild(
                filename
            );


            wrapper.appendChild(
                remove
            );


            AdminDOM.imagePreview.appendChild(
                wrapper
            );

        }
    );

}


/* =========================================================
   SAVE PRODUCT
   ========================================================= */

function saveProduct() {

    const name =
        AdminDOM.productName?.value.trim();


    const price =
        Number(
            AdminDOM.productPrice?.value
        );


    if (!name) {

        notify(
            "PRODUCT NAME REQUIRED"
        );

        AdminDOM.productName?.focus();

        return;

    }


    if (
        !Number.isFinite(price) ||
        price <= 0
    ) {

        notify(
            "VALID PRODUCT PRICE REQUIRED"
        );

        AdminDOM.productPrice?.focus();

        return;

    }


    const existingProduct =
        AdminProductState.editingIndex !== null
            ? AdminProductState.products[
                AdminProductState.editingIndex
            ]
            : null;


    const productId =
        AdminDOM.productId?.value.trim() ||
        slugify(name);


    const product = {

        id:
            productId,

        name:
            name,

        category:
            AdminDOM.productCategory?.value.trim() ||
            "VOLTICA COLLECTION",

        badge:
            AdminDOM.productBadge?.value ||
            "",

        sku:
            AdminDOM.productSku?.value.trim() ||
            "",

        cost:
            numberOrZero(
                AdminDOM.productCost?.value
            ),

        shipping:
            numberOrZero(
                AdminDOM.productShipping?.value
            ),

        price:
            price,

        referencePrice:
            numberOrZero(
                AdminDOM.productReferencePrice?.value
            ),

        shortDescription:
            AdminDOM.shortDescription?.value.trim() ||
            "",

        description:
            AdminDOM.fullDescription?.value.trim() ||
            "",

        keyFeatures:
            parseLines(
                AdminDOM.keyFeatures?.value
            ),

        specifications:
            parseSpecifications(
                AdminDOM.technicalSpecifications?.value
            ),

        colors:
            parseCommaList(
                AdminDOM.productColors?.value
            ),

        variants:
            parseLines(
                AdminDOM.productVariants?.value
            ),

        stripeLink:
            AdminDOM.stripeLink?.value.trim() ||
            "",

        supplierLink:
            AdminDOM.supplierLink?.value.trim() ||
            "",

        active:
            AdminDOM.productActive?.checked !== false,

        images:
            buildImageList(
                existingProduct
            )

    };


    /* =====================================================
       UPDATE IMAGE FILENAMES
       ===================================================== */

    const newImageNames =
        AdminProductState.selectedImages.map(
            file => file.name
        );


    if (
        newImageNames.length > 0
    ) {

        product.images =
            newImageNames;

    }


    /* =====================================================
       SAVE / UPDATE
       ===================================================== */

    if (
        AdminProductState.editingIndex === null
    ) {

        const duplicate =
            AdminProductState.products.some(
                existing =>
                    String(existing.id) ===
                    String(product.id)
            );


        if (
            duplicate
        ) {

            notify(
                "PRODUCT ID ALREADY EXISTS"
            );

            AdminDOM.productId?.focus();

            return;

        }


        AdminProductState.products.push(
            product
        );


        notify(
            "PRODUCT CREATED"
        );

    }
    else {

        AdminProductState.products[
            AdminProductState.editingIndex
        ] =
            product;


        notify(
            "PRODUCT UPDATED"
        );

    }


    syncGlobalProducts();

    updateDashboard();

    populateCategoryFilter();

    renderProductList();

    closeEditor();

}


/* =========================================================
   BUILD IMAGE LIST
   ========================================================= */

function buildImageList(
    existingProduct
) {

    if (
        existingProduct &&
        Array.isArray(
            existingProduct.images
        )
    ) {

        return [
            ...existingProduct.images
        ];

    }


    return [];

}


/* =========================================================
   EDIT PRODUCT
   ========================================================= */

function editProduct(index) {

    const product =
        AdminProductState.products[index];


    if (!product) {

        return;

    }


    AdminProductState.editingIndex =
        index;


    AdminProductState.selectedImages =
        [];


    clearForm();


    AdminDOM.productId.value =
        product.id || "";


    AdminDOM.productName.value =
        product.name || "";


    AdminDOM.productCategory.value =
        product.category || "";


    AdminDOM.productBadge.value =
        product.badge || "";


    AdminDOM.productSku.value =
        product.sku || "";


    AdminDOM.productCost.value =
        numberOrZero(product.cost) || "";


    AdminDOM.productShipping.value =
        numberOrZero(product.shipping) || "";


    AdminDOM.productPrice.value =
        numberOrZero(product.price) || "";


    AdminDOM.productReferencePrice.value =
        numberOrZero(
            product.referencePrice
        ) || "";


    AdminDOM.shortDescription.value =
        product.shortDescription ||
        "";


    AdminDOM.fullDescription.value =
        product.description ||
        "";


    AdminDOM.keyFeatures.value =
        formatFeatures(
            product.keyFeatures
        );


    AdminDOM.technicalSpecifications.value =
        formatSpecifications(
            product.specifications
        );


    AdminDOM.productColors.value =
        Array.isArray(product.colors)
            ? product.colors.join(", ")
            : "";


    AdminDOM.productVariants.value =
        formatVariants(
            product.variants
        );


    AdminDOM.stripeLink.value =
        product.stripeLink ||
        "";


    AdminDOM.supplierLink.value =
        product.supplierLink ||
        "";


    AdminDOM.productActive.checked =
        product.active !== false;


    if (
        AdminDOM.editorTitle
    ) {

        AdminDOM.editorTitle.textContent =
            "EDIT PRODUCT";

    }


    renderExistingImages(
        product.images
    );


    openEditor();


    notify(
        "PRODUCT EDITOR OPEN"
    );

}


/* =========================================================
   EXISTING IMAGE DISPLAY
   ========================================================= */

function renderExistingImages(
    images
) {

    if (
        !AdminDOM.imagePreview
    ) {

        return;

    }


    AdminDOM.imagePreview.innerHTML =
        "";


    if (
        !Array.isArray(images) ||
        images.length === 0
    ) {

        renderImagePreview();

        return;

    }


    images.forEach(
        imagePath => {

            const wrapper =
                document.createElement(
                    "div"
                );


            wrapper.className =
                "image-preview-item existing-image";


            const image =
                document.createElement(
                    "img"
                );


            image.src =
                normalizeImagePath(
                    imagePath
                );


            image.alt =
                String(
                    imagePath
                );


            const filename =
                document.createElement(
                    "span"
                );


            filename.className =
                "image-preview-name";


            filename.textContent =
                getFilename(
                    imagePath
                );


            wrapper.appendChild(
                image
            );


            wrapper.appendChild(
                filename
            );


            AdminDOM.imagePreview.appendChild(
                wrapper
            );

        }
    );

}


/* =========================================================
   PRODUCT LIST
   ========================================================= */

function renderProductList() {

    if (
        !AdminDOM.productList
    ) {

        return;

    }


    const search =
        (
            AdminDOM.productSearch?.value ||
            ""
        )
        .trim()
        .toLowerCase();


    const category =
        AdminDOM.categoryFilter?.value ||
        "all";


    const status =
        AdminDOM.statusFilter?.value ||
        "all";


    const filtered =
        AdminProductState.products
            .map(
                (
                    product,
                    index
                ) => ({
                    product,
                    index
                })
            )
            .filter(
                ({
                    product
                }) => {

                    const matchesSearch =
                        !search ||
                        String(
                            product.name || ""
                        )
                        .toLowerCase()
                        .includes(search) ||
                        String(
                            product.sku || ""
                        )
                        .toLowerCase()
                        .includes(search) ||
                        String(
                            product.id || ""
                        )
                        .toLowerCase()
                        .includes(search);


                    const matchesCategory =
                        category === "all" ||
                        String(
                            product.category || ""
                        ) === category;


                    const matchesStatus =
                        status === "all" ||
                        (
                            status === "active" &&
                            product.active !== false
                        ) ||
                        (
                            status === "inactive" &&
                            product.active === false
                        );


                    return (
                        matchesSearch &&
                        matchesCategory &&
                        matchesStatus
                    );

                }
            );


    AdminDOM.productList.innerHTML =
        "";


    filtered.forEach(
        ({
            product,
            index
        }) => {

            AdminDOM.productList.appendChild(
                createProductListItem(
                    product,
                    index
                )
            );

        }
    );


    if (
        AdminDOM.emptyState
    ) {

        AdminDOM.emptyState.style.display =
            AdminProductState.products.length === 0
                ? "flex"
                : "none";

    }

}


/* =========================================================
   PRODUCT LIST ITEM
   ========================================================= */

function createProductListItem(
    product,
    index
) {

    const item =
        document.createElement(
            "article"
        );


    item.className =
        "database-product";


    item.innerHTML = `

        <div class="database-product-main">

            <div class="database-product-image">

                ${
                    getProductImage(
                        product
                    )
                        ? `
                            <img
                                src="${escapeAttribute(
                                    normalizeImagePath(
                                        getProductImage(
                                            product
                                        )
                                    )
                                )}"
                                alt="${escapeAttribute(
                                    product.name || ""
                                )}"
                            >
                        `
                        : `
                            <span>
                                V
                            </span>
                        `
                }

            </div>


            <div class="database-product-info">

                <span class="database-product-category">
                    ${escapeHTML(
                        product.category ||
                        "VOLTICA COLLECTION"
                    )}
                </span>


                <h3>
                    ${escapeHTML(
                        product.name ||
                        "UNTITLED PRODUCT"
                    )}
                </h3>


                <p>
                    ${escapeHTML(
                        product.sku ||
                        product.id ||
                        "NO SKU"
                    )}
                </p>

            </div>

        </div>


        <div class="database-product-price">

            ${formatPrice(
                product.price
            )}

        </div>


        <div class="database-product-status">

            <span
                class="${
                    product.active !== false
                        ? "active"
                        : "inactive"
                }"
            >
                ${
                    product.active !== false
                        ? "ACTIVE"
                        : "INACTIVE"
                }
            </span>

        </div>


        <div class="database-product-actions">

            <button
                type="button"
                class="acrylic-button"
                data-edit-product="${index}"
            >
                EDIT
            </button>

            <button
                type="button"
                class="acrylic-button danger"
                data-delete-product="${index}"
            >
                DELETE
            </button>

        </div>

    `;


    item
        .querySelector(
            "[data-edit-product]"
        )
        ?.addEventListener(
            "click",
            () => {

                editProduct(
                    index
                );

            }
        );


    item
        .querySelector(
            "[data-delete-product]"
        )
        ?.addEventListener(
            "click",
            () => {

                confirmDeleteProduct(
                    index
                );

            }
        );


    return item;

}


/* =========================================================
   DELETE PRODUCT
   ========================================================= */

function confirmDeleteProduct(
    index
) {

    const product =
        AdminProductState.products[index];


    if (!product) {

        return;

    }


    AdminProductState.confirmAction =
        () => {

            AdminProductState.products.splice(
                index,
                1
            );


            syncGlobalProducts();

            updateDashboard();

            populateCategoryFilter();

            renderProductList();

            notify(
                "PRODUCT DELETED"
            );

        };


    showConfirmation(
        "DELETE PRODUCT",
        `Delete ${product.name || "this product"}?`
    );

}


/* =========================================================
   DASHBOARD
   ========================================================= */

function updateDashboard() {

    const products =
        AdminProductState.products;


    const active =
        products.filter(
            product =>
                product.active !== false
        );


    const categories =
        new Set(
            products
                .map(
                    product =>
                        String(
                            product.category || ""
                        ).trim()
                )
                .filter(Boolean)
        );


    if (
        AdminDOM.totalProducts
    ) {

        AdminDOM.totalProducts.textContent =
            products.length;

    }


    if (
        AdminDOM.activeProducts
    ) {

        AdminDOM.activeProducts.textContent =
            active.length;

    }


    if (
        AdminDOM.totalCategories
    ) {

        AdminDOM.totalCategories.textContent =
            categories.size;

    }

}


/* =========================================================
   CATEGORY FILTER
   ========================================================= */

function populateCategoryFilter() {

    if (
        !AdminDOM.categoryFilter
    ) {

        return;

    }


    const current =
        AdminDOM.categoryFilter.value ||
        "all";


    const categories =
        [
            ...new Set(
                AdminProductState.products
                    .map(
                        product =>
                            String(
                                product.category || ""
                            ).trim()
                    )
                    .filter(Boolean)
            )
        ]
        .sort(
            (
                a,
                b
            ) =>
                a.localeCompare(b)
        );


    AdminDOM.categoryFilter.innerHTML =
        `
            <option value="all">
                ALL CATEGORIES
            </option>
        `;


    categories.forEach(
        category => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                category;


            option.textContent =
                category;


            AdminDOM.categoryFilter.appendChild(
                option
            );

        }
    );


    if (
        categories.includes(current)
    ) {

        AdminDOM.categoryFilter.value =
            current;

    }

}


/* =========================================================
   SYNC GLOBAL PRODUCTS
   ========================================================= */

function syncGlobalProducts() {

    window.volticaProducts =
        AdminProductState.products.map(
            product => ({
                ...product
            })
        );

}


/* =========================================================
   BACKUP
   ========================================================= */

function backupProducts() {

    const backup = {

        exportedAt:
            new Date().toISOString(),

        products:
            AdminProductState.products

    };


    downloadFile(
        "voltica-products-backup.json",
        JSON.stringify(
            backup,
            null,
            4
        ),
        "application/json"
    );


    notify(
        "DATABASE BACKUP CREATED"
    );

}


/* =========================================================
   EXPORT PRODUCTS.JS
   ========================================================= */

function exportProductsJS() {

    const output =
`/* =========================================================
   VOLTICA STORE
   PRODUCT DATABASE
   ========================================================= */

"use strict";

window.volticaProducts = ${JSON.stringify(
    AdminProductState.products,
    null,
    4
)};
`;


    downloadFile(
        "products.js",
        output,
        "application/javascript"
    );


    notify(
        "PRODUCTS.JS EXPORTED"
    );

}


/* =========================================================
   DOWNLOAD
   ========================================================= */

function downloadFile(
    filename,
    content,
    type
) {

    const blob =
        new Blob(
            [content],
            {
                type
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        filename;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );

}


/* =========================================================
   IMAGE HELPERS
   ========================================================= */

function getProductImage(
    product
) {

    if (
        !product ||
        !Array.isArray(
            product.images
        ) ||
        product.images.length === 0
    ) {

        return "";

    }


    const first =
        product.images[0];


    if (
        typeof first === "string"
    ) {

        return first;

    }


    if (
        first &&
        typeof first === "object"
    ) {

        return (
            first.path ||
            first.name ||
            ""
        );

    }


    return "";

}


function normalizeImagePath(
    path
) {

    if (!path) {

        return "";

    }


    const value =
        String(
            path
        ).trim();


    if (
        value.startsWith("http://") ||
        value.startsWith("https://") ||
        value.startsWith("/")
    ) {

        return value;

    }


    if (
        value.startsWith("assets/")
    ) {

        return value;

    }


    return (
        "assets/images/" +
        value
    );

}


function getFilename(
    path
) {

    return String(
        path || ""
    )
    .split("/")
    .pop();

}


/* =========================================================
   FORMATTING
   ========================================================= */

function parseLines(
    value
) {

    return String(
        value || ""
    )
    .split("\n")
    .map(
        line =>
            line.trim()
    )
    .filter(Boolean);

}


function parseCommaList(
    value
) {

    return String(
        value || ""
    )
    .split(",")
    .map(
        item =>
            item.trim()
    )
    .filter(Boolean);

}


function parseSpecifications(
    value
) {

    return parseLines(
        value
    )
    .map(
        line => {

            const separator =
                line.indexOf(":");


            if (
                separator === -1
            ) {

                return {

                    name:
                        line,

                    value:
                        ""

                };

            }


            return {

                name:
                    line
                        .slice(
                            0,
                            separator
                        )
                        .trim(),

                value:
                    line
                        .slice(
                            separator + 1
                        )
                        .trim()

            };

        }
    );

}


function formatFeatures(
    value
) {

    if (
        !Array.isArray(value)
    ) {

        return "";

    }


    return value.join(
        "\n"
    );

}


function formatSpecifications(
    value
) {

    if (
        !Array.isArray(value)
    ) {

        return "";

    }


    return value
        .map(
            item => {

                if (
                    item &&
                    typeof item === "object"
                ) {

                    return (
                        String(
                            item.name || ""
                        ) +
                        ": " +
                        String(
                            item.value || ""
                        )
                    ).trim();

                }


                return String(
                    item || ""
                );

            }
        )
        .filter(Boolean)
        .join("\n");

}


function formatVariants(
    value
) {

    if (
        !Array.isArray(value)
    ) {

        return "";

    }


    return value
        .map(
            item => {

                if (
                    typeof item === "string"
                ) {

                    return item;

                }


                if (
                    item &&
                    typeof item === "object"
                ) {

                    return [
                        item.name,
                        item.sku
                    ]
                    .filter(Boolean)
                    .join(" — ");

                }


                return "";

            }
        )
        .filter(Boolean)
        .join("\n");

}


function numberOrZero(
    value
) {

    const number =
        Number(value);


    return Number.isFinite(number)
        ? number
        : 0;

}


/* =========================================================
   SLUGIFY
   ========================================================= */

function slugify(
    value
) {

    return String(
        value || ""
    )
    .normalize("NFD")
    .replace(
        /[\u0300-\u036f]/g,
        ""
    )
    .toLowerCase()
    .trim()
    .replace(
        /[^a-z0-9]+/g,
        "-"
    )
    .replace(
        /^-+|-+$/g,
        "");

}


/* =========================================================
   ESCAPE
   ========================================================= */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );

}


function escapeAttribute(
    value
) {

    return escapeHTML(
        value
    );

}


/* =========================================================
   NOTIFICATION
   ========================================================= */

let notificationTimer =
    null;


function notify(
    message
) {

    if (
        !AdminDOM.adminNotification ||
        !AdminDOM.notificationText
    ) {

        return;

    }


    AdminDOM.notificationText.textContent =
        message;


    AdminDOM.adminNotification.classList.add(
        "show"
    );


    clearTimeout(
        notificationTimer
    );


    notificationTimer =
        setTimeout(
            () => {

                AdminDOM.adminNotification.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* =========================================================
   CONFIRMATION
   ========================================================= */

function showConfirmation(
    title,
    message
) {

    if (
        !AdminDOM.confirmOverlay
    ) {

        return;

    }


    AdminDOM.confirmTitle.textContent =
        title;


    AdminDOM.confirmMessage.textContent =
        message;


    AdminDOM.confirmOverlay.hidden =
        false;

}


function closeConfirmation() {

    if (
        !AdminDOM.confirmOverlay
    ) {

        return;

    }


    AdminDOM.confirmOverlay.hidden =
        true;


    AdminProductState.confirmAction =
        null;

}


function executeConfirmation() {

    const action =
        AdminProductState.confirmAction;


    closeConfirmation();


    if (
        typeof action === "function"
    ) {

        action();

    }

}


/* =========================================================
   PUBLIC API
   ========================================================= */

window.VolticaAdmin =
{

    getProducts() {

        return [
            ...AdminProductState.products
        ];

    },

    createNewProduct,

    editProduct,

    saveProduct,

    exportProductsJS,

    backupProducts

};
