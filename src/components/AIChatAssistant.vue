<template>
  <div class="ai-chat-wrapper">
    <!-- 聊天窗口 -->
    <Transition name="chat-slide">
      <div v-if="isOpen" class="chat-container">
        <!-- 头部 -->
        <div class="chat-header">
          <div class="header-left">
            <span class="chat-icon">🤖</span>
            <div class="header-info">
              <h4>AI 知识助手</h4>
              <span class="status" :class="{ online: isOnline }">
                {{ isOnline ? "在线" : "离线" }}
              </span>
            </div>
          </div>
          <div class="header-actions">
            <button
              @click="clearChat"
              class="action-btn action-btn-clear"
              title="清空对话"
              aria-label="清空对话"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="3 6 5 6 21 6"></polyline>
                <path
                  d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                ></path>
              </svg>
            </button>
            <button
              @click="toggleMinimize"
              class="action-btn action-btn-minimize"
              title="最小化"
              aria-label="最小化"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <button
              @click="closeChat"
              class="action-btn action-btn-close"
              title="关闭"
              aria-label="关闭"
            >
              <svg
                width="16"
                height="16"
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

        <!-- 对话区域 -->
        <div v-show="!isMinimized" class="chat-body" ref="chatBody">
          <!-- 欢迎消息 -->
          <div v-if="messages.length === 0" class="welcome-message">
            <h5>👋 您好！我是 AI 知识助手</h5>
            <p>我可以帮您：</p>
            <ul>
              <li>🔍 搜索相关技术文章</li>
              <li>📚 解答技术问题</li>
              <li>💡 推荐学习资源</li>
              <li>📝 总结文章要点</li>
            </ul>
            <div class="quick-questions">
              <p>快速提问：</p>
              <button
                v-for="q in quickQuestions"
                :key="q"
                @click="sendMessage(q)"
                class="quick-btn"
              >
                {{ q }}
              </button>
            </div>
          </div>

          <!-- 消息列表 -->
          <div
            v-for="(msg, index) in messages"
            :key="index"
            class="message"
            :class="msg.type"
          >
            <div class="message-avatar">
              {{ msg.type === "user" ? "👤" : "🤖" }}
            </div>
            <div class="message-content">
              <div class="message-text" v-html="msg.text"></div>

              <!-- 相关文章 -->
              <div
                v-if="msg.articles && msg.articles.length > 0"
                class="related-articles"
              >
                <p class="related-title">📎 相关文章：</p>
                <div
                  v-for="article in msg.articles"
                  :key="article.path"
                  @click="openArticle(article)"
                  class="article-card"
                >
                  <span class="article-title">{{ article.title }}</span>
                  <span class="article-category">{{ article.category }}</span>
                </div>
              </div>

              <span class="message-time">{{ formatTime(msg.timestamp) }}</span>
            </div>
          </div>

          <!-- 打字动画 -->
          <div v-if="isTyping" class="typing-indicator">
            <div class="typing-avatar">🤖</div>
            <div class="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div v-show="!isMinimized" class="chat-footer">
          <div class="input-container">
            <input
              v-model="inputText"
              @keydown.enter="handleSend"
              placeholder="输入您的问题..."
              class="chat-input"
              :disabled="isTyping"
            />
            <button
              @click="handleSend"
              class="send-btn"
              :disabled="!inputText.trim() || isTyping"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
          <div class="footer-tips">按 Enter 发送 · 支持 Markdown 语法</div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// 状态
const isOpen = ref(false);
const isMinimized = ref(false);
const isOnline = ref(true);
const isTyping = ref(false);

// 消息相关
const messages = ref([]);
const inputText = ref("");
const chatBody = ref(null);

// 笔记数据
let notesData = null;
const CHAT_STORAGE_KEY = "chat-messages";
const MAX_HISTORY_MESSAGES = 12;
const MAX_ARTICLES_PER_MESSAGE = 3;
const MAX_MESSAGE_TEXT_LENGTH = 1500;

// 快速问题
const quickQuestions = [
  "Vue3 有哪些新特性？",
  "如何学习 JavaScript？",
  "推荐一些前端资源",
  "最新的文章是什么？",
];

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// 加载笔记数据
const loadNotesData = async () => {
  if (notesData) return;

  try {
    const response = await fetch(`${import.meta.env.BASE_URL}notes-index.json`);
    notesData = await response.json();
  } catch (error) {
    console.error("Failed to load notes:", error);
    isOnline.value = false;
  }
};

const toArticlePreview = (note = {}, score = 0) => ({
  title: note.title || "未命名文章",
  path: note.path || "",
  category: note.category || "未分类",
  score,
});

const normalizeMessage = (message) => {
  const source = message && typeof message === "object" ? message : {};
  const normalized = {
    type: source.type === "user" ? "user" : "ai",
    text:
      typeof source.text === "string"
        ? source.text.slice(0, MAX_MESSAGE_TEXT_LENGTH)
        : "",
    timestamp:
      typeof source.timestamp === "number" ? source.timestamp : Date.now(),
  };

  if (Array.isArray(source.articles) && source.articles.length > 0) {
    normalized.articles = source.articles
      .filter((article) => article && typeof article.path === "string")
      .slice(0, MAX_ARTICLES_PER_MESSAGE)
      .map((article) => ({
        title: article.title || "未命名文章",
        path: article.path,
        category: article.category || "未分类",
      }));
  }

  return normalized;
};

const trimMessages = () => {
  if (messages.value.length > MAX_HISTORY_MESSAGES) {
    messages.value = messages.value.slice(-MAX_HISTORY_MESSAGES);
  }
};

// 搜索相关文章
const searchArticles = (query) => {
  if (!notesData) return [];

  const keywords = query.toLowerCase().split(" ");
  const results = [];

  notesData.allNotes.forEach((note) => {
    let score = 0;
    const titleLower = note.title.toLowerCase();
    const descLower = (note.description || "").toLowerCase();
    const tagsLower = (note.tags || []).join(" ").toLowerCase();

    keywords.forEach((keyword) => {
      if (titleLower.includes(keyword)) score += 3;
      if (descLower.includes(keyword)) score += 2;
      if (tagsLower.includes(keyword)) score += 1;
    });

    if (score > 0 && note.path) {
      results.push(toArticlePreview(note, score));
    }
  });

  return results.sort((a, b) => b.score - a.score).slice(0, 3);
};

// 生成AI回复
const generateAIResponse = async (userMessage) => {
  await loadNotesData();

  const query = userMessage.toLowerCase();
  const articles = searchArticles(userMessage);

  let response = "";

  // 智能意图识别
  const intent = detectIntent(query);

  // 根据意图生成回复
  if (intent === "greeting") {
    response = getGreetingResponse();
  } else if (intent === "thanks") {
    response = "不客气！很高兴能帮到你。还有什么其他问题吗？😊";
  } else if (query.includes("vue") || query.includes("vue3")) {
    response = `关于 Vue/Vue3，我找到了一些相关内容：

Vue3 的主要新特性包括：
• **Composition API** - 更灵活的组件逻辑组织方式
• **性能提升** - 更快的渲染和更小的打包体积
• **TypeScript 支持** - 原生 TypeScript 支持
• **Teleport** - 将组件渲染到 DOM 树的其他位置
• **Suspense** - 异步组件加载状态管理

${
  articles.length > 0
    ? "我为您找到了以下相关文章："
    : "建议您查看相关的 Vue 文章了解更多细节。"
}`;
  } else if (query.includes("javascript") || query.includes("js")) {
    response = `JavaScript 是前端开发的核心语言。学习建议：

📚 **学习路径：**
1. **基础语法** - 变量、数据类型、控制流
2. **函数与对象** - 闭包、原型链、this
3. **异步编程** - Promise、async/await
4. **ES6+ 特性** - 解构、模块化、类
5. **实战项目** - 结合框架开发实际项目

${
  articles.length > 0
    ? "以下文章可能对您有帮助："
    : "博客中有完整的 JavaScript 教程系列，建议系统学习。"
}`;
  } else if (query.includes("学习") || query.includes("资源")) {
    response = `我为您推荐一些优质的前端学习资源：

📖 **文档类：**
• MDN Web Docs - 最权威的 Web 技术文档
• Vue.js 官方文档 - Vue 框架学习
• React 官方文档 - React 框架学习

🎥 **视频教程：**
• FreeCodeCamp - 免费编程课程
• Traversy Media - 实战项目教程

🛠️ **实践平台：**
• CodePen - 在线代码编辑器
• LeetCode - 算法练习平台

${articles.length > 0 ? "本博客也有相关学习资源：" : "记得要多动手实践哦！"}`;
  } else if (query.includes("最新") || query.includes("最近")) {
    const recentNotes = notesData?.allNotes?.slice(0, 3) || [];
    if (recentNotes.length > 0) {
      response = "以下是最近更新的文章：";
      articles.push(
        ...recentNotes
          .filter((note) => note.path)
          .map((note) => toArticlePreview(note, 1))
      );
    } else {
      response = "暂时没有找到最新的文章。";
    }
  } else {
    // 默认回复
    response = `我理解您的问题是："${userMessage}"

${
  articles.length > 0
    ? "根据您的问题，我找到了以下相关内容："
    : "抱歉，我没有找到直接相关的文章。不过您可以试试：\n• 使用更具体的关键词\n• 查看文章分类\n• 使用搜索功能"
}

如需更多帮助，请告诉我您具体想了解什么技术内容。`;
  }

  return { response, articles };
};

// 意图检测
const detectIntent = (query) => {
  const greetings = ["你好", "hello", "hi", "您好", "hey"];
  const thanks = ["谢谢", "thanks", "thank you", "感谢"];

  if (greetings.some((g) => query.includes(g))) return "greeting";
  if (thanks.some((t) => query.includes(t))) return "thanks";
  return "question";
};

// 问候回复
const getGreetingResponse = () => {
  const hour = new Date().getHours();
  let timeGreeting = "";

  if (hour < 12) timeGreeting = "早上好";
  else if (hour < 18) timeGreeting = "下午好";
  else timeGreeting = "晚上好";

  return `${timeGreeting}！👋 我是 AI 知识助手。\n\n我可以帮你：\n• 搜索技术文章\n• 解答编程问题\n• 推荐学习资源\n\n有什么可以帮助你的吗？`;
};

// 发送消息
const sendMessage = async (text) => {
  if (!text.trim()) return;

  // 添加用户消息
  messages.value.push({
    type: "user",
    text: text,
    timestamp: Date.now(),
  });

  inputText.value = "";
  scrollToBottom();

  // 保存聊天记录
  saveMessages();

  // 显示打字动画
  isTyping.value = true;

  // 模拟延迟
  await new Promise((resolve) =>
    setTimeout(resolve, 1000 + Math.random() * 1000)
  );

  // 生成AI回复
  const { response, articles } = await generateAIResponse(text);

  isTyping.value = false;

  // 添加AI消息
  messages.value.push({
    type: "ai",
    text: response.replace(/\n/g, "<br>"),
    articles: articles,
    timestamp: Date.now(),
  });

  scrollToBottom();
  saveMessages();
};

// 保存消息到本地
const saveMessages = () => {
  trimMessages();
  const lightweightMessages = messages.value.map((message) =>
    normalizeMessage(message)
  );

  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(lightweightMessages));
  } catch (error) {
    console.error("Failed to save messages:", error);
  }
};

// 处理发送
const handleSend = () => {
  sendMessage(inputText.value);
};

// 打开文章
const openArticle = (article) => {
  router.push(`/note/${article.path.replace(".md", "")}`);
  closeChat();
};

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick();
  if (chatBody.value) {
    chatBody.value.scrollTop = chatBody.value.scrollHeight;
  }
};

// 控制函数
const openChat = () => {
  isOpen.value = true;
  isMinimized.value = false;
  scrollToBottom();
};

const closeChat = () => {
  isOpen.value = false;
  isMinimized.value = false;
};

const toggleMinimize = () => {
  isMinimized.value = !isMinimized.value;
};

const clearChat = () => {
  if (confirm("确定要清空对话记录吗？")) {
    messages.value = [];
    localStorage.removeItem(CHAT_STORAGE_KEY);
  }
};

// 键盘快捷键
const handleKeyboard = (e) => {
  // Alt + C 打开/关闭聊天
  if (e.altKey && e.key === "c") {
    e.preventDefault();
    isOpen.value ? closeChat() : openChat();
  }
};

const handleToggleFromHeader = () => {
  if (isOpen.value && !isMinimized.value) {
    closeChat();
    return;
  }
  openChat();
};

const handleOpenFromHeader = () => {
  openChat();
};

const handleCloseFromHeader = () => {
  closeChat();
};

onMounted(() => {
  document.addEventListener("keydown", handleKeyboard);
  loadNotesData();
  window.addEventListener("ai-assistant:toggle", handleToggleFromHeader);
  window.addEventListener("ai-assistant:open", handleOpenFromHeader);
  window.addEventListener("ai-assistant:close", handleCloseFromHeader);

  // 恢复聊天记录
  const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
  if (savedMessages) {
    try {
      const restoredMessages = JSON.parse(savedMessages);
      if (Array.isArray(restoredMessages)) {
        messages.value = restoredMessages
          .slice(-MAX_HISTORY_MESSAGES)
          .map((message) => normalizeMessage(message));
        saveMessages();
      }
    } catch (e) {
      console.error("Failed to restore messages:", e);
    }
  }
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyboard);
  window.removeEventListener("ai-assistant:toggle", handleToggleFromHeader);
  window.removeEventListener("ai-assistant:open", handleOpenFromHeader);
  window.removeEventListener("ai-assistant:close", handleCloseFromHeader);
});
</script>

<style scoped>
.chat-container {
  position: fixed;
  top: 76px;
  right: 16px;
  width: 392px;
  max-width: calc(100vw - 32px);
  height: 620px;
  max-height: calc(100vh - 92px);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(15, 91, 216, 0.16);
  border-radius: 18px;
  box-shadow: 0 20px 48px rgba(15, 23, 42, 0.2);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  z-index: 999;
  overflow: hidden;
}

.dark-theme .chat-container {
  background: rgba(18, 23, 36, 0.96);
  border-color: rgba(125, 211, 252, 0.2);
  box-shadow: 0 24px 56px rgba(0, 0, 0, 0.48);
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: linear-gradient(120deg, #0f5bd8 0%, #0b79c7 55%, #0ea89a 100%);
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-icon {
  font-size: 24px;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-info h4 {
  margin: 0;
  font-size: 15px;
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: 0.2px;
}

.status {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  margin-top: 2px;
  opacity: 0.92;
}

.status.online::before {
  content: "";
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4ade80;
  margin-right: 6px;
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.2);
}

.header-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.24);
  border: 1px solid rgba(255, 255, 255, 0.36);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, background-color 0.2s ease,
    border-color 0.2s ease;
}

.action-btn svg {
  width: 16px;
  height: 16px;
  display: block;
  fill: none;
  stroke: #f8fbff;
  stroke-width: 2.3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.42);
  border-color: rgba(255, 255, 255, 0.52);
  transform: translateY(-1px);
}

.action-btn-clear:hover {
  background: rgba(251, 191, 36, 0.3);
}

.action-btn-minimize:hover {
  background: rgba(148, 163, 184, 0.34);
}

.action-btn-close:hover {
  background: rgba(248, 113, 113, 0.34);
}

.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 18px 16px;
  background:
    radial-gradient(
      circle at 100% 0%,
      rgba(15, 91, 216, 0.08) 0,
      rgba(15, 91, 216, 0) 35%
    ),
    var(--bg-secondary);
}

.welcome-message {
  text-align: center;
  padding: 18px 16px;
  border-radius: 14px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.welcome-message h5 {
  font-size: 18px;
  margin: 0 0 10px;
  color: var(--text-primary);
}

.welcome-message ul {
  list-style: none;
  padding: 0;
  margin: 14px 0;
  text-align: left;
  display: inline-block;
}

.welcome-message li {
  margin: 8px 0;
}

.quick-questions {
  margin-top: 20px;
}

.quick-questions p {
  margin: 0 0 12px;
  font-weight: 600;
  color: var(--text-primary);
}

.quick-btn {
  display: inline-flex;
  align-items: center;
  margin: 4px;
  padding: 7px 12px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 999px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-btn:hover {
  border-color: #0f5bd8;
  color: #0f5bd8;
  transform: translateY(-1px);
}

.message {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
  animation: slideIn 0.28s ease;
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  background: var(--bg-tertiary);
  flex-shrink: 0;
}

.message.user .message-avatar {
  background: linear-gradient(120deg, #0f5bd8 0%, #0ea89a 100%);
}

.message-content {
  max-width: 76%;
  background: var(--bg-primary);
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid var(--border-color);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
}

.dark-theme .message-content {
  box-shadow: none;
}

.message.user .message-content {
  background: linear-gradient(120deg, #0f5bd8 0%, #0ea89a 100%);
  color: #fff;
  border: none;
}

.message-text {
  font-size: 14px;
  line-height: 1.65;
  word-wrap: break-word;
}

.message-time {
  display: block;
  font-size: 11px;
  color: var(--text-tertiary);
  margin-top: 6px;
}

.message.user .message-time {
  color: rgba(255, 255, 255, 0.88);
}

.related-articles {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed var(--border-color);
}

.related-title {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0 0 8px;
}

.article-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  margin: 6px 0;
  background: var(--bg-secondary);
  border-radius: 10px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.article-card:hover {
  border-color: rgba(15, 91, 216, 0.28);
  transform: translateX(2px);
}

.article-title {
  font-size: 13px;
  color: var(--primary-color);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.article-category {
  font-size: 11px;
  color: var(--text-tertiary);
  background: var(--bg-primary);
  padding: 3px 7px;
  border-radius: 6px;
  margin-left: 8px;
}

.typing-indicator {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
}

.typing-avatar {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: var(--bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.typing-dots {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px 14px;
  background: var(--bg-primary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.typing-dots span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #0f5bd8;
  opacity: 0.7;
  animation: typing 1.2s infinite;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

.chat-footer {
  padding: 14px 16px 12px;
  border-top: 1px solid var(--border-color);
  background:
    linear-gradient(
      180deg,
      rgba(15, 91, 216, 0.05) 0%,
      rgba(15, 91, 216, 0) 40%
    ),
    var(--bg-primary);
}

.input-container {
  display: flex;
  gap: 8px;
  align-items: center;
}

.chat-input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
}

.chat-input:focus {
  border-color: #0f5bd8;
  box-shadow: 0 0 0 3px rgba(15, 91, 216, 0.14);
}

.chat-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.send-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(120deg, #0f5bd8 0%, #0ea89a 100%);
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(15, 91, 216, 0.35);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.footer-tips {
  font-size: 11px;
  color: var(--text-tertiary);
  text-align: center;
  margin-top: 8px;
}

.chat-body::-webkit-scrollbar {
  width: 6px;
}

.chat-body::-webkit-scrollbar-track {
  background: transparent;
}

.chat-body::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.6);
  border-radius: 999px;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes typing {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.6;
  }
  30% {
    transform: translateY(-6px);
    opacity: 1;
  }
}

.chat-slide-enter-active,
.chat-slide-leave-active {
  transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}

.chat-slide-enter-from,
.chat-slide-leave-to {
  opacity: 0;
  transform: translateY(14px) scale(0.96);
}

@media (max-width: 480px) {
  .chat-container {
    width: calc(100vw - 20px);
    right: 10px;
    top: 66px;
    height: calc(100vh - 76px);
    max-height: calc(100vh - 76px);
    border-radius: 14px;
  }

  .message-content {
    max-width: 80%;
  }
}
</style>
