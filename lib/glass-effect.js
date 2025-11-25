// 液态玻璃效果核心功能
class GlassEffectManager {
    constructor() {
        this.isActive = false;
        this.settings = {
            blur: 15,
            opacity: 70,
            color: '#ffffff',
            enabled: false
        };
        this.glassElements = [];
        this.init();
    }

    init() {
        // 从本地存储加载设置
        this.loadSettings();
        
        // 监听设置变化
        this.setupEventListeners();
        
        // 等待DOM加载完成后应用效果
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                if (this.settings.enabled) {
                    this.enable();
                }
            });
        } else {
            if (this.settings.enabled) {
                this.enable();
            }
        }
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('glassEffectSettings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        }
    }

    saveSettings() {
        localStorage.setItem('glassEffectSettings', JSON.stringify(this.settings));
    }

    setupEventListeners() {
        // 监听设置面板的变化
        document.addEventListener('glassSettingsChanged', (event) => {
            this.settings = { ...this.settings, ...event.detail };
            this.saveSettings();
            this.updateGlassEffect();
        });

        // 监听主题变化
        document.addEventListener('themeChanged', (event) => {
            this.updateGlassEffect();
        });
    }

    enable() {
        this.isActive = true;
        this.settings.enabled = true;
        this.saveSettings();
        this.applyGlassEffect();
    }

    disable() {
        this.isActive = false;
        this.settings.enabled = false;
        this.saveSettings();
        this.removeGlassEffect();
    }

    toggle() {
        if (this.isActive) {
            this.disable();
        } else {
            this.enable();
        }
    }

    applyGlassEffect() {
        // 获取所有需要应用玻璃效果的元素
        this.glassElements = [
            document.querySelector('.controls-card'),
            document.querySelector('.settings-panel'),
            document.querySelector('.image-container')
        ].filter(el => el !== null);

        // 为每个元素添加玻璃效果类
        this.glassElements.forEach(element => {
            element.classList.add('glass-effect');
        });

        this.updateGlassEffect();
    }

    removeGlassEffect() {
        this.glassElements.forEach(element => {
            element.classList.remove('glass-effect');
            // 重置样式
            element.style.backdropFilter = '';
            element.style.webkitBackdropFilter = '';
            element.style.backgroundColor = '';
        });
        this.glassElements = [];
    }

    updateGlassEffect() {
        if (!this.isActive) return;

        const opacityValue = this.settings.opacity / 100;
        const colorValue = this.hexToRgb(this.settings.color);

        this.glassElements.forEach(element => {
            // 更新模糊效果
            element.style.backdropFilter = `blur(${this.settings.blur}px)`;
            element.style.webkitBackdropFilter = `blur(${this.settings.blur}px)`;
            
            // 更新透明度和颜色
            element.style.backgroundColor = `rgba(${colorValue.r}, ${colorValue.g}, ${colorValue.b}, ${opacityValue})`;
        });
    }

    hexToRgb(hex) {
        // 移除#号
        hex = hex.replace('#', '');
        
        // 解析R, G, B值
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        return { r, g, b };
    }

    // 添加鼠标跟随光效
    addMouseFollowEffect() {
        document.addEventListener('mousemove', (e) => {
            if (!this.isActive) return;

            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            this.glassElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const elementX = rect.left + rect.width / 2;
                const elementY = rect.top + rect.height / 2;
                
                // 计算鼠标与元素中心的距离
                const distance = Math.sqrt(
                    Math.pow(mouseX - elementX, 2) + 
                    Math.pow(mouseY - elementY, 2)
                );
                
                // 根据距离调整光效强度
                const maxDistance = 300;
                const intensity = Math.max(0, 1 - distance / maxDistance);
                
                // 添加光效
                if (intensity > 0) {
                    const angle = Math.atan2(mouseY - elementY, mouseX - elementX);
                    const offsetX = Math.cos(angle) * intensity * 10;
                    const offsetY = Math.sin(angle) * intensity * 10;
                    
                    element.style.transform = `translateY(-5px) translateX(${offsetX}px) translateY(${offsetY}px)`;
                    element.style.boxShadow = `
                        0 ${15 + intensity * 10}px ${35 + intensity * 15}px rgba(0, 0, 0, ${0.15 + intensity * 0.1}),
                        inset 0 1px 0 rgba(255, 255, 255, ${0.3 + intensity * 0.2}),
                        0 0 ${20 + intensity * 20}px rgba(255, 255, 255, ${intensity * 0.1})
                    `;
                } else {
                    // 重置样式
                    element.style.transform = '';
                    element.style.boxShadow = `
                        0 8px 32px rgba(0, 0, 0, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2)
                    `;
                }
            });
        });
    }

    // 获取当前设置
    getSettings() {
        return { ...this.settings };
    }

    // 更新设置
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.saveSettings();
        this.updateGlassEffect();
    }
}

// 创建全局实例
window.glassEffectManager = new GlassEffectManager();

// 全局可用
// glassEffectManager 已通过 window.glassEffectManager 全局可用