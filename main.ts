// Write one warm family scene to /output/entry.txt.
//
// Deterministic, no network, no dependencies. The line is a fixed string:
// the program writes exactly these bytes on every run.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "Every year my little brother saves the last bite of his birthday cake for Dad, and Dad — who is allergic to cake — still eats it.";

// Gate mirror: the house gate accepts 1-280 characters of non-whitespace
// text. Fail loudly here rather than write a line the gate would refuse.
// Count characters the way the gate does (JS string length), and also cap
// the UTF-8 bytes so a line of wide characters cannot slip past the
// character count while blowing the size the judge reads.
if (LINE.length < 1 || LINE.length > 280 || !LINE.trim()) {
  throw new Error(`entry line is ${LINE.length} chars, outside the 1-280 gate`);
}
if (Buffer.byteLength(LINE, "utf8") > 280) {
  throw new Error(`entry line is ${Buffer.byteLength(LINE, "utf8")} bytes, over the 280-byte cap`);
}
if (LINE !== LINE.trim()) {
  throw new Error("entry line has leading or trailing whitespace");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

// Read back and confirm the file holds exactly the line: a silent short
// write or encoding slip must fail the run, never reach the judge.
if (readFileSync(outPath, "utf8") !== LINE) {
  throw new Error("entry.txt read-back does not match the line");
}
