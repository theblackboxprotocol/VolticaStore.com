/* =====================================================
   VOLTICA STORE
   ADMIN API AUTHENTICATION
   ===================================================== */

const API_URL =
    "https://api.volticastore.com/api/admin-api.php";


async function authenticateAPI() {

    const password = prompt(
        "VOLTICA STORE\n\nADMIN PASSWORD"
    );


    if (!password) {

        alert("Admin password required.");

        return false;

    }


    try {

        const response = await fetch(
            API_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    password: password
                })
            }
        );


        const result =
            await response.json();


        console.log(
            "VOLTICA API RESPONSE:",
            result
        );


        if (
            !response.ok ||
            !result.success
        ) {

            alert(
                "AUTHENTICATION FAILED\n\n" +
                (
                    result.error ||
                    "Invalid administrator password."
                )
            );

            return false;

        }


        alert(
            "✓ ADMIN AUTHENTICATED\n\n" +
            "✓ API CONNECTION SUCCESSFUL"
        );


        return true;


    } catch (error) {

        console.error(
            "VOLTICA API ERROR:",
            error
        );


        alert(
            "API CONNECTION FAILED\n\n" +
            error.message
        );


        return false;

    }

}
