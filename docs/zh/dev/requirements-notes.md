Zotero 中已有 batter bib latex 它基于每个文章的作者与名称生成全局唯一 "citation-key"。

我需要在Zotero中实现：

- 访问链接`obsidian://zotero-note?citekey=[citekey]`一个已在obsidian中配置好的接口，它能据citekey调用模板创建md文件
- Zotero保存跳转obsidian链接 `obsidian://open?vault=ObsidianVault&file=ZoteroLib%2F{{citekey}}&paneType=tab` 一个能借此指向obsidian中新创建的文件，并在 Obsidian 新标签页中打开。

交互：

- 右键菜单希望有下面三个选项
	- 可以执行上面的操作。（加入检查机制，如果已经执行过，比如已跳转obsidian链接，则停止，并且提醒）
	- 用于debug，可删除保存的跳转obsidian链接
	- 跳转obsidian链接

请参考Zotero文档

---

交互中有一些希望改进的地方：

- 访问外链url的时候会跳出权限的询问`Allow this site to open the obsidian link with Obsidian?` 我希望不用我点确定。默认允许
- 提示信息希望分两种，一种打扰式的，需要点OK确认，一种不需要，只是通知
	- 只提醒：第一次调用创建关联笔记时，希望只有一个不打扰的提醒，如放在右下角的，一段时间后消失
	- 确认：第二次调用，提醒需要删除
	- 确认：删除后再次确认
	- 其他的保持原样
