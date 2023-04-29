<template>
    <div id="app">
        <div class="notification-button-container">
            <button class="notification-button" @click="toggleNotifications">
                <img src="../assets/bell.png" alt="NotificationBell" />
            </button>
            <div v-if="showNotifications" class="notifications-popup">
                <NotificationView />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NotificationView from '../views/NotificationView.vue'

const showNotifications = ref(false)

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  console.log(showNotifications.value)
}
</script>

<style scoped>
.notifications-popup {
    position: absolute;
    top: 100%;
    /* Set the top to 100% to position the popup right below the notification button */
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 80%;
    z-index: 1000;
    background-color: white;
}
</style>
