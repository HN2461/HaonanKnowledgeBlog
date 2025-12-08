import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import NoteListPage from '../views/NoteListPage.vue'
import NoteDetailPage from '../views/NoteDetailPage.vue'
import SearchPage from '../views/SearchPage.vue'
import RelaxationMode from '../views/RelaxationMode.vue'
import EditorPage from '../views/EditorPage.vue'
import NotFoundPage from '../views/NotFoundPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { title: '首页' }
  },
  {
    path: '/category/:category',
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
    } else if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 个人技术博客` : '个人技术博客'
  next()
})

export default router
