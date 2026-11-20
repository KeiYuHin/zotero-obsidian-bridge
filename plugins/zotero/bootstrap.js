var ZoteroObsidianCitekeyLink;

function log(message) {
	Zotero.debug("Zotero Citekey Bridge: " + message);
}

async function startup({ id, version, rootURI }) {
	log(`Starting ${version}`);

	await Promise.all([
		Zotero.initializationPromise,
		Zotero.unlockPromise,
		Zotero.uiReadyPromise
	]);

	Services.scriptloader.loadSubScript(rootURI + "obsidian-zotero-link.js");

	ZoteroObsidianCitekeyLink.init({ id, version, rootURI });
	// The settings pane runs in its own window and reaches the plugin here.
	Zotero.CitekeyBridge = ZoteroObsidianCitekeyLink;

	try {
		await ZoteroObsidianCitekeyLink.registerPrefsPane();
	}
	catch (error) {
		log("Could not register the settings pane");
		Zotero.logError(error);
	}

	ZoteroObsidianCitekeyLink.addToAllWindows();

	try {
		ZoteroObsidianCitekeyLink.registerReaderMenus();
	}
	catch (error) {
		log("Could not register the reader menus");
		Zotero.logError(error);
	}
}

function onMainWindowLoad({ window }) {
	ZoteroObsidianCitekeyLink?.addToWindow(window);
}

function onMainWindowUnload({ window }) {
	ZoteroObsidianCitekeyLink?.removeFromWindow(window);
}

function shutdown() {
	log("Shutting down");
	ZoteroObsidianCitekeyLink?.removeFromAllWindows();
	ZoteroObsidianCitekeyLink?.unregisterReaderMenus();
	if (Zotero.CitekeyBridge === ZoteroObsidianCitekeyLink) {
		delete Zotero.CitekeyBridge;
	}
	ZoteroObsidianCitekeyLink = undefined;
}

function install() {}

function uninstall() {}
