<template>
  <div class="author-profile">
    <!-- 头像按钮 -->
    <button class="avatar-btn" @click="toggleProfile" aria-label="作者简介">
      <img :src="avatarUrl" alt="作者头像" class="avatar-image" />
    </button>

    <!-- 简介弹窗 -->
    <Teleport to="body">
      <transition name="fade">
        <div class="profile-modal" v-if="showProfile" @click="closeProfile">
          <div class="profile-card" @click.stop>
          <button class="close-modal-btn" @click="closeProfile">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div class="profile-header">
            <div class="avatar-wrapper" @click="previewAvatar">
              <img :src="avatarUrl" alt="作者头像" class="profile-avatar" />
              <div class="avatar-overlay">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4"></path>
                  <path d="M12 8h.01"></path>
                </svg>
                <span>点击预览</span>
              </div>
            </div>
            <button class="change-avatar-btn" @click="changeAvatar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              更换头像
            </button>
          </div>

          <div class="profile-content">
            <h3 class="profile-name">{{ authorName }}</h3>
            <p class="profile-title">{{ authorTitle }}</p>
            
            <div class="profile-bio">
              <p v-for="(line, index) in authorBio" :key="index">{{ line }}</p>
            </div>

            <div class="profile-stats">
              <div class="stat-item">
                <span class="stat-value">{{ stats.articles }}</span>
                <span class="stat-label">文章</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ stats.categories }}</span>
                <span class="stat-label">分类</span>
              </div>
              <div class="stat-item">
                <span class="stat-value stat-value-small">{{ stats.lastUpdated }}</span>
                <span class="stat-label">最近更新</span>
              </div>
            </div>

            <div class="profile-motto">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 21h18"></path>
                <path d="M5 21V7l8-4v18"></path>
                <path d="M19 21V11l-6-4"></path>
              </svg>
              <p>"{{ authorMotto }}"</p>
            </div>

            <!-- 休闲模式按钮 -->
            <div class="relaxation-section">
              <button class="relaxation-btn" @click="enterRelaxationMode">
                <div class="btn-icon">🌅</div>
                <div class="btn-text">
                  <span class="btn-title">休闲模式</span>
                  <span class="btn-subtitle">欣赏美景，放松心情</span>
                </div>
                <div class="btn-arrow">→</div>
              </button>
            </div>
          </div>
        </div>
      </div>
      </transition>
    </Teleport>

    <!-- 头像预览弹窗 -->
    <Teleport to="body">
      <transition name="fade">
      <div class="avatar-preview-modal" v-if="showAvatarPreview" @click="closeAvatarPreview">
        <div class="preview-content" @click.stop>
          <button class="close-preview-btn" @click="closeAvatarPreview">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <img :src="avatarUrl" alt="头像预览" class="preview-image" />
        </div>
      </div>
      </transition>
    </Teleport>

    <!-- 隐藏的文件选择器 -->
    <input 
      type="file" 
      ref="fileInput" 
      accept="image/*" 
      @change="handleFileChange" 
      style="display: none;"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { siteConfig } from '../config/site'

const router = useRouter()
const showProfile = ref(false)
const showAvatarPreview = ref(false)
const fileInput = ref(null)

// 作者信息
const authorName = ref(siteConfig.author?.name || '技术博主')
const avatarUrl = ref(siteConfig.author?.avatar || '')
const authorTitle = computed(() => siteConfig.author?.title || '前端开发工程师')
const authorBio = computed(() => {
  return Array.isArray(siteConfig.author?.bio) ? siteConfig.author.bio : []
})
const authorMotto = computed(() => siteConfig.author?.motto || '持续学习，持续进步')

// 统计数据
const stats = ref({
  articles: 0,
  categories: 0,
  lastUpdated: '--'
})

// 切换简介弹窗
const toggleProfile = () => {
  showProfile.value = !showProfile.value
}

const closeProfile = () => {
  showProfile.value = false
}

// 预览头像
const previewAvatar = () => {
  showAvatarPreview.value = true
}

const closeAvatarPreview = () => {
  showAvatarPreview.value = false
}

// 进入休闲模式
const enterRelaxationMode = () => {
  closeProfile() // 先关闭当前弹窗
  router.push('/relaxation') // 跳转到休闲模式页面
}

// 更换头像
const changeAvatar = () => {
  if (!fileInput.value) return
  fileInput.value.value = ''
  fileInput.value.click()
}

const handleFileChange = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  if (file.type && !file.type.startsWith('image/')) {
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result
    if (!result) return
    avatarUrl.value = result
    try {
      localStorage.setItem('authorAvatar', result)
    } catch (err) {
      console.error('保存头像失败（可能是图片过大导致存储空间不足）:', err)
    }
  }
  reader.readAsDataURL(file)
}

const formatUpdateDate = (iso) => {
  if (!iso) return '--'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '--'
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const loadProfileStats = async () => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}notes-index.json`)
    if (!response.ok) return

    const data = await response.json()
    stats.value = {
      articles: data.totalNotes || data.allNotes?.length || 0,
      categories: data.totalCategories || data.categories?.length || 0,
      lastUpdated: formatUpdateDate(data.lastUpdated)
    }
  } catch (err) {
    console.error('加载作者统计数据失败:', err)
  }
}

// 从 localStorage 加载头像
const loadAvatar = () => {
  try {
    const savedAvatar = localStorage.getItem('authorAvatar')
    if (savedAvatar) {
      avatarUrl.value = savedAvatar
    }
  } catch (err) {
    console.error('读取已保存头像失败:', err)
  }
}

onMounted(() => {
  loadAvatar()
  loadProfileStats()
})
</script>

<style scoped>
.author-profile {
  position: relative;
}

.avatar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.avatar-btn:hover {
  border-color: var(--primary-color);
  transform: scale(1.05);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 简介弹窗 */
.profile-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.profile-card {
  background-color: var(--bg-primary);
  border-radius: 16px;
  max-width: 560px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  border: 1px solid var(--border-color);
}

.profile-modal::-webkit-scrollbar,
.profile-card::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}

.close-modal-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all 0.2s;
  z-index: 10;
}

.close-modal-btn:hover {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.profile-header {
  padding: 40px 32px 24px;
  text-align: center;
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, rgba(34, 197, 94, 0.12) 100%);
  border-radius: 16px 16px 0 0;
}

.avatar-wrapper {
  width: 120px;
  height: 120px;
  margin: 0 auto 16px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid var(--bg-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  cursor: pointer;
}

.avatar-wrapper:hover .avatar-overlay {
  opacity: 1;
}

.profile-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.3s;
  color: white;
  font-size: 12px;
}

.change-avatar-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 20px;
  font-size: 13px;
  transition: all 0.2s;
}

.change-avatar-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.profile-content {
  padding: 24px 32px 32px;
}

.profile-name {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.profile-title {
  font-size: 15px;
  color: var(--text-secondary);
  margin: 0 0 24px 0;
}

.profile-bio {
  margin-bottom: 24px;
}

.profile-bio p {
  font-size: 14px;
  line-height: 1.8;
  color: var(--text-secondary);
  margin: 8px 0;
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  padding: 16px;
  background-color: var(--bg-secondary);
  border-radius: 12px;
  margin-bottom: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  min-height: 116px;
  padding: 14px 10px;
}

.stat-value {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  font-size: 24px;
  font-weight: 600;
  color: var(--primary-color);
  line-height: 1;
  margin-bottom: 8px;
  font-variant-numeric: tabular-nums;
}

.stat-value-small {
  font-size: 20px;
  letter-spacing: 0.4px;
}

.stat-label {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
  line-height: 1.3;
}

.profile-motto {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(34, 197, 94, 0.08) 100%);
  border-left: 3px solid var(--primary-color);
  border-radius: 8px;
}

.profile-motto svg {
  flex-shrink: 0;
  color: var(--primary-color);
}

.profile-motto p {
  font-size: 14px;
  font-style: italic;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.6;
}

/* 休闲模式按钮 */
.relaxation-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
}

.relaxation-btn {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.relaxation-btn:hover {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
  border-color: rgba(34, 197, 94, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(34, 197, 94, 0.15);
}

.btn-icon {
  font-size: 24px;
  margin-right: 16px;
  flex-shrink: 0;
}

.btn-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.btn-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.btn-subtitle {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.btn-arrow {
  font-size: 18px;
  color: var(--text-secondary);
  transition: transform 0.3s ease;
}

.relaxation-btn:hover .btn-arrow {
  transform: translateX(4px);
  color: var(--text-primary);
}

/* 头像预览弹窗 */
.avatar-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.preview-content {
  position: relative;
  max-width: 600px;
  max-height: 600px;
}

.close-preview-btn {
  position: absolute;
  top: -50px;
  right: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.2s;
}

.close-preview-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.preview-image {
  max-width: 100%;
  max-height: 600px;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .profile-card {
    max-width: 100%;
    border-radius: 12px;
  }

  .profile-header {
    padding: 32px 24px 20px;
  }

  .profile-content {
    padding: 20px 24px 24px;
  }

  .avatar-wrapper {
    width: 100px;
    height: 100px;
  }

  .profile-name {
    font-size: 20px;
  }

  .stat-value {
    font-size: 20px;
  }

  .stat-value-small {
    font-size: 18px;
  }

  .profile-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .profile-stats .stat-item:last-child {
    grid-column: 1 / -1;
  }
}
</style>
