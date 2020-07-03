async function verify_token(token) {
    if (!auth_token || auth_token == "") {
        return {
            valid: false,
            msg: "token not valid",
        };
    }
    var requestOptions = {
        method: "GET",
        redirect: "follow",
    };
    let r = {
        valid: false,
    };
    await fetch("/api/user/verify/" + token, requestOptions)
        .then((response) => response.text())
        .then((result) => {
            console.log("VERIFY RESULT: ", result);
            r = JSON.parse(result);
            console.log(r);
        })
        .catch((error) => console.log("error", error));

    return r;
}
async function get_posts(auth_token) {
    var myHeaders = new Headers();
    myHeaders.append("auth-token", auth_token);

    var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    let posts = [];
    await fetch("/api/posts/", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            posts = result;
        })
        .catch((error) => console.log("error", error));
    posts = JSON.parse(posts);
    return posts;
}

async function login_request(email, password) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        email: email,
        password: password,
    });

    var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    };

    let r = null;

    try {
        await fetch("/api/user/login/", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                result = JSON.parse(result);
                console.log("Result: " + JSON.stringify(result));
                r = result;
                auth_token = result.token;
            });
    } catch (err) {
        logged_in = false;
    }

    if (r.logged_in) {
        logged_in = true;
        window.localStorage.setItem("auth-token", auth_token);
        console.log("AUTH TOKEN", auth_token);

        await use_posts(auth_token);

        update_auth_display(logged_in);
        display_flash_message("");
    } else {
        logged_in = false;
        auth_token = "";
        display_flash_message(r.message);
    }
}

async function signup_request(email, password, name) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        email: email,
        password: password,
        name: name,
    });

    var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    };

    let r = null;

    try {
        await fetch("/api/user/register/", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                result = JSON.parse(result);
                console.log("Result: " + JSON.stringify(result));
                r = result;
                auth_token = result.token;
            });
    } catch (err) {
        logged_in = false;
    }

    if (r.logged_in) {
        logged_in = true;
        window.localStorage.setItem("auth-token", auth_token);
        console.log("AUTH TOKEN", auth_token);

        await use_posts(auth_token);

        update_auth_display(logged_in);
        display_flash_message("");
    } else {
        logged_in = false;
        auth_token = "";
        display_flash_message(r.message);
    }
}

function display_flash_message(message) {
    document.getElementById("flash_message").innerHTML = message;
}
