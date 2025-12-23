# Academic Pages - 个人学术主页模板

<div align="center">

[![GitHub stars](https://img.shields.io/github/stars/LarryHYQ/larryhyq.github.io)](https://github.com/LarryHYQ/larryhyq.github.io)
[![GitHub forks](https://img.shields.io/github/forks/LarryHYQ/larryhyq.github.io)](https://github.com/LarryHYQ/larryhyq.github.io)
[![GitHub license](https://img.shields.io/github/license/academicpages/academicpages.github.io?color=blue)](https://github.com/LarryHYQ/larryhyq.github.io/blob/main/LICENSE)

</div>

**Academic Pages** 是一个专为个人和专业学术作品集网站设计的 GitHub Pages 模板。

![Academic Pages 模板示例](images/themes/homepage-light.png "Academic Pages 模板示例")

## 🚀 快速开始

1. 如果您还没有 GitHub 账号，请先注册并确认您的电子邮件（必须！）。
2. 点击右上角的 **"Use this template"** 按钮。
3. 在 "New repository" 页面上，输入您的公开仓库名称为 `[您的GitHub用户名].github.io`，这也将是您网站的 URL。
4. 设置全站配置并添加您的内容。
5. 将任何文件（如 PDF、.zip 文件等）上传到 `files/` 目录。它们将可以通过 `https://[您的GitHub用户名].github.io/files/example.pdf` 访问。
6. 通过进入仓库设置中的 "GitHub pages" 部分检查状态。
7. （可选）使用 `markdown_generator` 文件夹中的 Jupyter notebooks 或 python 脚本，从 TSV 文件生成出版物和演讲的 markdown 文件。

更多信息请访问 [https://academicpages.github.io/](https://academicpages.github.io/)

## 💻 本地运行

在初步构建网站时，能够在推送到 GitHub 之前在本地预览更改是非常有用的。要在本地工作，您需要：

1. 克隆仓库并按照上述说明进行更新。

### 使用 IDE 本地开发

1. 确保您已安装 `ruby-dev`、`bundler` 和 `nodejs`。
    
    在大多数 Linux 发行版和 [Windows Subsystem Linux (WSL)](https://learn.microsoft.com/zh-cn/windows/wsl/about) 上，命令如下：
    ```bash
    sudo apt install ruby-dev ruby-bundler nodejs
    ```
    如果遇到错误 `Unable to locate package ruby-bundler` 或 `Unable to locate package nodejs`，请运行：
    ```bash
    sudo apt update && sudo apt upgrade -y
    ```
    然后再次尝试运行安装命令。

    在 macOS 上，命令如下：
    ```bash
    brew install ruby
    brew install node
    gem install bundler
    ```

2. 运行 `bundle install` 安装 Ruby 依赖项。如果遇到错误，请删除 `Gemfile.lock` 并重试。

    如果遇到文件权限错误，如 `Fetching bundler-2.6.3.gem ERROR: While executing gem (Gem::FilePermissionError)`，建议在本地安装 Gems：
    ```bash
    bundle config set --local path 'vendor/bundle'
    ```
    然后再次运行 `bundle install`。成功后，您应该会看到 `vendor` 和 `.bundle` 文件夹。

3. 运行 `jekyll serve -l -H localhost` 生成 HTML 并在 `localhost:4000` 上提供服务。本地服务器会在更改时自动重建并刷新页面。
    您也可以尝试 `bundle exec jekyll serve -l -H localhost` 以确保 Jekyll 使用您本地机器上的特定依赖项。

如果您在 Linux 上运行，可能需要安装一些额外的依赖项：`sudo apt install build-essential gcc make`。

## 🐳 使用 Docker

在不同的操作系统上工作，或者只是想避免安装依赖项？如果您安装了 [Docker](https://www.docker.com/)，可以使用提供的 `Dockerfile` 构建一个容器来为您运行网站。

在仓库中运行以下命令来构建并执行容器：

```bash
chmod -R 777 .
docker compose up
```

现在您应该可以通过 `localhost:4000` 访问网站了。

### 在 VS Code 中使用 DevContainer

如果您使用 [Visual Studio Code](https://code.visualstudio.com/)，可以使用此仓库自带的 [Dev Container](https://code.visualstudio.com/docs/devcontainers/containers)。通常 VS Code 会检测到开发容器配置可用，并询问您是否要使用容器。如果没有发生这种情况，您可以手动启动容器：**F1 -> DevContainer: Reopen in Container**。这将在容器中重启您的 VS Code，并自动在 http://localhost:4000 本地托管您的学术主页。所有更改将在几秒钟后实时更新到该页面。

## 🔧 维护与致谢

本项目基于 [Academic Pages](https://github.com/academicpages/academicpages.github.io) 模板修改。

原始项目由 [Stuart Geiger](https://github.com/staeiou) 从 [Minimal Mistakes Jekyll Theme](https://mmistakes.github.io/minimal-mistakes/) 分叉（然后分离），后者由 Michael Rose © 2016 创建并在 MIT 许可下发布。目前由 [Robert Zupko](https://github.com/rjzupkoii) 维护。

如果您有关于模板的错误报告或功能请求，请[通过 GitHub 提交](https://github.com/academicpages/academicpages.github.io/issues/new/choose)。关于如何设置模板样式的问题，请随时在 [GitHub 上发起新的讨论](https://github.com/academicpages/academicpages.github.io/discussions)。

---
*感谢原作者及社区的贡献。*
