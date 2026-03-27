window.applyWatermark = function () {
  const user = window.APP_STATE.currentUser;
  const watermarkLayer = document.getElementById("watermark-layer");

  if (!user || !watermarkLayer) return;

  const text = `${user.name} - ${user.studentId}`;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="520" height="260">
      <text x="24" y="130"
            fill="#6b7280"
            fill-opacity="0.65"
            font-size="32"
            font-weight="700"
            transform="rotate(-20 150 130)">
        ${text}
      </text>
    </svg>
  `;

  const encoded = encodeURIComponent(svg);
  watermarkLayer.style.backgroundImage = `url("data:image/svg+xml;charset=utf-8,${encoded}")`;
};