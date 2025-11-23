// FIXpictures - 防爬虫检测脚本
// 用于检测和阻止自动化爬虫访问

class AntiCrawler {
    constructor() {
        this.isHuman = false;
        this.botDetectionScore = 0;
        this.maxDetectionScore = 10;
        this.init();
    }

    init() {
        this.detectHumanBehavior();
        this.setupEventListeners();
        this.checkForBots();
    }

    // 检测人类行为
    detectHumanBehavior() {
        // 检测鼠标移动
        document.addEventListener('mousemove', () => {
            this.isHuman = true;
            this.botDetectionScore = Math.max(0, this.botDetectionScore - 2);
        }, { once: true });

        // 检测键盘输入
        document.addEventListener('keydown', () => {
            this.isHuman = true;
            this.botDetectionScore = Math.max(0, this.botDetectionScore - 2);
        }, { once: true });

        // 检测触摸事件
        document.addEventListener('touchstart', () => {
            this.isHuman = true;
            this.botDetectionScore = Math.max(0, this.botDetectionScore - 2);
        }, { once: true });

        // 检测点击事件
        document.addEventListener('click', () => {
            this.isHuman = true;
            this.botDetectionScore = Math.max(0, this.botDetectionScore - 1);
        });

        // 检测滚动事件
        document.addEventListener('scroll', () => {
            this.isHuman = true;
            this.botDetectionScore = Math.max(0, this.botDetectionScore - 1);
        }, { passive: true });
    }

    // 设置事件监听器
    setupEventListeners() {
        // 检测页面焦点变化
        window.addEventListener('focus', () => {
            this.isHuman = true;
        });

        window.addEventListener('blur', () => {
            this.botDetectionScore += 1;
        });

        // 检测页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.botDetectionScore += 1;
            } else {
                this.isHuman = true;
            }
        });
    }

    // 检测爬虫特征
    checkForBots() {
        // 检测无头浏览器特征
        this.detectHeadlessBrowser();
        
        // 检测自动化工具特征
        this.detectAutomationTools();
        
        // 检测爬虫用户代理
        this.detectBotUserAgent();
        
        // 检测异常行为模式
        this.detectAbnormalBehavior();
    }

    // 检测无头浏览器
    detectHeadlessBrowser() {
        // 检测Chrome无头模式
        if (window.chrome && window.chrome.runtime && window.chrome.runtime.onConnect) {
            // 正常Chrome浏览器
        } else if (window.chrome && window.chrome.runtime) {
            this.botDetectionScore += 2;
        }

        // 检测PhantomJS
        if (window.callPhantom || window._phantom) {
            this.botDetectionScore += 3;
        }

        // 检测Puppeteer
        if (window.__nightmare || window._selenium) {
            this.botDetectionScore += 3;
        }

        // 检测WebDriver
        if (navigator.webdriver) {
            this.botDetectionScore += 3;
        }

        // 检测插件数量异常
        if (navigator.plugins.length === 0) {
            this.botDetectionScore += 1;
        }

        // 检测语言设置异常
        if (!navigator.language && !navigator.languages) {
            this.botDetectionScore += 1;
        }
    }

    // 检测自动化工具
    detectAutomationTools() {
        // 检测Selenium
        const seleniumIndicators = [
            '__webdriver_evaluate',
            '__selenium_evaluate',
            '__webdriver_script_function',
            '__webdriver_script_func',
            '__webdriver_script_fn',
            '__fxdriver_evaluate',
            '__driver_evaluate',
            '__webdriver_unwrapped'
        ];

        seleniumIndicators.forEach(indicator => {
            if (window[indicator]) {
                this.botDetectionScore += 2;
            }
        });

        // 检测自动化属性
        if (document.documentElement.getAttribute('selenium') ||
            document.documentElement.getAttribute('webdriver') ||
            document.documentElement.getAttribute('driver')) {
            this.botDetectionScore += 2;
        }
    }

    // 检测爬虫用户代理
    detectBotUserAgent() {
        const userAgent = navigator.userAgent.toLowerCase();
        const botPatterns = [
            'bot', 'crawler', 'spider', 'scraper', 'fetcher',
            'googlebot', 'bingbot', 'slurp', 'baiduspider',
            'yandexbot', 'duckduckbot', 'facebookexternalhit',
            'twitterbot', 'linkedinbot', 'applebot', 'petalbot',
            'ahrefs', 'semrush', 'mj12bot', 'dotbot', 'megaindex'
        ];

        botPatterns.forEach(pattern => {
            if (userAgent.includes(pattern)) {
                this.botDetectionScore += 3;
            }
        });

        // 检测异常的用户代理字符串
        if (userAgent.length < 20 || userAgent.length > 500) {
            this.botDetectionScore += 1;
        }

        // 检测缺少用户代理
        if (!userAgent) {
            this.botDetectionScore += 2;
        }
    }

    // 检测异常行为模式
    detectAbnormalBehavior() {
        // 检测页面加载后立即执行的操作
        setTimeout(() => {
            if (!this.isHuman && this.botDetectionScore > 5) {
                this.handleBotDetection();
            }
        }, 3000);

        // 检测快速连续操作
        let lastInteractionTime = Date.now();
        document.addEventListener('click', () => {
            const now = Date.now();
            if (now - lastInteractionTime < 100) {
                this.botDetectionScore += 1;
            }
            lastInteractionTime = now;
        });
    }

    // 处理爬虫检测
    handleBotDetection() {
        if (this.botDetectionScore >= this.maxDetectionScore) {
            console.warn('检测到可能的爬虫行为，已采取防护措施');
            
            // 限制功能访问
            this.limitFunctionality();
            
            // 显示警告信息
            this.showWarningMessage();
            
            // 记录检测事件
            this.logDetectionEvent();
        }
    }

    // 限制功能访问
    limitFunctionality() {
        // 禁用图片上传功能
        const fileInput = document.getElementById('ipt');
        if (fileInput) {
            fileInput.disabled = true;
            fileInput.title = '检测到异常访问，功能已暂时禁用';
        }

        // 禁用按钮功能
        const buttons = ['paste', 'enc', 'dec', 're'];
        buttons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.disabled = true;
                button.style.opacity = '0.5';
                button.title = '检测到异常访问，功能已暂时禁用';
            }
        });

        // 禁用拖放功能
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'none';
        });

        document.addEventListener('drop', (e) => {
            e.preventDefault();
            this.showTemporaryMessage('检测到异常访问，拖放功能已禁用');
        });
    }

    // 显示警告信息
    showWarningMessage() {
        const warningDiv = document.createElement('div');
        warningDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff6b6b;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
            font-size: 14px;
            max-width: 300px;
        `;
        warningDiv.innerHTML = `
            <strong>⚠️ 安全警告</strong><br>
            检测到异常访问模式，部分功能已暂时禁用。<br>
            <small>如果是误报，请进行正常的人类交互操作。</small>
        `;
        document.body.appendChild(warningDiv);

        // 10秒后自动隐藏
        setTimeout(() => {
            if (warningDiv.parentNode) {
                warningDiv.parentNode.removeChild(warningDiv);
            }
        }, 10000);
    }

    // 显示临时消息
    showTemporaryMessage(message) {
        const msgDiv = document.createElement('div');
        msgDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            z-index: 10000;
            font-size: 14px;
        `;
        msgDiv.textContent = message;
        document.body.appendChild(msgDiv);

        setTimeout(() => {
            if (msgDiv.parentNode) {
                msgDiv.parentNode.removeChild(msgDiv);
            }
        }, 3000);
    }

    // 记录检测事件
    logDetectionEvent() {
        const detectionData = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            score: this.botDetectionScore,
            url: window.location.href,
            referrer: document.referrer
        };

        // 可以发送到服务器进行记录
        console.log('爬虫检测事件:', detectionData);

        // 本地存储检测记录（可选）
        try {
            const detectionHistory = JSON.parse(localStorage.getItem('bot_detection_history') || '[]');
            detectionHistory.push(detectionData);
            // 只保留最近10条记录
            if (detectionHistory.length > 10) {
                detectionHistory.shift();
            }
            localStorage.setItem('bot_detection_history', JSON.stringify(detectionHistory));
        } catch (e) {
            // 忽略存储错误
        }
    }

    // 验证是否为人类访问
    verifyHumanAccess() {
        return this.isHuman && this.botDetectionScore < this.maxDetectionScore;
    }

    // 重置检测状态（用于调试）
    resetDetection() {
        this.isHuman = false;
        this.botDetectionScore = 0;
    }
}

// 创建全局实例
window.antiCrawler = new AntiCrawler();

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AntiCrawler;
}