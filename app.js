document.addEventListener("DOMContentLoaded", async () => {

    lucide.createIcons();

    const authContainer = document.getElementById("auth-container");
    const appContainer = document.getElementById("app-container");
    const loadingOverlay = document.getElementById("loading-overlay");

    // Hide dashboard initially
    appContainer.style.display = "none";

    // Check current session
    const { data } = await supabase.auth.getUser();

    if (data.user) {
        showDashboard(data.user);
    } else {
        showLogin();
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange((event, session) => {
        if (session) {
            showDashboard(session.user);
        } else {
            showLogin();
        }
    });

    if (loadingOverlay) loadingOverlay.style.display = "none";

    // =========================
    // LOGIN SCREEN
    // =========================

    function showLogin() {
        appContainer.style.display = "none";

        authContainer.innerHTML = `
            <div style="text-align:center; margin-top:120px;">
                <h2 style="margin-bottom:20px;">Welcome to Nexus Planner</h2>
                <input type="email" id="email" placeholder="Email" 
                       style="padding:10px; width:250px;"><br><br>
                <input type="password" id="password" placeholder="Password" 
                       style="padding:10px; width:250px;"><br><br>
                <button id="login-btn" style="padding:10px 20px;">Login</button>
                <button id="signup-btn" style="padding:10px 20px; margin-left:10px;">Sign Up</button>
            </div>
        `;

        document.getElementById("login-btn").addEventListener("click", login);
        document.getElementById("signup-btn").addEventListener("click", signup);
    }

    async function login() {
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email || !password) {
            alert("Please fill all fields");
            return;
        }

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            alert(error.message);
        }
    }

    async function signup() {
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email || !password) {
            alert("Please fill all fields");
            return;
        }

        const { error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) {
            alert(error.message);
        } else {
            alert("Signup successful! Check your email.");
        }
    }

    // =========================
    // DASHBOARD
    // =========================

    function showDashboard(user) {

        authContainer.innerHTML = "";
        appContainer.style.display = "block";

        // Display user info
        const nameElement = document.getElementById("display-name");
        const uidElement = document.getElementById("display-uid");

        if (nameElement) nameElement.textContent = user.email;
        if (uidElement) uidElement.textContent = user.id;

        console.log("Logged in as:", user.email);
    }

    // =========================
    // LOGOUT
    // =========================

    const logoutBtn = document.getElementById("logout-btn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            await supabase.auth.signOut();
        });
    }

});