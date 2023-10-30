window.onload = function () {
    let loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        login();
    });
}


async function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let role = document.getElementById("selectRole").value;

    let data = {
        email: email,
        password: password,
        role: role
    };

    let url = "http://localhost:3010/api/v1/auth/login";

    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    });

    let result = await response.json();

    console.log(result);
    console.log(response.status);

    if (response.ok) {
        if (result.role === 'doctor') {
            window.location.href = "http://localhost:3010/api/v1/doctors";
        } else {
            window.location.href = "http://localhost:3010/api/v1/visits";
        }
    } else {
        const errorMessage = document.getElementById("errorText");
        errorMessage.classList.remove('visually-hidden');
        errorMessage.innerHTML = result.message + ". " + "Incorrect email or password";
    }
}