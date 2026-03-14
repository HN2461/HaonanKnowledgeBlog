<template>
  <AppLayout>
    <div class="search-page">
      <div class="search-header">
        <h1 class="page-title">搜索笔记</h1>

        <div class="search-box">
          <input
            ref="searchInput"
            type="text"
            v-model="searchQuery"
            placeholder="输入关键词搜索..."
            @input="handleSearch"
            @keyup.enter="() => handleSearch(true)"
          />
          <button v-if="searchQuery" @click="clearSearch" class="clear-btn">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <div
        class="search-history"
        v-if="searchHistory.length > 0 && !searchQuery"
      >
        <div class="history-header">
          <h3>搜索历史</h3>
          <button @click="clearHistory" class="clear-history-btn">清除</button>
        </div>
        <div class="history-tags">
          <span
            v-for="item in searchHistory"
            :key="item"
            class="history-tag"
            @click="
              searchQuery = item;
              handleSearch();
            "
          >
            {{ item }}
          </span>
        </div>
      </div>

      <div class="search-results" v-if="searchQuery">
        <div class="results-header">
          <h3>搜索结果</h3>
          <span class="results-count"
            >找到 {{ searchResults.length }} 篇笔记</span
          >
        </div>

        <div class="results-list" v-if="searchResults.length > 0">
          <div
            v-for="result in searchResults"
            :key="result.path"
            class="result-item"
            @click="goToNote(result)"
          >
            <h4 class="result-title" v-html="highlightText(result.title)"></h4>
            <p
              class="result-description"
              v-html="highlightText(result.matchedContent || result.description)"
            ></p>
            <div v-if="result.relevanceScore" class="result-relevance">
              <span class="relevance-score">相关度: {{ Math.round(result.relevanceScore * 100) }}%</span>
            </div>
            <div class="result-meta">
              <span class="meta-category">{{ result.category }}</span>
              <span class="meta-date">{{ formatDate(result.date) }}</span>
              <div class="meta-tags">
                <span
                  v-for="tag in result.tags.slice(0, 3)"
                  :key="tag"
                  class="tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-results">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <p>没有找到相关笔记</p>
          <p class="empty-hint">试试其他关键词吧</p>
        </div>
      </div>

      <div class="search-tips" v-else>
        <h3>搜索提示</h3>
        <div class="tips-grid">
          <div class="tip-card">
            <h4>📝 内容搜索</h4>
            <p>搜索笔记的完整内容，找到任何相关信息</p>
            <div class="tip-example">例如：搜索 "JavaScript 闭包"</div>
          </div>
          
          <div class="tip-card">
            <h4>🎯 精确搜索</h4>
            <p>使用引号进行精确匹配</p>
            <div class="tip-example">例如："CSS Grid布局"</div>
          </div>
          
          <div class="tip-card">
            <h4>🏷️ 标签搜索</h4>
            <p>搜索特定标签的所有笔记</p>
            <div class="tip-example">例如：前端、Vue、React</div>
          </div>
          
          <div class="tip-card">
            <h4>📂 分类搜索</h4>
            <p>按笔记分类查找内容</p>
            <div class="tip-example">例如：HTML、CSS、JavaScript</div>
          </div>
        </div>
        
        <div class="search-features">
          <h4>✨ 搜索特性</h4>
          <ul>
            <li><strong>智能排序：</strong>根据相关性自动排序结果</li>
            <li><strong>内容预览：</strong>显示匹配内容的上下文</li>
            <li><strong>多词搜索：</strong>支持多个关键词组合搜索</li>
            <li><strong>模糊匹配：</strong>即使拼写略有不同也能找到结果</li>
            <li><strong>实时搜索：</strong>输入即搜索，无需按回车</li>
          </ul>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import dayjs from "dayjs";
import AppLayout from "../components/AppLayout.vue";
import {
  initSearch,
  searchNotes,
  saveSearchHistory,
  getSearchHistory,
  clearSearchHistory,
} from "../utils/search";

const router = useRouter();
const route = useRoute();
const searchInput = ref(null);
const searchQuery = ref("");
const searchResults = ref([]);
const searchHistory = ref([]);

// 防抖搜索
let searchTimeout = null;

const handleSearch = (immediate = false) => {
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    return;
  }

  // 清除之前的定时器
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  const performSearch = () => {
    const results = searchNotes(searchQuery.value);
    searchResults.value = results;

    // 保存搜索历史
    if (searchQuery.value.trim()) {
      saveSearchHistory(searchQuery.value);
      searchHistory.value = getSearchHistory();
    }
  };

  if (immediate) {
    performSearch();
  } else {
    // 300ms 防抖延迟
    searchTimeout = setTimeout(performSearch, 300);
  }
};

const clearSearch = () => {
  searchQuery.value = "";
  searchResults.value = [];
};

const clearHistory = () => {
  clearSearchHistory();
  searchHistory.value = [];
};

const highlightText = (text) => {
  if (!searchQuery.value || !text) return text;

  const escapedQuery = searchQuery.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedQuery})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
};

const formatDate = (date) => {
  return dayjs(date).format("YYYY-MM-DD");
};

const goToNote = (note) => {
  router.push(`/note/${note.path.replace(".md", "")}`);
};

onMounted(async () => {
  // 聚焦搜索框
  searchInput.value?.focus();

  // 加载搜索历史
  searchHistory.value = getSearchHistory();

  // 从 URL 参数获取搜索词
  const queryParam = route.query.q;
  if (queryParam) {
    searchQuery.value = queryParam;
  }

  // 初始化搜索引擎
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}notes-index.json`);
    const data = await response.json();
    initSearch(data.allNotes || []);

    // 如果有搜索词，执行搜索
    if (searchQuery.value) {
      handleSearch();
    }
  } catch (error) {
    console.error("初始化搜索失败:", error);
  }
});

watch(
  () => route.query.q,
  (newQuery) => {
    if (newQuery) {
      searchQuery.value = newQuery;
      handleSearch();
    }
  }
);
</script>

<style scoped>
.search-page {
  max-width: 900px;
  margin: 0 auto;
}

.search-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 24px 0;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  background-color: var(--bg-primary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 12px 20px;
  transition: border-color 0.3s;
}

.search-box:focus-within {
  border-color: var(--primary-color);
}

.search-box input {
  flex: 1;
  border: none;
  background: none;
  font-size: 16px;
  color: var(--text-primary);
}

.search-box input:focus,
.search-box input:focus-visible {
  outline: none;
  box-shadow: none;
}

.clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  color: var(--text-secondary);
  transition: all 0.3s;
}

.clear-btn:hover {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.search-history {
  margin-bottom: 32px;
  padding: 20px;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.history-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.clear-history-btn {
  font-size: 14px;
  color: var(--text-secondary);
  padding: 4px 12px;
  border-radius: 6px;
  transition: all 0.3s;
}

.clear-history-btn:hover {
  background-color: var(--bg-secondary);
  color: var(--primary-color);
}

.history-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.history-tag {
  padding: 6px 12px;
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.history-tag:hover {
  background-color: var(--primary-color);
  color: white;
}

.search-results {
  margin-bottom: 32px;
}

.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.results-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.results-count {
  font-size: 14px;
  color: var(--text-secondary);
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-item {
  padding: 20px;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.result-item:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow);
  transform: translateY(-2px);
}

.result-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.result-title :deep(mark) {
  background-color: #fff3cd;
  color: var(--text-primary);
  padding: 2px 4px;
  border-radius: 2px;
}

.result-description {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 12px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
}

.result-description :deep(mark) {
  background-color: #fff3cd;
  color: var(--text-primary);
  padding: 2px 4px;
  border-radius: 2px;
}

.result-relevance {
  margin: 8px 0;
}

.relevance-score {
  font-size: 12px;
  color: var(--primary-color);
  background-color: rgba(var(--primary-color-rgb), 0.1);
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.result-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.meta-category {
  padding: 4px 10px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 12px;
  font-size: 12px;
}

.meta-date {
  font-size: 12px;
  color: var(--text-tertiary);
}

.meta-tags {
  display: flex;
  gap: 6px;
}

.tag {
  padding: 4px 8px;
  background-color: var(--bg-tertiary);
  color: var(--text-secondary);
  border-radius: 4px;
  font-size: 12px;
}

.empty-results {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
}

.empty-results svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-results p {
  margin: 8px 0;
}

.empty-hint {
  font-size: 14px;
  color: var(--text-tertiary);
}

.search-tips {
  padding: 24px;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}

.search-tips h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 16px 0;
}

.search-tips ul {
  margin: 0;
  padding-left: 24px;
}

.search-tips li {
  color: var(--text-secondary);
  line-height: 2;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.tip-card {
  padding: 20px;
  background-color: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.tip-card h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.tip-card p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 8px 0;
  line-height: 1.5;
}

.tip-example {
  font-size: 13px;
  color: var(--primary-color);
  background-color: rgba(var(--primary-color-rgb), 0.1);
  padding: 6px 10px;
  border-radius: 6px;
  font-family: 'Monaco', 'Menlo', monospace;
}

.search-features {
  background-color: var(--bg-secondary);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.search-features h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 12px 0;
}

.search-features ul {
  margin: 0;
  padding-left: 20px;
}

.search-features li {
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 4px;
}

.search-features strong {
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 24px;
  }

  .result-title {
    font-size: 16px;
  }
}
</style>
