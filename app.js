document.getElementById("signupForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const user = {
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };


    const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });


    const result = await response.json();

    console.log(result);
});