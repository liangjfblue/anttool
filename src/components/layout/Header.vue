<template>
  <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo和标题 -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center">
            <div class="flex-shrink-0">
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">
                AntTool
              </h1>
            </div>
            <div class="hidden md:block ml-4">
              <p class="text-sm text-gray-500 dark:text-gray-400">
                牛马工具集合
              </p>
            </div>
          </router-link>
        </div>

        <!-- 右侧操作区 -->
        <div class="flex items-center space-x-4">
          <!-- 主题切换 -->
          <ThemeToggle />

          <!-- GitHub链接 -->
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="GitHub"
          >
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                clip-rule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
</script>
