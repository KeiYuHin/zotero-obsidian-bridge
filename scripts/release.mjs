import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
let crcTable;
const args = parseArgs(process.argv.slice(2));
const version = args.version || readJson("plugins/obsidian/manifest.json").version;
const shouldPackage = !args["no-package"];
const githubRepo = args["github-repo"] || "KeiYuHin/zotero-obsidian-bridge";

if (args.clean) {
  rmSync(path("release"), { recursive: true, force: true });
  console.log("Removed release/");
  process.exit(0);
}

assertVersion(version);
syncVersions(version, {
  zoteroUpdateUrl:
    args["zotero-update-url"] ||
    `https://github.com/${githubRepo}/releases/latest/download/zotero-updates.json`,
});

if (shouldPackage) {
  packageRelease(version, {
    zoteroUpdateLink:
      args["zotero-update-link"] ||
      `https://github.com/${githubRepo}/releases/download/v${version}/zotero-citekey-bridge-${version}.xpi`,
  });
}

function parseArgs(values) {
  const parsed = {};
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (!value.startsWith("--")) {
      continue;
    }
    const key = value.slice(2);
    const next = values[index + 1];
    if (!next || next.startsWith("--")) {
      parsed[key] = true;
    } else {
      parsed[key] = next;
      index += 1;
    }
  }
  return parsed;
}

function assertVersion(value) {
  if (!/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(value)) {
    throw new Error(`VERSION must look like SemVer, received: ${value}`);
  }
}

function syncVersions(nextVersion, options) {
  const packageJson = readJson("package.json");
  packageJson.version = nextVersion;
  writeJson("package.json", packageJson);

  const obsidianManifest = readJson("plugins/obsidian/manifest.json");
  obsidianManifest.version = nextVersion;
  writeJson("plugins/obsidian/manifest.json", obsidianManifest);

  const versions = existsSync(path("plugins/obsidian/versions.json"))
    ? readJson("plugins/obsidian/versions.json")
    : {};
  versions[nextVersion] = obsidianManifest.minAppVersion;
  writeJson("plugins/obsidian/versions.json", sortVersionMap(versions));

  const zoteroManifest = readJson("plugins/zotero/manifest.json");
  zoteroManifest.version = nextVersion;
  if (options.zoteroUpdateUrl) {
    zoteroManifest.applications.zotero.update_url = options.zoteroUpdateUrl;
  }
  writeJson("plugins/zotero/manifest.json", zoteroManifest);
}

function packageRelease(nextVersion, options) {
  const releaseRoot = path("release", nextVersion);
  const zoteroDir = join(releaseRoot, "zotero");
  const obsidianDir = join(releaseRoot, "obsidian");
  mkdirSync(zoteroDir, { recursive: true });
  mkdirSync(obsidianDir, { recursive: true });

  const zoteroFiles = [
    "plugins/zotero/manifest.json",
    "plugins/zotero/bootstrap.js",
    "plugins/zotero/obsidian-zotero-link.js",
    "LICENSE",
  ];
  const zoteroArchive = join(zoteroDir, `zotero-citekey-bridge-${nextVersion}.xpi`);
  writeZip(
    zoteroArchive,
    zoteroFiles.map((file) => ({
      source: path(file),
      name: file === "LICENSE" ? "LICENSE" : relative(path("plugins/zotero"), path(file)),
    })),
  );

  const zoteroManifest = readJson("plugins/zotero/manifest.json");
  const updateManifest = {
    addons: {
      [zoteroManifest.applications.zotero.id]: {
        updates: [
          {
            version: nextVersion,
            update_link: options.zoteroUpdateLink,
            update_hash: `sha256:${sha256(zoteroArchive)}`,
            applications: {
              zotero: {
                strict_min_version: zoteroManifest.applications.zotero.strict_min_version,
                strict_max_version: zoteroManifest.applications.zotero.strict_max_version,
              },
            },
          },
        ],
      },
    },
  };
  writeJson(join(zoteroDir, "zotero-updates.json"), updateManifest);

  const obsidianFiles = [
    "plugins/obsidian/main.js",
    "plugins/obsidian/manifest.json",
    "plugins/obsidian/versions.json",
  ];
  for (const file of obsidianFiles) {
    writeFileSync(join(obsidianDir, file.split("/").at(-1)), readFileSync(path(file)));
  }
  writeZip(
    join(obsidianDir, `citekey-import-bridge-${nextVersion}.zip`),
    obsidianFiles.map((file) => ({
      source: path(file),
      name: file.split("/").at(-1),
    })),
  );

  console.log(`Release artifacts written to ${relative(root, releaseRoot).split(sep).join("/")}/`);
}

function readJson(file) {
  return JSON.parse(readFileSync(path(file), "utf8"));
}

function writeJson(file, value) {
  const target = isAbsolute(file) ? file : path(file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`);
}

function path(...parts) {
  return join(root, ...parts);
}

function sha256(file) {
  return createHash("sha256").update(readFileSync(file)).digest("hex");
}

function sortVersionMap(map) {
  return Object.fromEntries(
    Object.entries(map).sort(([left], [right]) => compareVersions(left, right)),
  );
}

function compareVersions(left, right) {
  const a = left.split(/[.-]/).map((part) => Number.parseInt(part, 10) || 0);
  const b = right.split(/[.-]/).map((part) => Number.parseInt(part, 10) || 0);
  for (let index = 0; index < Math.max(a.length, b.length); index += 1) {
    if ((a[index] || 0) !== (b[index] || 0)) {
      return (a[index] || 0) - (b[index] || 0);
    }
  }
  return 0;
}

function writeZip(target, entries) {
  const fileRecords = [];
  const centralRecords = [];
  let offset = 0;

  for (const entry of entries) {
    const data = readFileSync(entry.source);
    const name = Buffer.from(entry.name.replaceAll("\\", "/"));
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0, 6);
    local.writeUInt16LE(0, 8);
    local.writeUInt16LE(0, 10);
    local.writeUInt16LE(0, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28);
    fileRecords.push(local, name, data);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0, 8);
    central.writeUInt16LE(0, 10);
    central.writeUInt16LE(0, 12);
    central.writeUInt16LE(0, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(data.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt16LE(0, 30);
    central.writeUInt16LE(0, 32);
    central.writeUInt16LE(0, 34);
    central.writeUInt16LE(0, 36);
    central.writeUInt32LE(0, 38);
    central.writeUInt32LE(offset, 42);
    centralRecords.push(central, name);

    offset += local.length + name.length + data.length;
  }

  const centralSize = centralRecords.reduce((size, record) => size + record.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(offset, 16);
  end.writeUInt16LE(0, 20);

  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, Buffer.concat([...fileRecords, ...centralRecords, end]));
}

function crc32(data) {
  const table = getCrcTable();
  let crc = 0xffffffff;
  for (const byte of data) {
    crc = (crc >>> 8) ^ table[(crc ^ byte) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function getCrcTable() {
  if (!crcTable) {
    crcTable = Array.from({ length: 256 }, (_, index) => {
      let value = index;
      for (let bit = 0; bit < 8; bit += 1) {
        value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
      }
      return value >>> 0;
    });
  }
  return crcTable;
}
