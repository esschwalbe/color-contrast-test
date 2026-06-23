const foregroundInput = document.getElementById("foreground");
const backgroundInput = document.getElementById("background");
const foregroundPicker = document.getElementById("foregroundPicker");
const backgroundPicker = document.getElementById("backgroundPicker");
const checkButton = document.getElementById("checkButton");
const preview = document.getElementById("preview");
const ratioOutput = document.getElementById("ratio");
const statusOutput = document.getElementById("status");

function hexToRgb(hex) {
  const cleanHex = hex.replace("#", "");

  if (cleanHex.length !== 6) {
    throw new Error("Hex color must be 6 characters.");
  }

  return {
    r: parseInt(cleanHex.slice(0, 2), 16),
    g: parseInt(cleanHex.slice(2, 4), 16),
    b: parseInt(cleanHex.slice(4, 6), 16),
  };
}

function channelToLinear(value) {
  const normalized = value / 255;

  if (normalized <= 0.04045) {
    return normalized / 12.92;
  }

  return Math.pow((normalized + 0.055) / 1.055, 2.4);
}

function getRelativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);

  return (
    0.2126 * channelToLinear(r) +
    0.7152 * channelToLinear(g) +
    0.0722 * channelToLinear(b)
  );
}

function getContrastRatio(colorA, colorB) {
  const luminanceA = getRelativeLuminance(colorA);
  const luminanceB = getRelativeLuminance(colorB);

  const lighter = Math.max(luminanceA, luminanceB);
  const darker = Math.min(luminanceA, luminanceB);

  return (lighter + 0.05) / (darker + 0.05);
}

function checkContrast() {
  const foreground = foregroundInput.value.trim();
  const background = backgroundInput.value.trim();

  try {
    const ratio = getContrastRatio(foreground, background);
    const roundedRatio = ratio.toFixed(2);

    preview.style.color = foreground;
    preview.style.backgroundColor = background;

    ratioOutput.textContent = `${roundedRatio}:1`;

    if (ratio >= 7) {
      statusOutput.textContent = "Passes AAA for normal text";
    } else if (ratio >= 4.5) {
      statusOutput.textContent = "Passes AA for normal text";
    } else if (ratio >= 3) {
      statusOutput.textContent = "Passes AA for large text only";
    } else {
      statusOutput.textContent = "Does not pass WCAG contrast guidance";
    }
  } catch (error) {
    ratioOutput.textContent = "Invalid color";
    statusOutput.textContent = "Please enter colors like #000000 or #ffffff";
  }
}

checkButton.addEventListener("click", checkContrast);

foregroundPicker.addEventListener("input", () => {
  foregroundInput.value = foregroundPicker.value;
  checkContrast();
});

backgroundPicker.addEventListener("input", () => {
  backgroundInput.value = backgroundPicker.value;
  checkContrast();
});

foregroundInput.addEventListener("input", () => {
  foregroundPicker.value = foregroundInput.value;
  checkContrast();
});

backgroundInput.addEventListener("input", () => {
  backgroundPicker.value = backgroundInput.value;
  checkContrast();
});

checkContrast();
