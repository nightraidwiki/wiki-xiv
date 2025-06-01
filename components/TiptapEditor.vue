<template>
  <div class="tiptap-editor">
    <!-- Toolbar -->
    <div class="tiptap-toolbar">
      <div class="toolbar-group">
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

      <div class="toolbar-group">
        <button
          v-for="align in alignButtons"
          :key="align.icon"
          @click="align.action"
          class="toolbar-button"
          :class="{ 'is-active': align.isActive?.() }"
        >
          {{ align.icon }}
        </button>
      </div>

      <div class="toolbar-group">
        <input
          type="color"
          v-model="selectedColor"
          @input="setTextColor"
          class="color-picker"
          title="Text color"
        />
        <div class="link-group">
          <button
            @click="toggleLink"
            class="toolbar-button"
            :class="{ 'is-active': isLinkActive }"
          >
            Insérer lien
          </button>
          <div v-if="showLinkDialog" class="link-dialog">
            <input
              v-model="linkUrl"
              type="url"
              placeholder="Entrez l'URL"
              class="link-input"
              @keyup.enter="setLink"
              ref="linkInput"
            />
            <div class="link-dialog-buttons">
              <button @click="setLink" class="toolbar-button">OK</button>
              <button @click="removeLink" class="toolbar-button">Supprimer</button>
              <button @click="closeLinkDialog" class="toolbar-button">Annuler</button>
            </div>
          </div>
        </div>
        <button
          @click="toggleSource"
          class="toolbar-button"
          :class="{ 'is-active': isSourceMode }"
        >
          Source
        </button>
      </div>

      <!-- Image Controls -->
      <div v-if="isImageSelected" class="toolbar-group">
        <button
          v-for="align in imageAlignButtons"
          :key="align.icon"
          @click="align.action"
          class="toolbar-button"
          :class="{ 'is-active': align.isActive?.() }"
          :title="align.title"
        >
          {{ align.icon }}
        </button>
        <button
          @click="toggleInline"
          class="toolbar-button"
          :class="{ 'is-active': isInline }"
          title="Mettre en ligne"
        >
          Inline
        </button>
        <div class="image-size-controls">
          <input
            type="range"
            v-model="imageWidth"
            min="100"
            max="800"
            step="10"
            @input="updateImageSize"
            title="Largeur de l'image"
          />
          <span class="size-label">{{ imageWidth }}px</span>
        </div>
      </div>
    </div>

    <!-- Editor -->
    <div v-if="!isSourceMode">
      <editor-content 
        :editor="editor" 
        class="tiptap-content"
      />
    </div>
    <div v-else class="source-mode">
      <textarea
        v-model="sourceContent"
        class="source-textarea"
        @input="updateFromSource"
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Link from '@tiptap/extension-link'
import ImageResize from 'tiptap-extension-resize-image'
import { ref, onBeforeUnmount, nextTick, computed } from 'vue'
import { useSupabase } from '~/composables/useSupabase'
import type { EditorView } from 'prosemirror-view'
import imageCompression from 'browser-image-compression'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const { supabase } = useSupabase()

const selectedColor = ref('#ffffff')
const showLinkDialog = ref(false)
const linkUrl = ref('')
const isLinkActive = ref(false)
const isSourceMode = ref(false)
const sourceContent = ref('')
const linkInput = ref<HTMLInputElement | null>(null)
const imageWidth = ref(400)

const isImageSelected = computed(() => editor.value?.isActive('image'))
const isInline = computed(() => editor.value?.isActive('image', { class: 'inline' }))

async function convertToWebP(file: File): Promise<File> {
  // Options de compression
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/webp',
  }

  try {
    // Compression et conversion en WebP
    const compressedFile = await imageCompression(file, options)
    
    // Créer un nouveau fichier avec l'extension .webp
    return new File([compressedFile], `${file.name.split('.')[0]}.webp`, {
      type: 'image/webp'
    })
  } catch (error) {
    console.error('Error converting image:', error)
    return file // Retourner le fichier original en cas d'erreur
  }
}

const imageAlignButtons = [
  {
    icon: '←',
    title: 'Aligner à gauche',
    action: () => editor.value?.chain().focus().updateAttributes('image', { class: 'align-left' }).run(),
    isActive: () => editor.value?.isActive('image', { class: 'align-left' })
  },
  {
    icon: '↔',
    title: 'Centrer',
    action: () => editor.value?.chain().focus().updateAttributes('image', { class: 'align-center' }).run(),
    isActive: () => editor.value?.isActive('image', { class: 'align-center' })
  },
  {
    icon: '→',
    title: 'Aligner à droite',
    action: () => editor.value?.chain().focus().updateAttributes('image', { class: 'align-right' }).run(),
    isActive: () => editor.value?.isActive('image', { class: 'align-right' })
  }
]

function toggleInline() {
  if (editor.value?.isActive('image', { class: 'inline' })) {
    editor.value.chain().focus().updateAttributes('image', { class: '' }).run()
  } else {
    editor.value?.chain().focus().updateAttributes('image', { class: 'inline' }).run()
  }
}

function updateImageSize() {
  if (editor.value?.isActive('image')) {
    editor.value.chain().focus().updateAttributes('image', { width: imageWidth.value }).run()
  }
}

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    TextStyle,
    Color,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-blue-400 hover:text-blue-300',
      },
    }),
    ImageResize.configure({
      inline: true,
      HTMLAttributes: {
        class: 'editor-image',
      },
    }),
  ],
  onUpdate: ({ editor }) => {
    const html = editor.getHTML()
    emit('update:modelValue', html)
    sourceContent.value = html
  },
  onSelectionUpdate: ({ editor }) => {
    isLinkActive.value = editor.isActive('link')
    if (editor.isActive('image')) {
      const attrs = editor.getAttributes('image')
      if (attrs.width) {
        imageWidth.value = parseInt(attrs.width)
      }
    }
  },
  editorProps: {
    handlePaste: (view: EditorView, event: ClipboardEvent) => {
      const items = event.clipboardData?.items
      if (!items) return false

      for (const item of items) {
        if (item.type.indexOf('image') === 0) {
          event.preventDefault()
          const file = item.getAsFile()
          if (file) {
            // Convertir l'image en WebP
            convertToWebP(file).then(webpFile => {
              // Générer un nom de fichier unique
              const fileName = `${Math.random().toString(36).substring(2)}.webp`

              // Upload vers Supabase Storage
              supabase.storage
                .from('article-images')
                .upload(fileName, webpFile)
                .then(({ error }) => {
                  if (error) throw error
                  return supabase.storage
                    .from('article-images')
                    .getPublicUrl(fileName)
                })
                .then(({ data: { publicUrl } }) => {
                  // Insérer l'image dans l'éditeur avec l'extension ImageResize
                  // L'extension ImageResize gérera le redimensionnement via Node Views
                  editor.value?.chain().focus().setImage({ src: publicUrl }).run()
                })
                .catch((error) => {
                  console.error('Error uploading image:', error)
                })
            })

            return true
          }
        }
      }
      return false
    },
  },
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

const alignButtons = [
  {
    icon: '←',
    action: () => editor.value?.chain().focus().setTextAlign('left').run(),
    isActive: () => editor.value?.isActive({ textAlign: 'left' })
  },
  {
    icon: '↔',
    action: () => editor.value?.chain().focus().setTextAlign('center').run(),
    isActive: () => editor.value?.isActive({ textAlign: 'center' })
  },
  {
    icon: '→',
    action: () => editor.value?.chain().focus().setTextAlign('right').run(),
    isActive: () => editor.value?.isActive({ textAlign: 'right' })
  }
]

function setTextColor(event: Event) {
  const input = event.target as HTMLInputElement
  editor.value?.chain().focus().setColor(input.value).run()
}

function toggleLink(event: Event) {
  event.preventDefault()
  if (editor.value?.isActive('link')) {
    editor.value.chain().focus().unsetLink().run()
  } else {
    showLinkDialog.value = true
    nextTick(() => {
      linkInput.value?.focus()
    })
  }
}

function setLink() {
  if (linkUrl.value) {
    editor.value?.chain().focus().setLink({ href: linkUrl.value }).run()
  }
  closeLinkDialog()
}

function removeLink() {
  editor.value?.chain().focus().unsetLink().run()
  closeLinkDialog()
}

function closeLinkDialog() {
  showLinkDialog.value = false
  linkUrl.value = ''
}

function toggleSource() {
  isSourceMode.value = !isSourceMode.value
  if (isSourceMode.value) {
    sourceContent.value = editor.value?.getHTML() || ''
  } else {
    editor.value?.commands.setContent(sourceContent.value)
  }
}

function updateFromSource() {
  emit('update:modelValue', sourceContent.value)
}

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
  gap: 1rem;
  flex-wrap: wrap;
}

.toolbar-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding: 0 0.5rem;
  border-right: 1px solid #374151;
}

.toolbar-group:last-child {
  border-right: none;
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

.color-picker {
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: 1px solid #374151;
  border-radius: 0.25rem;
  background-color: transparent;
  cursor: pointer;
}

.color-picker::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-picker::-webkit-color-swatch {
  border: none;
  border-radius: 0.25rem;
}

.source-mode {
  padding: 1rem;
  background-color: #1f2937;
  min-height: 200px;
}

.source-textarea {
  width: 100%;
  min-height: 200px;
  padding: 0.5rem;
  background-color: #111827;
  color: #f3f4f6;
  border: 1px solid #374151;
  border-radius: 0.25rem;
  font-family: monospace;
  resize: vertical;
}

.link-group {
  position: relative;
  display: flex;
  align-items: center;
}

.link-dialog {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #1f2937;
  border: 1px solid #374151;
  border-radius: 0.5rem;
  padding: 0.75rem;
  z-index: 50;
  margin-top: 0.5rem;
  min-width: 300px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.link-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #374151;
  border-radius: 0.25rem;
  background-color: #111827;
  color: #f3f4f6;
  margin-bottom: 0.5rem;
}

.link-dialog-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
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

.image-size-controls {
  display: none;
}

:deep(.editor-image) {
  max-width: 100%;
  height: auto;
  margin: 1rem 0;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

:deep(.editor-image.inline) {
  display: inline-block;
  margin: 0 0.5rem;
  vertical-align: middle;
}

:deep(.editor-image.align-left) {
  float: left;
  margin-right: 1rem;
  margin-bottom: 1rem;
}

:deep(.editor-image.align-right) {
  float: right;
  margin-left: 1rem;
  margin-bottom: 1rem;
}

:deep(.editor-image.align-center) {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style> 