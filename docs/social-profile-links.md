# Follow 社交账号配置

编辑 `_config.yml` 的 `author:` 部分。三个入口显示在 BiliBili 后面，顺序固定为 **Weibo → TikTok → RedNote**。建议全部填写完整的公开个人主页网址，并用英文双引号包住。留空时对应入口不显示。

```yaml
author:
  # 保留原有的其他 author 字段。
  weibo: "https://weibo.com/u/你的微博UID"
  douyin: "https://www.douyin.com/user/你的主页ID"
  xiaohongshu: "https://www.xiaohongshu.com/user/profile/你的主页ID"
```

示例中的“你的…”必须替换成真实网址。只需要公开主页链接，无需密码、验证码、Cookie 或自己做编码转换。

| 页面名称 | 配置字段 | 主页地址与用户标识 |
| --- | --- | --- |
| Weibo | `author.weibo` | 建议复制完整主页网址，例如 `https://weibo.com/u/数字UID`；自定义个人主页网址也可。兼容旧的用户名/UID 配置。 |
| TikTok | `author.douyin` | 填实际使用的完整主页网址。国内抖音常见格式为 `https://www.douyin.com/user/MS4wLjABAAAA…`，这里的字符串是主页 ID，不能直接用展示的“抖音号”代替。如果使用国际版 TikTok，直接填 `https://www.tiktok.com/@你的用户名`。 |
| RedNote | `author.xiaohongshu` | 常见格式为 `https://www.xiaohongshu.com/user/profile/一串字符`。直接复制完整网址即可，不要用主页展示的“小红书号”来拼接。 |

## 如何找到主页网址

最简单的方法是在电脑浏览器登录对应网站，点击自己的头像，进入自己的**个人主页**，复制地址栏的完整网址。

手机上可进入“我”或个人主页，从右上角的分享入口查找“复制链接”。不同版本的分享入口位置可能有所不同。若复制出来含有介绍文字，只保留网址；若是短链接，可以先在浏览器打开，确认显示的是自己的主页，再复制跳转后的完整网址。不要误复制某条微博、视频或笔记的链接。

如果个人主页分享链接带有查询参数，可先完整保留，并用双引号包住；模板会正确转义 URL 中的 `&` 等字符。无需手工编码。

修改 `_config.yml` 后需重新启动本地 Jekyll 服务；发布后等待网站构建完成。

## 图标

- Weibo：现有 Font Awesome 微博品牌图标。
- TikTok：现有 Font Awesome TikTok 品牌图标。
- RedNote：本地内嵌 SVG，来自 [Simple Icons 的小红书标识](https://github.com/simple-icons/simple-icons/blob/develop/icons/xiaohongshu.svg)。不依赖远程图标加载。

微博 UID 与个人主页网址示例可参考[微博官方客服说明](https://kefu.weibo.com/faqdetail?id=12701)。
