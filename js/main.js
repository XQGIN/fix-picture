// 主应用初始化脚本

// 根据时间检测应该使用的主题
function getTimeBasedTheme() {
    const hour = new Date().getHours()
    // 早上6点到晚上18点使用白天主题，其他时间使用夜间主题
    return (hour >= 6 && hour < 18) ? 'light' : 'dark'
}

// 夜间模式切换
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle')
    
    // 强制根据当前时间设置主题，忽略之前的偏好
    const timeBasedTheme = getTimeBasedTheme()
    
    // 清除可能存在的错误主题设置
    localStorage.removeItem('theme')
    
    // 强制应用时间对应的主题
    if (timeBasedTheme === 'light') {
        document.body.classList.add('light-mode')
        themeToggle.textContent = '☀️'
        localStorage.setItem('theme', 'light')
    } else {
        document.body.classList.remove('light-mode')
        themeToggle.textContent = '🌙'
        localStorage.setItem('theme', 'dark')
    }
    
    console.log(`强制应用${timeBasedTheme === 'light' ? '白天' : '夜间'}主题，当前时间: ${new Date().getHours()}时`)
    
    // 切换主题
    themeToggle.addEventListener('click', () => {
        // 添加主题切换动画
        document.body.classList.add('theme-transition')
        
        const isLightMode = document.body.classList.toggle('light-mode')
        const newTheme = isLightMode ? 'light' : 'dark'
        localStorage.setItem('theme', newTheme)
        themeToggle.textContent = isLightMode ? '☀️' : '🌙'
        
        // 触发主题变化事件
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: newTheme }
        }))
        
        // 移除动画类
        setTimeout(() => {
            document.body.classList.remove('theme-transition')
        }, 800)
    })
}

// 检查是否需要根据时间自动切换主题
function checkAutoThemeSwitch() {
    const currentTheme = localStorage.getItem('theme')
    const timeBasedTheme = getTimeBasedTheme()
    
    // 如果当前主题与时间推荐的主题不同，且用户没有手动设置过主题
    if (currentTheme !== timeBasedTheme) {
        const themeToggle = document.getElementById('theme-toggle')
        
        // 添加主题切换动画
        document.body.classList.add('theme-transition')
        
        if (timeBasedTheme === 'light') {
            document.body.classList.add('light-mode')
            themeToggle.textContent = '☀️'
        } else {
            document.body.classList.remove('light-mode')
            themeToggle.textContent = '🌙'
        }
        
        localStorage.setItem('theme', timeBasedTheme)
        
        // 触发主题变化事件
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: timeBasedTheme }
        }))
        
        // 移除动画类
        setTimeout(() => {
            document.body.classList.remove('theme-transition')
        }, 800)
        
        console.log(`根据时间自动切换到${timeBasedTheme === 'light' ? '白天' : '夜间'}主题`)
    }
}

// 液态玻璃效果设置按钮
function initGlassEffectButton() {
    const glassSettingsBtn = document.getElementById('glass-settings-button')
    
    glassSettingsBtn.addEventListener('click', () => {
        // 确保设置面板已初始化
        if (window.glassSettingsPanel && !window.glassSettingsPanel.initialized) {
            window.glassSettingsPanel.init()
        }
        window.glassSettingsPanel.open()
    })
}

// 初始化背景管理器
function initBackgroundManager() {
    // 背景管理器会在加载时自动初始化
    if (window.backgroundManager) {
        console.log('背景管理器已初始化')
    }
}

// 防止浏览器默认拖放行为
function initDragDropPrevention() {
    // 防止默认拖拽行为并允许 drop 事件
    document.addEventListener('dragover', (e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'copy'
    })

    document.addEventListener('drop', (e) => {
        e.preventDefault()
    })
}

// 等待DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化主题切换
    initThemeToggle()
    
    // 初始化拖放预防
    initDragDropPrevention()
    
    // 初始化液态玻璃效果设置按钮
    initGlassEffectButton()
    
    // 初始化背景管理器
    initBackgroundManager()
    
    // 获取DOM元素（使用缓存 - 来自 dom-utils.js）
    const ipt = getElement("ipt")
    const imgContainer = getElement("img-container")
    const btnEnc = getElement("enc")
    const btnDec = getElement("dec")
    const btnRestore = getElement("re")
    const btnPaste = getElement("paste")
    
    // 初始化所有UI事件处理器
    initializeUIHandlers(ipt, imgContainer, btnEnc, btnDec, btnRestore, btnPaste)
    
    // 设置定时检查主题切换（每30分钟检查一次）
    setInterval(checkAutoThemeSwitch, 30 * 60 * 1000)
    
    // 页面获得焦点时检查主题切换
    window.addEventListener('focus', checkAutoThemeSwitch)
    
    console.log('主题自动切换功能已启用')
})