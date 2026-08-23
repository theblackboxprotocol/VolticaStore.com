/* =========================================================
   VOLTICA STORE
   ADMIN PRODUCT MANAGER
   ========================================================= */

"use strict";


/* =========================================================
   CONFIGURATION
   ========================================================= */

const IMAGE_BASE_PATH = "assets/images/";

const STORAGE_KEY = "voltica_products_admin";

let products = [];

let editingProductId = null;

let selectedImages = [];

let pendingConfirmAction = null;


/* =========================================================
   DOM HELPERS
   ========================================================= */

const $ = (id) => document.getElementById(id);

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
            localStorage.getItem(STORAGE_KEY);

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
            storedProducts;

        return;

    }


    /*
     * If products.js already contains
     * volticaProducts, use it as the
     * initial catalog.
     */

    if (
        Array.isArray(
            window.volticaProducts
        )
    ) {

        products =
            JSON.parse(
                JSON.stringify(
                    window.volticaProducts
                )
            );

    } else {

        products = [];

    }


    saveProductsToStorage();

}


/* =========================================================
   SAVE LOCAL DATABASE
   ========================================================= */

function saveProductsToStorage() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(products)
        );

    } catch (error) {

        console.error(
            "Unable to save products:",
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

        populateEditor(product);

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


function closeProductEditor() {

    productEditor.hidden = true;

    editingProductId = null;

    selectedImages = [];

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
        (id) => {

            const element = $(id);

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

function populateEditor(product) {

    $("productId").value =
        product.id || "";


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

    if (editingProductId) {

        return;

    }


    const name =
        $("productName")?.value || "";


    if (
        !$("productId")
    ) {

        return;

    }


    if (
        $("productId").dataset.manual === "true"
    ) {

        return;

    }


    $("productId").value =
        slugify(name);

}


/* =========================================================
   MANUAL ID DETECTION
   ========================================================= */

$("productId")?.addEventListener(
    "input",
    () => {

        $("productId").dataset.manual =
            "true";

    }
);


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


    if (!product.price) {

        showNotification(
            "PRODUCT PRICE REQUIRED"
        );

        $("productPrice")?.focus();

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

        products.push(product);

        showNotification(
            "PRODUCT CREATED"
        );

    }


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

function deleteProduct(productId) {

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

function duplicateProduct(productId) {

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
            JSON.stringify(original)
        );


    copy.id =
        generateUniqueId(
            `${original.id}-copy`
        );


    copy.name =
        `${original.name} — Copy`;


    products.push(copy);

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

function toggleProductStatus(productId) {

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
            $("productSearch")?.value || ""
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
                    searchable.includes(search);


                const matchesCategory =
                    category === "all" ||
                    product.category === category;


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
                createProductListItem(product)
            );

        }
    );

}


/* =========================================================
   PRODUCT LIST ITEM
   ========================================================= */

function createProductListItem(product) {

    const article =
        document.createElement("article");


    article.className =
        "product-list-item";


    const image =
        getFirstImage(product);


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
                    : ""
            }

        </div>


        <div class="product-list-info">

            <small>
                ${escapeHTML(product.category || "UNCATEGORIZED")}
            </small>

            <h3>
                ${escapeHTML(product.name || "Unnamed Product")}
            </h3>

            <p>
                SKU:
                ${escapeHTML(product.sku || "NOT AVAILABLE")}
            </p>

            <div class="product-list-price">

                ${formatPrice(product.price)}

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

                    const action =
                        button.dataset.action;

                    const id =
                        button.dataset.id;


                    handleProductAction(
                        action,
                        id
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

function handleImageSelection(event) {

    const files =
        Array.from(
            event.target.files || []
        );


    addImageFiles(files);


    /*
     * Reset input so selecting the
     * same file again still triggers
     * the change event.
     */

    event.target.value = "";

}


function addImageFiles(files) {

    files.forEach(
        file => {

            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                return;

            }


            const alreadyExists =
                selectedImages.some(
                    image =>
                        image.name ===
                        file.name
                );


            if (
                alreadyExists
            ) {

                return;

            }


            selectedImages.push({

                name:
                    file.name,

                path:
                    IMAGE_BASE_PATH +
                    file.name,

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
                    event.dataTransfer.files || []
                );


            addImageFiles(files);

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
                document.createElement("div");


            item.className =
                "image-preview-item";


            const previewSource =
                image.preview ||
                image.path;


            item.innerHTML = `

                <img
                    src="${escapeAttribute(previewSource)}"
                    alt="${escapeAttribute(image.name)}"
                >


                <span
                    class="image-preview-index"
                >
                    ${index + 1}
                </span>


                <button
                    type="button"
                    class="image-preview-remove"
                    aria-label="Remove ${escapeAttribute(image.name)}"
                >
                    ×
                </button>


                <span
                    class="image-preview-name"
                    title="${escapeAttribute(image.name)}"
                >
                    ${escapeHTML(image.name)}
                </span>

            `;


            item
                .querySelector(
                    ".image-preview-remove"
                )
                .addEventListener(
                    "click",
                    () => {

                        removeImage(index);

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

function removeImage(index) {

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
                    .sort(
                        (a, b) =>
                            a.localeCompare(b)
                    )
            )
        ];


    select.innerHTML = `

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


            select.appendChild(
                option
            );

        }
    );


    if (
        categories.includes(current)
    ) {

        select.value =
            current;

    }

}


/* =========================================================
   BACKUP
   ========================================================= */

function backupProducts() {

    const data =
        JSON.stringify(
            products,
            null,
            4
        );


    downloadFile(
        data,
        "voltica-products-backup.json",
        "application/json"
    );


    showNotification(
        "DATABASE BACKUP CREATED"
    );

}


/* =========================================================
   EXPORT PRODUCTS.JS
   ========================================================= */

function exportProductsJS() {

    const output =
        generateProductsJS();


    downloadFile(
        output,
        "products.js",
        "application/javascript"
    );


    showNotification(
        "PRODUCTS.JS EXPORTED"
    );

}


/* =========================================================
   GENERATE PRODUCTS.JS
   ========================================================= */

function generateProductsJS() {

    const serialized =
        products
            .map(
                product =>
                    formatProductForJS(
                        product
                    )
            )
            .join(
                ",\n\n"
            );


    return `/* =========================================================
   VOLTICA STORE
   PRODUCT DATABASE
   Generated by Admin Product Manager
   ========================================================= */

const volticaProducts = [

${serialized}

];

`;
}


/* =========================================================
   FORMAT PRODUCT FOR JS
   ========================================================= */

function formatProductForJS(product) {

    const cleanProduct = {

        id:
            product.id || "",

        name:
            product.name || "",

        category:
            product.category || "",

        badge:
            product.badge || "",

        sku:
            product.sku || "",

        cost:
            product.cost || 0,

        shipping:
            product.shipping || 0,

        price:
            product.price || 0,

        referencePrice:
            product.referencePrice || 0,

        shortDescription:
            product.shortDescription || "",

        description:
            product.description || "",

        keyFeatures:
            product.keyFeatures || [],

        specifications:
            product.specifications || {},

        colors:
            product.colors || [],

        variants:
            product.variants || [],

        images:
            normalizeImages(
                product.images
            ).map(
                image =>
                    typeof image === "string"
                        ? image
                        : image.path
            ),

        stripeLink:
            product.stripeLink || "",

        supplierLink:
            product.supplierLink || "",

        active:
            product.active !== false

    };


    return `    ${JSON.stringify(
        cleanProduct,
        null,
        4
    )
    .replace(
        /^/gm,
        "    "
    )
    .trim()
    }`;

}


/* =========================================================
   CONFIRMATION
   ========================================================= */

function openConfirmation(
    title,
    message,
    action
) {

    pendingConfirmAction =
        action;


    if (confirmTitle) {

        confirmTitle.textContent =
            title;

    }


    if (confirmMessage) {

        confirmMessage.textContent =
            message;

    }


    if (confirmOverlay) {

        confirmOverlay.hidden =
            false;

    }

}


function closeConfirmation() {

    pendingConfirmAction =
        null;


    if (confirmOverlay) {

        confirmOverlay.hidden =
            true;

    }

}


function executeConfirmation() {

    if (
        typeof pendingConfirmAction ===
        "function"
    ) {

        const action =
            pendingConfirmAction;

        closeConfirmation();

        action();

        return;

    }


    closeConfirmation();

}


/* =========================================================
   NOTIFICATIONS
   ========================================================= */

let notificationTimer = null;


function showNotification(
    message
) {

    if (
        !notification ||
        !notificationText
    ) {

        return;

    }


    notificationText.textContent =
        message;


    notification.classList.add(
        "show"
    );


    clearTimeout(
        notificationTimer
    );


    notificationTimer =
        setTimeout(
            () => {

                notification.classList.remove(
                    "show"
                );

            },
            2600
        );

}


/* =========================================================
   KEYBOARD
   ========================================================= */

function handleKeyboard(event) {

    if (
        event.key === "Escape"
    ) {

        if (
            confirmOverlay &&
            !confirmOverlay.hidden
        ) {

            closeConfirmation();

            return;

        }


        if (
            productEditor &&
            !productEditor.hidden
        ) {

            closeProductEditor();

        }

    }


    if (
        (
            event.ctrlKey ||
            event.metaKey
        ) &&
        event.key.toLowerCase() === "s"
    ) {

        event.preventDefault();

        if (
            productEditor &&
            !productEditor.hidden
        ) {

            saveProduct();

        }

    }

}


/* =========================================================
   TEXT HELPERS
   ========================================================= */

function cleanText(value) {

    return String(
        value ?? ""
    ).trim();

}


function numberValue(value) {

    const number =
        parseFloat(value);


    if (
        Number.isNaN(number)
    ) {

        return 0;

    }


    return Number(
        number.toFixed(2)
    );

}


function slugify(value) {

    return cleanText(value)
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .replace(
            /[^a-z0-9]+/g,
            "-"
        )
        .replace(
            /^-+|-+$/g,
            ""
        );

}


function generateUniqueId(
    base
) {

    let id =
        slugify(base) ||
        "product";


    let counter = 2;

    while (
        products.some(
            product =>
                product.id === id
        )
    ) {

        id =
            `${slugify(base)}-${counter}`;

        counter++;

    }


    return id;

}


/* =========================================================
   ARRAY HELPERS
   ========================================================= */

function linesToArray(value) {

    return cleanText(value)
        .split(/\r?\n/)
        .map(
            item =>
                item.trim()
        )
        .filter(Boolean);

}


function arrayToLines(value) {

    if (
        !Array.isArray(value)
    ) {

        return "";

    }


    return value.join("\n");

}


function commaListToArray(value) {

    return cleanText(value)
        .split(",")
        .map(
            item =>
                item.trim()
        )
        .filter(Boolean);

}


function arrayToCommaList(value) {

    if (
        !Array.isArray(value)
    ) {

        return "";

    }


    return value.join(", ");

}


function textToSpecifications(
    value
) {

    const lines =
        linesToArray(value);


    const result = {};


    lines.forEach(
        line => {

            const separator =
                line.indexOf(":");


            if (
                separator === -1
            ) {

                result[line] = "";

                return;

            }


            const key =
                line
                    .slice(
                        0,
                        separator
                    )
                    .trim();


            const val =
                line
                    .slice(
                        separator + 1
                    )
                    .trim();


            if (key) {

                result[key] =
                    val;

            }

        }
    );


    return result;

}


function specificationsToText(
    specifications
) {

    if (
        !specifications
    ) {

        return "";

    }


    if (
        Array.isArray(
            specifications
        )
    ) {

        return specifications.join(
            "\n"
        );

    }


    if (
        typeof specifications !==
        "object"
    ) {

        return "";

    }


    return Object.entries(
        specifications
    )
    .map(
        ([key, value]) =>
            `${key}: ${value}`
    )
    .join("\n");

}


function linesToVariants(
    value
) {

    return linesToArray(
        value
    ).map(
        line => {

            const separator =
                line.indexOf("—") !== -1
                    ? "—"
                    : line.indexOf("-");


            if (
                separator === -1
            ) {

                return {

                    name: line,
                    sku: ""

                };

            }


            const parts =
                line.split(
                    separator === "—"
                        ? "—"
                        : "-"
                );


            return {

                name:
                    cleanText(
                        parts.shift()
                    ),

                sku:
                    cleanText(
                        parts.join("-")
                    )

            };

        }
    );

}


function variantsToText(
    variants
) {

    if (
        !Array.isArray(variants)
    ) {

        return "";

    }


    return variants
        .map(
            variant => {

                if (
                    typeof variant ===
                    "string"
                ) {

                    return variant;

                }


                return `${variant.name || ""} — ${variant.sku || ""}`
                    .trim();

            }
        )
        .filter(Boolean)
        .join("\n");

}


/* =========================================================
   IMAGE NORMALIZATION
   ========================================================= */

function normalizeImages(
    images
) {

    if (
        !Array.isArray(images)
    ) {

        return [];

    }


    return images
        .map(
            image => {

                if (
                    typeof image ===
                    "string"
                ) {

                    return {

                        name:
                            image
                                .split("/")
                                .pop(),

                        path:
                            image,

                        preview:
                            null

                    };

                }


                return {

                    name:
                        image.name ||
                        image.path
                            ?.split("/")
                            .pop() ||
                            "",

                    path:
                        image.path ||
                        (
                            IMAGE_BASE_PATH +
                            (
                                image.name || ""
                            )
                        ),

                    preview:
                        image.preview ||
                        null

                };

            }
        )
        .filter(
            image =>
                Boolean(
                    image.name
                )
        );

}


/* =========================================================
   IMAGE HELPERS
   ========================================================= */

function getFirstImage(
    product
) {

    const images =
        normalizeImages(
            product.images
        );


    return images.length
        ? images[0].path
        : "";

}


/* =========================================================
   FORMAT PRICE
   ========================================================= */

function formatPrice(
    value
) {

    const number =
        Number(value);


    if (
        Number.isNaN(number) ||
        number <= 0
    ) {

        return "$0.00 USD";

    }


    return (
        "$" +
        number.toFixed(2) +
        " USD"
    );

}


/* =========================================================
   HTML ESCAPING
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
   DOWNLOAD
   ========================================================= */

function downloadFile(
    content,
    filename,
    mimeType
) {

    const blob =
        new Blob(
            [content],
            {
                type:
                    mimeType
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


    setTimeout(
        () => {

            URL.revokeObjectURL(
                url
            );

        },
        1000
    );

}


/* =========================================================
   INITIAL GLOBAL ACCESS
   ========================================================= */

window.VolticaAdmin = {

    getProducts() {

        return products;

    },


    saveProducts() {

        saveProductsToStorage();

    },


    exportProducts() {

        exportProductsJS();

    },


    openEditor(
        product
    ) {

        openProductEditor(
            product
        );

    }

};
