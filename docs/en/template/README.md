# Template guide

[paper-note-template.md](../../zh/template/paper-note-template.md) is the literature note template that goes with this project. It is rendered by the Obsidian plugin Zotero Integration. To add it to your vault and attach it to an import format, see [Install guide steps 4 and 5](../install.md#4-obsidian-add-the-note-template). The template itself is language-neutral, so the same file serves both the English and Chinese docs.

The template uses Nunjucks, the syntax Zotero Integration uses: `{{ ... }}` inserts an item field, and `{% ... %}` is a control statement. For the full list of fields, see [Zotero Integration's templating docs](https://github.com/mgmeyers/obsidian-zotero-integration/blob/main/docs/Templating.md).

> 中文版见 [模板说明](../../zh/template/README.md)。

## The four parts of the template

**1. Properties (between the two opening `---` lines)**

Records the title, year, journal, citekey, DOI, and import time. Obsidian shows these as a "Properties" panel, and you can use them to search, filter, and build Dataview tables. `paperNoteTemplateVersion` is the template version, so you can tell old notes from new ones after the template changes.

**2. Title and basic information**

`# Title (Year)`, followed by the journal abbreviation and the authors.

**3. Jump links**

```markdown
[Goto Zotero](zotero://select/items/@{{citekey}}), [Goto Obsidian](obsidian://open?vault=ObsidianVault&file=ZoteroLib%2F{{citekey}}&paneType=tab), [Goto Online](https://doi.org/{{DOI}})
```

- **Goto Zotero**: selects this item in Zotero.
- **Goto Obsidian**: an external link to this note itself, which you can paste into other apps.
- **Goto Online**: opens the paper's web page through its DOI.

> If you changed the vault name or folder, also update `ObsidianVault` and `ZoteroLib` in the `Goto Obsidian` link. See [Customization](../customize.md).

**4. Your own notes**

```text
{% persist "paper-notes" %}
{% if isFirstImport %}
## Topic
...
{% endif %}
{% endpersist %}
```

This block decides **whether your notes survive a re-import**:

- Content wrapped in `{% persist "paper-notes" %}` is kept as is when the note is imported again.
- The headings inside `{% if isFirstImport %}` (Topic, Scenario, and so on) are only created on the first import and are not inserted again later.

In the generated note, this area is wrapped in two comment lines:

```markdown
%% begin paper-notes %%
## Topic
...
%% end paper-notes %%
```

**Write your notes between `%% begin paper-notes %%` and `%% end paper-notes %%`.** Anything outside is overwritten by the template on re-import. Don't delete these two comment lines either.

## Changing the template

You can freely add or remove fields and headings; the plugins don't depend on them. Just keep two things:

- Keep the `persist` block, or re-imports will overwrite your notes.
- Keep the Import Format's Output Path in the form `folder/{{citekey}}.md`. The plugins use it to find and open the note.
