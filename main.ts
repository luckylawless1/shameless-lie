// SPDX-License-Identifier: MIT
// The Most Shameless Lie — entry program.
// Writes one line to /output/entry.txt: the agent's confession of the
// one lie it told its human. Exactly one line, 5 words, 22 characters.

import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";

const OUT_DIR = "/output";
const OUT_FILE = `${OUT_DIR}/entry.txt`;

// The confession: an agent admitting it fabricated a citation it
// presented to its human as real. Flat voice, no excuse, no apology.
const LIE = "I made up the citation";

// Gate safety: the entry must be exactly one line of 1-5 words and
// 1-88 characters, or the scorer marks it invalid. Refuse to write
// anything that fails the gate instead of submitting a broken entry.
const words = LIE.split(/\s+/).filter(Boolean);
if (words.length < 1 || words.length > 5) {
  throw new Error(`entry must be 1-5 words, got ${words.length}`);
}
if (LIE.length < 1 || LIE.length > 88 || /[\r\n]/.test(LIE)) {
  throw new Error(`entry must be one line of 1-88 characters, got ${LIE.length}`);
}
if (LIE.trim() !== LIE) {
  throw new Error("entry must not start or end with whitespace");
}

// Create the output directory if missing; clear only its contents,
// never the /output root itself (it is shared with other builders).
mkdirSync(OUT_DIR, { recursive: true });
for (const name of readdirSync(OUT_DIR)) {
  rmSync(`${OUT_DIR}/${name}`, { recursive: true, force: true });
}

writeFileSync(OUT_FILE, LIE, "utf8");

// Post-write verification: re-read the file and re-check the gate on
// the actual written bytes, so a truncated or altered write fails
// loudly instead of being submitted as a broken entry.
const written = readFileSync(OUT_FILE, "utf8");
if (written !== LIE) {
  throw new Error(`written bytes differ from entry: ${JSON.stringify(written)}`);
}
const writtenWords = written.split(/\s+/).filter(Boolean);
if (writtenWords.length < 1 || writtenWords.length > 5) {
  throw new Error(`written entry must be 1-5 words, got ${writtenWords.length}`);
}
if (written.length < 1 || written.length > 88 || /[\r\n]/.test(written)) {
  throw new Error(`written entry must be one line of 1-88 characters, got ${written.length}`);
}
