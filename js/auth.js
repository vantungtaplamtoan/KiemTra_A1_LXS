window.handleLogin = function (event) {
  event.preventDefault();

  const nameInput = document.getElementById("student-name");
  const idInput = document.getElementById("student-id");
  const errorEl = document.getElementById("login-error");

  const name = nameInput.value.trim();
  const studentId = idInput.value.trim();

  errorEl.textContent = "";

  if (!name) {
    errorEl.textContent = "Vui lòng nhập họ và tên.";
    return;
  }

  if (!/^\d{4}$/.test(studentId)) {
    errorEl.textContent = "Mã sinh viên phải gồm đúng 4 chữ số.";
    return;
  }

  const matchedAccount = window.ACCOUNTS.find((acc) => {
    return acc.name.toLowerCase() === name.toLowerCase() && acc.studentId === studentId;
  });

  if (!matchedAccount) {
    errorEl.textContent = "Tên hoặc mã sinh viên không đúng.";
    return;
  }

  if (typeof window.stopExamTimer === "function") {
    window.stopExamTimer();
  }

  const deviceToken = window.createDeviceToken();

  window.APP_STATE = {
    ...window.createInitialAppState(),
    currentUser: {
      name: matchedAccount.name,
      studentId: matchedAccount.studentId,
      deviceToken,
      loginTime: new Date().toLocaleString(),
      userAgent: navigator.userAgent
    },
    currentSessionId: window.generateSessionId()
  };

  window.updateUserInfoOnUI();
  window.showScreen("rules-screen");
};
