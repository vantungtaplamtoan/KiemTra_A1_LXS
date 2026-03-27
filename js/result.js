window.gradeExam = function () {
  const questions = window.APP_STATE.examQuestions;
  const answers = window.APP_STATE.answers;

  let correctCount = 0;

  questions.forEach((question, index) => {
    if (answers[index] === question.correctAnswer) {
      correctCount += 1;
    }
  });

  const totalQuestions = questions.length;
  const rawScore = (correctCount / totalQuestions) * window.APP_CONFIG.SCORE_SCALE;
  const finalScore = Number(rawScore.toFixed(2));

  window.APP_STATE.examResult = {
    correctCount,
    totalQuestions,
    finalScore,
    examNumber: window.APP_STATE.currentExamNumber
  };

  return window.APP_STATE.examResult;
};

window.showResultScreen = function () {
  window.stopExamTimer();
  window.APP_STATE.isExamInProgress = false;

  const result = window.APP_STATE.examResult || window.gradeExam();

  const correctCountEl = document.getElementById("correct-count");
  const finalScoreEl = document.getElementById("final-score");
  const totalQuestionCountEl = document.getElementById("total-question-count");
  const resultAttemptNumberEl = document.getElementById("result-attempt-number");

  if (correctCountEl) {
    correctCountEl.textContent = result.correctCount;
  }

  if (finalScoreEl) {
    finalScoreEl.textContent = result.finalScore;
  }

  if (totalQuestionCountEl) {
    totalQuestionCountEl.textContent = result.totalQuestions;
  }

  if (resultAttemptNumberEl) {
    resultAttemptNumberEl.textContent = result.examNumber;
  }

  window.updateUserInfoOnUI();
  window.showScreen("result-screen");
};
