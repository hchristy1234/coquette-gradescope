var emoji = null;
var scalar = null;

const defaults = {
  shapes: ["star", "circle", "square"], // default confetti
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

        // user-input confetti emoji
        var scalar = 1;
        if (emoji) {
            scalar = 2;
        }
        var confettiShapes = emoji ? [confetti.shapeFromText({text: emoji, scalar})] : defaults.shapes;

        confetti({
            ...defaults,
            shapes: confettiShapes,
            scalar: scalar ? scalar : 1,
            startVelocity: 20,
            spread: 45,
            ticks: 35,
            gravity: 0.7,
            origin: {
            x: rect.right / window.innerWidth - 0.05,
            y: rect.bottom / (window.innerHeight + window.scrollY + 0.03),
            },
        });
    });
  });
}

// color panel -- draggable, clickable
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

  // to automatically adjust reveal button text color depending on background
  function getContrastColor(hex) {
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 186 ? "black" : "white";
  }

  // Header with close button
  const header = document.createElement("div");
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";
  header.style.width = "100%";
  header.style.cursor = "move";

  const title = document.createElement("span");
  title.textContent = "🎨 Theme Colors"; // will collapse to just emoji
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

  // common labeled picker code
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

    // recover last 
    const saved = localStorage.getItem(storageKey) || defaultColor;
    picker.value = saved;
    document.documentElement.style.setProperty(cssVar, saved);

    picker.addEventListener("input", (e) => {
      const color = e.target.value;
      document.documentElement.style.setProperty(cssVar, color);
      localStorage.setItem(storageKey, color);

      if (id === "revealBtnColor") {
        document.querySelectorAll(".reveal-button").forEach((btn) => {
          btn.style.backgroundColor = color;
          btn.style.color = getContrastColor(color);
        });
      }
    });

    wrapper.appendChild(label);
    wrapper.appendChild(picker);
    return wrapper;
  }

  // panel color pickers
  const leftPicker = createLabeledPicker("bgColorLeft", "Left Main", "#f3c5df", "userBgColorLeft", "--bgColorLeft");
  const rightPicker = createLabeledPicker("bgColorRight", "Right Main", "#bfc6fb", "userBgColorRight", "--bgColorRight");
  const revealPicker = createLabeledPicker("revealBtnColor", "Reveal Button", "#d199b7", "userRevealBtnColor", "--revealBtnColor");
  const sidebarPicker = createLabeledPicker("sidebarBgColor", "Sidebar Background", "#f3c5df", "userSidebarBgColor", "--sidebarBgColor");

  container.appendChild(leftPicker);
  container.appendChild(rightPicker);
  container.appendChild(revealPicker);
  container.appendChild(sidebarPicker);

  // confetti emoji picker
  const emojiWrapper = document.createElement("div");
  emojiWrapper.style.display = "flex";
  emojiWrapper.style.alignItems = "center";
  emojiWrapper.style.gap = "6px";

  const emojiLabel = document.createElement("span");
  emojiLabel.textContent = "Confetti emoji (ctrl+⌘+space)";
  emojiLabel.style.fontSize = "12px";
  emojiLabel.style.fontWeight = "500";
  emojiLabel.style.width = "120px";

  const emojiInput = document.createElement("input");
  emojiInput.type = "text";
  emojiInput.setAttribute("inputmode", "emoji");
  Object.assign(emojiInput.style, {
    width: "36px",
    height: "36px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    cursor: "pointer",
    fontSize: "20px",
    textAlign: "center",
    padding: "0",
    background: "white",
  });

  const savedEmoji = localStorage.getItem("userEmoji") || "";
  emojiInput.value = savedEmoji;
  emoji = savedEmoji || null;

  function updateEmojiValue() {
    const val = emojiInput.value.trim();
    if (val.length > 0) {
        emoji = val;
        localStorage.setItem("userEmoji", val);
    } else {
        emoji = null;
        localStorage.removeItem("userEmoji");
    }
  }

  emojiInput.addEventListener("input", () => setTimeout(updateEmojiValue, 10));
  emojiInput.addEventListener("change", updateEmojiValue);

  emojiWrapper.appendChild(emojiLabel);
  emojiWrapper.appendChild(emojiInput);
  container.appendChild(emojiWrapper);

  // dark mode toggle
  function createTextWhiteToggle() {
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.gap = "6px";

    const label = document.createElement("span");
    label.textContent = "Dark Mode Text";
    label.style.fontSize = "12px";
    label.style.fontWeight = "500";
    label.style.width = "120px";

    const switchLabel = document.createElement("label");
    Object.assign(switchLabel.style, {
      position: "relative",
      display: "inline-block",
      width: "40px",
      height: "20px",
    });

    const toggle = document.createElement("input");
    toggle.type = "checkbox";
    Object.assign(toggle.style, {
      opacity: 0,
      width: 0,
      height: 0,
    });
    toggle.checked = localStorage.getItem("darkToggle") === "dark";

    const slider = document.createElement("span");
    Object.assign(slider.style, {
      position: "absolute",
      cursor: "pointer",
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      backgroundColor: "#ccc",
      transition: ".4s",
      borderRadius: "20px",
    });

    const knob = document.createElement("span");
    Object.assign(knob.style, {
      position: "absolute",
      height: "16px",
      width: "16px",
      left: "2px",
      bottom: "2px",
      backgroundColor: "white",
      transition: ".4s",
      borderRadius: "50%",
    });

    slider.appendChild(knob);
    switchLabel.appendChild(toggle);
    switchLabel.appendChild(slider);

    function applyDarkMode(turnDark) {
      if (turnDark) {
        container.style.backgroundColor = "black";
        container.style.color = "white";
        localStorage.setItem("darkToggle", "dark");
      } else {
        container.style.backgroundColor = "white";
        container.style.color = "black";
        localStorage.setItem("darkToggle", "light");
      }

      knob.style.left = turnDark ? "22px" : "2px";
      slider.style.backgroundColor = turnDark ? "#4CAF50" : "#ccc";

      document.querySelectorAll("body *:not(#colorPickerContainer, #colorPickerContainer *, .reveal-button, .courseList--coursesForTerm *)").forEach((el) => {
        el.style.color = turnDark ? "white" : "black";
      });

    }

    applyDarkMode(toggle.checked);
    // toggle opposite mode on change
    toggle.addEventListener("change", () => applyDarkMode(toggle.checked));

    wrapper.appendChild(label);
    wrapper.appendChild(switchLabel);
    return wrapper;
  }

  const textWhiteToggle = createTextWhiteToggle();
  container.appendChild(textWhiteToggle);

  document.body.appendChild(container);

  // collapsible
  const reopenBtn = document.createElement("button");
  reopenBtn.textContent = "🎨";
  Object.assign(reopenBtn.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    textAlign: "center",
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

  // draggable panel
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

// on load
hideScores();
addColorControlPanel();
