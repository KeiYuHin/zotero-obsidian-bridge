# Zotero Citekey Bridge

一个面向 Zotero 7–10 的轻量插件。它从 Zotero / Better BibTeX 读取 citation key，并通过 Obsidian URI 完成文献笔记创建、链接保存和打开。

## 已配置参数

- Obsidian Vault：`ObsidianVault`
- 文献笔记目录：`ZoteroLib`
- 创建接口：`obsidian://zotero-note?citekey=[citekey]`
- 打开接口：`obsidian://open?vault=ObsidianVault&file=ZoteroLib%2F[citekey]&paneType=tab`

这里的 Obsidian Vault 指 Obsidian 中打开的 vault 名，不是 GitHub 仓库名。默认情况下，Obsidian 端需要存在 vault `ObsidianVault`，其中有文件夹 `ZoteroLib`。

Zotero Integration 中对应的 import format 应设为：

- `Name`：`Paper Note`
- `Output path`：`ZoteroLib/{{citekey}}.md`

`Paper Note` 需要和 Obsidian 端插件默认 format 名完全一致，包括空格和拼写。

`paneType=tab` 会让 Obsidian 在新标签页打开笔记，见 Obsidian 官方 [URI 文档](https://obsidian.md/help/uri)。

如需修改，在 `obsidian-zotero-link.js` 顶部的 `config` 中调整：

```js
config: Object.freeze({
    vaultName: "ObsidianVault",
    folder: "ZoteroLib",
    extraLabel: "Obsidian Link",
    createBaseURL: "obsidian://zotero-note"
})
```

如果修改了 `vaultName` 或 `folder`，请同步修改 Obsidian 端 Zotero Integration 的 `Output path`。如果 Zotero Integration 的 import format 不叫 `Paper Note`，需要在 Obsidian 端插件中修改默认 format，或在调用 URL 里传入 `format` 参数。

## 安装

1. 打开 Zotero。
2. 进入“工具 → 插件”（部分版本显示为“工具 → 附加组件”）。
3. 点击齿轮菜单，选择“Install Add-on From File / 从文件安装插件”。
4. 选择 `zotero-citekey-bridge-[version].xpi`。
5. 按 Zotero 提示重启。

## 右键菜单

在 Zotero 中只选择一条普通文献条目，然后右键：

### 1. 创建并关联 Obsidian 笔记

1. 检查条目 `Extra` 中是否已有 `Obsidian Link:`。
2. 已存在时停止执行并提醒，避免重复创建。
3. 读取 citation key，优先顺序：
   - Zotero 8–10 原生 `citationKey` 字段；
   - Better BibTeX `KeyManager.get(item.id).citationKey`；
   - `Extra` 中的 `Citation Key:` 兼容格式。
4. 调用：
   `obsidian://zotero-note?citekey=[URL 编码后的 citekey]&file=[URL 编码后的笔记路径]`
5. 在 Zotero 条目 `Extra` 中保存：
   `Obsidian Link: obsidian://open?vault=ObsidianVault&file=ZoteroLib%2F[citekey]&paneType=tab`

### 2. 调试：删除 Obsidian 跳转链接

只删除 `Extra` 中由插件保存的 `Obsidian Link:` 行，不修改其他 Extra 内容。

删除后可以重新执行创建操作。适合 citation key 或 Obsidian 文件路径改变后的调试。

### 3. 打开 Obsidian 笔记

读取该条目保存的 `Obsidian Link:`，并交给操作系统打开。

没有保存链接时会停止并提醒。

## 检查机制的边界

插件能够确认“Zotero 条目是否已经记录过创建操作”，但无法仅凭 `obsidian://` URI 确认 Obsidian 中的 Markdown 文件是否真的创建成功。

因此，当前防重复逻辑以 Zotero `Extra` 中存在 `Obsidian Link:` 为准。这正好支持你的工作流：

- 第一次执行：调用创建接口并保存链接；
- 再次执行：发现链接后停止；
- 创建失败或需要重建：先用调试菜单删除链接，再重新执行。

## 开发调试

Zotero 中可在“工具 → 开发者 → 错误控制台”查看错误。

插件日志前缀：

```text
Zotero Citekey Bridge:
```

## 文件说明

- `manifest.json`：插件元数据与 Zotero 版本范围。
- `bootstrap.js`：Zotero 插件生命周期和窗口加载。
- `obsidian-zotero-link.js`：右键菜单、citation key 读取、链接保存与打开逻辑。

## Zotero 9/10 安装兼容

`manifest.json` 保留 Zotero 9 要求的
`applications.zotero.update_url`，并按 Zotero 10 官方迁移文档将兼容上限更新为 `10.0.*`。

本插件只使用条目选择、字段读写、右键菜单和外部协议处理，不使用 Zotero 10 变更的 collection 多选、搜索、本地 HTTP、数据库或 cookie API，因此这些部分无需代码迁移。

当前更新地址指向 GitHub Release 中的 `zotero-updates.json`。正式发版前确认仓库地址为 `KeiYuHin/zotero-obsidian-bridge`，然后用 Makefile 或 release 脚本重新打包。

## 交互优化

- 创建和打开 Obsidian 链接时，直接调用系统已注册的 Obsidian 协议处理器，并将本次处理设为不询问，避免 Zotero 的网页式外部协议确认弹窗。
- 首次“创建并关联”成功后改为右下角自动消失通知，不再要求点击 OK。
- 再次执行创建时，仍使用需要点击 OK 的阻塞式提醒，提示先删除旧链接。
- 删除链接前增加“确定删除”询问；删除完成后继续显示需要点击 OK 的成功确认。
- 其他错误和状态提示保持原来的阻塞式提示方式。

说明：若操作系统本身未注册 `obsidian://`，或设备受到系统/组织安全策略限制，系统仍可能阻止启动 Obsidian；插件无法绕过操作系统级安全策略。
