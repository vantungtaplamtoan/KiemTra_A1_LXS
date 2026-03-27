window.renderMath = function (element) {
  if (!window.MathJax || !element) return;

  if (window.MathJax.typesetClear) {
    window.MathJax.typesetClear([element]);
  }

  if (window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise([element]).catch((err) => {
      console.error("MathJax render error:", err);
    });
  }
};