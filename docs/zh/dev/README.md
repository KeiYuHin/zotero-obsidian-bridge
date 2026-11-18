# 开发者文档

这里是给维护者和想改代码的人看的。普通用户看 [README](../../../README.zh-CN.md) 即可。

| 文档 | 内容 |
| --- | --- |
| 本页 | 工作原理、URL 接口、仓库结构、打包发版 |
| [zotero-plugin.md](zotero-plugin.md) | Zotero 端插件：设置项、citekey 读取顺序、交互设计、版本兼容 |
| [obsidian-plugin.md](obsidian-plugin.md) | Obsidian 端插件：协议处理、导入、打开笔记、对 Zotero Integration 的依赖 |
| [requirements-notes.md](requirements-notes.md) | 最初的需求记录（存档） |
| [development-notes.md](development-notes.md) | 开发过程笔记和方案比较（存档） |

## 工作原理

```text
Zotero                                   Obsidian
───────────────────────────────          ─────────────────────────────────────
右键“创建并关联 Obsidian 笔记”
  │ 读取 citekey（原生字段 / BBT / Extra）
  │
  ├─ 打开 obsidian://zotero-note?...  ──▶ Citekey Import Bridge 收到参数
  │                                         │ 检查 Zotero Integration 和导入格式
  │                                         │ 调用 runImport(format, citekey, library)
  │                                         │   └─ Zotero Integration 向 Zotero/BBT 取数据，按模板写文件
  │                                         └─ 在新标签页打开生成的笔记
  │
  └─ 在 Extra 写入
     Obsidian Link: obsidian://open?vault=…&file=…&paneType=tab

右键“打开 Obsidian 笔记” ── 打开上面保存的链接 ──▶ Obsidian 新标签页打开笔记
```

两个插件之间只通过 `obsidian://` URL 通信，没有其他耦合。

## URL 接口

### 创建：`obsidian://zotero-note`

由 Obsidian 端注册，Zotero 端调用。

| 参数 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `citekey` | 是 | | 文献 citekey，开头的 `@` 会被去掉 |
| `vault` | 否 | 当前库 | Obsidian 自带参数，指定由哪个库处理 |
| `format` | 否 | `Paper Note` | Zotero Integration 的 Import Format 名 |
| `file` | 否 | `ZoteroLib/<citekey>` | Zotero 端预期的笔记路径，用于打开笔记和检查路径是否一致 |
| `library` | 否 | `1` | Zotero library ID，`1` 为“我的文库” |

例子：

```text
obsidian://zotero-note?vault=ObsidianVault&citekey=smithExample2026&file=ZoteroLib%2FsmithExample2026&format=Paper%20Note
```

只传 `citekey` 的旧链接仍然可用。

Obsidian 端打开笔记时，优先用 Import Format 的 `outputPathTemplate` 解析出实际路径（仅当模板里只有 `{{citekey}}` 变量时）；解析不了才用 `file` 参数。两者不一致时会提示用户。

### 打开：`obsidian://open`

Obsidian 官方 URI，见 [Obsidian URI 文档](https://obsidian.md/help/uri)。Zotero 端保存的链接为：

```text
obsidian://open?vault=<vault>&file=<folder>%2F<citekey>&paneType=tab
```

`paneType=tab` 让笔记在新标签页打开，而不是替换当前标签。

## 仓库结构

```text
plugins/
  zotero/        Zotero Citekey Bridge
    manifest.json         插件元数据、Zotero 版本范围、更新地址
    bootstrap.js          生命周期：启动、注册设置面板、窗口加载/卸载
    obsidian-zotero-link.js  菜单、设置读写、citekey 读取、URL 生成、Extra 读写
    preferences.xhtml     设置面板界面
    prefs.js              设置项默认值
  obsidian/      Citekey Import Bridge
    main.js / manifest.json / versions.json
docs/zh/         用户文档、模板、开发文档
scripts/         发版脚本 release.mjs
release/         打包输出，已加入 .gitignore
```

## 打包与发版

两个插件使用同一个版本号，一起发版。

```sh
make release VERSION=0.2.0
# 没有 make 时：
node scripts/release.mjs --version 0.2.0
```

为 fork 打包：

```sh
make release VERSION=0.2.0 GITHUB_REPO=owner/repo
```

脚本会：

1. 同步版本号到 `package.json`、`plugins/zotero/manifest.json`、`plugins/obsidian/manifest.json`、`plugins/obsidian/versions.json`，并更新 Zotero 端的 `update_url`。
2. 输出到 `release/<version>/`：

   ```text
   zotero/zotero-citekey-bridge-<version>.xpi
   zotero/zotero-updates.json
   obsidian/main.js
   obsidian/manifest.json
   obsidian/versions.json
   obsidian/citekey-import-bridge-<version>.zip
   ```

只同步版本号、不打包：`make version VERSION=0.2.0`。清理输出：`make clean`。

### 发 GitHub Release

1. 更新 [CHANGELOG.md](../../../CHANGELOG.md)，运行打包命令，提交。
2. 打 tag `v<version>`（必须带 `v`，Zotero 的更新地址依赖这个格式）。
3. 新建 Release，上传 `release/<version>/` 下的全部文件：
   - Zotero：`.xpi` 和 `zotero-updates.json`（Zotero 靠它检查自动更新）
   - Obsidian：`main.js`、`manifest.json`、`versions.json`、`.zip`（zip 方便用户手动安装）

### 新增插件文件时

Zotero 端新增文件后，要把它加入 `scripts/release.mjs` 里的 `zoteroFiles` 列表，否则不会被打进 `.xpi`。
