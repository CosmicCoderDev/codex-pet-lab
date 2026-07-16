import {
  CELL,
  FORMATS,
  LOOK_DIRECTIONS,
  MAX_FILE_BYTES,
  STANDARD_ROWS,
  createManifest,
  detectFormat,
  normalizePetId,
  validateMetadata
} from "./src/pet-contract.js";

const translations = {
  en: {
    "hero.eyebrow": "CUSTOM PET WORKBENCH",
    "hero.title": "Turn a sprite atlas into a real Codex companion.",
    "hero.lede": "Validate the official atlas contract, preview every state, edit metadata, and export an install-ready local pet package.",
    "hero.upload": "Choose a sprite atlas",
    "hero.explore": "Explore original concepts",
    "hero.conceptBadge": "Original concept · not an atlas",
    "concepts.eyebrow": "START WITH A PERSONALITY",
    "concepts.title": "Four original directions",
    "concepts.note": "These are identity presets for planning. A preset only becomes installable after a real animated atlas passes validation.",
    "concepts.nebby": "Quiet cosmic cat",
    "concepts.byte": "Curious code bot",
    "concepts.momo": "Cheerful candy fox",
    "concepts.ember": "Focused flame spirit",
    "studio.eyebrow": "VALIDATE · PREVIEW · PACKAGE",
    "studio.title": "Pet studio",
    "studio.step1": "Atlas",
    "studio.step2": "Identity",
    "studio.step3": "Export",
    "upload.title": "Sprite atlas",
    "upload.subtitle": "Drop a transparent PNG or WebP here.",
    "upload.action": "Choose or drop an atlas",
    "upload.requirements": "v1 1536×1872 or v2 1536×2288 · up to 20 MiB",
    "checks.type": "File type",
    "checks.size": "Atlas size",
    "checks.weight": "File weight",
    "checks.alpha": "Transparency",
    "checks.alphaNote": "Transparent background required",
    "checks.unused": "Unused cells",
    "checks.unusedNote": "Must remain fully transparent",
    "preview.title": "Animation preview",
    "preview.waiting": "Waiting for a valid atlas",
    "preview.frame": "Frame",
    "identity.title": "Pet identity",
    "identity.subtitle": "Metadata saved in pet.json.",
    "identity.id": "Pet ID",
    "identity.idHelp": "Lowercase letters, numbers, and hyphens.",
    "identity.name": "Display name",
    "identity.description": "Description",
    "identity.copy": "Copy",
    "export.title": "Export package",
    "export.subtitle": "No upload: processing stays in your browser.",
    "export.folder": "Export pet folder",
    "export.files": "Download two files",
    "export.locked": "Add a valid atlas to unlock export.",
    "export.ready": "Ready to export a Codex-compatible {format} package.",
    "export.installTitle": "Install on Windows",
    "export.installNote": "After export, run this from the repository root:",
    "export.copyCommand": "Copy command",
    "trust.localTitle": "Local by design",
    "trust.localText": "Your sprite atlas never leaves the browser.",
    "trust.realTitle": "Real contract checks",
    "trust.realText": "Dimensions, alpha, empty slots, metadata, and v2 format are checked.",
    "trust.openTitle": "Open and bilingual",
    "trust.openText": "MIT-licensed, English-first, with complete Simplified Chinese UI and docs.",
    "footer.note": "Original concepts only. Not affiliated with celebrity likenesses or third-party characters.",
    "toast.copied": "Copied to clipboard.",
    "toast.invalid": "This atlas does not pass the Codex contract yet.",
    "toast.exported": "Pet folder exported.",
    "toast.downloaded": "Both package files were downloaded.",
    "toast.folderFallback": "Folder export is unavailable here. Use the two-file download instead.",
    "status.valid": "{format} · {width}×{height} · valid",
    "status.invalid": "Atlas needs attention",
    "state.idle": "Idle",
    "state.running-right": "Move right",
    "state.running-left": "Move left",
    "state.waving": "Wave",
    "state.jumping": "Jump",
    "state.failed": "Failed",
    "state.waiting": "Needs input",
    "state.running": "Working",
    "state.review": "Review",
    "state.look": "Look around"
  },
  zh: {
    "hero.eyebrow": "自定义宠物工作台",
    "hero.title": "把精灵图集变成真正的 Codex 宠物。",
    "hero.lede": "校验官方图集规范、预览全部状态、编辑宠物信息，并导出可在本机安装的宠物包。",
    "hero.upload": "选择宠物图集",
    "hero.explore": "查看原创宠物构思",
    "hero.conceptBadge": "原创构思 · 不是可安装图集",
    "concepts.eyebrow": "先选择宠物性格",
    "concepts.title": "四种原创方向",
    "concepts.note": "这些预设用于确定角色形象；只有真实动画图集通过校验后，才能作为宠物安装。",
    "concepts.nebby": "安静的星云猫",
    "concepts.byte": "好奇的代码机器人",
    "concepts.momo": "活泼的糖果狐",
    "concepts.ember": "专注的火焰精灵",
    "studio.eyebrow": "校验 · 预览 · 打包",
    "studio.title": "宠物工作室",
    "studio.step1": "图集",
    "studio.step2": "身份",
    "studio.step3": "导出",
    "upload.title": "宠物图集",
    "upload.subtitle": "把透明 PNG 或 WebP 拖到这里。",
    "upload.action": "选择或拖入图集",
    "upload.requirements": "v1 1536×1872 或 v2 1536×2288 · 最大 20 MiB",
    "checks.type": "文件类型",
    "checks.size": "图集尺寸",
    "checks.weight": "文件大小",
    "checks.alpha": "透明通道",
    "checks.alphaNote": "必须有透明背景",
    "checks.unused": "空闲格子",
    "checks.unusedNote": "未使用格子必须全透明",
    "preview.title": "动画预览",
    "preview.waiting": "等待有效图集",
    "preview.frame": "帧",
    "identity.title": "宠物身份",
    "identity.subtitle": "这些信息会写入 pet.json。",
    "identity.id": "宠物 ID",
    "identity.idHelp": "使用小写英文字母、数字和连字符。",
    "identity.name": "显示名称",
    "identity.description": "宠物描述",
    "identity.copy": "复制",
    "export.title": "导出宠物包",
    "export.subtitle": "无需上传，全部处理都在浏览器本地完成。",
    "export.folder": "导出宠物文件夹",
    "export.files": "下载两个文件",
    "export.locked": "加入有效图集后即可导出。",
    "export.ready": "可以导出 Codex 兼容的 {format} 宠物包。",
    "export.installTitle": "在 Windows 中安装",
    "export.installNote": "导出后，在仓库根目录运行：",
    "export.copyCommand": "复制命令",
    "trust.localTitle": "本地优先",
    "trust.localText": "你的宠物图集不会离开浏览器。",
    "trust.realTitle": "真实规范校验",
    "trust.realText": "检查尺寸、透明度、空闲格子、元数据和 v2 格式。",
    "trust.openTitle": "开源且双语",
    "trust.openText": "MIT 许可，英文为主，并提供完整简体中文界面和文档。",
    "footer.note": "只提供原创角色构思，不使用明星肖像或第三方角色。",
    "toast.copied": "已复制到剪贴板。",
    "toast.invalid": "这个图集尚未通过 Codex 格式校验。",
    "toast.exported": "宠物文件夹已导出。",
    "toast.downloaded": "两个宠物包文件已下载。",
    "toast.folderFallback": "当前环境不支持文件夹导出，请改用下载两个文件。",
    "status.valid": "{format} · {width}×{height} · 校验通过",
    "status.invalid": "图集需要修正",
    "state.idle": "待机",
    "state.running-right": "向右移动",
    "state.running-left": "向左移动",
    "state.waving": "挥手",
    "state.jumping": "跳跃",
    "state.failed": "失败",
    "state.waiting": "等待输入",
    "state.running": "工作中",
    "state.review": "审查",
    "state.look": "环顾四周"
  }
};

const concepts = {
  nebby: { name: "Nebby", id: "nebby", image: "./assets/nebby.svg", description: "A quiet cosmic cat for deep-focus coding sessions.", zhDescription: "陪你沉浸编码的安静星云猫。" },
  byte: { name: "Byte", id: "byte", image: "./assets/byte.svg", description: "A curious code bot that lights up for new ideas.", zhDescription: "遇到新点子就会亮起来的好奇代码机器人。" },
  momo: { name: "Momo", id: "momo", image: "./assets/momo.svg", description: "A cheerful candy fox for playful building days.", zhDescription: "让创作更轻松愉快的糖果狐。" },
  ember: { name: "Ember", id: "ember", image: "./assets/ember.svg", description: "A focused flame spirit for shipping the final fix.", zhDescription: "陪你专注完成最后修复的火焰精灵。" }
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const elements = {
  atlasInput: $("#atlasInput"), dropZone: $("#dropZone"), heroUpload: $("#heroUpload"),
  previewCanvas: $("#previewCanvas"), previewStage: $("#previewStage"), conceptFallback: $("#conceptFallback"),
  stateTabs: $("#stateTabs"), formatLabel: $("#formatLabel"), frameLabel: $("#frameLabel"), timeline: $("#timelineProgress"),
  petId: $("#petId"), displayName: $("#displayName"), description: $("#description"), manifestCode: $("#manifestCode"),
  folderName: $("#folderName"), installCommand: $("#installCommand"), exportFolder: $("#exportFolder"), downloadFiles: $("#downloadFiles"),
  exportStatus: $("#exportStatus"), heroPet: $("#heroPet"), heroPetName: $("#heroPetName"), toast: $("#toast")
};

const state = {
  language: localStorage.getItem("codex-pet-lab-language") || "en",
  concept: "nebby",
  file: null,
  image: null,
  objectUrl: null,
  format: null,
  valid: false,
  currentState: "idle",
  currentFrame: 0,
  frameStartedAt: performance.now(),
  validation: { type: null, size: null, weight: null, alpha: null, unused: null }
};

function t(key, values = {}) {
  let text = translations[state.language][key] ?? translations.en[key] ?? key;
  for (const [name, value] of Object.entries(values)) text = text.replace(`{${name}}`, value);
  return text;
}

function setLanguage(language) {
  state.language = language;
  localStorage.setItem("codex-pet-lab-language", language);
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  $$('[data-i18n]').forEach((node) => { node.textContent = t(node.dataset.i18n); });
  $$('[data-language]').forEach((button) => button.classList.toggle("active", button.dataset.language === language));
  const concept = concepts[state.concept];
  if (!state.file) elements.description.value = language === "zh" ? concept.zhDescription : concept.description;
  renderStateTabs();
  refreshStatus();
  updateManifest();
}

function selectConcept(id) {
  state.concept = id;
  const concept = concepts[id];
  $$('.concept-card').forEach((card) => card.classList.toggle("active", card.dataset.concept === id));
  elements.heroPet.src = concept.image;
  elements.conceptFallback.src = concept.image;
  elements.heroPetName.textContent = concept.name;
  if (!state.file) {
    elements.petId.value = concept.id;
    elements.displayName.value = concept.name;
    elements.description.value = state.language === "zh" ? concept.zhDescription : concept.description;
    updateManifest();
  }
}

function setCheck(name, result, detail) {
  state.validation[name] = result;
  const row = $(`[data-check="${name}"]`);
  row.classList.toggle("pass", result === true);
  row.classList.toggle("fail", result === false);
  row.querySelector(":scope > span").textContent = result === true ? "✓" : result === false ? "×" : "○";
  if (detail) row.querySelector("small").textContent = detail;
}

function alphaAudit(image, format) {
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(image, 0, 0);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  let transparentPixels = 0;
  for (let i = 3; i < pixels.length; i += 4) {
    if (pixels[i] < 255) transparentPixels++;
  }

  let unusedOpaque = 0;
  STANDARD_ROWS.forEach((row, rowIndex) => {
    for (let column = row.frames; column < CELL.columns; column++) {
      const startX = column * CELL.width;
      const startY = rowIndex * CELL.height;
      for (let y = startY; y < startY + CELL.height && unusedOpaque === 0; y++) {
        let alphaIndex = (y * canvas.width + startX) * 4 + 3;
        for (let x = 0; x < CELL.width; x++, alphaIndex += 4) {
          if (pixels[alphaIndex] !== 0) { unusedOpaque++; break; }
        }
      }
    }
  });

  return { hasTransparency: transparentPixels > 0, unusedClear: format ? unusedOpaque === 0 : false };
}

async function loadAtlas(file) {
  if (!file) return;
  if (state.objectUrl) URL.revokeObjectURL(state.objectUrl);
  state.file = file;
  state.format = null;
  state.valid = false;
  setCheck("type", ["image/png", "image/webp"].includes(file.type), file.type || "Unknown");
  setCheck("weight", file.size <= MAX_FILE_BYTES, `${(file.size / 1024 / 1024).toFixed(2)} MiB`);
  setCheck("size", null, "1536×1872 / 1536×2288");
  setCheck("alpha", null, t("checks.alphaNote"));
  setCheck("unused", null, t("checks.unusedNote"));
  state.objectUrl = URL.createObjectURL(file);
  const image = new Image();
  image.src = state.objectUrl;
  try {
    await image.decode();
    state.image = image;
    state.format = detectFormat(image.naturalWidth, image.naturalHeight);
    setCheck("size", Boolean(state.format), `${image.naturalWidth}×${image.naturalHeight}`);
    const audit = alphaAudit(image, state.format);
    setCheck("alpha", audit.hasTransparency, audit.hasTransparency ? "RGBA / alpha detected" : "Opaque image");
    setCheck("unused", audit.unusedClear, audit.unusedClear ? "Clear" : "Pixels found in unused cells");
  } catch {
    state.image = null;
    setCheck("size", false, "Image decode failed");
    setCheck("alpha", false, "Unavailable");
    setCheck("unused", false, "Unavailable");
  }
  state.valid = Object.values(state.validation).every(Boolean);
  state.currentState = "idle";
  state.currentFrame = 0;
  state.frameStartedAt = performance.now();
  renderStateTabs();
  refreshStatus();
  updateManifest();
}

function availableStates() {
  const rows = STANDARD_ROWS.map((row) => ({ id: row.id, frames: row.frames, durations: row.durations }));
  if (state.format?.key === "v2") rows.push({ id: "look", frames: 16, durations: Array(16).fill(150) });
  return rows;
}

function renderStateTabs() {
  elements.stateTabs.replaceChildren();
  for (const row of availableStates()) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = t(`state.${row.id}`);
    button.classList.toggle("active", row.id === state.currentState);
    button.addEventListener("click", () => {
      state.currentState = row.id;
      state.currentFrame = 0;
      state.frameStartedAt = performance.now();
      renderStateTabs();
    });
    elements.stateTabs.append(button);
  }
}

function drawFrame(now) {
  requestAnimationFrame(drawFrame);
  if (!state.valid || !state.image) return;
  const animation = availableStates().find((row) => row.id === state.currentState) ?? availableStates()[0];
  const elapsed = now - state.frameStartedAt;
  const duration = animation.durations[state.currentFrame] ?? 150;
  if (elapsed >= duration) {
    state.currentFrame = (state.currentFrame + 1) % animation.frames;
    state.frameStartedAt = now;
  }
  let row;
  let column;
  if (animation.id === "look") {
    row = state.currentFrame < 8 ? 9 : 10;
    column = state.currentFrame % 8;
  } else {
    row = STANDARD_ROWS.findIndex((item) => item.id === animation.id);
    column = state.currentFrame;
  }
  const context = elements.previewCanvas.getContext("2d");
  context.clearRect(0, 0, CELL.width, CELL.height);
  context.imageSmoothingEnabled = false;
  context.drawImage(state.image, column * CELL.width, row * CELL.height, CELL.width, CELL.height, 0, 0, CELL.width, CELL.height);
  elements.frameLabel.textContent = `${state.currentFrame + 1} / ${animation.frames}`;
  elements.timeline.style.width = `${((state.currentFrame + Math.min(elapsed / duration, 1)) / animation.frames) * 100}%`;
}

function currentManifest() {
  return createManifest({
    id: elements.petId.value,
    displayName: elements.displayName.value,
    description: elements.description.value,
    format: state.format ?? FORMATS.v2
  });
}

function updateManifest() {
  const id = normalizePetId(elements.petId.value) || "your-pet";
  elements.folderName.textContent = id;
  elements.installCommand.textContent = `.\\scripts\\install-pet.ps1 -SourceDir "C:\\path\\to\\${id}"`;
  elements.manifestCode.textContent = JSON.stringify(currentManifest(), null, 2);
  const metadata = validateMetadata({ id: elements.petId.value, displayName: elements.displayName.value, description: elements.description.value });
  const canExport = state.valid && metadata.ok;
  elements.exportFolder.disabled = !canExport;
  elements.downloadFiles.disabled = !canExport;
}

function refreshStatus() {
  elements.previewCanvas.style.display = state.valid ? "block" : "none";
  elements.conceptFallback.style.display = state.valid ? "none" : "block";
  if (state.valid && state.format) {
    elements.formatLabel.textContent = t("status.valid", { format: state.format.key, width: state.format.width, height: state.format.height });
    elements.exportStatus.textContent = t("export.ready", { format: state.format.key });
    elements.exportStatus.classList.add("ready");
  } else {
    elements.formatLabel.textContent = state.file ? t("status.invalid") : t("preview.waiting");
    elements.exportStatus.textContent = t("export.locked");
    elements.exportStatus.classList.remove("ready");
    elements.frameLabel.textContent = "— / —";
    elements.timeline.style.width = "0";
  }
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => elements.toast.classList.remove("show"), 2200);
}

async function copyText(value) {
  await navigator.clipboard.writeText(value);
  showToast(t("toast.copied"));
}

async function webpBlob() {
  const canvas = document.createElement("canvas");
  canvas.width = state.image.naturalWidth;
  canvas.height = state.image.naturalHeight;
  canvas.getContext("2d").drawImage(state.image, 0, 0);
  return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("WebP encoding failed")), "image/webp", 1));
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function packageFiles() {
  if (!state.valid) throw new Error(t("toast.invalid"));
  const manifestBlob = new Blob([`${JSON.stringify(currentManifest(), null, 2)}\n`], { type: "application/json" });
  return { manifestBlob, sheetBlob: await webpBlob() };
}

async function exportFolder() {
  if (!window.showDirectoryPicker) {
    showToast(t("toast.folderFallback"));
    return;
  }
  const { manifestBlob, sheetBlob } = await packageFiles();
  const root = await window.showDirectoryPicker({ mode: "readwrite" });
  const folder = await root.getDirectoryHandle(normalizePetId(elements.petId.value), { create: true });
  for (const [name, blob] of [["pet.json", manifestBlob], ["spritesheet.webp", sheetBlob]]) {
    const handle = await folder.getFileHandle(name, { create: true });
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
  }
  showToast(t("toast.exported"));
}

async function downloadFiles() {
  const { manifestBlob, sheetBlob } = await packageFiles();
  downloadBlob(manifestBlob, "pet.json");
  setTimeout(() => downloadBlob(sheetBlob, "spritesheet.webp"), 180);
  showToast(t("toast.downloaded"));
}

$$('[data-language]').forEach((button) => button.addEventListener("click", () => setLanguage(button.dataset.language)));
$$('.concept-card').forEach((card) => card.addEventListener("click", () => selectConcept(card.dataset.concept)));
elements.heroUpload.addEventListener("click", () => { elements.atlasInput.click(); location.hash = "studio"; });
elements.dropZone.addEventListener("click", () => elements.atlasInput.click());
elements.atlasInput.addEventListener("change", () => loadAtlas(elements.atlasInput.files[0]));
for (const event of ["dragenter", "dragover"]) elements.dropZone.addEventListener(event, (e) => { e.preventDefault(); elements.dropZone.classList.add("dragging"); });
for (const event of ["dragleave", "drop"]) elements.dropZone.addEventListener(event, (e) => { e.preventDefault(); elements.dropZone.classList.remove("dragging"); });
elements.dropZone.addEventListener("drop", (event) => loadAtlas(event.dataTransfer.files[0]));
$("#toggleBackdrop").addEventListener("click", () => elements.previewStage.classList.toggle("void"));
for (const input of [elements.petId, elements.displayName, elements.description]) input.addEventListener("input", updateManifest);
$("#copyManifest").addEventListener("click", () => copyText(elements.manifestCode.textContent));
$("#copyInstall").addEventListener("click", () => copyText(elements.installCommand.textContent));
elements.exportFolder.addEventListener("click", () => exportFolder().catch((error) => error.name !== "AbortError" && showToast(error.message)));
elements.downloadFiles.addEventListener("click", () => downloadFiles().catch((error) => showToast(error.message)));

selectConcept("nebby");
setLanguage(state.language);
renderStateTabs();
updateManifest();
requestAnimationFrame(drawFrame);

window.addEventListener("beforeunload", () => { if (state.objectUrl) URL.revokeObjectURL(state.objectUrl); });

// Exposed only for simple browser smoke tests.
window.__PET_LAB__ = { formats: FORMATS, directions: LOOK_DIRECTIONS };
