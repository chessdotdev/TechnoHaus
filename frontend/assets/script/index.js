const container = document.getElementById('container');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');
// const logoutBtn = document.getElementById('logoutBtn');

// logoutBtn.addEventListener('click', async () => {
//   const logout = await fetch('http://localhost:3000/api/user/logout', {
//     method: 'POST'
//   });
//   window.location.href = "/";

// })



showRegister.addEventListener('click', () => {
    container.classList.add('active');
});

showLogin.addEventListener('click', () => {
    container.classList.remove('active');
});


// Select elements
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

const showRegisterLink = document.getElementById("show-register");
const showLoginLink = document.getElementById("show-login");

// Show Register Form
showRegisterLink.addEventListener("click", () => {
    container.classList.add("register-mode");
});

// Show Login Form
showLoginLink.addEventListener("click", () => {
    container.classList.remove("register-mode");
});


// Handle Register Form Submission
registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    const errorEmail = document.querySelector(".errorEmail")
    const errorPassword = document.querySelector(".errorPassword")

    try {
        const response = await fetch("http://localhost:3000/api/user/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });

        const result = await response.json();
        

        if(result.message){
             errorEmail.textContent = result.message
             errorPassword.textContent = result.message

        }

        if (response.status === 201) {
            alert(result.message);
            // Optionally, you can auto-login after registration or redirect.
            document.getElementById("register-form").reset();
            container.classList.remove("register-mode"); // Switch to login form
        } else {
            // alert(result.message);
        }
    } catch (error) {
        console.error("Error:", error);
    }
});

// Handle Login Form Submission
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    try {
        const response = await fetch("http://localhost:3000/api/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });

        const result = await response.json();     
           
        if (response.status === 200) {
            alert(result.message);
            document.getElementById("login-form").reset();
            console.log(result.user.role);
            
           const role = result.user.role;
       
            // Redirect based on role
            if (role === "admin") {
                location.assign("/addproduct"); 
            } else if (role === "customer") {
                location.assign("/product"); 
            } else {
                alert("Unknown role, cannot redirect.");
            }

       

        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong, please try again.");
    }
});


function fetchUser(){
    
}