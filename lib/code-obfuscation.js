// FIXpictures - 代码混淆和加密保护模块
// 提供JavaScript代码混淆和字符串加密功能

class CodeObfuscation {
    constructor() {
        this.obfuscationEnabled = true;
        this.encryptionKey = this.generateEncryptionKey();
        this.init();
    }

    init() {
        if (this.obfuscationEnabled) {
            this.obfuscateGlobalFunctions();
            this.encryptSensitiveStrings();
            this.addDecoyCode();
            this.protectCriticalFunctions();
            this.setupSelfDefense();
        }
    }

    // 生成加密密钥
    generateEncryptionKey() {
        const timestamp = Date.now().toString();
        const random = Math.random().toString(36).substring(2);
        return btoa(timestamp + random).substring(0, 16);
    }

    // 混淆全局函数
    obfuscateGlobalFunctions() {
        // 重命名关键函数（在实际项目中应使用构建工具）
        this.obfuscateFunctionNames();
        
        // 包装关键函数
        this.wrapCriticalFunctions();
    }

    // 混淆函数名称
    obfuscateFunctionNames() {
        // 创建混淆的函数映射
        const functionMap = {
            'encryptImage': '_x1a2b3c',
            'decryptImage': '_y4d5e6f',
            'handleFileUpload': '_z7g8h9i',
            'processImageData': '_a0j1k2l'
        };

        // 在实际项目中，这应该通过构建工具完成
        // 这里只是演示概念
        window._functionMap = functionMap;
    }

    // 包装关键函数
    wrapCriticalFunctions() {
        // 包装加密函数
        this.wrapEncryptionFunctions();
        
        // 包装图像处理函数
        this.wrapImageProcessingFunctions();
    }

    // 包装加密函数
    wrapEncryptionFunctions() {
        if (window.cryptoUtils && window.cryptoUtils.encrypt) {
            const originalEncrypt = window.cryptoUtils.encrypt;
            window.cryptoUtils.encrypt = function(...args) {
                // 添加保护检查
                if (window.sourceProtection && window.sourceProtection.isDevToolsOpen) {
                    console.warn('加密功能在开发者工具模式下受限');
                    return null;
                }
                return originalEncrypt.apply(this, args);
            };
        }

        if (window.cryptoUtils && window.cryptoUtils.decrypt) {
            const originalDecrypt = window.cryptoUtils.decrypt;
            window.cryptoUtils.decrypt = function(...args) {
                // 添加保护检查
                if (window.sourceProtection && window.sourceProtection.isDevToolsOpen) {
                    console.warn('解密功能在开发者工具模式下受限');
                    return null;
                }
                return originalDecrypt.apply(this, args);
            };
        }
    }

    // 包装图像处理函数
    wrapImageProcessingFunctions() {
        if (window.imageHandler && window.imageHandler.processImage) {
            const originalProcess = window.imageHandler.processImage;
            window.imageHandler.processImage = function(...args) {
                // 添加调试检测
                const startTime = Date.now();
                debugger; // 调试器检测点
                const result = originalProcess.apply(this, args);
                const endTime = Date.now();
                
                if (endTime - startTime > 100) {
                    console.warn('检测到调试活动，图像处理可能被干扰');
                }
                
                return result;
            };
        }
    }

    // 加密敏感字符串
    encryptSensitiveStrings() {
        // 敏感字符串映射
        const sensitiveStrings = {
            'encryption_key': this.encryptString('AES-256-CBC'),
            'algorithm': this.encryptString('PBKDF2'),
            'salt': this.encryptString('FIXpictures_Salt_2024'),
            'iteration': this.encryptString('10000')
        };

        window._encryptedStrings = sensitiveStrings;

        // 添加字符串解密函数
        this.addStringDecryption();
    }

    // 字符串加密函数
    encryptString(str) {
        // 简单的Base64编码（在实际项目中应使用更强的加密）
        let result = '';
        for (let i = 0; i < str.length; i++) {
            result += String.fromCharCode(str.charCodeAt(i) + 1);
        }
        return btoa(result);
    }

    // 字符串解密函数
    decryptString(encryptedStr) {
        try {
            const decoded = atob(encryptedStr);
            let result = '';
            for (let i = 0; i < decoded.length; i++) {
                result += String.fromCharCode(decoded.charCodeAt(i) - 1);
            }
            return result;
        } catch (e) {
            return '';
        }
    }

    // 添加字符串解密功能
    addStringDecryption() {
        window._decrypt = (encryptedStr) => {
            return this.decryptString(encryptedStr);
        };
    }

    // 添加虚假代码
    addDecoyCode() {
        // 添加虚假函数
        this.addFakeFunctions();
        
        // 添加虚假变量
        this.addFakeVariables();
        
        // 添加误导性注释
        this.addMisleadingComments();
    }

    // 添加虚假函数
    addFakeFunctions() {
        // 虚假加密函数
        window._fakeEncrypt = function(data) {
            console.warn('这是虚假的加密函数');
            return data.split('').reverse().join('');
        };

        // 虚假解密函数
        window._fakeDecrypt = function(data) {
            console.warn('这是虚假的解密函数');
            return data.split('').reverse().join('');
        };

        // 虚假图像处理函数
        window._fakeProcessImage = function(imageData) {
            console.warn('这是虚假的图像处理函数');
            return imageData;
        };
    }

    // 添加虚假变量
    addFakeVariables() {
        window._fakeKey = 'This_is_a_fake_encryption_key_12345';
        window._fakeAlgorithm = 'FAKE-AES-128';
        window._fakeSalt = 'fake_salt_value';
        window._config = {
            debug: true,
            version: '0.0.1',
            fakeSetting: 'misleading_value'
        };
    }

    // 添加误导性注释
    addMisleadingComments() {
        // 这些注释会出现在美化后的代码中
        window._comments = {
            note1: '重要：加密密钥存储在服务器端',
            note2: '算法：自定义加密方案',
            note3: '安全级别：企业级'
        };
    }

    // 保护关键函数
    protectCriticalFunctions() {
        // 保护加密核心
        this.protectEncryptionCore();
        
        // 保护图像处理核心
        this.protectImageProcessingCore();
        
        // 添加函数调用验证
        this.addFunctionValidation();
    }

    // 保护加密核心
    protectEncryptionCore() {
        // 在实际项目中，关键加密逻辑应该被深度保护
        // 这里添加一些基本的保护措施
        
        Object.defineProperty(window, 'cryptoUtils', {
            writable: false,
            configurable: false,
            enumerable: false
        });
    }

    // 保护图像处理核心
    protectImageProcessingCore() {
        Object.defineProperty(window, 'imageHandler', {
            writable: false,
            configurable: false,
            enumerable: false
        });
    }

    // 添加函数调用验证
    addFunctionValidation() {
        // 验证函数调用环境
        const originalSetTimeout = window.setTimeout;
        window.setTimeout = function(callback, delay, ...args) {
            // 检查回调函数是否被篡改
            if (typeof callback === 'function') {
                const callbackStr = callback.toString();
                if (callbackStr.includes('debugger') || callbackStr.includes('console.log')) {
                    console.warn('检测到可疑的回调函数');
                    return 0;
                }
            }
            return originalSetTimeout(callback, delay, ...args);
        };
    }

    // 设置自我保护机制
    setupSelfDefense() {
        // 检测代码篡改
        this.detectCodeTampering();
        
        // 防止函数重写
        this.preventFunctionOverwrite();
        
        // 添加完整性检查
        this.addIntegrityCheck();
    }

    // 检测代码篡改
    detectCodeTampering() {
        // 检查关键函数是否被修改
        setInterval(() => {
            if (window.cryptoUtils && typeof window.cryptoUtils.encrypt !== 'function') {
                console.error('检测到加密函数被篡改！');
                this.triggerSelfDestruct();
            }
            
            if (window.imageHandler && typeof window.imageHandler.processImage !== 'function') {
                console.error('检测到图像处理函数被篡改！');
                this.triggerSelfDestruct();
            }
        }, 10000);
    }

    // 防止函数重写
    preventFunctionOverwrite() {
        const protectedFunctions = ['encrypt', 'decrypt', 'processImage'];
        
        protectedFunctions.forEach(funcName => {
            if (window.cryptoUtils && window.cryptoUtils[funcName]) {
                Object.defineProperty(window.cryptoUtils, funcName, {
                    writable: false,
                    configurable: false
                });
            }
        });
    }

    // 添加完整性检查
    addIntegrityCheck() {
        // 计算关键函数的哈希值（简化版）
        const getFunctionHash = (func) => {
            return func.toString().length;
        };

        // 存储原始哈希值
        const originalHashes = {};
        if (window.cryptoUtils && window.cryptoUtils.encrypt) {
            originalHashes.encrypt = getFunctionHash(window.cryptoUtils.encrypt);
        }

        // 定期检查完整性
        setInterval(() => {
            if (window.cryptoUtils && window.cryptoUtils.encrypt) {
                const currentHash = getFunctionHash(window.cryptoUtils.encrypt);
                if (currentHash !== originalHashes.encrypt) {
                    console.error('加密函数完整性检查失败！');
                    this.triggerSelfDestruct();
                }
            }
        }, 15000);
    }

    // 触发自毁机制
    triggerSelfDestruct() {
        console.error('⚠️ 检测到严重安全违规，启动保护模式');
        
        // 禁用所有功能
        this.disableAllFunctions();
        
        // 显示错误信息
        this.showSecurityError();
        
        // 清除敏感数据
        this.clearSensitiveData();
    }

    // 禁用所有功能
    disableAllFunctions() {
        // 禁用文件上传
        const fileInput = document.getElementById('ipt');
        if (fileInput) fileInput.disabled = true;
        
        // 禁用所有按钮
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.disabled = true;
            button.style.opacity = '0.3';
        });
        
        // 禁用拖放
        document.addEventListener('dragover', (e) => e.preventDefault());
        document.addEventListener('drop', (e) => e.preventDefault());
    }

    // 显示安全错误信息
    showSecurityError() {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 0, 0, 0.9);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100000;
            font-size: 24px;
            font-weight: bold;
            text-align: center;
        `;
        errorDiv.innerHTML = `
            <div>
                <h1>⚠️ 安全违规检测</h1>
                <p>检测到代码完整性被破坏，应用程序已进入保护模式。</p>
                <p>请刷新页面重新加载。</p>
            </div>
        `;
        document.body.appendChild(errorDiv);
    }

    // 清除敏感数据
    clearSensitiveData() {
        // 清除本地存储的敏感数据
        try {
            localStorage.removeItem('encryption_keys');
            localStorage.removeItem('image_data');
            localStorage.removeItem('user_settings');
        } catch (e) {
            // 忽略错误
        }
        
        // 清除内存中的敏感数据
        if (window.cryptoUtils) {
            window.cryptoUtils.clearCache();
        }
    }

    // 获取混淆状态
    getObfuscationStatus() {
        return {
            enabled: this.obfuscationEnabled,
            protectionLevel: 'high',
            selfDefense: 'active',
            lastCheck: new Date().toISOString()
        };
    }
}

// 创建全局实例
window.codeObfuscation = new CodeObfuscation();

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CodeObfuscation;
}