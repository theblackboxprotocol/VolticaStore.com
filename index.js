/* =========================================================
   VOLTICA STORE — INDEX.JS
   ========================================================= */


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeVolticaHome();

});


/* =========================================================
   HOME INITIALIZATION
   ========================================================= */

function initializeVolticaHome() {

    setupLaunchDate();

    setupSmoothNavigation();

    setupPageVisibility();

}


/* =========================================================
   LAUNCH DATE
   ========================================================= */

function setupLaunchDate() {

    const launchDate = new Date("2026-09-01T00:00:00");

    const now = new Date();

    const launchElements = document.querySelectorAll(
        "[data-launch-date]"
    );

    launchElements.forEach(element => {

        element.textContent =
            "SEPTEMBER 1ST";

    });


    /*
        Launch state.

        Before September 1st:
        COMING SOON

        From September 1st:
        VOLTICA STORE ONLINE
    */

    const statusElement =
        document.querySelector(".launch-status");

    if (!statusElement) {
        return;
    }


    if (now < launchDate) {

        statusElement.innerHTML = `
            <span class="pulse-dot"></span>
            VOLTICA STORE / COMING SOON
        `;

    } else {

        statusElement.innerHTML = `
            <span class="pulse-dot"></span>
            VOLTICA STORE / ONLINE
        `;

    }

}


/* =========================================================
   SMOOTH NAVIGATION
   ========================================================= */

function setupSmoothNavigation() {

    const anchorLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    anchorLinks.forEach(link => {

        link.addEventListener("click", event => {

            const targetId =
                link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }


            const target =
                document.querySelector(targetId);


            if (!target) {
                return;
            }


            event.preventDefault();


            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });

}


/* =========================================================
   PAGE VISIBILITY
   ========================================================= */

function setupPageVisibility() {

    document.body.classList.add(
        "voltica-page-ready"
    );

}


/* =========================================================
   VOLTICA HOME API
   ========================================================= */

/*
    These functions are intentionally exposed
    for future features.

    Example future use:

    window.VolticaHome.openStore();

*/

window.VolticaHome = {

    openStore() {

        window.location.href =
            "store.html";

    },


    openContact() {

        window.location.href =
            "contact.html";

    },


    getLaunchDate() {

        return new Date(
            "2026-09-01T00:00:00"
        );

    }

};
