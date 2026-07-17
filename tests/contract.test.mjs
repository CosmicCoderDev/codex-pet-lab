import assert from "node:assert/strict";
import {
  CELL,
  FORMATS,
  LOOK_DIRECTIONS,
  STANDARD_ROWS,
  createManifest,
  detectFormat,
  firstUnusedColumn,
  normalizePetId,
  validateMetadata
} from "../src/pet-contract.js";

assert.equal(CELL.width * CELL.columns, 1536);
assert.equal(CELL.height * 9, FORMATS.v1.height);
assert.equal(CELL.height * 11, FORMATS.v2.height);
assert.equal(STANDARD_ROWS.length, 9);
assert.equal(LOOK_DIRECTIONS.length, 16);
assert.equal(detectFormat(1536, 1872)?.key, "v1");
assert.equal(detectFormat(1536, 2288)?.key, "v2");
assert.equal(detectFormat(1024, 1024), null);
assert.equal(firstUnusedColumn(0, FORMATS.v1), 6);
assert.equal(firstUnusedColumn(0, FORMATS.v2), 7);
assert.equal(firstUnusedColumn(3, FORMATS.v2), 4);
assert.equal(normalizePetId("  Nebby 星云  "), "nebby");
assert.deepEqual(
  createManifest({ id: "Nebby", displayName: "Nebby", description: "A cosmic cat.", format: FORMATS.v2 }),
  {
    id: "nebby",
    displayName: "Nebby",
    description: "A cosmic cat.",
    spritesheetPath: "spritesheet.webp",
    spriteVersionNumber: 2
  }
);
assert.equal(validateMetadata({ id: "", displayName: "", description: "" }).ok, false);

console.log("Contract tests passed.");
