let auth_token = "";
let logged_in = false;
async function verify_token(token) {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    let r = {
        valid: false
    }
    await fetch("/api/user/verify/" + token, requestOptions)
        .then(response => response.text())
        .then(result => {
            r = JSON.parse(result)
            console.log(r)
        })
        .catch(error => console.log('error', error));

    return r
}
async function get_posts(auth_token) {

    var myHeaders = new Headers();
    myHeaders.append("auth-token",
        auth_token);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    let posts = []
    await fetch("/api/posts/", requestOptions)
        .then(response => response.text())
        .then(result => {

            posts = result
        })
        .catch(error => console.log('error', error));


    return posts

}


window.onload = async function () {
    console.log("Loaded")

    auth_token = window.localStorage.getItem('auth-token');

    let {
        valid
    } = await verify_token(auth_token)

    logged_in = valid
    console.log(valid)
    if (auth_token && valid) {
        console.log("auth token found")

        const posts = await get_posts(auth_token)

        console.log("POSTS: ", posts)

    }


    let form = document.querySelector("#sign_in");
    form.addEventListener("submit", async function (e) {
        e.preventDefault()
        console.log("Submitted")

        let email = document.querySelector("#email_signup").value;
        let password = document.querySelector("#password_signup").value;
        console.log(email, password)

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "email": email,
            "password": password
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        try {
            let r = null;

            await fetch("/api/user/login/", requestOptions)
                .then(response => response.text())
                .then(result => {
                    result = JSON.parse(result)
                    console.log("Result: " + result)
                    r = result
                    auth_token = result.token
                })

            if (r.logged_in) {
                logged_in = true

            } else {
                logged_in = false
                auth_token = ""
            }


        } catch (err) {
            logged_in = false;

        }

        window.localStorage.setItem('auth-token', auth_token);
        console.log("AUTH TOKEN", auth_token)


        const posts = await get_posts(auth_token)

        console.log("POSTS: ", posts)
    })


    let button = document.querySelector("#logout")

    button.addEventListener("click", function (e) {
        e.preventDefault();

        // logout
        localStorage.clear()
        auth_token = ""
        logged_in = false
    })
}