<template>
  <BaseModal
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    modal-class="html-preview-modal-shell"
    content-class="html-preview-modal-panel"
  >
    <section class="html-preview-modal">
      <header class="preview-head">
        <div class="preview-copy">
          <p class="preview-kicker">交互示例</p>
          <h2 class="preview-title">{{ previewTitle }}</h2>
          <p class="preview-description">
            这里会直接加载文章关联的 HTML 学习页面。若某些高级能力在沙箱内受限，可切到新窗口完整查看。
          </p>
        </div>

        <div class="preview-head-actions">
          <a
            :href="previewUrl"
            class="preview-head-link"
            target="_blank"
            rel="noopener"
          >
            新窗口打开
          </a>
        </div>
      </header>

      <div class="preview-frame-shell">
        <div v-if="!frameLoaded" class="preview-loading" aria-live="polite">
          <div class="preview-loading-mark" aria-hidden="true"></div>
          <div class="preview-loading-copy">
            <strong>正在载入示例</strong>
            <span>页面加载完成后，这里会显示你的 HTML 运行效果。</span>
          </div>
        </div>

        <iframe
          v-if="previewUrl"
          :key="previewUrl"
          class="preview-frame"
          :class="{ 'is-ready': frameLoaded }"
          :src="previewUrl"
          :title="previewTitle"
          sandbox="allow-forms allow-modals allow-scripts"
          loading="lazy"
          referrerpolicy="strict-origin-when-cross-origin"
          @load="handleFrameLoad"
        ></iframe>
      </div>

      <footer class="preview-footer">
        <div class="preview-footer-tip">
          <strong>预览说明</strong>
          <span>当前使用受限 iframe 运行，适合展示纯 HTML、CSS、JavaScript 学习示例。</span>
        </div>
        <button
          type="button"
          class="preview-close-btn"
          @click="$emit('update:modelValue', false)"
        >
          关闭预览
        </button>
      </footer>
    </section>
  </BaseModal>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import BaseModal from '@/components/BaseModal.vue'
import { buildAttachmentUrl } from '@/utils/noteAttachments'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  attachment: {
    type: Object,
    default: null
  },
  noteTitle: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])

const frameLoaded = ref(false)

const previewTitle = computed(() => {
  return props.attachment?.name || props.noteTitle || 'HTML 示例预览'
})

const previewUrl = computed(() => {
  const attachmentPath = props.attachment?.path
  if (!attachmentPath) {
    return ''
  }

  return buildAttachmentUrl(attachmentPath, import.meta.env.BASE_URL)
})

const handleFrameLoad = () => {
  frameLoaded.value = true
}

watch(
  () => [props.modelValue, previewUrl.value],
  () => {
    frameLoaded.value = false
  }
)
</script>

<style scoped>
.html-preview-modal {
  display: flex;
  flex-direction: column;
  min-height: min(82vh, 920px);
  width: min(1100px, 100%);
  background:
    linear-gradient(180deg, rgba(var(--primary-color-rgb), 0.06), rgba(var(--primary-color-rgb), 0.015)),
    var(--bg-primary);
}

.preview-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 28px 28px 18px;
  border-bottom: 1px solid rgba(var(--primary-color-rgb), 0.12);
}

.preview-copy {
  min-width: 0;
}

.preview-kicker {
  margin: 0 0 8px;
  color: var(--primary-color);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.preview-title {
  margin: 0 0 10px;
  color: var(--text-primary);
  font-size: 28px;
  line-height: 1.15;
}

.preview-description {
  margin: 0;
  max-width: 60ch;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.75;
}

.preview-head-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.preview-head-link,
.preview-close-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid rgba(var(--primary-color-rgb), 0.22);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.18s ease, border-color 0.18s ease, background-color 0.18s ease;
}

.preview-head-link:hover,
.preview-close-btn:hover {
  transform: translateY(-1px);
  border-color: rgba(var(--primary-color-rgb), 0.34);
  background: rgba(var(--primary-color-rgb), 0.08);
}

.preview-frame-shell {
  position: relative;
  flex: 1;
  min-height: 460px;
  padding: 20px 24px 0;
}

.preview-loading {
  position: absolute;
  inset: 20px 24px 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  border-radius: 20px;
  border: 1px dashed rgba(var(--primary-color-rgb), 0.22);
  background:
    linear-gradient(135deg, rgba(var(--primary-color-rgb), 0.08), rgba(var(--primary-color-rgb), 0.02)),
    var(--bg-secondary);
}

.preview-loading-mark {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 3px solid rgba(var(--primary-color-rgb), 0.18);
  border-top-color: var(--primary-color);
  animation: preview-spin 0.9s linear infinite;
}

.preview-loading-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.preview-loading-copy strong {
  color: var(--text-primary);
  font-size: 14px;
}

.preview-loading-copy span {
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.7;
}

.preview-frame {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  min-height: 460px;
  border: 1px solid rgba(var(--primary-color-rgb), 0.16);
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 26px 50px rgba(15, 23, 42, 0.08);
  opacity: 0;
  transition: opacity 0.22s ease;
}

.preview-frame.is-ready {
  opacity: 1;
}

.preview-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 18px 24px 24px;
}

.preview-footer-tip {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.preview-footer-tip strong {
  color: var(--text-primary);
  font-size: 13px;
}

.preview-footer-tip span {
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.7;
}

.preview-close-btn {
  flex-shrink: 0;
}

@keyframes preview-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .html-preview-modal {
    min-height: 88vh;
  }

  .preview-head {
    flex-direction: column;
    align-items: stretch;
    padding: 22px 18px 16px;
  }

  .preview-title {
    font-size: 24px;
  }

  .preview-frame-shell {
    min-height: 360px;
    padding: 16px 16px 0;
  }

  .preview-loading {
    inset: 16px 16px 0;
    flex-direction: column;
    text-align: center;
    padding: 18px;
  }

  .preview-frame {
    min-height: 360px;
  }

  .preview-footer {
    flex-direction: column;
    align-items: stretch;
    padding: 16px 16px 18px;
  }

  .preview-close-btn {
    width: 100%;
  }
}
</style>
