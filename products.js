/* =========================================================
   VOLTICA STORE — PRODUCT DATABASE
   Version: 2.0
   Products: 21
   ========================================================= */

"use strict";


/* =========================================================
   PRODUCT DATABASE
   ========================================================= */

const volticaProducts = [

    /* =====================================================
       PRODUCT 01 — VOLTICA Q17
       ===================================================== */

    {
        id: "earbuds1",
        sku: "CJYP266383702BY",

        name: "Voltica Q17",
        category: "SPORT AUDIO",
        badge: "NEW",

        price: 69.97,
        currency: "USD",

        images: [
            "assets/images/earbuds1-1.webp",
            "assets/images/earbuds1-2.jpg",
            "assets/images/earbuds1-3.jpg",
            "assets/images/earbuds1-4.jpg",
            "assets/images/earbuds1-5.jpg",
            "assets/images/earbuds1-6.jpg",
            "assets/images/earbuds1-7.jpg",
            "assets/images/earbuds1-8.jpg",
            "assets/images/earbuds1-9.jpg"
        ],

        description:
            "Wireless neckband earbuds with an ear-hook fit, digital display, 8+ hours of battery life and up to 10 meters of Bluetooth range.",

        specifications: [
            ["MODEL", "YYK-Q17"],
            ["COLOR", "Gem Blue"],
            ["VERSION", "Electroplated"],
            ["TRANSMISSION DISTANCE", "Up to 10 meters"],
            ["CHIP", "Zhongke Bluetrum"],
            ["BATTERY LIFE", "8+ hours"],
            ["MATERIAL", "Plastic"],
            ["WEARING STYLE", "Ear-hook"],
            ["FUNCTIONS", "Music / Calls / Voice Control"]
        ],

        features: [
            ["01", "8+ HOURS", "Extended battery life for everyday listening and workouts."],
            ["02", "10 METERS", "Wireless transmission distance of up to 10 meters."],
            ["03", "DIGITAL DISPLAY", "Integrated display for essential battery information."],
            ["04", "EAR-HOOK FIT", "Secure fit designed for active movement."],
            ["05", "VOICE CONTROL", "Convenient voice-control functionality."],
            ["06", "MUSIC + CALLS", "Designed for music playback and hands-free calls."]
        ],

        stripe:
            "https://buy.stripe.com/dRm3cwe0vbor31S4ym2Ji01"
    },


    /* =====================================================
       PRODUCT 02 — VOLTICA TWS PRO
       ===================================================== */

    {
        id: "earbuds2",
        sku: "CJEJ263111801AZ",

        name: "Voltica TWS Pro",
        category: "WIRELESS AUDIO",
        badge: "FEATURED",

        price: 59.97,
        currency: "USD",

        images: [
            "assets/images/earbuds2-1.webp",
            "assets/images/earbuds2-2.webp",
            "assets/images/earbuds2-3.webp",
            "assets/images/earbuds2-4.webp",
            "assets/images/earbuds2-5.webp",
            "assets/images/earbuds2-6.webp",
            "assets/images/earbuds2-7.webp",
            "assets/images/earbuds2-8.webp"
        ],

        description:
            "True wireless earbuds with touch controls, CVC noise cancellation, IPX4 protection and a magnetic charging case.",

        specifications: [
            ["PRODUCT TYPE", "Wireless 5.0 Earbuds"],
            ["TRANSMISSION RANGE", "10m / 32.8ft"],
            ["FREQUENCY", "2.4GHz – 2.48GHz"],
            ["SNR", "-90dB"],
            ["TALK TIME", "4 hours"],
            ["MUSIC PLAY TIME", "4 hours"],
            ["EARBUD BATTERY", "65mAh per earbud"],
            ["CHARGING DOCK", "500mAh rechargeable battery"],
            ["DOCK CHARGING TIME", "2.5 hours"],
            ["WATERPROOF", "IPX4"],
            ["MATERIAL", "ABS"],
            ["EARBUD WEIGHT", "6g each"],
            ["DOCK WEIGHT", "48g"],
            ["SUPPORT", "English / Chinese"]
        ],

        features: [
            ["01", "TRUE WIRELESS", "Use both earbuds together or independently."],
            ["02", "TOUCH CONTROL", "Control calls, music and voice assistance by touch."],
            ["03", "CVC NOISE CANCELLATION", "Technology designed for clearer calls."],
            ["04", "MAGNETIC CHARGING", "Magnetic charging dock securely holds the earbuds."],
            ["05", "500mAh DOCK", "Portable charging case provides additional charges."],
            ["06", "IPX4", "Water-resistant design for everyday active use."]
        ],

        stripe:
            "https://buy.stripe.com/7sY28s5tZ78bbyo9SG2Ji02"
    },


    /* =====================================================
       PRODUCT 03 — VOLTICA T11
       ===================================================== */

    {
        id: "earbuds3",
        sku: "CJEJ137306101AZ",

        name: "Voltica T11",
        category: "WIRELESS AUDIO",
        badge: "NEW",

        price: 49.97,
        currency: "USD",

        images: [
            "assets/images/earbuds3-1.webp",
            "assets/images/earbuds3-2.webp",
            "assets/images/earbuds3-3.webp",
            "assets/images/earbuds3-4.webp",
            "assets/images/earbuds3-5.webp",
            "assets/images/earbuds3-6.webp"
        ],

        description:
            "Bluetooth 5.0 stereo earbuds with a 15-meter transmission range, battery display, voice control and multi-point connectivity.",

        specifications: [
            ["TRANSMISSION RANGE", "15 meters"],
            ["FUNCTIONS", "Battery Display / Calls / Voice Control / Music / Multi-Point"],
            ["BLUETOOTH PROTOCOL", "5.0"],
            ["CHANNEL", "Stereo"],
            ["WEARING STYLE", "Earplug"],
            ["EAR MODE", "Bilateral Stereo"]
        ],

        features: [
            ["01", "15 METERS", "Extended wireless transmission range."],
            ["02", "BLUETOOTH 5.0", "Reliable wireless connectivity."],
            ["03", "STEREO AUDIO", "Bilateral stereo configuration."],
            ["04", "MULTI-POINT", "Supports multi-point connection."],
            ["05", "VOICE CONTROL", "Voice-control functionality."],
            ["06", "CALLS + MUSIC", "Designed for calls and everyday music."]
        ],

        stripe:
            "https://buy.stripe.com/4gM9AU9KffEHcCs1ma2Ji05"
    },


    /* =====================================================
       PRODUCT 04 — VOLTICA T75
       ===================================================== */

    {
        id: "earbuds4",
        sku: "VLT-AUD-T75-001",

        name: "Voltica T75",
        category: "OPEN-EAR AUDIO",
        badge: "NEW",

        price: 39.99,
        currency: "USD",

        images: [
            "assets/images/earbuds4-1.webp",
            "assets/images/earbuds4-2.webp",
            "assets/images/earbuds4-3.webp",
            "assets/images/earbuds4-4.webp",
            "assets/images/earbuds4-5.webp",
            "assets/images/earbuds4-6.jpg",
            "assets/images/earbuds4-7.webp"
        ],

        description:
            "Open-ear wireless earbuds with an ergonomic ear-clip design, low-latency Bluetooth, touch controls and IPX5 water resistance.",

        specifications: [
            ["MODEL", "T75"],
            ["DESIGN", "Open-Ear Ear Clip"],
            ["CONNECTIVITY", "Bluetooth Wireless"],
            ["AUDIO MODE", "Low-Latency Dual Channel"],
            ["CONTROL", "Touch Control"],
            ["WATER RESISTANCE", "IPX5"],
            ["AUDIO", "Hi-Fi"],
            ["WEARING STYLE", "Ear Clip"],
            ["GLASSES COMPATIBILITY", "Yes"],
            ["COLORS", "Black / White / Beige-Cream"]
        ],

        features: [
            ["01", "OPEN-EAR DESIGN", "Sits outside the ear canal while keeping you aware of your surroundings."],
            ["02", "LOW LATENCY", "Designed for improved audio and visual synchronization."],
            ["03", "IPX5", "Water and sweat-resistant construction."],
            ["04", "TOUCH CONTROL", "Convenient touch controls for everyday functions."],
            ["05", "ERGONOMIC FIT", "Flexible ear-clip design compatible with glasses."],
            ["06", "HI-FI AUDIO", "High-sensitivity speaker design for detailed wireless audio."]
        ],

        stripe:
            "https://buy.stripe.com/5kQ6oI9Kf9gj8mc3ui2Ji06"
    },


    /* =====================================================
       PRODUCT 05 — VOLTICA J10 GAMING KEYBOARD SET
       ===================================================== */

    {
        id: "keyboard1",
        sku: "VLT-GAM-J10-001",

        name: "Voltica J10",
        category: "GAMING GEAR",
        badge: "NEW",

        price: 43.99,
        currency: "USD",

        images: [
            "assets/images/keyboard1-1.webp",
            "assets/images/keyboard1-2.webp",
            "assets/images/keyboard1-3.webp",
            "assets/images/keyboard1-4.webp",
            "assets/images/keyboard1-5.webp",
            "assets/images/keyboard1-6.webp",
            "assets/images/keyboard1-7.webp",
            "assets/images/keyboard1-8.webp"
        ],

        description:
            "Wired gaming keyboard and mouse set with a 108-key layout, USB connectivity and vibrant tri-color backlighting.",

        specifications: [
            ["PRODUCT TYPE", "Gaming Keyboard + Mouse Set"],
            ["KEYBOARD", "108 Keys"],
            ["CONNECTION", "Wired"],
            ["INTERFACE", "USB"],
            ["BACKLIGHT", "Tri-Color"],
            ["KEYBOARD TYPE", "Gaming Keyboard"],
            ["MOUSE", "Wired Gaming Mouse"],
            ["USE", "Gaming / Desktop / Everyday Use"]
        ],

        features: [
            ["01", "108-KEY LAYOUT", "Full-size layout for gaming and productivity."],
            ["02", "TRI-COLOR BACKLIGHT", "Colorful illumination for a distinctive setup."],
            ["03", "WIRED CONTROL", "Direct USB connection."],
            ["04", "KEYBOARD + MOUSE", "Complete gaming combination included."],
            ["05", "USB CONNECTION", "Plug-and-play wired connectivity."],
            ["06", "GAMING DESIGN", "Bold illuminated gaming aesthetic."]
        ],

        stripe:
            "https://buy.stripe.com/00w9AU1dJ9gj45Wfd02Ji07"
    },
// =================================================
// PRODUCT 21 — XREAL AIR 1S
// ======================

{
    id: "xreal-air-1s",

    sku: "VLT-XREAL-1S",

    name: "XREAL Air 1S | AI Augmented Reality Smart Glasses",

    category: "LIFESTYLE",

    badge: "NEW",

    supplierLink:
        "https://www.alibaba.com/x/B2LYxb?ck=pdp",

    cost:
        "464.76",

    price:
        "579.99",

    currency: "USD",

    images: [
        "assets/images/glass1-1.webp",
        "assets/images/glass1-2.webp",
        "assets/images/glass1-3.webp",
        "assets/images/glass1-4.webp",
        "assets/images/glass1-5.webp",
        "assets/images/glass1-6.webp"
    ],

    description:
        "Step into the future of spatial computing and wearable displays with the Voltica XREAL 1S. Engineered to bridge the digital and physical worlds, these next-generation AR glasses deliver an astounding, cinema-grade virtual screen experience directly to your field of view. Equipped with advanced AI integration, automatic electrochromic lenses, and premium acoustic co-tuning, they transform gaming, entertainment, and mobile workflows into an immersive masterpiece.",

    specifications: [
        ["Model Reference", "XREAL 1S"],
        ["Field of View (FOV)", "52° immersive wide view"],
        ["Virtual Screen Range", "Adjustable from 31 inches up to 500 inches (1m to 10m distance adjustment)"],
        ["Distortion Control", "TV distortion under 1% for hyper-realistic visuals"],
        ["Processor", "Advanced X1 Chipset for ultra-fluid performance"],
        ["Connectivity", "USB-CDP Plug & Play"]
    ],

    features: [
        ["01", "Immersive 52° Field of View (FOV)", "Projects a massive, crystal-clear virtual screen equivalent to a 500-inch display, putting you right in the front row of your content."],
        ["02", "Automatic Electrochromic Lenses", "Intelligently adapts to your lighting environment, becoming automatically transparent when you turn your head."],
        ["03", "Smart AI Integration", "Features voice wake-up for hands-free control, real-time photo recognition for object identification, and instant photo-to-text translation for global communication."],
        ["04", "Certified Eye Comfort", "Backed by multiple German TÜV Rheinland certifications including 5-star eye comfort, low blue light, and zero flicker to eliminate fatigue during long sessions."],
        ["05", "Universal USB-CDP Plug & Play", "Instantly connects to your favorite modern devices including smartphones, tablets, laptops, and portable gaming handhelds."]
    ],

    stripe:
        "https://buy.stripe.com/14A28se0v78bauk4ym2Ji0o"
},
