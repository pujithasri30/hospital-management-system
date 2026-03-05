import { db } from "./firebase.js";
import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

  const hospitalDiv = document.getElementById("adminHospitals");
  const doctorDiv = document.getElementById("adminDoctors");
  const appointmentDiv = document.getElementById("adminAppointments");

  const hospitalSection = document.getElementById("hospitalSection");
  const doctorSection = document.getElementById("doctorSection");
  const appointmentSection = document.getElementById("appointmentSection");

  const selectedHospitalTitle = document.getElementById("selectedHospitalTitle");
  const selectedDoctorTitle = document.getElementById("selectedDoctorTitle");

  const backToHospitals = document.getElementById("backToHospitals");
  const backToDoctors = document.getElementById("backToDoctors");

  // ==========================
  // LOAD HOSPITALS
  // ==========================
  async function loadHospitals() {

    hospitalDiv.innerHTML = `<div class="loader">Loading hospitals...</div>`;

    const snapshot = await getDocs(collection(db, "hospitals"));

    hospitalDiv.innerHTML = "";

    if (snapshot.empty) {
      hospitalDiv.innerHTML = "<p>No hospitals found.</p>";
      return;
    }

    snapshot.forEach(doc => {
      const data = doc.data();

      const card = document.createElement("div");
      card.classList.add("history-card");
      card.innerHTML = `<b>${data.name}</b>`;

      card.addEventListener("click", () => {
        showDoctors(data.name);
      });

      hospitalDiv.appendChild(card);
    });
  }

  // ==========================
  // SHOW DOCTORS
  // ==========================
  async function showDoctors(hospitalName) {

    hospitalSection.style.display = "none";
    doctorSection.style.display = "block";
    appointmentSection.style.display = "none";

    selectedHospitalTitle.innerText = "Doctors at " + hospitalName;

    doctorDiv.innerHTML = `<div class="loader">Loading doctors...</div>`;

    const q = query(
      collection(db, "doctors"),
      where("hospitalName", "==", hospitalName)
    );

    const snapshot = await getDocs(q);

    doctorDiv.innerHTML = "";

    if (snapshot.empty) {
      doctorDiv.innerHTML = "<p>No doctors found.</p>";
      return;
    }

    snapshot.forEach(doc => {
      const data = doc.data();

      const card = document.createElement("div");
      card.classList.add("history-card");
      card.innerHTML = `${data.name} - ${data.specialization}`;

      card.addEventListener("click", () => {
        showAppointments(data.name);
      });

      doctorDiv.appendChild(card);
    });
  }

  // ==========================
  // SHOW APPOINTMENTS
  // ==========================
  async function showAppointments(doctorName) {

    doctorSection.style.display = "none";
    appointmentSection.style.display = "block";

    selectedDoctorTitle.innerText = "Appointments for " + doctorName;

    appointmentDiv.innerHTML = `<div class="loader">Loading appointments...</div>`;

    const q = query(
      collection(db, "appointments"),
      where("doctor", "==", doctorName)
    );

    const snapshot = await getDocs(q);

    appointmentDiv.innerHTML = "";

    if (snapshot.empty) {
      appointmentDiv.innerHTML = "<p>No appointments found.</p>";
      return;
    }

    snapshot.forEach(doc => {
      const data = doc.data();

      appointmentDiv.innerHTML += `
        <div class="history-card">
          <b>Hospital:</b> ${data.hospital}<br>
          <b>Date:</b> ${data.date || "N/A"}<br>
          <b>Slot:</b> ${data.slot}<br>
          <b>Status:</b> ${data.status}
        </div>
      `;
    });
  }

  // ==========================
  // BACK BUTTONS
  // ==========================
  backToHospitals.addEventListener("click", () => {
    doctorSection.style.display = "none";
    hospitalSection.style.display = "block";
  });

  backToDoctors.addEventListener("click", () => {
    appointmentSection.style.display = "none";
    doctorSection.style.display = "block";
  });

  // Start
  loadHospitals();

});
