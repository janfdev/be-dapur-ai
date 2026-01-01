const createPrompt = ({
  category,
  ingredients,
  adjustmentText,
  preferences,
}) => {
  const { calorieLimit, spicyLevel, avoidFoods } = preferences || {};

  let preferenceText = "";
  if (calorieLimit)
    preferenceText += `- Batas Kalori: < ${calorieLimit} kkal\n`;
  if (spicyLevel) preferenceText += `- Tingkat Pedas: ${spicyLevel}/10\n`;
  if (avoidFoods) preferenceText += `- Hindari Bahan: ${avoidFoods}\n`;

  // Specific rules based on category
  let categoryRules = "";
  if (category === "Makanan Bayi") {
    categoryRules = `
- Tekstur harus disesuaikan untuk bayi (lunak/bubur/finger food sesuai usia umum)
- HINDARI gula dan garam berlebih (atau tiadakan)
- Fokus pada nutrisi untuk pertumbuhan`;
  } else if (category === "Makanan Sehat") {
    categoryRules = `
- Gunakan metode masak yang sehat (kukus, rebus, panggang)
- Minimalkan minyak dan lemak jenuh
- Fokus pada keseimbangan gizi (protein, serat, karbo)`;
  } else {
    // Makanan Berat (Default)
    categoryRules = `- Fokus pada rasa yang kaya dan mengenyangkan`;
  }

  return `
Buatkan resep **${category}** berdasarkan bahan:

${ingredients.join(", ")}

Aturan Umum:
- Mudah dibuat (simple)
- Waktu < 60 menit
${categoryRules}
${adjustmentText ? `- Tambahan User: ${adjustmentText}` : ""}
${preferenceText || "- Tanpa preferensi diet khusus"}

Format Output:
- Nama Resep
- Bahan
- Langkah - langkah pembuatannya
- Estimasi Kalori
- Estimasi Waktu pembuatan
`;
};

module.exports = { createPrompt };
