# Obsidian 端：Citekey Import Bridge

Obsidian 桌面端插件，源码 [plugins/obsidian/main.js](../../../plugins/obsidian/main.js)，安装在 `<vault>/.obsidian/plugins/citekey-import-bridge/`。

插件 ID 是 `citekey-import-bridge`，不带 `obsidian`，因为 Obsidian 社区插件提交规则禁止 ID 中出现 `obsidian`。

## 处理流程

注册协议 `obsidian://zotero-note`（参数见 [开发者文档：URL 接口](README.md#url-接口)），收到请求后：

1. 读取 `citekey`（去掉开头的 `@`），缺失时提示并停止。
2. 查找 Zotero Integration（插件 ID `obsidian-zotero-desktop-connector`），未安装或没有 `runImport` 时提示并停止。
3. 在 `settings.exportFormats` 中按 `name` 查找导入格式；找不到时提示并列出现有的格式名。设置结构无法识别时跳过这一步，交给 `runImport` 自己报错。
4. 调用 `runImport(format, citekey, library)`。
5. 确定笔记路径：优先用导入格式的 `outputPathTemplate`（只含 `{{citekey}}` 时可解析），否则用 URL 的 `file` 参数，最后兜底 `ZoteroLib/<citekey>.md`。
6. 等待文件出现在 vault 索引中（最多约 2 秒），然后在新标签页打开。若 Zotero Integration 的 “Open note after import” 已打开该笔记，只激活已有标签页，不重复打开。
7. `file` 参数和 `outputPathTemplate` 解析结果不一致时，提示用户 Zotero 端的“打开笔记”链接会失效。

提示语言跟随 Obsidian 界面语言（`localStorage.language` 以 `zh` 开头时显示中文）。

## 对 Zotero Integration 的依赖

`runImport()` 不是 Zotero Integration 文档化的公开 API。在 3.2.1 中它的实现是：

```js
async runImport(name, citekey, library = 1) {
  const format = this.settings.exportFormats.find((f) => f.name === name);
  if (!format) throw new Error(`Error: Import format "${name}" not found`);
  // ...导入
}
```

这样做的好处是可以直接复用用户在 Zotero Integration 中调好的模板，并跳过它的文献搜索弹窗。代价是 Zotero Integration 改动内部接口后，这里可能需要小幅调整。

## 调试

Obsidian 中按 `Ctrl+Shift+I` 打开开发者工具，日志前缀 `Citekey Import Bridge:`。
