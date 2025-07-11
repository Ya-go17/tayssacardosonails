const form = document.getElementById("form");
const email = document.getElementById("email");
const password = document.getElementById("password");

form.addEventListener("submit", function (e) {
    e.preventDefault();
    login();
});

function login() {
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    // Verifica campos vazios
    if (emailValue === "" || passwordValue === "") {
        if (emailValue === "") setError(email, "Preencha o campo de email.");
        if (passwordValue === "") setError(password, "Preencha o campo de senha.");
        return;
    }

    // Envia os dados para o backend
    fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: emailValue,
            senha: passwordValue
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            setSuccess(email);
            setSuccess(password);
            alert("Login realizado com sucesso!");
            localStorage.setItem("logado", "true");
            window.location.href = "1.index.html";
        } else {
            if (data.message.includes("Email")) {
                setError(email, data.message);
            } else {
                setError(password, data.message);
            }
        }
    })
    .catch(error => {
        console.error("Erro na requisição:", error);
        alert("Erro no servidor.");
    });
}

function setError(input, message) {
    const formControl = input.parentElement;
    const small = formControl.querySelector("p");
    small.innerText = message;
    formControl.classList.add("error");
    formControl.classList.remove("success");
}

function setSuccess(input) {
    const formControl = input.parentElement;
    const small = formControl.querySelector("p");
    small.innerText = "";
    formControl.classList.add("success");
    formControl.classList.remove("error");
}


const mostrarSenha = document.getElementById("mostrar-senha");
const passwordInput = document.getElementById("password");


document.getElementById('mostrar-senha').addEventListener('change', function () {
  const senhaInput = document.getElementById('password');
  senhaInput.type = this.checked ? 'text' : 'password';
})