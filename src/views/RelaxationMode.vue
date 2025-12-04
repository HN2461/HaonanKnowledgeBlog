<template>
  <div class="relaxation-container" :class="`view-${viewMode}`">
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
        <h1 class="page-title">休闲时光</h1>
      </div>

      <div class="header-right">
        <button
          class="mode-btn"
          :class="{ active: currentMode === 'scenery' }"
          @click="switchMode('scenery')"
        >
          美景
        </button>
        <button
          class="mode-btn"
          :class="{ active: currentMode === 'knowledge' }"
          @click="switchMode('knowledge')"
        >
          知识
        </button>
        <button
          class="mode-btn"
          :class="{ active: currentMode === 'animals' }"
          @click="switchMode('animals')"
        >
          萌宠
        </button>
        <button
          class="mode-btn"
          :class="{ active: currentMode === 'space' }"
          @click="switchMode('space')"
        >
          太空
        </button>
        <button
          class="mode-btn"
          :class="{ active: currentMode === 'quotes' }"
          @click="switchMode('quotes')"
        >
          名言
        </button>
        <!-- 视图切换 -->
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
          <p style="font-size: 14px; opacity: 0.8">
            Picsum API无法访问，请检查网络连接
          </p>
          <button @click="refreshContent" class="retry-btn">重试</button>
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
          <h2>� 有趣知识</h2>
          <p>学习关于动物的有趣事实</p>
        </div>

        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          <p>正在获取有趣内容...</p>
        </div>

        <div v-else-if="knowledgeArticles.length === 0" class="no-data">
          <p>❌ API请求失败</p>
          <p style="font-size: 14px; opacity: 0.8">
            Cat Facts API无法访问，请检查网络连接
          </p>
          <button @click="refreshContent" class="retry-btn">重试</button>
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
              <button class="read-more-btn" @click="openArticleLink(article)">
                阅读完整内容 →
              </button>
              <span v-if="article.score" class="article-score"
                >👍 {{ article.score }}</span
              >
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
          <p style="font-size: 14px; opacity: 0.8">
            动物图片API无法访问，请检查网络连接
          </p>
          <button @click="refreshContent" class="retry-btn">重试</button>
        </div>

        <div v-else class="animal-gallery">
          <div
            v-for="(animal, index) in animalImages"
            :key="index"
            class="animal-card"
            @click="openAnimalPreview(animal)"
          >
            <img
              :src="animal.url"
              :alt="animal.breeds?.[0]?.name || '可爱动物'"
              class="animal-image"
            />
            <div class="animal-info">
              <h3>
                {{
                  animal.breeds?.[0]?.name ||
                  "可爱" + (currentAnimalType === "cats" ? "猫咪" : "狗狗")
                }}
              </h3>
              <p v-if="animal.breeds?.[0]?.temperament">
                {{ animal.breeds[0].temperament }}
              </p>
            </div>
          </div>
        </div>

        <div class="animal-switch">
          <button
            @click="switchAnimalType('cats')"
            :class="{ active: currentAnimalType === 'cats' }"
          >
            🐱 猫咪
          </button>
          <button
            @click="switchAnimalType('dogs')"
            :class="{ active: currentAnimalType === 'dogs' }"
          >
            🐕 狗狗
          </button>
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
          <p style="font-size: 14px; opacity: 0.8">
            Picsum API无法访问，请检查网络连接
          </p>
          <button @click="refreshContent" class="retry-btn">重试</button>
        </div>

        <div v-else class="space-content">
          <div v-if="todayImage" class="today-image-card">
            <img
              :src="todayImage.url"
              :alt="todayImage.title"
              class="space-image"
              @click="
                openImagePreview({
                  urls: {
                    regular: todayImage.hdurl || todayImage.url,
                    small: todayImage.url,
                  },
                  alt_description: todayImage.title,
                })
              "
            />
            <div class="space-info">
              <h3>{{ todayImage.title }}</h3>
              <p class="space-date">{{ todayImage.date }}</p>
              <p class="space-description">{{ todayImage.explanation }}</p>
            </div>
          </div>

          <div class="mars-weather" v-if="marsWeather">
            <h3>� 最新SpaceX发射</h3>
            <div class="weather-info">
              <p><strong>任务:</strong> {{ marsWeather.mission }}</p>
              <p>
                <strong>状态:</strong>
                {{ marsWeather.success ? "✅ 成功" : "❌ 失败" }}
              </p>
              <p>
                <strong>详情:</strong> {{ marsWeather.details || "无详细信息" }}
              </p>
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
          <p style="font-size: 14px; opacity: 0.8">
            Advice Slip API无法访问，请检查网络连接
          </p>
          <button @click="refreshContent" class="retry-btn">重试</button>
        </div>

        <div v-else class="quotes-container">
          <div v-for="(quote, index) in quotes" :key="index" class="quote-card">
            <div class="quote-text">
              "{{ quote.q || quote.text || quote.content }}"
            </div>
            <div class="quote-author">
              — {{ quote.a || quote.author || "佚名" }}
            </div>
          </div>
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

    <!-- 悬浮功能按钮 -->
    <div class="floating-buttons">
      <button
        v-if="showBackToTop"
        @click="backToTop"
        class="float-btn back-to-top"
        title="回到顶部"
      >
        ⬆️
      </button>

      <button
        @click="toggleFloatingMenu"
        class="float-btn main-btn"
        :class="{ active: showFloatingMenu }"
      >
        {{ showFloatingMenu ? "✖️" : "🎯" }}
      </button>

      <div v-if="showFloatingMenu" class="float-menu">
        <button
          @click="refreshWithRandom"
          class="float-btn menu-btn"
          title="刷新内容"
        >
          🔄 <span>刷新</span>
        </button>
        <button @click="backToTop" class="float-btn menu-btn" title="回到顶部">
          ⬆️ <span>顶部</span>
        </button>
        <button @click="randomMode" class="float-btn menu-btn" title="随机模式">
          🎲 <span>随机</span>
        </button>
        <button
          @click="toggleFullscreen"
          class="float-btn menu-btn"
          title="全屏"
        >
          {{ isFullscreen ? "🔻" : "🔳" }}
          <span>{{ isFullscreen ? "退出" : "全屏" }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// 响应式数据
const currentMode = ref("scenery"); // 'scenery' | 'knowledge' | 'animals' | 'space' | 'quotes'
const loading = ref(false);
const sceneryImages = ref([]);
const knowledgeArticles = ref([]);
const animalImages = ref([]);
const currentAnimalType = ref("cats"); // 'cats' | 'dogs'
const todayImage = ref(null);
const marsWeather = ref(null);
const quotes = ref([]);
const showImagePreview = ref(false);
const selectedImage = ref(null);

// 简化状态
const viewMode = ref("grid"); // grid, list, masonry

// 悬浮按钮状态
const showFloatingMenu = ref(false);
const showBackToTop = ref(false);
const isFullscreen = ref(false);

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
    case "scenery":
      fetchSceneryImages();
      break;
    case "knowledge":
      fetchKnowledgeArticles();
      break;
    case "animals":
      fetchAnimalImages();
      break;
    case "space":
      fetchSpaceData();
      break;
    case "quotes":
      fetchQuotes();
      break;
  }
};

// 获取风景图片 - 使用真实的Picsum API（每次都随机）
const fetchSceneryImages = async () => {
  loading.value = true;
  try {
    // 每次都使用新的随机页码
    const page = Math.floor(Math.random() * 50) + 1;
    const response = await fetch(
      `https://picsum.photos/v2/list?page=${page}&limit=12`
    );
    if (!response.ok) throw new Error("API请求失败");

    const data = await response.json();

    // 打乱数组顺序
    const shuffledData = [...data].sort(() => Math.random() - 0.5);

    // 转换为我们需要的格式
    sceneryImages.value = shuffledData.map((img) => ({
      id: img.id,
      urls: {
        small: `https://picsum.photos/id/${img.id}/400/300`,
        regular: `https://picsum.photos/id/${img.id}/800/600`,
      },
      alt_description: `Photo by ${img.author}`,
      user: {
        name: img.author,
      },
      width: img.width,
      height: img.height,
      download_url: img.download_url,
    }));
  } catch (error) {
    console.error("获取风景图片失败:", error);
    sceneryImages.value = [];
  } finally {
    loading.value = false;
  }
};

// 获取知识文章 - 使用Cat Facts API
const fetchKnowledgeArticles = async () => {
  loading.value = true;
  try {
    // 使用Cat Facts API获取有趣的猫知识
    const response = await fetch("https://cat-fact.herokuapp.com/facts");
    if (!response.ok)
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);

    const facts = await response.json();

    // 随机选择8个事实
    const shuffled = facts.sort(() => Math.random() - 0.5).slice(0, 8);

    knowledgeArticles.value = shuffled.map((fact) => ({
      title: `猫知识 #${
        fact._id?.slice(-4) || Math.floor(Math.random() * 1000)
      }`,
      category: "Animal Facts",
      extract: fact.text,
      url: `https://cat-fact.herokuapp.com/facts/${fact._id}`,
      author: fact.user?.name?.first || "Cat Facts",
      score: Math.floor(Math.random() * 100),
      createdAt: fact.createdAt,
    }));
  } catch (error) {
    console.error("获取知识文章失败:", error);
    knowledgeArticles.value = [];
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
  if (article.url) {
    window.open(article.url, "_blank");
  }
};

// 获取萌宠图片 - 使用真实的API（随机获取）
const fetchAnimalImages = async () => {
  loading.value = true;
  try {
    let apiUrl;

    if (currentAnimalType.value === "cats") {
      // 使用The Cat API，添加随机参数
      const randomOrder = Math.random() > 0.5 ? "RANDOM" : "ASC";
      apiUrl = `https://api.thecatapi.com/v1/images/search?limit=12&order=${randomOrder}`;
    } else {
      // 使用Dog CEO API (完全免费开放)
      const breedsResponse = await fetch("https://dog.ceo/api/breeds/list/all");
      const breedsData = await breedsResponse.json();
      const breeds = Object.keys(breedsData.message);

      // 获取多个品种的狗狗图片
      const dogImages = [];
      // 打乱品种数组以获取不同的狗狗
      const shuffledBreeds = [...breeds].sort(() => Math.random() - 0.5);
      for (let i = 0; i < Math.min(12, shuffledBreeds.length); i++) {
        const randomBreed = shuffledBreeds[i];
        const dogResponse = await fetch(
          `https://dog.ceo/api/breed/${randomBreed}/images/random`
        );
        const dogData = await dogResponse.json();
        if (dogData.status === "success") {
          dogImages.push({
            url: dogData.message,
            breeds: [{ name: randomBreed, temperament: "Friendly" }],
            id: Date.now() + i,
          });
        }
      }
      animalImages.value = dogImages;
      return;
    }

    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("API请求失败");

    const data = await response.json();
    animalImages.value = data;
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

// 打开动物预览
const openAnimalPreview = (animal) => {
  openImagePreview({
    urls: { regular: animal.url, small: animal.url },
    alt_description: animal.breeds?.[0]?.name || "可爱动物",
  });
};

// 获取太空数据 - 使用RandomUser API获取用户信息作为宇航员数据
const fetchSpaceData = async () => {
  loading.value = true;
  try {
    // 获取随机用户作为宇航员信息
    const userResponse = await fetch(
      "https://randomuser.me/api/?results=1&nat=us"
    );
    if (!userResponse.ok)
      throw new Error(
        `HTTP ${userResponse.status}: ${userResponse.statusText}`
      );

    const userData = await userResponse.json();
    const astronaut = userData.results[0];

    // 获取随机图片
    const imageId = Math.floor(Math.random() * 1000) + 1;

    todayImage.value = {
      title: `宇航员 ${astronaut.name.first} ${astronaut.name.last}`,
      date: new Date().toISOString().split("T")[0],
      url: `https://picsum.photos/800/600?random=${imageId}`,
      hdurl: `https://picsum.photos/1200/800?random=${imageId}`,
      explanation: `来自${astronaut.location.city}, ${astronaut.location.state}的宇航员。年龄：${astronaut.dob.age}岁。`,
    };

    // 获取第二个用户作为任务指挥官
    const commanderResponse = await fetch(
      "https://randomuser.me/api/?results=1&nat=gb"
    );
    if (commanderResponse.ok) {
      const commanderData = await commanderResponse.json();
      const commander = commanderData.results[0];

      marsWeather.value = {
        mission: `${commander.name.last}任务`,
        rocket: `${commander.location.city}号`,
        success: Math.random() > 0.3, // 70%成功率
        details: `任务指挥官：${commander.name.first} ${commander.name.last}，来自${commander.location.country}`,
        date: commander.registered.date,
      };
    } else {
      marsWeather.value = null;
    }
  } catch (error) {
    console.error("获取太空数据失败:", error);
    todayImage.value = null;
    marsWeather.value = null;
  } finally {
    loading.value = false;
  }
};

// 获取名言 - 使用多个API避免重复
const fetchQuotes = async () => {
  loading.value = true;
  try {
    const quotes_data = [];

    // 方法1：使用搜索API获取不同主题的建议
    const searchTerms = [
      "love",
      "success",
      "life",
      "happiness",
      "wisdom",
      "friendship",
      "courage",
      "dreams",
    ];

    for (let i = 0; i < Math.min(4, searchTerms.length); i++) {
      try {
        const term =
          searchTerms[Math.floor(Math.random() * searchTerms.length)];
        const response = await fetch(
          `https://api.adviceslip.com/advice/search/${term}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.slips && data.slips.length > 0) {
            const randomSlip =
              data.slips[Math.floor(Math.random() * data.slips.length)];
            quotes_data.push({
              q: randomSlip.advice,
              a: "Advice Slip",
              id: `search-${term}-${Math.random()}`,
              favorite: false,
            });
          }
        }
        // 添加2.5秒延迟避免API缓存
        await new Promise((resolve) => setTimeout(resolve, 2500));
      } catch (e) {
        console.log("搜索建议失败");
      }
    }

    // 方法2：使用JSONPlaceholder的posts作为补充
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts?_limit=6"
      );
      if (response.ok) {
        const posts = await response.json();
        const randomPosts = posts.sort(() => Math.random() - 0.5).slice(0, 4);

        randomPosts.forEach((post) => {
          quotes_data.push({
            q: post.title,
            a: `思考者 ${post.userId}`,
            id: `post-${post.id}`,
            favorite: false,
          });
        });
      }
    } catch (e) {
      console.log("获取补充内容失败");
    }

    // 随机打乱顺序
    quotes.value = quotes_data.sort(() => Math.random() - 0.5);
  } catch (error) {
    console.error("获取建议失败:", error);
    quotes.value = [];
  } finally {
    loading.value = false;
  }
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
  const date = new Date(dateStr);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

// 图片加载处理
const handleImageLoad = (event) => {
  event.target.classList.add("loaded");
};

// 悬浮按钮功能
const toggleFloatingMenu = () => {
  showFloatingMenu.value = !showFloatingMenu.value;
};

// 刷新并获取不同内容（现在每次刷新都是随机的）
const refreshWithRandom = () => {
  refreshContent();
  showFloatingMenu.value = false;
};

// 回到顶部
const backToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  showFloatingMenu.value = false;
};

// 随机切换模式
const randomMode = () => {
  const modes = ["scenery", "knowledge", "animals", "space", "quotes"];
  const currentIndex = modes.indexOf(currentMode.value);
  const newModes = modes.filter((_, index) => index !== currentIndex);
  const randomModeValue = newModes[Math.floor(Math.random() * newModes.length)];
  switchMode(randomModeValue);
  showFloatingMenu.value = false;
};

// 切换全屏
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    isFullscreen.value = true;
  } else {
    document.exitFullscreen();
    isFullscreen.value = false;
  }
  showFloatingMenu.value = false;
};

// 监听滚动显示回到顶部按钮
const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300;
};

// 组件挂载时加载默认内容
onMounted(() => {
  refreshContent();
  window.addEventListener("scroll", handleScroll);
});

// 组件卸载时清理
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

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.read-more-btn {
  color: white;
  text-decoration: underline;
  transition: opacity 0.3s;
}

.read-more-btn:hover {
  opacity: 0.8;
}

.article-score {
  font-size: 12px;
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 12px;
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

/* 萌宠模式样式 */
.animal-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.animal-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
}

.animal-card:hover {
  transform: scale(1.05);
  background: rgba(255, 255, 255, 0.15);
}

.animal-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.animal-info {
  padding: 16px;
}

.animal-info h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: white;
}

.animal-info p {
  margin: 0;
  font-size: 12px;
  opacity: 0.8;
  color: white;
}

.animal-switch {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
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

/* 太空模式样式 */
.space-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.today-image-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.space-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s;
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
  color: white;
}

.space-date {
  margin: 0 0 16px 0;
  font-size: 14px;
  opacity: 0.8;
  color: white;
}

.space-description {
  margin: 0;
  line-height: 1.6;
  color: white;
  opacity: 0.9;
}

.mars-weather {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(10px);
}

.mars-weather h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: white;
}

.weather-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.weather-info p {
  margin: 0;
  color: white;
  opacity: 0.9;
}

/* 名言模式样式 */
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
  color: white;
  margin-bottom: 16px;
  font-style: italic;
  text-align: center;
}

.quote-author {
  text-align: center;
  color: white;
  opacity: 0.8;
  font-size: 14px;
  margin-bottom: 20px;
}

/* 视图模式样式 */
.view-list .image-gallery,
.view-list .animal-gallery {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.view-list .image-card,
.view-list .animal-card {
  display: flex;
  align-items: center;
  max-width: 100%;
  height: 150px;
}

.view-list .gallery-image,
.view-list .animal-image {
  width: 200px;
  height: 150px;
  margin-right: 20px;
}

.view-masonry .image-gallery,
.view-masonry .animal-gallery {
  column-count: 4;
  column-gap: 20px;
}

.view-masonry .image-card,
.view-masonry .animal-card {
  break-inside: avoid;
  margin-bottom: 20px;
}

/* 动画效果 */
@keyframes slideIn {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.image-card,
.animal-card,
.knowledge-card,
.quote-card {
  animation: slideIn 0.5s ease-out;
}

/* 无数据提示 */
.no-data {
  text-align: center;
  padding: 60px 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  margin: 20px auto;
  max-width: 500px;
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
  transition: background 0.3s;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.retry-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

/* 悬浮功能按钮 */
.floating-buttons {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 15px;
}

.float-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.float-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.float-btn.main-btn {
  width: 65px;
  height: 65px;
  font-size: 28px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.float-btn.main-btn.active {
  transform: rotate(90deg);
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.float-btn.back-to-top {
  background: linear-gradient(135deg, #13547a 0%, #80d0c7 100%);
  position: absolute;
  bottom: 140px;
  animation: bounceIn 0.5s;
}

.float-menu {
  position: absolute;
  bottom: 80px;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: slideUp 0.3s;
}

.float-btn.menu-btn {
  width: auto;
  min-width: 60px;
  height: 50px;
  border-radius: 25px;
  padding: 0 20px;
  font-size: 18px;
  background: rgba(255, 255, 255, 0.95);
  color: #667eea;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 8px;
}

.float-btn.menu-btn span {
  font-size: 14px;
  font-weight: 500;
}

.float-btn.menu-btn:hover {
  background: white;
  transform: translateX(-5px);
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
