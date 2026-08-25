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

/*
   Stores temporary browser previews.

   Key:
       assets/images/example.webp

   Value:
       data:image/webp;base64,...

   IMPORTANT:
   This is only used for the current browser session.
   The original filename is always preserved.
*/
const imagePreviewSources = new Map();

let confirmCallback = null;

let notificationTimer = null;


/* =========================================================
   DOM
   ========================================================= */

const productEditor =
    document.getElementById("productEditor");

const editorTitle =
    document.getElementById("editorTitle");

const productId =
    document.getElementById("productId");

const productName =
    document.getElementById("productName");

const productCategory =
    document.getElementById("productCategory");

const productBadge =
    document.getElementById("productBadge");

const productSku =
    document.getElementById("productSku");

const productCost =
    document.getElementById("productCost");

const productShipping =
    document.getElementById("productShipping");

const productPrice =
    document.getElementById("productPrice");

const productReferencePrice =
    document.getElementById("productReferencePrice");

const shortDescription =
    document.getElementById("shortDescription");

const fullDescription =
    document.getElementById("fullDescription");

const keyFeatures =
    document.getElementById("keyFeatures");

const technicalSpecifications =
    document.getElementById("technicalSpecifications");

const productImageUpload =
    document.getElementById("productImageUpload");

const imageUploadSquare =
    document.getElementById("imageUploadSquare");

const imagePreview =
    document.getElementById("imagePreview");

const productColors =
    document.getElementById("productColors");

const productVariants =
    document.getElementById("productVariants");

const stripeLink =
    document.getElementById("stripeLink");

const supplierLink =
    document.getElementById("supplierLink");

const productActive =
    document.getElementById("productActive");

const productList =
    document.getElementById("productList");

const emptyState =
    document.getElementById("emptyState");

const productSearch =
    document.getElementById("productSearch");

const categoryFilter =
    document.getElementById("categoryFilter");

const statusFilter =
    document.getElementById("statusFilter");

const totalProducts =
    document.getElementById("totalProducts");

const activeProducts =
    document.getElementById("activeProducts");

const totalCategories =
    document.getElementById("totalCategories");

const adminNotification =
    document.getElementById("adminNotification");

const notificationText =
    document.getElementById("notificationText");

const confirmOverlay =
    document.getElementById("confirmOverlay");

const confirmTitle =
    document.getElementById("confirmTitle");

const confirmMessage =
    document.getElementById("confirmMessage");

const confirmCancel =
    document.getElementById("confirmCancel");

const confirmProceed =
    document.getElementById("confirmProceed");


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
   LOAD PRODUCTS
   ========================================================= */

function loadProducts() {

    /*
       products.js exposes:

       volticaProducts

       The admin receives its own working copy.
    */

    if (
        typeof volticaProducts !== "undefined" &&
        Array.isArray(volticaProducts)
    ) {

        adminProducts =
            JSON.parse(
                JSON.stringify(
                    volticaProducts
                )
            );

    } else {

        adminProducts = [];

        console.warn(
            "VOLTICA: volticaProducts was not found."
        );

    }

}


/* =========================================================
   EVENT BINDING
   ========================================================= */

function bindEvents() {

    document
        .getElementById("newProductButton")
        ?.addEventListener(
            "click",
            createNewProduct
        );


    document
        .getElementById("emptyCreateButton")
        ?.addEventListener(
            "click",
            createNewProduct
        );


    document
        .getElementById("closeEditorButton")
        ?.addEventListener(
            "click",
            closeEditor
        );


    document
        .getElementById("cancelProductButton")
        ?.addEventListener(
            "click",
            closeEditor
        );


    document
        .getElementById("saveProductButton")
        ?.addEventListener(
            "click",
            saveProduct
        );


    document
        .getElementById("backupProductsButton")
        ?.addEventListener(
            "click",
            backupDatabase
        );


    document
        .getElementById("exportProductsButton")
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


    /*
       Drag & drop support.
    */

    if (imageUploadSquare) {

        [
            "dragenter",
            "dragover"
        ].forEach(
            eventName => {

                imageUploadSquare.addEventListener(
                    eventName,
                    handleDragEnter
                );

            }
        );


        [
            "dragleave",
            "drop"
        ].forEach(
            eventName => {

                imageUploadSquare.addEventListener(
                    eventName,
                    handleDragLeave
                );

            }
        );


        imageUploadSquare.addEventListener(
            "drop",
            handleImageDrop
        );

    }

}


/* =========================================================
   PRODUCT NAME → ID
   ========================================================= */

function handleProductNameInput() {

    /*
       Existing product IDs are never changed.
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
   CREATE PRODUCT
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

    productEditor.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    setTimeout(
        () => productName?.focus(),
        250
    );

}


/* =========================================================
   EDIT PRODUCT
   ========================================================= */

function editProduct(id) {

    const product =
        adminProducts.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!product) {

        showNotification(
            "PRODUCT NOT FOUND"
        );

        return;

    }


    editingProductId =
        product.id;


    /*
       Existing filenames are preserved exactly.

       We normalize only the path prefix.
       The filename itself is untouched.
    */

    selectedImages =
        Array.isArray(product.images)
            ? product.images
                .map(
                    image =>
                        normalizeImagePath(image)
                )
                .filter(Boolean)
            : [];


    populateEditor(
        product
    );


    editorTitle.textContent =
        "EDIT PRODUCT";


    productEditor.hidden = false;


    renderImagePreview();


    productEditor.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

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
        product.shortDescription ||
        "";


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
        product.stripeLink ||
        "";


    supplierLink.value =
        product.supplierLink ||
        "";


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

    if (productEditor) {

        productEditor.hidden = true;

    }


    editingProductId = null;

    selectedImages = [];

    imagePreviewSources.clear();


    if (productImageUpload) {

        productImageUpload.value = "";

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

}


/* =========================================================
   IMAGE DROP
   ========================================================= */

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
   DRAG ENTER
   ========================================================= */

function handleDragEnter(event) {

    event.preventDefault();

    imageUploadSquare?.classList.add(
        "drag-over"
    );

}


/* =========================================================
   DRAG LEAVE
   ========================================================= */

function handleDragLeave(event) {

    event.preventDefault();

    imageUploadSquare?.classList.remove(
        "drag-over"
    );

}


/* =========================================================
   ADD IMAGE FILES
   ========================================================= */

function addImageFiles(files) {

    if (!Array.isArray(files)) {

        return;

    }


    if (!files.length) {

        return;

    }


    const imageFiles =
        files.filter(
            file => {

                return (
                    file &&
                    typeof file.type === "string" &&
                    file.type.startsWith("image/")
                );

            }
        );


    if (!imageFiles.length) {

        showNotification(
            "NO VALID IMAGE FILES"
        );

        return;

    }


    let addedCount = 0;


    imageFiles.forEach(
        file => {

            /*
               CRITICAL:

               We NEVER rename the original file.

               Example:

               1000041113.webp

               remains:

               1000041113.webp
            */

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


            /*
               Duplicate detection is based on
               filename, not browser File object.
            */

            const alreadyExists =
                selectedImages.some(
                    existingPath =>
                        getFilename(
                            existingPath
                        ).toLowerCase() ===
                        originalName.toLowerCase()
                );


            if (alreadyExists) {

                return;

            }


            selectedImages.push(
                imagePath
            );


            addedCount++;


            /*
               Generate a temporary local preview.

               This lets the user immediately see
               the selected image even before the file
               has been manually copied to assets/images/.
            */

            const reader =
                new FileReader();


            reader.onload =
                event => {

                    imagePreviewSources.set(
                        imagePath,
                        event.target.result
                    );


                    renderImagePreview();

                };


            reader.onerror =
                () => {

                    console.warn(
                        "VOLTICA: Unable to preview image:",
                        originalName
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );


    renderImagePreview();


    if (addedCount > 0) {

        showNotification(
            addedCount === 1
                ? "IMAGE ADDED"
                : `${addedCount} IMAGES ADDED`
        );

    }


    /*
       Reset the input.

       This allows the exact same filename to be
       selected again after it has been removed.
    */

    if (productImageUpload) {

        productImageUpload.value = "";

    }

}


/* =========================================================
   UPDATE PREVIEW IMAGE
   ========================================================= */

function updatePreviewImage(
    imagePath,
    dataUrl
) {

    if (!imagePath || !dataUrl) {

        return;

    }


    imagePreviewSources.set(
        imagePath,
        dataUrl
    );


    const selector =
        `[data-image-path="${escapeSelector(imagePath)}"] img`;


    const imageElement =
        imagePreview?.querySelector(
            selector
        );


    if (imageElement) {

        imageElement.src =
            dataUrl;

    }

}


/* =========================================================
   RENDER IMAGE PREVIEW
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
                (imagePath, index) => {

                    const filename =
                        getFilename(
                            imagePath
                        );


                    /*
                       If the image was selected during
                       this session, use its local DataURL.

                       Otherwise use the actual website path.
                    */

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

                            <span
                                class="image-preview-index"
                            >
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
            )
            .join("");


    bindImagePreviewActions();

}


/* =========================================================
   IMAGE PREVIEW ACTIONS
   ========================================================= */

function bindImagePreviewActions() {

    if (!imagePreview) {

        return;

    }


    imagePreview
        .querySelectorAll(
            "[data-remove-image]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        event.stopPropagation();


                        const imagePath =
                            button.dataset.removeImage;


                        removeImage(
                            imagePath
                        );

                    }
                );

            }
        );

}


/* =========================================================
   REMOVE IMAGE
   ========================================================= */

function removeImage(
    imagePath
) {

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
   NORMALIZE IMAGE PATH
   ========================================================= */

function normalizeImagePath(
    image
) {

    if (!image) {

        return "";

    }


    const value =
        String(image).trim();


    if (!value) {

        return "";

    }


    /*
       Preserve complete assets/images/ path.
    */

    if (
        value.startsWith(
            "assets/images/"
        )
    ) {

        return value;

    }


    /*
       Preserve root-relative paths.
    */

    if (
        value.startsWith(
            "/assets/images/"
        )
    ) {

        return value.substring(1);

    }


    /*
       Existing product databases may contain
       only the filename.

       Convert:

       q45-1.webp

       to:

       assets/images/q45-1.webp
    */

    return (
        "assets/images/" +
        getFilename(value)
    );

}


/* =========================================================
   FILENAME
   ========================================================= */

function getFilename(
    path
) {

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


    /*
       Prevent duplicate IDs.
    */

    const duplicate =
        adminProducts.find(
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
   BUILD PRODUCT OBJECT
   ========================================================= */

function buildProductObject(
    id,
    name,
    price
) {

    return {

        id: id,

        sku:
            productSku.value.trim(),

        name: name,

        category:
            productCategory.value.trim(),

        badge:
            productBadge.value.trim(),

        price: price,

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

        /*
           IMPORTANT:

           selectedImages contains the exact original
           filenames selected by the user.

           Example:
           assets/images/1000041113.webp
        */

        images:
            selectedImages.map(
                image =>
                    normalizeImagePath(
                        image
                    )
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

function parseOptionalNumber(
    value
) {

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

function linesToArray(
    value
) {

    return String(value || "")
        .split("\n")
        .map(
            line =>
                line.trim()
        )
        .filter(Boolean);

}


/* =========================================================
   ARRAY → TEXT
   ========================================================= */

function arrayToLines(
    value
) {

    if (
        !Array.isArray(value)
    ) {

        return "";

    }


    return value.join("\n");

}


/* =========================================================
   TEXT → SPECIFICATIONS
   ========================================================= */

function linesToObject(
    value
) {

    const object = {};


    linesToArray(value)
        .forEach(
            line => {

                const separator =
                    line.indexOf(":");


                if (
                    separator === -1
                ) {

                    object[line] = "";

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

                    object[key] = val;

                }

            }
        );


    return object;

}


/* =========================================================
   SPECIFICATIONS → TEXT
   ========================================================= */

function objectToLines(
    value
) {

    if (
        !value ||
        typeof value !== "object" ||
        Array.isArray(value)
    ) {

        return "";

    }


    return Object.entries(value)
        .map(
            ([key, val]) =>
                `${key}: ${val}`
        )
        .join("\n");

}


/* =========================================================
   COLORS
   ========================================================= */

function commaToArray(
    value
) {

    return String(value || "")
        .split(",")
        .map(
            color =>
                color.trim()
        )
        .filter(Boolean);

}


function arrayToCommaList(
    value
) {

    if (
        !Array.isArray(value)
    ) {

        return "";

    }


    return value.join(", ");

}


/* =========================================================
   VARIANTS
   ========================================================= */

function linesToVariants(
    value
) {

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


function variantsToLines(
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
                    typeof variant === "string"
                ) {

                    return variant;

                }


                return (
                    `${variant.name || ""} — ` +
                    `${variant.sku || ""}`
                ).trim();

            }
        )
        .filter(Boolean)
        .join("\n");

}
/* =========================================================
   SORT
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
   RENDER PRODUCTS
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


                const isActive =
                    product.active !== false;


                const matchesStatus =
                    status === "all" ||
                    (
                        status === "active" &&
                        isActive
                    ) ||
                    (
                        status === "inactive" &&
                        !isActive
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
            .map(
                product =>
                    renderProductRow(
                        product
                    )
            )
            .join("");


    bindProductRowActions();

}


/* =========================================================
   PRODUCT ROW
   ========================================================= */

function renderProductRow(
    product
) {

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
            data-product-id="${escapeHtmlAttribute(
                product.id
            )}"
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
                        active ? "active" : ""
                    }"
                >
                    ${active ? "ACTIVE" : "INACTIVE"}
                </div>

            </div>


            <div class="product-list-actions">

                <button
                    type="button"
                    data-action="edit"
                    data-id="${escapeHtmlAttribute(
                        product.id
                    )}"
                >
                    EDIT
                </button>


                <button
                    type="button"
                    data-action="toggle"
                    data-id="${escapeHtmlAttribute(
                        product.id
                    )}"
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
                    data-id="${escapeHtmlAttribute(
                        product.id
                    )}"
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

    if (!productList) {

        return;

    }


    productList
        .querySelectorAll(
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


                        if (
                            action === "edit"
                        ) {

                            editProduct(id);

                        }


                        if (
                            action === "toggle"
                        ) {

                            toggleProduct(id);

                        }


                        if (
                            action === "delete"
                        ) {

                            confirmDeleteProduct(
                                id
                            );

                        }

                    }
                );

            }
        );

}


/* =========================================================
   TOGGLE PRODUCT
   ========================================================= */

function toggleProduct(
    id
) {

    const product =
        adminProducts.find(
            item =>
                String(item.id) ===
                String(id)
        );


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

function confirmDeleteProduct(
    id
) {

    const product =
        adminProducts.find(
            item =>
                String(item.id) ===
                String(id)
        );


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


    if (
        categories.includes(current)
    ) {

        categoryFilter.value =
            current;

    } else {

        categoryFilter.value =
            "all";

    }

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

    const json =
        JSON.stringify(
            adminProducts,
            null,
            4
        );


    return `/* =========================================================
   VOLTICA STORE
   PRODUCT DATABASE
   GENERATED BY ADMIN PRODUCT MANAGER
   ========================================================= */

const volticaProducts = ${json};
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
        URL.createObjectURL(
            blob
        );


    const anchor =
        document.createElement(
            "a"
        );


    anchor.href =
        url;


    anchor.download =
        filename;


    document.body.appendChild(
        anchor
    );


    anchor.click();


    anchor.remove();


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
   CONFIRMATION
   ========================================================= */

function openConfirmation(
    title,
    message,
    callback
) {

    if (!confirmOverlay) {

        return;

    }


    if (confirmTitle) {

        confirmTitle.textContent =
            title;

    }


    if (confirmMessage) {

        confirmMessage.textContent =
            message;

    }


    confirmCallback =
        callback;


    confirmOverlay.hidden =
        false;

}


function closeConfirmation() {

    if (confirmOverlay) {

        confirmOverlay.hidden =
            true;

    }


    confirmCallback =
        null;

}


function executeConfirmation() {

    if (
        typeof confirmCallback ===
        "function"
    ) {

        const callback =
            confirmCallback;


        closeConfirmation();


        callback();

    } else {

        closeConfirmation();

    }

}


/* =========================================================
   NOTIFICATION
   ========================================================= */

function showNotification(
    message
) {

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

function formatPrice(
    value
) {

    const number =
        parseFloat(value);


    if (
        Number.isNaN(number)
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

function escapeHtml(
    value
) {

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


function escapeHtmlAttribute(
    value
) {

    return escapeHtml(
        value
    );

}


function escapeSelector(
    value
) {

    if (
        typeof CSS !== "undefined" &&
        typeof CSS.escape === "function"
    ) {

        return CSS.escape(
            value
        );

    }


    return String(value)
        .replace(
            /([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g,
            "\\$1"
        );

}


/* =========================================================
   KEYBOARD SHORTCUT
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !== "Escape"
        ) {

            return;

        }


        /*
           Close confirmation first.
        */

        if (
            confirmOverlay &&
            !confirmOverlay.hidden
        ) {

            closeConfirmation();

            return;

        }


        /*
           Otherwise close the editor.
        */

        if (
            productEditor &&
            !productEditor.hidden
        ) {

            closeEditor();

        }

    }
);


/* =========================================================
   BEFORE LEAVING PAGE
   ========================================================= */

window.addEventListener(
    "beforeunload",
    () => {

        /*
           No browser persistence is forced here.

           products.js remains the source of truth.

           Use EXPORT PRODUCTS.JS after making
           product changes.
        */

    }
);
