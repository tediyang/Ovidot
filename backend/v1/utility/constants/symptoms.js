const SYMPTOM_CATEGORIES = {
  // Single-select categories
  SINGLE_SELECT: {
    mood: {
      id: 'mood',
      label: 'Mood',
      icon: '😊',
      options: [
        { value: 'happy', label: 'Happy', emoji: '😊' },
        { value: 'sad', label: 'Sad', emoji: '😢' },
        { value: 'anxious', label: 'Anxious', emoji: '😰' },
        { value: 'irritable', label: 'Irritable', emoji: '😤' },
        { value: 'calm', label: 'Calm', emoji: '😌' },
        { value: 'stressed', label: 'Stressed', emoji: '😫' },
        { value: 'tired', label: 'Tired', emoji: '😴' },
        { value: 'energetic', label: 'Energetic', emoji: '⚡' },
        { value: 'focused', label: 'Focused', emoji: '🎯' },
        { value: 'sensitive', label: 'Sensitive', emoji: '🥺' },
      ]
    },
    flow: {
      id: 'flow',
      label: 'Menstrual Flow',
      icon: '🩸',
      options: [
        { value: 'light', label: 'Light', emoji: '🩸' },
        { value: 'medium', label: 'Medium', emoji: '🩸🩸' },
        { value: 'heavy', label: 'Heavy', emoji: '🩸🩸🩸' },
        { value: 'very_heavy', label: 'Very Heavy', emoji: '🩸🩸🩸🩸' },
        { value: 'spotting', label: 'Spotting', emoji: '🩸' },
      ]
    },
    energy: {
      id: 'energy',
      label: 'Energy Level',
      icon: '⚡',
      options: [
        { value: 'very_low', label: 'Very Low', emoji: '🪫' },
        { value: 'low', label: 'Low', emoji: '🔋' },
        { value: 'moderate', label: 'Moderate', emoji: '🔋🔋' },
        { value: 'high', label: 'High', emoji: '⚡' },
        { value: 'very_high', label: 'Very High', emoji: '⚡⚡' },
      ]
    }
  },
  
  // Multi-select categories
  MULTI_SELECT: {
    physical: {
      id: 'physical',
      label: 'Physical Symptoms',
      icon: '💪',
      options: [
        { value: 'cramps', label: 'Cramps', emoji: '💢' },
        { value: 'headache', label: 'Headache', emoji: '🤕' },
        { value: 'backache', label: 'Backache', emoji: '💫' },
        { value: 'breast_tenderness', label: 'Breast Tenderness', emoji: '🤱' },
        { value: 'bloating', label: 'Bloating', emoji: '🎈' },
        { value: 'fatigue', label: 'Fatigue', emoji: '😩' },
        { value: 'nausea', label: 'Nausea', emoji: '🤢' },
        { value: 'dizziness', label: 'Dizziness', emoji: '😵' },
        { value: 'joint_pain', label: 'Joint Pain', emoji: '🦴' },
        { value: 'muscle_aches', label: 'Muscle Aches', emoji: '💪' },
      ]
    },
    emotional: {
      id: 'emotional',
      label: 'Emotional Symptoms',
      icon: '❤️',
      options: [
        { value: 'irritability', label: 'Irritability', emoji: '😠' },
        { value: 'anxiety', label: 'Anxiety', emoji: '😰' },
        { value: 'depression', label: 'Depression', emoji: '😔' },
        { value: 'mood_swings', label: 'Mood Swings', emoji: '🎭' },
        { value: 'crying_spells', label: 'Crying Spells', emoji: '😭' },
        { value: 'anger', label: 'Anger', emoji: '😡' },
        { value: 'overwhelmed', label: 'Overwhelmed', emoji: '😫' },
        { value: 'loneliness', label: 'Loneliness', emoji: '🥺' },
        { value: 'euphoria', label: 'Euphoria', emoji: '🤩' },
        { value: 'apathy', label: 'Apathy', emoji: '😐' },
      ]
    },
    digestive: {
      id: 'digestive',
      label: 'Digestive Symptoms',
      icon: '🍽️',
      options: [
        { value: 'constipation', label: 'Constipation', emoji: '🚫' },
        { value: 'diarrhea', label: 'Diarrhea', emoji: '💩' },
        { value: 'nausea', label: 'Nausea', emoji: '🤢' },
        { value: 'vomiting', label: 'Vomiting', emoji: '🤮' },
        { value: 'stomach_pain', label: 'Stomach Pain', emoji: '🤰' },
        { value: 'appetite_loss', label: 'Appetite Loss', emoji: '😞' },
        { value: 'increased_appetite', label: 'Increased Appetite', emoji: '🍔' },
        { value: 'heartburn', label: 'Heartburn', emoji: '🔥' },
        { value: 'bloating', label: 'Bloating', emoji: '🎈' },
      ]
    },
    sleep: {
      id: 'sleep',
      label: 'Sleep Symptoms',
      icon: '😴',
      options: [
        { value: 'insomnia', label: 'Insomnia', emoji: '🌙' },
        { value: 'excessive_sleep', label: 'Excessive Sleep', emoji: '💤' },
        { value: 'restless_sleep', label: 'Restless Sleep', emoji: '🌊' },
        { value: 'vivid_dreams', label: 'Vivid Dreams', emoji: '💭' },
        { value: 'night_sweats', label: 'Night Sweats', emoji: '💦' },
        { value: 'sleep_apnea', label: 'Sleep Apnea', emoji: '😮' },
        { value: 'early_waking', label: 'Early Waking', emoji: '🌅' },
        { value: 'difficulty_falling_asleep', label: 'Difficulty Falling Asleep', emoji: '😩' },
        { value: 'sleep_quality_poor', label: 'Poor Sleep Quality', emoji: '📉' },
        { value: 'sleep_quality_good', label: 'Good Sleep Quality', emoji: '📈' },
      ]
    },
    skin: {
      id: 'skin',
      label: 'Skin Changes',
      icon: '✨',
      options: [
        { value: 'acne', label: 'Acne', emoji: '😖' },
        { value: 'oily_skin', label: 'Oily Skin', emoji: '💦' },
        { value: 'dry_skin', label: 'Dry Skin', emoji: '🏜️' },
        { value: 'rash', label: 'Rash', emoji: '🤒' },
        { value: 'glowing_skin', label: 'Glowing Skin', emoji: '✨' },
        { value: 'pale_skin', label: 'Pale Skin', emoji: '😶' },
        { value: 'dark_circles', label: 'Dark Circles', emoji: '🫣' },
        { value: 'swelling', label: 'Swelling', emoji: '😤' },
      ]
    },
    cognitive: {
      id: 'cognitive',
      label: 'Cognitive Symptoms',
      icon: '🧠',
      options: [
        { value: 'brain_fog', label: 'Brain Fog', emoji: '🌫️' },
        { value: 'poor_concentration', label: 'Poor Concentration', emoji: '😵' },
        { value: 'forgetfulness', label: 'Forgetfulness', emoji: '🤔' },
        { value: 'confusion', label: 'Confusion', emoji: '😕' },
        { value: 'slow_processing', label: 'Slow Processing', emoji: '🐢' },
        { value: 'sharp_focus', label: 'Sharp Focus', emoji: '🎯' },
        { value: 'creativity_boost', label: 'Creativity Boost', emoji: '💡' },
        { value: 'poor_decision_making', label: 'Poor Decision Making', emoji: '🤷' },
      ]
    },
    sexual: {
      id: 'sexual',
      label: 'Sexual Symptoms',
      icon: '💕',
      options: [
        { value: 'high_libido', label: 'High Libido', emoji: '🔥' },
        { value: 'low_libido', label: 'Low Libido', emoji: '🥶' },
        { value: 'painful_intercourse', label: 'Painful Intercourse', emoji: '😣' },
        { value: 'increased_arousal', label: 'Increased Arousal', emoji: '💓' },
        { value: 'decreased_arousal', label: 'Decreased Arousal', emoji: '💔' },
        { value: 'vaginal_dryness', label: 'Vaginal Dryness', emoji: '🏜️' },
        { value: 'vaginal_wetness', label: 'Vaginal Wetness', emoji: '💧' },
      ]
    },
    behavioral: {
      id: 'behavioral',
      label: 'Behavioral Changes',
      icon: '🔄',
      options: [
        { value: 'cravings', label: 'Food Cravings', emoji: '🍫' },
        { value: 'social_withdrawal', label: 'Social Withdrawal', emoji: '🚪' },
        { value: 'increased_socializing', label: 'Increased Socializing', emoji: '👥' },
        { value: 'procrastination', label: 'Procrastination', emoji: '⏰' },
        { value: 'productivity_boost', label: 'Productivity Boost', emoji: '📈' },
        { value: 'impulsive_decisions', label: 'Impulsive Decisions', emoji: '🎰' },
        { value: 'increased_risk_taking', label: 'Increased Risk Taking', emoji: '🎲' },
        { value: 'decreased_motivation', label: 'Decreased Motivation', emoji: '😞' },
      ]
    }
  }
};

// Helper to get all categories
SYMPTOM_CATEGORIES.getAllCategories = function() {
  return {
    ...this.SINGLE_SELECT,
    ...this.MULTI_SELECT
  };
};

// Helper to get category by ID
SYMPTOM_CATEGORIES.getCategory = function(categoryId) {
  const all = this.getAllCategories();
  return all[categoryId] || null;
};

// Helper to get options for a category
SYMPTOM_CATEGORIES.getOptions = function(categoryId) {
  const category = this.getCategory(categoryId);
  return category ? category.options : [];
};  // All symptoms stored in one document

// Helper to get category type
SYMPTOM_CATEGORIES.getCategoryType = function(categoryId) {
  if (this.SINGLE_SELECT[categoryId]) return 'single';
  if (this.MULTI_SELECT[categoryId]) return 'multi';
  return null;
};

module.exports = { SYMPTOM_CATEGORIES };