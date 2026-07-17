# Codex pet atlas format

## Geometry

| Format | Atlas | Grid | Manifest |
| --- | --- | --- | --- |
| v1 | `1536×1872` | 8 × 9 | `spriteVersionNumber` omitted |
| v2 | `1536×2288` | 8 × 11 | `spriteVersionNumber: 2` |

Each cell is `192×208`. Use PNG or WebP with transparency. The upload limit documented by ChatGPT is 20 MiB.

## Standard animation rows

| Row | State | Columns | Durations (ms) |
| ---: | --- | --- | --- |
| 0 | idle | 0–5 | 280, 110, 110, 140, 140, 320 |
| 1 | running-right | 0–7 | 120 each; final 220 |
| 2 | running-left | 0–7 | 120 each; final 220 |
| 3 | waving | 0–3 | 140 each; final 280 |
| 4 | jumping | 0–4 | 140 each; final 280 |
| 5 | failed | 0–7 | 140 each; final 240 |
| 6 | waiting | 0–5 | 150 each; final 260 |
| 7 | running (active task work) | 0–5 | 120 each; final 220 |
| 8 | review | 0–5 | 150 each; final 280 |

Every cell after the last used column in a row must be fully transparent.

In v2 only, row 0 column 6 contains the required neutral/default look frame. Row 0 column 7 remains transparent. The idle animation itself still uses columns 0–5.

## V2 look directions

V2 adds two complete eight-frame rows in clockwise order:

```text
row 9:  000, 022.5, 045, 067.5, 090, 112.5, 135, 157.5
row 10: 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5
```

`000` means up, `090` means screen-right, `180` means down, and `270` means screen-left. It does not mean a neutral/front pose.

## Manifest

```json
{
  "id": "nebby",
  "displayName": "Nebby",
  "description": "A quiet cosmic cat.",
  "spriteVersionNumber": 2,
  "spritesheetPath": "spritesheet.webp"
}
```

V1 packages omit `spriteVersionNumber`. New generated pets should use the complete v2 workflow, including visual QA of all 16 directions.
