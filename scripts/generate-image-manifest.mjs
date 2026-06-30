import { readdir, stat, writeFile } from "node:fs/promises";
import { join, posix } from "node:path";

const imagesRoot = join(process.cwd(), "public", "images");
const outputPath = join(imagesRoot, "manifest.json");
const imageExtensions = new Set([".webp", ".jpg", ".jpeg", ".png", ".avif"]);
const excludedFolders = new Set(["home"]);
const titleOverrides = new Map([
  ["bioque-studio", "Bioque Studio"],
  ["rayban", "Ray-Ban"],
  ["perfil", "Perfil"]
]);

function extensionOf(fileName) {
  const dotIndex = fileName.lastIndexOf(".");
  return dotIndex === -1 ? "" : fileName.slice(dotIndex).toLowerCase();
}

function toTitle(folderName) {
  if (titleOverrides.has(folderName)) return titleOverrides.get(folderName);

  return folderName
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function sortFiles(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

async function listCollection(folderName) {
  const folderPath = join(imagesRoot, folderName);
  const entries = await readdir(folderPath, { withFileTypes: true });
  const imagesByStem = new Map();

  entries
    .filter((entry) => entry.isFile() && imageExtensions.has(extensionOf(entry.name)))
    .forEach((entry) => {
      const extension = extensionOf(entry.name);
      const stem = entry.name.slice(0, -extension.length);
      const current = imagesByStem.get(stem);
      const next = posix.join("/images", folderName, entry.name);

      if (!current || extension === ".webp") {
        imagesByStem.set(stem, next);
      }
    });

  const images = [...imagesByStem.values()].sort(sortFiles);

  if (!images.length) return null;

  return {
    id: folderName,
    title: toTitle(folderName),
    images
  };
}

const folders = (await readdir(imagesRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && !excludedFolders.has(entry.name))
  .map((entry) => entry.name)
  .sort(sortFiles);

const collections = [];

for (const folderName of folders) {
  const folderPath = join(imagesRoot, folderName);
  const folderStat = await stat(folderPath);
  if (!folderStat.isDirectory()) continue;

  const collection = await listCollection(folderName);
  if (collection) collections.push(collection);
}

await writeFile(outputPath, `${JSON.stringify({ collections }, null, 2)}\n`);
console.log(`Generated ${outputPath} with ${collections.length} collections.`);
