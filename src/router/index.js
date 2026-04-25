import { createRouter, createWebHashHistory } from 'vue-router'

const HomePage = () => import('@/views/HomePage.vue')
const NoteListPage = () => import('@/views/NoteListPage.vue')
const NoteDetailPage = () => import('@/views/NoteDetailPage.vue')
const SearchPage = () => import('@/views/SearchPage.vue')
const RelaxationMode = () => import('@/views/RelaxationMode.vue')
const EditorPage = () => import('@/views/EditorPage.vue')
const NotFoundPage = () => import('@/views/NotFoundPage.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { title: '首页' }
  },
  {
    path: '/category/:category(.*)',
    name: 'NoteList',
    component: NoteListPage,
    meta: { title: '笔记列表' }
  },
  {
    path: '/note/:path(.*)',
    name: 'NoteDetail',
    component: NoteDetailPage,
    meta: { title: '笔记详情' }
  },
  {
    path: '/search',
    name: 'Search',
    component: SearchPage,
    meta: { title: '搜索' }
  },
  {
    path: '/editor',
    name: 'Editor',
    component: EditorPage,
    meta: { title: '笔记编辑器' }
  },
  {
    path: '/relaxation',
    name: 'Relaxation',
    component: RelaxationMode,
    meta: { title: '休闲时光' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundPage,
    meta: { title: '页面未找到' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }

    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  if (to.name === 'NoteDetail') {
    const rawPath = String(to.params.path || '')
    const segments = rawPath.split('/').filter(Boolean)
    const lastSegment = segments[segments.length - 1]

    if (lastSegment === '目录') {
      const categorySegments = segments.slice(0, -1)

      if (categorySegments.length === 0) {
        next({ name: 'Home' })
        return
      }

      next({
        name: 'NoteList',
        params: {
          category: categorySegments.join('/')
        }
      })
      return
    }
  }

  document.title = to.meta.title
    ? `${to.meta.title} - 个人技术博客`
    : '个人技术博客'
  next()
})

export default router
