document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  const startExamBtn = document.getElementById("start-exam-btn");
  const newExamBtn = document.getElementById("new-exam-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const submitBtn = document.getElementById("submit-btn");
  const reviewBtn = document.getElementById("review-btn");
  const reviewBackResultBtn = document.getElementById("review-back-result-btn");

  if (loginForm) {
    loginForm.addEventListener("submit", window.handleLogin);
  }

  if (startExamBtn) {
    startExamBtn.addEventListener("click", window.goToExamScreen);
  }

  if (newExamBtn) {
    newExamBtn.addEventListener("click", window.goToExamScreen);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      window.resetAppStateForLogout();
      window.showScreen("login-screen");
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", window.goPrevQuestion);
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", window.goNextQuestion);
  }

  if (submitBtn) {
    submitBtn.addEventListener("click", function () {
      window.handleSubmitExam();
    });
  }

  if (reviewBtn) {
    reviewBtn.addEventListener("click", window.openReviewScreen);
  }

  if (reviewBackResultBtn) {
    reviewBackResultBtn.addEventListener("click", window.backToResultScreen);
  }

  window.addEventListener("beforeunload", function (event) {
    if (!window.APP_STATE.isExamInProgress) return;
    event.preventDefault();
    event.returnValue = "";
  });

  if (typeof window.updateTimerUI === "function") {
    window.updateTimerUI();
  }

  window.showScreen("login-screen");
});
