更新Idea

- Makefile。如果能基于简单的makefile实现打包发布。更新仓库地址 `https://github.com/KeiYuHin/zotero-obsidian-bridge`
- 从打开文件，改为新标签页中打开文件：加入参数`&paneType=tab`新标签页中打开
  - obsidian://open?vault=ObsidianVault&file=ZoteroLib%2F{{citekey}}
  - obsidian://open?vault=ObsidianVault&file=ZoteroLib%2F{{citekey}}&paneType=tab
- 更新文档，链接指向现在网上常有的Obsidian为主的数据库（网上很多教程，这样能让小白安装好两个依赖）。

# 本地PDF文件（弃用）

Zotero的本地pdf文件路径是怎么样的，多设备同步之后还在同一路径下吗？它似乎用的是一个随机的key，

---
title: "{{title}}"
year: {{date | format ("YYYY")}}
publication: "{{publicationTitle}}"
citekey: {{citekey}}
key: {{key}}
DOI: "{{DOI}}"
toZoteroUrl_1: "zotero://select/items/@{{citekey}}"
toZoteroUrl_2: "{{desktopURI}}"

templateVersion: "0.1.0"
---

我想弄一个指向pdf文件的链接

# 发布

跨软件的两个对称插件的管理：

我做了一个实现从zotero开始，调用obsidian中zotero integrate的项目。通过url进行外部调用，通过分别写了两个插件实现。

这两个插件分别依赖zotero integrate，better bib latex。

我想知道我要怎么管理它们的版本。无论是自己存档，还是GitHub开源

```
zotero-obsidian-bridge/ (你的项目根目录)
├── obsidian-plugin/      # Obsidian 插件源码
│   ├── main.ts
│   ├── manifest.json
│   └── package.json
├── zotero-plugin/        # Zotero 插件源码
│   ├── bootstrap.js
│   ├── install.rdf
│   └── package.json
├── docs/                 # 使用文档（图文教程）
└── README.md             # 项目主页说明
```

可以用自动化逻辑GitHub Actions 加本地 act。但我想了一下`Makefile`才是更合理的。

因为会分散到两边的插件中，我希望两边有相同的版本号，作者。

目前该项目是在做一个zotero-obsidian的双向链接。

目前经测试，以下的url可以实现在不同项目中跳转

[Goto Obsidian](obsidian://open?vault=ObsidianVault&file=ZoteroLib%2F{{citationKey}}&paneType=tab)
[Goto Zotero](zotero://select/items/@{{citekey}})

目前已完成，Obsidian中基于Obsidian Zotero Integration，加上template的设置，实现了可以在Obsidian中创建md文件，并且有能力跳转到zotero。

我的下一步是Zotero的工作。我希望实现在zotero发起整个流程，因为我的工作流更多的基于zotero。

我想的是：

1. obsidian创建对外接口，可能是url之类的，能通过外部调取Zotero Integration，加载template，创建文件。并且测试可以稳定运行
2. Zotero端的工作：
	1. 用上面得到的接口，Zotero对某篇论文操作，调用obsidian
	2. Zotero内写入数据，Goto Obsidian

我意识到可能不能用Zotero Integration，因为当我调用时会弹出zotero的引用框（我不知道能不能直接传入函数）。我或许可能直接使用templater+Zotero Integration。我不知道有没有方法能在obsidian中使用citekey来查询zotero数据库。

可能能这么做：

1. 传入的url带有citekey
2. 解析citekey，向zotero查询元数据
3. 通过源数据来直接写templat


Zotero Better Bib-latex 的查询API：如已知citation key，能得到什么源数据？

---

开始工作：

## 制作接口

基于一个call command的东西

obsidian://adv-uri?vault=<your-vault>&filepath=<your-file>&commandid=workspace%3Aclose

或者基于- [create files](https://publish.obsidian.md/advanced-uri-doc/Actions/Writing)

obsidian://advanced-uri?vault=你的库名&commandid=templater-obsidian%253Areplace-in-file&filepath=存放路径%252F{{citekey}}.md&mode=new&template=模板文件名

我意识到可能不能用Zotero Integration，因为当我调用时会弹出zotero的引用框（我不知道能不能直接传入函数）。我或许可能直接使用templater+Zotero Integration。我不知道有没有方法能在obsidian中使用citekey来查询zotero数据库。

可能能这么做：

1. 传入的url带有citekey
2. 解析citekey，向zotero查询元数据
3. 通过源数据来直接写templat

obsidian://advanced-uri?vault=...&commandid=templater...&citekey=Smith2026

我需要在obsidian中实现：

1. 外部调用，如url，可传入citekey
2. obsidian使用citekey，加不知道什么接口，访问zotero/zotero的BBT。得到指定论文的元数据
3. 使用部分数据，加上template来创建md文件

请你参考obsidian, zotero, 还有一些插件如Obsidian Zotero Integration, BBT 的文档，告诉我可以怎么实现。


curl http://127.0.0.1:23119/better-bibtex/json-rpc \
  -X POST \
  -H "Content-Type: application/json" \
  --data-binary '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "api.ready",
    "params": []
  }'
curl http://127.0.0.1:23119/better-bibtex/json-rpc \ -X POST -H "Content-Type: application/json" \ --data-binary '{"jsonrpc":"2.0","method":"item.search","params":["panditFrequencySupportElectric2025"]}'


curl http://127.0.0.1:23119/better-bibtex/json-rpc \
  -X POST \
  -H "Content-Type: application/json" \
  --data-binary '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "item.export",
    "params": [
      ["panditFrequencySupportElectric2025"],
      "Better CSL JSON"
    ]
  }'

## 方案 A：调用 Zotero Integration 的 `runImport`

更适合你当前的需求。

优点：

- 代码量最少；
- 可以直接使用 Zotero Integration 模板；
- 批注、参考文献、附件数据处理更完整；
- 支持重复导入和 `persist`；
- 不需要自己处理 Zotero 元数据格式。

缺点：

- `runImport()` 不是正式文档化的稳定 API；
- Zotero Integration 更新后可能需要调整一行调用代码。

可用已下链接

```
obsidian://zotero-note?citekey=panditFrequencySupportElectric2025


obsidian://zotero-note?citekey=pahasaPHEVsBidirectionalCharging2015

obsidian://zotero-note?citekey=falahatiGridSecondaryFrequency2018
```

目前重复导入会覆盖，接下来应该能在template里面解决。

---
