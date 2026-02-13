document.addEventListener("DOMContentLoaded", async () => {

  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    showLogin();
  } else {
    showDashboard();
  }

});

function showLogin() {

  document.body.innerHTML = `
    <div style="text-align:center; margin-top:100px;">
      <h2>Login</h2>
      <input type="email" id="email" placeholder="Email"><br><br>
      <input type="password" id="password" placeholder="Password"><br><br>
      <button onclick="login()">Login</button>
    </div>
  `;
}

async function login() {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(error.message);
  } else {
    location.reload();
  }
}

function showDashboard() {
  alert("Logged in successfully 🎉");
}
