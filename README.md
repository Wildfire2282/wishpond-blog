# 生成式许愿井

一个面向中文技术写作与个人表达的克制型 Hugo 博客主题。仓库同时包含主题源码和用于验证主题的示例站点。


## 特性

- 响应式首页、文章列表、主题、标签、归档、搜索和 404 页面
- 文章目录、相关文章、阅读进度和可选首字下沉
- 无第三方前端依赖，CSS 和 JavaScript 由 Hugo Pipes 压缩并生成指纹
- 键盘导航、减少动画偏好、结构化数据和 ASCII URL 约束
- Hugo 0.164 新模板系统

## 本地预览

需要 Hugo 0.164.0 或更高版本：

```sh
hugo server -D
```

访问 `http://localhost:1313/`。

生产构建可使用：

```sh
hugo --gc --minify
```

严格发布检查：

```sh
hugo --gc --minify --cleanDestinationDir --panicOnWarning --printPathWarnings
```

## 安装主题

将 `themes/wishpond` 复制到 Hugo 站点的 `themes/` 目录，并在配置中启用：

```toml
theme = "wishpond"
```

完整的必需配置和内容结构位于 `themes/wishpond/exampleSite/`。本仓库根目录包含主题开发用的示例内容，不代表存在在线演示站点。

## 创建文章

```sh
hugo new content posts/my-new-post/index.md
```

文章使用一个长期主题和若干标签：

```yaml
topics:
  - "工程实践"
tags:
  - "调试"
  - "可观测性"
featured: false
toc: true
related: true
dropCap: false
```

将 `featured` 设为 `true` 可进入首页精选区域；有多篇精选文章时，首页展示发布日期最新的一篇。

每篇 `posts` 文章必须设置非空 `description`、小写英文 `slug`，并且恰好属于一个 `topics` 主题。模板会在构建时验证这些约束。

## 链接约定

所有公开 URL 必须只包含 ASCII 字符：

- 文章必须在 front matter 中设置英文 `slug`。
- 新增主题或标签时，在对应的 `content/topics/<名称>/_index.md` 或 `content/tags/<名称>/_index.md` 中设置英文 `slug` 和明确的 ASCII `url`。
- 中文 Markdown 标题需要添加英文 ID，例如 `## 标题 {#english-heading-id}`。

站点默认使用 Goldmark 的 `github-ascii` 标题 ID 规则，避免自动生成中文片段链接。

## 站点配置

发布前请修改 `hugo.toml` 中的 `baseURL`。站点名称、副标题和 SEO 描述分别由 `title`、`params.tagline` 和 `params.description` 控制。

搜索功能依赖首页同时输出 HTML 和 JSON：

```toml
[outputs]
  home = ["HTML", "JSON"]
```

主题按简体中文界面设计，并约定文章位于 `content/posts/`，使用 `topics` 和 `tags` 两个 taxonomy。搜索、归档和关于页面的示例见 `themes/wishpond/exampleSite/content/`。

## 部署

根目录 `static/_headers` 是站点开发用的静态托管安全头示例，不属于主题文件。启用 CSP 或 HSTS 前应根据自己的域名、资源来源和托管平台进行审核。

## 许可证

主题、模板、样式、脚本和项目配置采用 [MIT License](LICENSE)。`content/` 下的示例文章不包含在 MIT 授权中，除非文章自身另有声明。第三方项目仍保留各自的许可证和版权。
