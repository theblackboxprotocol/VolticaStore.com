/* =========================================================
   VOLTICA
   ADMIN PRODUCT MANAGER
   ADMINPRODUCTMANAGER.JS
   ========================================================= */


/* =========================================================
   STORAGE
   ========================================================= */

const STORAGE_KEY = "voltica_admin_products";


/* =========================================================
   GLOBAL STATE
   ========================================================= */

let productsDatabase = [];

let editingProductId = null;

let confirmAction = null;


/* =========================================================
   DOM
   ========================================================= */

const productList =
    document.getElementById("productList");

const emptyState =
    document.getElementById("emptyState");

const productEditor =
    document.getElementById("productEditor");

const newProductButton =
    document.getElementById("newProductButton");

const emptyCreateButton =
    document.getElementById("emptyCreateButton");

const closeEditorButton =
    document.getElementById("closeEditorButton");

const cancelProductButton =
    document.getElementById("cancelProductButton");

const saveProductButton =
    document.getElementById("saveProductButton");

const productSearch =
    document.getElementById("productSearch");

const categoryFilter =
    document.getElementById("categoryFilter");

const statusFilter =
    document.getElementById("statusFilter");

const exportProductsButton =
    document.getElementById("exportProductsButton");

const backupProductsButton =
    document.getElementById("backupProductsButton");

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
   FORM ELEMENTS
   ========================================================= */

const fields = {

    id:
        document.getElementById("productId"),

    name:
        document.getElementById("productName"),

    category:
        document.getElementById("productCategory"),

    badge:
        document.getElementById("productBadge"),

    sku:
        document.getElementById("productSku"),

    price:
        document.getElementById("productPrice"),

    referencePrice:
        document.getElementById("productReferencePrice"),

    cost:
        document.getElementById("productCost"),

    shipping:
        document.getElementById("productShipping"),

    shortDescription:
        document.getElementById("shortDescription"),

    fullDescription:
        document.getElementById("fullDescription"),

    keyFeatures:
        document.getElementById("keyFeatures"),

    technicalSpecifications:
        document.getElementById("technicalSpecifications"),

    images:
        document.getElementById("productImages"),

    colors:
        document.getElementById("productColors"),

    variants:
        document.getElementById("productVariants"),

    stripe:
        document.getElementById("stripeLink"),

    supplier:
        document.getElementById("supplierLink"),

    active:
        document.getElementById("productActive")

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

    normalizeProducts();

    updateDashboard();

    populateCategoryFilter();

    renderProducts();

    setupEvents();

}



/* =========================================================
   LOAD PRODUCTS
   ========================================================= */

function loadProducts() {

    try {

        const stored =
            localStorage.getItem(STORAGE_KEY);

        if (stored) {

            const parsed =
                JSON.parse(stored);

            if (Array.isArray(parsed)) {

                productsDatabase =
                    parsed;

                return;

            }

        }

    } catch (error) {

        console.error(
            "Voltica: unable to load local database.",
            error
        );

    }


    /*
       If products.js already contains a database,
       use it as the initial source.
    */

    if (
        Array.isArray(window.volticaProducts)
    ) {

        productsDatabase =
            JSON.parse(
                JSON.stringify(
                    window.volticaProducts
                )
            );

    } else {

        productsDatabase = [];

    }


    saveProducts();

}



/* =========================================================
   NORMALIZE PRODUCTS
   ========================================================= */

function normalizeProducts() {

    productsDatabase =
        productsDatabase.map(
            (product, index) => {

                return {

                    id:
                        product.id ||
                        `product-${index + 1}`,

                    name:
                        product.name ||
                        `Product ${index + 1}`,

                    category:
                        product.category ||
                        "UNCATEGORIZED",

                    badge:
                        product.badge ||
                        "",

                    sku:
                        product.sku ||
                        "",

                    price:
                        Number(product.price) || 0,

                    referencePrice:
                        Number(
                            product.referencePrice ||
                            product.reference_price ||
                            0
                        ),

                    cost:
                        Number(product.cost) || 0,

                    shipping:
                        Number(product.shipping) || 0,

                    shortDescription:
                        product.shortDescription ||
                        product.short_description ||
                        "",

                    description:
                        product.description ||
                        product.fullDescription ||
                        "",

                    fullDescription:
                        product.fullDescription ||
                        product.description ||
                        "",

                    keyFeatures:
                        product.keyFeatures ||
                        [],

                    technicalSpecifications:
                        product.technicalSpecifications ||
                        [],

                    images:
                        Array.isArray(product.images)
                            ? product.images
                            : [],

                    colors:
                        Array.isArray(product.colors)
                            ? product.colors
                            : [],

                    variants:
                        Array.isArray(product.variants)
                            ? product.variants
                            : [],

                    stripeLink:
                        product.stripeLink ||
                        product.stripe ||
                        "",

                    supplierLink:
                        product.supplierLink ||
                        product.link ||
                        "",

                    active:
                        product.active !== false

                };

            }
        );

}



/* =========================================================
   SAVE PRODUCTS
   ========================================================= */

function saveProducts() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
                productsDatabase
            )
        );

    } catch (error) {

        console.error(
            "Voltica: unable to save database.",
            error
        );

        showNotification(
            "Unable to save database."
        );

    }

}



/* =========================================================
   EVENTS
   ========================================================= */

function setupEvents() {


    newProductButton.addEventListener(
        "click",
        openNewProduct
    );


    emptyCreateButton.addEventListener(
        "click",
        openNewProduct
    );


    closeEditorButton.addEventListener(
        "click",
        closeEditor
    );


    cancelProductButton.addEventListener(
        "click",
        closeEditor
    );


    saveProductButton.addEventListener(
        "click",
        saveProduct
    );


    productSearch.addEventListener(
        "input",
        renderProducts
    );


    categoryFilter.addEventListener(
        "change",
        renderProducts
    );


    statusFilter.addEventListener(
        "change",
        renderProducts
    );


    exportProductsButton.addEventListener(
        "click",
        exportProductsJS
    );


    backupProductsButton.addEventListener(
        "click",
        backupDatabase
    );


    confirmCancel.addEventListener(
        "click",
        closeConfirmation
    );


    confirmProceed.addEventListener(
        "click",
        executeConfirmation
    );


    fields.images.addEventListener(
        "input",
        updateImagePreview
    );


    fields.name.addEventListener(
        "input",
        () => {

            if (!editingProductId) {

                const generated =
                    slugify(
                        fields.name.value
                    );

                fields.id.value =
                    generated;

            }

        }
    );


    document.addEventListener(
        "keydown",
        handleKeyboard
    );

}



/* =========================================================
   KEYBOARD
   ========================================================= */

function handleKeyboard(event) {

    if (
        event.key === "Escape" &&
        !confirmOverlay.hidden
    ) {

        closeConfirmation();

        return;

    }


    if (
        event.key === "Escape" &&
        !productEditor.hidden
    ) {

        closeEditor();

    }

}



/* =========================================================
   DASHBOARD
   ========================================================= */

function updateDashboard() {

    const total =
        productsDatabase.length;


    const active =
        productsDatabase.filter(
            product =>
                product.active !== false
        ).length;


    const categories =
        new Set(
            productsDatabase
                .map(
                    product =>
                        product.category
                )
                .filter(Boolean)
        );


    document.getElementById(
        "totalProducts"
    ).textContent =
        total;


    document.getElementById(
        "activeProducts"
    ).textContent =
        active;


    document.getElementById(
        "totalCategories"
    ).textContent =
        categories.size;

}



/* =========================================================
   CATEGORY FILTER
   ========================================================= */

function populateCategoryFilter() {

    const current =
        categoryFilter.value;


    const categories =
        [
            ...new Set(
                productsDatabase
                    .map(
                        product =>
                            product.category
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
                category.toUpperCase();

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

    }

}



/* =========================================================
   RENDER PRODUCTS
   ========================================================= */

function renderProducts() {

    const search =
        productSearch.value
            .trim()
            .toLowerCase();


    const category =
        categoryFilter.value;


    const status =
        statusFilter.value;


    const filtered =
        productsDatabase.filter(
            product => {

                const matchesSearch =

                    !search ||

                    String(
                        product.name
                    )
                    .toLowerCase()
                    .includes(search)

                    ||

                    String(
                        product.id
                    )
                    .toLowerCase()
                    .includes(search)

                    ||

                    String(
                        product.category
                    )
                    .toLowerCase()
                    .includes(search);


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


    if (!filtered.length) {

        productList.appendChild(
            createEmptyState(
                search ||
                category !== "all" ||
                status !== "all"
            )
        );

        return;

    }


    filtered.forEach(
        product => {

            productList.appendChild(
                createProductRow(
                    product
                )
            );

        }
    );

}



/* =========================================================
   EMPTY STATE
   ========================================================= */

function createEmptyState(
    filtered = false
) {

    const element =
        document.createElement(
            "div"
        );


    element.className =
        "empty-state";


    element.innerHTML = `

        <div class="empty-pulsar"></div>

        <span>
            ${
                filtered
                    ? "NO MATCHES"
                    : "NO PRODUCTS"
            }
        </span>

        <strong>
            ${
                filtered
                    ? "NO PRODUCT MATCHES YOUR SEARCH"
                    : "YOUR VOLTICA DATABASE IS EMPTY"
            }
        </strong>

        <p>
            ${
                filtered
                    ? "Try another search or filter."
                    : "Create your first product to begin."
            }
        </p>

        ${
            filtered
                ? ""
                : `
                    <button
                        type="button"
                        class="acrylic-button"
                        data-action="new-product"
                    >
                        CREATE PRODUCT
                    </button>
                `
        }

    `;


    const button =
        element.querySelector(
            '[data-action="new-product"]'
        );


    if (button) {

        button.addEventListener(
            "click",
            openNewProduct
        );

    }


    return element;

}



/* =========================================================
   PRODUCT ROW
   ========================================================= */

function createProductRow(
    product
) {

    const row =
        document.createElement(
            "article"
        );


    row.className =
        "admin-product-row";


    const thumbnail =
        product.images &&
        product.images.length
            ? product.images[0]
            : "";


    row.innerHTML = `

        <div class="admin-product-thumbnail">

            ${
                thumbnail
                    ? `
                        <img
                            src="${escapeAttribute(thumbnail)}"
                            alt="${escapeAttribute(product.name)}"
                            loading="lazy"
                        >
                    `
                    : `
                        <span
                            style="
                                color:rgba(255,255,255,.15);
                                font-size:8px;
                            "
                        >
                            NO IMAGE
                        </span>
                    `
            }

        </div>


        <div class="admin-product-name">

            <span class="category">
                ${escapeHTML(
                    product.category ||
                    "UNCATEGORIZED"
                )}
            </span>

            <h3>
                ${escapeHTML(
                    product.name
                )}
            </h3>

            <span class="product-id">
                ID · ${escapeHTML(
                    product.id
                )}
            </span>

        </div>


        <div class="admin-product-price">

            <span>
                VOLTICA PRICE
            </span>

            ${formatPrice(
                product.price
            )}

        </div>


        <div>

            <span
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

            </span>

        </div>


        <div class="admin-product-actions">

            <button
                type="button"
                class="row-button"
                data-action="edit"
                data-id="${escapeAttribute(product.id)}"
            >
                EDIT
            </button>


            <button
                type="button"
                class="row-button"
                data-action="toggle"
                data-id="${escapeAttribute(product.id)}"
            >
                ${
                    product.active !== false
                        ? "DISABLE"
                        : "ACTIVATE"
                }
            </button>


            <button
                type="button"
                class="row-button delete"
                data-action="delete"
                data-id="${escapeAttribute(product.id)}"
            >
                DELETE
            </button>

        </div>

    `;


    row
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

                            askDeleteProduct(id);

                        }

                    }
                );

            }
        );


    return row;

}



/* =========================================================
   NEW PRODUCT
   ========================================================= */

function openNewProduct() {

    editingProductId =
        null;


    clearEditor();


    document.getElementById(
        "editorTitle"
    ).textContent =
        "NEW PRODUCT";


    productEditor.hidden =
        false;


    productEditor.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });


    setTimeout(
        () => {

            fields.name.focus();

        },
        300
    );

}



/* =========================================================
   EDIT PRODUCT
   ========================================================= */

function editProduct(
    id
) {

    const product =
        productsDatabase.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!product) {

        showNotification(
            "Product not found."
        );

        return;

    }


    editingProductId =
        product.id;


    fillEditor(
        product
    );


    document.getElementById(
        "editorTitle"
    ).textContent =
        "EDIT PRODUCT";


    productEditor.hidden =
        false;


    productEditor.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}



/* =========================================================
   FILL EDITOR
   ========================================================= */

function fillEditor(
    product
) {

    fields.id.value =
        product.id || "";


    fields.name.value =
        product.name || "";


    fields.category.value =
        product.category || "";


    fields.badge.value =
        product.badge || "";


    fields.sku.value =
        product.sku || "";


    fields.price.value =
        product.price ?? "";


    fields.referencePrice.value =
        product.referencePrice ?? "";


    fields.cost.value =
        product.cost ?? "";


    fields.shipping.value =
        product.shipping ?? "";


    fields.shortDescription.value =
        product.shortDescription || "";


    fields.fullDescription.value =
        product.fullDescription ||
        product.description ||
        "";


    fields.keyFeatures.value =
        arrayToLines(
            product.keyFeatures
        );


    fields.technicalSpecifications.value =
        arrayToLines(
            product.technicalSpecifications
        );


    fields.images.value =
        arrayToLines(
            product.images
        );


    fields.colors.value =
        arrayToComma(
            product.colors
        );


    fields.variants.value =
        arrayToLines(
            product.variants
        );


    fields.stripe.value =
        product.stripeLink || "";


    fields.supplier.value =
        product.supplierLink || "";


    fields.active.checked =
        product.active !== false;


    updateImagePreview();

}



/* =========================================================
   CLEAR EDITOR
   ========================================================= */

function clearEditor() {

    Object.values(fields)
        .forEach(
            field => {

                if (
                    field.type ===
                    "checkbox"
                ) {

                    field.checked =
                        true;

                } else {

                    field.value =
                        "";

                }

            }
        );


    fields.active.checked =
        true;


    updateImagePreview();

}



/* =========================================================
   CLOSE EDITOR
   ========================================================= */

function closeEditor() {

    productEditor.hidden =
        true;

    editingProductId =
        null;

}



/* =========================================================
   SAVE PRODUCT
   ========================================================= */

function saveProduct() {

    const product =
        collectFormData();


    if (!validateProduct(product)) {

        return;

    }


    if (editingProductId) {

        const index =
            productsDatabase.findIndex(
                item =>
                    String(item.id) ===
                    String(editingProductId)
            );


        if (index === -1) {

            showNotification(
                "Product could not be found."
            );

            return;

        }


        productsDatabase[index] =
            product;


        showNotification(
            "Product updated successfully."
        );

    } else {

        productsDatabase.push(
            product
        );


        showNotification(
            "Product created successfully."
        );

    }


    saveProducts();

    normalizeProducts();

    updateDashboard();

    populateCategoryFilter();

    renderProducts();

    closeEditor();

}



/* =========================================================
   COLLECT FORM
   ========================================================= */

function collectFormData() {

    const id =
        slugify(
            fields.id.value ||
            fields.name.value
        );


    return {

        id,

        name:
            fields.name.value.trim(),

        category:
            fields.category.value
                .trim()
                .toUpperCase(),

        badge:
            fields.badge.value.trim(),

        sku:
            fields.sku.value.trim(),

        price:
            toNumber(
                fields.price.value
            ),

        referencePrice:
            toNumber(
                fields.referencePrice.value
            ),

        cost:
            toNumber(
                fields.cost.value
            ),

        shipping:
            toNumber(
                fields.shipping.value
            ),

        shortDescription:
            fields.shortDescription.value
                .trim(),

        fullDescription:
            fields.fullDescription.value
                .trim(),

        description:
            fields.fullDescription.value
                .trim(),

        keyFeatures:
            linesToArray(
                fields.keyFeatures.value
            ),

        technicalSpecifications:
            linesToArray(
                fields.technicalSpecifications.value
            ),

        images:
            linesToArray(
                fields.images.value
            ),

        colors:
            commaToArray(
                fields.colors.value
            ),

        variants:
            linesToArray(
                fields.variants.value
            ),

        stripeLink:
            fields.stripe.value.trim(),

        supplierLink:
            fields.supplier.value.trim(),

        active:
            fields.active.checked

    };

}



/* =========================================================
   VALIDATE
   ========================================================= */

function validateProduct(
    product
) {

    if (!product.name) {

        showNotification(
            "Product name is required."
        );

        fields.name.focus();

        return false;

    }


    if (!product.id) {

        showNotification(
            "Product ID is required."
        );

        fields.id.focus();

        return false;

    }


    const duplicate =
        productsDatabase.find(
            item =>
                String(item.id) ===
                    String(product.id) &&
                String(item.id) !==
                    String(editingProductId)
        );


    if (duplicate) {

        showNotification(
            "This Product ID already exists."
        );

        fields.id.focus();

        return false;

    }


    if (
        !Number.isFinite(
            product.price
        ) ||
        product.price < 0
    ) {

        showNotification(
            "Enter a valid Voltica price."
        );

        fields.price.focus();

        return false;

    }


    return true;

}



/* =========================================================
   TOGGLE PRODUCT
   ========================================================= */

function toggleProduct(
    id
) {

    const product =
        productsDatabase.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!product) {

        return;

    }


    product.active =
        product.active === false;


    saveProducts();

    updateDashboard();

    renderProducts();


    showNotification(
        product.active
            ? "Product activated."
            : "Product disabled."
    );

}



/* =========================================================
   DELETE
   ========================================================= */

function askDeleteProduct(
    id
) {

    const product =
        productsDatabase.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!product) {

        return;

    }


    confirmTitle.textContent =
        "DELETE PRODUCT";


    confirmMessage.textContent =
        `Delete "${product.name}" permanently from the local Voltica database?`;


    confirmAction =
        () => deleteProduct(id);


    confirmOverlay.hidden =
        false;

}



function deleteProduct(
    id
) {

    const index =
        productsDatabase.findIndex(
            item =>
                String(item.id) ===
                String(id)
        );


    if (index === -1) {

        return;

    }


    productsDatabase.splice(
        index,
        1
    );


    saveProducts();

    updateDashboard();

    populateCategoryFilter();

    renderProducts();


    showNotification(
        "Product deleted."
    );

}



/* =========================================================
   CONFIRMATION
   ========================================================= */

function closeConfirmation() {

    confirmOverlay.hidden =
        true;

    confirmAction =
        null;

}



function executeConfirmation() {

    if (
        typeof confirmAction ===
        "function"
    ) {

        confirmAction();

    }


    closeConfirmation();

}



/* =========================================================
   IMAGE PREVIEW
   ========================================================= */

function updateImagePreview() {

    const container =
        document.getElementById(
            "imagePreview"
        );


    container.innerHTML =
        "";


    const images =
        linesToArray(
            fields.images.value
        );


    if (!images.length) {

        container.innerHTML = `

            <div
                style="
                    padding:30px;
                    color:rgba(255,255,255,.15);
                    font-size:8px;
                    text-align:center;
                    grid-column:1/-1;
                "
            >
                NO IMAGES
            </div>

        `;

        return;

    }


    images.forEach(
        (src, index) => {

            const image =
                document.createElement(
                    "img"
                );


            image.src =
                src;


            image.alt =
                `Product image ${index + 1}`;


            image.loading =
                "lazy";


            image.onerror =
                () => {

                    image.style.opacity =
                        ".18";

                };


            container.appendChild(
                image
            );

        }
    );

}



/* =========================================================
   EXPORT PRODUCTS.JS
   ========================================================= */

function exportProductsJS() {

    if (!productsDatabase.length) {

        showNotification(
            "There are no products to export."
        );

        return;

    }


    const cleanProducts =
        productsDatabase.map(
            product => {

                return {

                    id:
                        product.id,

                    sku:
                        product.sku,

                    name:
                        product.name,

                    category:
                        product.category,

                    badge:
                        product.badge,

                    price:
                        product.price,

                    referencePrice:
                        product.referencePrice,

                    cost:
                        product.cost,

                    shipping:
                        product.shipping,

                    shortDescription:
                        product.shortDescription,

                    description:
                        product.fullDescription,

                    fullDescription:
                        product.fullDescription,

                    keyFeatures:
                        product.keyFeatures,

                    technicalSpecifications:
                        product.technicalSpecifications,

                    images:
                        product.images,

                    colors:
                        product.colors,

                    variants:
                        product.variants,

                    stripeLink:
                        product.stripeLink,

                    supplierLink:
                        product.supplierLink,

                    active:
                        product.active

                };

            }
        );


    const output =

`/* =========================================================
   VOLTICA STORE
   PRODUCT DATABASE
   GENERATED BY ADMIN PRODUCT MANAGER
   ========================================================= */

const volticaProducts = ${JSON.stringify(
        cleanProducts,
        null,
        4
    )};


/* =========================================================
   END PRODUCT DATABASE
   ========================================================= */
`;


    downloadFile(
        "products.js",
        output,
        "application/javascript"
    );


    showNotification(
        "products.js exported successfully."
    );

}



/* =========================================================
   BACKUP DATABASE
   ========================================================= */

function backupDatabase() {

    const backup = {

        exportedAt:
            new Date().toISOString(),

        version:
            "1.0",

        products:
            productsDatabase

    };


    downloadFile(
        `voltica-products-backup-${getDateStamp()}.json`,
        JSON.stringify(
            backup,
            null,
            4
        ),
        "application/json"
    );


    showNotification(
        "Database backup created."
    );

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
                type: mimeType
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
   NOTIFICATION
   ========================================================= */

let notificationTimer;


function showNotification(
    message
) {

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
            2800
        );

}



/* =========================================================
   HELPERS
   ========================================================= */

function slugify(
    value
) {

    return String(value || "")
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



function toNumber(
    value
) {

    const number =
        parseFloat(value);


    return Number.isFinite(number)
        ? number
        : 0;

}



function linesToArray(
    value
) {

    return String(value || "")
        .split("\n")
        .map(
            item =>
                item.trim()
        )
        .filter(Boolean);

}



function arrayToLines(
    value
) {

    if (!Array.isArray(value)) {

        return "";

    }


    return value.join("\n");

}



function commaToArray(
    value
) {

    return String(value || "")
        .split(",")
        .map(
            item =>
                item.trim()
        )
        .filter(Boolean);

}



function arrayToComma(
    value
) {

    if (!Array.isArray(value)) {

        return "";

    }


    return value.join(", ");

}



function formatPrice(
    value
) {

    const number =
        Number(value) || 0;


    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: "USD"
        }
    ).format(number);

}



function getDateStamp() {

    const date =
        new Date();


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}



/* =========================================================
   HTML ESCAPING
   ========================================================= */

function escapeHTML(
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



function escapeAttribute(
    value
) {

    return escapeHTML(
        value
    );

}


/* =========================================================
   VOLTICA ADMIN READY
   ========================================================= */

console.log(
    "VOLTICA ADMIN PRODUCT MANAGER — READY"
);
