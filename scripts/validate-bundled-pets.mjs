import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const petsRoot = path.join(root, "pets");
const MAX_BYTES = 20 * 1024 * 1024;
const EXPECTED = { width: 1536, height: 2288 };

function readUInt24LE(buffer, offset) {
  return buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16);
}

function inspectWebP(buffer) {
  if (buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WEBP") {
    throw new Error("not a RIFF WebP file");
  }
  let offset = 12;
  while (offset + 8 <= buffer.length) {
    const type = buffer.toString("ascii", offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const data = offset + 8;
    if (type === "VP8X") {
      if (size < 10 || data + size > buffer.length) throw new Error("invalid VP8X chunk");
      return {
        alpha: Boolean(buffer[data] & 0x10),
        width: readUInt24LE(buffer, data + 4) + 1,
        height: readUInt24LE(buffer, data + 7) + 1
      };
    }
    if (type === "VP8L") {
      if (size < 5 || data + size > buffer.length || buffer[data] !== 0x2f) throw new Error("invalid VP8L chunk");
      const bits = buffer.readUInt32LE(data + 1);
      return {
        alpha: Boolean(bits & 0x10000000),
        width: (bits & 0x3fff) + 1,
        height: ((bits >>> 14) & 0x3fff) + 1
      };
    }
    if (type === "VP8 ") {
      if (size < 10 || data + size > buffer.length) throw new Error("invalid VP8 chunk");
      return {
        alpha: false,
        width: buffer.readUInt16LE(data + 6) & 0x3fff,
        height: buffer.readUInt16LE(data + 8) & 0x3fff
      };
    }
    offset = data + size + (size % 2);
  }
  throw new Error("WebP is missing a supported VP8X, VP8L, or VP8 image chunk");
}

const entries = await readdir(petsRoot, { withFileTypes: true });
const petDirectories = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
if (petDirectories.length === 0) throw new Error("No bundled pets found.");

const app = await readFile(path.join(root, "app.js"), "utf8");
const readme = await readFile(path.join(root, "README.md"), "utf8");
const readmeZh = await readFile(path.join(root, "README.zh-CN.md"), "utf8");
const results = [];

for (const directory of petDirectories) {
  const petRoot = path.join(petsRoot, directory);
  const manifestPath = path.join(petRoot, "pet.json");
  const previewPath = path.join(petRoot, "preview.gif");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  if (manifest.id !== directory) throw new Error(`${directory}: manifest id must match its directory`);
  if (!manifest.displayName?.trim() || !manifest.description?.trim()) throw new Error(`${directory}: displayName and description are required`);
  if (manifest.spriteVersionNumber !== 2) throw new Error(`${directory}: only validated v2 bundled pets may be published`);
  if (manifest.spritesheetPath !== "spritesheet.webp") throw new Error(`${directory}: spritesheetPath must be spritesheet.webp`);

  const sheetPath = path.join(petRoot, manifest.spritesheetPath);
  const sheetStat = await stat(sheetPath);
  const previewStat = await stat(previewPath);
  if (sheetStat.size > MAX_BYTES) throw new Error(`${directory}: spritesheet exceeds 20 MiB`);
  if (previewStat.size === 0) throw new Error(`${directory}: preview.gif is empty`);

  const image = inspectWebP(await readFile(sheetPath));
  if (image.width !== EXPECTED.width || image.height !== EXPECTED.height || !image.alpha) {
    throw new Error(`${directory}: expected an alpha-enabled ${EXPECTED.width}x${EXPECTED.height} v2 WebP`);
  }
  if (!app.includes(`./pets/${directory}/spritesheet.webp`)) throw new Error(`${directory}: app.js does not expose the bundled atlas`);
  if (!readme.includes(directory) || !readmeZh.includes(directory)) throw new Error(`${directory}: both README files must mention the pet id`);

  results.push({ id: directory, bytes: sheetStat.size, ...image });
}

console.log(`Bundled pet validation passed (${results.length} pets).`);
for (const result of results) console.log(`- ${result.id}: ${result.width}x${result.height}, alpha, ${result.bytes} bytes`);
