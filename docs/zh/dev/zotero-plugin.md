# Zotero 端：Zotero Citekey Bridge

面向 Zotero 7–10 的 bootstrap 插件。源码在 [plugins/zotero/](../../../plugins/zotero/)。

## 设置项

存放在 Zotero prefs 中，前缀 `extensions.zotero-citekey-bridge.`：

| 键 | 默认值 | 用途 |
| --- | --- | --- |
| `vaultName` | `ObsidianVault` | 创建链接的 `vault` 参数、打开链接的 `vault` 参数 |
| `folder` | `ZoteroLib` | 笔记路径 `<folder>/<citekey>`；保存时统一 `\` → `/`，去掉首尾 `/` |
| `format` | `Paper Note` | 创建链接的 `format` 参数 |

- 默认值写在 [prefs.js](../../../plugins/zotero/prefs.js)，代码中 `DEFAULTS` 也有一份兜底。
- 设置面板 [preferences.xhtml](../../../plugins/zotero/preferences.xhtml) 通过 `Zotero.PreferencePanes.register` 注册。面板不使用 `preference` 属性自动绑定，而是由 `initPrefsPane()` 手动读写，同时实时显示 Obsidian 端应填的 Name 和 Output Path。
- 面板运行在设置窗口里，访问不到 bootstrap 作用域，所以启动时把插件对象挂到 `Zotero.CitekeyBridge`，关闭时移除。
- 值为空或等于默认值时会清除该 pref，回到默认。

“Obsidian Link” 标签和 `obsidian://zotero-note` 地址是固定常量，不开放设置，避免旧链接识别失效。

## 界面语言

`Zotero.locale` 以 `zh` 开头时显示中文，其余显示英文。字符串都在 `STRINGS` 表里。

## 右键菜单

只在选中**一条普通文献**时可用。“打开”和“删除”只在该文献已有 `Obsidian Link:` 时可用。

### 创建并关联 Obsidian 笔记

1. `Extra` 中已有 `Obsidian Link:` 时，阻塞提示并停止，避免重复创建。
2. 读取 citekey，顺序：
   1. Zotero 8+ 原生 `citationKey` 字段；
   2. Better BibTeX `KeyManager.get(item.id).citationKey`；
   3. `Extra` 中的 `Citation Key:` 行。
3. 打开创建链接（参数见 [开发者文档：URL 接口](README.md#url-接口)）。打开失败时抛错，不写回链接。
4. 在 `Extra` 末尾写入 `Obsidian Link: obsidian://open?...&paneType=tab`。
5. 右下角显示自动消失的通知。

### 打开 Obsidian 笔记

读取 `Obsidian Link:`，交给系统打开。

### 删除已保存的 Obsidian 链接

确认后只删除 `Obsidian Link:` 行，不动 `Extra` 的其他内容。完成后阻塞提示。

## 防重复逻辑的边界

插件只能确认“Zotero 是否记录过创建操作”，无法仅凭 `obsidian://` URL 确认笔记是否真的生成。因此以 `Extra` 中是否存在 `Obsidian Link:` 为准：

- 第一次执行：发出创建链接并保存打开链接；
- 再次执行：发现链接后停止；
- 创建失败或需要重建：先删除链接再执行。

## 交互细节

- 打开 `obsidian://` 时直接调用系统注册的协议处理器，并设为不询问，跳过 Zotero 的 “Allow this site to open the obsidian link?” 弹窗。只允许 `obsidian` 协议。
- 通知分两种：首次创建成功用右下角自动消失的通知；重复创建、删除确认、删除完成、错误用需要点 OK 的阻塞提示。
- 若操作系统未注册 `obsidian://`，或受系统/组织安全策略限制，插件无法绕过。

## 版本兼容

- `manifest.json` 保留 Zotero 9 要求的 `applications.zotero.update_url`，兼容上限为 `10.0.*`。
- 只使用条目选择、字段读写、右键菜单、设置面板和外部协议处理，不涉及 Zotero 10 变更的 collection 多选、搜索、本地 HTTP、数据库或 cookie API。

## 调试

Zotero：帮助 → 调试输出日志。日志前缀 `Zotero Citekey Bridge:`。
