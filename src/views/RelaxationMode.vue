<template>
  <div class="relaxation-container" :class="`view-${viewMode}`">
    <!-- 头部导航 -->
    <header class="relaxation-header">
      <div class="header-left">
        <button class="back-btn" @click="goBack">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m12 19-7-7 7-7"></path>
            <path d="m19 12-7 7-7-7"></path>
          </svg>
          返回
        </button>
        <h1 class="page-title">休闲时光</h1>
      </div>

      <div class="header-right">
        <button class="mode-btn" :class="{ active: currentMode === 'scenery' }" @click="switchMode('scenery')">美景</button>
        <button class="mode-btn" :class="{ active: currentMode === 'knowledge' }" @click="switchMode('knowledge')">知识</button>
        <button class="mode-btn" :class="{ active: currentMode === 'animals' }" @click="switchMode('animals')">萌宠</button>
        <button class="mode-btn" :class="{ active: currentMode === 'space' }" @click="switchMode('space')">太空</button>
        <button class="mode-btn" :class="{ active: currentMode === 'quotes' }" @click="switchMode('quotes')">名言</button>
        <button class="mode-btn" :class="{ active: currentMode === 'poetry' }" @click="switchMode('poetry')">诗词</button>
        <button class="mode-btn" :class="{ active: currentMode === 'food' }" @click="switchMode('food')">美食</button>
        <button class="mode-btn" :class="{ active: currentMode === 'art' }" @click="switchMode('art')">艺术</button>
        <button @click="toggleViewMode" class="tool-btn" title="切换视图">
          {{ viewMode === "grid" ? "⊞" : viewMode === "list" ? "☰" : "▦" }}
        </button>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="relaxation-content">
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

// 进度环参数
const circumference = 2 * Math.PI * 18;

// 计算属性
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.relaxation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  flex-wrap: wrap;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 8px;
  transition: all 0.3s;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.mode-btn {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 20px;
  transition: all 0.3s;
  font-size: 14px;
}

.mode-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.mode-btn.active {
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
}

.tool-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 50%;
  transition: all 0.3s;
  font-size: 18px;
}

.tool-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.relaxation-content {
  padding: 40px;
}

.content-header {
  text-align: center;
  margin-bottom: 40px;
}

.content-header h2 {
  font-size: 32px;
  margin: 0 0 10px 0;
}

.content-header p {
  font-size: 16px;
  opacity: 0.8;
  margin: 0;
}

.loading {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
  background: rgba(255, 255, 255, 0.2);
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
  color: white;
  text-decoration: none;
  font-size: 13px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  transition: all 0.3s;
}

.read-more-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

.article-source {
  font-size: 11px;
  background: rgba(255, 255, 255, 0.2);
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
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 25px;
  transition: all 0.3s;
}

.animal-switch button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.animal-switch button.active {
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
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
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 16px;
  font-style: italic;
  text-align: center;
}

.quote-author {
  text-align: center;
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
  background: linear-gradient(180deg, #ffd700 0%, #ff6b6b 100%);
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
  background: rgba(255, 255, 255, 0.1);
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
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  border-left: 3px solid rgba(255, 215, 0, 0.5);
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
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
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
  background: rgba(255, 255, 255, 0.15);
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
  background: rgba(0, 0, 0, 0.2);
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

/* 懒加载占位符 */
.lazy-image {
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.1) 100%);
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
  background: rgba(255, 255, 255, 0.1);
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
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.retry-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
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
@media (max-width: 768px) {
  .relaxation-header {
    padding: 15px 20px;
    flex-direction: column;
    gap: 16px;
  }

  .header-right {
    width: 100%;
    overflow-x: auto;
    justify-content: flex-start;
    padding-bottom: 8px;
  }

  .mode-btn {
    white-space: nowrap;
    flex-shrink: 0;
    padding: 8px 16px;
    font-size: 13px;
  }

  .page-title {
    font-size: 20px;
  }

  .relaxation-content {
    padding: 20px;
  }

  .content-header h2 {
    font-size: 24px;
  }

  .image-gallery,
  .food-gallery,
  .art-gallery,
  .animal-gallery {
    grid-template-columns: 1fr;
  }

  .knowledge-cards,
  .poetry-container {
    grid-template-columns: 1fr;
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
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
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
  box-shadow: 0 6px 24px rgba(59, 130, 246, 0.5);
}

.relaxation-fab.is-dragging {
  cursor: grabbing;
  transform: scale(1.1);
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.6);
}

.relaxation-fab.is-expanded {
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
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
  stroke: #fff;
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
  background: var(--bg-primary, #fff);
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 16px;
  padding: 16px;
  height: 320px;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(10px);
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
  background: var(--border-color, #e0e0e0);
  border-radius: 2px;
}

.toolbar-panel::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary, #999);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color, #e0e0e0);
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary, #333);
}

.panel-close {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--text-secondary, #666);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.panel-close:hover {
  background: var(--bg-tertiary, #f0f0f0);
  color: var(--text-primary, #333);
}

.panel-section {
  margin-bottom: 16px;
}

.panel-section:last-child {
  margin-bottom: 0;
}

.section-label {
  font-size: 12px;
  color: var(--text-secondary, #666);
  margin-bottom: 8px;
}

.progress-bar-container {
  height: 6px;
  background: var(--bg-tertiary, #e0e0e0);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 4px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 3px;
  transition: width 0.2s ease;
}

.progress-info {
  font-size: 12px;
  color: var(--text-secondary, #666);
  text-align: right;
}

.action-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid var(--border-color, #e0e0e0);
  background: var(--bg-secondary, #f5f5f5);
  color: var(--text-primary, #333);
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.action-btn:hover {
  background: var(--bg-tertiary, #e0e0e0);
  border-color: var(--primary-color, #3b82f6);
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
