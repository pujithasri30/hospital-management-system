import { db } from "./firebase.js";
import { collection, addDoc } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

 const hospitals = [
  "City Care Hospital",
  "Apollo Hospital",
  "Yashoda Hospitals",
  "Manipal Hospitals",
  "Help Hospitals",
  "Andhra Hospitals"
];



const specializations = [
  "General Medicine",
  "Cardiology",
  "Dermatology",
  "Orthopedics",
  "Pediatrics",
  "Neurology",
  "Gastroenterology",
  "Pulmonology"
];

const slots = ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"];

async function seedDoctors() {
  for (let hospital of hospitals) {
    for (let spec of specializations) {
      await addDoc(collection(db, "doctors"), {
        name: `Dr. ${spec.split(" ")[0]} ${hospital.split(" ")[0]}`,
        hospitalName: hospital,
        specialization: spec,
        slots: slots
      });
      console.log(`Added ${spec} for ${hospital}`);
    }
  }
  console.log("All doctors added successfully");
}

seedDoctors();
