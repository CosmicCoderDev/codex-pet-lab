import { access, readFile } from "node:fs/promises";

const required = [
  "index.html",
  "styles.css",
  "app.js",
  "src/pet-contract.js",
  "README.md",
  "README.zh-CN.md",
  "scripts/serve.mjs",
  "scripts/install-pet.ps1"
];

for (const file of required) await access(new URL(`../${file}`, import.meta.url));

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
if (!html.includes('lang="en"') || !html.includes("data-i18n")) {
  throw new Error("The bilingual UI markers are missing.");
}

const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
const conceptCount = (app.match(/category: "/g) || []).length;
if (conceptCount < 14 || !app.includes("importLocalPackFolders")) {
  throw new Error("The anime concept shelf or local-pack importer is incomplete.");
}

console.log(`Project check passed (${required.length} required files).`);
