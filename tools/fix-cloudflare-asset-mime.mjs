import { readdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("dist");
const chunks = path.join(root, "client", "_next", "static", "chunks");

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const target = path.join(directory, entry.name);
      return entry.isDirectory() ? filesIn(target) : [target];
    }),
  );
  return nested.flat();
}

const chunkNames = (await readdir(chunks)).filter((name) => name.endsWith(".js"));

const replacements = new Map(
  chunkNames.map((name) => [name, name.replace(/\.js$/, "-5tap-v3.js")]),
);

for (const [oldName, newName] of replacements) {
  await rename(path.join(chunks, oldName), path.join(chunks, newName));
  const renamed = path.join(chunks, newName);
  const source = await readFile(renamed, "utf8");
  await writeFile(renamed, `${source}\n/* 5Tap Safari asset refresh v3 */\n`);
}

for (const file of await filesIn(root)) {
  if (!/\.(?:js|json|html|txt|map)$/.test(file)) continue;
  let source = await readFile(file, "utf8");
  let changed = false;
  for (const [oldName, newName] of replacements) {
    if (!source.includes(oldName)) continue;
    source = source.replaceAll(oldName, newName);
    changed = true;
  }
  if (changed) await writeFile(file, source);
}

console.log(`Prepared ${replacements.size} shared browser chunks for Cloudflare.`);
