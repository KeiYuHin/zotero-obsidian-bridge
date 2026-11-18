const obsidian = require("obsidian");
const { Notice, Plugin, TFile, normalizePath } = obsidian;

const ZOTERO_INTEGRATION_ID = "obsidian-zotero-desktop-connector";
const DEFAULT_FORMAT = "Paper Note";
const DEFAULT_NOTE_FOLDER = "ZoteroLib";
const FILE_LOOKUP_RETRIES = 20;
const FILE_LOOKUP_INTERVAL_MS = 100;

const STRINGS = {
  zh: {
    missingCitekey: "Citekey Import Bridge：链接里缺少 citekey。",
    noIntegration:
      "没有找到 Zotero Integration 插件。请在 设置 → 第三方插件 中安装并启用它。",
    noRunImport:
      "当前版本的 Zotero Integration 不支持外部导入（缺少 runImport）。请更新 Zotero Integration，或到本项目 GitHub 提 issue。",
    noFormat:
      "Zotero Integration 里没有名为“{format}”的 Import Format。现有的是：{names}。请在 Zotero 的 Citekey Bridge 设置里改成其中一个，或在 Zotero Integration 里新建它。",
    noFormatAtAll:
      "Zotero Integration 里还没有任何 Import Format。请先在 设置 → Zotero Integration → Import Formats 中添加名为“{format}”的格式。",
    importFailed: "导入失败：{message}\n\n常见原因：Zotero 没有打开，或 Better BibTeX 没有安装。",
    notOpened: "已导入，但没找到笔记文件：{path}\n请检查 Import Format 的 Output Path。",
    pathMismatch:
      "提醒：Zotero 端设置的笔记位置是 {zotero}，而 Zotero Integration 的 Output Path 生成的是 {obsidian}。两边不一致时，Zotero 里的“打开 Obsidian 笔记”会找不到文件。请把 Zotero 端的文件夹改成一致。",
    done: "已导入并打开：{citekey}"
  },
  en: {
    missingCitekey: "Citekey Import Bridge: the link has no citekey.",
    noIntegration:
      "Zotero Integration is not installed or not enabled. Install and enable it under Settings → Community plugins.",
    noRunImport:
      "This version of Zotero Integration does not support external imports (no runImport). Update Zotero Integration or open an issue on this project's GitHub.",
    noFormat:
      "Zotero Integration has no Import Format named \"{format}\". Available: {names}. Change the format name in Zotero's Citekey Bridge settings, or create it in Zotero Integration.",
    noFormatAtAll:
      "Zotero Integration has no Import Formats yet. Add one named \"{format}\" under Settings → Zotero Integration → Import Formats.",
    importFailed: "Import failed: {message}\n\nCommon causes: Zotero is not running, or Better BibTeX is not installed.",
    notOpened: "Imported, but could not find the note: {path}\nCheck the Import Format's Output Path.",
    pathMismatch:
      "Heads-up: Zotero expects the note at {zotero}, but Zotero Integration's Output Path produced {obsidian}. Zotero's \"Open Obsidian Note\" will not find the file until the folders match.",
    done: "Imported and opened: {citekey}"
  }
};

function language() {
  try {
    // getLanguage() exists from Obsidian 1.8; older versions set moment's
    // locale to the UI language.
    const lang =
      (typeof obsidian.getLanguage === "function"
        ? obsidian.getLanguage()
        : obsidian.moment.locale()) || "";
    return lang.toLowerCase().startsWith("zh") ? "zh" : "en";
  } catch (error) {
    return "en";
  }
}

function t(key, vars = {}) {
  const table = STRINGS[language()] || STRINGS.en;
  const template = table[key] ?? STRINGS.en[key] ?? key;
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    name in vars ? String(vars[name]) : match
  );
}

function toMarkdownPath(path) {
  const text = String(path || "").trim();
  if (!text) {
    return "";
  }
  const withExt = /\.md$/i.test(text) ? text : `${text}.md`;
  return normalizePath(withExt).replace(/^\/+/, "");
}

module.exports = class CitekeyImportBridge extends Plugin {
  onload() {
    this.registerObsidianProtocolHandler("zotero-note", (params) =>
      this.handleImport(params)
    );
  }

  async handleImport(params) {
    const citekey = String(params.citekey || "").trim().replace(/^@/, "");
    if (!citekey) {
      new Notice(t("missingCitekey"), 8000);
      return;
    }

    const formatName = String(params.format || DEFAULT_FORMAT).trim();
    const parsedLibrary = Number(params.library || 1);
    const library = Number.isFinite(parsedLibrary) ? parsedLibrary : 1;

    const integration = this.getZoteroIntegration();
    if (!integration) {
      new Notice(t("noIntegration"), 10000);
      return;
    }
    if (typeof integration.runImport !== "function") {
      new Notice(t("noRunImport"), 10000);
      return;
    }

    const format = this.findFormat(integration, formatName);
    if (format === null) {
      return;
    }

    try {
      await integration.runImport(formatName, citekey, library);
    } catch (error) {
      console.error("Citekey Import Bridge: import failed", error);
      const message = error instanceof Error ? error.message : String(error);
      new Notice(t("importFailed", { message }), 10000);
      return;
    }

    const requestedPath = toMarkdownPath(params.file);
    const outputPath = this.outputPathFor(format, citekey);
    const filePath =
      outputPath ||
      requestedPath ||
      toMarkdownPath(`${DEFAULT_NOTE_FOLDER}/${citekey}`);

    const opened = await this.openNote(filePath);
    if (!opened) {
      new Notice(t("notOpened", { path: filePath }), 10000);
      return;
    }

    if (requestedPath && outputPath && requestedPath !== outputPath) {
      new Notice(
        t("pathMismatch", { zotero: requestedPath, obsidian: outputPath }),
        15000
      );
      return;
    }

    new Notice(t("done", { citekey }));
  }

  getZoteroIntegration() {
    const plugins = this.app.plugins;
    return (
      plugins.getPlugin?.(ZOTERO_INTEGRATION_ID) ||
      plugins.plugins?.[ZOTERO_INTEGRATION_ID] ||
      null
    );
  }

  /**
   * Returns the format object, undefined when the settings shape is unknown
   * (let runImport decide), or null after showing a "not found" notice.
   */
  findFormat(integration, name) {
    const formats = integration.settings?.exportFormats;
    if (!Array.isArray(formats)) {
      return undefined;
    }
    const format = formats.find((entry) => entry?.name === name);
    if (format) {
      return format;
    }
    const names = formats.map((entry) => `"${entry?.name}"`).join(", ");
    new Notice(
      names
        ? t("noFormat", { format: name, names })
        : t("noFormatAtAll", { format: name }),
      15000
    );
    return null;
  }

  /** Resolves the Output Path when it only uses {{citekey}}. */
  outputPathFor(format, citekey) {
    const template = String(format?.outputPathTemplate || "");
    if (!template) {
      return "";
    }
    const resolved = template.replace(/\{\{\s*citekey\s*\}\}/g, citekey);
    if (resolved.includes("{{") || resolved.includes("{%")) {
      return "";
    }
    return toMarkdownPath(resolved);
  }

  async openNote(filePath) {
    for (let attempt = 0; attempt <= FILE_LOOKUP_RETRIES; attempt += 1) {
      const file = this.app.vault.getAbstractFileByPath(filePath);
      if (file instanceof TFile) {
        // Zotero Integration may already have opened it ("Open note after import").
        const existing = this.app.workspace
          .getLeavesOfType("markdown")
          .find((leaf) => leaf.view?.file?.path === file.path);
        if (existing) {
          this.app.workspace.setActiveLeaf(existing, { focus: true });
        } else {
          await this.app.workspace.getLeaf("tab").openFile(file);
        }
        return true;
      }
      if (attempt < FILE_LOOKUP_RETRIES) {
        await new Promise((resolve) =>
          setTimeout(resolve, FILE_LOOKUP_INTERVAL_MS)
        );
      }
    }
    return false;
  }
};
