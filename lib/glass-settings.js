// 液态玻璃效果设置界面
class GlassSettingsPanel {
    constructor() {
        this.isOpen = false;
        this.panel = null;
        this.overlay = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        
        // 确保DOM已加载
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.createPanel();
                this.setupEventListeners();
                this.initialized = true;
            });
        } else {
            this.createPanel();
            this.setupEventListeners();
            this.initialized = true;
        }
    }

    createPanel() {
        // 创建设置面板容器
        this.panel = document.createElement('div');
        this.panel.className = 'glass-settings-panel';
        this.panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 2rem;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            max-width: 400px;
            width: 90vw;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0;
        `;

        // 面板内容
        this.panel.innerHTML = `
            <div class="glass-settings-header">
                <h2 style="margin: 0 0 1.5rem 0; color: #1d1d1f; font-size: 1.5rem;">
                    🎨 液态玻璃效果设置
                </h2>
                <button class="close-button" style="
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #666;
                ">✕</button>
            </div>
            
            <div class="glass-settings-content">
                <div class="setting-group">
                    <label for="glass-enabled" style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <input type="checkbox" id="glass-enabled" style="width: 18px; height: 18px;">
                        <span style="font-weight: 600; color: #1d1d1f;">启用液态玻璃效果</span>
                    </label>
                </div>

                <div class="setting-group">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #424245;">
                        模糊程度: <span id="blur-value">15px</span>
                    </label>
                    <input type="range" id="blur-range" min="0" max="30" value="15" style="
                        width: 100%;
                        height: 6px;
                        border-radius: 3px;
                        background: rgba(0, 0, 0, 0.1);
                        outline: none;
                        margin-bottom: 1rem;
                    ">
                </div>

                <div class="setting-group">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #424245;">
                        透明度: <span id="opacity-value">70%</span>
                    </label>
                    <input type="range" id="opacity-range" min="0" max="100" value="70" style="
                        width: 100%;
                        height: 6px;
                        border-radius: 3px;
                        background: rgba(0, 0, 0, 0.1);
                        outline: none;
                        margin-bottom: 1rem;
                    ">
                </div>

                <div class="setting-group">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #424245;">
                        玻璃色调
                    </label>
                    <input type="color" id="color-picker" value="#ffffff" style="
                        width: 100%;
                        height: 40px;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        margin-bottom: 1rem;
                    ">
                </div>

                <div class="setting-group">
                    <button id="apply-settings" style="
                        width: 100%;
                        padding: 0.8rem;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border: none;
                        border-radius: 12px;
                        font-size: 1rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">应用设置</button>
                </div>

                <div class="setting-group" style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(0, 0, 0, 0.1);">
                    <button id="reset-settings" style="
                        width: 100%;
                        padding: 0.6rem;
                        background: rgba(0, 0, 0, 0.05);
                        color: #666;
                        border: 1px solid rgba(0, 0, 0, 0.1);
                        border-radius: 8px;
                        font-size: 0.9rem;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">重置为默认设置</button>
                </div>
            </div>
        `;

        document.body.appendChild(this.panel);
    }

    setupEventListeners() {
        // 关闭按钮
        this.panel.querySelector('.close-button').addEventListener('click', () => {
            this.close();
        });

        // 模糊滑块
        const blurRange = this.panel.querySelector('#blur-range');
        const blurValue = this.panel.querySelector('#blur-value');
        blurRange.addEventListener('input', () => {
            blurValue.textContent = blurRange.value + 'px';
        });

        // 透明度滑块
        const opacityRange = this.panel.querySelector('#opacity-range');
        const opacityValue = this.panel.querySelector('#opacity-value');
        opacityRange.addEventListener('input', () => {
            opacityValue.textContent = opacityRange.value + '%';
        });

        // 应用设置按钮
        this.panel.querySelector('#apply-settings').addEventListener('click', () => {
            this.applySettings();
        });

        // 重置设置按钮
        this.panel.querySelector('#reset-settings').addEventListener('click', () => {
            this.resetSettings();
        });

        // 点击背景关闭
        this.panel.addEventListener('click', (e) => {
            if (e.target === this.panel) {
                this.close();
            }
        });

        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    open() {
        this.isOpen = true;
        
        // 加载当前设置
        this.loadCurrentSettings();
        
        // 显示面板
        this.panel.style.display = 'block';
        
        // 动画显示
        setTimeout(() => {
            this.panel.style.transform = 'translate(-50%, -50%) scale(1)';
            this.panel.style.opacity = '1';
        }, 10);

        // 添加背景遮罩
        this.addOverlay();
    }

    close() {
        this.isOpen = false;
        
        // 动画隐藏
        this.panel.style.transform = 'translate(-50%, -50%) scale(0)';
        this.panel.style.opacity = '0';
        
        setTimeout(() => {
            this.panel.style.display = 'none';
        }, 300);

        // 移除背景遮罩
        this.removeOverlay();
    }

    addOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'glass-settings-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
            z-index: 999;
            animation: fadeIn 0.3s ease;
        `;
        
        overlay.addEventListener('click', () => {
            this.close();
        });
        
        document.body.appendChild(overlay);
        this.overlay = overlay;
    }

    removeOverlay() {
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }
    }

    loadCurrentSettings() {
        const settings = window.glassEffectManager.getSettings();
        
        // 更新界面控件
        this.panel.querySelector('#glass-enabled').checked = settings.enabled;
        this.panel.querySelector('#blur-range').value = settings.blur;
        this.panel.querySelector('#blur-value').textContent = settings.blur + 'px';
        this.panel.querySelector('#opacity-range').value = settings.opacity;
        this.panel.querySelector('#opacity-value').textContent = settings.opacity + '%';
        this.panel.querySelector('#color-picker').value = settings.color;
    }

    applySettings() {
        const newSettings = {
            enabled: this.panel.querySelector('#glass-enabled').checked,
            blur: parseInt(this.panel.querySelector('#blur-range').value),
            opacity: parseInt(this.panel.querySelector('#opacity-range').value),
            color: this.panel.querySelector('#color-picker').value
        };

        // 更新设置
        window.glassEffectManager.updateSettings(newSettings);
        
        // 根据启用状态切换效果
        if (newSettings.enabled) {
            window.glassEffectManager.enable();
        } else {
            window.glassEffectManager.disable();
        }

        // 触发设置变化事件
        document.dispatchEvent(new CustomEvent('glassSettingsChanged', {
            detail: newSettings
        }));

        // 显示成功提示
        this.showToast('设置已应用');
        
        // 关闭面板
        setTimeout(() => {
            this.close();
        }, 1000);
    }

    resetSettings() {
        const defaultSettings = {
            blur: 15,
            opacity: 70,
            color: '#ffffff',
            enabled: false
        };

        // 更新界面控件
        this.panel.querySelector('#glass-enabled').checked = defaultSettings.enabled;
        this.panel.querySelector('#blur-range').value = defaultSettings.blur;
        this.panel.querySelector('#blur-value').textContent = defaultSettings.blur + 'px';
        this.panel.querySelector('#opacity-range').value = defaultSettings.opacity;
        this.panel.querySelector('#opacity-value').textContent = defaultSettings.opacity + '%';
        this.panel.querySelector('#color-picker').value = defaultSettings.color;

        // 更新设置管理器
        window.glassEffectManager.updateSettings(defaultSettings);
        
        // 根据启用状态切换效果
        if (defaultSettings.enabled) {
            window.glassEffectManager.enable();
        } else {
            window.glassEffectManager.disable();
        }

        // 触发设置变化事件
        document.dispatchEvent(new CustomEvent('glassSettingsChanged', {
            detail: defaultSettings
        }));

        // 显示成功提示
        this.showToast('设置已重置');
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            z-index: 1001;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        // 显示提示
        setTimeout(() => {
            toast.style.opacity = '1';
        }, 10);
        
        // 隐藏并移除提示
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }
}

// 创建全局实例
window.glassSettingsPanel = new GlassSettingsPanel();

// 全局可用
// glassSettingsPanel 已通过 window.glassSettingsPanel 全局可用