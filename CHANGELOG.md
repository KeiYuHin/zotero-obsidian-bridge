# Changelog

All notable changes to Zotero Obsidian Bridge are documented in this file.

## 0.3.0 - 2026-11-20

### New features

- Zotero: open or create the Obsidian note from the PDF reader, without going back to the library. Right-click the reader tab (Zotero 8+) or the PDF page (Zotero 7+). Linked items show "Open Obsidian Note"; unlinked items show "Create and Link Obsidian Note".
- Zotero: in the reader, the note belongs to the PDF's parent item. Standalone PDFs without a parent item show no menu.

### Documentation

- Add full English user guides in `docs/en/`: install, customization, troubleshooting, and the template guide. The English README now matches the Chinese one.

### Compatibility

- The Obsidian plugin is unchanged in this release; its version moves to 0.3.0 because the two plugins are released together.

### 中文摘要

- Zotero 端：在 PDF 阅读器里右键标签页（Zotero 8+）或 PDF 页面（Zotero 7+），即可打开或创建这篇文献的 Obsidian 笔记，不用再退回文献库。
- 新增完整的英文文档（`docs/en/`），英文 README 与中文版对齐。
- Obsidian 端无改动，仅随项目统一版本号。

## 0.2.1 - 2026-11-18

Changes from the Obsidian community review.

- Obsidian: read the UI language with Obsidian's API instead of `localStorage`.
- README: title now matches the Obsidian plugin name.
- Releases are built by GitHub Actions from the tag and include artifact attestations. Add `package-lock.json` so builds can be verified.

### 中文摘要

- 按 Obsidian 社区审核的建议修改：界面语言改用 Obsidian 的接口读取，README 标题与插件名一致，Release 改由 GitHub Actions 构建并附带来源证明。

## 0.2.0 - 2026-11-18

### New features

- Zotero: add a **Citekey Bridge** settings pane (Settings → Citekey Bridge) for the vault name, note folder, and import format name. Editing the `.xpi` source is no longer needed.
- Zotero: the settings pane shows the matching Zotero Integration Name and Output Path, and has a button that opens the vault in Obsidian to check the vault name.
- Zotero: the create URL now passes `vault` and `format`, so the right vault handles it and the Obsidian side needs no format setting.
- Zotero: menus and messages follow the Zotero UI language (Chinese or English). "Open" and "Remove" are disabled until an item is linked.
- Obsidian: clearer notices when Zotero Integration is missing, when the import format does not exist (lists available formats), or when the import fails.
- Obsidian: resolve the note path from the import format's Output Path, and warn when it differs from the Zotero-side folder.
- Obsidian: do not open a second tab when Zotero Integration has already opened the note.

### Fixes

- Zotero: notification popups now close when clicked. The settings-pane test hint shows inside the pane instead of a popup that could stay on screen.

### Release process

- Release tags no longer use a `v` prefix (`0.2.0`), as Obsidian's community plugin list requires. `manifest.json` and `versions.json` are now also kept at the repository root.

### Documentation

- Add the demo GIF and screenshots.

- Rewrite the README and add step-by-step install, customization, and troubleshooting guides for new users.
- Move development notes to `docs/zh/dev/`.
- Template: fix the `Authors` label and bump `paperNoteTemplateVersion` to `0.1.1`.

### 中文摘要

- Zotero 端新增设置面板，可直接修改库名、文件夹、导入格式名，不再需要改代码。
- Obsidian 端报错提示更清楚，并会检查两边路径是否一致。
- 重写面向新手的文档：安装指南、自定义设置、常见问题。

## 0.1.2 - 2026-10-01

### Compatibility

- Add Zotero 10 support by extending the Zotero plugin compatibility range to `10.0.*`.
- Confirm that the bridge does not depend on Zotero 10's changed collection-selection, search, local HTTP, database, or cookie APIs.
- Keep compatibility with Zotero 7–9 and with existing `obsidian://zotero-note?citekey=...` links.
- Fix the generated Zotero update URL to match the repository's `v<version>` Git tag convention.

### New features

- Open the imported literature note automatically in a new Obsidian tab after Zotero Integration finishes importing it.
- Pass the configured literature-note path from the Zotero plugin to the Obsidian plugin, avoiding a duplicated hard-coded folder setting.
- Wait briefly for Obsidian's vault index to expose the imported file before attempting to open it.

### 中文摘要

- 兼容 Zotero 10，同时继续支持 Zotero 7–9。
- Zotero Integration 导入完成后，自动在 Obsidian 新标签页中打开文献笔记。
- Zotero 端会把目标笔记路径传给 Obsidian 端；旧版 URL 仍可使用默认 `ZoteroLib` 路径。

## 0.1.1 - 2026-08-10

- Open stored Obsidian note links in a new tab with `paneType=tab`.
- Update installation and path-matching documentation.

## 0.1.0 - 2026-07-17

- Initial paired Zotero and Obsidian plugin release.
