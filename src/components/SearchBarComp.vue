<template>
  <div class="search-bar">
    <input
      type="text"
      v-model="searchQuery"
      @input="updateSearch"
      placeholder="Search products..."
    />
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue'

const searchQuery = ref('')

const emit = defineEmits(['search'])

const updateSearch = () => {
  emit('search', searchQuery.value)
}
</script>

<style scoped>
.search-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

input[type='text'] {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;
}

input[type='text']::placeholder {
  color: #999;
}

input[type='text']:focus {
  border-color: #007bff;
}
</style>
