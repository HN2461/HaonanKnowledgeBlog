<template>
  <div class="relaxation-container" :class="[`view-${viewMode}`, `theme-${currentMode}`]">
    <div class="ambient-grid"></div>
    <div class="ambient-orb ambient-orb-a"></div>
    <div class="ambient-orb ambient-orb-b"></div>

    <!-- 头部导航 -->
    <header class="relaxation-header">
      <div class="header-left">
        <button class="back-btn" @click="goBack">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m15 18-6-6 6-6"></path>
          </svg>
          返回
        </button>
        <div class="title-block">
          <p class="title-kicker">Slow Web · 数字留白</p>
          <h1 class="page-title">休闲时光</h1>
        </div>
      </div>

      <div class="header-right">
        <button class="toolbar-ghost-btn" @click="refreshContent">刷新内容</button>
        <button class="toolbar-ghost-btn" @click="randomMode">换个频道</button>
        <button class="view-toggle-btn" @click="toggleViewMode" title="切换视图">
          <span class="view-toggle-label">视图</span>
          <strong>{{ currentViewLabel }}</strong>
        </button>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="relaxation-content">
      <section class="relaxation-hero">
        <div class="hero-copy">
          <p class="hero-kicker">{{ currentModeMeta.eyebrow }}</p>
          <h2 class="hero-title">{{ currentModeMeta.headline }}</h2>
          <p class="hero-description">{{ currentModeMeta.description }}</p>

          <div class="hero-actions">
            <button class="hero-action primary" @click="refreshContent">刷新这一组内容</button>
            <button class="hero-action" @click="randomMode">随机切换模式</button>
            <button class="hero-action" @click="backToTop">回到顶部</button>
          </div>

          <div class="hero-metrics">
            <div class="metric-pill">
              <span class="metric-label">当前频道</span>
              <strong>{{ currentModeMeta.label }}</strong>
            </div>
            <div class="metric-pill">
              <span class="metric-label">内容进度</span>
              <strong>{{ currentModeCountLabel }}</strong>
            </div>
            <div class="metric-pill">
              <span class="metric-label">浏览方式</span>
              <strong>{{ currentViewLabel }}</strong>
            </div>
          </div>
        </div>

        <div class="hero-side">
          <article class="hero-note hero-note-primary">
            <span class="hero-note-label">今日建议</span>
            <h3>{{ currentModeMeta.recommendation }}</h3>
            <p>{{ currentModeMeta.tip }}</p>
          </article>

          <article class="hero-note hero-note-secondary">
            <div class="hero-note-top">
              <span class="hero-note-label">节奏提示</span>
              <span class="hero-note-icon">{{ currentModeMeta.icon }}</span>
            </div>
            <p class="hero-side-text">{{ currentModeMeta.vibe }}</p>
            <div class="hero-wave">
              <span v-for="bar in 6" :key="bar"></span>
            </div>
          </article>
        </div>
      </section>

      <section class="mode-switcher" aria-label="休闲模式切换">
        <button
          v-for="mode in modeOptions"
          :key="mode.key"
          class="mode-card"
          :class="{ active: currentMode === mode.key }"
          @click="switchMode(mode.key)"
        >
          <span class="mode-card-icon">{{ mode.icon }}</span>
          <span class="mode-card-copy">
            <strong>{{ mode.label }}</strong>
            <small>{{ mode.short }}</small>
          </span>
          <span class="mode-card-count">{{ mode.count }}</span>
        </button>
      </section>

      <!-- 美景模式 -->
      <div v-if="currentMode === 'scenery'" class="scenery-mode">
        <div class="content-header">
          <h2>🌍 世界美景欣赏</h2>
          <p>让美丽的风景带走你的疲惫</p>
        </div>

        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          <p>正在加载美景...</p>
        </div>

        <div v-else-if="sceneryImages.length === 0" class="no-data">
          <p>❌ API请求失败</p>
          <p style="font-size: 14px; opacity: 0.8">Picsum API无法访问，请检查网络连接</p>
          <button @click="refreshContent" class="retry-btn">重试</button>
        </div>

        <div v-else class="image-gallery">
          <div v-for="(image, index) in sceneryImages" :key="index" class="image-card" @click="openImagePreview(image)">
            <img :data-src="image.urls.small" :alt="image.alt_description || '美丽风景'" class="gallery-image lazy-image" @load="handleImageLoad" />
            <div class="image-overlay">
              <div class="image-info">
                <h3>{{ image.alt_description || "未知场景" }}</h3>
                <p>📷 {{ image.user.name }}</p>
                <p v-if="image.source">🌐 {{ image.source }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 知识模式 -->
      <div v-if="currentMode === 'knowledge'" class="knowledge-mode">
        <div class="content-header">
          <h2>📚 有趣知识</h2>
          <p>学习关于动物的有趣事实</p>
        </div>

        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          <p>正在获取有趣内容...</p>
        </div>

        <div v-else-if="knowledgeArticles.length === 0" class="no-data">
          <p>❌ API请求失败</p>
          <p style="font-size: 14px; opacity: 0.8">Cat Facts API无法访问，请检查网络连接</p>
          <button @click="refreshContent" class="retry-btn">重试</button>
        </div>

        <div v-else class="knowledge-cards">
          <article v-for="(article, index) in knowledgeArticles" :key="index" class="knowledge-card">
            <div class="card-header">
              <div class="category-tag">{{ article.category }}</div>
              <h3>{{ article.title }}</h3>
            </div>
            <div class="card-content">
              <p>{{ article.extract }}</p>
            </div>
            <div class="card-footer">
              <button class="read-more-btn" @click="openArticleLink(article)">阅读完整内容 →</button>
              <span v-if="article.source" class="article-source">📖 {{ article.source }}</span>
            </div>
          </article>
        </div>
      </div>

      <!-- 萌宠模式 -->
      <div v-if="currentMode === 'animals'" class="animals-mode">
        <div class="content-header">
          <h2>🐱 可爱萌宠</h2>
          <p>来看看这些超级可爱的小动物吧</p>
        </div>

        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          <p>正在获取萌宠图片...</p>
        </div>

        <div v-else-if="animalImages.length === 0" class="no-data">
          <p>❌ API请求失败</p>
          <p style="font-size: 14px; opacity: 0.8">动物图片API无法访问，请检查网络连接</p>
          <button @click="refreshContent" class="retry-btn">重试</button>
        </div>

        <div v-else class="animal-gallery">
          <div v-for="(animal, index) in animalImages" :key="index" class="animal-card" @click="openAnimalPreview(animal)">
            <img :data-src="animal.url" :alt="animal.breeds?.[0]?.name || '可爱动物'" class="animal-image lazy-image" @load="handleImageLoad" />
            <div class="animal-info">
              <h3>{{ animal.breeds?.[0]?.name || "可爱" + (currentAnimalType === "cats" ? "猫咪" : "狗狗") }}</h3>
              <p v-if="animal.breeds?.[0]?.temperament">{{ animal.breeds[0].temperament }}</p>
            </div>
          </div>
        </div>

        <div class="animal-switch">
          <button @click="switchAnimalType('cats')" :class="{ active: currentAnimalType === 'cats' }">🐱 猫咪</button>
          <button @click="switchAnimalType('dogs')" :class="{ active: currentAnimalType === 'dogs' }">🐕 狗狗</button>
        </div>
      </div>

      <!-- 太空模式 -->
      <div v-if="currentMode === 'space'" class="space-mode">
        <div class="content-header">
          <h2>🚀 宇航员信息</h2>
          <p>了解来自世界各地的宇航员</p>
        </div>

        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          <p>正在从太空获取数据...</p>
        </div>

        <div v-else-if="!todayImage" class="no-data">
          <p>❌ API请求失败</p>
          <p style="font-size: 14px; opacity: 0.8">Picsum API无法访问，请检查网络连接</p>
          <button @click="refreshContent" class="retry-btn">重试</button>
        </div>

        <div v-else class="space-content">
          <div v-if="todayImage" class="today-image-card">
            <img :data-src="todayImage.url" :alt="todayImage.title" class="space-image lazy-image" @load="handleImageLoad" @click="openImagePreview({ urls: { regular: todayImage.hdurl || todayImage.url, small: todayImage.url }, alt_description: todayImage.title })" />
            <div class="space-info">
              <h3>{{ todayImage.title }}</h3>
              <p class="space-date">{{ todayImage.date }}</p>
              <p class="space-description">{{ todayImage.explanation }}</p>
            </div>
          </div>

          <div class="mars-weather" v-if="marsWeather">
            <h3>🚀 最新SpaceX发射</h3>
            <div class="weather-info">
              <p><strong>任务:</strong> {{ marsWeather.mission }}</p>
              <p><strong>状态:</strong> {{ marsWeather.success ? "✅ 成功" : "❌ 失败" }}</p>
              <p><strong>详情:</strong> {{ marsWeather.details || "无详细信息" }}</p>
              <p><strong>日期:</strong> {{ formatDate(marsWeather.date) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 名言模式 -->
      <div v-if="currentMode === 'quotes'" class="quotes-mode">
        <div class="content-header">
          <h2>💡 生活建议</h2>
          <p>获取一些有用的生活智慧</p>
        </div>

        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          <p>正在获取幽默内容...</p>
        </div>

        <div v-else-if="quotes.length === 0" class="no-data">
          <p>❌ API请求失败</p>
          <p style="font-size: 14px; opacity: 0.8">Advice Slip API无法访问，请检查网络连接</p>
          <button @click="refreshContent" class="retry-btn">重试</button>
        </div>

        <div v-else class="quotes-container">
          <div v-for="(quote, index) in quotes" :key="index" class="quote-card">
            <div class="quote-text">"{{ quote.q || quote.text || quote.content }}"</div>
            <div class="quote-author">— {{ quote.a || quote.author || "佚名" }}</div>
          </div>
        </div>
      </div>

      <!-- 诗词模式 -->
      <div v-if="currentMode === 'poetry'" class="poetry-mode">
        <div class="content-header">
          <h2>📜 中国古诗词</h2>
          <p>品味千年文化，感受诗词之美</p>
        </div>

        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          <p>正在获取诗词...</p>
        </div>

        <div v-else-if="poetries.length === 0" class="no-data">
          <p>❌ API请求失败</p>
          <p style="font-size: 14px; opacity: 0.8">诗词API无法访问，请检查网络连接</p>
          <button @click="refreshContent" class="retry-btn">重试</button>
        </div>

        <div v-else class="poetry-container">
          <div v-for="(poetry, index) in poetries" :key="index" class="poetry-card">
            <div class="poetry-header">
              <h3 class="poetry-title">{{ poetry.title }}</h3>
              <div class="poetry-meta">
                <span class="poetry-dynasty">{{ poetry.dynasty }}</span>
                <span class="poetry-author">{{ poetry.author }}</span>
              </div>
            </div>
            <div class="poetry-content">
              <p v-for="(line, idx) in poetry.content" :key="idx" class="poetry-line">{{ line }}</p>
            </div>
            <div v-if="poetry.translation" class="poetry-translation">
              <strong>译文：</strong>{{ poetry.translation }}
            </div>
          </div>
        </div>
      </div>

      <!-- 美食模式 -->
      <div v-if="currentMode === 'food'" class="food-mode">
        <div class="content-header">
          <h2>🍜 美食天地</h2>
          <p>探索世界各地的美味佳肴</p>
        </div>

        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          <p>正在获取美食...</p>
        </div>

        <div v-else-if="foods.length === 0" class="no-data">
          <p>❌ API请求失败</p>
          <p style="font-size: 14px; opacity: 0.8">美食API无法访问，请检查网络连接</p>
          <button @click="refreshContent" class="retry-btn">重试</button>
        </div>

        <div v-else class="food-gallery">
          <div v-for="(food, index) in foods" :key="index" class="food-card" @click="openFoodDetail(food)">
            <div class="food-image-wrapper">
              <img :data-src="food.image" :alt="food.name" class="food-image lazy-image" @load="handleImageLoad" />
              <div class="food-category-badge">{{ food.category }}</div>
            </div>
            <div class="food-info">
              <h3 class="food-name">{{ food.name }}</h3>
              <p class="food-area" v-if="food.area">📍 {{ food.area }}</p>
              <div class="food-tags" v-if="food.tags && food.tags.length > 0">
                <span v-for="tag in food.tags.slice(0, 3)" :key="tag" class="food-tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 艺术模式 -->
      <div v-if="currentMode === 'art'" class="art-mode">
        <div class="content-header">
          <h2>🎨 世界名画</h2>
          <p>欣赏来自世界各地博物馆的艺术珍品</p>
        </div>

        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          <p>正在获取艺术作品...</p>
        </div>

        <div v-else-if="artworks.length === 0" class="no-data">
          <p>❌ API请求失败</p>
          <p style="font-size: 14px; opacity: 0.8">艺术API无法访问，请检查网络连接</p>
          <button @click="refreshContent" class="retry-btn">重试</button>
        </div>

        <div v-else class="art-gallery">
          <div v-for="(art, index) in artworks" :key="index" class="art-card" @click="openArtPreview(art)">
            <div class="art-image-wrapper">
              <img :data-src="art.thumbnail || art.image" :alt="art.title" class="art-image lazy-image" @load="handleImageLoad" />
            </div>
            <div class="art-info">
              <h3 class="art-title">{{ art.title }}</h3>
              <p class="art-artist">🎨 {{ art.artist }}</p>
              <p class="art-date" v-if="art.date">📅 {{ art.date }}</p>
              <p class="art-museum" v-if="art.museum">🏛️ {{ art.museum }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 图片预览弹窗 -->
    <Teleport to="body">
      <div v-if="showImagePreview" class="image-preview-modal" @click="closeImagePreview">
        <div class="preview-container" @click.stop>
          <button class="close-preview" @click="closeImagePreview">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <img v-if="selectedImage" :src="selectedImage.urls.regular" :alt="selectedImage.alt_description" class="preview-image" />
          <div v-if="selectedImage" class="preview-info">
            <h3>{{ selectedImage.alt_description || "美丽风景" }}</h3>
            <p>📷 摄影师：{{ selectedImage.user?.name || '未知' }}</p>
            <p v-if="selectedImage.location?.name">📍 地点：{{ selectedImage.location.name }}</p>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 悬浮功能按钮 -->
    <Teleport to="body">
      <div 
        class="floating-toolbar-container"
        :style="positionStyle"
        ref="containerRef"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <!-- 主悬浮按钮 - 显示滚动进度 -->
        <div 
          class="relaxation-fab"
          :class="{ 'is-expanded': isExpanded, 'is-dragging': isDragging }"
          @mousedown="startDrag"
          @touchstart="startDrag"
          @click="handleClick"
        >
          <!-- 进度环 -->
          <svg class="progress-ring" viewBox="0 0 44 44">
            <circle 
              class="progress-ring-bg"
              cx="22" cy="22" r="18"
              fill="none"
              stroke-width="3"
            />
            <circle 
              class="progress-ring-fill"
              cx="22" cy="22" r="18"
              fill="none"
              stroke-width="3"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="progressOffset"
            />
          </svg>
          <span class="progress-text">{{ Math.round(scrollProgress) }}%</span>
        </div>

        <!-- 展开的工具面板 -->
        <Transition name="panel-slide">
          <div v-if="isExpanded" class="toolbar-panel" :style="panelStyle">
            <div class="panel-header">
              <span class="panel-title">快捷工具</span>
              <button class="panel-close" @click.stop="isExpanded = false">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <!-- 滚动进度 -->
            <div class="panel-section">
              <div class="section-label">滚动进度</div>
              <div class="progress-bar-container">
                <div class="progress-bar" :style="{ width: scrollProgress + '%' }"></div>
              </div>
              <div class="progress-info">{{ Math.round(scrollProgress) }}%</div>
            </div>

            <!-- 刷新内容 -->
            <div class="panel-section">
              <button class="action-btn" @click.stop="refreshWithRandom">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v5h5"></path>
                </svg>
                <span>刷新内容</span>
              </button>
            </div>

            <!-- 随机模式 -->
            <div class="panel-section">
              <button class="action-btn" @click.stop="randomMode">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"></path>
                  <path d="m18 2 4 4-4 4"></path>
                  <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"></path>
                  <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"></path>
                  <path d="m18 14 4 4-4 4"></path>
                </svg>
                <span>随机模式</span>
              </button>
            </div>

            <!-- 全屏 -->
            <div class="panel-section">
              <button class="action-btn" @click.stop="toggleFullscreen">
                <svg v-if="!isFullscreen" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                </svg>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
                </svg>
                <span>{{ isFullscreen ? '退出全屏' : '全屏模式' }}</span>
              </button>
            </div>

            <!-- 回到顶部 -->
            <div class="panel-section">
              <button class="action-btn" @click.stop="backToTop">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="19" x2="12" y2="5"></line>
                  <polyline points="5 12 12 5 19 12"></polyline>
                </svg>
                <span>回到顶部</span>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Teleport>
  </div>
</template>


<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// 响应式数据
const currentMode = ref("scenery");
const loading = ref(false);
const sceneryImages = ref([]);
const knowledgeArticles = ref([]);
const animalImages = ref([]);
const currentAnimalType = ref("cats");
const todayImage = ref(null);
const marsWeather = ref(null);
const quotes = ref([]);
const poetries = ref([]);
const foods = ref([]);
const artworks = ref([]);
const showImagePreview = ref(false);
const selectedImage = ref(null);
const viewMode = ref("grid");
const showFloatingMenu = ref(false);
const showBackToTop = ref(false);
const isFullscreen = ref(false);

// 悬浮按钮相关
const containerRef = ref(null);
const isExpanded = ref(false);
const isDragging = ref(false);
const hasDragged = ref(false);
const scrollProgress = ref(0);
const position = ref({ x: null, y: null });
const dragStart = ref({ x: 0, y: 0 });
const dragOffset = ref({ x: 0, y: 0 });

const modeConfigs = {
  scenery: {
    label: '美景',
    icon: '🌿',
    short: '大图放空',
    eyebrow: 'Slow visuals · 景观散步',
    headline: '先把视线放远，再把脑子放空',
    description: '把密集信息流调小一点，留给风景、留白和颜色一个更慢的入口，让切换任务时先完成一次降噪。',
    recommendation: '切到拼贴视图时，这个频道会更像一面会呼吸的灵感墙。',
    tip: '如果刚写完代码，先看一组大图，比继续刷信息更容易重置注意力。',
    unit: '幅画面',
    vibe: '适合任务切换前后的短暂停靠'
  },
  knowledge: {
    label: '知识',
    icon: '🧠',
    short: '轻量输入',
    eyebrow: 'Light reading · 轻量输入',
    headline: '让有趣信息像卡片一样轻轻落下',
    description: '减少“百科式堆叠”，改成短卡片阅读节奏，适合碎片时间吸收一两个有意思的事实。',
    recommendation: '列表视图更适合快速扫读，一次看完再决定要不要继续展开。',
    tip: '用一屏内可完成的阅读单元替代长篇块状信息，能更稳地留住注意力。',
    unit: '条知识',
    vibe: '适合在脑子疲惫时补一点轻量新鲜感'
  },
  animals: {
    label: '萌宠',
    icon: '🐾',
    short: '情绪回血',
    eyebrow: 'Mood reset · 萌宠补给',
    headline: '给情绪一点即时回血，不必太用力',
    description: '更像一组有节奏的陪伴卡片，而不是单纯堆照片，让可爱内容也有呼吸感和层次感。',
    recommendation: '想要更治愈一点，就切到猫咪；想要更热闹一点，换到狗狗。',
    tip: '高密度图片也需要秩序，所以这里会优先保证留白、字幕和点击预览的清爽感。',
    unit: '只小可爱',
    vibe: '适合在长任务中插入一段低负担情绪补给'
  },
  space: {
    label: '太空',
    icon: '🪐',
    short: '宇宙回声',
    eyebrow: 'Deep focus · 宇宙回声',
    headline: '把视角抬高一点，眼前的压力就会小一点',
    description: '用更大的图、更清楚的层级和更安静的文字排布，把“抬头看远处”的感觉带进页面里。',
    recommendation: '这组内容适合整屏浏览，尤其适合从忙碌任务里抽离出来时看一眼。',
    tip: '把重点留给一张主图和一张补充信息卡，节奏会比连续堆砌数据更舒适。',
    unit: '组内容',
    vibe: '适合需要重新拉开视角时停留'
  },
  quotes: {
    label: '名言',
    icon: '💬',
    short: '一句就够',
    eyebrow: 'Quiet words · 轻声提醒',
    headline: '有时候一段短句，比一整页道理更有用',
    description: '强化排版留白和文字重心，让句子真的成为页面主角，而不是被装饰和按钮抢走注意力。',
    recommendation: '这一组更适合长卡视图，让每句话都能单独站住。',
    tip: '如果一句话需要停顿感，界面就不该显得着急。',
    unit: '句提醒',
    vibe: '适合想暂停几秒又不想完全离开工作流的时候'
  },
  poetry: {
    label: '诗词',
    icon: '📜',
    short: '留白阅读',
    eyebrow: 'Editorial reading · 留白阅读',
    headline: '把古诗词做成值得慢慢读的纸页感',
    description: '强调标题、行间距和纸张感层次，让诗词页面更像在翻阅一册安静的小集子。',
    recommendation: '当内容本身就够美的时候，界面最重要的是克制。',
    tip: '诗词区会保留更多呼吸空间，让每一行字都能自己站起来。',
    unit: '首诗词',
    vibe: '适合慢下来读，而不是快速扫'
  },
  food: {
    label: '美食',
    icon: '🍲',
    short: '味觉漫游',
    eyebrow: 'Taste atlas · 味觉漫游',
    headline: '看起来要有食欲，信息层级也得干净',
    description: '保留图片诱惑力，但让产地、分类和标签不再乱飞，整体更像一本轻杂志而不是图库。',
    recommendation: '网格视图适合快速挑选，拼贴视图更像随手翻灵感刊物。',
    tip: '视觉味道已经很浓时，UI 就该退半步，把重点留给食物本身。',
    unit: '道菜',
    vibe: '适合在忙碌间隙做一点轻松的味觉旅行'
  },
  art: {
    label: '艺术',
    icon: '🎨',
    short: '展览漫游',
    eyebrow: 'Museum browse · 展览漫游',
    headline: '像在逛一间安静的小展厅，而不是刷一排缩略图',
    description: '让作品、作者和馆藏信息各有层次，减少“数据卡片感”，把气氛往线上展览靠近一点。',
    recommendation: '这组内容在长卡视图里更适合慢慢看，信息会更完整。',
    tip: '艺术内容最怕界面抢戏，所以这里只做气氛，不做喧宾夺主。',
    unit: '件作品',
    vibe: '适合在高强度输入后做一段视觉散步'
  }
}

const viewModeLabels = {
  grid: '网格浏览',
  list: '长卡浏览',
  masonry: '拼贴浏览'
}

// 进度环参数
const circumference = 2 * Math.PI * 18;

// 计算属性
const modeCounts = computed(() => {
  return {
    scenery: sceneryImages.value.length,
    knowledge: knowledgeArticles.value.length,
    animals: animalImages.value.length,
    space: [todayImage.value, marsWeather.value].filter(Boolean).length,
    quotes: quotes.value.length,
    poetry: poetries.value.length,
    food: foods.value.length,
    art: artworks.value.length
  }
})

const modeOptions = computed(() => {
  return Object.entries(modeConfigs).map(([key, config]) => {
    return {
      key,
      ...config,
      count: modeCounts.value[key] ?? 0
    }
  })
})

const currentModeMeta = computed(() => {
  return modeConfigs[currentMode.value] || modeConfigs.scenery
})

const currentModeCount = computed(() => {
  return modeCounts.value[currentMode.value] ?? 0
})

const currentModeCountLabel = computed(() => {
  if (loading.value) return '正在整理中'
  if (!currentModeCount.value) return '等待加载'
  return `${currentModeCount.value} ${currentModeMeta.value.unit}`
})

const currentViewLabel = computed(() => {
  return viewModeLabels[viewMode.value] || '网格浏览'
})

const progressOffset = computed(() => {
  return circumference - (scrollProgress.value / 100) * circumference;
});

// 位置样式
const positionStyle = computed(() => {
  if (position.value.x === null) {
    return {
      bottom: '24px',
      right: '24px'
    };
  }
  return {
    left: `${position.value.x}px`,
    top: `${position.value.y}px`,
    bottom: 'auto',
    right: 'auto'
  };
});

// 面板位置和样式
const panelStyle = computed(() => {
  if (position.value.x === null) {
    return {
      bottom: '70px',
      right: '0px'
    };
  }
  
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const panelWidth = viewportWidth <= 768 ? Math.min(280, viewportWidth - 32) : 240;
  const panelHeight = 320;
  const buttonSize = viewportWidth <= 768 ? 48 : 56;
  const padding = 16;
  
  const buttonX = position.value.x;
  const buttonY = position.value.y;
  
  let left, top, right, bottom;
  let transformOrigin = 'center';
  
  // 移动端特殊处理
  if (viewportWidth <= 768) {
    left = '50%';
    if (buttonY < viewportHeight / 2) {
      top = `${buttonY + buttonSize + padding}px`;
      transformOrigin = 'center top';
    } else {
      bottom = `${viewportHeight - buttonY + padding}px`;
      transformOrigin = 'center bottom';
    }
    return {
      left,
      top,
      bottom,
      right: 'auto',
      transform: 'translateX(-50%)',
      transformOrigin,
      width: `${panelWidth}px`,
      maxHeight: `${Math.min(panelHeight, viewportHeight - 120)}px`
    };
  }
  
  // 桌面端位置计算
  if (buttonX + buttonSize + panelWidth + padding <= viewportWidth) {
    left = `${buttonX + buttonSize + padding}px`;
    transformOrigin = 'left center';
  } else if (buttonX - panelWidth - padding >= 0) {
    right = `${viewportWidth - buttonX + padding}px`;
    transformOrigin = 'right center';
  } else {
    if (buttonX < viewportWidth / 2) {
      left = `${padding}px`;
      transformOrigin = 'left center';
    } else {
      right = `${padding}px`;
      transformOrigin = 'right center';
    }
  }
  
  if (buttonY + panelHeight + padding <= viewportHeight) {
    top = `${buttonY}px`;
  } else if (buttonY - panelHeight + buttonSize >= padding) {
    top = `${buttonY + buttonSize - panelHeight}px`;
  } else {
    top = `${Math.max(padding, (viewportHeight - panelHeight) / 2)}px`;
  }
  
  return {
    left,
    top,
    right,
    bottom: 'auto',
    transformOrigin,
    width: `${panelWidth}px`,
    maxHeight: `${Math.min(panelHeight, viewportHeight - 40)}px`
  };
});

// 悬停事件处理
const handleMouseEnter = () => {
  if (!isDragging.value && !hasDragged.value) {
    isExpanded.value = true;
  }
};

const handleMouseLeave = () => {
  if (!isDragging.value) {
    isExpanded.value = false;
  }
};

// 拖拽功能
const startDrag = (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  isDragging.value = true;
  hasDragged.value = false;
  isExpanded.value = false;
  
  const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
  const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
  
  dragStart.value = { x: clientX, y: clientY };
  
  if (containerRef.value) {
    const rect = containerRef.value.getBoundingClientRect();
    dragOffset.value = {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }
  
  document.addEventListener('mousemove', onDrag, { passive: false });
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchmove', onDrag, { passive: false });
  document.addEventListener('touchend', stopDrag);
  
  document.body.style.userSelect = 'none';
};

const onDrag = (e) => {
  if (!isDragging.value) return;
  
  e.preventDefault();
  
  const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
  const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
  
  const deltaX = Math.abs(clientX - dragStart.value.x);
  const deltaY = Math.abs(clientY - dragStart.value.y);
  if (deltaX > 5 || deltaY > 5) {
    hasDragged.value = true;
  }
  
  let newX = clientX - dragOffset.value.x;
  let newY = clientY - dragOffset.value.y;
  
  const fabSize = window.innerWidth <= 768 ? 48 : 56;
  const padding = 16;
  const maxX = window.innerWidth - fabSize - padding;
  const maxY = window.innerHeight - fabSize - padding;
  
  newX = Math.max(padding, Math.min(newX, maxX));
  newY = Math.max(padding, Math.min(newY, maxY));
  
  position.value = { x: newX, y: newY };
  
  localStorage.setItem('relaxation-toolbar-position', JSON.stringify(position.value));
};

const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchmove', onDrag);
  document.removeEventListener('touchend', stopDrag);
  
  document.body.style.userSelect = '';
  
  setTimeout(() => {
    if (hasDragged.value) {
      hasDragged.value = false;
    }
  }, 100);
};

const handleClick = () => {
  if (hasDragged.value) {
    hasDragged.value = false;
    return;
  }
};

// 恢复保存的位置
const restorePosition = () => {
  const saved = localStorage.getItem('relaxation-toolbar-position');
  if (saved) {
    try {
      const pos = JSON.parse(saved);
      // 验证位置是否在视口内
      const fabSize = window.innerWidth <= 768 ? 48 : 56;
      const padding = 16;
      if (pos.x >= padding && pos.x <= window.innerWidth - fabSize - padding &&
          pos.y >= padding && pos.y <= window.innerHeight - fabSize - padding) {
        position.value = pos;
      }
    } catch (e) {
      // 忽略解析错误
    }
  }
};

// 更新滚动进度
const updateScrollProgress = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
};

// 返回上一页
const goBack = () => {
  router.go(-1);
};

// 切换模式
const switchMode = (mode) => {
  currentMode.value = mode;
  refreshContent();
};

// 刷新内容
const refreshContent = () => {
  switch (currentMode.value) {
    case "scenery": fetchSceneryImages(); break;
    case "knowledge": fetchKnowledgeArticles(); break;
    case "animals": fetchAnimalImages(); break;
    case "space": fetchSpaceData(); break;
    case "quotes": fetchQuotes(); break;
    case "poetry": fetchPoetry(); break;
    case "food": fetchFood(); break;
    case "art": fetchArt(); break;
  }
};

// 获取风景图片
const fetchSceneryImages = async () => {
  loading.value = true;
  try {
    const images = [];
    const page = Math.floor(Math.random() * 50) + 1;
    const response = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=12`);
    if (response.ok) {
      const data = await response.json();
      data.forEach((img) => {
        images.push({
          id: `picsum-${img.id}`,
          urls: {
            small: `https://picsum.photos/id/${img.id}/400/300`,
            regular: `https://picsum.photos/id/${img.id}/800/600`,
          },
          alt_description: `Photo by ${img.author}`,
          user: { name: img.author },
          source: 'Picsum Photos'
        });
      });
    }
    sceneryImages.value = images.sort(() => Math.random() - 0.5);
    setTimeout(() => initLazyLoad(), 100);
  } catch (error) {
    console.error("获取风景图片失败:", error);
    sceneryImages.value = [];
  } finally {
    loading.value = false;
  }
};

// 获取知识文章 - 使用多个备用API
const fetchKnowledgeArticles = async () => {
  loading.value = true;
  try {
    const articles = [];
    
    // API 1: 使用 uselessfacts API - 有趣的冷知识
    try {
      for (let i = 0; i < 8; i++) {
        const response = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en');
        if (response.ok) {
          const fact = await response.json();
          articles.push({
            title: `趣味知识 #${i + 1}`,
            category: "Fun Facts",
            extract: fact.text,
            url: fact.source_url || fact.permalink,
            source: fact.source
          });
        }
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    } catch (e) {
      console.log('uselessfacts API失败');
    }

    // 如果第一个API失败，尝试 Numbers API
    if (articles.length === 0) {
      try {
        for (let i = 0; i < 8; i++) {
          const num = Math.floor(Math.random() * 100) + 1;
          const response = await fetch(`http://numbersapi.com/${num}/trivia?json`);
          if (response.ok) {
            const data = await response.json();
            articles.push({
              title: `数字 ${num} 的秘密`,
              category: "Number Facts",
              extract: data.text,
              url: `http://numbersapi.com/${num}`,
              number: data.number
            });
          }
        }
      } catch (e) {
        console.log('Numbers API也失败');
      }
    }

    // 如果还是没有，使用 Dog Facts API
    if (articles.length === 0) {
      try {
        const response = await fetch('https://dogapi.dog/api/v2/facts?limit=8');
        if (response.ok) {
          const data = await response.json();
          data.data.forEach((fact, index) => {
            articles.push({
              title: `狗狗趣闻 #${index + 1}`,
              category: "Dog Facts",
              extract: fact.attributes.body,
              url: 'https://dogapi.dog'
            });
          });
        }
      } catch (e) {
        console.log('Dog Facts API也失败');
      }
    }

    knowledgeArticles.value = articles;
  } catch (error) {
    console.error("获取知识文章失败:", error);
    knowledgeArticles.value = [];
  } finally {
    loading.value = false;
  }
};

// 获取萌宠图片
const fetchAnimalImages = async () => {
  loading.value = true;
  try {
    if (currentAnimalType.value === "cats") {
      const response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=12`);
      if (response.ok) {
        animalImages.value = await response.json();
      }
    } else {
      const dogImages = [];
      const breedsResponse = await fetch("https://dog.ceo/api/breeds/list/all");
      const breedsData = await breedsResponse.json();
      const breeds = Object.keys(breedsData.message).sort(() => Math.random() - 0.5);
      for (let i = 0; i < Math.min(12, breeds.length); i++) {
        const dogResponse = await fetch(`https://dog.ceo/api/breed/${breeds[i]}/images/random`);
        const dogData = await dogResponse.json();
        if (dogData.status === "success") {
          dogImages.push({ url: dogData.message, breeds: [{ name: breeds[i] }], id: Date.now() + i });
        }
      }
      animalImages.value = dogImages;
    }
    setTimeout(() => initLazyLoad(), 100);
  } catch (error) {
    console.error("获取萌宠图片失败:", error);
    animalImages.value = [];
  } finally {
    loading.value = false;
  }
};

// 切换动物类型
const switchAnimalType = (type) => {
  currentAnimalType.value = type;
  fetchAnimalImages();
};

// 获取太空数据 - 使用NASA APOD API和SpaceX API
const fetchSpaceData = async () => {
  loading.value = true;
  try {
    // NASA Astronomy Picture of the Day API (免费，无需API key的演示端点)
    // 使用开放的NASA图片API
    try {
      const nasaResponse = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
      if (nasaResponse.ok) {
        const nasaData = await nasaResponse.json();
        todayImage.value = {
          title: nasaData.title,
          date: nasaData.date,
          url: nasaData.url,
          hdurl: nasaData.hdurl || nasaData.url,
          explanation: nasaData.explanation,
          copyright: nasaData.copyright
        };
      }
    } catch (e) {
      console.log('NASA API失败，使用备用');
      // 备用：使用真实的太空图片
      todayImage.value = {
        title: '银河系中心',
        date: new Date().toISOString().split("T")[0],
        url: 'https://apod.nasa.gov/apod/image/2312/MilkyWayRisesItaly_Giannobile_960.jpg',
        hdurl: 'https://apod.nasa.gov/apod/image/2312/MilkyWayRisesItaly_Giannobile_2048.jpg',
        explanation: '这是一张来自NASA天文每日一图的真实太空照片。'
      };
    }

    // SpaceX API - 获取最新发射信息
    try {
      const spacexResponse = await fetch('https://api.spacexdata.com/v4/launches/latest');
      if (spacexResponse.ok) {
        const launch = await spacexResponse.json();
        marsWeather.value = {
          mission: launch.name,
          success: launch.success,
          details: launch.details || '暂无详细信息',
          date: launch.date_utc,
          rocket: launch.rocket,
          flightNumber: launch.flight_number
        };
      }
    } catch (e) {
      console.log('SpaceX API失败');
      marsWeather.value = null;
    }

    setTimeout(() => initLazyLoad(), 100);
  } catch (error) {
    console.error("获取太空数据失败:", error);
    todayImage.value = null;
    marsWeather.value = null;
  } finally {
    loading.value = false;
  }
};

// 获取名言 - 使用可靠的API
const fetchQuotes = async () => {
  loading.value = true;
  try {
    const quotes_data = [];
    
    // API 1: DummyJSON Quotes API - 稳定可靠
    try {
      const response = await fetch('https://dummyjson.com/quotes?limit=10');
      if (response.ok) {
        const data = await response.json();
        data.quotes.forEach((quote) => {
          quotes_data.push({
            q: quote.quote,
            a: quote.author,
            id: quote.id
          });
        });
      }
    } catch (e) {
      console.log('DummyJSON Quotes API失败');
    }

    // 如果第一个API失败，使用 Game of Thrones Quotes
    if (quotes_data.length === 0) {
      try {
        for (let i = 0; i < 8; i++) {
          const response = await fetch('https://api.gameofthronesquotes.xyz/v1/random');
          if (response.ok) {
            const data = await response.json();
            quotes_data.push({
              q: data.sentence,
              a: data.character.name,
              id: `got-${i}`
            });
          }
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      } catch (e) {
        console.log('GoT Quotes API也失败');
      }
    }

    // 如果还是没有数据，使用 Breaking Bad Quotes
    if (quotes_data.length === 0) {
      try {
        const response = await fetch('https://api.breakingbadquotes.xyz/v1/quotes/8');
        if (response.ok) {
          const data = await response.json();
          data.forEach((quote, index) => {
            quotes_data.push({
              q: quote.quote,
              a: quote.author,
              id: `bb-${index}`
            });
          });
        }
      } catch (e) {
        console.log('Breaking Bad Quotes API也失败');
      }
    }

    quotes.value = quotes_data;
  } catch (error) {
    console.error("获取名言失败:", error);
    quotes.value = [];
  } finally {
    loading.value = false;
  }
};

// 获取诗词
const fetchPoetry = async () => {
  loading.value = true;
  try {
    const poetryList = [];
    for (let i = 0; i < 6; i++) {
      try {
        const response = await fetch('https://v2.jinrishici.com/one.json');
        if (response.ok) {
          const data = await response.json();
          if (data.status === 'success' && data.data) {
            const poem = data.data;
            poetryList.push({
              title: poem.origin.title,
              author: poem.origin.author,
              dynasty: poem.origin.dynasty,
              content: poem.origin.content,
              translation: poem.origin.translate || '',
              id: `${poem.origin.title}-${i}`
            });
          }
        }
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.log('获取诗词失败', e);
      }
    }
    poetries.value = poetryList;
  } catch (error) {
    console.error("获取诗词失败:", error);
    poetries.value = [];
  } finally {
    loading.value = false;
  }
};

// 获取美食
const fetchFood = async () => {
  loading.value = true;
  try {
    const foodList = [];
    for (let i = 0; i < 12; i++) {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
      if (response.ok) {
        const data = await response.json();
        if (data.meals && data.meals[0]) {
          const meal = data.meals[0];
          foodList.push({
            id: meal.idMeal,
            name: meal.strMeal,
            category: meal.strCategory,
            area: meal.strArea,
            image: meal.strMealThumb,
            tags: meal.strTags ? meal.strTags.split(',') : [],
            youtube: meal.strYoutube,
            source: meal.strSource
          });
        }
      }
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    foods.value = foodList;
    setTimeout(() => initLazyLoad(), 100);
  } catch (error) {
    console.error("获取美食失败:", error);
    foods.value = [];
  } finally {
    loading.value = false;
  }
};

// 获取艺术作品
const fetchArt = async () => {
  loading.value = true;
  try {
    const artList = [];
    const page = Math.floor(Math.random() * 100) + 1;
    const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}&limit=12&fields=id,title,artist_display,date_display,image_id`);
    if (response.ok) {
      const data = await response.json();
      if (data.data) {
        data.data.forEach(art => {
          if (art.image_id) {
            artList.push({
              id: `aic-${art.id}`,
              title: art.title || '无题',
              artist: art.artist_display || '未知艺术家',
              date: art.date_display || '',
              image: `https://www.artic.edu/iiif/2/${art.image_id}/full/843,/0/default.jpg`,
              thumbnail: `https://www.artic.edu/iiif/2/${art.image_id}/full/400,/0/default.jpg`,
              museum: 'Art Institute of Chicago'
            });
          }
        });
      }
    }
    artworks.value = artList.sort(() => Math.random() - 0.5);
    setTimeout(() => initLazyLoad(), 100);
  } catch (error) {
    console.error("获取艺术作品失败:", error);
    artworks.value = [];
  } finally {
    loading.value = false;
  }
};

// 打开图片预览
const openImagePreview = (image) => {
  selectedImage.value = image;
  showImagePreview.value = true;
  document.body.style.overflow = "hidden";
};

// 关闭图片预览
const closeImagePreview = () => {
  showImagePreview.value = false;
  selectedImage.value = null;
  document.body.style.overflow = "";
};

// 打开文章链接
const openArticleLink = (article) => {
  if (article.url) window.open(article.url, "_blank");
};

// 打开动物预览
const openAnimalPreview = (animal) => {
  openImagePreview({ urls: { regular: animal.url, small: animal.url }, alt_description: animal.breeds?.[0]?.name || "可爱动物", user: { name: '动物图片' } });
};

// 打开美食详情
const openFoodDetail = (food) => {
  if (food.youtube) window.open(food.youtube, '_blank');
  else if (food.source) window.open(food.source, '_blank');
};

// 打开艺术作品预览
const openArtPreview = (art) => {
  openImagePreview({ urls: { regular: art.image, small: art.thumbnail || art.image }, alt_description: art.title, user: { name: art.artist }, location: { name: art.museum } });
};

// 懒加载实现
const initLazyLoad = () => {
  const lazyImages = document.querySelectorAll('.lazy-image');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.getAttribute('data-src');
        if (src) {
          const tempImg = new Image();
          tempImg.onload = () => { img.src = src; img.classList.add('loaded'); };
          tempImg.onerror = () => { img.classList.add('error'); };
          tempImg.src = src;
          observer.unobserve(img);
        }
      }
    });
  }, { rootMargin: '50px' });
  lazyImages.forEach(img => imageObserver.observe(img));
};

// 切换视图模式
const toggleViewMode = () => {
  const modes = ["grid", "list", "masonry"];
  const currentIndex = modes.indexOf(viewMode.value);
  viewMode.value = modes[(currentIndex + 1) % modes.length];
};

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return "未知";
  return new Date(dateStr).toLocaleDateString("zh-CN");
};

// 图片加载处理
const handleImageLoad = (event) => {
  event.target.classList.add("loaded");
};

// 悬浮按钮功能
const toggleFloatingMenu = () => { showFloatingMenu.value = !showFloatingMenu.value; };
const refreshWithRandom = () => { refreshContent(); showFloatingMenu.value = false; };
const backToTop = () => { window.scrollTo({ top: 0, behavior: "smooth" }); showFloatingMenu.value = false; };
const randomMode = () => {
  const modes = ["scenery", "knowledge", "animals", "space", "quotes", "poetry", "food", "art"];
  const newModes = modes.filter(m => m !== currentMode.value);
  switchMode(newModes[Math.floor(Math.random() * newModes.length)]);
  showFloatingMenu.value = false;
};
const toggleFullscreen = () => {
  if (!document.fullscreenElement) { document.documentElement.requestFullscreen(); isFullscreen.value = true; }
  else { document.exitFullscreen(); isFullscreen.value = false; }
  showFloatingMenu.value = false;
};

// 监听滚动
const handleScroll = () => { 
  showBackToTop.value = window.scrollY > 300; 
  updateScrollProgress();
};

onMounted(() => { 
  refreshContent(); 
  window.addEventListener("scroll", handleScroll); 
  updateScrollProgress();
  restorePosition();
});
onUnmounted(() => { 
  window.removeEventListener("scroll", handleScroll); 
});
</script>


<style scoped>
.relaxation-container {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  --page-bg-start: #102131;
  --page-bg-end: #1d3347;
  --surface: rgba(13, 24, 37, 0.62);
  --surface-soft: rgba(255, 255, 255, 0.08);
  --surface-hover: rgba(255, 255, 255, 0.14);
  --border-soft: rgba(255, 255, 255, 0.14);
  --text-primary: #f5efdf;
  --text-secondary: rgba(245, 239, 223, 0.78);
  --accent: #d2b47f;
  --accent-strong: #f6dfaa;
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.14), transparent 34%),
    radial-gradient(circle at 78% 14%, rgba(210, 180, 127, 0.2), transparent 28%),
    linear-gradient(140deg, var(--page-bg-start) 0%, var(--page-bg-end) 56%, #24384e 100%);
  color: var(--text-primary);
}

.theme-scenery {
  --page-bg-start: #112331;
  --page-bg-end: #2a5168;
  --accent: #8fd0ff;
  --accent-strong: #e2f5ff;
}

.theme-knowledge {
  --page-bg-start: #122328;
  --page-bg-end: #36524b;
  --accent: #b3e694;
  --accent-strong: #ecffd9;
}

.theme-animals {
  --page-bg-start: #231d2f;
  --page-bg-end: #6a4c6d;
  --accent: #ffcf9d;
  --accent-strong: #fff1d3;
}

.theme-space {
  --page-bg-start: #090f1f;
  --page-bg-end: #27335f;
  --accent: #9fb3ff;
  --accent-strong: #dfe5ff;
}

.theme-quotes {
  --page-bg-start: #1f1a22;
  --page-bg-end: #4e4047;
  --accent: #f5cdb8;
  --accent-strong: #fff0e8;
}

.theme-poetry {
  --page-bg-start: #211717;
  --page-bg-end: #5b3e34;
  --accent: #f1c885;
  --accent-strong: #fff0cf;
}

.theme-food {
  --page-bg-start: #231c17;
  --page-bg-end: #744938;
  --accent: #f4c27c;
  --accent-strong: #ffe8bf;
}

.theme-art {
  --page-bg-start: #161e28;
  --page-bg-end: #4d5365;
  --accent: #cdb3ff;
  --accent-strong: #efe6ff;
}

.ambient-grid,
.ambient-orb {
  pointer-events: none;
  position: fixed;
  inset: 0;
}

.ambient-grid {
  z-index: 0;
  opacity: 0.32;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.85), transparent 82%);
}

.ambient-orb {
  z-index: 0;
  filter: blur(80px);
}

.ambient-orb-a {
  inset: auto auto 12% -8%;
  width: 360px;
  height: 360px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--accent) 48%, transparent);
  opacity: 0.24;
}

.ambient-orb-b {
  inset: 8% -6% auto auto;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  opacity: 0.24;
}

.relaxation-header {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px clamp(20px, 3vw, 40px);
  background: linear-gradient(180deg, rgba(8, 15, 24, 0.86) 0%, rgba(8, 15, 24, 0.52) 100%);
  backdrop-filter: blur(18px) saturate(140%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-wrap: wrap;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 18px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 16px;
  border: 1px solid var(--border-soft);
  background: var(--surface-soft);
  color: var(--text-primary);
  border-radius: 999px;
  transition: transform 0.3s ease, background 0.3s ease, border-color 0.3s ease;
}

.back-btn:hover {
  background: var(--surface-hover);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.title-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.title-kicker {
  margin: 0;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--text-secondary);
}

.page-title {
  font-size: clamp(26px, 3vw, 34px);
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.02em;
  font-family: 'Georgia', 'Times New Roman', 'Songti SC', 'STSong', serif;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.toolbar-ghost-btn,
.view-toggle-btn,
.hero-action,
.retry-btn,
.animal-switch button,
.read-more-btn,
.action-btn {
  border: 1px solid var(--border-soft);
  color: var(--text-primary);
  background: var(--surface-soft);
}

.toolbar-ghost-btn,
.view-toggle-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 16px;
  border-radius: 999px;
  font-size: 14px;
  transition: transform 0.3s ease, background 0.3s ease, border-color 0.3s ease;
}

.toolbar-ghost-btn:hover,
.view-toggle-btn:hover {
  background: var(--surface-hover);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.view-toggle-btn {
  gap: 10px;
  min-width: 136px;
  justify-content: space-between;
}

.view-toggle-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.view-toggle-btn strong {
  font-size: 14px;
  font-weight: 700;
}

.relaxation-content {
  position: relative;
  z-index: 1;
  width: min(1360px, calc(100% - 48px));
  margin: 0 auto;
  padding: 40px 0 0;
}

.relaxation-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(320px, 0.85fr);
  gap: 22px;
  margin-bottom: 28px;
}

.hero-copy,
.hero-note {
  border-radius: 30px;
  border: 1px solid var(--border-soft);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.11), rgba(255, 255, 255, 0.04));
  box-shadow: 0 24px 60px rgba(4, 10, 18, 0.24);
  backdrop-filter: blur(18px);
}

.hero-copy {
  padding: clamp(28px, 4vw, 44px);
}

.hero-kicker {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--text-secondary);
}

.hero-title {
  margin: 18px 0 18px;
  max-width: 12ch;
  font-size: clamp(40px, 6vw, 72px);
  line-height: 1.02;
  letter-spacing: -0.03em;
  font-weight: 700;
  font-family: 'Georgia', 'Times New Roman', 'Songti SC', 'STSong', serif;
}

.hero-description {
  max-width: 44rem;
  margin: 0 0 26px;
  font-size: 16px;
  line-height: 1.85;
  color: var(--text-secondary);
}

.hero-actions,
.hero-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.hero-actions {
  margin-bottom: 26px;
}

.hero-action {
  min-height: 46px;
  padding: 0 18px;
  border-radius: 999px;
  transition: transform 0.3s ease, background 0.3s ease, border-color 0.3s ease;
}

.hero-action:hover,
.retry-btn:hover,
.animal-switch button:hover,
.read-more-btn:hover,
.action-btn:hover {
  background: var(--surface-hover);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.hero-action.primary {
  color: #142133;
  background: linear-gradient(135deg, var(--accent-strong), color-mix(in srgb, var(--accent) 68%, white));
  border-color: transparent;
}

.hero-action.primary:hover {
  background: linear-gradient(135deg, color-mix(in srgb, var(--accent-strong) 90%, white), var(--accent));
}

.metric-pill {
  min-width: 154px;
  padding: 14px 16px;
  border-radius: 18px;
  border: 1px solid var(--border-soft);
  background: rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.metric-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.metric-pill strong {
  font-size: 18px;
  font-weight: 700;
}

.hero-side {
  display: grid;
  gap: 18px;
}

.hero-note {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.hero-note-primary h3,
.hero-side-text {
  margin: 0;
  font-size: 24px;
  line-height: 1.4;
  font-family: 'Georgia', 'Times New Roman', 'Songti SC', 'STSong', serif;
}

.hero-note-primary p,
.hero-note-secondary p {
  margin: 0;
  line-height: 1.75;
  color: var(--text-secondary);
}

.hero-note-label {
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-secondary);
}

.hero-note-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.hero-note-icon {
  font-size: 24px;
}

.hero-wave {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 48px;
}

.hero-wave span {
  flex: 1;
  border-radius: 999px;
  background: linear-gradient(180deg, var(--accent-strong), rgba(255, 255, 255, 0.22));
  animation: wavePulse 1.8s ease-in-out infinite;
}

.hero-wave span:nth-child(1) { height: 28%; animation-delay: 0s; }
.hero-wave span:nth-child(2) { height: 68%; animation-delay: 0.12s; }
.hero-wave span:nth-child(3) { height: 42%; animation-delay: 0.24s; }
.hero-wave span:nth-child(4) { height: 82%; animation-delay: 0.36s; }
.hero-wave span:nth-child(5) { height: 48%; animation-delay: 0.48s; }
.hero-wave span:nth-child(6) { height: 62%; animation-delay: 0.6s; }

.mode-switcher {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 36px;
}

.mode-card {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 16px 18px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-primary);
  text-align: left;
  transition: transform 0.3s ease, background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.mode-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.16);
}

.mode-card.active {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.08));
  border-color: rgba(255, 255, 255, 0.22);
  box-shadow: 0 14px 30px rgba(4, 10, 18, 0.18);
}

.mode-card-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.08);
  font-size: 20px;
}

.mode-card-copy {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mode-card-copy strong {
  font-size: 15px;
  font-weight: 700;
}

.mode-card-copy small {
  color: var(--text-secondary);
  font-size: 12px;
}

.mode-card-count {
  min-width: 34px;
  height: 34px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 700;
}

.content-header {
  margin: 0 0 26px;
  padding-left: 8px;
  text-align: left;
}

.content-header h2 {
  font-size: clamp(28px, 3.4vw, 44px);
  margin: 0 0 10px;
  font-family: 'Georgia', 'Times New Roman', 'Songti SC', 'STSong', serif;
  line-height: 1.12;
}

.content-header p {
  max-width: 42rem;
  font-size: 15px;
  opacity: 1;
  margin: 0;
  line-height: 1.8;
  color: var(--text-secondary);
}

.loading {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.18);
  border-top: 3px solid var(--accent-strong);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes wavePulse {
  0%,
  100% {
    opacity: 0.48;
    transform: scaleY(0.88);
  }

  50% {
    opacity: 1;
    transform: scaleY(1.08);
  }
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 统一的网格布局系统 */
.unified-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

/* 图片画廊 - 统一4列布局 */
.image-gallery {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.image-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  aspect-ratio: 4/3;
  background: rgba(255, 255, 255, 0.1);
}

.image-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.5s;
  opacity: 0;
}

.gallery-image.loaded {
  opacity: 1;
}

.image-card:hover .gallery-image {
  transform: scale(1.1);
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: 20px;
  opacity: 0;
  transition: opacity 0.3s;
}

.image-card:hover .image-overlay {
  opacity: 1;
}

.image-info h3 {
  font-size: 14px;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.image-info p {
  font-size: 12px;
  margin: 4px 0;
  opacity: 0.8;
}

/* 知识卡片 - 统一4列布局 */
.knowledge-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.knowledge-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  min-height: 220px;
}

.knowledge-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
}

.card-header {
  margin-bottom: 16px;
}

.category-tag {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  font-size: 12px;
  margin-bottom: 12px;
}

.card-header h3 {
  font-size: 16px;
  margin: 0;
  line-height: 1.4;
}

.card-content {
  flex: 1;
}

.card-content p {
  line-height: 1.6;
  opacity: 0.9;
  margin: 0;
  font-size: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 16px;
}

.read-more-btn {
  color: var(--text-primary);
  text-decoration: none;
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 16px;
  transition: all 0.3s;
}

.article-source {
  font-size: 11px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 4px 10px;
  border-radius: 12px;
  opacity: 0.8;
}

/* 萌宠 - 统一4列布局 */
.animal-gallery {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 30px;
}

.animal-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.animal-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
}

.animal-card:hover .animal-image {
  transform: scale(1.1);
}

.animal-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  opacity: 0;
  transition: all 0.5s;
}

.animal-image.loaded {
  opacity: 1;
}

.animal-info {
  padding: 16px;
}

.animal-info h3 {
  margin: 0 0 8px 0;
  font-size: 14px;
}

.animal-info p {
  margin: 0;
  font-size: 12px;
  opacity: 0.8;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.animal-switch {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.animal-switch button {
  padding: 12px 24px;
  border-radius: 25px;
  transition: all 0.3s;
}

.animal-switch button.active {
  background: linear-gradient(135deg, var(--accent-strong), color-mix(in srgb, var(--accent) 68%, white));
  border-color: transparent;
  color: #142133;
}

/* 太空 */
.space-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.today-image-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
}

.space-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  cursor: pointer;
  opacity: 0;
  transition: all 0.5s;
}

.space-image.loaded {
  opacity: 1;
}

.space-image:hover {
  transform: scale(1.02);
}

.space-info {
  padding: 24px;
}

.space-info h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
}

.space-date {
  margin: 0 0 16px 0;
  font-size: 14px;
  opacity: 0.8;
}

.space-description {
  margin: 0;
  line-height: 1.6;
  opacity: 0.9;
}

.mars-weather {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
}

.mars-weather h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
}

.weather-info p {
  margin: 8px 0;
  opacity: 0.9;
}

/* 名言 */
.quotes-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.quote-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s;
}

.quote-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.quote-text {
  font-size: clamp(24px, 3vw, 34px);
  line-height: 1.55;
  margin-bottom: 16px;
  font-style: italic;
  text-align: left;
  font-family: 'Georgia', 'Times New Roman', 'Songti SC', 'STSong', serif;
}

.quote-author {
  text-align: left;
  opacity: 0.8;
  font-size: 14px;
}

/* 诗词 */
.poetry-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 24px;
}

.poetry-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 32px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.poetry-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, var(--accent-strong) 0%, color-mix(in srgb, var(--accent) 72%, #ff6b6b) 100%);
}

.poetry-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-4px);
}

.poetry-header {
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 16px;
}

.poetry-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 12px 0;
  text-align: center;
}

.poetry-meta {
  display: flex;
  justify-content: center;
  gap: 16px;
  font-size: 14px;
}

.poetry-dynasty,
.poetry-author {
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
}

.poetry-content {
  margin-bottom: 20px;
}

.poetry-line {
  font-size: 18px;
  line-height: 2;
  margin: 8px 0;
  text-align: center;
  font-family: 'KaiTi', 'STKaiti', serif;
}

.poetry-translation {
  font-size: 14px;
  line-height: 1.8;
  padding: 16px;
  background: rgba(0, 0, 0, 0.16);
  border-radius: 8px;
  border-left: 3px solid color-mix(in srgb, var(--accent) 72%, white);
  opacity: 0.9;
}

/* 美食 */
.food-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.food-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.food-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
}

.food-image-wrapper {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
}

.food-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.5s;
  opacity: 0;
}

.food-image.loaded {
  opacity: 1;
}

.food-card:hover .food-image {
  transform: scale(1.1);
}

.food-category-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 14px;
  background: var(--accent-strong);
  color: #142133;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.food-info {
  padding: 20px;
}

.food-name {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 12px 0;
}

.food-area {
  font-size: 13px;
  opacity: 0.8;
  margin: 0 0 12px 0;
}

.food-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.food-tag {
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  font-size: 11px;
}

/* 艺术 */
.art-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.art-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.art-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

.art-image-wrapper {
  width: 100%;
  height: 280px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.art-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: all 0.5s;
  opacity: 0;
}

.art-image.loaded {
  opacity: 1;
}

.art-card:hover .art-image {
  transform: scale(1.05);
}

.art-info {
  padding: 20px;
  background: rgba(0, 0, 0, 0.14);
}

.art-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 10px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.art-artist,
.art-date,
.art-museum {
  font-size: 13px;
  opacity: 0.8;
  margin: 6px 0;
}

.image-card,
.knowledge-card,
.animal-card,
.today-image-card,
.mars-weather,
.quote-card,
.poetry-card,
.food-card,
.art-card,
.no-data {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border: 1px solid var(--border-soft);
  box-shadow: 0 18px 42px rgba(4, 10, 18, 0.16);
  backdrop-filter: blur(16px);
}

.image-card:hover,
.knowledge-card:hover,
.animal-card:hover,
.quote-card:hover,
.poetry-card:hover,
.food-card:hover,
.art-card:hover {
  box-shadow: 0 28px 56px rgba(4, 10, 18, 0.24);
}

.scenery-mode,
.knowledge-mode,
.animals-mode,
.space-mode,
.quotes-mode,
.poetry-mode,
.food-mode,
.art-mode {
  animation: fadeUp 0.6s ease both;
}

/* 视图模式 */
.view-list .image-gallery,
.view-list .knowledge-cards,
.view-list .animal-gallery,
.view-list .food-gallery,
.view-list .art-gallery,
.view-list .poetry-container {
  grid-template-columns: 1fr;
  max-width: 1120px;
  margin: 0 auto;
}

.view-list .image-card,
.view-list .animal-card,
.view-list .food-card,
.view-list .art-card {
  display: grid;
  grid-template-columns: minmax(220px, 320px) minmax(0, 1fr);
  align-items: stretch;
  min-height: 240px;
  aspect-ratio: auto;
}

.view-list .image-card .gallery-image,
.view-list .image-card .image-overlay,
.view-list .animal-image,
.view-list .food-image-wrapper,
.view-list .art-image-wrapper {
  height: 100%;
}

.view-list .image-card:hover .gallery-image {
  transform: none;
}

.view-list .image-overlay {
  position: static;
  opacity: 1;
  display: flex;
  align-items: flex-end;
  padding: 28px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(0, 0, 0, 0.12));
}

.view-list .knowledge-card {
  min-height: auto;
}

.view-masonry .image-gallery,
.view-masonry .animal-gallery,
.view-masonry .food-gallery,
.view-masonry .art-gallery {
  display: block;
  column-count: 4;
  column-gap: 22px;
}

.view-masonry .image-card,
.view-masonry .animal-card,
.view-masonry .food-card,
.view-masonry .art-card {
  display: inline-block;
  width: 100%;
  margin: 0 0 22px;
  break-inside: avoid;
}

.view-masonry .image-card {
  aspect-ratio: auto;
}

.view-masonry .image-card:nth-child(4n + 1) {
  aspect-ratio: 4 / 5;
}

.view-masonry .image-card:nth-child(4n + 2) {
  aspect-ratio: 1 / 1;
}

.view-masonry .image-card:nth-child(4n + 3) {
  aspect-ratio: 16 / 10;
}

.view-masonry .image-card:nth-child(4n) {
  aspect-ratio: 3 / 4;
}

.view-masonry .animal-card:nth-child(3n),
.view-masonry .food-card:nth-child(3n),
.view-masonry .art-card:nth-child(3n) {
  margin-top: 16px;
}

.view-masonry .knowledge-cards,
.view-masonry .poetry-container {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

/* 懒加载占位符 */
.lazy-image {
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.16) 50%, rgba(255, 255, 255, 0.04) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* 无数据 */
.no-data {
  text-align: center;
  padding: 60px 20px;
  border-radius: 16px;
  max-width: 500px;
  margin: 20px auto;
}

.no-data p {
  font-size: 18px;
  margin-bottom: 20px;
  opacity: 0.9;
}

.retry-btn {
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

/* 图片预览 */
.image-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.preview-container {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.close-preview {
  position: absolute;
  top: -50px;
  right: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.close-preview:hover {
  background: rgba(255, 255, 255, 0.2);
}

.preview-image {
  max-width: 100%;
  max-height: 70vh;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.preview-info {
  margin-top: 20px;
  text-align: center;
  color: white;
}

.preview-info h3 {
  font-size: 20px;
  margin: 0 0 8px 0;
}

.preview-info p {
  margin: 4px 0;
  opacity: 0.8;
}

/* 悬浮按钮 */
.floating-buttons {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.float-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
}

.float-btn:hover {
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 6px 24px rgba(59, 130, 246, 0.5);
}

.float-btn:active {
  transform: translateY(-2px) scale(1.02);
}

.float-btn.main-btn {
  width: 56px;
  height: 56px;
  font-size: 24px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
}

.float-btn.main-btn:hover {
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
}

.float-btn.main-btn.active {
  transform: rotate(90deg) scale(1.05);
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
}

.float-btn.back-to-top {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  position: absolute;
  bottom: 140px;
}

.float-btn.back-to-top:hover {
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
}

.float-menu {
  position: absolute;
  bottom: 70px;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.float-btn.menu-btn {
  width: auto;
  min-width: 56px;
  height: 48px;
  border-radius: 24px;
  padding: 0 20px;
  font-size: 18px;
  background: rgba(255, 255, 255, 0.95);
  color: #3b82f6;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.float-btn.menu-btn span {
  font-size: 14px;
  font-weight: 600;
}

.float-btn.menu-btn:hover {
  background: white;
  transform: translateX(-8px) scale(1.02);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  color: #8b5cf6;
}

/* 响应式 */
@media (max-width: 1080px) {
  .relaxation-hero {
    grid-template-columns: 1fr;
  }

  .mode-switcher {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .view-masonry .image-gallery,
  .view-masonry .animal-gallery,
  .view-masonry .food-gallery,
  .view-masonry .art-gallery {
    column-count: 3;
  }
}

@media (max-width: 768px) {
  .relaxation-header {
    padding: 16px 18px;
    align-items: flex-start;
  }

  .header-left,
  .header-right {
    width: 100%;
  }

  .header-right {
    justify-content: space-between;
  }

  .toolbar-ghost-btn,
  .view-toggle-btn {
    flex: 1 1 0;
    min-width: 0;
  }

  .relaxation-content {
    width: min(100%, calc(100% - 32px));
    padding-top: 24px;
  }

  .hero-copy {
    padding: 24px 20px;
  }

  .hero-title {
    max-width: none;
    font-size: clamp(32px, 12vw, 48px);
  }

  .hero-description {
    font-size: 15px;
  }

  .hero-metrics {
    display: grid;
    grid-template-columns: 1fr;
  }

  .metric-pill {
    min-width: 0;
  }

  .mode-switcher {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .mode-card {
    padding: 14px 12px;
    align-items: flex-start;
  }

  .mode-card-count {
    min-width: 30px;
    height: 30px;
  }

  .content-header {
    padding-left: 0;
  }

  .content-header h2 {
    font-size: 28px;
  }

  .image-gallery,
  .food-gallery,
  .art-gallery,
  .animal-gallery,
  .knowledge-cards,
  .poetry-container {
    grid-template-columns: 1fr;
  }

  .view-list .image-card,
  .view-list .animal-card,
  .view-list .food-card,
  .view-list .art-card {
    grid-template-columns: 1fr;
  }

  .view-list .food-image-wrapper,
  .view-list .art-image-wrapper,
  .view-list .animal-image {
    min-height: 220px;
  }

  .view-masonry .image-gallery,
  .view-masonry .animal-gallery,
  .view-masonry .food-gallery,
  .view-masonry .art-gallery {
    column-count: 1;
  }

  .poetry-line {
    font-size: 16px;
  }
}

/* 悬浮工具栏容器 */
.floating-toolbar-container {
  position: fixed;
  z-index: 9998;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

/* 主悬浮按钮 */
.relaxation-fab {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 1px solid var(--border-soft);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.13), rgba(255, 255, 255, 0.05));
  box-shadow: 0 16px 32px rgba(4, 10, 18, 0.28);
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  user-select: none;
  touch-action: none;
}

.relaxation-fab:hover {
  transform: scale(1.05);
  box-shadow: 0 20px 38px rgba(4, 10, 18, 0.34);
}

.relaxation-fab.is-dragging {
  cursor: grabbing;
  transform: scale(1.1);
  box-shadow: 0 24px 42px rgba(4, 10, 18, 0.38);
}

.relaxation-fab.is-expanded {
  background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 52%, rgba(255, 255, 255, 0.12)), rgba(255, 255, 255, 0.08));
  cursor: pointer;
}

/* 进度环 */
.progress-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
  pointer-events: none;
}

.progress-ring-bg {
  stroke: rgba(255, 255, 255, 0.2);
}

.progress-ring-fill {
  stroke: var(--accent-strong);
  stroke-linecap: round;
  transition: stroke-dashoffset 0.3s ease;
}

.progress-text {
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  z-index: 1;
  pointer-events: none;
}

/* 工具面板 */
.toolbar-panel {
  position: fixed;
  background: rgba(8, 15, 24, 0.92);
  border: 1px solid var(--border-soft);
  border-radius: 16px;
  padding: 16px;
  height: 320px;
  overflow-y: auto;
  box-shadow: 0 18px 46px rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(18px);
  z-index: 10001;
  transition: all 0.2s ease;
}

/* 面板滚动条样式 */
.toolbar-panel::-webkit-scrollbar {
  width: 4px;
}

.toolbar-panel::-webkit-scrollbar-track {
  background: transparent;
}

.toolbar-panel::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.18);
  border-radius: 2px;
}

.toolbar-panel::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.28);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.panel-close {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.panel-close:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
}

.panel-section {
  margin-bottom: 16px;
}

.panel-section:last-child {
  margin-bottom: 0;
}

.section-label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.progress-bar-container {
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 4px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--accent-strong));
  border-radius: 3px;
  transition: width 0.2s ease;
}

.progress-info {
  font-size: 12px;
  color: var(--text-secondary);
  text-align: right;
}

.action-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.action-btn svg {
  flex-shrink: 0;
}

/* 面板动画 */
.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.panel-slide-enter-from,
.panel-slide-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

@media (max-width: 768px) {
  .relaxation-fab {
    width: 48px;
    height: 48px;
  }
  
  .progress-text {
    font-size: 10px;
  }
  
  .toolbar-panel {
    height: 280px !important;
    max-height: calc(100vh - 120px) !important;
    padding: 12px;
  }
  
  .panel-section {
    margin-bottom: 12px;
  }
  
  .section-label {
    font-size: 11px;
  }
}
</style>
