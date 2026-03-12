/**
 * SportSphere Authentication Logic
 * Integrated with Firebase Google Auth
 */

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRRSQXFaxOejj3t6Px9TmKtKaIRTklruE",
  authDomain: "newsportdb.firebaseapp.com",
  projectId: "newsportdb",
  storageBucket: "newsportdb.firebasestorage.app",
  messagingSenderId: "881802739414",
  appId: "1:881802739414:web:c31ca6781d9fb88dd6d377",
  measurementId: "G-PHL37D1LF8"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

let app, auth, googleProvider, analytics;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    analytics = getAnalytics(app);
    console.log("Firebase initialized successfully with Analytics");
} catch (error) {
    console.error("Firebase initialization failed:", error);
}

// Helper to check if Firebase is ready
const isFirebaseReady = () => {
    if (!auth) {
        alert("Firebase not initialized. Please check your configuration in js/auth-logic.js");
        return false;
    }
    return true;
};

// Function to Sign In with Google
window.signInWithGoogle = async () => {
    if (!isFirebaseReady()) return;
    try {
        const result = await signInWithPopup(auth, googleProvider);
        console.log("Google Sign-In Success:", result.user.displayName);
        window.location.href = 'client-dashboard.html';
    } catch (error) {
        handleAuthError(error, "Google Sign-In");
    }
};

// Function for Email Sign Up
window.signUpWithEmail = async (email, password) => {
    if (!isFirebaseReady()) return;
    if (!email || !password) {
        alert("Please provide both email and password.");
        return;
    }
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Account created:", result.user.email);
        
        // Try to update profile with a name if provided
        const nameInput = document.getElementById('signup-name');
        if (nameInput && nameInput.value) {
            await updateProfile(result.user, { displayName: nameInput.value });
        }
        
        window.location.href = 'client-dashboard.html';
    } catch (error) {
        handleAuthError(error, "Registration");
    }
};

// Function for Email Sign In
window.signInWithEmail = async (email, password) => {
    if (!isFirebaseReady()) return;
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        console.log("Email Sign-In Success:", result.user.email);
        window.location.href = 'client-dashboard.html';
    } catch (error) {
        handleAuthError(error, "Login");
    }
};

// Function to Logout
window.logout = async () => {
    if (!isFirebaseReady()) return;
    try {
        await signOut(auth);
        window.location.href = 'index.html';
    } catch (error) {
        console.error("Logout Error:", error.message);
    }
};

// Centralized Error Handling
function handleAuthError(error, context) {
    console.error(`${context} Error:`, error.code, error.message);
    
    const silentErrors = [
        'auth/cancelled-popup-request',
        'auth/popup-closed-by-user',
        'auth/user-cancelled'
    ];

    if (silentErrors.includes(error.code)) return;

    let userMessage = `${context} failed: ${error.message}`;
    
    if (error.code === 'auth/configuration-not-found' || error.code === 'auth/invalid-api-key') {
        userMessage = "Configuration Error: Your Firebase project keys are invalid or missing.";
    } else if (error.code === 'auth/unauthorized-domain') {
        userMessage = `Security Error: This domain (${window.location.hostname}) is not authorized in Firebase Console.`;
    } else if (error.code === 'auth/email-already-in-use') {
        userMessage = "This email is already registered. Please sign in instead.";
    } else if (error.code === 'auth/weak-password') {
        userMessage = "Password should be at least 6 characters.";
    } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        userMessage = "Invalid email or password.";
    }

    alert(userMessage);
}

// Monitor Auth State
if (auth) {
    onAuthStateChanged(auth, (user) => {
        const path = window.location.pathname;
        const isDashboard = path.includes('dashboard.html') || path.includes('client-dashboard.html');
        const isAuthPage = path.includes('auth.html');

        if (user) {
            console.log("Auth State: User Active", user.email);
            if (isAuthPage) {
                window.location.href = 'client-dashboard.html';
            }
            updateDashboardUI(user);
        } else {
            console.log("Auth State: Guest");
            if (isDashboard) {
                window.location.href = 'auth.html';
            }
            resetNavbarButton();
        }
    });
}

function updateDashboardUI(user) {
    // 1. Update Navbar (index.html)
    const navAuthBtn = document.getElementById('nav-auth-btn');
    if (navAuthBtn) {
        navAuthBtn.innerText = "Dashboard";
        navAuthBtn.href = "client-dashboard.html";
        navAuthBtn.classList.add('active-user');
    }

    // 2. Update Dashboard Profile (client-dashboard.html / dashboard.html)
    const userNameEl = document.getElementById('user-name-display');
    const userRoleEl = document.getElementById('user-role-display');
    const userImgEl = document.getElementById('user-avatar-display');
    const userInitialEl = document.getElementById('user-initial-display');

    if (userNameEl) userNameEl.innerText = user.displayName || user.email.split('@')[0];

    if (userRoleEl) {
        if (window.location.pathname.includes('client-dashboard.html')) {
            userRoleEl.innerText = "Elite Player";
        } else if (window.location.pathname.includes('dashboard.html')) {
            userRoleEl.innerText = "Center Director";
        }
    }

    if (userImgEl && user.photoURL) {
        userImgEl.src = user.photoURL;
        userImgEl.style.display = 'block';
        if (userInitialEl) userInitialEl.style.display = 'none';
    } else if (userInitialEl) {
        const displayInitial = user.displayName ? user.displayName.charAt(0) : (user.email ? user.email.charAt(0).toUpperCase() : 'U');
        userInitialEl.innerText = displayInitial;
        userInitialEl.style.display = 'flex';
        if (userImgEl) userImgEl.style.display = 'none';
    }
}

function resetNavbarButton() {
    const navAuthBtn = document.getElementById('nav-auth-btn');
    if (navAuthBtn) {
        navAuthBtn.innerText = "Member Portal";
        navAuthBtn.href = "auth.html";
        navAuthBtn.classList.remove('active-user');
    }
}
