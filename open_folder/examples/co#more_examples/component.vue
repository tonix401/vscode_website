<template>
  <div class="vscode-container">
    <header class="vscode-header">
      <h1>{{ title }}</h1>
      <span class="vscode-icon">📄</span>
    </header>

    <section class="vscode-content">
      <button
        v-for="file in files"
        :key="file.id"
        class="vscode-button"
        :class="{ active: selectedFile === file.id }"
        @click="selectFile(file.id)"
      >
        {{ file.name }}
      </button>

      <pre v-if="selectedFile"><code>{{ getFileContent(selectedFile) }}</code></pre>
    </section>

    <footer class="vscode-footer">
      <p>Total files: {{ files.length }}</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface File {
  id: number;
  name: string;
  content: string;
}

const title = ref("Vue Example Component");
const selectedFile = ref<number | null>(null);

const files = ref<File[]>([
  { id: 1, name: "App.vue", content: "Component content here..." },
  { id: 2, name: "main.ts", content: "Import statements..." },
  { id: 3, name: "package.json", content: "Dependencies list..." },
]);

const selectFile = (id: number): void => {
  selectedFile.value = selectedFile.value === id ? null : id;
};

const getFileContent = (id: number): string => {
  const file = files.value.find((f) => f.id === id);
  return file?.content ?? "";
};

const fileCount = computed(() => files.value.length);
</script>

<style scoped>
.vscode-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #1e1e1e;
  color: #d4d4d4;
  font-family: "Monaco", monospace;
}

.vscode-header {
  background: #252526;
  padding: 1rem;
  border-bottom: 1px solid #3e3e42;
}

.vscode-button.active {
  background: #0e639c;
}
</style>
