# LarryHYQ's Attic

<div align="center">

[![GitHub stars](https://img.shields.io/github/stars/LarryHYQ/larryhyq.github.io?style=flat-square&logo=github&label=Stars)](https://github.com/LarryHYQ/larryhyq.github.io/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/LarryHYQ/larryhyq.github.io?style=flat-square&logo=github&label=Forks)](https://github.com/LarryHYQ/larryhyq.github.io/network/members)
[![MIT license](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](https://github.com/LarryHYQ/larryhyq.github.io/blob/main/LICENSE)
[![Website](https://img.shields.io/badge/Website-larryhyq.github.io-2ea44f?style=flat-square&logo=googlechrome&logoColor=white)](https://larryhyq.github.io/)
[![Last commit](https://img.shields.io/github/last-commit/LarryHYQ/larryhyq.github.io?style=flat-square&logo=git&label=Updated)](https://github.com/LarryHYQ/larryhyq.github.io/commits/main)
[![Version](https://img.shields.io/badge/Version-4.0.5-6a5acd?style=flat-square)](docs/VERSIONS.md)

**个人学术主页 · 研究记录 · 博客笔记 · 兴趣相册**

[在线访问主页](https://larryhyq.github.io/) · [查看项目结构](docs/PROJECT_STRUCTURE.md) · [浏览论文](https://larryhyq.github.io/publications/) · [阅读博客](https://larryhyq.github.io/blog/)

</div>

![LarryHYQ's Attic Home Page](images/Homepage.jpg "LarryHYQ's Attic Home Page")

## 项目简介

这是贺业祺（Yeqi He）的个人学术主页，使用 Jekyll 和 GitHub Pages 构建。网站集中展示个人简介、研究方向、发表成果、机器学习学习笔记、竞赛经历、兴趣爱好和可下载的论文与简历文件。

研究方向主要围绕计算机视觉、生成模型、扩散模型、风格迁移和少样本生成模型适配展开。主页内容同时保留了摄影、羽毛球、足球、音乐和 Formula 1 等个人兴趣记录。

## 网站内容

| 页面 | 路径 | 内容 |
| --- | --- | --- |
| 个人主页 | `/` | 个人简介、教育经历、研究兴趣和联系方式 |
| 论文成果 | `/publications/` | 论文、竞赛文章、摘要、引用信息和 PDF 阅读入口 |
| 博客 | `/blog/` | 机器学习与深度学习学习笔记，带年月时间轴 |
| 荣誉奖项 | `/honors-and-awards/` | 数学建模、智能车、创新创业等经历 |
| 兴趣爱好 | `/interests/` | 摄影、羽毛球、足球、音乐和 Formula 1 |
| 页面归档 | `/page-archive/` | 网站页面归档 |
| 标签归档 | `/tags/` | 按标签浏览文章 |
| 简历与附件 | `/files/` | 中文简历、论文 PDF、BibTeX/文本资料 |

## 版本记录

当前版本 **4.0.5**（2026-10-24）。**每一条提交都对应一个独立版本号**，版本规则、完整版本历史与逐条提交记录见 [`docs/VERSIONS.md`](docs/VERSIONS.md)。

| 大版本 | 时间 | 主题 |
| --- | --- | --- |
| **4.0** | 2026-10-24 起 | 阅读体验与视觉：侧栏与滚动条、断点统一、荣誉奖项、一键置顶（当前） |
| 3.x | 2026-10-23 – 2026-10-24 | 功能开发期：导航、时间轴、侧栏滚动、荣誉奖项、一键置顶（全部为 beta） |
| 2.x | 2026-04-02 – 2026-10-23 | 学术内容体系：出版物页重构、2026 年 F1 上海站内容 |
| 1.x | 2026-01-06 – 2026-04-01 | 博客与归档体系（MathJax、代码复制、标签归档） |
| 0.x | 2025-09-19 – 2026-01-05 | 建站与基础内容填充 |

版本规则：内容级更新（CV、新增博客、新增奖项、文档等）→ 修订号 `X.Y.Z`；内容与格式小调整 → 次版本 `X.Y`；功能 / 逻辑更新 → `X.Y beta`（可连续，每个功能点一个十分位）；整体改版或较大功能体系调整 → 新大版本 `X.0`。

## 技术栈

- **站点生成**：Jekyll、Liquid、Kramdown、Rouge
- **主题基础**：Academic Pages / Minimal Mistakes
- **样式**：SCSS，支持 default 与 air 主题以及亮色/暗色配色
- **交互脚本**：原生 JavaScript、jQuery、时间轴、主题切换、代码复制、折叠内容和访客地图
- **图标字体**：Font Awesome、Academicons
- **部署**：GitHub Pages；本地可使用 Bundler 和 Jekyll 预览

更完整的目录与文件职责请参阅 [`docs/PROJECT_STRUCTURE.md`](docs/PROJECT_STRUCTURE.md)。

## 本地运行

### 1. 准备运行环境

项目使用 GitHub Pages 兼容的 Jekyll 依赖。建议使用 Ruby 3.0 或更高版本；macOS 自带的 Ruby 2.6 可能无法编译当前依赖。Apple Silicon Mac 可以使用 Homebrew Ruby：

```bash
brew install ruby
export PATH="/opt/homebrew/opt/ruby/bin:$PATH"
ruby -v
```

Intel Mac 的 Ruby 路径通常是 `/usr/local/opt/ruby/bin`。确认 `ruby -v` 显示 3.x 后，在项目根目录安装依赖，并把依赖放在被 Git 忽略的 `vendor/bundle/`：

```bash
bundle config set --local path 'vendor/bundle'
bundle install
```

如果 macOS 报告原生 gem 缺少 C/C++ 头文件，请先安装或修复 Xcode Command Line Tools，再重新执行 `bundle install`：

```bash
xcode-select --install
```

### 2. 启动 Jekyll

```bash
bundle exec jekyll serve --livereload --host localhost
```

启动后打开 <http://localhost:4000> 查看本地渲染的网站。`--livereload` 会在内容或样式变化后自动刷新浏览器；按 `Ctrl+C` 停止服务。修改 `_config.yml` 后需要重启 Jekyll 进程。

只想检查一次完整构建时，可以运行：

```bash
bundle exec jekyll build
```

### 3. 构建前端脚本（可选）

如果修改了 `assets/js/_main.js` 或插件脚本，可以安装 Node 依赖并重新压缩：

```bash
npm install
npm run build:js
```

生成的压缩文件为 `assets/js/main.min.js`。

## 内容维护

- 修改站点名称、作者资料、社交链接和 Jekyll 默认值：编辑 [`_config.yml`](_config.yml)。
- 新增博客：在 `_posts/` 中创建 `YYYY-MM-DD-title.md`，添加 Jekyll front matter。
- 新增论文：在 `_publications/` 中创建 Markdown 文件，设置 `collection: publications`、分类、日期、摘要和引用信息。
- 修改导航：编辑 [`_data/navigation.yml`](_data/navigation.yml)。
- 修改页面模板：编辑 `_layouts/` 与 `_includes/`。
- 修改主题和页面样式：编辑 `_sass/` 或 [`assets/css/main.scss`](assets/css/main.scss)。
- 添加可公开访问的 PDF、BibTeX 或其他资料：放入 `files/`，然后在页面中使用 `/files/<文件名>` 引用。

## 目录说明

项目级目录和文件的功能说明集中在 [`docs/PROJECT_STRUCTURE.md`](docs/PROJECT_STRUCTURE.md)。旧版模板 README 已保存为 `README.legacy.md`，用于历史参考；该文件已加入 `.gitignore`。

## 致谢与许可

本项目基于 [Academic Pages](https://github.com/academicpages/academicpages.github.io) 和 [Minimal Mistakes](https://github.com/mmistakes/minimal-mistakes) 主题生态修改。仓库代码遵循 [MIT License](LICENSE)；第三方字体、图片和资料请以各自的授权与来源说明为准。
