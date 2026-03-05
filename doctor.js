import { getAuth, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { db } from "./firebase.js";

import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

  const auth = getAuth();
  const container = document.getElementById("doctorAppointments");

  onAuthStateChanged(auth, async (user) => {

    if (!user) {
      window.location.href = "login.html";
      return;
    }

    loadDoctorAppointments(user);
  });

  async function loadDoctorAppointments(user) {

    container.innerHTML = "<p>Loading appointments...</p>";

    // Step 1: Find doctor profile by email
    const doctorQuery = query(
      collection(db, "doctors"),
      where("email", "==", user.email)
    );

    const doctorSnapshot = await getDocs(doctorQuery);

    if (doctorSnapshot.empty) {
      container.innerHTML = "<p>No doctor profile found.</p>";
      return;
    }

    const doctorData = doctorSnapshot.docs[0].data();
    const doctorName = doctorData.name;

    // Step 2: Fetch only this doctor's appointments
    const appointmentQuery = query(
      collection(db, "appointments"),
      where("doctor", "==", doctorName)
    );

    const appointmentSnapshot = await getDocs(appointmentQuery);

    container.innerHTML = "";

    if (appointmentSnapshot.empty) {
      container.innerHTML = "<p>No appointments assigned.</p>";
      return;
    }

    appointmentSnapshot.forEach(docSnap => {

      const data = docSnap.data();
      const appointmentId = docSnap.id;

      const card = document.createElement("div");
      card.classList.add("history-card");

      card.innerHTML = `
        <b>Patient ID:</b> ${data.patientId}<br>
        <b>Hospital:</b> ${data.hospital}<br>
        <b>Date:</b> ${data.date}<br>
        <b>Time:</b> ${data.slot}<br>
        <b>Status:</b> ${data.status}<br><br>

        <select class="statusSelect">
          <option value="Booked" ${data.status === "Booked" ? "selected" : ""}>Booked</option>
          <option value="Completed" ${data.status === "Completed" ? "selected" : ""}>Completed</option>
          <option value="Cancelled" ${data.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
        </select>

        <button class="updateBtn">Update</button>
      `;

      // Update status
      card.querySelector(".updateBtn")
        .addEventListener("click", async () => {

          const newStatus =
            card.querySelector(".statusSelect").value;

          await updateDoc(doc(db, "appointments", appointmentId), {
            status: newStatus
          });

          loadDoctorAppointments(user);
        });

      container.appendChild(card);
    });
  }

});
