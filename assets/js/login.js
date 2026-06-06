// Supabase Configuration
const SUPABASE_URL = 'https://ihgyzkjaxdjscugzcpfe.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloZ3l6a2pheGRqc2N1Z3pjcGZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MTkzMDcsImV4cCI6MjA5NjI5NTMwN30.QxFZjQ2s1DGtwrUhA0vCzSN6zuqk35DSIiUyYIQS4dE';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', async () => {
    // Real Supabase auth is active
    const mockAuth = false;

    if (mockAuth) {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
            window.location.replace('index.html');
            return;
        }
    } else {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session && session.user) {
            window.location.replace('index.html');
            return;
        }
    }

    const authForm = document.getElementById('auth-form');
    const formTitle = document.getElementById('form-title');
    const formSubtitle = document.getElementById('form-subtitle');
    const submitBtn = document.getElementById('submit-btn');
    const toggleLink = document.getElementById('toggle-link');
    const nameRow = document.getElementById('name-row');
    const socialContainer = document.getElementById('social-container');
    const dividerText = document.getElementById('divider-text');
    const forgotLink = document.getElementById('forgot-link');
    const errorBox = document.getElementById('error-message');
    const togglePassBtn = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');

    // Toggle Password Visibility
    togglePassBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassBtn.innerHTML = type === 'password' ? '<i class="far fa-eye"></i>' : '<i class="far fa-eye-slash"></i>';
    });

    const isLoginDefault = true; 
    let isLogin = isLoginDefault; 

    // Initial UI state for Login
    formTitle.textContent = "Welcome Back";
    formSubtitle.textContent = "Please enter your details to login.";
    submitBtn.textContent = "Log In";
    document.getElementById('footer-text').innerHTML = 'Don\'t have an account? <span class="toggle-auth" id="toggle-link">Sign up</span>';
    nameRow.classList.add('hidden');
    forgotLink.classList.remove('hidden');
    
    // Re-bind toggle link since we replaced innerHTML
    function bindToggle() {
        const link = document.getElementById('toggle-link');
        if (link) {
            link.addEventListener('click', () => {
                isLogin = !isLogin;
                updateUI();
            });
        }
    }
    bindToggle();

    function updateUI() {
        if (isLogin) {
            formTitle.textContent = "Welcome Back";
            formSubtitle.textContent = "Please enter your details to login.";
            submitBtn.textContent = "Log In";
            document.getElementById('footer-text').innerHTML = 'Don\'t have an account? <span class="toggle-auth" id="toggle-link">Sign up</span>';
            nameRow.classList.add('hidden');
            forgotLink.classList.remove('hidden');
        } else {
            formTitle.textContent = "Sign Up Account";
            formSubtitle.textContent = "Enter your details to create your account.";
            submitBtn.textContent = "Sign Up";
            document.getElementById('footer-text').innerHTML = 'Already have an account? <span class="toggle-auth" id="toggle-link">Log in</span>';
            nameRow.classList.remove('hidden');
            forgotLink.classList.add('hidden');
        }
        bindToggle();
        errorBox.classList.add('hidden');
    }

    // Update steps UI on the left
    function updateSteps(activeNum) {
        document.querySelectorAll('.step-item').forEach(item => item.classList.remove('active'));
        const activeNode = document.getElementById(`step-node-${activeNum}`);
        if (activeNode) activeNode.classList.add('active');
    }

    // Handle Auth Submission
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorBox.classList.add('hidden');
        submitBtn.disabled = true;
        submitBtn.textContent = isLogin ? "Logging in..." : "Creating account...";

        const email = document.getElementById('email').value;
        const password = passwordInput.value;
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;

        // --- MOCK AUTH BYPASS FOR NOW ---
        if (mockAuth) {
            localStorage.setItem('isLoggedIn', 'true');
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = isLogin ? "Log In" : "Sign Up";
                window.location.replace('index.html');
            }, 600);
            return;
        }

        try {
            if (isLogin) {
                // LOGIN
                const { data, error } = await supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password,
                });

                if (error) throw error;
                
                // Success — replace so back button doesn't go back to login
                window.location.replace('index.html');
            } else {
                // SIGNUP
                const { data, error } = await supabaseClient.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: {
                            full_name: `${firstName} ${lastName}`,
                            first_name: firstName,
                            last_name: lastName
                        }
                    }
                });

                if (error) throw error;

                if (data.user && data.session) {
                    // Signed up & logged in immediately
                    window.location.replace('index.html');
                } else if (data.user) {
                    // Confirmation email sent
                    alert("Account created! Please check your email for confirmation link.");
                    isLogin = true;
                    toggleLink.click();
                }
            }
        } catch (err) {
            console.error("Auth error:", err);
            errorBox.textContent = err.message || "An error occurred during authentication.";
            errorBox.classList.remove('hidden');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = isLogin ? "Log In" : "Sign Up";
        }
    });

    // Handle Social Login (Google & Github)
    const googleBtn = document.getElementById('google-btn');
    const githubBtn = document.getElementById('github-btn');

    if (googleBtn) {
        googleBtn.addEventListener('click', async () => {
            const redirectTo = window.location.origin + '/index.html';
            const { error } = await supabaseClient.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo }
            });
            if (error) {
                errorBox.textContent = error.message;
                errorBox.classList.remove('hidden');
            }
        });
    }

    if (githubBtn) {
        githubBtn.addEventListener('click', async () => {
            const redirectTo = window.location.origin + '/index.html';
            const { error } = await supabaseClient.auth.signInWithOAuth({
                provider: 'github',
                options: { redirectTo }
            });
            if (error) {
                errorBox.textContent = error.message;
                errorBox.classList.remove('hidden');
            }
        });
    }
});
