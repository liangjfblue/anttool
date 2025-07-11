import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 路由懒加载
const Home = () => import('@/views/Home.vue')
const JsonTool = () => import('@/views/JsonTool.vue')
const TimeTool = () => import('@/views/TimeTool.vue')
const UrlTool = () => import('@/views/UrlTool.vue')
const Base64Tool = () => import('@/views/Base64Tool.vue')
const Md5Tool = () => import('@/views/Md5Tool.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '首页',
      description: '开发者工具集合',
    },
  },
  {
    path: '/json',
    name: 'JsonTool',
    component: JsonTool,
    meta: {
      title: 'JSON工具',
      description: 'JSON格式化、验证、对比工具',
    },
  },
  {
    path: '/time',
    name: 'TimeTool',
    component: TimeTool,
    meta: {
      title: '时间工具',
      description: '时间戳转换、时区转换、日期计算',
    },
  },
  {
    path: '/url',
    name: 'UrlTool',
    component: UrlTool,
    meta: {
      title: 'URL工具',
      description: 'URL编码解码工具',
    },
  },
  {
    path: '/base64',
    name: 'Base64Tool',
    component: Base64Tool,
    meta: {
      title: 'Base64工具',
      description: 'Base64编码解码工具',
    },
  },
  {
    path: '/md5',
    name: 'Md5Tool',
    component: Md5Tool,
    meta: {
      title: 'MD5工具',
      description: 'MD5哈希生成工具',
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫 - 设置页面标题
router.beforeEach((to) => {
  if (to.meta?.title) {
    document.title = `${to.meta.title} - AntTool`
  }
})

export default router
