/* =========================================================
   VOLTICA STORE
   ADMIN PRODUCT MANAGER
   PRODUCT DATABASE ENGINE
   ========================================================= */


/* =========================================================
   GLOBAL STATE
   ========================================================= */

let adminProducts = [];
let editingProductId = null;
let selectedImages = [];

const imagePreviewSources = new Map();

let confirmCallback = null;
let notificationTimer = null;


/* =========================================================
   DOM REFERENCES
   ========================================================= */

const $ = id => document.getElementById(id);

const productEditor =
    $("productEditor");

const editorTitle =
    $("editorTitle");

const productId =
    $("productId");

const productName =
    $("productName");

const productCategory =
    $("productCategory");

const productBadge =
    $("productBadge");

const productSku =
    $("productSku");

const productCost =
    $("productCost");

const productShipping =
    $("productShipping");

const productPrice =
    $("productPrice");

const productReferencePrice =
    $("productReferencePrice");

const shortDescription =
    $("shortDescription");

const fullDescription =
    $("fullDescription");

const keyFeatures =
    $("keyFeatures");

const technicalSpecifications =
    $("technicalSpecifications");

const productImageUpload =
    $("productImageUpload");

const imageUploadSquare =
    $("imageUploadSquare");

const imagePreview =
    $("imagePreview");

const productColors =
    $("productColors");

const productVariants =
    $("productVariants");

const stripeLink =
    $("stripeLink");

const supplierLink =
    $("supplierLink");

const productActive =
    $("productActive");

const productList =
    $("productList");

const emptyState =
    $("emptyState");

const productSearch =
    $("productSearch");

const categoryFilter =
    $("categoryFilter");

const statusFilter =
    $("statusFilter");

const totalProducts =
    $("totalProducts");

const activeProducts =
    $("activeProducts");

const totalCategories =
    $("totalCategories");

const adminNotification =
    $("adminNotification");

const notificationText =
    $("notificationText");

const confirmOverlay =
    $("confirmOverlay");

const confirmTitle =
    $("confirmTitle");

const confirmMessage =
    $("confirmMessage");

const confirmCancel =
    $("confirmCancel");

const confirmProceed =
    $("confirmProceed");


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

    populateCategoryFilter();

    renderProducts();

    updateStatistics();

    showNotification(
        "SYSTEM READY"
    );

}


/* =========================================================
   LOAD DATABASE
   ========================================================= */

function loadProducts() {

    /*
       IMPORTANT:

       The public product database is exposed through:

       window.volticaProducts

       This keeps the database globally available to:

       - store.js
       - product.html
       - product-view.html
       - adminproductmanager.js
    */

    if (
        Array.isArray(
            window.volticaProducts
        )
    ) {

        try {

            adminProducts =
                JSON.parse(
                    JSON.stringify(
                        window.volticaProducts
                    )
                );

        } catch (error) {

            console.error(
                "VOLTICA: Unable to clone product database.",
                error
            );

            adminProducts = [];

        }

    } else {

        adminProducts = [];

        console.warn(
            "VOLTICA: window.volticaProducts was not found."
        );

    }

}


/* =========================================================
   EVENT BINDING
   ========================================================= */

function bindEvents() {

    $("newProductButton")
        ?.addEventListener(
            "click",
            createNewProduct
        );


    $("emptyCreateButton")
        ?.addEventListener(
            "click",
            createNewProduct
        );


    $("closeEditorButton")
        ?.addEventListener(
            "click",
            closeEditor
        );


    $("cancelProductButton")
        ?.addEventListener(
            "click",
            closeEditor
        );


    $("saveProductButton")
        ?.addEventListener(
            "click",
            saveProduct
        );


    $("backupProductsButton")
        ?.addEventListener(
            "click",
            backupDatabase
        );


    $("exportProductsButton")
        ?.addEventListener(
            "click",
            exportProductsJS
        );


    productSearch
        ?.addEventListener(
            "input",
            renderProducts
        );


    categoryFilter
        ?.addEventListener(
            "change",
            renderProducts
        );


    statusFilter
        ?.addEventListener(
            "change",
            renderProducts
        );


    productName
        ?.addEventListener(
            "input",
            handleProductNameInput
        );


    productImageUpload
        ?.addEventListener(
            "change",
            handleImageSelection
        );


    confirmCancel
        ?.addEventListener(
            "click",
            closeConfirmation
        );


    confirmProceed
        ?.addEventListener(
            "click",
            executeConfirmation
        );


    bindDragAndDrop();

}


/* =========================================================
   DRAG & DROP
   ========================================================= */

function bindDragAndDrop() {

    if (!imageUploadSquare) {
        return;
    }


    imageUploadSquare.addEventListener(
        "dragenter",
        handleDragEnter
    );


    imageUploadSquare.addEventListener(
        "dragover",
        handleDragEnter
    );


    imageUploadSquare.addEventListener(
        "dragleave",
        handleDragLeave
    );


    imageUploadSquare.addEventListener(
        "drop",
        handleImageDrop
    );

}


function handleDragEnter(event) {

    event.preventDefault();

    imageUploadSquare?.classList.add(
        "drag-over"
    );

}


function handleDragLeave(event) {

    event.preventDefault();

    imageUploadSquare?.classList.remove(
        "drag-over"
    );

}


function handleImageDrop(event) {

    event.preventDefault();

    imageUploadSquare?.classList.remove(
        "drag-over"
    );


    const files =
        Array.from(
            event.dataTransfer?.files || []
        );


    addImageFiles(files);

}


/* =========================================================
   PRODUCT NAME → ID
   ========================================================= */

function handleProductNameInput() {

    /*
       Never change the ID of an existing product.
    */

    if (
        editingProductId !== null
    ) {

        return;

    }


    productId.value =
        slugify(
            productName.value
        );

}


function slugify(value) {

    return String(value || "")
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .replace(
            /[^a-z0-9]+/g,
            "-"
        )
        .replace(
            /^-+|-+$/g,
            "");

}


/* =========================================================
   CREATE NEW PRODUCT
   ========================================================= */

function createNewProduct() {

    editingProductId = null;

    selectedImages = [];

    imagePreviewSources.clear();

    clearEditor();

    editorTitle.textContent =
        "NEW PRODUCT";

    productEditor.hidden = false;

    renderImagePreview();

    scrollToEditor();

    setTimeout(
        () => productName?.focus(),
        250
    );

}


function scrollToEditor() {

    productEditor?.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =========================================================
   EDIT PRODUCT
   ========================================================= */

function editProduct(id) {

    const product =
        findProduct(id);


    if (!product) {

        showNotification(
            "PRODUCT NOT FOUND"
        );

        return;

    }


    editingProductId =
        product.id;


    selectedImages =
        Array.isArray(product.images)
            ? product.images
                .map(normalizeImagePath)
                .filter(Boolean)
            : [];


    populateEditor(product);

    editorTitle.textContent =
        "EDIT PRODUCT";

    productEditor.hidden = false;

    renderImagePreview();

    scrollToEditor();

}


/* =========================================================
   FIND PRODUCT
   ========================================================= */

function findProduct(id) {

    return adminProducts.find(
        product =>
            String(product.id) ===
            String(id)
    );

}


/* =========================================================
   POPULATE EDITOR
   ========================================================= */

function populateEditor(product) {

    productId.value =
        product.id || "";

    productName.value =
        product.name || "";

    productCategory.value =
        product.category || "";

    productBadge.value =
        product.badge || "";

    productSku.value =
        product.sku || "";


    productCost.value =
        valueOrEmpty(
            product.cost
        );


    productShipping.value =
        valueOrEmpty(
            product.shipping
        );


    productPrice.value =
        valueOrEmpty(
            product.price
        );


    productReferencePrice.value =
        valueOrEmpty(
            product.referencePrice
        );


    shortDescription.value =
        product.shortDescription || "";


    fullDescription.value =
        product.description ||
        product.fullDescription ||
        "";


    keyFeatures.value =
        arrayToLines(
            product.features ||
            product.keyFeatures
        );


    technicalSpecifications.value =
        objectToLines(
            product.specifications ||
            product.technicalSpecifications
        );


    productColors.value =
        arrayToCommaList(
            product.colors
        );


    productVariants.value =
        variantsToLines(
            product.variants
        );


    stripeLink.value =
        product.stripeLink || "";


    supplierLink.value =
        product.supplierLink || "";


    productActive.checked =
        product.active !== false;

}


function valueOrEmpty(value) {

    return (
        value === undefined ||
        value === null
    )
        ? ""
        : value;

}


/* =========================================================
   CLEAR EDITOR
   ========================================================= */

function clearEditor() {

    productId.value = "";
    productName.value = "";
    productCategory.value = "";
    productBadge.value = "";
    productSku.value = "";

    productCost.value = "";
    productShipping.value = "";
    productPrice.value = "";
    productReferencePrice.value = "";

    shortDescription.value = "";
    fullDescription.value = "";
    keyFeatures.value = "";
    technicalSpecifications.value = "";

    productColors.value = "";
    productVariants.value = "";

    stripeLink.value = "";
    supplierLink.value = "";

    productActive.checked = true;


    if (productImageUpload) {
        productImageUpload.value = "";
    }

}


/* =========================================================
   CLOSE EDITOR
   ========================================================= */

function closeEditor() {

    productEditor.hidden = true;

    editingProductId = null;

    selectedImages = [];

    imagePreviewSources.clear();


    if (productImageUpload) {
        productImageUpload.value = "";
    }

}


/* =========================================================
   IMAGE INPUT
   ========================================================= */

function handleImageSelection(event) {

    const files =
        Array.from(
            event.target.files || []
        );


    addImageFiles(files);

}


/* =========================================================
   ADD IMAGE FILES
   ========================================================= */

function addImageFiles(files) {

    if (!files.length) {
        return;
    }


    const validImages =
        files.filter(
            file =>
                file &&
                typeof file.type === "string" &&
                file.type.startsWith("image/")
        );


    if (!validImages.length) {

        showNotification(
            "NO VALID IMAGE FILES"
        );

        return;

    }


    let addedCount = 0;


    validImages.forEach(
        file => {

            const originalName =
                String(
                    file.name || ""
                ).trim();


            if (!originalName) {
                return;
            }


            const imagePath =
                "assets/images/" +
                originalName;


            const duplicate =
                selectedImages.some(
                    existing =>
                        getFilename(existing)
                            .toLowerCase() ===
                        originalName.toLowerCase()
                );


            if (duplicate) {
                return;
            }


            selectedImages.push(
                imagePath
            );


            addedCount++;


            createTemporaryPreview(
                imagePath,
                file
            );

        }
    );


    renderImagePreview();


    if (addedCount) {

        showNotification(
            addedCount === 1
                ? "IMAGE ADDED"
                : `${addedCount} IMAGES ADDED`
        );

    }


    if (productImageUpload) {
        productImageUpload.value = "";
    }

}


/* =========================================================
   TEMPORARY IMAGE PREVIEW
   ========================================================= */

function createTemporaryPreview(
    imagePath,
    file
) {

    const reader =
        new FileReader();


    reader.onload =
        event => {

            if (
                event.target?.result
            ) {

                imagePreviewSources.set(
                    imagePath,
                    event.target.result
                );

                renderImagePreview();

            }

        };


    reader.onerror =
        () => {

            console.warn(
                "VOLTICA: Preview failed:",
                file.name
            );

        };


    reader.readAsDataURL(file);

}


/* =========================================================
   IMAGE PREVIEW
   ========================================================= */

function renderImagePreview() {

    if (!imagePreview) {
        return;
    }


    if (!selectedImages.length) {

        imagePreview.innerHTML = `
            <div class="image-preview-empty">
                NO IMAGES SELECTED
            </div>
        `;

        return;

    }


    imagePreview.innerHTML =
        selectedImages
            .map(
                (imagePath, index) =>
                    createImagePreviewMarkup(
                        imagePath,
                        index
                    )
            )
            .join("");


    bindImagePreviewActions();

}


function createImagePreviewMarkup(
    imagePath,
    index
) {

    const filename =
        getFilename(imagePath);


    const previewSource =
        imagePreviewSources.get(
            imagePath
        ) ||
        imagePath;


    return `
        <div
            class="image-preview-item"
            data-image-path="${escapeHtmlAttribute(imagePath)}"
        >

            <img
                src="${escapeHtmlAttribute(previewSource)}"
                alt="${escapeHtmlAttribute(filename)}"
                loading="lazy"
                onerror="this.style.opacity='0.18'"
            >

            <span class="image-preview-index">
                ${index + 1}
            </span>

            <button
                type="button"
                class="image-preview-remove"
                data-remove-image="${escapeHtmlAttribute(imagePath)}"
                aria-label="Remove ${escapeHtmlAttribute(filename)}"
            >
                ×
            </button>

            <span
                class="image-preview-name"
                title="${escapeHtmlAttribute(filename)}"
            >
                ${escapeHtml(filename)}
            </span>

        </div>
    `;

}


/* =========================================================
   IMAGE PREVIEW ACTIONS
   ========================================================= */

function bindImagePreviewActions() {

    imagePreview
        ?.querySelectorAll(
            "[data-remove-image]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();
                        event.stopPropagation();


                        removeImage(
                            button.dataset.removeImage
                        );

                    }
                );

            }
        );

}


/* =========================================================
   REMOVE IMAGE
   ========================================================= */

function removeImage(imagePath) {

    selectedImages =
        selectedImages.filter(
            image =>
                image !== imagePath
        );


    imagePreviewSources.delete(
        imagePath
    );


    renderImagePreview();

    showNotification(
        "IMAGE REMOVED"
    );

}


/* =========================================================
   IMAGE PATH
   ========================================================= */

function normalizeImagePath(image) {

    if (!image) {
        return "";
    }


    const value =
        String(image).trim();


    if (!value) {
        return "";
    }


    if (
        value.startsWith(
            "assets/images/"
        )
    ) {

        return value;

    }


    if (
        value.startsWith(
            "/assets/images/"
        )
    ) {

        return value.substring(1);

    }


    return (
        "assets/images/" +
        getFilename(value)
    );

}


function getFilename(path) {

    return String(path || "")
        .split("/")
        .pop();

}


/* =========================================================
   SAVE PRODUCT
   ========================================================= */

function saveProduct() {

    const name =
        productName.value.trim();


    const price =
        parseFloat(
            productPrice.value
        );


    if (!name) {

        showNotification(
            "PRODUCT NAME REQUIRED"
        );

        productName.focus();

        return;

    }


    if (
        Number.isNaN(price) ||
        price < 0
    ) {

        showNotification(
            "VALID PRODUCT PRICE REQUIRED"
        );

        productPrice.focus();

        return;

    }


    const id =
        productId.value.trim() ||
        slugify(name);


    const duplicate =
        adminProducts.some(
            product =>
                String(product.id) ===
                    String(id) &&
                String(product.id) !==
                    String(editingProductId)
        );


    if (duplicate) {

        showNotification(
            "PRODUCT ID ALREADY EXISTS"
        );

        productId.focus();

        return;

    }


    const productData =
        buildProductObject(
            id,
            name,
            price
        );


    if (
        editingProductId !== null
    ) {

        updateExistingProduct(
            productData
        );

    } else {

        adminProducts.push(
            productData
        );

        showNotification(
            "PRODUCT CREATED"
        );

    }


    sortProducts();

    populateCategoryFilter();

    renderProducts();

    updateStatistics();

    closeEditor();

}


/* =========================================================
   UPDATE EXISTING PRODUCT
   ========================================================= */

function updateExistingProduct(
    productData
) {

    const index =
        adminProducts.findIndex(
            product =>
                String(product.id) ===
                String(editingProductId)
        );


    if (index === -1) {

        showNotification(
            "PRODUCT NOT FOUND"
        );

        return;

    }


    adminProducts[index] =
        productData;


    showNotification(
        "PRODUCT UPDATED"
    );

}


/* =========================================================
   BUILD PRODUCT OBJECT
   ========================================================= */

function buildProductObject(
    id,
    name,
    price
) {

    return {

        id,

        sku:
            productSku.value.trim(),

        name,

        category:
            productCategory.value.trim(),

        badge:
            productBadge.value.trim(),

        price,

        referencePrice:
            parseOptionalNumber(
                productReferencePrice.value
            ),

        cost:
            parseOptionalNumber(
                productCost.value
            ),

        shipping:
            parseOptionalNumber(
                productShipping.value
            ),

        shortDescription:
            shortDescription.value.trim(),

        description:
            fullDescription.value.trim(),

        features:
            linesToArray(
                keyFeatures.value
            ),

        specifications:
            linesToObject(
                technicalSpecifications.value
            ),

        images:
            selectedImages.map(
                normalizeImagePath
            ),

        colors:
            commaToArray(
                productColors.value
            ),

        variants:
            linesToVariants(
                productVariants.value
            ),

        stripeLink:
            stripeLink.value.trim(),

        supplierLink:
            supplierLink.value.trim(),

        active:
            productActive.checked

    };

}


/* =========================================================
   OPTIONAL NUMBER
   ========================================================= */

function parseOptionalNumber(value) {

    if (
        value === "" ||
        value === null ||
        value === undefined
    ) {

        return null;

    }


    const number =
        parseFloat(value);


    return Number.isNaN(number)
        ? null
        : number;

}


/* =========================================================
   TEXT → ARRAY
   ========================================================= */

function linesToArray(value) {

    return String(value || "")
        .split(/\r?\n/)
        .map(
            line =>
                line.trim()
        )
        .filter(Boolean);

}


/* =========================================================
   ARRAY → TEXT
   ========================================================= */

function arrayToLines(value) {

    if (!Array.isArray(value)) {
        return "";
    }


    return value.join("\n");

}


/* =========================================================
   TEXT → OBJECT
   ========================================================= */

function linesToObject(value) {

    const result = {};


    linesToArray(value)
        .forEach(
            line => {

                const separator =
                    line.indexOf(":");


                if (separator === -1) {

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
                    result[key] = val;
                }

            }
        );


    return result;

}


/* =========================================================
   OBJECT → TEXT
   ========================================================= */

function objectToLines(value) {

    if (
        !value ||
        typeof value !== "object" ||
        Array.isArray(value)
    ) {

        return "";

    }


    return Object.entries(value)
        .map(
            ([key, value]) =>
                `${key}: ${value}`
        )
        .join("\n");

}


/* =========================================================
   COLORS
   ========================================================= */

function commaToArray(value) {

    return String(value || "")
        .split(",")
        .map(
            color =>
                color.trim()
        )
        .filter(Boolean);

}


function arrayToCommaList(value) {

    if (!Array.isArray(value)) {
        return "";
    }


    return value.join(", ");

}


/* =========================================================
   VARIANTS
   ========================================================= */

function linesToVariants(value) {

    return linesToArray(value)
        .map(
            line => {

                const parts =
                    line.split("—");


                if (
                    parts.length < 2
                ) {

                    return {
                        name: line,
                        sku: ""
                    };

                }


                return {

                    name:
                        parts
                            .slice(0, -1)
                            .join("—")
                            .trim(),

                    sku:
                        parts
                            .slice(-1)[0]
                            .trim()

                };

            }
        );

}


function variantsToLines(variants) {

    if (!Array.isArray(variants)) {
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


                const name =
                    variant.name || "";

                const sku =
                    variant.sku || "";


                return sku
                    ? `${name} — ${sku}`
                    : name;

            }
        )
        .filter(Boolean)
        .join("\n");

}


/* =========================================================
   SORT PRODUCTS
   ========================================================= */

function sortProducts() {

    adminProducts.sort(
        (a, b) =>
            String(a.name || "")
                .localeCompare(
                    String(b.name || "")
                )
    );

}


/* =========================================================
   RENDER PRODUCT DATABASE
   ========================================================= */

function renderProducts() {

    if (!productList) {
        return;
    }


    const search =
        String(
            productSearch?.value || ""
        )
        .trim()
        .toLowerCase();


    const category =
        categoryFilter?.value ||
        "all";


    const status =
        statusFilter?.value ||
        "all";


    const filtered =
        adminProducts.filter(
            product => {

                const searchable =
                    [
                        product.name,
                        product.id,
                        product.sku,
                        product.category,
                        product.badge
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
                    String(
                        product.category || ""
                    ) === category;


                const active =
                    product.active !== false;


                const matchesStatus =
                    status === "all" ||
                    (
                        status === "active" &&
                        active
                    ) ||
                    (
                        status === "inactive" &&
                        !active
                    );


                return (
                    matchesSearch &&
                    matchesCategory &&
                    matchesStatus
                );

            }
        );


    productList.innerHTML = "";


    if (!filtered.length) {

        productList.hidden = true;

        emptyState.hidden = false;

        return;

    }


    productList.hidden = false;

    emptyState.hidden = true;


    productList.innerHTML =
        filtered
            .map(renderProductRow)
            .join("");


    bindProductRowActions();

}


/* =========================================================
   PRODUCT ROW
   ========================================================= */

function renderProductRow(product) {

    const image =
        Array.isArray(product.images) &&
        product.images.length
            ? normalizeImagePath(
                product.images[0]
            )
            : "";


    const active =
        product.active !== false;


    const badge =
        product.badge ||
        product.category ||
        "PRODUCT";


    const imageMarkup =
        image
            ? `
                <img
                    src="${escapeHtmlAttribute(image)}"
                    alt="${escapeHtmlAttribute(
                        product.name ||
                        "Product"
                    )}"
                    loading="lazy"
                >
            `
            : `
                <div
                    style="
                        width:100%;
                        height:100%;
                        display:grid;
                        place-items:center;
                        color:#555d69;
                        font-size:9px;
                        letter-spacing:.12em;
                    "
                >
                    NO IMAGE
                </div>
            `;


    return `
        <article
            class="product-list-item"
            data-product-id="${escapeHtmlAttribute(product.id)}"
        >

            <div class="product-list-image">
                ${imageMarkup}
            </div>


            <div class="product-list-info">

                <small>
                    ${escapeHtml(badge)}
                </small>

                <h3>
                    ${escapeHtml(
                        product.name ||
                        "Untitled Product"
                    )}
                </h3>

                <p>
                    ${escapeHtml(
                        product.sku ||
                        product.id ||
                        "NO SKU"
                    )}
                </p>

                <div class="product-list-price">
                    ${formatPrice(product.price)}
                </div>

                <div
                    class="product-status ${
                        active
                            ? "active"
                            : ""
                    }"
                >
                    ${
                        active
                            ? "ACTIVE"
                            : "INACTIVE"
                    }
                </div>

            </div>


            <div class="product-list-actions">

                <button
                    type="button"
                    data-action="edit"
                    data-id="${escapeHtmlAttribute(product.id)}"
                >
                    EDIT
                </button>


                <button
                    type="button"
                    data-action="toggle"
                    data-id="${escapeHtmlAttribute(product.id)}"
                >
                    ${
                        active
                            ? "DISABLE"
                            : "ACTIVATE"
                    }
                </button>


                <button
                    type="button"
                    class="delete-product"
                    data-action="delete"
                    data-id="${escapeHtmlAttribute(product.id)}"
                >
                    DELETE
                </button>

            </div>

        </article>
    `;

}


/* =========================================================
   PRODUCT ROW ACTIONS
   ========================================================= */

function bindProductRowActions() {

    productList
        ?.querySelectorAll(
            "[data-action]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const action =
                            button.dataset.action;

                        const id =
                            button.dataset.id;


                        switch (action) {

                            case "edit":
                                editProduct(id);
                                break;

                            case "toggle":
                                toggleProduct(id);
                                break;

                            case "delete":
                                confirmDeleteProduct(id);
                                break;

                        }

                    }
                );

            }
        );

}


/* =========================================================
   TOGGLE PRODUCT
   ========================================================= */

function toggleProduct(id) {

    const product =
        findProduct(id);


    if (!product) {
        return;
    }


    product.active =
        product.active === false;


    renderProducts();

    updateStatistics();


    showNotification(
        product.active
            ? "PRODUCT ACTIVATED"
            : "PRODUCT DISABLED"
    );

}


/* =========================================================
   DELETE PRODUCT
   ========================================================= */

function confirmDeleteProduct(id) {

    const product =
        findProduct(id);


    if (!product) {
        return;
    }


    openConfirmation(
        "DELETE PRODUCT",
        `Delete "${product.name}" from the local product database?`,
        () => {

            adminProducts =
                adminProducts.filter(
                    item =>
                        String(item.id) !==
                        String(id)
                );


            populateCategoryFilter();

            renderProducts();

            updateStatistics();


            showNotification(
                "PRODUCT DELETED"
            );

        }
    );

}


/* =========================================================
   CATEGORY FILTER
   ========================================================= */

function populateCategoryFilter() {

    if (!categoryFilter) {
        return;
    }


    const current =
        categoryFilter.value ||
        "all";


    const categories =
        [
            ...new Set(
                adminProducts
                    .map(
                        product =>
                            String(
                                product.category ||
                                ""
                            ).trim()
                    )
                    .filter(Boolean)
            )
        ]
        .sort(
            (a, b) =>
                a.localeCompare(b)
        );


    categoryFilter.innerHTML = `
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


            categoryFilter.appendChild(
                option
            );

        }
    );


    categoryFilter.value =
        categories.includes(current)
            ? current
            : "all";

}


/* =========================================================
   STATISTICS
   ========================================================= */

function updateStatistics() {

    const activeCount =
        adminProducts.filter(
            product =>
                product.active !== false
        ).length;


    const categories =
        new Set(
            adminProducts
                .map(
                    product =>
                        String(
                            product.category ||
                            ""
                        ).trim()
                )
                .filter(Boolean)
        );


    if (totalProducts) {

        totalProducts.textContent =
            adminProducts.length;

    }


    if (activeProducts) {

        activeProducts.textContent =
            activeCount;

    }


    if (totalCategories) {

        totalCategories.textContent =
            categories.size;

    }

}


/* =========================================================
   BACKUP DATABASE
   ========================================================= */

function backupDatabase() {

    const backup = {

        exportedAt:
            new Date().toISOString(),

        productCount:
            adminProducts.length,

        products:
            adminProducts

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


    showNotification(
        "DATABASE BACKUP CREATED"
    );

}


/* =========================================================
   EXPORT PRODUCTS.JS
   ========================================================= */

function exportProductsJS() {

    const output =
        buildProductsJS();


    downloadFile(
        "products.js",
        output,
        "application/javascript"
    );


    showNotification(
        "PRODUCTS.JS EXPORTED"
    );

}


/* =========================================================
   BUILD PRODUCTS.JS
   ========================================================= */

function buildProductsJS() {

    /*
       IMPORTANT:

       products.js MUST expose the database globally.

       DO NOT use:

       const volticaProducts = ...

       USE:

       window.volticaProducts = [...]
    */


    const productsOutput =
        adminProducts
            .map(
                (product, index) => {

                    const productJson =
                        JSON.stringify(
                            product,
                            null,
                            4
                        );


                    const productName =
                        String(
                            product.name ||
                            "UNTITLED PRODUCT"
                        );


                    return `    /* =====================================================
       Product name : ${productName}
       ===================================================== */

${productJson}`;

                }
            )
            .join(",\n\n");


    return `/* =========================================================
   VOLTICA STORE
   PRODUCT DATABASE
   ========================================================= */

window.volticaProducts = [

${productsOutput}

];
`;

}


/* =========================================================
   DOWNLOAD FILE
   ========================================================= */

function downloadFile(
    filename,
    content,
    mimeType
) {

    const blob =
        new Blob(
            [content],
            {
                type:
                    mimeType +
                    ";charset=utf-8"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const anchor =
        document.createElement("a");


    anchor.href = url;

    anchor.download =
        filename;


    document.body.appendChild(
        anchor
    );


    anchor.click();

    anchor.remove();


    setTimeout(
        () => URL.revokeObjectURL(url),
        1000
    );

}


/* =========================================================
   CONFIRMATION SYSTEM
   ========================================================= */

function openConfirmation(
    title,
    message,
    callback
) {

    if (!confirmOverlay) {
        return;
    }


    confirmTitle.textContent =
        title;


    confirmMessage.textContent =
        message;


    confirmCallback =
        callback;


    confirmOverlay.hidden =
        false;

}


function closeConfirmation() {

    if (confirmOverlay) {
        confirmOverlay.hidden = true;
    }


    confirmCallback = null;

}


function executeConfirmation() {

    if (
        typeof confirmCallback !==
        "function"
    ) {

        closeConfirmation();

        return;

    }


    const callback =
        confirmCallback;


    closeConfirmation();

    callback();

}


/* =========================================================
   NOTIFICATIONS
   ========================================================= */

function showNotification(message) {

    if (
        !adminNotification ||
        !notificationText
    ) {

        return;

    }


    notificationText.textContent =
        message;


    adminNotification.classList.add(
        "show"
    );


    clearTimeout(
        notificationTimer
    );


    notificationTimer =
        setTimeout(
            () => {

                adminNotification.classList.remove(
                    "show"
                );

            },
            2600
        );

}


/* =========================================================
   PRICE FORMAT
   ========================================================= */

function formatPrice(value) {

    const number =
        parseFloat(value);


    if (Number.isNaN(number)) {
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

function escapeHtml(value) {

    return String(value ?? "")
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


function escapeHtmlAttribute(value) {

    return escapeHtml(value);

}


/* =========================================================
   KEYBOARD SHORTCUTS
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !== "Escape"
        ) {

            return;

        }


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

            closeEditor();

        }

    }
);


/* =========================================================
   PAGE EXIT
   ========================================================= */

window.addEventListener(
    "beforeunload",
    () => {

        /*
           The admin manager intentionally does not
           overwrite products.js automatically.

           Workflow:

           1. Edit products.
           2. SAVE PRODUCT.
           3. EXPORT PRODUCTS.JS.
           4. Replace the website products.js.
        */

    }
);
