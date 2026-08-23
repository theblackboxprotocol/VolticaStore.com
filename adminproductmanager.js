/* =========================================================
   VOLTICA STORE
   ADMIN PRODUCT MANAGER
   PRODUCT CATALOG ENGINE
   ========================================================= */

"use strict";


/* =========================================================
   CONFIGURATION
   ========================================================= */

const IMAGE_BASE_PATH = "assets/images/";

const STORAGE_KEY = "voltica_products_admin";

const STORE_EVENT_KEY = "voltica_store_catalog_updated";

let products = [];

let editingProductId = null;

let selectedImages = [];

let pendingConfirmAction = null;

let notificationTimer = null;


/* =========================================================
   DOM HELPERS
   ========================================================= */

const $ = (id) => document.getElementById(id);


/* =========================================================
   DOM REFERENCES
   ========================================================= */

const productEditor = $("productEditor");

const productList = $("productList");

const emptyState = $("emptyState");

const imageUpload = $("productImageUpload");

const imagePreview = $("imagePreview");

const notification = $("adminNotification");

const notificationText = $("notificationText");

const confirmOverlay = $("confirmOverlay");

const confirmTitle = $("confirmTitle");

const confirmMessage = $("confirmMessage");


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeAdmin
);


function initializeAdmin() {

    loadProducts();

    bindEvents();

    renderProducts();

    updateStatistics();

    updateCategoryFilter();

}


/* =========================================================
   EVENTS
   ========================================================= */

function bindEvents() {

    $("newProductButton")?.addEventListener(
        "click",
        () => openProductEditor()
    );


    $("emptyCreateButton")?.addEventListener(
        "click",
        () => openProductEditor()
    );


    $("closeEditorButton")?.addEventListener(
        "click",
        closeProductEditor
    );


    $("cancelProductButton")?.addEventListener(
        "click",
        closeProductEditor
    );


    $("saveProductButton")?.addEventListener(
        "click",
        saveProduct
    );


    $("productSearch")?.addEventListener(
        "input",
        renderProducts
    );


    $("categoryFilter")?.addEventListener(
        "change",
        renderProducts
    );


    $("statusFilter")?.addEventListener(
        "change",
        renderProducts
    );


    $("backupProductsButton")?.addEventListener(
        "click",
        backupProducts
    );


    $("exportProductsButton")?.addEventListener(
        "click",
        exportProductsJS
    );


    imageUpload?.addEventListener(
        "change",
        handleImageSelection
    );


    setupImageDragAndDrop();


    $("productName")?.addEventListener(
        "input",
        handleProductNameInput
    );


    $("productId")?.addEventListener(
        "input",
        handleManualIdInput
    );


    $("confirmCancel")?.addEventListener(
        "click",
        closeConfirmation
    );


    $("confirmProceed")?.addEventListener(
        "click",
        executeConfirmation
    );


    confirmOverlay?.addEventListener(
        "click",
        (event) => {

            if (
                event.target === confirmOverlay
            ) {

                closeConfirmation();

            }

        }
    );


    document.addEventListener(
        "keydown",
        handleKeyboard
    );

}


/* =========================================================
   LOAD PRODUCTS
   ========================================================= */

function loadProducts() {

    let storedProducts = null;


    try {

        const saved =
            localStorage.getItem(
                STORAGE_KEY
            );


        if (saved) {

            storedProducts =
                JSON.parse(saved);

        }

    } catch (error) {

        console.error(
            "Unable to load Voltica products:",
            error
        );

    }


    if (
        Array.isArray(storedProducts)
    ) {

        products =
            normalizeProductCatalog(
                storedProducts
            );

        return;

    }


    if (
        Array.isArray(
            window.volticaProducts
        )
    ) {

        products =
            normalizeProductCatalog(
                window.volticaProducts
            );

    } else {

        products = [];

    }


    saveProductsToStorage();

}


/* =========================================================
   NORMALIZE ENTIRE CATALOG
   ========================================================= */

function normalizeProductCatalog(
    catalog
) {

    if (
        !Array.isArray(catalog)
    ) {

        return [];

    }


    return catalog.map(
        product =>
            normalizeProduct(
                product
            )
    );

}


/* =========================================================
   NORMALIZE PRODUCT
   ========================================================= */

function normalizeProduct(
    product
) {

    const source =
        product &&
        typeof product === "object"
            ? product
            : {};


    return {

        id:
            cleanText(
                source.id
            ),

        name:
            cleanText(
                source.name
            ),

        category:
            cleanText(
                source.category
            ),

        badge:
            cleanText(
                source.badge
            ),

        sku:
            cleanText(
                source.sku
            ),

        cost:
            numberValue(
                source.cost
            ),

        shipping:
            numberValue(
                source.shipping
            ),

        price:
            numberValue(
                source.price
            ),

        referencePrice:
            numberValue(
                source.referencePrice
            ),

        shortDescription:
            cleanText(
                source.shortDescription
            ),

        description:
            cleanText(
                source.description
            ),

        keyFeatures:
            Array.isArray(
                source.keyFeatures
            )
                ? source.keyFeatures
                    .map(
                        item =>
                            cleanText(item)
                    )
                    .filter(Boolean)
                : [],

        specifications:
            normalizeSpecifications(
                source.specifications
            ),

        colors:
            Array.isArray(
                source.colors
            )
                ? source.colors
                    .map(
                        item =>
                            cleanText(item)
                    )
                    .filter(Boolean)
                : [],

        variants:
            normalizeVariants(
                source.variants
            ),

        images:
            normalizeImages(
                source.images
            ),

        stripeLink:
            cleanText(
                source.stripeLink
            ),

        supplierLink:
            cleanText(
                source.supplierLink
            ),

        active:
            source.active !== false

    };

}


/* =========================================================
   SAVE LOCAL DATABASE
   ========================================================= */

function saveProductsToStorage() {

    try {

        const cleanCatalog =
            products.map(
                product =>
                    normalizeProduct(
                        product
                    )
            );


        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
                cleanCatalog
            )
        );


        /*
         * Notify other Voltica pages/tabs.
         */

        localStorage.setItem(
            STORE_EVENT_KEY,
            String(Date.now())
        );


    } catch (error) {

        console.error(
            "Unable to save Voltica products:",
            error
        );


        showNotification(
            "LOCAL STORAGE ERROR"
        );

    }

}


/* =========================================================
   PRODUCT EDITOR
   ========================================================= */

function openProductEditor(
    product = null
) {

    editingProductId =
        product?.id || null;


    productEditor.hidden = false;


    if (product) {

        $("editorTitle").textContent =
            "EDIT PRODUCT";


        populateEditor(
            product
        );

    } else {

        $("editorTitle").textContent =
            "NEW PRODUCT";


        clearEditor();

    }


    productEditor.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =========================================================
   CLOSE EDITOR
   ========================================================= */

function closeProductEditor() {

    if (
        selectedImages.length
    ) {

        selectedImages.forEach(
            image => {

                if (
                    image.preview
                ) {

                    URL.revokeObjectURL(
                        image.preview
                    );

                }

            }
        );

    }


    selectedImages = [];

    editingProductId = null;

    productEditor.hidden = true;

}


/* =========================================================
   CLEAR EDITOR
   ========================================================= */

function clearEditor() {

    const fields = [

        "productId",
        "productName",
        "productCategory",
        "productSku",
        "productCost",
        "productShipping",
        "productPrice",
        "productReferencePrice",
        "shortDescription",
        "fullDescription",
        "keyFeatures",
        "technicalSpecifications",
        "productColors",
        "productVariants",
        "stripeLink",
        "supplierLink"

    ];


    fields.forEach(
        id => {

            const element =
                $(id);


            if (element) {

                element.value = "";

            }

        }
    );


    if ($("productBadge")) {

        $("productBadge").value = "";

    }


    if ($("productActive")) {

        $("productActive").checked = true;

    }


    selectedImages = [];

    renderImagePreview();

}


/* =========================================================
   POPULATE EDITOR
   ========================================================= */

function populateEditor(
    product
) {

    $("productId").value =
        product.id || "";


    $("productId").dataset.manual =
        "true";


    $("productName").value =
        product.name || "";


    $("productCategory").value =
        product.category || "";


    $("productBadge").value =
        product.badge || "";


    $("productSku").value =
        product.sku || "";


    $("productCost").value =
        product.cost ?? "";


    $("productShipping").value =
        product.shipping ?? "";


    $("productPrice").value =
        product.price ?? "";


    $("productReferencePrice").value =
        product.referencePrice ?? "";


    $("shortDescription").value =
        product.shortDescription || "";


    $("fullDescription").value =
        product.description || "";


    $("keyFeatures").value =
        arrayToLines(
            product.keyFeatures
        );


    $("technicalSpecifications").value =
        specificationsToText(
            product.specifications
        );


    $("productColors").value =
        arrayToCommaList(
            product.colors
        );


    $("productVariants").value =
        variantsToText(
            product.variants
        );


    $("stripeLink").value =
        product.stripeLink || "";


    $("supplierLink").value =
        product.supplierLink || "";


    $("productActive").checked =
        product.active !== false;


    selectedImages =
        normalizeImages(
            product.images
        );


    renderImagePreview();

}


/* =========================================================
   PRODUCT NAME → ID
   ========================================================= */

function handleProductNameInput() {

    if (
        editingProductId
    ) {

        return;

    }


    const idField =
        $("productId");


    if (!idField) {

        return;

    }


    if (
        idField.dataset.manual ===
        "true"
    ) {

        return;

    }


    const name =
        $("productName")?.value || "";


    idField.value =
        slugify(name);

}


/* =========================================================
   MANUAL ID
   ========================================================= */

function handleManualIdInput() {

    const field =
        $("productId");


    if (!field) {

        return;

    }


    field.dataset.manual =
        "true";

}


/* =========================================================
   SAVE PRODUCT
   ========================================================= */

function saveProduct() {

    const product =
        buildProductFromEditor();


    if (!product.name) {

        showNotification(
            "PRODUCT NAME REQUIRED"
        );


        $("productName")?.focus();


        return;

    }


    if (
        product.price <= 0
    ) {

        showNotification(
            "PRODUCT PRICE REQUIRED"
        );


        $("productPrice")?.focus();


        return;

    }


    /*
     * Prevent accidental duplicate IDs.
     */

    const duplicateId =
        products.some(
            item =>
                item.id === product.id &&
                item.id !== editingProductId
        );


    if (duplicateId) {

        showNotification(
            "PRODUCT ID ALREADY EXISTS"
        );


        $("productId")?.focus();


        return;

    }


    if (
        editingProductId
    ) {

        const index =
            products.findIndex(
                item =>
                    item.id ===
                    editingProductId
            );


        if (index !== -1) {

            products[index] =
                product;


            showNotification(
                "PRODUCT UPDATED"
            );

        }

    } else {

        products.push(
            product
        );


        showNotification(
            "PRODUCT CREATED"
        );

    }


    /*
     * This is the important bridge:
     *
     * ADMIN
     * ↓
     * LOCAL DATABASE
     * ↓
     * STORE
     */

    saveProductsToStorage();


    renderProducts();

    updateStatistics();

    updateCategoryFilter();

    closeProductEditor();

}


/* =========================================================
   BUILD PRODUCT OBJECT
   ========================================================= */

function buildProductFromEditor() {

    const name =
        cleanText(
            $("productName")?.value
        );


    let id =
        cleanText(
            $("productId")?.value
        );


    if (!id) {

        id =
            slugify(name);

    }


    const product = {

        id,

        name,

        category:
            cleanText(
                $("productCategory")?.value
            ),

        badge:
            cleanText(
                $("productBadge")?.value
            ),

        sku:
            cleanText(
                $("productSku")?.value
            ),

        cost:
            numberValue(
                $("productCost")?.value
            ),

        shipping:
            numberValue(
                $("productShipping")?.value
            ),

        price:
            numberValue(
                $("productPrice")?.value
            ),

        referencePrice:
            numberValue(
                $("productReferencePrice")?.value
            ),

        shortDescription:
            cleanText(
                $("shortDescription")?.value
            ),

        description:
            cleanText(
                $("fullDescription")?.value
            ),

        keyFeatures:
            linesToArray(
                $("keyFeatures")?.value
            ),

        specifications:
            textToSpecifications(
                $("technicalSpecifications")?.value
            ),

        colors:
            commaListToArray(
                $("productColors")?.value
            ),

        variants:
            linesToVariants(
                $("productVariants")?.value
            ),

        images:
            normalizeImages(
                selectedImages
            ).map(
                image => ({
                    name:
                        image.name,

                    path:
                        image.path
                })
            ),

        stripeLink:
            cleanText(
                $("stripeLink")?.value
            ),

        supplierLink:
            cleanText(
                $("supplierLink")?.value
            ),

        active:
            Boolean(
                $("productActive")?.checked
            )

    };


    return product;

}


/* =========================================================
   DELETE PRODUCT
   ========================================================= */

function deleteProduct(
    productId
) {

    const product =
        products.find(
            item =>
                item.id === productId
        );


    if (!product) {

        return;

    }


    openConfirmation(
        "DELETE PRODUCT",
        `Delete "${product.name}" from the local catalog?`,
        () => {

            products =
                products.filter(
                    item =>
                        item.id !==
                        productId
                );


            saveProductsToStorage();

            renderProducts();

            updateStatistics();

            updateCategoryFilter();

            showNotification(
                "PRODUCT DELETED"
            );

        }
    );

}


/* =========================================================
   DUPLICATE PRODUCT
   ========================================================= */

function duplicateProduct(
    productId
) {

    const original =
        products.find(
            item =>
                item.id === productId
        );


    if (!original) {

        return;

    }


    const copy =
        JSON.parse(
            JSON.stringify(
                normalizeProduct(
                    original
                )
            )
        );


    copy.id =
        generateUniqueId(
            `${original.id}-copy`
        );


    copy.name =
        `${original.name} — Copy`;


    products.push(
        copy
    );


    saveProductsToStorage();

    renderProducts();

    updateStatistics();

    updateCategoryFilter();

    showNotification(
        "PRODUCT DUPLICATED"
    );

}


/* =========================================================
   TOGGLE PRODUCT
   ========================================================= */

function toggleProductStatus(
    productId
) {

    const product =
        products.find(
            item =>
                item.id === productId
        );


    if (!product) {

        return;

    }


    product.active =
        product.active === false;


    saveProductsToStorage();

    renderProducts();

    updateStatistics();

    showNotification(
        product.active
            ? "PRODUCT ACTIVATED"
            : "PRODUCT DEACTIVATED"
    );

}


/* =========================================================
   RENDER PRODUCTS
   ========================================================= */

function renderProducts() {

    if (!productList) {

        return;

    }


    const search =
        (
            $("productSearch")?.value ||
            ""
        )
        .trim()
        .toLowerCase();


    const category =
        $("categoryFilter")?.value ||
        "all";


    const status =
        $("statusFilter")?.value ||
        "all";


    const filtered =
        products.filter(
            product => {

                const searchable =
                    [

                        product.name,
                        product.id,
                        product.category,
                        product.sku

                    ]
                    .join(" ")
                    .toLowerCase();


                const matchesSearch =
                    !search ||
                    searchable.includes(
                        search
                    );


                const matchesCategory =
                    category === "all" ||
                    product.category ===
                    category;


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


    productList.innerHTML = "";


    if (
        filtered.length === 0
    ) {

        productList.hidden = true;


        if (emptyState) {

            emptyState.hidden = false;

        }


        return;

    }


    productList.hidden = false;


    if (emptyState) {

        emptyState.hidden = true;

    }


    filtered.forEach(
        product => {

            productList.appendChild(
                createProductListItem(
                    product
                )
            );

        }
    );

}


/* =========================================================
   PRODUCT LIST ITEM
   ========================================================= */

function createProductListItem(
    product
) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "product-list-item";


    const image =
        getFirstImage(
            product
        );


    article.innerHTML = `

        <div class="product-list-image">

            ${
                image
                    ? `
                        <img
                            src="${escapeAttribute(image)}"
                            alt="${escapeAttribute(product.name || "Product")}"
                            loading="lazy"
                            onerror="this.style.opacity='0.15'"
                        >
                    `
                    : `
                        <div class="product-image-empty">
                            NO IMAGE
                        </div>
                    `
            }

        </div>


        <div class="product-list-info">

            <small>
                ${escapeHTML(
                    product.category ||
                    "UNCATEGORIZED"
                )}
            </small>

            <h3>
                ${escapeHTML(
                    product.name ||
                    "Unnamed Product"
                )}
            </h3>

            <p>
                SKU:
                ${escapeHTML(
                    product.sku ||
                    "NOT AVAILABLE"
                )}
            </p>

            <div class="product-list-price">

                ${formatPrice(
                    product.price
                )}

            </div>

            <div
                class="product-status ${
                    product.active !== false
                        ? "active"
                        : ""
                }"
            >

                ${
                    product.active !== false
                        ? "ACTIVE"
                        : "INACTIVE"
                }

            </div>

        </div>


        <div class="product-list-actions">

            <button
                type="button"
                data-action="edit"
                data-id="${escapeAttribute(product.id)}"
            >
                EDIT
            </button>


            <button
                type="button"
                data-action="duplicate"
                data-id="${escapeAttribute(product.id)}"
            >
                DUPLICATE
            </button>


            <button
                type="button"
                data-action="toggle"
                data-id="${escapeAttribute(product.id)}"
            >
                ${
                    product.active !== false
                        ? "DISABLE"
                        : "ENABLE"
                }
            </button>


            <button
                type="button"
                class="delete-product"
                data-action="delete"
                data-id="${escapeAttribute(product.id)}"
            >
                DELETE
            </button>

        </div>

    `;


    const buttons =
        article.querySelectorAll(
            "[data-action]"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    handleProductAction(
                        button.dataset.action,
                        button.dataset.id
                    );

                }
            );

        }
    );


    return article;

}


/* =========================================================
   PRODUCT ACTION ROUTER
   ========================================================= */

function handleProductAction(
    action,
    productId
) {

    const product =
        products.find(
            item =>
                item.id === productId
        );


    if (!product) {

        return;

    }


    switch (action) {

        case "edit":

            openProductEditor(
                product
            );

            break;


        case "duplicate":

            duplicateProduct(
                productId
            );

            break;


        case "toggle":

            toggleProductStatus(
                productId
            );

            break;


        case "delete":

            deleteProduct(
                productId
            );

            break;

    }

}


/* =========================================================
   IMAGE SELECTION
   ========================================================= */

function handleImageSelection(
    event
) {

    const files =
        Array.from(
            event.target.files || []
        );


    addImageFiles(
        files
    );


    /*
     * Allows selecting the same file again.
     */

    event.target.value = "";

}


/* =========================================================
   ADD IMAGE FILES
   ========================================================= */

function addImageFiles(
    files
) {

    files.forEach(
        file => {

            if (
                !file ||
                !file.type.startsWith(
                    "image/"
                )
            ) {

                return;

            }


            /*
             * Preserve the original filename.
             *
             * Example:
             *
             * q451-1.webp
             *
             * becomes:
             *
             * assets/images/q451-1.webp
             */

            const filename =
                file.name;


            const path =
                buildImagePath(
                    filename
                );


            const alreadyExists =
                selectedImages.some(
                    image =>
                        image.name
                            .toLowerCase() ===
                        filename
                            .toLowerCase()
                );


            if (
                alreadyExists
            ) {

                return;

            }


            selectedImages.push({

                name:
                    filename,

                path,

                file,

                preview:
                    URL.createObjectURL(
                        file
                    )

            });

        }
    );


    renderImagePreview();

}


/* =========================================================
   BUILD IMAGE PATH
   ========================================================= */

function buildImagePath(
    filename
) {

    const cleanFilename =
        String(
            filename || ""
        )
        .split("\\")
        .pop()
        .split("/")
        .pop()
        .trim();


    if (!cleanFilename) {

        return "";

    }


    return (
        IMAGE_BASE_PATH +
        cleanFilename
    );

}


/* =========================================================
   IMAGE DRAG & DROP
   ========================================================= */

function setupImageDragAndDrop() {

    const uploadArea =
        $("imageUploadSquare");


    if (!uploadArea) {

        return;

    }


    [
        "dragenter",
        "dragover"
    ]
    .forEach(
        eventName => {

            uploadArea.addEventListener(
                eventName,
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    uploadArea.classList.add(
                        "drag-over"
                    );

                }
            );

        }
    );


    [
        "dragleave",
        "drop"
    ]
    .forEach(
        eventName => {

            uploadArea.addEventListener(
                eventName,
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    uploadArea.classList.remove(
                        "drag-over"
                    );

                }
            );

        }
    );


    uploadArea.addEventListener(
        "drop",
        event => {

            const files =
                Array.from(
                    event
                        .dataTransfer
                        .files || []
                );


            addImageFiles(
                files
            );

        }
    );

}


/* =========================================================
   IMAGE PREVIEW
   ========================================================= */

function renderImagePreview() {

    if (!imagePreview) {

        return;

    }


    imagePreview.innerHTML = "";


    if (
        selectedImages.length === 0
    ) {

        imagePreview.innerHTML = `

            <div class="image-preview-empty">
                NO IMAGES SELECTED
            </div>

        `;

        return;

    }


    selectedImages.forEach(
        (image, index) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "image-preview-item";


            const previewSource =
                image.preview ||
                image.path;


            item.innerHTML = `

                <img
                    src="${escapeAttribute(
                        previewSource
                    )}"
                    alt="${escapeAttribute(
                        image.name
                    )}"
                >


                <span
                    class="image-preview-index"
                >
                    ${index + 1}
                </span>


                <button
                    type="button"
                    class="image-preview-remove"
                    aria-label="Remove ${escapeAttribute(
                        image.name
                    )}"
                >
                    ×
                </button>


                <span
                    class="image-preview-name"
                    title="${escapeAttribute(
                        image.name
                    )}"
                >
                    ${escapeHTML(
                        image.name
                    )}
                </span>

            `;


            item
                .querySelector(
                    ".image-preview-remove"
                )
                .addEventListener(
                    "click",
                    () => {

                        removeImage(
                            index
                        );

                    }
                );


            imagePreview.appendChild(
                item
            );

        }
    );

}


/* =========================================================
   REMOVE IMAGE
   ========================================================= */

function removeImage(
    index
) {

    const image =
        selectedImages[index];


    if (
        image?.preview
    ) {

        URL.revokeObjectURL(
            image.preview
        );

    }


    selectedImages.splice(
        index,
        1
    );


    renderImagePreview();

}


/* =========================================================
   STATISTICS
   ========================================================= */

function updateStatistics() {

    const active =
        products.filter(
            product =>
                product.active !== false
        ).length;


    const categories =
        new Set(
            products
                .map(
                    product =>
                        product.category
                )
                .filter(Boolean)
        ).size;


    if ($("totalProducts")) {

        $("totalProducts").textContent =
            products.length;

    }


    if ($("activeProducts")) {

        $("activeProducts").textContent =
            active;

    }


    if ($("totalCategories")) {

        $("totalCategories").textContent =
            categories;

    }

}


/* =========================================================
   CATEGORY FILTER
   ========================================================= */

function updateCategoryFilter() {

    const select =
        $("categoryFilter");


    if (!select) {

        return;

    }


    const current =
        select.value;


    const categories =
        [
            ...new Set(
                products
                    .map(
                        product =>
                            product.category
                    )
                    .filter(Boolean)
            )
        ]
        .sort(
            (a,
