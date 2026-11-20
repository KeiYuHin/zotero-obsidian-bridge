var ZoteroObsidianCitekeyLink = {
	TITLE: "Zotero Citekey Bridge",
	MENU_PREFIX: "zotero-obsidian-citekey-link",
	PREF_PREFIX: "extensions.zotero-citekey-bridge.",
	EXTRA_LABEL: "Obsidian Link",
	CREATE_BASE_URL: "obsidian://zotero-note",
	windows: new Map(),

	DEFAULTS: Object.freeze({
		vaultName: "ObsidianVault",
		folder: "ZoteroLib",
		format: "Paper Note"
	}),

	STRINGS: {
		zh: {
			menuCreate: "创建并关联 Obsidian 笔记",
			menuOpen: "打开 Obsidian 笔记",
			menuDelete: "删除已保存的 Obsidian 链接",
			prefsLabel: "Citekey Bridge",
			needOneItem: "请只选中一条普通文献条目后再执行。\n\n附件、笔记和多选都不支持。",
			alreadyLinked: "这条文献已经关联过 Obsidian 笔记，已停止，避免重复创建。\n\n" +
				"想直接打开：右键 →“打开 Obsidian 笔记”。\n" +
				"想重新生成：先右键 →“删除已保存的 Obsidian 链接”，再创建。",
			noCitekey: "这条文献没有 citation key。\n\n" +
				"请确认已安装并启用 Better BibTeX。在条目信息面板里应能看到 Citation Key。",
			created: "已发送到 Obsidian：{citekey}\n如果 Obsidian 没有反应，见文档“常见问题”。",
			noLinkToDelete: "这条文献没有保存 Obsidian 链接，无需删除。",
			confirmDelete: "确定删除这条文献保存的 Obsidian 链接吗？\n\n" +
				"只删除 Extra 里的“Obsidian Link:”这一行，不会删除 Obsidian 里的笔记。删除后可以重新创建。",
			deleted: "已删除。现在可以重新执行“创建并关联 Obsidian 笔记”。",
			noLinkToOpen: "这条文献还没有关联 Obsidian 笔记。\n\n请先右键 →“创建并关联 Obsidian 笔记”。",
			onlyObsidian: "只允许打开 obsidian:// 链接，收到的是：{scheme}",
			noHandler: "系统里找不到 Obsidian。\n\n请先安装 Obsidian 桌面版，并至少打开过一次。",
			failed: "{action} 失败：\n\n{message}",
			prefTitle: "Zotero Citekey Bridge 设置",
			prefIntro: "下面三项要和你的 Obsidian 设置对应。不确定就保持默认，并在 Obsidian 里按默认名字配置。",
			prefVault: "Obsidian 库名（Vault）",
			prefVaultHint: "Obsidian 左下角显示的库名，区分大小写。",
			prefFolder: "文献笔记文件夹",
			prefFolderHint: "库里存放文献笔记的文件夹，例如 ZoteroLib。子文件夹用 / 分隔。",
			prefFormat: "导入格式名（Import format）",
			prefFormatHint: "Zotero Integration 设置里 Import Formats 的 Name。",
			prefMatchTitle: "在 Obsidian 中需要这样设置",
			prefMatchIntro: "打开 Obsidian → 设置 → Zotero Integration → Import Formats，确认有一项：",
			prefMatchName: "Name：",
			prefMatchPath: "Output Path：",
			prefTest: "测试：在 Obsidian 中打开这个库",
			prefReset: "恢复默认",
			prefTestHint: "Obsidian 应打开名为“{vault}”的库。如果提示找不到库，说明库名填错了。"
		},
		en: {
			menuCreate: "Create and Link Obsidian Note",
			menuOpen: "Open Obsidian Note",
			menuDelete: "Remove Saved Obsidian Link",
			prefsLabel: "Citekey Bridge",
			needOneItem: "Select exactly one regular item first.\n\nAttachments, notes, and multiple selections are not supported.",
			alreadyLinked: "This item is already linked to an Obsidian note, so nothing was created.\n\n" +
				"To open it: right-click → \"Open Obsidian Note\".\n" +
				"To recreate it: right-click → \"Remove Saved Obsidian Link\" first, then create again.",
			noCitekey: "This item has no citation key.\n\n" +
				"Make sure Better BibTeX is installed and enabled. The item pane should show a Citation Key.",
			created: "Sent to Obsidian: {citekey}\nIf Obsidian does not react, see Troubleshooting in the docs.",
			noLinkToDelete: "This item has no saved Obsidian link.",
			confirmDelete: "Remove the saved Obsidian link from this item?\n\n" +
				"Only the \"Obsidian Link:\" line in Extra is removed. The note in Obsidian is not deleted. You can create the link again afterwards.",
			deleted: "Removed. You can now run \"Create and Link Obsidian Note\" again.",
			noLinkToOpen: "This item is not linked to an Obsidian note yet.\n\nRight-click → \"Create and Link Obsidian Note\" first.",
			onlyObsidian: "Only obsidian:// links can be opened, received: {scheme}",
			noHandler: "Obsidian was not found on this computer.\n\nInstall the Obsidian desktop app and open it at least once.",
			failed: "{action} failed:\n\n{message}",
			prefTitle: "Zotero Citekey Bridge Settings",
			prefIntro: "These three values must match your Obsidian setup. If unsure, keep the defaults and use the same names in Obsidian.",
			prefVault: "Obsidian vault name",
			prefVaultHint: "The vault name shown at the bottom left of Obsidian. Case-sensitive.",
			prefFolder: "Literature note folder",
			prefFolderHint: "Folder inside the vault that holds literature notes, e.g. ZoteroLib. Use / for subfolders.",
			prefFormat: "Import format name",
			prefFormatHint: "The Name of an Import Format in Zotero Integration's settings.",
			prefMatchTitle: "Required setup in Obsidian",
			prefMatchIntro: "Open Obsidian → Settings → Zotero Integration → Import Formats and make sure one entry has:",
			prefMatchName: "Name:",
			prefMatchPath: "Output Path:",
			prefTest: "Test: open this vault in Obsidian",
			prefReset: "Restore defaults",
			prefTestHint: "Obsidian should open the vault \"{vault}\". If it says the vault was not found, the name is wrong."
		}
	},

	init({ id, version, rootURI }) {
		this.id = id;
		this.version = version;
		this.rootURI = rootURI;
		this.lang = String(Zotero.locale || "").toLowerCase().startsWith("zh")
			? "zh"
			: "en";
	},

	t(key, vars = {}) {
		const table = this.STRINGS[this.lang] || this.STRINGS.en;
		const template = table[key] ?? this.STRINGS.en[key] ?? key;
		return template.replace(/\{(\w+)\}/g, (match, name) =>
			name in vars ? String(vars[name]) : match
		);
	},

	// ---------- Settings ----------

	getPref(name) {
		const value = Zotero.Prefs.get(this.PREF_PREFIX + name, true);
		const text = typeof value === "string" ? value.trim() : "";
		return text || this.DEFAULTS[name];
	},

	setPref(name, value) {
		let text = String(value ?? "").trim();
		if (name === "folder") {
			text = this.normalizeFolder(text);
		}
		if (!text || text === this.DEFAULTS[name]) {
			Zotero.Prefs.clear(this.PREF_PREFIX + name, true);
		}
		else {
			Zotero.Prefs.set(this.PREF_PREFIX + name, text, true);
		}
	},

	normalizeFolder(value) {
		return String(value || "")
			.replace(/\\/g, "/")
			.replace(/\/{2,}/g, "/")
			.replace(/^\/+|\/+$/g, "")
			.trim();
	},

	get config() {
		return {
			vaultName: this.getPref("vaultName"),
			folder: this.normalizeFolder(this.getPref("folder")),
			format: this.getPref("format")
		};
	},

	registerPrefsPane() {
		return Zotero.PreferencePanes.register({
			pluginID: this.id,
			src: this.rootURI + "preferences.xhtml",
			label: this.t("prefsLabel")
		});
	},

	initPrefsPane(win) {
		const doc = win.document;
		const $ = (id) => doc.getElementById(id);
		if (!$("zcb-vault") || $("zcb-vault").dataset.ready) {
			return;
		}
		$("zcb-vault").dataset.ready = "1";

		const text = {
			"zcb-title": "prefTitle",
			"zcb-intro": "prefIntro",
			"zcb-vault-label": "prefVault",
			"zcb-vault-hint": "prefVaultHint",
			"zcb-folder-label": "prefFolder",
			"zcb-folder-hint": "prefFolderHint",
			"zcb-format-label": "prefFormat",
			"zcb-format-hint": "prefFormatHint",
			"zcb-match-title": "prefMatchTitle",
			"zcb-match-intro": "prefMatchIntro",
			"zcb-match-name-label": "prefMatchName",
			"zcb-match-path-label": "prefMatchPath"
		};
		for (const [id, key] of Object.entries(text)) {
			$(id).textContent = this.t(key);
		}
		$("zcb-test").setAttribute("label", this.t("prefTest"));
		$("zcb-reset").setAttribute("label", this.t("prefReset"));

		const fields = {
			vaultName: $("zcb-vault"),
			folder: $("zcb-folder"),
			format: $("zcb-format")
		};

		const refresh = () => {
			const config = this.config;
			for (const [name, input] of Object.entries(fields)) {
				if (doc.activeElement !== input) {
					input.value = config[name];
				}
				input.placeholder = this.DEFAULTS[name];
			}
			$("zcb-match-name").textContent = config.format;
			$("zcb-match-path").textContent = `${config.folder}/{{citekey}}.md`;
		};

		for (const [name, input] of Object.entries(fields)) {
			input.addEventListener("input", () => {
				this.setPref(name, input.value);
				refresh();
			});
			input.addEventListener("change", () => {
				this.setPref(name, input.value);
				input.value = this.config[name];
				refresh();
			});
		}

		$("zcb-test").addEventListener("command", () => {
			const vault = this.config.vaultName;
			try {
				this.launchObsidianURL(
					"obsidian://open?vault=" + encodeURIComponent(vault)
				);
				// Show the hint inside the pane: a ProgressWindow opened from the
				// settings window stays on screen once focus moves to Obsidian.
				$("zcb-test-status").textContent = this.t("prefTestHint", { vault });
			}
			catch (error) {
				this.handleError(win, this.t("prefTest"), error);
			}
		});

		$("zcb-reset").addEventListener("command", () => {
			for (const name of Object.keys(fields)) {
				this.setPref(name, "");
			}
			refresh();
		});

		refresh();
	},

	// ---------- Menu ----------

	addToAllWindows() {
		for (const win of Zotero.getMainWindows()) {
			if (win?.ZoteroPane) {
				this.addToWindow(win);
			}
		}
	},

	removeFromAllWindows() {
		for (const win of [...this.windows.keys()]) {
			this.removeFromWindow(win);
		}
	},

	addToWindow(win) {
		if (!win?.document || this.windows.has(win)) {
			return;
		}

		const doc = win.document;
		const popup = doc.getElementById("zotero-itemmenu");
		if (!popup) {
			Zotero.debug("Zotero Citekey Bridge: #zotero-itemmenu not found");
			return;
		}

		const separator = typeof doc.createXULElement === "function"
			? doc.createXULElement("menuseparator")
			: doc.createElement("menuseparator");
		separator.id = `${this.MENU_PREFIX}-separator`;

		const createItem = this.makeMenuItem(
			win,
			`${this.MENU_PREFIX}-create`,
			this.t("menuCreate"),
			() => this.createAndLink(win, this.requireSelectedRegularItem(win))
		);
		const openItem = this.makeMenuItem(
			win,
			`${this.MENU_PREFIX}-open`,
			this.t("menuOpen"),
			() => this.openStoredLink(win, this.requireSelectedRegularItem(win))
		);
		const deleteItem = this.makeMenuItem(
			win,
			`${this.MENU_PREFIX}-delete`,
			this.t("menuDelete"),
			() => this.deleteStoredLink(win, this.requireSelectedRegularItem(win))
		);

		const items = [createItem, openItem, deleteItem];
		popup.append(separator, ...items);

		const onPopupShowing = () => {
			const item = this.getSelectedRegularItem(win);
			const linked = Boolean(item && this.getStoredLink(item));
			const state = new Map([
				[createItem, Boolean(item)],
				[openItem, linked],
				[deleteItem, linked]
			]);
			for (const [element, enabled] of state) {
				if (enabled) {
					element.removeAttribute("disabled");
				}
				else {
					element.setAttribute("disabled", "true");
				}
			}
		};

		popup.addEventListener("popupshowing", onPopupShowing);
		this.windows.set(win, {
			popup,
			onPopupShowing,
			elements: [separator, ...items]
		});
	},

	removeFromWindow(win) {
		const state = this.windows.get(win);
		if (!state) {
			return;
		}
		state.popup?.removeEventListener("popupshowing", state.onPopupShowing);
		for (const element of state.elements) {
			element?.remove();
		}
		this.windows.delete(win);
	},

	// ---------- Reader menus ----------

	// Two entry points while reading a PDF/EPUB/snapshot:
	// - right-click on the reader tab (Zotero 8+, Zotero.MenuManager "main/tab")
	// - right-click inside the document view (Zotero 7+, Zotero.Reader event)
	registerReaderMenus() {
		this.registerTabMenu();
		this.registerViewMenu();
	},

	unregisterReaderMenus() {
		if (this.tabMenuID) {
			try {
				Zotero.MenuManager?.unregisterMenu(this.tabMenuID);
			}
			catch (error) {
				Zotero.logError(error);
			}
			this.tabMenuID = null;
		}
		if (this.viewMenuHandler) {
			Zotero.Reader?.unregisterEventListener?.(
				"createViewContextMenu",
				this.viewMenuHandler
			);
			this.viewMenuHandler = null;
		}
	},

	registerTabMenu() {
		if (typeof Zotero.MenuManager?.registerMenu !== "function") {
			return;
		}

		const contextItem = (context) => {
			try {
				return context.tabType === "reader"
					? this.resolveRegularItem(context.items?.[0])
					: null;
			}
			catch (error) {
				return null;
			}
		};
		// Labels are set here instead of through Fluent, so the plugin needs no .ftl files.
		const showWhen = (key, wantLinked) => (event, context) => {
			const item = contextItem(context);
			const visible = Boolean(item) && Boolean(this.getStoredLink(item)) === wantLinked;
			context.menuElem?.setAttribute("label", this.t(key));
			context.setVisible(visible);
		};
		const run = (action) => (event, context) => {
			const win = context.menuElem?.ownerGlobal || Zotero.getMainWindow();
			const label = context.menuElem?.getAttribute("label") || "";
			Promise.resolve(action(win, contextItem(context))).catch((error) => {
				this.handleError(win, label, error);
			});
		};

		const menuID = Zotero.MenuManager.registerMenu({
			menuID: `${this.MENU_PREFIX}-tab`,
			pluginID: this.id,
			target: "main/tab",
			menus: [
				{
					menuType: "separator",
					onShowing: (event, context) => context.setVisible(Boolean(contextItem(context)))
				},
				{
					menuType: "menuitem",
					onShowing: showWhen("menuOpen", true),
					onCommand: run((win, item) => this.openStoredLink(win, item))
				},
				{
					menuType: "menuitem",
					onShowing: showWhen("menuCreate", false),
					onCommand: run((win, item) => this.createAndLink(win, item))
				}
			]
		});
		this.tabMenuID = menuID || null;
	},

	registerViewMenu() {
		if (typeof Zotero.Reader?.registerEventListener !== "function") {
			return;
		}

		this.viewMenuHandler = (event) => {
			const { reader, append } = event;
			const item = this.itemFromID(reader?.itemID);
			if (!item) {
				return;
			}
			const win = reader._window || Zotero.getMainWindow();
			const linked = Boolean(this.getStoredLink(item));
			const label = this.t(linked ? "menuOpen" : "menuCreate");
			append({
				label,
				onCommand: () => {
					const action = linked
						? this.openStoredLink(win, item)
						: this.createAndLink(win, item);
					Promise.resolve(action).catch((error) => {
						this.handleError(win, label, error);
					});
				}
			});
		};
		Zotero.Reader.registerEventListener(
			"createViewContextMenu",
			this.viewMenuHandler,
			this.id
		);
	},

	makeMenuItem(win, id, label, callback) {
		const doc = win.document;
		const menuItem = typeof doc.createXULElement === "function"
			? doc.createXULElement("menuitem")
			: doc.createElement("menuitem");

		menuItem.id = id;
		menuItem.setAttribute("label", label);
		menuItem.addEventListener("command", () => {
			Promise.resolve(callback()).catch((error) => {
				this.handleError(win, label, error);
			});
		});
		return menuItem;
	},

	getSelectedRegularItem(win) {
		const items = win?.ZoteroPane?.getSelectedItems?.() || [];
		if (items.length !== 1) {
			return null;
		}
		const item = items[0];
		return item?.isRegularItem?.() ? item : null;
	},

	// Reader tabs hold the attachment; the note belongs to its parent item.
	resolveRegularItem(item) {
		if (!item) {
			return null;
		}
		if (item.isRegularItem?.()) {
			return item;
		}
		const parent = item.parentItem;
		return parent?.isRegularItem?.() ? parent : null;
	},

	itemFromID(itemID) {
		return itemID ? this.resolveRegularItem(Zotero.Items.get(itemID)) : null;
	},

	requireSelectedRegularItem(win) {
		const item = this.getSelectedRegularItem(win);
		if (!item) {
			this.alert(win, this.t("needOneItem"));
		}
		return item;
	},

	// ---------- Actions ----------

	async createAndLink(win, item) {
		if (!item) {
			return;
		}

		if (this.getStoredLink(item)) {
			this.alert(win, this.t("alreadyLinked"));
			return;
		}

		const citekey = await this.getCitationKey(item);
		if (!citekey) {
			this.alert(win, this.t("noCitekey"));
			return;
		}

		// If launching throws, the link is not written back.
		this.launchObsidianURL(this.buildCreateURL(citekey));
		await this.setStoredLink(item, this.buildOpenURL(citekey));

		this.notify(this.t("created", { citekey }), 3500);
	},

	async deleteStoredLink(win, item) {
		if (!item) {
			return;
		}

		if (!this.getStoredLink(item)) {
			this.alert(win, this.t("noLinkToDelete"));
			return;
		}

		if (!Services.prompt.confirm(win, this.TITLE, this.t("confirmDelete"))) {
			return;
		}

		item.setField("extra", this.removeLinkLines(item.getField("extra")));
		await item.saveTx();
		this.alert(win, this.t("deleted"));
	},

	async openStoredLink(win, item) {
		if (!item) {
			return;
		}

		const link = this.getStoredLink(item);
		if (!link) {
			this.alert(win, this.t("noLinkToOpen"));
			return;
		}
		this.launchObsidianURL(link);
	},

	launchObsidianURL(url) {
		const schemeMatch = String(url || "").match(/^([a-z][a-z0-9+.-]+):/i);
		const scheme = schemeMatch?.[1]?.toLowerCase();
		if (scheme !== "obsidian") {
			throw new Error(this.t("onlyObsidian", { scheme: scheme || "?" }));
		}

		const service = Components.classes[
			"@mozilla.org/uriloader/external-protocol-service;1"
		].getService(Components.interfaces.nsIExternalProtocolService);

		const found = {};
		const handlerInfo = service.getProtocolHandlerInfoFromOS(scheme, found);
		if (!found.value) {
			throw new Error(this.t("noHandler"));
		}

		// Skip Zotero's "Allow this site to open the obsidian link?" prompt.
		handlerInfo.preferredAction =
			Components.interfaces.nsIHandlerInfo.useSystemDefault;
		handlerInfo.alwaysAskBeforeHandling = false;

		if (!Zotero.isWin) {
			Zotero.Utilities.Internal.Environment.clearMozillaVariables();
		}

		const uri = Services.io.newURI(url, null, null);
		if (typeof handlerInfo.launchWithURI === "function") {
			handlerInfo.launchWithURI(uri, null);
			return;
		}

		// Fallback for platforms where launchWithURI is unavailable.
		Services.prefs.setBoolPref(
			`network.protocol-handler.warn-external.${scheme}`,
			false
		);
		Services.prefs.setBoolPref(
			`network.protocol-handler.external.${scheme}`,
			true
		);
		service.loadURI(uri, Services.scriptSecurityManager.getSystemPrincipal());
	},

	notify(message, timeout = 3500) {
		try {
			const progressWindow = new Zotero.ProgressWindow({ closeOnClick: true });
			progressWindow.changeHeadline(this.TITLE);
			progressWindow.addDescription(String(message));
			progressWindow.show();
			progressWindow.startCloseTimer(timeout);
		}
		catch (error) {
			Zotero.logError(error);
		}
	},

	// ---------- Citation key ----------

	async getCitationKey(item) {
		// Zotero 8+: native citationKey field.
		try {
			const nativeKey = this.cleanCitationKey(item.getField("citationKey"));
			if (nativeKey) {
				return nativeKey;
			}
		}
		catch (error) {
			// Zotero 7 has no native field.
		}

		// Better BibTeX.
		try {
			const bbt = Zotero.BetterBibTeX;
			if (bbt?.ready && typeof bbt.ready.then === "function") {
				await bbt.ready;
			}
			const record = bbt?.KeyManager?.get?.(item.id);
			const bbtKey = this.cleanCitationKey(record?.citationKey || record?.citekey);
			if (bbtKey) {
				return bbtKey;
			}
		}
		catch (error) {
			Zotero.debug("Zotero Citekey Bridge: Better BibTeX key lookup failed");
			Zotero.logError(error);
		}

		// Keys kept in Extra.
		const extra = String(item.getField("extra") || "");
		const match = extra.match(
			/^\s*(?:Citation Key|citation-key|citationKey)\s*:\s*(.+?)\s*$/mi
		);
		return this.cleanCitationKey(match?.[1]);
	},

	cleanCitationKey(value) {
		return String(value || "").trim().replace(/^@/, "");
	},

	// ---------- URLs and the Extra field ----------

	notePath(citekey) {
		const { folder } = this.config;
		return folder ? `${folder}/${citekey}` : citekey;
	},

	buildCreateURL(citekey) {
		const { vaultName, format } = this.config;
		return (
			`${this.CREATE_BASE_URL}?vault=${encodeURIComponent(vaultName)}` +
			`&citekey=${encodeURIComponent(citekey)}` +
			`&file=${encodeURIComponent(this.notePath(citekey))}` +
			`&format=${encodeURIComponent(format)}`
		);
	},

	buildOpenURL(citekey) {
		return (
			"obsidian://open?vault=" +
			encodeURIComponent(this.config.vaultName) +
			"&file=" +
			encodeURIComponent(this.notePath(citekey)) +
			"&paneType=tab"
		);
	},

	linkLinePattern(flags) {
		const label = this.escapeRegExp(this.EXTRA_LABEL);
		return new RegExp(
			`^\\s*${label}\\s*:\\s*(obsidian:\\/\\/open\\?[^\\r\\n]+?)\\s*$`,
			flags
		);
	},

	getStoredLink(item) {
		const extra = String(item.getField("extra") || "");
		return extra.match(this.linkLinePattern("mi"))?.[1]?.trim() || "";
	},

	async setStoredLink(item, url) {
		const lines = this.removeLinkLines(item.getField("extra"));
		const next = lines ? `${lines}\n${this.EXTRA_LABEL}: ${url}` : `${this.EXTRA_LABEL}: ${url}`;
		item.setField("extra", next);
		await item.saveTx();
	},

	removeLinkLines(extra) {
		const pattern = this.linkLinePattern("i");
		const lines = String(extra || "")
			.replace(/\r\n/g, "\n")
			.split("\n")
			.filter((line) => !pattern.test(line));

		while (lines.length && !lines[lines.length - 1].trim()) {
			lines.pop();
		}
		return lines.join("\n");
	},

	escapeRegExp(value) {
		return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	},

	// ---------- Dialogs ----------

	alert(win, message) {
		try {
			Services.prompt.alert(win, this.TITLE, String(message));
		}
		catch (error) {
			win.alert(`${this.TITLE}\n\n${message}`);
		}
	},

	handleError(win, action, error) {
		Zotero.debug(`Zotero Citekey Bridge: ${action} failed`);
		Zotero.logError(error);
		this.alert(
			win,
			this.t("failed", { action, message: error?.message || String(error) })
		);
	}
};
