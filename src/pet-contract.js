export const CELL = Object.freeze({ width: 192, height: 208, columns: 8 });

export const STANDARD_ROWS = Object.freeze([
  { id: "idle", frames: 6, durations: [280, 110, 110, 140, 140, 320] },
  { id: "running-right", frames: 8, durations: [120, 120, 120, 120, 120, 120, 120, 220] },
  { id: "running-left", frames: 8, durations: [120, 120, 120, 120, 120, 120, 120, 220] },
  { id: "waving", frames: 4, durations: [140, 140, 140, 280] },
  { id: "jumping", frames: 5, durations: [140, 140, 140, 140, 280] },
  { id: "failed", frames: 8, durations: [140, 140, 140, 140, 140, 140, 140, 240] },
  { id: "waiting", frames: 6, durations: [150, 150, 150, 150, 150, 260] },
  { id: "running", frames: 6, durations: [120, 120, 120, 120, 120, 220] },
  { id: "review", frames: 6, durations: [150, 150, 150, 150, 150, 280] }
]);

export const LOOK_DIRECTIONS = Object.freeze([
  "000", "022.5", "045", "067.5", "090", "112.5", "135", "157.5",
  "180", "202.5", "225", "247.5", "270", "292.5", "315", "337.5"
]);

export const FORMATS = Object.freeze({
  v1: { key: "v1", width: 1536, height: 1872, rows: 9, spriteVersionNumber: 1 },
  v2: { key: "v2", width: 1536, height: 2288, rows: 11, spriteVersionNumber: 2 }
});

export const MAX_FILE_BYTES = 20 * 1024 * 1024;

export function detectFormat(width, height) {
  return Object.values(FORMATS).find((format) => format.width === width && format.height === height) ?? null;
}

export function normalizePetId(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function createManifest({ id, displayName, description, format }) {
  const manifest = {
    id: normalizePetId(id),
    displayName: displayName.trim(),
    description: description.trim(),
    spritesheetPath: "spritesheet.webp"
  };

  if (format?.spriteVersionNumber === 2) {
    manifest.spriteVersionNumber = 2;
  }

  return manifest;
}

export function validateMetadata({ id, displayName, description }) {
  const errors = [];
  const normalizedId = normalizePetId(id);
  if (!normalizedId) errors.push("id");
  if (!displayName.trim()) errors.push("displayName");
  if (!description.trim()) errors.push("description");
  return { ok: errors.length === 0, errors, normalizedId };
}

export function rowForState(stateId) {
  return STANDARD_ROWS.findIndex((row) => row.id === stateId);
}

export function firstUnusedColumn(rowIndex, format) {
  if (format?.key === "v2" && rowIndex === 0) return 7;
  return STANDARD_ROWS[rowIndex]?.frames ?? CELL.columns;
}
