import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Theme } from '@/types'

export const useThemeStore = defineStore('theme', () => {
  // 状态
  const theme = ref<Theme>('light')

  // 初始化主题
  const initTheme = () => {
    // 从localStorage读取保存的主题
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
      theme.value = savedTheme
    } else {
      // 检测系统主题偏好
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      theme.value = prefersDark ? 'dark' : 'light'
    }
    
    // 应用主题到DOM
    applyTheme()
  }

  // 应用主题到DOM
  const applyTheme = () => {
    const html = document.documentElement
    if (theme.value === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }

  // 切换主题
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  // 设置主题
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
  }

  // 监听主题变化，保存到localStorage并应用到DOM
  watch(
    theme,
    (newTheme) => {
      localStorage.setItem('theme', newTheme)
      applyTheme()
    },
    { immediate: false }
  )

  // 监听系统主题变化
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', (e) => {
    // 只有在没有手动设置主题时才跟随系统
    if (!localStorage.getItem('theme')) {
      theme.value = e.matches ? 'dark' : 'light'
    }
  })

  return {
    theme,
    initTheme,
    toggleTheme,
    setTheme,
  }
})
