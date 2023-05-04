<template>
  <div class="notification-button-container">
    <button class="notification-button" @click="toggleNotifications">
      <img src="../assets/icons/notification.svg" alt="NotificationBell" />
    </button>
    <div v-if="showNotifications" class="notifications-popup">
      <NotificationView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import NotificationView from '../views/NotificationView.vue'

const showNotifications = ref(false)

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const closeNotifications = () => {
  showNotifications.value = false
}

const handleWindowClick = (event: MouseEvent) => {
  if (!event.target) return
  const target = event.target as HTMLElement
  if (!target.closest('.notification-button-container')) {
    closeNotifications()
  }
}

onMounted(() => {
  window.addEventListener('click', handleWindowClick)
})

onUnmounted(() => {
  window.addEventListener('click', handleWindowClick)
})

</script>

<style scoped>
.notification-button {
  padding-left: 10px;
  background-color: #1A7028;
  border: none;
}

.notification-button img {
  height: 40px;
  width: 40px;
}

.notification-button-container {
  position: relative;
}

.notifications-popup {
  position: absolute;
  top: 130%;
  right: 0;
  width: 600px;
  height: 700px;
  z-index: 1000;
  background-color: #ccc;
  overflow-y: scroll;
  scrollbar-width: thin;
  border-style: solid;
}

.notifications-popup::-webkit-scrollbar-thumb {
  background-color: #555;
  width: 6px;
  border-radius: 10px;
}

.notifications-popup::-webkit-scrollbar-thumb:hover {
  background-color: #888;
}

@media (max-width: 760px) {
  .notifications-popup {
    position: absolute;
    top: 100%;
    left: 60%;
    transform: translateX(-57%);
    width: 80%;
    height: 700px;
    z-index: 1000;
    background-color: #ccc;
    overflow: scroll;
    scrollbar-width: 10px;
  }
}
</style>
