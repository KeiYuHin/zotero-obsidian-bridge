# 模板说明

[paper-note-template.md](paper-note-template.md) 是配合本项目使用的文献笔记模板，由 Obsidian 插件 Zotero Integration 渲染。怎么把它放进库、挂到导入格式上，见 [安装指南第 4、5 步](../install.md#4-obsidian放入笔记模板)。

模板语法是 Zotero Integration 使用的 Nunjucks：`{{ ... }}` 填入文献字段，`{% ... %}` 是控制语句。完整字段列表见 [Zotero Integration 的模板文档](https://github.com/mgmeyers/obsidian-zotero-integration/blob/main/docs/Templating.md)。

## 模板的四个部分

**1. 属性区（开头两个 `---` 之间）**

记录标题、年份、期刊、citekey、DOI 和导入时间，Obsidian 显示为“属性”面板，可以用来搜索、筛选和做 Dataview 表格。`paperNoteTemplateVersion` 是模板版本号，以后模板升级时方便区分新旧笔记。

**2. 标题和基本信息**

`# 标题 (年份)`，下面是期刊缩写和作者。

**3. 跳转链接**

```markdown
[Goto Zotero](zotero://select/items/@{{citekey}}), [Goto Obsidian](obsidian://open?vault=ObsidianVault&file=ZoteroLib%2F{{citekey}}&paneType=tab), [Goto Online](https://doi.org/{{DOI}})
```

- **Goto Zotero**：在 Zotero 中选中这篇文献。
- **Goto Obsidian**：这篇笔记自身的外部链接，可以复制到其他软件里使用。
- **Goto Online**：用 DOI 打开论文网页。

> 如果你改了库名或文件夹，要把 `Goto Obsidian` 里的 `ObsidianVault` 和 `ZoteroLib` 一起改掉。见 [自定义设置](../customize.md)。

**4. 你自己写笔记的区域**

```text
{% persist "paper-notes" %}
{% if isFirstImport %}
## Topic
...
{% endif %}
{% endpersist %}
```

这一段决定了**重新导入时你的笔记会不会被覆盖**：

- `{% persist "paper-notes" %}` 包住的内容，重新导入时会原样保留。
- `{% if isFirstImport %}` 里的小标题（Topic、Scenario 等）只在第一次导入时生成，之后不会重复插入。

生成的笔记里，这段区域会被两行注释包住：

```markdown
%% begin paper-notes %%
## Topic
...
%% end paper-notes %%
```

**笔记请写在 `%% begin paper-notes %%` 和 `%% end paper-notes %%` 之间。** 写在外面的内容，重新导入时会被模板覆盖。这两行注释也不要删。

## 修改模板

可以随意增删字段和小标题，不影响本项目的插件。只需注意两点：

- 保留 `persist` 区块，否则重新导入会覆盖你的笔记。
- Import Format 的 Output Path 保持 `文件夹/{{citekey}}.md` 的形式，插件靠它找到并打开笔记。
