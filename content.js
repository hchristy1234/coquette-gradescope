const defaults = {
  shapes: ["star"],
  colors: ["D49BC9", "E19AC1", "ED8EB6", "F08CB3", "DFA1C5", "fffcd2"],
};

// Hide scores and add reveal buttons with confetti
function hideScores() {
  const scoreElements = document.querySelectorAll(".submissionStatus--score");

  scoreElements.forEach((scoreElement) => {
    const revealButton = document.createElement("button");
    revealButton.textContent = "Show Score";
    revealButton.classList.add("reveal-button");

    scoreElement.style.display = "none";
    scoreElement.parentNode.insertBefore(revealButton, scoreElement);

    revealButton.addEventListener("click", () => {
      const rect = revealButton.getBoundingClientRect();
      scoreElement.style.display = "block";
      revealButton.style.display = "none";

      confetti({
        ...defaults,
        startVelocity: 25,
        spread: 60,
        ticks: 60,
        gravity: 0.8,
        origin: {
          x: rect.right / window.innerWidth - 0.05,
          y: rect.bottom / (window.innerHeight + window.scrollY + 0.03),
        },
      });
    });
  });
}

// Create draggable, collapsible color picker panel
function addColorControlPanel() {
  const container = document.createElement("div");
  container.id = "colorPickerContainer";
  Object.assign(container.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: "9999",
    background: "white",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
    padding: "10px 15px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    alignItems: "flex-start",
    cursor: "move",
  });

  // Header with close button
  const header = document.createElement("div");
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";
  header.style.width = "100%";
  header.style.cursor = "move";

  const title = document.createElement("span");
  title.textContent = "🎨 Theme Colors";
  title.style.fontWeight = "600";
  title.style.fontSize = "13px";

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "×";
  Object.assign(closeBtn.style, {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "18px",
    lineHeight: "18px",
    color: "#666",
    fontWeight: "bold",
  });

  header.appendChild(title);
  header.appendChild(closeBtn);
  container.appendChild(header);

  // Helper to create labeled pickers
  function createLabeledPicker(id, labelText, defaultColor, storageKey, cssVar) {
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.gap = "6px";

    const label = document.createElement("span");
    label.textContent = labelText;
    label.style.fontSize = "12px";
    label.style.fontWeight = "500";
    label.style.width = "120px";

    const picker = document.createElement("input");
    picker.type = "color";
    picker.id = id;
    picker.style.width = "36px";
    picker.style.height = "36px";
    picker.style.border = "none";
    picker.style.borderRadius = "6px";
    picker.style.cursor = "pointer";

    const saved = localStorage.getItem(storageKey) || defaultColor;
    picker.value = saved;
    document.documentElement.style.setProperty(cssVar, saved);

    picker.addEventListener("input", (e) => {
      const color = e.target.value;
      document.documentElement.style.setProperty(cssVar, color);
      localStorage.setItem(storageKey, color);
    });

    wrapper.appendChild(label);
    wrapper.appendChild(picker);
    return wrapper;
  }

  // Build pickers
  const leftPicker = createLabeledPicker(
    "bgColorLeft",
    "Left Main",
    "#f3c5df",
    "userBgColorLeft",
    "--bgColorLeft"
  );
  const rightPicker = createLabeledPicker(
    "bgColorRight",
    "Right Main",
    "#bfc6fb",
    "userBgColorRight",
    "--bgColorRight"
  );
  const revealPicker = createLabeledPicker(
    "revealBtnColor",
    "Reveal Button",
    "#d199b7",
    "userRevealBtnColor",
    "--revealBtnColor"
  );
  const sidebarPicker = createLabeledPicker(
    "sidebarBgColor",
    "Sidebar Background",
    "#f3c5df",
    "userSidebarBgColor",
    "--sidebarBgColor"
  );

  container.appendChild(leftPicker);
  container.appendChild(rightPicker);
  container.appendChild(revealPicker);
  container.appendChild(sidebarPicker);
  document.body.appendChild(container);

  // Collapsible logic
  const reopenBtn = document.createElement("button");
  reopenBtn.textContent = "🎨";
  Object.assign(reopenBtn.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "none",
    background: "#fff",
    boxShadow: "0 0 8px rgba(0,0,0,0.3)",
    cursor: "pointer",
    zIndex: "9998",
    display: "none",
    fontSize: "20px",
  });
  document.body.appendChild(reopenBtn);

  closeBtn.addEventListener("click", () => {
    container.style.display = "none";
    reopenBtn.style.display = "block";
  });
  reopenBtn.addEventListener("click", () => {
    container.style.display = "flex";
    reopenBtn.style.display = "none";
  });

  // Draggable logic
  let offsetX, offsetY, isDragging = false;

  container.addEventListener("mousedown", (e) => {
    if (e.target.tagName.toLowerCase() === "input" || e.target === closeBtn)
      return;
    isDragging = true;
    offsetX = e.clientX - container.getBoundingClientRect().left;
    offsetY = e.clientY - container.getBoundingClientRect().top;
    container.style.cursor = "grabbing";
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
    container.style.cursor = "move";
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
    container.style.left = e.clientX - offsetX + "px";
    container.style.top = e.clientY - offsetY + "px";
    container.style.bottom = "auto";
    container.style.right = "auto";
  });
}

// Run on load
hideScores();
addColorControlPanel();
