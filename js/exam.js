window.getUsedQuestionIdsForLevel = function (level) {
  if (!Array.isArray(window.APP_STATE.usedQuestionIdsByLevel[level])) {
    window.APP_STATE.usedQuestionIdsByLevel[level] = [];
  }

  return window.APP_STATE.usedQuestionIdsByLevel[level];
};

window.pickQuestionForLevel = function (level) {
  const bucket = window.QUESTION_BANK[level];

  if (!Array.isArray(bucket) || bucket.length === 0) {
    throw new Error(`Level ${level} chưa có câu hỏi.`);
  }

  const usedIds = window.getUsedQuestionIdsForLevel(level);
  let availableQuestions = bucket.filter((question) => !usedIds.includes(question.id));

  if (availableQuestions.length === 0) {
    window.APP_STATE.usedQuestionIdsByLevel[level] = [];
    availableQuestions = [...bucket];
  }

  const selectedQuestion = window.getRandomItem(availableQuestions);
  window.APP_STATE.usedQuestionIdsByLevel[level].push(selectedQuestion.id);

  return {
    ...selectedQuestion,
    level
  };
};

window.generateExamQuestions = function () {
  const questions = [];

  for (let level = 1; level <= window.APP_CONFIG.TOTAL_QUESTIONS; level++) {
    questions.push(window.pickQuestionForLevel(level));
  }

  return questions;
};

window.renderTimer = function () {
  const timerEl = document.getElementById("timer");
  if (!timerEl) return;

  timerEl.textContent = window.formatTime(window.APP_STATE.remainingTime);
};

window.stopExamTimer = function () {
  if (window.APP_STATE.timerIntervalId) {
    clearInterval(window.APP_STATE.timerIntervalId);
    window.APP_STATE.timerIntervalId = null;
  }
};

window.handleExamTimeout = function () {
  window.stopExamTimer();
  window.APP_STATE.remainingTime = 0;
  window.APP_STATE.isExamInProgress = false;
  window.renderTimer();

  alert("Đã hết thời gian làm bài. Hệ thống sẽ tự nộp bài.");

  if (typeof window.gradeExam === "function") {
    window.gradeExam();
  }

  if (typeof window.showResultScreen === "function") {
    window.showResultScreen();
  }
};

window.startExamTimer = function () {
  window.stopExamTimer();
  window.renderTimer();

  window.APP_STATE.timerIntervalId = setInterval(function () {
    if (!window.APP_STATE.isExamInProgress) {
      window.stopExamTimer();
      return;
    }

    window.APP_STATE.remainingTime -= 1;
    window.renderTimer();

    if (window.APP_STATE.remainingTime <= 0) {
      window.handleExamTimeout();
    }
  }, 1000);
};

window.initializeExam = function () {
  window.stopExamTimer();

  window.APP_STATE.currentExamNumber += 1;
  window.APP_STATE.examQuestions = window.generateExamQuestions();
  window.APP_STATE.answers = new Array(window.APP_STATE.examQuestions.length).fill(null);
  window.APP_STATE.currentQuestionIndex = 0;
  window.APP_STATE.remainingTime = window.APP_CONFIG.EXAM_TIME_SECONDS;
  window.APP_STATE.examResult = null;
  window.APP_STATE.reportStatusByQuestion = {};
  window.APP_STATE.isExamInProgress = true;

  window.updateUserInfoOnUI();
  window.renderTimer();

  if (typeof window.applyWatermark === "function") {
    window.applyWatermark();
  }

  window.renderQuestionPalette();
  window.renderCurrentQuestion();
  window.startExamTimer();
};

window.renderQuestionPalette = function () {
  const palette = document.getElementById("question-palette");
  if (!palette) return;

  palette.innerHTML = "";

  window.APP_STATE.examQuestions.forEach((_, index) => {
    const btn = document.createElement("button");
    btn.className = "question-number-btn";
    btn.textContent = index + 1;

    if (index === window.APP_STATE.currentQuestionIndex) {
      btn.classList.add("current");
    }

    if (window.APP_STATE.answers[index] !== null) {
      btn.classList.add("answered");
    }

    btn.addEventListener("click", function () {
      window.goToQuestion(index);
    });

    palette.appendChild(btn);
  });
};

window.renderCurrentQuestion = function () {
  const currentIndex = window.APP_STATE.currentQuestionIndex;
  const question = window.APP_STATE.examQuestions[currentIndex];

  if (!question) return;

  const questionNumber = document.getElementById("current-question-number");
  const questionLevel = document.getElementById("current-question-level");
  const questionText = document.getElementById("question-text");
  const optionsList = document.getElementById("options-list");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  questionNumber.textContent = `Câu ${currentIndex + 1}`;

  if (questionLevel) {
    questionLevel.textContent = `Level ${question.level}`;
  }

  questionText.innerHTML = question.question;

  const selectedAnswer = window.APP_STATE.answers[currentIndex];

  optionsList.innerHTML = question.options
    .map((option, optionIndex) => {
      const isSelected = selectedAnswer === optionIndex;

      return `
        <div class="option-item ${isSelected ? "selected" : ""}" data-option-index="${optionIndex}">
          <span class="option-radio"></span>
          <span class="option-letter">${window.getOptionLabel(optionIndex)}.</span>
          <span class="option-text">${option}</span>
        </div>
      `;
    })
    .join("");

  const optionElements = optionsList.querySelectorAll(".option-item");

  optionElements.forEach((optionEl) => {
    optionEl.addEventListener("click", function () {
      const optionIndex = Number(optionEl.dataset.optionIndex);
      window.selectAnswer(optionIndex);
    });
  });

  if (prevBtn) {
    prevBtn.disabled = currentIndex === 0;
  }

  if (nextBtn) {
    nextBtn.disabled = currentIndex === window.APP_STATE.examQuestions.length - 1;
  }

  window.renderQuestionPalette();

  if (typeof window.renderMath === "function") {
    window.renderMath(questionText);
    window.renderMath(optionsList);
  }
};

window.selectAnswer = function (optionIndex) {
  window.APP_STATE.answers[window.APP_STATE.currentQuestionIndex] = optionIndex;
  window.renderCurrentQuestion();
};

window.goToQuestion = function (index) {
  if (index < 0 || index >= window.APP_STATE.examQuestions.length) return;
  window.APP_STATE.currentQuestionIndex = index;
  window.renderCurrentQuestion();
};

window.goPrevQuestion = function () {
  window.goToQuestion(window.APP_STATE.currentQuestionIndex - 1);
};

window.goNextQuestion = function () {
  window.goToQuestion(window.APP_STATE.currentQuestionIndex + 1);
};

window.handleSubmitExam = function () {
  const confirmed = confirm("Bạn có chắc muốn nộp bài không?");
  if (!confirmed) return;

  window.stopExamTimer();
  window.APP_STATE.isExamInProgress = false;

  if (typeof window.gradeExam === "function") {
    window.gradeExam();
  }

  if (typeof window.showResultScreen === "function") {
    window.showResultScreen();
  }
};

window.startNewExamFromResult = function () {
  if (!window.APP_STATE.currentUser) return;

  const confirmed = confirm("Tạo đề mới cho cùng phiên đăng nhập?");
  if (!confirmed) return;

  try {
    window.initializeExam();
    window.showScreen("exam-screen");
  } catch (error) {
    alert(error.message);
    console.error(error);
  }
};
