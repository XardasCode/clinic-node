window.onload = function () {
    let registerForm = document.getElementById("registerForm");
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();
        register();
    });
}

async function register() {
    let name = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let data = {
        name: name,
        email: email,
        password: password
    };

    let url = "http://localhost:3010/api/v1/auth/signup";

    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (response.status === 201) {
        alert("Registration successful");
        window.location.href = "http://localhost:3010/api/v1/auth";
    } else {
        const errorMessage = document.getElementById("errorEmail");
        errorMessage.classList.remove('visually-hidden');
        errorMessage.innerHTML = "Email already exists";
    }
}