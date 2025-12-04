<template>
  <div class="relaxation-container">
    <!-- 头部导航 -->
    <header class="relaxation-header">
      <div class="header-left">
        <button class="back-btn" @click="goBack">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="m12 19-7-7 7-7"></path>
            <path d="m19 12-7 7-7-7"></path>
          </svg>
          返回
        </button>
        <h1 class="page-title">🌅 休闲时光</h1>
      </div>

      <div class="header-right">
        <button
          class="mode-btn"
          :class="{ active: currentMode === 'scenery' }"
          @click="switchMode('scenery')"
        >
          🏔️ 美景
        </button>
        <button
          class="mode-btn"
          :class="{ active: currentMode === 'knowledge' }"
          @click="switchMode('knowledge')"
        >
          📚 知识
        </button>
        <button class="refresh-btn" @click="refreshContent">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
            <path d="M21 3v5h-5"></path>
            <path
              d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"
            ></path>
            <path d="M3 21v-5h5"></path>
          </svg>
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

        <div v-else class="image-gallery">
          <div
            v-for="(image, index) in sceneryImages"
            :key="index"
            class="image-card"
            @click="openImagePreview(image)"
          >
            <img
              :src="image.urls.small"
              :alt="image.alt_description || '美丽风景'"
              class="gallery-image"
              @load="handleImageLoad"
            />
            <div class="image-overlay">
              <div class="image-info">
                <h3>{{ image.alt_description || "未知场景" }}</h3>
                <p>📷 {{ image.user.name }}</p>
                <p v-if="image.location?.name">📍 {{ image.location.name }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 知识模式 -->
      <div v-if="currentMode === 'knowledge'" class="knowledge-mode">
        <div class="content-header">
          <h2>📖 有趣知识探索</h2>
          <p>在轻松中学习新知识</p>
        </div>

        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          <p>正在获取有趣内容...</p>
        </div>

        <div v-else class="knowledge-cards">
          <article
            v-for="(article, index) in knowledgeArticles"
            :key="index"
            class="knowledge-card"
          >
            <div class="card-header">
              <div class="category-tag">{{ article.category }}</div>
              <h3>{{ article.title }}</h3>
            </div>
            <div class="card-content">
              <p>{{ article.extract }}</p>
            </div>
            <div class="card-footer">
              <button
                class="read-more-btn"
                @click="openWikipedia(article.title)"
              >
                阅读完整内容 →
              </button>
            </div>
          </article>
        </div>
      </div>
    </main>

    <!-- 图片预览弹窗 -->
    <Teleport to="body">
      <div
        v-if="showImagePreview"
        class="image-preview-modal"
        @click="closeImagePreview"
      >
        <div class="preview-container" @click.stop>
          <button class="close-preview" @click="closeImagePreview">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <img
            v-if="selectedImage"
            :src="selectedImage.urls.regular"
            :alt="selectedImage.alt_description"
            class="preview-image"
          />
          <div v-if="selectedImage" class="preview-info">
            <h3>{{ selectedImage.alt_description || "美丽风景" }}</h3>
            <p>📷 摄影师：{{ selectedImage.user.name }}</p>
            <p v-if="selectedImage.location?.name">
              📍 地点：{{ selectedImage.location.name }}
            </p>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const currentMode = ref("scenery"); // 'scenery' | 'knowledge'
const loading = ref(false);
const sceneryImages = ref([]);
const knowledgeArticles = ref([]);
const showImagePreview = ref(false);
const selectedImage = ref(null);

// Unsplash API配置 (使用演示密钥，生产环境需要申请自己的)
const UNSPLASH_ACCESS_KEY = "demo"; // 实际使用时需要替换为真实的API密钥

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
  if (currentMode.value === "scenery") {
    fetchSceneryImages();
  } else {
    fetchKnowledgeArticles();
  }
};

// 获取风景图片（使用Lorem Picsum作为备用方案）
const fetchSceneryImages = async () => {
  loading.value = true;
  try {
    // 生成随机风景图片数据（模拟API响应）
    const mockImages = [];
    const categories = [
      "山脉",
      "海洋",
      "森林",
      "沙漠",
      "湖泊",
      "瀑布",
      "草原",
      "雪山",
    ];
    const photographers = [
      "Alex Johnson",
      "Maria Garcia",
      "David Chen",
      "Sophie Laurent",
      "John Smith",
      "Emma Wilson",
    ];
    const locations = [
      "新西兰",
      "挪威",
      "冰岛",
      "瑞士",
      "加拿大",
      "美国",
      "智利",
      "日本",
    ];

    for (let i = 0; i < 8; i++) {
      const randomId = Math.floor(Math.random() * 1000) + 100;
      const category =
        categories[Math.floor(Math.random() * categories.length)];
      const photographer =
        photographers[Math.floor(Math.random() * photographers.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];

      mockImages.push({
        id: randomId,
        urls: {
          small: `https://picsum.photos/400/300?random=${randomId}`,
          regular: `https://picsum.photos/800/600?random=${randomId}`,
        },
        alt_description: `美丽的${category}风景`,
        user: {
          name: photographer,
        },
        location: {
          name: location,
        },
      });
    }

    sceneryImages.value = mockImages;
  } catch (error) {
    console.error("获取风景图片失败:", error);
  } finally {
    loading.value = false;
  }
};

// 获取有趣知识文章（模拟数据）
const fetchKnowledgeArticles = async () => {
  loading.value = true;
  try {
    // 模拟有趣的知识文章
    const mockArticles = [
      {
        title: "为什么天空是蓝色的？",
        category: "物理科学",
        extract:
          "天空呈现蓝色是由于光的散射现象。当太阳光进入大气层时，蓝色光波长较短，更容易被大气中的小颗粒散射，因此我们看到的天空是蓝色的...",
      },
      {
        title: "章鱼有三颗心脏",
        category: "生物奇观",
        extract:
          "章鱼是海洋中最神奇的生物之一。它们拥有三颗心脏：两颗负责将血液泵送到鳃部，一颗主心脏负责向身体其他部分供血。更有趣的是，当章鱼游泳时，主心脏会停止跳动...",
      },
      {
        title: "蜂蜜永远不会变质",
        category: "食物科学",
        extract:
          "考古学家在古埃及金字塔中发现了3000多年前的蜂蜜，至今仍然可以食用。蜂蜜的低水分含量和酸性环境使得细菌无法在其中生存，因此蜂蜜几乎永远不会变质...",
      },
      {
        title: "人类大脑的神奇能力",
        category: "神经科学",
        extract:
          "人类大脑包含约860亿个神经元，每个神经元可以与其他数千个神经元建立连接。如果把大脑中所有的神经连接打印出来，所需的纸张可以覆盖整个德克萨斯州...",
      },
      {
        title: "北极熊的皮肤是黑色的",
        category: "动物趣闻",
        extract:
          "虽然北极熊看起来是白色的，但它们的皮肤实际上是黑色的，毛发是透明的。黑色皮肤有助于吸收太阳热量，而透明的毛发能够很好地反射光线，让它们看起来是白色的...",
      },
      {
        title: "香蕉是浆果，草莓不是",
        category: "植物学",
        extract:
          '从植物学角度来说，香蕉符合浆果的定义：由单一花朵的单一子房发育而成，种子包在果肉中。而草莓的种子在外面，因此不是真正的浆果，而是"假果"...',
      },
    ];

    // 随机选择4篇文章
    const shuffled = mockArticles.sort(() => 0.5 - Math.random());
    knowledgeArticles.value = shuffled.slice(0, 4);
  } catch (error) {
    console.error("获取知识文章失败:", error);
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

// 打开Wikipedia链接
const openWikipedia = (title) => {
  const url = `https://zh.wikipedia.org/wiki/${encodeURIComponent(title)}`;
  window.open(url, "_blank");
};

// 图片加载处理
const handleImageLoad = (event) => {
  event.target.classList.add("loaded");
};

// 组件挂载时加载默认内容
onMounted(() => {
  refreshContent();
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

.refresh-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 50%;
  transition: all 0.3s;
}

.refresh-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(180deg);
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 美景模式样式 */
.image-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.image-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s;
  aspect-ratio: 4/3;
}

.image-card:hover {
  transform: scale(1.05);
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s;
  opacity: 0;
}

.gallery-image.loaded {
  opacity: 1;
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
  font-size: 16px;
  margin: 0 0 8px 0;
}

.image-info p {
  font-size: 12px;
  margin: 4px 0;
  opacity: 0.8;
}

/* 知识模式样式 */
.knowledge-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.knowledge-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s;
}

.knowledge-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-4px);
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
  font-size: 18px;
  margin: 0;
  line-height: 1.4;
}

.card-content p {
  line-height: 1.6;
  opacity: 0.9;
  margin: 0 0 20px 0;
}

.read-more-btn {
  color: white;
  text-decoration: underline;
  transition: opacity 0.3s;
}

.read-more-btn:hover {
  opacity: 0.8;
}

/* 图片预览弹窗 */
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

/* 响应式设计 */
@media (max-width: 768px) {
  .relaxation-header {
    padding: 15px 20px;
    flex-direction: column;
    gap: 16px;
  }

  .header-left {
    gap: 12px;
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

  .image-gallery {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
  }

  .knowledge-cards {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .knowledge-card {
    padding: 20px;
  }
}
</style>
