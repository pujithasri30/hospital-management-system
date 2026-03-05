export function recommendSpecialization(symptom) {

  symptom = symptom.toLowerCase();

  // Heart related
  if (symptom.includes("heart") || symptom.includes("chest pain"))
    return "Cardiology";

  // Skin related
  if (symptom.includes("skin") || symptom.includes("rash") || symptom.includes("acne"))
    return "Dermatology";

  // Bone related
  if (symptom.includes("bone") || symptom.includes("joint") || symptom.includes("fracture"))
    return "Orthopedics";

  // Child related
  if (symptom.includes("child") || symptom.includes("baby"))
    return "Pediatrics";

  // Brain / headache related
  if (symptom.includes("headache") || symptom.includes("brain") || symptom.includes("migraine"))
    return "Neurology";

  // Stomach related
  if (symptom.includes("stomach") || symptom.includes("gas") || symptom.includes("vomit"))
    return "Gastroenterology";

  // Lungs / breathing
  if (symptom.includes("cough") || symptom.includes("breathing"))
    return "Pulmonology";

  // Fever & general illness
  if (symptom.includes("fever") || symptom.includes("cold"))
    return "General Medicine";

  // Default fallback
  return "General Medicine";
}
