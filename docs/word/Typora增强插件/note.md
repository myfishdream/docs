<span style="border:1px solid #330000;padding:5px;">插件来自Github仓库[typora_plugin](https://github.com/obgnail/typora_plugin)</span>

<span style="background:#606060; color:#330000; font-family:serif; font-size:1.4em;padding:10px;">搬运自上述仓库，仅为保存</span>

请根据你的勤奋程度选择 [懒人版本](#懒人版本) 或 [详细版本](#详细版本)。

## 懒人版本

> 注意：**只能修改后缀为 `user.toml` 的文件**，请勿修改后缀为 `default.toml` 的文件。

1. 将 `settings.default.toml` 的内容复制并覆盖到 `settings.user.toml` 中，使两个文件内容一致。
2. 将 `custom_plugin.default.toml` 的内容复制并覆盖到 `custom_plugin.user.toml` 中，使两个文件内容一致。
3. 如果要修改 `右键菜单→常用插件→二级插件` 下的插件，请打开 `custom_plugin.user.toml` 文件；否则请打开 `settings.user.toml` 文件。
4. 使用 `Ctrl+F` 查找需要修改的插件名称（在右键菜单中的名字）hotkey="ctrl+q"，根据文件中的说明进行修改。
5. 保存并重启 Typora。



## 详细版本

### \*.default.toml 和 \*.user.toml 的区别

- `default.toml`：默认配置文件，请勿修改。
- `user.toml`：用户配置文件，优先级高于 `default.toml`。

插件系统会优先从 `user.toml` 获取配置项，如果 `user.toml` 没有对应的配置项，则从 `default.toml` 获取。

**设计原因**：区分用户配置和默认配置。在插件升级迭代过程中，`default.toml` 会被不断修改，而 `user.toml` 会被保留和尊重。这确保了插件升级时用户的自定义配置不会被覆盖。



### settings.\*.toml 和 custom_plugin.\*.toml 的区别

- `custom_plugin.*.toml`：用户插件（二级插件）配置。所有 `常用插件→二级插件` 下的插件配置都在这里。
- `settings.*.toml`：默认插件（一级插件）配置。其余所有插件的配置都在这里。

一级插件从 `settings.*.toml` 获取配置项，二级插件从 `custom_plugin.*.toml` 获取配置项。

**设计原因**：区分用户插件和默认插件。插件系统提供开放能力，用户可以自行编写插件，这些插件的配置需要写在 `custom_plugin.user.toml` 中。



### 如何修改配置（简单方法）

见懒人版本。



### 如何修改配置（推荐方法）

> 注意：配置选项区分大小写。

以修改只读模式的 `HOTKEY` 和 `READ_ONLY_DEFAULT` 配置为例：

1. 打开 `settings.default.toml`，找到需要修改的插件配置（如 `read_only`），内容如下：

   ```toml
   [read_only]
   # 启用插件
   ENABLE = true
   # 插件名称
   NAME = "只读模式"
   # 进入和脱离只读模式的快捷键
   HOTKEY = "ctrl+shift+r"
   # 默认使用只读模式（打开Typora就进入只读模式）
   READ_ONLY_DEFAULT = false
   # 开启只读模式后，右下角数字统计区域出现的提示文字
   SHOW_TEXT = "ReadOnly"
   ```

2. 打开 `settings.user.toml`，添加如下内容：

   ```toml
   [read_only]
   HOTKEY = "ctrl+alt+shift+r"  # 快捷键修改为 ctrl+alt+shift+r
   READ_ONLY_DEFAULT = true     # 启动 Typora 时自动进入只读模式
   ```

3. 保存并重启 Typora。这样一来，`settings.user.toml` 里的 `HOTKEY` 和 `READ_ONLY_DEFAULT` 选项就会覆盖掉 `settings.default.toml`，并且 **其他选项保持不变**。

**推荐理由**：

1. 该方法是部分修改，而简单方法是全量修改。部分修改只修改感兴趣的部分，其他保持不变；全量修改则覆盖所有配置项。
2. 插件不断迭代，开发者可能修改某些配置的默认值（即 `default.toml` 的值发生改变）。如果使用全量修改，`user.toml` 的优先级高于 `default.toml`，可能会导致配置无法更新。



### 配置示例

以下是个人的配置文件，供参考：

#### settings.user.toml

```toml
[auto_number]
ENABLE_TABLE = false
ENABLE_IMAGE = false
ENABLE_FENCE = false

[fence_enhance]
REMOVE_BUTTON_HINT = true

[right_click_menu]
HIDE_OTHER_OPTIONS = true

[window_tab]
HEIGHT_SCALE = -1
WHEN_CLOSE_LAST_TAB = "exit"

[toolbar]
DEFAULT_TOOL = "plu"

[ripgrep]
HOTKEY = "ctrl+alt+j"

[collapse_table]
ENABLE = false
```



#### custom_plugin.user.toml

```toml
[reopenClosedFiles]
hide = true
auto_reopen_when_init = true

[markdownLint]
hide = true
```



## TOML 教程

- 如果不熟悉 TOML 格式，可以花三分钟学习：[TOML 教程](https://toml.io/cn/v1.0.0)
- 写入内容有格式错误时，配置文件无法正确读取。请前往 [TOML 格式校验网站](https://www.bejson.com/validators/toml_editor/) 检查格式



## 小秘密

可以创建目录 `~/.config/typora_plugin/`，并在其中存放两个 `user.toml` 配置文件，将配置文件单独隔离，而且这里的配置文件 **优先级最高**。

```bash
dir /b C:\Users\用户名\.config\typora_plugin

custom_plugin.user.toml
settings.user.toml
```

> 此方法适用于 Linux、Windows 平台。

