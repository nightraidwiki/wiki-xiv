<template>
  <div class="rich-text-editor">
    <div ref="editorRef" class="rte-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Write your content here...'
  }
})

const emit = defineEmits(['update:modelValue'])
const editorRef = ref(null)
let rte = null

onMounted(() => {
  // Initialize the editor after the component is mounted
  nextTick(() => {
    const div = editorRef.value
    
    // Initialize RichTextEditor avec configuration de base
    rte = new RichTextEditor(div, {
      toolbar: 'full',
      showFloatingSidebar: false
    });
    
    // Masquer la barre latérale après l'initialisation
    nextTick(() => {
      const style = document.createElement('style');
      style.textContent = `
        .rte-floating-toolbar,
        [class*="floating-toolbar"] {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    });
    
    // Set initial content
    if (props.modelValue) {
      rte.setHTMLCode(props.modelValue)
    }
    
    // Set placeholder
    if (props.placeholder) {
      rte.config.placeholder = props.placeholder
    }
    
    // Listen for content changes
    rte.attachEvent('change', () => {
      emit('update:modelValue', rte.getHTMLCode())
    })
  })
})

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  if (rte && newValue !== rte.getHTMLCode()) {
    rte.setHTMLCode(newValue)
  }
})

// Clean up on component destruction
const cleanupEditor = () => {
  if (rte) {
    try {
      // Désactive les événements et nettoie l'éditeur
      if (rte.detachEvent) {
        rte.detachEvent('change');
      }
      // Nettoie l'élément DOM
      const editorElement = rte.get_element?.();
      if (editorElement?.parentNode) {
        editorElement.parentNode.removeChild(editorElement);
      }
      // Supprime les références
      rte = null;
    } catch (e) {
      console.warn('Error cleaning up editor:', e);
    }
  }
}

// Nettoyer l'éditeur avant la destruction du composant
onBeforeUnmount(cleanupEditor);

// Expose the editor instance
defineExpose({
  getEditor: () => rte,
  getHTML: () => rte?.getHTMLCode() || '',
  setHTML: (html) => {
    if (rte) rte.setHTMLCode(html)
  }
})
</script>

<style scoped>
.rich-text-editor {
  border: 1px solid #374151;
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: #1f2937;
  margin: 1rem 0;
}

.rte-container {
  min-height: 300px;
}

/* Masquer les éléments indésirables du RTE */
:deep(#rteDebugInfo),
:deep(#rteDebugToolbar),
:deep(.rte-toolbar-floating),
:deep(.rte-toolbar-float),
:deep(.rte-toolbar-fixed) {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
  height: 0 !important;
  width: 0 !important;
  overflow: hidden !important;
  position: absolute !important;
  top: -9999px !important;
  left: -9999px !important;
}

/* Désactiver la sélection flottante */
:deep(.rte-selection-marker) {
  display: none !important;
}

/* Désactiver les outils flottants */
:deep(.rte-floating-toolbar),
:deep([class*="floating-toolbar"]) {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
  width: 0 !important;
  height: 0 !important;
  overflow: hidden !important;
  position: absolute !important;
  top: -9999px !important;
  left: -9999px !important;
}

/* Cible spécifiquement la barre latérale du RTE */
:deep(.rte-sidebar),
:deep([class*="sidebar"]):not(.rte-editor) {
  display: none !important;
}

/* Désactive les effets de survol qui pourraient faire apparaître la barre */
:deep(.rte-editor *) {
  user-select: none !important;
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
}

:deep(.rte-modern) {
  --rte-main-color: #2563eb;
  --rte-main-color-brighten: #3b82f6;
  --rte-text-color: #f3f4f6;
  --rte-background-color: #1f2937;
  --rte-toolbar-color: #111827;
  --rte-border-color: #374151;
  --rte-border-radius: 0.5rem;
  --rte-box-shadow: none;
  --rte-font-family: inherit;
  --rte-selection-color: rgba(59, 130, 246, 0.3);
}

:deep(.rte-modern .rte-toolbar) {
  background-color: #111827;
  border-bottom: 1px solid #374151;
}

:deep(.rte-modern .rte-editarea) {
  color: #f3f4f6;
  background-color: #1f2937;
  min-height: 200px;
}
</style>
