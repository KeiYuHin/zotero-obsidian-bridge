# Changelog

All notable changes to Zotero Obsidian Bridge are documented in this file.

## 0.1.2 - 2026-10-01

### Compatibility

- Add Zotero 10 support by extending the Zotero plugin compatibility range to `10.0.*`.
- Confirm that the bridge does not depend on Zotero 10's changed collection-selection, search, local HTTP, database, or cookie APIs.
- Keep compatibility with Zotero 7–9 and with existing `obsidian://zotero-note?citekey=...` links.

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
