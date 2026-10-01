# Zotero Obsidian Bridge

Paired personal plugins for a citekey-first Zotero to Obsidian literature-note workflow.

This repository contains two small plugins that are meant to be versioned and released together:

- **Zotero Citekey Bridge**: a Zotero 7+ plugin that reads a citation key, calls an Obsidian URL, and stores an `Obsidian Link:` back on the Zotero item.
- **Citekey Import Bridge**: an Obsidian desktop plugin that receives `obsidian://zotero-note?citekey=...` links and calls Zotero Integration's import flow.

中文说明见 [README.zh-CN.md](README.zh-CN.md).

## Requirements

- [Zotero](https://www.zotero.org/) 7 or later.
- [Better BibTeX for Zotero](https://retorque.re/zotero-better-bibtex/installation/), unless your Zotero version exposes a native `citationKey` field.
- [Obsidian desktop](https://obsidian.md/).
- [Zotero Integration for Obsidian](https://community.obsidian.md/plugins/obsidian-zotero-desktop-connector), plugin ID `obsidian-zotero-desktop-connector`.
- A Zotero Integration import format named `Paper Note`, or an explicit `format` query parameter in the URL.

For first-time setup, start with Obsidian's official [Community plugins](https://obsidian.md/help/community-plugins) guide, Zotero's official [Plugins for Zotero](https://www.zotero.org/support/plugins) page, and the Zotero Integration plugin page above. This gives newcomers the normal Obsidian-first installation path before adding this bridge.

## Matching Configuration

In this project, "vault name" means the Obsidian vault name, not the GitHub repository name. The default setup assumes an Obsidian vault named `ObsidianVault` and a folder named `ZoteroLib` inside that vault for literature notes.

Configure the Obsidian side first:

- Create the folder `ZoteroLib` in the Obsidian vault `ObsidianVault`.
- In Zotero Integration, create or edit an import format named `Paper Note`.
- Set that import format's `Output path` to `ZoteroLib/{{citekey}}.md`.

The `Paper Note` name must exactly match the plugin default, including spelling and spaces.

The Zotero plugin defaults must match those choices:

```js
config: Object.freeze({
  vaultName: "ObsidianVault",
  folder: "ZoteroLib",
  extraLabel: "Obsidian Link",
  createBaseURL: "obsidian://zotero-note"
})
```

If your Obsidian vault is not named `ObsidianVault`, or your notes are not stored in `ZoteroLib`, update both the Zotero plugin `config` and Zotero Integration's `Output path`. If your import format is not named `Paper Note`, pass a `format=...` URL parameter or change the Obsidian plugin's default format.

## Workflow

1. In Zotero, right-click a regular item and choose `创建并关联 Obsidian 笔记`.
2. The Zotero plugin resolves the item citekey.
3. It opens `obsidian://zotero-note?citekey=<citekey>&file=<note-path>`.
4. The Obsidian plugin receives the citekey and calls Zotero Integration's `runImport(format, citekey, library)`.
5. After the import finishes, the Obsidian plugin opens the imported Markdown file in a new tab.
6. The Zotero plugin stores an `Obsidian Link:` in the item's `Extra` field for later opening.

Stored Obsidian note links include `paneType=tab`, so opening a linked note from Zotero opens it in a new Obsidian tab instead of replacing the current active tab. See Obsidian's [URI documentation](https://obsidian.md/help/uri) for the `paneType` parameter.

## Repository Layout

```text
plugins/
  zotero/      Zotero Citekey Bridge source
  obsidian/    Citekey Import Bridge source
docs/zh/       development notes and the Zotero Integration template
scripts/       release automation
release/       generated artifacts, ignored by git
```

## Release

With Make:

```sh
make release VERSION=0.1.0
```

Without Make:

```sh
node scripts/release.mjs --version 0.1.0
```

The default GitHub repository is `KeiYuHin/zotero-obsidian-bridge`. To package for a fork:

```sh
make release VERSION=0.1.0 GITHUB_REPO=owner/repo
```

The release command updates internal versions and writes:

- `release/<version>/zotero/zotero-citekey-bridge-<version>.xpi`
- `release/<version>/zotero/zotero-updates.json`
- `release/<version>/obsidian/main.js`
- `release/<version>/obsidian/manifest.json`
- `release/<version>/obsidian/versions.json`
- `release/<version>/obsidian/citekey-import-bridge-<version>.zip`

For an Obsidian GitHub release, upload `main.js`, `manifest.json`, and optionally `versions.json` or the zip for manual installs. For a Zotero release, upload the `.xpi` and `zotero-updates.json`.

## Notes

The Obsidian side intentionally keeps the plugin ID as `citekey-import-bridge`. Current Obsidian community-plugin submission rules require the `id` to avoid the word `obsidian`.

`Citekey Import Bridge` calls Zotero Integration's `runImport()` method. That method is useful and works well for this workflow, but it is not a formally stable public API, so future Zotero Integration updates may require a small compatibility change.

The Zotero plugin manifest supports Zotero 7 through Zotero 10. The Zotero 10 migration does not otherwise affect this plugin: it does not use the changed collection-selection, search, local HTTP, database, or cookie APIs.

## License

MIT
