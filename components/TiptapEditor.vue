<template>
  <div class="tiptap-editor">
    <!-- Toolbar -->
    <div class="tiptap-toolbar">
      <button
        v-for="item in formatButtons"
        :key="item.icon"
        @click="item.action"
        class="toolbar-button"
        :class="{ 'is-active': item.isActive?.() }"
      >
        {{ item.icon }}
      </button>
    </div>

    <!-- Editor -->
    <editor-content 
      :editor="editor" 
      class="tiptap-content"
    />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { ref, onBeforeUnmount } from 'vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  }
})

const formatButtons = [
  {
    icon: 'B',
    action: () => editor.value?.chain().focus().toggleBold().run(),
    isActive: () => editor.value?.isActive('bold')
  },
  {
    icon: 'I',
    action: () => editor.value?.chain().focus().toggleItalic().run(),
    isActive: () => editor.value?.isActive('italic')
  },
  {
    icon: 'H1',
    action: () => editor.value?.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: () => editor.value?.isActive('heading', { level: 1 })
  },
  {
    icon: 'H2',
    action: () => editor.value?.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: () => editor.value?.isActive('heading', { level: 2 })
  },
  {
    icon: '•',
    action: () => editor.value?.chain().focus().toggleBulletList().run(),
    isActive: () => editor.value?.isActive('bulletList')
  },
  {
    icon: '1.',
    action: () => editor.value?.chain().focus().toggleOrderedList().run(),
    isActive: () => editor.value?.isActive('orderedList')
  },
  {
    icon: 'Quote',
    action: () => editor.value?.chain().focus().toggleBlockquote().run(),
    isActive: () => editor.value?.isActive('blockquote')
  },
  {
    icon: 'Code',
    action: () => editor.value?.chain().focus().toggleCodeBlock().run(),
    isActive: () => editor.value?.isActive('codeBlock')
  }
]

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped>
.tiptap-editor {
  border: 1px solid #374151;
  border-radius: 0.5rem;
  overflow: hidden;
}

.tiptap-toolbar {
  padding: 0.5rem;
  background-color: #1f2937;
  border-bottom: 1px solid #374151;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.toolbar-button {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background-color: transparent;
  color: #d1d5db;
  border: 1px solid #374151;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.toolbar-button:hover {
  background-color: #374151;
}

.toolbar-button.is-active {
  background-color: #2563eb;
  border-color: #2563eb;
  color: white;
}

.tiptap-content {
  padding: 1rem;
  min-height: 200px;
  background-color: #1f2937;
}

:deep(.ProseMirror) {
  outline: none;
  color: #f3f4f6;
}

:deep(.ProseMirror p) {
  margin: 0.5rem 0;
}

:deep(.ProseMirror h1) {
  font-size: 2rem;
  font-weight: bold;
  margin: 1rem 0;
}

:deep(.ProseMirror h2) {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0.75rem 0;
}

:deep(.ProseMirror ul),
:deep(.ProseMirror ol) {
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}

:deep(.ProseMirror blockquote) {
  border-left: 4px solid #374151;
  padding-left: 1rem;
  margin: 0.5rem 0;
  color: #9ca3af;
}

:deep(.ProseMirror code) {
  background-color: #374151;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-family: monospace;
}

:deep(.ProseMirror pre) {
  background-color: #374151;
  padding: 1rem;
  border-radius: 0.5rem;
  margin: 0.5rem 0;
}

:deep(.ProseMirror pre code) {
  background-color: transparent;
  padding: 0;
}
</style> 