import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { db } from "./firebase.js";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { recommendSpecialization } from "./ai.js";

document.addEventListener("DOMContentLoaded", () => {

  const locationSelect = document.getElementById("locationSelect");
  const hospitalList = document.getElementById("hospitalList");
  const bookingSection = document.getElementById("bookingSection");
  const doctorResult = document.getElementById("doctorResult");
  const findDoctorBtn = document.getElementById("findDoctorBtn");
  const backBtn = document.getElementById("backToHospitals");
  const historyContent = document.getElementById("historyContent");

  const uploadBtn = document.getElementById("uploadReportBtn");
  const reportInput = document.getElementById("reportFile");
  const reportsList = document.getElementById("reportsList");

  const auth = getAuth();
  let selectedHospital = "";
  let uploadedFiles = [];

  // ==============================
  // Load Hospitals
  // ==============================
  locationSelect.addEventListener("change", async () => {

    hospitalList.innerHTML = "";
    doctorResult.innerHTML = "";
    bookingSection.style.display = "none";

    const location = locationSelect.value;
    if (!location) return;

    const q = query(
      collection(db, "hospitals"),
      where("location", "==", location)
    );

    const snapshot = await getDocs(q);

    snapshot.forEach(doc => {
      const data = doc.data();

      const hospitalCard = document.createElement("div");
      hospitalCard.classList.add("hospital-card");

      hospitalCard.innerHTML = `
        <h4>${data.name}</h4>
        <p>${data.address}</p>
      `;

      hospitalCard.addEventListener("click", () => {
        selectedHospital = data.name;
        hospitalList.style.display = "none";
        bookingSection.style.display = "block";

        document.getElementById("selectedHospitalTitle").innerText =
          "Booking at " + data.name;

        doctorResult.innerHTML = "";
      });

      hospitalList.appendChild(hospitalCard);
    });
  });

  // ==============================
  // Back Button
  // ==============================
  backBtn.addEventListener("click", () => {
    bookingSection.style.display = "none";
    hospitalList.style.display = "block";
    doctorResult.innerHTML = "";
  });

  // ==============================
  // Find Doctor
  // ==============================
  findDoctorBtn.addEventListener("click", async () => {

    if (!selectedHospital) {
      alert("Please select a hospital first");
      return;
    }

    const symptom = document.getElementById("symptom").value;
    const specialization = recommendSpecialization(symptom);

    const q = query(
      collection(db, "doctors"),
      where("hospitalName", "==", selectedHospital),
      where("specialization", "==", specialization)
    );

    const snapshot = await getDocs(q);

    doctorResult.innerHTML = "";

    if (snapshot.empty) {
      doctorResult.innerHTML =
        `<p>No doctors available under ${specialization}</p>`;
      return;
    }

    snapshot.forEach(doc => {

      const d = doc.data();
      const today = new Date().toISOString().split("T")[0];

      const doctorCard = document.createElement("div");
      doctorCard.classList.add("doctor-card");

      doctorCard.innerHTML = `
        <h4>${d.name} (${d.specialization})</h4>

        <label>Select Date:</label>
        <input type="date" class="dateSelect" min="${today}"><br><br>

        <label>Select Time Slot:</label>
        <select class="slotSelect">
          ${d.slots.map(slot =>
            `<option value="${slot}">${slot}</option>`
          ).join("")}
        </select>
        <br><br>

        <button class="confirmBtn">Confirm Appointment</button>
        <hr>
      `;

      doctorCard.querySelector(".confirmBtn")
        .addEventListener("click", async () => {

          const slot =
            doctorCard.querySelector(".slotSelect").value;

          const date =
            doctorCard.querySelector(".dateSelect").value;

          if (!date) {
            alert("Please select a date");
            return;
          }

          const user = auth.currentUser;
// Get all bookings for that doctor on selected date
const dateQuery = query(
  collection(db, "appointments"),
  where("doctor", "==", d.name),
  where("date", "==", date)
);

const dateSnapshot = await getDocs(dateQuery);

// Total slots doctor has
const totalSlots = d.slots.length;

// Already booked slots
const bookedSlots = dateSnapshot.size;

// 🔴 Case 2: All slots booked
if (bookedSlots >= totalSlots) {
  alert("Doctor not available on selected date. Please change date or hospital.");
  return;
}

// 🔴 Case 1: Selected slot booked
const conflictQuery = query(
  collection(db, "appointments"),
  where("doctor", "==", d.name),
  where("date", "==", date),
  where("slot", "==", slot)
);

const conflictSnapshot = await getDocs(conflictQuery);

if (!conflictSnapshot.empty) {
  alert("Time slot not available. Please choose another slot.");
  return;
}
         await addDoc(collection(db, "appointments"), {
  patientId: user.uid,
  patientName: user.email,  
  hospital: selectedHospital,
  doctor: d.name,
  specialization: d.specialization,
  date: date,
  slot: slot,
  status: "Booked",
  createdAt: new Date()
});

alert("Appointment Booked Successfully");

// 🔹 Reset form after success
doctorCard.querySelector(".dateSelect").value = "";
doctorCard.querySelector(".slotSelect").selectedIndex = 0;
        });


      doctorResult.appendChild(doctorCard);
    });
  });

  // ==============================
  // Load History
  // ==============================
  async function loadHistory() {

    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "appointments"),
      where("patientId", "==", user.uid)
    );

    const snapshot = await getDocs(q);

    historyContent.innerHTML = "";

    if (snapshot.empty) {
      historyContent.innerHTML = "<p>No appointments yet</p>";
      return;
    }

    snapshot.forEach(doc => {
      const data = doc.data();

      historyContent.innerHTML += `
        <div class="history-card">
          <b>${data.hospital}</b><br>
          Doctor: ${data.doctor}<br>
          Specialization: ${data.specialization}<br>
          Date: ${data.date}<br>
          Slot: ${data.slot}<br>
          Status: ${data.status}
        </div>
      `;
    });
  }

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.innerText.includes("History")) {
        loadHistory();
      }
    });
  });

  // ==============================
  // Local File Upload (Demo)
  // ==============================
  if (uploadBtn) {

    uploadBtn.addEventListener("click", () => {

      const file = reportInput.files[0];

      if (!file) {
        alert("Please select a file");
        return;
      }

      const fileURL = URL.createObjectURL(file);

      uploadedFiles.push({
        name: file.name,
        url: fileURL
      });

      displayReports();
      reportInput.value = "";
    });

    function displayReports() {

      reportsList.innerHTML = "";

      if (uploadedFiles.length === 0) {
        reportsList.innerHTML = "<p>No files uploaded.</p>";
        return;
      }

      uploadedFiles.forEach(file => {
        reportsList.innerHTML += `
          <div class="history-card">
            <a href="${file.url}" target="_blank">
              ${file.name}
            </a>
          </div>
        `;
      });
    }
  }

});
