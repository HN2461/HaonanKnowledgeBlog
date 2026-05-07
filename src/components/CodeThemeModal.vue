<template>
  <BaseModal 
    :modelValue="modelValue" 
    @update:modelValue="emit('update:modelValue', $event)" 
    contentClass="code-theme-modal-wrapper"
    :showClose="false"
  >
    <div class="code-theme-modal">
      <!-- 精简后的表头 -->
      <div class="modal-header">
        <h3 class="modal-title">代码主题</h3>
        <div class="theme-badge">{{ CODE_THEMES.length }} 个可选</div>
      </div>

      <div class="theme-grid">
        <div
          v-for="theme in CODE_THEMES"
          :key="theme.id"
          class="theme-card"
          :class="{ 'is-active': currentTheme === theme.id }"
          @click="selectTheme(theme.id)"
        >
          <div class="card-header">
            <div class="theme-info">
              <h4 class="theme-name">{{ theme.name }}</h4>
              <p class="theme-desc">{{ theme.description }}</p>
            </div>
            
            <div class="theme-check" v-if="currentTheme === theme.id">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </div>
          
          <div class="theme-preview" :data-theme="theme.id">
            <div class="preview-line"><span class="comment">// JavaScript 示例</span></div>
            <div class="preview-line"><span class="kw">function</span> <span class="fn">calculate</span>(<span class="var">x</span>, <span class="var">y</span>) {</div>
            <div class="preview-line">  <span class="kw">const</span> <span class="var">result</span> = <span class="var">x</span> * <span class="num">2</span> + <span class="var">y</span></div>
            <div class="preview-line">  <span class="kw">return</span> <span class="var">result</span> > <span class="num">10</span> ? <span class="bool">true</span> : <span class="bool">false</span></div>
            <div class="preview-line">}</div>
            <div class="preview-line"></div>
            <div class="preview-line"><span class="kw">const</span> <span class="var">message</span> = <span class="str">"Hello World"</span></div>
            <div class="preview-line"><span class="obj">console</span>.<span class="fn">log</span>(<span class="var">message</span>)</div>
          </div>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BaseModal from './BaseModal.vue'
import { CODE_THEMES, getCurrentCodeTheme, setCodeTheme, loadCodeThemeCSS } from '@/utils/codeTheme'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const currentTheme = ref('vs2015')

const selectTheme = (themeId) => {
  currentTheme.value = themeId
  setCodeTheme(themeId)
  loadCodeThemeCSS(themeId)
}

onMounted(() => {
  currentTheme.value = getCurrentCodeTheme()
})
</script>

<style>
/* 使用全局样式确保生效 */
.code-theme-modal-wrapper {
  width: 1280px !important;
  max-width: 92vw !important;
  max-height: 85vh !important;
  padding: 0 !important;
  overflow: hidden !important;
  display: flex !important;
  flex-direction: column !important;
}

@media (max-width: 1024px) {
  .code-theme-modal-wrapper {
    width: 95vw !important;
  }
}

@media (max-width: 768px) {
  .code-theme-modal-wrapper {
    width: 95vw !important;
    max-height: 90vh !important;
  }
}
</style>

<style scoped>

.code-theme-modal {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 表头 - 固定不滚动，合理内边距 */
.modal-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32px 40px 24px;
  border-bottom: 1px solid rgba(var(--primary-color-rgb), 0.12);
  background: var(--bg-primary);
}

.modal-title {
  margin: 0;
  color: var(--text-primary);
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
}

.theme-badge {
  padding: 8px 16px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(var(--primary-color-rgb), 0.1), rgba(var(--primary-color-rgb), 0.06));
  border: 1px solid rgba(var(--primary-color-rgb), 0.15);
  color: var(--primary-color);
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}

/* 网格区域 - 可滚动 */
.theme-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 32px 40px 36px;
  overflow-y: auto;
  overflow-x: hidden;
}

.theme-grid::-webkit-scrollbar {
  width: 6px;
}

.theme-grid::-webkit-scrollbar-track {
  background: transparent;
}

.theme-grid::-webkit-scrollbar-thumb {
  background: rgba(var(--primary-color-rgb), 0.2);
  border-radius: 3px;
}

.theme-grid::-webkit-scrollbar-thumb:hover {
  background: rgba(var(--primary-color-rgb), 0.35);
}

.theme-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 2px solid var(--border-color);
  border-radius: 14px;
  background: var(--bg-secondary);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  padding: 2px;
  background: linear-gradient(135deg, var(--primary-color), rgba(var(--primary-color-rgb), 0.5));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.25s;
  pointer-events: none;
}

.theme-card:hover {
  transform: translateY(-3px);
  border-color: rgba(var(--primary-color-rgb), 0.4);
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.12);
}

.theme-card.is-active {
  border-color: transparent;
  background: linear-gradient(135deg, rgba(var(--primary-color-rgb), 0.08), rgba(var(--primary-color-rgb), 0.04));
  box-shadow: 0 6px 24px rgba(var(--primary-color-rgb), 0.2);
}

.theme-card.is-active::before {
  opacity: 1;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.theme-info {
  flex: 1;
  min-width: 0;
}

.theme-name {
  margin: 0 0 8px;
  color: var(--text-primary);
  font-size: 17px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.theme-desc {
  margin: 0;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.theme-check {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), rgba(var(--primary-color-rgb), 0.8));
  color: #fff;
  box-shadow: 0 3px 12px rgba(var(--primary-color-rgb), 0.4);
  animation: checkBounce 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes checkBounce {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
  }
}

.theme-preview {
  padding: 18px;
  border-radius: 12px;
  background: #1e1e1e;
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.8;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.25);
}

.preview-line {
  color: #abb2bf;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preview-line:empty {
  height: 1.3em;
}

/* Atom One Dark 主题颜色 */
.theme-preview[data-theme="atom-one-dark"] .comment { color: #5c6370; }
.theme-preview[data-theme="atom-one-dark"] .kw { color: #c678dd; }
.theme-preview[data-theme="atom-one-dark"] .fn { color: #61aeee; }
.theme-preview[data-theme="atom-one-dark"] .str { color: #98c379; }
.theme-preview[data-theme="atom-one-dark"] .num { color: #d19a66; }
.theme-preview[data-theme="atom-one-dark"] .var { color: #e06c75; }
.theme-preview[data-theme="atom-one-dark"] .bool { color: #d19a66; }
.theme-preview[data-theme="atom-one-dark"] .obj { color: #e5c07b; }
.theme-preview[data-theme="atom-one-dark"] { background: #282c34; }

/* GitHub Dark 主题颜色 */
.theme-preview[data-theme="github-dark"] .comment { color: #8b949e; }
.theme-preview[data-theme="github-dark"] .kw { color: #ff7b72; }
.theme-preview[data-theme="github-dark"] .fn { color: #d2a8ff; }
.theme-preview[data-theme="github-dark"] .str { color: #a5d6ff; }
.theme-preview[data-theme="github-dark"] .num { color: #79c0ff; }
.theme-preview[data-theme="github-dark"] .var { color: #ffa657; }
.theme-preview[data-theme="github-dark"] .bool { color: #79c0ff; }
.theme-preview[data-theme="github-dark"] .obj { color: #ffa657; }
.theme-preview[data-theme="github-dark"] { background: #0d1117; }

/* VS2015 主题颜色 */
.theme-preview[data-theme="vs2015"] .comment { color: #608b4e; }
.theme-preview[data-theme="vs2015"] .kw { color: #569cd6; }
.theme-preview[data-theme="vs2015"] .fn { color: #dcdcaa; }
.theme-preview[data-theme="vs2015"] .str { color: #ce9178; }
.theme-preview[data-theme="vs2015"] .num { color: #b5cea8; }
.theme-preview[data-theme="vs2015"] .var { color: #9cdcfe; }
.theme-preview[data-theme="vs2015"] .bool { color: #569cd6; }
.theme-preview[data-theme="vs2015"] .obj { color: #4ec9b0; }
.theme-preview[data-theme="vs2015"] { background: #1e1e1e; }

/* Monokai 主题颜色 */
.theme-preview[data-theme="monokai"] .comment { color: #75715e; }
.theme-preview[data-theme="monokai"] .kw { color: #f92672; }
.theme-preview[data-theme="monokai"] .fn { color: #66d9ef; }
.theme-preview[data-theme="monokai"] .str { color: #e6db74; }
.theme-preview[data-theme="monokai"] .num { color: #ae81ff; }
.theme-preview[data-theme="monokai"] .var { color: #fd971f; }
.theme-preview[data-theme="monokai"] .bool { color: #ae81ff; }
.theme-preview[data-theme="monokai"] .obj { color: #a6e22e; }
.theme-preview[data-theme="monokai"] { background: #272822; }

/* Nord 主题颜色 */
.theme-preview[data-theme="nord"] .comment { color: #616e88; }
.theme-preview[data-theme="nord"] .kw { color: #81a1c1; }
.theme-preview[data-theme="nord"] .fn { color: #88c0d0; }
.theme-preview[data-theme="nord"] .str { color: #a3be8c; }
.theme-preview[data-theme="nord"] .num { color: #b48ead; }
.theme-preview[data-theme="nord"] .var { color: #d08770; }
.theme-preview[data-theme="nord"] .bool { color: #81a1c1; }
.theme-preview[data-theme="nord"] .obj { color: #8fbcbb; }
.theme-preview[data-theme="nord"] { background: #2e3440; }

/* Tokyo Night 主题颜色 */
.theme-preview[data-theme="tokyo-night-dark"] .comment { color: #565f89; }
.theme-preview[data-theme="tokyo-night-dark"] .kw { color: #bb9af7; }
.theme-preview[data-theme="tokyo-night-dark"] .fn { color: #7aa2f7; }
.theme-preview[data-theme="tokyo-night-dark"] .str { color: #9ece6a; }
.theme-preview[data-theme="tokyo-night-dark"] .num { color: #ff9e64; }
.theme-preview[data-theme="tokyo-night-dark"] .var { color: #f7768e; }
.theme-preview[data-theme="tokyo-night-dark"] .bool { color: #ff9e64; }
.theme-preview[data-theme="tokyo-night-dark"] .obj { color: #7dcfff; }
.theme-preview[data-theme="tokyo-night-dark"] { background: #1a1b26; }

/* Night Owl 主题颜色 */
.theme-preview[data-theme="night-owl"] .comment { color: #637777; }
.theme-preview[data-theme="night-owl"] .kw { color: #c792ea; }
.theme-preview[data-theme="night-owl"] .fn { color: #82aaff; }
.theme-preview[data-theme="night-owl"] .str { color: #ecc48d; }
.theme-preview[data-theme="night-owl"] .num { color: #f78c6c; }
.theme-preview[data-theme="night-owl"] .var { color: #addb67; }
.theme-preview[data-theme="night-owl"] .bool { color: #ff5874; }
.theme-preview[data-theme="night-owl"] .obj { color: #7fdbca; }
.theme-preview[data-theme="night-owl"] { background: #011627; }

/* Stack Overflow Dark 主题颜色 */
.theme-preview[data-theme="stackoverflow-dark"] .comment { color: #858c93; }
.theme-preview[data-theme="stackoverflow-dark"] .kw { color: #c586c0; }
.theme-preview[data-theme="stackoverflow-dark"] .fn { color: #9cdcfe; }
.theme-preview[data-theme="stackoverflow-dark"] .str { color: #ce9178; }
.theme-preview[data-theme="stackoverflow-dark"] .num { color: #b5cea8; }
.theme-preview[data-theme="stackoverflow-dark"] .var { color: #4fc1ff; }
.theme-preview[data-theme="stackoverflow-dark"] .bool { color: #569cd6; }
.theme-preview[data-theme="stackoverflow-dark"] .obj { color: #4ec9b0; }
.theme-preview[data-theme="stackoverflow-dark"] { background: #1c1b1b; }

.comment {
  font-style: italic;
}

.kw {
  font-weight: 600;
}

.fn,
.str,
.num,
.var,
.bool,
.obj {
  font-weight: normal;
}

@media (max-width: 1024px) {
  .modal-header {
    padding: 28px 36px 20px;
  }

  .theme-grid {
    gap: 18px;
    padding: 28px 36px 32px;
  }

  .theme-card {
    padding: 18px;
  }
}

@media (max-width: 768px) {
  .modal-header {
    padding: 24px 28px 18px;
  }

  .modal-title {
    font-size: 20px;
  }

  .theme-badge {
    font-size: 12px;
    padding: 6px 12px;
  }

  .theme-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 24px 28px 28px;
  }

  .theme-card {
    padding: 16px;
  }

  .theme-preview {
    font-size: 11px;
    padding: 14px;
  }
}

@media (max-width: 480px) {
  .modal-header {
    padding: 20px 24px 16px;
  }

  .modal-title {
    font-size: 18px;
  }

  .theme-badge {
    font-size: 11px;
    padding: 5px 10px;
  }

  .theme-grid {
    padding: 20px 24px 24px;
  }

  .theme-card {
    padding: 14px;
  }

  .card-header {
    margin-bottom: 14px;
  }

  .theme-name {
    font-size: 15px;
    margin-bottom: 6px;
  }

  .theme-desc {
    font-size: 12px;
  }

  .theme-preview {
    font-size: 10px;
    padding: 12px;
  }
}
</style>
