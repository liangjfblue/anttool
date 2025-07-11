<template>
  <button
    @click="toggleTheme"
    class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    :title="theme === 'light' ? '切换到深色模式' : '切换到浅色模式'"
  >
    <SunIcon v-if="theme === 'dark'" class="h-5 w-5 text-gray-600 dark:text-gray-400" />
    <MoonIcon v-else class="h-5 w-5 text-gray-600 dark:text-gray-400" />
  </button>
</template>

<script setup lang="ts">
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline'
import { useThemeStore } from '@/stores/theme'
import { storeToRefs } from 'pinia'

const themeStore = useThemeStore()
const { theme } = storeToRefs(themeStore)
const { toggleTheme } = themeStore
</script>
