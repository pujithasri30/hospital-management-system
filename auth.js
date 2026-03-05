import { auth, db } from "./firebase.js";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { 
  setDoc, doc, getDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// REGISTER
const registerBtn = document.getElementById("registerBtn");
if (registerBtn) {
  registerBtn.addEventListener("click", async () => {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    const userCred = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", userCred.user.uid), {
      name,
      email,
      role
    });

    alert("Registered");
    window.location.href = "index.html";
  });
}

// LOGIN
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    try {

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      const userCred = await signInWithEmailAndPassword(auth, email, password);

      const snap = await getDoc(doc(db, "users", userCred.user.uid));

      if (!snap.exists()) {
        alert("User record not found");
        return;
      }

      const role = snap.data().role;

      if (role === "patient") {
        window.location.href = "patient-dashboard.html";
      }
      else if (role === "doctor") {
        window.location.href = "doctor-dashboard.html";
      }
      else if (role === "admin") {
        window.location.href = "admin-dashboard.html";
      }
      else {
        alert("Invalid role");
      }

    } catch (error) {
      alert(error.message);
    }
  });
}
