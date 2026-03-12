/**
 * SportSphere Authentication Logic
 * Integrated with Firebase Google Auth
 */

// Your web app's Firebase configuration
// REPLACE WITH YOUR ACTUAL CONFIG FROM FIREBASE CONSOLE
const firebaseConfig = {
    apiKey: "AIzaSyCsVSChZyM3Xg3ty21sv5op8p8pkJ95a9w",
    authDomain: "sportsphere-fc094.firebaseapp.com",
    projectId: "sportsphere-fc094",
    storageBucket: "sportsphere-fc094.firebasestorage.app",
    messagingSenderId: "740927287406",
    appId: "1:740927287406:web:110d678c5c508dd55f367f",
    measurementId: "G-Q3BFCYZ40V"
};

// Initialize Firebase
let app, auth, googleProvider;

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    console.log("Firebase initialized successfully");
} catch (error) {
    console.warn("Firebase initialization failed. Configuration required.");
}

// Function to Sign In with Google
window.signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        console.log("Logged in as:", user.displayName);

        // Redirect to dashboard (Handles relative paths better for GitHub Pages)
        const isGithubPages = window.location.hostname.includes('github.io');
        const basePath = isGithubPages ? '/SportSphere/' : '/';
        window.location.href = basePath + 'client-dashboard.html';
    } catch (error) {
        console.error("Google Sign-In Error:", error.code, error.message);

        // Suppress errors that occur when a user cancels the login or a popup is already open
        const silentErrors = [
            'auth/cancelled-popup-request',
            'auth/popup-closed-by-user',
            'auth/user-cancelled'
        ];

        if (silentErrors.includes(error.code)) {
            console.log("Sign-in interaction was cancelled by user.");
            return;
        }

        if (error.code === 'auth/configuration-not-found') {
            alert("Configuration Error: Please update your Firebase keys in js/auth-logic.js");
        } else if (error.code === 'auth/unauthorized-domain') {
            alert("Security Error: This domain is not authorized in Firebase Console. Please add " + window.location.hostname + " to Authorized Domains.");
        } else {
            alert("Sign-in failed: " + error.message);
        }
    }
};

// Function to Logout
window.logout = async () => {
    try {
        await signOut(auth);
        const isGithubPages = window.location.hostname.includes('github.io');
        const basePath = isGithubPages ? '/SportSphere/' : '/';
        window.location.href = basePath + 'index.html';
    } catch (error) {
        console.error("Logout Error:", error.message);
    }
};

// Monitor Auth State (Global)
if (auth) {
    onAuthStateChanged(auth, (user) => {
        const path = window.location.pathname;
        const isDashboard = path.includes('dashboard.html') || path.includes('client-dashboard.html');
        const isAuthPage = path.includes('auth.html');

        if (user) {
            console.log("User is signed in:", user.displayName);
            if (isAuthPage) {
                const isGithubPages = window.location.hostname.includes('github.io');
                const basePath = isGithubPages ? '/SportSphere/' : '/';
                window.location.href = basePath + 'client-dashboard.html';
            }
            // Update UI elements if in dashboard
            updateDashboardUI(user);
        } else {
            console.log("No user signed in");
            if (isDashboard) {
                const isGithubPages = window.location.hostname.includes('github.io');
                const basePath = isGithubPages ? '/SportSphere/' : '/';
                window.location.href = basePath + 'auth.html';
            }
        }
    });
}

function updateDashboardUI(user) {
    // This function will be called on the dashboard to populate user info
    const userNameEl = document.getElementById('user-name-display');
    const userRoleEl = document.getElementById('user-role-display');
    const userImgEl = document.getElementById('user-avatar-display');
    const userInitialEl = document.getElementById('user-initial-display');

    // Update Navbar button in index.html
    const navAuthBtn = document.getElementById('nav-auth-btn');
    if (navAuthBtn && user.displayName) {
        navAuthBtn.innerText = "Dashboard";
        navAuthBtn.href = "client-dashboard.html";
    }

    if (userNameEl) userNameEl.innerText = user.displayName;

    // Simple logic to set role based on dashboard type
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
        userInitialEl.innerText = user.displayName ? user.displayName.charAt(0) : 'U';
        userInitialEl.style.display = 'flex';
        if (userImgEl) userImgEl.style.display = 'none';
    }
}
