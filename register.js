const registerBtn = document.getElementById("registerBtn");
const newUsername = document.getElementById("newUsername");
const newPassword = document.getElementById("newPassword");

registerBtn.addEventListener("click", () => {
  const user = newUsername.value.trim();
  const pass = newPassword.value.trim();
  if (!user || !pass) {
    alert("Please enter both username and password.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const exists = users.some(u => u.username === user);

  if (exists) {
    alert("Username already exists.");
    return;
  }

  users.push({ username: user, password: pass });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Account created successfully!");
  window.location.href = "login.html";
});
