const loginBtn = document.getElementById("loginBtn");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const rememberCheckbox = document.getElementById("rememberMe");

function loginWithUsers(users) {
  const user = usernameInput.value.trim();
  const pass = passwordInput.value.trim();

  if (!user || !pass) {
    alert("Please enter both username and password.");
    return;
  }

  const validUser = users.find(u => u.username === user && u.password === pass);
  if (!validUser) {
    alert("Invalid credentials.");
    return;
  }

  if (rememberCheckbox.checked) {
    localStorage.setItem("rememberedUser", user);
  }

  localStorage.setItem("loggedInUser", user);
  alert("Login successful!");
  window.location.href = "index.html";
}

// Try to fetch users.json first
fetch("data/users.json")
  .then(res => {
    if (!res.ok) throw new Error("No file found");
    return res.json();
  })
  .then(users => {
    loginBtn.addEventListener("click", () => loginWithUsers(users));
  })
  .catch(() => {
    // Fallback to localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    loginBtn.addEventListener("click", () => loginWithUsers(users));
  });
