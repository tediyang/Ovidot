/**
 * Takes a number between 0 and 11 and returns the corresponding full month name.
 * @param {number} num The number of the month, where 0 is January and 11 is December.
 * @returns {string} The full month name.
 * @example getFullMonth(0) // "January"
 */
const getFullMonth = (num) => {
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  return monthNames[num];
}

/**
 * Returns a random tip based on the provided event type.
 * @param {String} event The type of event, can be one of: period, ovulation, fertile_window, safe_days.
 * @returns {String} A random tip relevant to the given event type.
 */
const getTips = (event) => {
  const tips = {
    period: [
      "Use a heating pad to soothe cramps.",
      "Stay hydrated with water and herbal tea.",
      "Eat iron-rich foods like spinach and red meat.",
      "Do light, gentle exercises like walking or yoga.",
      "Prioritize rest and get plenty of sleep.",
      "Avoid salty and highly processed foods.",
      "Take warm baths to help relax your muscles.",
      "Wear comfortable, breathable clothing.",
      "Consider over-the-counter pain relievers if needed.",
      "Listen to your body and don't push yourself too hard.",
      "Drink ginger or peppermint tea for nausea.",
      "Practice mindfulness to manage mood swings."
    ],
    ovulation: [
      "Eat a balanced diet to support hormone health.",
      "Track your basal body temperature for changes.",
      "Pay attention to cervical mucus consistency.",
      "Engage in stress-reducing activities like meditation.",
      "Maintain a healthy weight for better fertility.",
      "Ensure you get enough folic acid in your diet.",
      "Limit alcohol and caffeine consumption.",
      "Get consistent, quality sleep every night.",
      "Stay physically active with moderate exercise.",
      "Consider taking a prenatal vitamin.",
      "Eat foods rich in Vitamin D.",
      "Communicate openly with your partner."
    ],
    fertile_window: [
      "Maintain a healthy and balanced diet.",
      "Avoid smoking and excessive alcohol use.",
      "Manage stress to support hormonal balance.",
      "Stay adequately hydrated throughout the day.",
      "Take a prenatal or multivitamin with folic acid.",
      "Avoid extreme physical exertion.",
      "Monitor for ovulation symptoms like cramping.",
      "Get enough quality sleep every night.",
      "Be mindful of any medications you are taking."
    ],
    safe_days: [
      "Focus on overall health and wellness.",
      "Use this time for more intense workouts.",
      "Continue eating a healthy and balanced diet.",
      "Catch up on rest and relaxation.",
      "Explore new hobbies or activities you enjoy.",
      "Stay consistent with your sleep schedule.",
      "Take time for yourself to de-stress.",
      "Enjoy this lower-pressure part of your cycle.",
      "Try new recipes with nutrient-rich foods.",
      "Go for long walks.",
      'Remember, no mood swings today... "smiles"'
    ]
  }

  const selectedTipsArray = tips[event];
  if (!selectedTipsArray) {
    return "Invalid event key provided.";
  }

  // Generate a random index number
  const randomIndex = Math.floor(Math.random() * selectedTipsArray.length);

  // Return the element at the random index
  return selectedTipsArray[randomIndex];
}

export { getFullMonth, getTips };
