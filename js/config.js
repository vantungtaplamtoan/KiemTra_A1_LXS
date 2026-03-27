window.APP_CONFIG = {
  TOTAL_QUESTIONS: 15,
  EXAM_TIME_SECONDS: 50 * 60,
  SCORE_SCALE: 10,
  REPORT_EMAIL: "loctung126@gmail.com",
  REPORT_ENDPOINT: "https://script.google.com/macros/s/AKfycby04QpR6QDnCJO0pJqrZIsAQXMnbXqLLZ4BinrapRitKOLeEKfmR-4CI9DqHnLTnKWE/exec",
  AUTO_SUBMIT_ON_TIMEOUT: true
};

window.createInitialAppState = function () {
  return {
    currentUser: null,
    currentSessionId: null,
    currentExamNumber: 0,
    usedQuestionIdsByLevel: {},
    examQuestions: [],
    answers: [],
    currentQuestionIndex: 0,
    remainingTime: window.APP_CONFIG.EXAM_TIME_SECONDS,
    examResult: null,
    timerIntervalId: null,
    isExamInProgress: false,
    reportStatusByQuestion: {}
  };
};

window.APP_STATE = window.createInitialAppState();