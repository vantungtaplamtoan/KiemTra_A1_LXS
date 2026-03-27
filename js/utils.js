window.showScreen = function (screenId) {
  const screens = document.querySelectorAll(".screen");

  screens.forEach((screen) => {
    screen.classList.add("hidden");
    screen.classList.remove("active");
  });

  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.remove("hidden");
    targetScreen.classList.add("active");
  }
};

window.updateUserInfoOnUI = function () {
  const user = window.APP_STATE.currentUser;
  if (!user) return;

  const attemptNumber = window.APP_STATE.currentExamNumber || 1;

  const mappings = [
    ["rules-student-name", user.name],
    ["rules-student-id", user.studentId],
    ["exam-student-name", user.name],
    ["exam-student-id", user.studentId],
    ["result-student-name", user.name],
    ["result-student-id", user.studentId],
    ["review-student-name", user.name],
    ["review-student-id", user.studentId],
    ["exam-attempt-number", attemptNumber],
    ["result-attempt-number", attemptNumber],
    ["review-attempt-number", attemptNumber]
  ];

  mappings.forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });
};

window.createDeviceToken = function () {
  let token = localStorage.getItem("deviceToken");

  if (!token) {
    token = "DEVICE_" + Math.random().toString(36).slice(2) + Date.now();
    localStorage.setItem("deviceToken", token);
  }

  return token;
};

window.generateSessionId = function () {
  return "SESSION_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8).toUpperCase();
};

window.getRandomItem = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

window.getOptionLabel = function (index) {
  return ["A", "B", "C", "D", "E"][index] || "";
};

window.escapeHtml = function (text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

window.formatTime = function (totalSeconds) {
  const safeSeconds = Math.max(0, Number(totalSeconds) || 0);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

window.resetAppStateForLogout = function () {
  if (typeof window.stopExamTimer === "function") {
    window.stopExamTimer();
  }

  window.APP_STATE = window.createInitialAppState();

  const timerEl = document.getElementById("timer");
  if (timerEl) {
    timerEl.textContent = window.formatTime(window.APP_CONFIG.EXAM_TIME_SECONDS);
  }

  const loginForm = document.getElementById("login-form");
  const errorEl = document.getElementById("login-error");

  if (loginForm) loginForm.reset();
  if (errorEl) errorEl.textContent = "";
};
