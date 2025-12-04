<template>
  <Teleport to="body">
    <transition name="modal" appear>
      <div
        v-if="modelValue"
        class="base-modal"
        :class="modalClass"
        @click.self="handleBackdropClick"
      >
        <div
          class="modal-content"
          :class="contentClass"
          @click.stop
        >
          <!-- 默认关闭按钮 -->
          <button
            v-if="showClose"
            class="modal-close-btn"
            @click="$emit('update:modelValue', false)"
            aria-label="关闭"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <!-- 弹窗内容 -->
          <slot />
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  showClose: {
    type: Boolean,
    default: true
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  },
  modalClass: {
    type: String,
    default: ''
  },
  contentClass: {
    type: String,
    default: ''
  },
  lockScroll: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue'])

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    emit('update:modelValue', false)
  }
}

// 锁定/解锁页面滚动
watch(() => props.modelValue, (newVal) => {
  if (props.lockScroll) {
    if (newVal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
}, { immediate: true })

// 组件卸载时解锁滚动
import { onUnmounted } from 'vue'
onUnmounted(() => {
  if (props.lockScroll) {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
/* 通用弹窗样式 - 确保所有弹窗都不会被header限制 */
.base-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; /* 高于header的z-index: 100 */
  padding: 20px;
  overflow-y: auto;
}

.modal-content {
  background: var(--bg-primary);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-close-btn {
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

.modal-close-btn:hover {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

/* 弹窗动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9) translateY(-20px);
}

/* 响应式 */
@media (max-width: 768px) {
  .base-modal {
    padding: 10px;
  }
  
  .modal-content {
    max-width: 95vw;
    max-height: 95vh;
    border-radius: 12px;
  }
  
  .modal-close-btn {
    top: 12px;
    right: 12px;
  }
}
</style>
