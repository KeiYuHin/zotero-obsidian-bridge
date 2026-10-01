const { Notice, Plugin, TFile, normalizePath } = require("obsidian");

const DEFAULT_NOTE_FOLDER = "ZoteroLib";
const FILE_LOOKUP_RETRIES = 20;
const FILE_LOOKUP_INTERVAL_MS = 100;

module.exports = class CitekeyImportBridge extends Plugin {
  onload() {
    this.registerObsidianProtocolHandler(
      "zotero-note",
      async (params) => {
        const citekey = String(params.citekey || "")
          .trim()
          .replace(/^@/, "");

        const format = String(params.format || "Paper Note").trim();

        const parsedLibrary = Number(params.library || 1);
        const library = Number.isFinite(parsedLibrary)
          ? parsedLibrary
          : 1;

        const filePath = this.getImportedNotePath(
          params.file,
          citekey
        );

        if (!citekey) {
          new Notice("Missing citekey parameter");
          return;
        }

        try {
          const pluginManager = this.app.plugins;

          const zoteroIntegration =
            pluginManager.getPlugin?.(
              "obsidian-zotero-desktop-connector"
            ) ||
            pluginManager.plugins?.[
              "obsidian-zotero-desktop-connector"
            ];

          if (!zoteroIntegration) {
            throw new Error("Zotero Integration plugin not found");
          }

          if (typeof zoteroIntegration.runImport !== "function") {
            throw new Error(
              "Current Zotero Integration does not have a usable runImport method"
            );
          }

          await zoteroIntegration.runImport(
            format,
            citekey,
            library
          );

          const opened = await this.openImportedNote(filePath);

          if (!opened) {
            new Notice(
              `Imported reference, but could not open note: ${filePath}`,
              8000
            );
            return;
          }

          new Notice(`Successfully imported and opened: ${citekey}`);
        } catch (error) {
          console.error("Citekey import failed:", error);

          const message =
            error instanceof Error
              ? error.message
              : String(error);

          new Notice(`Reference import failed: ${message}`, 8000);
        }
      }
    );
  }

  getImportedNotePath(requestedPath, citekey) {
    const fallbackPath = `${DEFAULT_NOTE_FOLDER}/${citekey}`;
    const path = String(requestedPath || fallbackPath).trim();
    const markdownPath = /\.md$/i.test(path) ? path : `${path}.md`;

    return normalizePath(markdownPath).replace(/^\/+/, "");
  }

  async openImportedNote(filePath) {
    for (let attempt = 0; attempt <= FILE_LOOKUP_RETRIES; attempt += 1) {
      const file = this.app.vault.getAbstractFileByPath(filePath);

      if (file instanceof TFile) {
        await this.app.workspace.getLeaf(true).openFile(file);
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
