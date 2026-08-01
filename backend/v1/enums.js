const Collections = {
  User: 'User',
  Cycle: 'Cycle',
  Email: 'Email',
  Admin: 'Admin'
};

const Role = {
  user: 'USER',
  admin: 'ADMIN',
  super_admin: 'SUPER ADMIN'
};

const emailStatus = {
  pending: 'PENDING',
  sent: 'SENT',
  failed: 'FAILED'
};

const emailType = {
  welcome: 'WELCOME',
  forget: 'FORGET',
  delete: 'DELETE',
  deactivate: 'DEACTIVATE'
};

const userStatus = {
  active: 'ACTIVE',
  deactivated: 'DEACTIVATED', // user action and admin
};

const userAction = {
  deletedCycle: "DELETED_CYCLE",
  resetPassword: "RESET_PASSWORD",
  createdCycle: "CREATED_CYCLE",
  updatedCycle: "UPDATED_CYCLE",
  updatedUser: "UPDATED_USER",
  createdUser: "CREATED_USER",
  deactivatedUser: "DEACTIVATED_USER",
}

const notificationStatus = {
  unread: 'UNREAD',
  read: 'READ'
};

const timeShare = {
  hour: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  minute: 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  month: 30 * 24 * 60 * 60 * 1000,
  year: 365 * 24 * 60 * 60 * 1000,
};

const symptoms = {
  mood: {
    happy: "HAPPY",
    sad: "SAD",
    anxious: "ANXIOUS",
    irritable: "IRRITABLE",
    calm: "CALM",
    stressed: "STRESSED",
    tired: "TIRED",
    energetic: "ENERGETIC",
    focused: "FOCUSED",
    sensitive: "SENSITIVE",
  },
  flow: {
    light: "LIGHT",
    medium: "MEDIUM",
    heavy: "HEAVY",
    very_heavy: "VERY_HEAVY",
    spotting: "SPOTTING",
  },
  energy: {
    very_low: "VERY_LOW",
    low: "LOW",
    moderate: "MODERATE",
    high: "HIGH",
    very_high: "VERY_HIGH",
  },
  physical: {
    cramps: "CRAMPS",
    headache: "HEADACHE",
    backache: "BACKACHE",
    breast_tenderness: "BREAST_TENDERNESS",
    bloating: "BLOATING",
    fatigue: "FATIGUE",
    nausea: "NAUSEA",
    dizziness: "DIZZINESS",
    joint_pain: "JOINT_PAIN",
    muscle_aches: "MUSCLE_ACHES",
  },
  emotional: {
    irritability: "IRRITABILITY",
    anxiety: "ANXIETY",
    depression: "DEPRESSION",
    mood_swings: "MOOD_SWINGS",
    crying_spells: "CRYING_SPELLS",
    anger: "ANGER",
    overwhelmed: "OVERWHELMED",
    loneliness: "LONELINESS",
    euphoria: "EUPHORIA",
    apathy: "APATHY",
  },
  digestive: {
    constipation: "CONSTIPATION",
    diarrhea: "DIARRHEA",
    nausea: "NAUSEA",
    vomiting: "VOMITING",
    stomach_pain: "STOMACH_PAIN",
    appetite_loss: "APPETITE_LOSS",
    increased_appetite: "INCREASED_APPETITE",
    heartburn: "HEARTBURN",
    gas: "GAS",
    bloating: "BLOATING",
  },
  sleep: {
    insomnia: "INSOMNIA",
    excessive_sleep: "EXCESSIVE_SLEEP",
    restless_sleep: "RESTLESS_SLEEP",
    vivid_dreams: "VIVID_DREAMS",
    night_sweats: "NIGHT_SWEATS",
    sleep_apnea: "SLEEP_APNEA",
    early_waking: "EARLY_WAKING",
    difficulty_falling_asleep: "DIFFICULTY_FALLING_ASLEEP",
    sleep_quality_poor: "SLEEP_QUALITY_POOR",
    sleep_quality_good: "SLEEP_QUALITY_GOOD",
  },
  skin: {
    acne: "ACNE",
    oily_skin: "OILY_SKIN",
    dry_skin: "DRY_SKIN",
    rash: "RASH",
    glowing_skin: "GLOWING_SKIN",
    pale_skin: "PALE_SKIN",
    dark_circles: "DARK_CIRCLES",
    swelling: "SWELLING",
  },
  cognitive: {
    brain_fog: "BRAIN_FOG",
    poor_concentration: "POOR_CONCENTRATION",
    forgetfulness: "FORGETFULNESS",
    confusion: "CONFUSION",
    slow_processing: "SLOW_PROCESSING",
    sharp_focus: "SHARP_FOCUS",
    creativity_boost: "CREATIVITY_BOOST",
    poor_decision_making: "POOR_DECISION_MAKING",
  },
  sexual: {
    high_libido: "HIGH_LIBIDO",
    low_libido: "LOW_LIBIDO",
    painful_intercourse: "PAINFUL_INTERCOURSE",
    increased_arousal: "INCREASED_AROUSAL",
    decreased_arousal: "DECREASED_AROUSAL",
    vaginal_dryness: "VAGINAL_DRYNESS",
    vaginal_wetness: "VAGINAL_WETNESS",
  },
  behavioral: {
    cravings: "CRAVINGS",
    social_withdrawal: "SOCIAL_WITHDRAWAL",
    increased_socializing: "INCREASED_SOCIALIZING",
    procrastination: "PROCRASTINATION",
    productivity_boost: "PRODUCTIVITY_BOOST",
    impulsive_decisions: "IMPULSIVE_DECISIONS",
    increased_risk_taking: "INCREASED_RISK_TAKING",
    decreased_motivation: "DECREASED_MOTIVATION",
  },
};


module.exports = { 
  Role,
  Collections,
  emailStatus,
  emailType,
  userStatus,
  userAction,
  notificationStatus,
  timeShare,
  symptoms
};
