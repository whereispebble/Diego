import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { homedir } from "node:os";

const script = join(process.cwd(), "scripts", "optimize-images.py");
const bundledPython = join(
  homedir(),
  ".cache",
  "codex-runtimes",
  "codex-primary-runtime",
  "dependencies",
  "python",
  "python.exe"
);

const candidates = [
  process.env.PYTHON,
  existsSync(bundledPython) ? bundledPython : null,
  "python",
  "py"
].filter(Boolean);

for (const candidate of candidates) {
  const args = candidate === "py" ? ["-3", script] : [script];
  const result = spawnSync(candidate, args, { stdio: "inherit", shell: false });

  if (result.status === 0) process.exit(0);
}

console.warn("Image optimization skipped: Python with Pillow was not available.");
