window.getReviewStatus = function (questionIndex) {
  const question = window.APP_STATE.examQuestions[questionIndex];
  const selectedAnswer = window.APP_STATE.answers[questionIndex];

  if (selectedAnswer === null) {
    return {
      text: "Chưa làm",
      className: "empty"
    };
  }

  if (selectedAnswer === question.correctAnswer) {
    return {
      text: "Đúng",
      className: "correct"
    };
  }

  return {
    text: "Sai",
    className: "wrong"
  };
};

window.getReviewWatermarkText = function () {
  const user = window.APP_STATE.currentUser;
  if (!user) return "";
  return `${user.name} - ${user.studentId}`;
};

window.createReviewWatermarkStyle = function () {
  const text = window.getReviewWatermarkText();
  if (!text) return "";

  const safeText = typeof window.escapeHtml === "function" ? window.escapeHtml(text) : text;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="320" height="160">
      <text x="18" y="120"
            fill="#6b7280"
            fill-opacity="0.58"
            font-size="28"
            font-weight="700"
            transform="rotate(-20 140 120)">
        ${safeText}
      </text>
    </svg>
  `;

  const encoded = encodeURIComponent(svg);
  return `background-image: url('data:image/svg+xml;charset=utf-8,${encoded}')`;
};

window.applyReviewWatermark = function () {
  const reviewWatermarkLayer = document.getElementById("review-watermark-layer");
  if (!reviewWatermarkLayer) return;
  reviewWatermarkLayer.style.cssText = window.createReviewWatermarkStyle();
};

window.openReviewScreen = function () {
  window.updateUserInfoOnUI();
  window.showScreen("review-screen");

  window.renderReviewList();
  window.renderReviewPalette();
};

window.renderReviewPalette = function () {
  const reviewPalette = document.getElementById("review-palette");
  if (!reviewPalette) return;

  reviewPalette.innerHTML = window.APP_STATE.examQuestions
    .map((_, questionIndex) => {
      const status = window.getReviewStatus(questionIndex);

      return `
        <button
          class="review-nav-btn ${status.className}"
          data-question-index="${questionIndex}"
          type="button"
        >
          ${questionIndex + 1}
        </button>
      `;
    })
    .join("");

  const navButtons = reviewPalette.querySelectorAll(".review-nav-btn");

  navButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const index = Number(btn.dataset.questionIndex);
      window.goToReviewQuestion(index);
    });
  });
};

window.goToReviewQuestion = function (questionIndex) {
  const target = document.getElementById(`review-question-${questionIndex}`);
  if (!target) return;

  target.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
};

window.getAnswerTextForReview = function (question, answerIndex) {
  if (answerIndex === null || answerIndex === undefined) {
    return "Chưa chọn đáp án";
  }

  return `${window.getOptionLabel(answerIndex)}. ${question.options[answerIndex]}`;
};

window.toggleSolution = function (questionIndex, triggerButton) {
  const solutionBox = document.getElementById(`review-solution-${questionIndex}`);
  if (!solutionBox) return;

  const isHidden = solutionBox.classList.contains("hidden");
  solutionBox.classList.toggle("hidden", !isHidden);

  if (triggerButton) {
    triggerButton.textContent = isHidden ? "Ẩn lời giải" : "Xem lời giải";
  }

  if (isHidden && typeof window.renderMath === "function") {
    window.renderMath(solutionBox);
  }
};

window.buildQuestionReportPayload = function (questionIndex) {
  const question = window.APP_STATE.examQuestions[questionIndex];
  const selectedAnswer = window.APP_STATE.answers[questionIndex];
  const selectedAnswerText = window.getAnswerTextForReview(question, selectedAnswer);
  const correctAnswerText = window.getAnswerTextForReview(question, question.correctAnswer);

  return {
    action: "reportQuestion",
    studentName: window.APP_STATE.currentUser?.name || "",
    studentId: window.APP_STATE.currentUser?.studentId || "",
    sessionId: window.APP_STATE.currentSessionId || "",
    examNumber: String(window.APP_STATE.currentExamNumber || ""),
    questionNumber: String(questionIndex + 1),
    questionId: question.id || "",
    level: String(question.level || ""),
    selectedAnswerLabel: selectedAnswer === null ? "" : window.getOptionLabel(selectedAnswer),
    selectedAnswerText,
    correctAnswerLabel: window.getOptionLabel(question.correctAnswer),
    correctAnswerText,
    questionText: question.question || "",
    solution: question.solution || "",
    reportedAt: new Date().toLocaleString("vi-VN"),
    pageUrl: window.location.href
  };
};

window.buildReportEmailContent = function (payload) {
  return [
    `Sinh viên: ${payload.studentName}`,
    `Mã sinh viên: ${payload.studentId}`,
    `Phiên đăng nhập: ${payload.sessionId}`,
    `Đề số: ${payload.examNumber}`,
    `Level: ${payload.level}`,
    `Câu: ${payload.questionNumber}`,
    `Question ID: ${payload.questionId}`,
    `Đáp án đã chọn: ${payload.selectedAnswerText}`,
    `Đáp án đúng: ${payload.correctAnswerText}`,
    "",
    "Nội dung câu hỏi:",
    payload.questionText,
    "",
    "Lời giải hiện tại:",
    payload.solution || "Chưa có lời giải.",
    "",
    `Thời điểm báo cáo: ${payload.reportedAt}`,
    `Trang gửi: ${payload.pageUrl}`
  ].join("\n");
};

window.reportQuestion = async function (questionIndex, buttonEl) {
  const confirmed = confirm(`Gửi báo cáo cho Câu ${questionIndex + 1}?`);
  if (!confirmed) return;

  const statusEl = document.getElementById(`review-report-status-${questionIndex}`);
  const payload = window.buildQuestionReportPayload(questionIndex);

  if (buttonEl) {
    buttonEl.disabled = true;
  }

  if (statusEl) {
    statusEl.textContent = "Đang gửi báo cáo...";
  }

  try {
    if (window.APP_CONFIG.REPORT_ENDPOINT) {
      await fetch(window.APP_CONFIG.REPORT_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body: new URLSearchParams(payload)
      });

      window.APP_STATE.reportStatusByQuestion[questionIndex] = "Đã gửi yêu cầu báo cáo";
    } else {
      const subject = encodeURIComponent(`[Báo cáo đề] Level ${payload.level} - Câu ${payload.questionNumber}`);
      const body = encodeURIComponent(window.buildReportEmailContent(payload));
      window.location.href = `mailto:${window.APP_CONFIG.REPORT_EMAIL}?subject=${subject}&body=${body}`;
      window.APP_STATE.reportStatusByQuestion[questionIndex] = "Đã mở email báo cáo";
    }

    if (statusEl) {
      statusEl.textContent = window.APP_STATE.reportStatusByQuestion[questionIndex];
    }
  } catch (error) {
    console.error(error);
    window.APP_STATE.reportStatusByQuestion[questionIndex] = "Gửi lỗi, vui lòng thử lại";

    if (statusEl) {
      statusEl.textContent = window.APP_STATE.reportStatusByQuestion[questionIndex];
    }
  } finally {
    if (buttonEl) {
      buttonEl.disabled = false;
    }
  }
};

window.renderReviewList = function () {
  const reviewList = document.getElementById("review-list");
  if (!reviewList) return;

  const watermarkStyle = window.createReviewWatermarkStyle();

  reviewList.innerHTML = window.APP_STATE.examQuestions
    .map((question, questionIndex) => {
      const selectedAnswer = window.APP_STATE.answers[questionIndex];
      const status = window.getReviewStatus(questionIndex);
      const selectedAnswerText = window.getAnswerTextForReview(question, selectedAnswer);
      const correctAnswerText = window.getAnswerTextForReview(question, question.correctAnswer);
      const solutionContent = question.solution?.trim() || "Chưa có lời giải chi tiết cho câu này.";
      const reportStatus = window.APP_STATE.reportStatusByQuestion[questionIndex] || "";

      const optionsHtml = question.options
        .map((option, optionIndex) => {
          let optionClass = "option-item";

          if (optionIndex === question.correctAnswer) {
            optionClass += " correct";
          }

          if (
            selectedAnswer !== null &&
            selectedAnswer === optionIndex &&
            selectedAnswer !== question.correctAnswer
          ) {
            optionClass += " wrong";
          }

          return `
            <div class="${optionClass}">
              <span class="option-radio"></span>
              <span class="option-letter">${window.getOptionLabel(optionIndex)}.</span>
              <span class="option-text">${option}</span>
            </div>
          `;
        })
        .join("");

      return `
        <div class="review-question" id="review-question-${questionIndex}">
          <div class="review-watermark-layer" style="${watermarkStyle}"></div>

          <div class="review-question-content">
            <div class="review-question-header">
              <div class="review-question-number">Câu ${questionIndex + 1}</div>
              <div class="review-status ${status.className}">${status.text}</div>
            </div>

            

            <div class="question-text">${question.question}</div>

            <div class="options-list">
              ${optionsHtml}
            </div>

            <div class="review-action-row">
              <button class="btn btn-outline review-toggle-solution-btn" data-question-index="${questionIndex}" type="button">
                Xem lời giải
              </button>
              <button class="btn btn-warning review-report-btn" data-question-index="${questionIndex}" type="button">
                Báo cáo
              </button>
              <span class="review-report-status" id="review-report-status-${questionIndex}">${reportStatus}</span>
            </div>

            <div class="review-solution-box hidden" id="review-solution-${questionIndex}">
              <div class="review-solution-title">Lời giải</div>
              <div class="review-solution-content">${solutionContent}</div>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  reviewList.querySelectorAll(".review-toggle-solution-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const questionIndex = Number(button.dataset.questionIndex);
      window.toggleSolution(questionIndex, button);
    });
  });

  reviewList.querySelectorAll(".review-report-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const questionIndex = Number(button.dataset.questionIndex);
      window.reportQuestion(questionIndex, button);
    });
  });

  if (typeof window.renderMath === "function") {
    window.renderMath(reviewList);
  }
};



window.backToResultScreen = function () {
  window.showScreen("result-screen");
};
