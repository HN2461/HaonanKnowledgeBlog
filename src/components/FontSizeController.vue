<template>
  <div class="font-size-controller">
    <button 
      class="font-btn" 
      @click="decrease" 
      :disabled="fontSize <= MIN_FONT_SIZE"
      title="减小字体"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </button>
    
    <span class="font-size-display">{{ fontSize }}px</span>
    
    <button 
      class="font-btn" 
      @click="increase" 
      :disabled="fontSize >= MAX_FONT_SIZE"
      title="增大字体"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </button>
    
    <button 
      class="font-btn reset-btn" 
      @click="reset"
      :disabled="fontSize === DEFAULT_FONT_SIZE"
      title="重置字体"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
        <path d="M3 3v5h5"></path>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { 
  getFontSize, 
  setFontSize, 
  increaseFontSize, 
  decreaseFontSize,
  resetFontSize,
  DEFAULT_FONT_SIZE,
  MIN_FONT_SIZE,
  MAX_FONT_SIZE
} from '../utils/fontSizeStorage'

const emit = defineEmits(['change'])

const fontSize = ref(DEFAULT_FONT_SIZE)

const increase = () => {
  fontSize.value = increaseFontSize(fontSize.value)
  setFontSize(fontSize.value)
}

const decrease = () => {
  fontSize.value = decreaseFontSize(fontSize.value)
  setFontSize(fontSize.value)
}

const reset = () => {
  fontSize.value = resetFontSize()
}

watch(fontSize, (newSize) => {
  emit('change', newSize)
})

onMounted(() => {
  fontSize.value = getFontSize()
  emit('change', fontSize.value)
})
</script>

<style scoped>
.font-size-controller {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  background-color: var(--bg-secondary, #f5f5f5);
  border-radius: 8px;
  border: 1px solid var(--border-color, #e0e0e0);
}

.font-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--text-secondary, #666);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.font-btn:hover:not(:disabled) {
  background-color: var(--bg-tertiary, #e0e0e0);
  color: var(--text-primary, #333);
}

.font-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.font-size-display {
  min-width: 40px;
  text-align: center;
  font-size: 12px;
  color: var(--text-secondary, #666);
  font-weight: 500;
}

.reset-btn {
  margin-left: 4px;
  border-left: 1px solid var(--border-color, #e0e0e0);
  padding-left: 8px;
}
</style>
