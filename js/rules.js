window.goToExamScreen = function () {
  if (!window.APP_STATE.currentUser) return;

  try {
    window.initializeExam();
    window.showScreen("exam-screen");
  } catch (error) {
    alert(error.message);
    console.error(error);
  }
};
