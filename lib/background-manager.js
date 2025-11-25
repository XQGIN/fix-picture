// 背景效果管理器
class BackgroundManager {
    constructor() {
        this.backgroundLayer = null;
        this.currentTheme = 'light';
        this.init();
    }

    init() {
        // 等待DOM加载完成和主题初始化完成
        const initializeAfterTheme = () => {
            // 等待一小段时间确保主题切换逻辑已完成
            setTimeout(() => {
                this.setupBackground();
                this.setupThemeListener();
            }, 100);
        };
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeAfterTheme);
        } else {
            initializeAfterTheme();
        }
    }

    setupBackground() {
        this.backgroundLayer = document.querySelector('.background-layer');
        if (!this.backgroundLayer) {
            console.warn('背景层元素未找到');
            return;
        }

        // 检测当前主题
        this.detectCurrentTheme();
        
        // 应用初始背景效果
        this.applyBackgroundEffect();
        
        // 添加鼠标交互效果
        this.addMouseInteraction();
    }

    detectCurrentTheme() {
        this.currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    }

    setupThemeListener() {
        // 监听主题切换事件
        document.addEventListener('themeChanged', (event) => {
            this.currentTheme = event.detail.theme;
            this.applyBackgroundEffect();
        });

        // 监听系统主题变化
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                this.currentTheme = e.matches ? 'dark' : 'light';
                this.applyBackgroundEffect();
            });
        }
    }

    applyBackgroundEffect() {
        if (!this.backgroundLayer) return;

        // 添加主题切换动画类
        this.backgroundLayer.classList.add('theme-transition');
        
        // 根据主题调整背景效果
        if (this.currentTheme === 'light') {
            this.applyLightThemeBackground();
        } else {
            this.applyDarkThemeBackground();
        }

        // 移除动画类
        setTimeout(() => {
            this.backgroundLayer.classList.remove('theme-transition');
        }, 800);
    }

    applyLightThemeBackground() {
        // 白天主题：增强版明亮多彩渐变
        this.backgroundLayer.style.background = 'linear-gradient(135deg,#667eea 0%, #764ba2 15%,#8a2be2 25%, #f093fb 40%, #ff6b6b 50%, #feca57 65%,#48c9b0 80%, #00b4d8 100%)';
        this.backgroundLayer.style.opacity = '0.85';
        
        // 清理夜间主题粒子效果
        this.clearDarkThemeParticles();
    }

    applyDarkThemeBackground() {
        // 夜间主题：黑白动态响应式渐变效果
        this.backgroundLayer.style.background = 'linear-gradient(135deg,#000000 0%, #1a1a1a 15%, #2d2d2d 30%, #404040 50%, #2d2d2d 70%, #1a1a1a 85%, #000000 100%)';
        this.backgroundLayer.style.opacity = '0.8';
        
        // 添加动态粒子效果
        this.addDarkThemeParticles();
    }

    addMouseInteraction() {
        if (!this.backgroundLayer) return;

        let mouseX = 0;
        let mouseY = 0;
        let rafId = null;
        let isMouseMoving = false;
        let lastMouseMoveTime = 0;

        const updateBackgroundPosition = () => {
            if (!this.backgroundLayer) return;
            
            const currentTime = Date.now();
            const timeSinceLastMove = currentTime - lastMouseMoveTime;
            
            // 如果鼠标停止移动超过500ms，逐渐重置背景位置
            if (timeSinceLastMove > 500 && isMouseMoving) {
                isMouseMoving = false;
            }
            
            // 计算鼠标位置对背景的影响
            const xPercent = (mouseX / window.innerWidth) * 100;
            const yPercent = (mouseY / window.innerHeight) * 100;
            
            // 根据鼠标移动状态调整变换幅度
            const intensity = isMouseMoving ? 0.02 : 0.005; // 移动时更强，静止时更弱
            const translateX = (xPercent - 50) * intensity;
            const translateY = (yPercent - 50) * intensity;
            
            // 添加视差效果和轻微缩放
            const scale = isMouseMoving ? 1.03 : 1.01;
            this.backgroundLayer.style.transform = `translate(${translateX}%, ${translateY}%) scale(${scale})`;
            
            // 添加鼠标移动时的光效
            if (isMouseMoving) {
                const glowIntensity = Math.sin(currentTime * 0.005) * 0.1 + 0.1;
                this.backgroundLayer.style.filter = `saturate(${1.2 + glowIntensity}) brightness(${1.0 + glowIntensity})`;
            } else {
                this.backgroundLayer.style.filter = 'saturate(1.2) brightness(1.0)';
            }
            
            rafId = requestAnimationFrame(updateBackgroundPosition);
        };

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            lastMouseMoveTime = Date.now();
            
            if (!isMouseMoving) {
                isMouseMoving = true;
            }
            
            if (!rafId) {
                rafId = requestAnimationFrame(updateBackgroundPosition);
            }
        });

        // 鼠标离开时停止动画
        document.addEventListener('mouseleave', () => {
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
            isMouseMoving = false;
            
            // 平滑重置背景位置
            if (this.backgroundLayer) {
                this.backgroundLayer.style.transform = 'translate(0, 0) scale(1)';
                this.backgroundLayer.style.filter = 'saturate(1.2) brightness(1.0)';
            }
        });

        // 添加点击涟漪效果
        document.addEventListener('click', (e) => {
            if (!this.backgroundLayer) return;
            
            // 创建涟漪元素
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                width: 100px;
                height: 100px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
                left: ${e.clientX - 50}px;
                top: ${e.clientY - 50}px;
                pointer-events: none;
                z-index: 999;
                animation: rippleEffect 1s ease-out forwards;
            `;
            
            // 添加涟漪动画样式
            if (!document.querySelector('#ripple-style')) {
                const style = document.createElement('style');
                style.id = 'ripple-style';
                style.textContent = `
                    @keyframes rippleEffect {
                        0% { transform: scale(0); opacity: 0.8; }
                        50% { opacity: 0.5; }
                        100% { transform: scale(3); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }
            
            document.body.appendChild(ripple);
            
            // 移除涟漪元素
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 1000);
        });
    }

    // 动态更新背景效果
    updateBackground(settings = {}) {
        if (!this.backgroundLayer) return;

        const {
            intensity = 1.0,
            speed = 1.0,
            complexity = 1.0
        } = settings;

        // 调整动画速度
        this.backgroundLayer.style.animationDuration = `${20 / speed}s`;
        
        // 调整背景大小（复杂度）
        const size = Math.max(200, 400 * complexity);
        this.backgroundLayer.style.backgroundSize = `${size}% ${size}%`;
        
        // 调整不透明度（强度）
        const baseOpacity = this.currentTheme === 'light' ? 0.8 : 0.6;
        this.backgroundLayer.style.opacity = (baseOpacity * intensity).toString();
    }

    // 获取当前背景设置
    getCurrentSettings() {
        return {
            theme: this.currentTheme,
            intensity: parseFloat(this.backgroundLayer?.style.opacity || '0.8'),
            speed: 20 / parseFloat(this.backgroundLayer?.style.animationDuration?.replace('s', '') || '20'),
            complexity: parseFloat(this.backgroundLayer?.style.backgroundSize?.replace('%', '') || '400') / 400
        };
    }

    // 重置背景效果
    resetBackground() {
        if (!this.backgroundLayer) return;
        
        this.backgroundLayer.style.animationDuration = '20s';
        this.backgroundLayer.style.backgroundSize = '400% 400%';
        
        if (this.currentTheme === 'light') {
            this.backgroundLayer.style.opacity = '0.8';
        } else {
            this.backgroundLayer.style.opacity = '0.8';
        }
        
        this.backgroundLayer.style.transform = 'translate(0, 0)';
    }

    // 夜间主题粒子效果
    addDarkThemeParticles() {
        if (!this.backgroundLayer) return;
        
        // 移除现有的粒子容器
        const existingParticles = this.backgroundLayer.querySelector('.dark-particles');
        if (existingParticles) {
            existingParticles.remove();
        }
        
        // 创建粒子容器
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'dark-particles';
        particlesContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        `;
        
        // 创建粒子
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                background: rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1});
                border-radius: 50%;
                animation: floatParticle ${Math.random() * 20 + 10}s linear infinite;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
            `;
            particlesContainer.appendChild(particle);
        }
        
        this.backgroundLayer.appendChild(particlesContainer);
    }

    // 清理粒子效果
    clearDarkThemeParticles() {
        if (!this.backgroundLayer) return;
        const particles = this.backgroundLayer.querySelector('.dark-particles');
        if (particles) {
            particles.remove();
        }
    }
}

// 创建全局实例
window.backgroundManager = new BackgroundManager();

// 全局可用
// backgroundManager 已通过 window.backgroundManager 全局可用