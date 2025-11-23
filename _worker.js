// Cloudflare Worker - FIXpictures 防爬虫防护
// 在服务器端提供额外的爬虫检测和防护

export default {
    async fetch(request, env, ctx) {
        // 解析请求URL
        const url = new URL(request.url);
        
        // 检测爬虫用户代理
        const userAgent = request.headers.get('User-Agent') || '';
        const isBot = this.detectBotUserAgent(userAgent);
        
        // 检测异常请求模式
        const isSuspicious = this.detectSuspiciousRequest(request);
        
        // 如果是爬虫或可疑请求，返回限制访问的响应
        if (isBot || isSuspicious) {
            return this.handleBotRequest(request, isBot, isSuspicious);
        }
        
        // 正常请求，继续处理
        return this.handleNormalRequest(request);
    },
    
    // 检测爬虫用户代理
    detectBotUserAgent(userAgent) {
        const botPatterns = [
            'bot', 'crawler', 'spider', 'scraper', 'fetcher',
            'googlebot', 'bingbot', 'slurp', 'baiduspider',
            'yandexbot', 'duckduckbot', 'facebookexternalhit',
            'twitterbot', 'linkedinbot', 'applebot', 'petalbot',
            'ahrefs', 'semrush', 'mj12bot', 'dotbot', 'megaindex',
            'python', 'requests', 'curl', 'wget', 'java',
            'go-http-client', 'node-fetch', 'axios'
        ];
        
        const ua = userAgent.toLowerCase();
        return botPatterns.some(pattern => ua.includes(pattern));
    },
    
    // 检测可疑请求
    detectSuspiciousRequest(request) {
        const url = new URL(request.url);
        
        // 检测异常请求头
        const headers = request.headers;
        const suspiciousHeaders = [
            headers.get('X-Requested-With') === 'XMLHttpRequest' && !headers.get('Accept')?.includes('application/json'),
            headers.get('Accept') === '*/*',
            !headers.get('Accept-Language'),
            headers.get('Accept-Encoding') === 'identity',
            headers.get('Connection') === 'close'
        ];
        
        // 检测异常请求参数
        const suspiciousParams = [
            url.searchParams.has('debug'),
            url.searchParams.has('test'),
            url.searchParams.has('crawl'),
            url.searchParams.has('scrape')
        ];
        
        // 检测异常路径
        const suspiciousPaths = [
            url.pathname.includes('admin'),
            url.pathname.includes('wp-admin'),
            url.pathname.includes('phpmyadmin'),
            url.pathname.includes('.env'),
            url.pathname.includes('config')
        ];
        
        return suspiciousHeaders.some(Boolean) || 
               suspiciousParams.some(Boolean) || 
               suspiciousPaths.some(Boolean);
    },
    
    // 处理爬虫请求
    async handleBotRequest(request, isBot, isSuspicious) {
        const url = new URL(request.url);
        
        // 对于robots.txt，正常返回
        if (url.pathname === '/robots.txt') {
            return this.handleNormalRequest(request);
        }
        
        // 记录爬虫访问
        await this.logBotAccess(request, isBot, isSuspicious);
        
        // 返回限制访问的响应
        return new Response(this.getBotResponseContent(), {
            status: 403,
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'X-Robots-Tag': 'noindex, nofollow, noarchive',
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
    },
    
    // 获取爬虫响应内容
    getBotResponseContent() {
        return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>访问限制 - FIXpictures</title>
    <meta name="robots" content="noindex, nofollow, noarchive">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            margin: 0;
            padding: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            text-align: center;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            max-width: 500px;
        }
        h1 {
            font-size: 2.5rem;
            margin-bottom: 20px;
        }
        p {
            font-size: 1.1rem;
            line-height: 1.6;
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚫 访问限制</h1>
        <p>检测到自动化访问请求，为了保护服务安全，已限制访问。</p>
        <p>FIXpictures 是一个面向人类用户的图片处理工具，不支持自动化访问。</p>
        <p><small>如果是误报，请使用正常的浏览器访问。</small></p>
    </div>
</body>
</html>`;
    },
    
    // 处理正常请求
    async handleNormalRequest(request) {
        // 添加安全头
        const response = await fetch(request);
        const newHeaders = new Headers(response.headers);
        
        // 添加安全头
        newHeaders.set('X-Frame-Options', 'DENY');
        newHeaders.set('X-Content-Type-Options', 'nosniff');
        newHeaders.set('Referrer-Policy', 'no-referrer');
        newHeaders.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
        newHeaders.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
        
        // 对于HTML文件，添加额外的缓存控制
        if (request.url.endsWith('.html') || !request.url.includes('.')) {
            newHeaders.set('Cache-Control', 'no-store, no-cache, must-revalidate');
            newHeaders.set('Pragma', 'no-cache');
            newHeaders.set('Expires', '0');
        }
        
        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders
        });
    },
    
    // 记录爬虫访问（简化版，实际使用时可以发送到日志服务）
    async logBotAccess(request, isBot, isSuspicious) {
        const logData = {
            timestamp: new Date().toISOString(),
            ip: request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown',
            userAgent: request.headers.get('User-Agent') || 'unknown',
            url: request.url,
            isBot: isBot,
            isSuspicious: isSuspicious,
            country: request.headers.get('CF-IPCountry') || 'unknown',
            cfRay: request.headers.get('CF-Ray') || 'unknown'
        };
        
        // 在实际部署中，可以将日志发送到日志服务
        console.log('Bot access detected:', JSON.stringify(logData));
    }
};