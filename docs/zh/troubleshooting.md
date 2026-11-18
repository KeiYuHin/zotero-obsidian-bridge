# 常见问题

按你看到的现象找对应的小节。大多数问题出在三处：**Zotero 没打开**、**两边名字没对上**、**Zotero Integration 本身没配好**。

- [右键菜单里没有这几项](#右键菜单里没有这几项)
- [菜单是灰色的，点不了](#菜单是灰色的点不了)
- [右键菜单出现了两组](#右键菜单出现了两组)
- [提示“没有 citation key”](#提示没有-citation-key)
- [点了“创建”，Obsidian 没反应](#点了创建obsidian-没反应)
- [Obsidian 提示找不到库，或打开了别的库](#obsidian-提示找不到库或打开了别的库)
- [Obsidian 提示没有找到 Zotero Integration](#obsidian-提示没有找到-zotero-integration)
- [Obsidian 提示没有名为“…”的 Import Format](#obsidian-提示没有名为的-import-format)
- [Obsidian 提示导入失败](#obsidian-提示导入失败)
- [Zotero Integration 手动导入失败](#zotero-integration-手动导入失败)
- [Obsidian 提示两边路径不一致](#obsidian-提示两边路径不一致)
- [“打开 Obsidian 笔记”打开了空白页或新建了空笔记](#打开-obsidian-笔记打开了空白页或新建了空笔记)
- [提示“已经关联过”，但我想重新生成](#提示已经关联过但我想重新生成)
- [重新生成会覆盖我写的笔记吗](#重新生成会覆盖我写的笔记吗)
- [Zotero 弹出“Allow this site to open the obsidian link”](#zotero-弹出allow-this-site-to-open-the-obsidian-link)
- [还是不行：怎么看错误信息](#还是不行怎么看错误信息)

---

### 右键菜单里没有这几项

- **插件没装上或被禁用。** Zotero → 工具 → 插件，确认 Zotero Citekey Bridge 在列表里且已启用。刚装完可以重启一次 Zotero。
- **右键的位置不对。** 菜单在中间文献列表里右键**文献条目**时出现，在左侧文件夹上右键不会有。

### 菜单是灰色的，点不了

- **三项都灰**：你选中的不是一条普通文献。多选、附件（PDF）、独立笔记都不支持。只选中一条文献再试。
- **只有“打开”和“删除”灰**：这条文献还没关联过笔记，先用“创建并关联 Obsidian 笔记”。

### 右键菜单出现了两组

装了旧版本的插件。Zotero → 工具 → 插件，把名字类似 `zotero-obsidian-citekey-link` 的旧插件移除，只保留 **Zotero Citekey Bridge**。

### 提示“没有 citation key”

Better BibTeX 没装好。见 [安装指南第 1 步](install.md#1-zotero安装-better-bibtex)。装好后，在 Zotero 文献信息栏里应能看到 `Citation Key`。

### 点了“创建”，Obsidian 没反应

1. **Obsidian 没装或从没打开过。** 安装 Obsidian 桌面版并至少打开一次，系统才会认识 `obsidian://` 链接。
2. **试一下系统能不能打开 Obsidian 链接。** Zotero → 设置 → Citekey Bridge → 点击 **测试：在 Obsidian 中打开这个库**。没反应说明是系统层面的问题；公司或学校电脑可能禁止了外部协议。
3. **Obsidian 弹出来了，但没生成笔记，也没任何提示。** 确认 Citekey Import Bridge 已启用（[安装指南第 6 步](install.md#6-obsidian安装-citekey-import-bridge)）。

注意：Zotero 右下角的“已发送到 Obsidian”只表示链接发出去了，不代表笔记已经生成。生成结果以 Obsidian 右上角的提示为准。

### Obsidian 提示找不到库，或打开了别的库

Zotero 端填的库名和 Obsidian 的库名不一致。看 Obsidian 左下角的库名，原样填到 Zotero → 设置 → Citekey Bridge → **Obsidian 库名**，区分大小写和空格。

改完后，已经关联过的文献要删除链接再重新创建，见 [自定义设置：改了设置以后，旧文献怎么办](customize.md#改了设置以后旧文献怎么办)。

### Obsidian 提示没有找到 Zotero Integration

在 Obsidian 设置 → 第三方插件 中安装并启用 Zotero Integration，见 [安装指南第 3 步](install.md#3-obsidian安装-zotero-integration)。

### Obsidian 提示没有名为“…”的 Import Format

提示里会列出你现有的导入格式名。二选一：

- 把 Zotero → 设置 → Citekey Bridge → **导入格式名** 改成列表里的某一个；或者
- 在 Obsidian 的 Zotero Integration 设置里新建一个同名的导入格式（[安装指南第 5 步](install.md#5-obsidian新建导入格式-paper-note)）。

### Obsidian 提示导入失败

最常见的原因：

- **Zotero 没在运行。** 导入时要从 Zotero 读数据，Zotero 必须开着。
- **Better BibTeX 没装或没启用。**
- **模板文件路径不对。** Import Format 的 Template File 指向的文件被移动或改名了。

可以先用下一节的方法单独测试 Zotero Integration。

### Zotero Integration 手动导入失败

这时问题不在本项目，而在 Zotero Integration 的配置。逐项检查：

1. Zotero 正在运行，并已安装 Better BibTeX。
2. Obsidian 设置 → Zotero Integration → **Database** 选的是 `Zotero`。
3. Import Format 的 **Template File** 指向的模板文件存在。
4. 模板内容完整，开头是 `---`。从 GitHub 复制时请用 Raw 页面复制。

手动导入跑通后，再回来用右键菜单。

### Obsidian 提示两边路径不一致

笔记已经生成，但 Zotero 端设置的文件夹和 Import Format 的 Output Path 对不上，以后在 Zotero 里点“打开 Obsidian 笔记”会找不到文件。

按提示把 Zotero → 设置 → Citekey Bridge → **文献笔记文件夹** 改成和 Output Path 一致，然后对这条文献：右键 → 删除已保存的 Obsidian 链接 → 再创建并关联一次。

### “打开 Obsidian 笔记”打开了空白页或新建了空笔记

Zotero 里存的路径和笔记的实际位置不一致。通常是改过文件夹或库名，或者手动移动、重命名过笔记。

修复：右键 → 删除已保存的 Obsidian 链接 → 创建并关联 Obsidian 笔记。

### 提示“已经关联过”，但我想重新生成

这是防止重复创建的保护。右键 → **删除已保存的 Obsidian 链接**，再 **创建并关联 Obsidian 笔记**。删除链接不会删除 Obsidian 里的笔记。

### 重新生成会覆盖我写的笔记吗

写在 `%% begin paper-notes %%` 和 `%% end paper-notes %%` 之间的内容会保留，写在外面的会被模板覆盖。详见 [模板说明](template/README.md#模板的四个部分)。

### Zotero 弹出“Allow this site to open the obsidian link”

插件已经设置为跳过这个确认框，正常不会出现。如果出现了，勾选“总是使用 Obsidian 打开”并确认，以后就不会再问。

### 还是不行：怎么看错误信息

- **Zotero**：帮助 → 调试输出日志 → 开始记录，重现一次问题，再点“查看输出”。搜索 `Zotero Citekey Bridge`。
- **Obsidian**：按 `Ctrl+Shift+I`（macOS 为 `Cmd+Option+I`）打开开发者工具，切到 Console 标签，重现一次问题，查看红色报错。

到 [GitHub Issues](https://github.com/KeiYuHin/zotero-obsidian-bridge/issues) 提问时，请附上：Zotero 版本、Obsidian 版本、Zotero Integration 版本、出错时的提示文字或截图，以及上面看到的报错。
