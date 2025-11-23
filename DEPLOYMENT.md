# FIXpictures 项目部署指南

## Cloudflare Pages 部署说明

### 前置要求
- Cloudflare 账户
- GitHub 账户
- 项目代码已推送到 GitHub 仓库

### 部署步骤

#### 1. 准备 GitHub 仓库
1. 在 GitHub 上创建新仓库（如：`XQGIN/fix-picture`）
2. 将本地代码推送到 GitHub：
   ```bash
   git init
   git add .
   git commit -m "Initial commit: FIXpictures project with anti-crawler protection"
   git branch -M main
   git remote add origin https://github.com/XQGIN/fix-picture.git
   git push -u origin main
   ```

#### 2. Cloudflare Pages 部署
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 选择 "Pages" 服务
3. 点击 "Create a project"
4. 选择 "Connect to Git"
5. 授权访问你的 GitHub 账户
6. 选择 `XQGIN/fix-picture` 仓库
7. 配置部署设置：
   - **项目名称**: `fixpictures`（或自定义）
   - **生产分支**: `main`
   - **构建设置**:
     - 框架预设：`None`
     - 构建命令：留空（静态站点）
     - 构建输出目录：`.`
8. 点击 "Save and Deploy"

#### 3. 自定义域名（可选）
1. 在 Pages 项目设置中，选择 "Custom domains"
2. 添加你的自定义域名
3. 按照提示配置 DNS 记录

### 防爬虫机制说明

#### 已实现的防护措施

1. **HTML Meta 标签防护**
   - 禁止搜索引擎索引页面内容
   - 限制爬虫跟踪链接
   - 设置内容安全策略

2. **robots.txt 文件**
   - 禁止所有爬虫访问
   - 特别限制常见搜索引擎爬虫
   - 设置爬取延迟和站点地图限制

3. **JavaScript 客户端检测**
   - 检测人类行为（鼠标移动、键盘输入）
   - 识别爬虫特征（无头浏览器、自动化工具）
   - 限制爬虫功能（禁用上传和按钮）

4. **Cloudflare Worker 服务器端防护**
   - 检测爬虫用户代理
   - 识别异常请求模式
   - 返回限制访问的响应

5. **安全头配置**
   - 防止点击劫持（X-Frame-Options）
   - 防止 MIME 类型嗅探（X-Content-Type-Options）
   - 限制权限（Permissions-Policy）

### 部署验证

#### 1. 功能测试
部署完成后，访问你的 Pages 网址：
- 测试图片上传和处理功能
- 验证主题切换功能
- 检查响应式设计

#### 2. 防爬虫测试
使用以下工具测试防护效果：
```bash
# 使用 curl 模拟爬虫请求
curl -A "Googlebot/2.1" https://your-domain.pages.dev/

# 使用 Python requests 测试
python -c "import requests; print(requests.get('https://your-domain.pages.dev/').text)"
```

#### 3. 安全头验证
使用在线工具检查安全头：
- [SecurityHeaders.com](https://securityheaders.com)
- [Mozilla Observatory](https://observatory.mozilla.org)

### 故障排除

#### 常见问题

1. **部署失败**
   - 检查 `wrangler.toml` 配置
   - 验证文件路径和权限
   - 查看 Cloudflare 构建日志

2. **防爬虫机制过于严格**
   - 调整 `anti-crawler.js` 中的检测阈值
   - 修改 `_worker.js` 中的用户代理检测规则

3. **功能异常**
   - 检查浏览器控制台错误
   - 验证静态资源加载
   - 测试不同浏览器兼容性

#### 日志和监控
- Cloudflare Pages 提供详细的构建和部署日志
- 使用 Cloudflare Analytics 监控访问情况
- 设置告警规则检测异常访问

### 维护和更新

#### 定期检查
1. 监控访问日志，检测爬虫活动
2. 更新防爬虫规则，应对新的爬虫技术
3. 定期测试防护效果

#### 安全更新
1. 关注 Cloudflare 安全公告
2. 及时更新依赖库
3. 定期审查安全配置

### 技术支持

如有问题，请参考：
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- 项目 GitHub Issues

---

**注意**: 本防护机制旨在保护服务安全，但无法提供绝对的安全保障。建议结合其他安全措施，如速率限制、WAF 规则等，提供更全面的保护。