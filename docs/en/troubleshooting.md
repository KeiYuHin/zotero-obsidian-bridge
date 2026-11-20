# Troubleshooting

Find the section that matches what you see. Most problems come from three places: **Zotero isn't running**, **the names on the two sides don't match**, or **Zotero Integration itself isn't set up correctly**.

> 中文版见 [常见问题](../zh/troubleshooting.md)。

- [The menu items are missing](#the-menu-items-are-missing)
- [The menu items are greyed out](#the-menu-items-are-greyed-out)
- [The context menu shows two sets of items](#the-context-menu-shows-two-sets-of-items)
- ["This item has no citation key"](#this-item-has-no-citation-key)
- [I clicked "Create", but Obsidian doesn't react](#i-clicked-create-but-obsidian-doesnt-react)
- [Obsidian can't find the vault, or opens a different vault](#obsidian-cant-find-the-vault-or-opens-a-different-vault)
- [Obsidian says Zotero Integration is not installed](#obsidian-says-zotero-integration-is-not-installed)
- [Obsidian says there is no Import Format named "…"](#obsidian-says-there-is-no-import-format-named-)
- [Obsidian says the import failed](#obsidian-says-the-import-failed)
- [Manual import with Zotero Integration fails](#manual-import-with-zotero-integration-fails)
- [Obsidian warns that the two paths don't match](#obsidian-warns-that-the-two-paths-dont-match)
- ["Open Obsidian Note" opens a blank page or creates an empty note](#open-obsidian-note-opens-a-blank-page-or-creates-an-empty-note)
- ["Already linked", but I want to regenerate the note](#already-linked-but-i-want-to-regenerate-the-note)
- [Will regenerating overwrite what I wrote?](#will-regenerating-overwrite-what-i-wrote)
- [Zotero asks "Allow this site to open the obsidian link?"](#zotero-asks-allow-this-site-to-open-the-obsidian-link)
- [Still stuck: how to see the error messages](#still-stuck-how-to-see-the-error-messages)

---

### The menu items are missing

- **The plugin isn't installed or is disabled.** In Zotero → Tools → Plugins, make sure Zotero Citekey Bridge is listed and enabled. Restarting Zotero once after installing can help.
- **You right-clicked in the wrong place.** The menu appears when you right-click an **item** in the middle item list, not a collection on the left.
- **In the PDF reader:**
  - Right-clicking the **tab** needs Zotero 8 or later. On Zotero 7, right-click the PDF page instead.
  - A PDF with no parent item (a standalone PDF dragged straight into Zotero) shows no menu. In the item list, right-click the PDF → **Create Parent Item…**, then try again.
  - The reader has no "Remove Saved Obsidian Link". Go back to the item list and right-click the item.

### The menu items are greyed out

- **All three are grey**: what you selected is not a single regular item. Multiple selections, attachments (PDFs), and standalone notes aren't supported. Select just one item and try again.
- **Only "Open" and "Remove" are grey**: this item isn't linked to a note yet. Use "Create and Link Obsidian Note" first.

### The context menu shows two sets of items

An old version of the plugin is still installed. In Zotero → Tools → Plugins, remove the old plugin with a name like `zotero-obsidian-citekey-link`, and keep only **Zotero Citekey Bridge**.

### "This item has no citation key"

Better BibTeX isn't installed correctly. See [Install guide step 1](install.md#1-zotero-install-better-bibtex). Once it works, the Zotero item pane shows `Citation Key`.

### I clicked "Create", but Obsidian doesn't react

1. **Obsidian isn't installed, or has never been opened.** Install the Obsidian desktop app and open it at least once, so the system learns about `obsidian://` links.
2. **Check whether the system can open Obsidian links.** Zotero → Settings → Citekey Bridge → click **Test: open this vault in Obsidian**. If nothing happens, the problem is at the system level; work or school computers may block external protocols.
3. **Obsidian comes up, but no note is created and no message appears.** Make sure Citekey Import Bridge is enabled ([Install guide step 6](install.md#6-obsidian-install-citekey-import-bridge)).

Note: "Sent to Obsidian" at the bottom right of Zotero only means the link was sent, not that the note was created. The message at the top right of Obsidian tells you the result.

### Obsidian can't find the vault, or opens a different vault

The vault name in Zotero doesn't match the vault name in Obsidian. Look at the vault name at the bottom left of Obsidian and enter it exactly in Zotero → Settings → Citekey Bridge → **Obsidian vault name**, matching case and spaces.

After the change, items that were already linked need their link removed and created again. See [Customization: items linked before you changed the settings](customize.md#items-linked-before-you-changed-the-settings).

### Obsidian says Zotero Integration is not installed

Install and enable Zotero Integration under Obsidian Settings → Community plugins. See [Install guide step 3](install.md#3-obsidian-install-zotero-integration).

### Obsidian says there is no Import Format named "…"

The message lists the import formats you have. Either:

- change Zotero → Settings → Citekey Bridge → **Import format name** to one of the listed names, or
- create an import format with that name in Obsidian's Zotero Integration settings ([Install guide step 5](install.md#5-obsidian-create-the-import-format-paper-note)).

### Obsidian says the import failed

The most common causes:

- **Zotero isn't running.** The import reads data from Zotero, so Zotero must be open.
- **Better BibTeX isn't installed or enabled.**
- **The template path is wrong.** The file the Import Format's Template File points to was moved or renamed.

Test Zotero Integration on its own first, as described in the next section.

### Manual import with Zotero Integration fails

Then the problem is in the Zotero Integration setup, not in this project. Check each of these:

1. Zotero is running, and Better BibTeX is installed.
2. Obsidian Settings → Zotero Integration → **Database** is set to `Zotero`.
3. The template file that the Import Format's **Template File** points to exists.
4. The template is complete and starts with `---`. When copying from GitHub, copy from the Raw page.

Once the manual import works, come back to the context menu.

### Obsidian warns that the two paths don't match

The note was created, but the folder set in Zotero doesn't match the Import Format's Output Path, so "Open Obsidian Note" in Zotero won't find the file later.

As the warning says, change Zotero → Settings → Citekey Bridge → **Literature note folder** to match the Output Path. Then, for this item: right-click → Remove Saved Obsidian Link → Create and Link Obsidian Note again.

### "Open Obsidian Note" opens a blank page or creates an empty note

The path saved in Zotero doesn't match where the note actually is. Usually the folder or vault name was changed, or the note was moved or renamed by hand.

Fix: right-click → Remove Saved Obsidian Link → Create and Link Obsidian Note.

### "Already linked", but I want to regenerate the note

This protects against creating duplicates. Right-click → **Remove Saved Obsidian Link**, then **Create and Link Obsidian Note**. Removing the link does not delete the note in Obsidian.

### Will regenerating overwrite what I wrote?

Anything between `%% begin paper-notes %%` and `%% end paper-notes %%` is kept. Anything outside is overwritten by the template. See the [Template guide](template/README.md#the-four-parts-of-the-template).

### Zotero asks "Allow this site to open the obsidian link?"

The plugin is set up to skip this prompt, so normally it doesn't appear. If it does, tick "Always use Obsidian to open" and confirm; it won't ask again.

### Still stuck: how to see the error messages

- **Zotero**: Help → Debug Output Logging → Enable, reproduce the problem once, then click View Output. Search for `Zotero Citekey Bridge`.
- **Obsidian**: press `Ctrl+Shift+I` (`Cmd+Option+I` on macOS) to open the developer tools, switch to the Console tab, reproduce the problem once, and look for red errors.

When asking on [GitHub Issues](https://github.com/KeiYuHin/zotero-obsidian-bridge/issues), please include: your Zotero, Obsidian, and Zotero Integration versions, the message text or a screenshot, and any errors you found above.
