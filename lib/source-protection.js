// FIXpictures - 源代码保护模块
// 防止在浏览器开发者工具中直接查看源代码

class SourceProtection {
    constructor() {
        this.isDevToolsOpen = false;
        this.devToolsCheckInterval = null;
        this.debuggerDetectionCount = 0;
        this.maxDebuggerAttempts = 3;
        
        this.init();
    }

    init() {
        this.detectDevTools();
        this.disableContextMenu();
        this.disableTextSelection();
        this.blockDevToolsShortcuts();
        this.obfuscateCode();
        this.setupAntiDebugging();
        this.setupDevToolsDetection();
        this.preventInspection();
        this.addCopyProtection();
    }

    // 检测开发者工具是否打开
    detectDevTools() {
        // 方法1: 检测窗口大小变化
        const checkDevTools = () => {
            const widthThreshold = 200;
            const heightThreshold = 200;
            
            if (window.outerWidth - window.innerWidth > widthThreshold ||
                window.outerHeight - window.innerHeight > heightThreshold) {
                this.handleDevToolsDetection();
            }
        };

        // 方法2: 检测调试器
        const checkDebugger = () => {
            const startTime = Date.now();
            debugger;
            const endTime = Date.now();
            
            if (endTime - startTime > 100) {
                this.debuggerDetectionCount++;
                if (this.debuggerDetectionCount >= this.maxDebuggerAttempts) {
                    this.handleDevToolsDetection();
                }
            }
        };

        // 定期检查
        this.devToolsCheckInterval = setInterval(() => {
            checkDevTools();
            checkDebugger();
        }, 1000);

        // 监听窗口大小变化
        window.addEventListener('resize', checkDevTools);
    }

    // 设置开发者工具检测
    setupDevToolsDetection() {
        // 检测console方法被重写
        const originalConsole = {};
        ['log', 'warn', 'error', 'info'].forEach(method => {
            originalConsole[method] = console[method];
            console[method] = (...args) => {
                // 使用原始控制台方法记录，避免递归
                originalConsole[method].apply(console, ['⚠️ 控制台访问已被记录 -', ...args]);
                this.logDetectionEvent('console_access');
            };
        });

        // 检测Performance API访问
        const originalGetEntries = Performance.prototype.getEntries;
        Performance.prototype.getEntries = function() {
            this.handlePerformanceAccess();
            return originalGetEntries.apply(this, arguments);
        };

        // 检测调试器语句
        Object.defineProperty(window, 'debugger', {
            get: () => {
                this.handleDebuggerAccess();
                return function() {};
            },
            configurable: false
        });
    }

    // 禁用右键菜单
    disableContextMenu() {
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showProtectionMessage('右键菜单已禁用以保护源代码');
            return false;
        });

        // 禁用F12键
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
                e.preventDefault();
                this.showProtectionMessage('开发者工具快捷键已禁用');
                return false;
            }
        });
    }

    // 禁用文本选择
    disableTextSelection() {
        document.addEventListener('selectstart', (e) => {
            e.preventDefault();
            return false;
        });

        // 禁用复制功能
        document.addEventListener('copy', (e) => {
            e.preventDefault();
            this.showProtectionMessage('复制功能已禁用以保护源代码');
            return false;
        });

        // 禁用剪切功能
        document.addEventListener('cut', (e) => {
            e.preventDefault();
            return false;
        });

        // 设置CSS样式防止选择
        const style = document.createElement('style');
        style.textContent = `
            * {
                -webkit-user-select: none !important;
                -moz-user-select: none !important;
                -ms-user-select: none !important;
                user-select: none !important;
            }
            
            input, textarea {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 阻止开发者工具快捷键
    blockDevToolsShortcuts() {
        const blockedCombinations = [
            { ctrl: true, shift: true, key: 'I' },      // Ctrl+Shift+I
            { ctrl: true, shift: true, key: 'J' },      // Ctrl+Shift+J
            { ctrl: true, shift: true, key: 'C' },      // Ctrl+Shift+C
            { ctrl: true, key: 'U' },                    // Ctrl+U
            { key: 'F12' }                              // F12
        ];

        document.addEventListener('keydown', (e) => {
            for (const combo of blockedCombinations) {
                if ((combo.ctrl === undefined || combo.ctrl === e.ctrlKey) &&
                    (combo.shift === undefined || combo.shift === e.shiftKey) &&
                    (combo.alt === undefined || combo.alt === e.altKey) &&
                    e.key === combo.key) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.showProtectionMessage('开发者工具访问已被阻止');
                    return false;
                }
            }
        }, true);
    }

    // 代码混淆保护
    obfuscateCode() {
        // 重命名全局变量和函数（在实际项目中应使用构建工具）
        this.obfuscateGlobalObjects();
        
        // 添加虚假代码和干扰项
        this.addDecoyCode();
        
        // 字符串加密
        this.encryptStrings();
    }

    // 混淆全局对象
    obfuscateGlobalObjects() {
        // 在实际项目中，这应该通过构建工具完成
        // 这里只是演示概念
        const originalConsole = console;
        Object.defineProperty(window, 'console', {
            get: () => {
                this.handleConsoleAccess();
                return originalConsole;
            },
            configurable: false
        });
    }

    // 添加虚假代码
    addDecoyCode() {
        // 添加一些虚假的函数和变量来干扰分析
        window._decoyFunction1 = function() {
            return Math.random() * 1000;
        };
        
        window._fakeVariable = 'This is fake data';
        
        // 添加虚假的错误信息
        setTimeout(() => {
            try {
                throw new Error('Fake error for obfuscation');
            } catch (e) {
                // 忽略错误
            }
        }, 5000);
    }

    // 字符串加密（基础版本）
    encryptStrings() {
        // 简单的字符串混淆
        const strings = {
            'protection': 'cHJvdGVjdGlvbg==',
            'developer': 'ZGV2ZWxvcGVy',
            'tools': 'dG9vbHM='
        };
        
        window._encryptedStrings = strings;
    }

    // 设置反调试机制
    setupAntiDebugging() {
        // 检测调试器存在
        const checkDebugger = () => {
            const start = performance.now();
            debugger;
            const end = performance.now();
            
            if (end - start > 100) {
                this.handleDebuggerDetection();
            }
        };

        // 定期检查调试器
        setInterval(checkDebugger, 5000);
        
        // 检测无限循环中的调试器
        this.detectDebuggerInLoop();
    }

    // 防止检查
    preventInspection() {
        // 禁用查看源代码
        this.disableViewSource();
        
        // 禁用元素检查
        this.disableElementInspection();
        
        // 禁用网络面板检查
        this.disableNetworkInspection();
    }

    // 禁用查看源代码
    disableViewSource() {
        // 阻止Ctrl+U查看源代码
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                this.showProtectionMessage('查看源代码功能已禁用');
                return false;
            }
        });

        // 阻止右键查看源代码
        document.addEventListener('contextmenu', (e) => {
            if (e.button === 2) { // 右键
                e.preventDefault();
                this.showProtectionMessage('右键菜单已禁用以保护源代码');
                return false;
            }
        });
    }

    // 禁用元素检查
    disableElementInspection() {
        // 检测元素选择
        let lastElement = null;
        document.addEventListener('mouseover', (e) => {
            if (e.target !== lastElement) {
                lastElement = e.target;
                // 可以添加额外的检查逻辑
            }
        });

        // 阻止元素属性访问
        this.protectElementProperties();
    }

    // 保护元素属性
    protectElementProperties() {
        const originalQuerySelector = Document.prototype.querySelector;
        Document.prototype.querySelector = function(selector) {
            const element = originalQuerySelector.call(this, selector);
            if (element && this.isDevToolsOpen) {
                // 返回代理对象来保护真实元素
                return new Proxy(element, {
                    get(target, prop) {
                        if (prop === 'innerHTML' || prop === 'outerHTML') {
                            return '[受保护的内容]';
                        }
                        return target[prop];
                    }
                });
            }
            return element;
        };
    }

    // 禁用网络面板检查
    disableNetworkInspection() {
        // 重写XMLHttpRequest来隐藏敏感请求
        const originalXHR = window.XMLHttpRequest;
        window.XMLHttpRequest = function() {
            const xhr = new originalXHR();
            const originalOpen = xhr.open;
            
            xhr.open = function(method, url, ...args) {
                // 隐藏敏感URL
                if (url.includes('encrypt') || url.includes('decrypt')) {
                    url = '/protected/endpoint';
                }
                return originalOpen.call(this, method, url, ...args);
            };
            
            return xhr;
        };
    }

    // 添加复制保护
    addCopyProtection() {
        // 增强复制保护
        this.enhanceCopyProtection();
        
        // 保护剪贴板数据
        this.protectClipboardData();
        
        // 添加水印保护
        this.addWatermarkProtection();
    }

    // 增强复制保护
    enhanceCopyProtection() {
        // 禁用选择文本
        document.addEventListener('selectstart', (e) => {
            e.preventDefault();
            return false;
        });

        // 禁用拖拽选择
        document.addEventListener('dragstart', (e) => {
            e.preventDefault();
            return false;
        });

        // 禁用全选快捷键
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'a') {
                e.preventDefault();
                this.showProtectionMessage('全选功能已禁用');
                return false;
            }
        });

        // 添加CSS样式防止选择
        this.addAntiSelectionStyles();
    }

    // 添加防止选择的CSS样式
    addAntiSelectionStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* 防止文本选择 */
            * {
                -webkit-touch-callout: none !important;
                -webkit-user-select: none !important;
                -khtml-user-select: none !important;
                -moz-user-select: none !important;
                -ms-user-select: none !important;
                user-select: none !important;
                -webkit-tap-highlight-color: transparent !important;
            }
            
            /* 允许输入框选择 */
            input, textarea, [contenteditable="true"] {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
            }
            
            /* 隐藏选择高亮 */
            ::selection {
                background: transparent !important;
                color: inherit !important;
            }
            
            ::-moz-selection {
                background: transparent !important;
                color: inherit !important;
            }
            
            /* 防止图像拖拽 */
            img {
                -webkit-user-drag: none !important;
                -khtml-user-drag: none !important;
                -moz-user-drag: none !important;
                -o-user-drag: none !important;
                user-drag: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 保护剪贴板数据
    protectClipboardData() {
        // 监听复制事件
        document.addEventListener('copy', (e) => {
            e.preventDefault();
            
            // 设置保护文本到剪贴板
            const protectedText = '⚠️ 此内容受源代码保护，禁止复制。';
            e.clipboardData.setData('text/plain', protectedText);
            
            this.showProtectionMessage('复制功能已禁用以保护源代码');
            return false;
        });

        // 监听剪切事件
        document.addEventListener('cut', (e) => {
            e.preventDefault();
            this.showProtectionMessage('剪切功能已禁用');
            return false;
        });

        // 监听粘贴事件（可选）
        document.addEventListener('paste', (e) => {
            // 可以添加粘贴内容检查
            const pastedData = e.clipboardData.getData('text');
            if (pastedData.includes('script') || pastedData.includes('javascript')) {
                e.preventDefault();
                this.showProtectionMessage('检测到可疑粘贴内容，已阻止');
                return false;
            }
        });
    }

    // 添加水印保护
    addWatermarkProtection() {
        // 添加隐形水印到页面
        this.addInvisibleWatermark();
        
        // 添加可见水印
        this.addVisibleWatermark();
    }

    // 添加隐形水印
    addInvisibleWatermark() {
        // 在页面中添加隐藏的标识
        const watermark = document.createElement('div');
        watermark.style.cssText = `
            position: fixed;
            bottom: 5px;
            right: 5px;
            font-size: 1px;
            color: transparent;
            z-index: -1;
            pointer-events: none;
        `;
        watermark.textContent = 'FIXpictures Source Protected ' + Date.now();
        document.body.appendChild(watermark);
    }

    // 添加可见水印
    addVisibleWatermark() {
        const watermark = document.createElement('div');
        watermark.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 40px;
            color: rgba(0, 0, 0, 0.03);
            z-index: 9999;
            pointer-events: none;
            white-space: nowrap;
            font-weight: bold;
        `;
        watermark.textContent = 'FIXpictures Protected';
        document.body.appendChild(watermark);

        // 只在开发者工具打开时显示
        watermark.style.display = this.isDevToolsOpen ? 'block' : 'none';
        
        // 监听开发者工具状态变化
        setInterval(() => {
            watermark.style.display = this.isDevToolsOpen ? 'block' : 'none';
        }, 1000);
    }

    // 检测循环中的调试器
    detectDebuggerInLoop() {
        let counter = 0;
        const maxIterations = 1000000;
        
        const loop = () => {
            counter++;
            if (counter > maxIterations) return;
            
            // 插入调试器检测点
            if (counter % 10000 === 0) {
                const start = Date.now();
                debugger;
                const end = Date.now();
                
                if (end - start > 50) {
                    this.handleDebuggerDetection();
                }
            }
            
            requestAnimationFrame(loop);
        };
        
        loop();
    }

    // 处理开发者工具检测
    handleDevToolsDetection() {
        if (this.isDevToolsOpen) return;
        
        this.isDevToolsOpen = true;
        console.warn('⚠️ 检测到开发者工具访问，源代码保护已激活');
        
        // 显示警告信息
        this.showProtectionWarning();
        
        // 限制功能访问
        this.limitFunctionality();
        
        // 记录检测事件
        this.logDetectionEvent('dev_tools');
    }

    // 处理控制台访问
    handleConsoleAccess() {
        console.warn('控制台访问已被记录');
        this.logDetectionEvent('console_access');
    }

    // 处理性能API访问
    handlePerformanceAccess() {
        this.logDetectionEvent('performance_access');
    }

    // 处理调试器访问
    handleDebuggerAccess() {
        this.debuggerDetectionCount++;
        if (this.debuggerDetectionCount >= this.maxDebuggerAttempts) {
            this.handleDevToolsDetection();
        }
    }

    // 处理调试器检测
    handleDebuggerDetection() {
        console.warn('⚠️ 检测到调试器活动');
        this.showProtectionMessage('检测到调试活动，请关闭调试器');
        this.logDetectionEvent('debugger_detected');
    }

    // 显示保护警告
    showProtectionWarning() {
        const warningDiv = document.createElement('div');
        warningDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background: linear-gradient(45deg, #ff6b6b, #ff8e53);
            color: white;
            padding: 15px;
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
        `;
        warningDiv.innerHTML = `
            ⚠️ 源代码保护警告：检测到开发者工具访问。为保护知识产权，部分功能可能受限。
        `;
        document.body.appendChild(warningDiv);

        // 10秒后自动隐藏
        setTimeout(() => {
            if (warningDiv.parentNode) {
                warningDiv.parentNode.removeChild(warningDiv);
            }
        }, 10000);
    }

    // 显示保护消息
    showProtectionMessage(message) {
        const msgDiv = document.createElement('div');
        msgDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 20px 30px;
            border-radius: 10px;
            z-index: 10000;
            font-size: 14px;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        `;
        msgDiv.textContent = message;
        document.body.appendChild(msgDiv);

        setTimeout(() => {
            if (msgDiv.parentNode) {
                msgDiv.parentNode.removeChild(msgDiv);
            }
        }, 3000);
    }

    // 限制功能访问
    limitFunctionality() {
        // 禁用图片上传
        const fileInput = document.getElementById('ipt');
        if (fileInput) {
            fileInput.disabled = true;
            fileInput.title = '开发者工具检测：功能已禁用';
        }

        // 禁用主要功能按钮
        const criticalButtons = ['enc', 'dec'];
        criticalButtons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.disabled = true;
                button.style.opacity = '0.3';
                button.title = '开发者工具检测：核心功能已禁用';
            }
        });
    }

    // 记录检测事件
    logDetectionEvent(type) {
        const eventData = {
            type: type,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        console.log('源代码保护事件:', eventData);

        // 本地存储记录
        try {
            const protectionHistory = JSON.parse(localStorage.getItem('source_protection_history') || '[]');
            protectionHistory.push(eventData);
            if (protectionHistory.length > 20) {
                protectionHistory.shift();
            }
            localStorage.setItem('source_protection_history', JSON.stringify(protectionHistory));
        } catch (e) {
            // 忽略存储错误
        }
    }

    // 清理资源
    destroy() {
        if (this.devToolsCheckInterval) {
            clearInterval(this.devToolsCheckInterval);
        }
    }
}

// 创建全局实例
window.sourceProtection = new SourceProtection();

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SourceProtection;
}