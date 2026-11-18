---
title: "{{title}}"
year: {{date | format("YYYY")}}
publication: "{{publicationTitle}}"
citekey: {{citekey}}
key: {{key}}
DOI: "{{DOI}}"
paperNoteTemplateVersion: "0.1.1"
zoteroImportDate: "{{importDate | format('YYYY-MM-DD HH:mm')}}"
---
# {{title}} ({{date | format ("YYYY")}})

**Publication:** {{autoJournalAbbreviation}}

**Authors:** {{authors}}

[Goto Zotero](zotero://select/items/@{{citekey}}), [Goto Obsidian](obsidian://open?vault=ObsidianVault&file=ZoteroLib%2F{{citekey}}&paneType=tab), [Goto Online](https://doi.org/{{DOI}})

---
{% persist "paper-notes" %} 
{% if isFirstImport %} 

## Topic

Scenario: 

Objectives: 

Constrain:

{% endif %} 
{% endpersist %}
