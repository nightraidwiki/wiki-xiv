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
      showFloatingSidebar: false,
      // Configuration du thème bleu
      skin: 'blue',
      uiMode: 'classic',
      // Désactivation des éléments non nécessaires
      enableFloating: false,
      enableContextMenu: false
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

<style>

rte-dropdown-panel {
  background: #ccdcee;
  color: #000;
}
rte-taglist {
  background: rgb(37, 97, 117);
}
rte-floatpanel {
  display: none;
}
</style>
