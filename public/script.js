let auth_token = "";
let logged_in = false;
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
    posts = JSON.parse(posts)
    return posts;
}

window.onload = async function () {
    console.log("Loaded");

    auth_token = window.localStorage.getItem("auth-token");

    let {
        valid
    } = await verify_token(auth_token);

    logged_in = valid;

    update_auth_display(logged_in)

    if (auth_token && logged_in) {
        console.log("auth token found");

        use_posts(auth_token)



    }

    let form = document.querySelector("#sign_in");
    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        console.log("Submitted");

        let email = document.querySelector("#email_signup").value;
        let password = document.querySelector("#password_signup").value;
        console.log(email, password);

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

            await use_posts(auth_token)

            update_auth_display(logged_in)
        } else {
            logged_in = false;
            auth_token = "";
        }
    });

    let logout = document.querySelector("#logout");

    logout.addEventListener("click", function (e) {
        e.preventDefault();

        // logout
        localStorage.clear();
        auth_token = "";
        logged_in = false;

        update_auth_display(logged_in)
    });
};

async function use_posts(auth_token) {
    const posts = await get_posts(auth_token);

    console.log("POSTS: ", posts);
    document.getElementById("posts").innerHTML = ""
    for (let i = 0; i < posts.length; i++) {
        const post = posts[i]
        document.getElementById("posts").innerHTML += "<li> " +
            JSON.stringify(post) + "</li> "

    }

}

function update_auth_display(logged_in) {
    if (logged_in) {
        document.getElementById("signed_out").style.display = "none"
        document.getElementById("signed_in").style.display = "block"
    } else {
        document.getElementById("signed_out").style.display = "block"
        document.getElementById("signed_in").style.display = "none"
    }
}