const en = {
  common: {
    next: "Next",
    previous: "Previous",
    continue: "Continue",
    back: "Back",
    submit: "Submit",
    cancel: "Cancel",
    save: "Save",
    edit: "Edit",
    done: "Done",

    progress: "Progress",
    completed: "Completed",
    inProgress: "In Progress",
    notStarted: "Not Started",
    locked: "Locked",

    yes: "Yes",
    no: "No",

    required: "Required",
    optional: "Optional",

    loading: "Loading...",
    processing: "Processing...",
    pleaseWait: "Please wait...",
    review: "Review"
  },

  language: {
    title: "Farm Onboarding",
    subtitle: "Choose your preferred language"
  },

  instructions: {
    title: "Instructions",
    consentTitle: "Consent",
    consentStatement:"I agree to share my personal information, including my name, mobile number, address, and photograph, with Farmitopia for the purpose of farmer registration and related services.",
    consentCheckbox: "I have read and agree to the above consent statement.",
    steps: [
      "Answer all questions carefully.",
      "You may answer using voice or manual input.",
      "You can review your answers before submission.",
      "Ensure all information provided is accurate.",
      "Questions can be replayed during the interview."
    ],
    autoRead: "Would you like for the questions to be read?",
    startInterview: "Start Interview"
  },

  sections: {
    farmer: "Farmer Details",
    farm: "Farm Details",
    block: "Block Details",
    review: "Review",
  },

  interview: {
    title: "Interview",
    question: "Question",
    questionOf: "Question {{current}} of {{total}}",
    percentComplete: "{{percent}}% Complete",
    answerLabel: "Your Answer",
    
    repeatQuestion: "Repeat Question",
    readOptions: "Read Options",
    review: "Review Answers",
    finish: "Finish",

    progressHint: "📝 Answer all questions in each section to proceed to the next phase.",
    typeAnswer: "Type your answer...",
    enterValue: "Enter a value",
    selectOption: "Select an option",

    farmerSection: "Farmer Details",
    farmSection: "Farm Details",
    blockSection: "Block Details",

    block: "Block {{number}}",

    resume: "Resuming your previous session...",

    photo: "Capture Photo",
    retakePhoto: "Retake Photo"
  },

  voice: {
    record: "Record",
    recording: "Recording...",
    stopRecording: "Stop Recording",
    retryRecording: "Retry Recording",

    transcribing: "Transcribing...",

    noSpeech: "No voice input detected. Please try again.",
    microphoneDenied: "Microphone permission denied.",
    microphoneUnavailable: "Microphone is unavailable.",
    unsupported: "Voice input is not supported on this device."
  },

  tts: {
    listenQuestion: "Listen to Question",
    listenAnswer: "Listen to Answer",
    stopAudio: "Stop Audio",

    unsupported: "Text-to-speech is not supported on this device."
  },

  translation: {
    language: "Language",
    translateQuestion: "Translate Question",
    failed: "Translation failed. Please try again."
  },

  autosave: {
    saving: "Saving...",
    saved: "Saved",
    restored: "Previous progress restored.",
    failed: "Unable to save your progress."
  },

  review: {
    title: "Review Your Information",
    subtitle: "Please review your answers before submitting.",

    farmerDetails: "Farmer Details",
    farmDetails: "Farm Details",
    blockDetails: "Block Details",

    submitting: "Submitting...",

    confirmSubmit:
      "Are you sure you want to submit your information?",

    noValue: "Not provided",

    block: "Block",
    photo: "Photo",

    validationError:
      "Please correct the highlighted fields before submitting.",

    unsavedChanges:
      "You have unsaved changes."
  },

  success: {
    title: "Registration Complete",
    subtitle:
      "Your information has been submitted successfully.",

    thankYou:
      "Thank you for completing the interview.",

    referenceId: "Reference ID",
    sessionId: "Session ID",
    submittedOn: "Submitted On",

    message:
      "You can use the reference ID for future communication if needed.",

    startNew: "Start New Registration",
    goHome: "Go to Home"
  },

  validation: {
    required: "This field is required.",

    invalidPhone:
      "Please enter a valid 10-digit mobile number.",

    invalidPincode:
      "Please enter a valid 6-digit PIN code.",

    invalidDate:
      "Please enter a valid date.",

    invalidNumber:
      "Please enter a valid number.",

    invalidSelection:
      "Please select an option.",

    positiveNumber:
      "Please enter a positive number.",

    minValue:
      "Value is below the allowed minimum.",

    maxValue:
      "Value exceeds the allowed maximum.",

    blockCount:
      "Please enter a valid number of blocks.",

    photoRequired:
      "Please capture a photo before continuing.",

    questionRequired:
      "Please answer this question before proceeding.",

    reviewErrors:
      "Please resolve all validation errors before continuing."
  },

  errors: {
    network:
      "Something went wrong. Please check your connection and try again.",

    saveFailed:
      "Unable to save your progress.",

    loadFailed:
      "Unable to load your previous session.",

    sessionExpired:
      "Your session has expired. Please start again.",

    transcriptionFailed:
      "Unable to transcribe your recording. Please try again.",

    translationFailed:
      "Translation failed. Please try again.",

    submitFailed:
      "Failed to submit your information. Please try again."
  }
};

export default en;
