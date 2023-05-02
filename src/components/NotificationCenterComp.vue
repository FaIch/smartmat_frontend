<template>
    <div id="app">
        <div class="notification-button-container">
            <button class="notification-button" @click="toggleNotifications">
                <img src="../assets/icons/notification.svg" alt="NotificationBell" />
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
.notification-button {
  padding-left: 10px;
  background-color: #1A7028;
  border: none;
  padding-bottom: 10px;
}

.notification-button img {
    height: 30px;
    width: 30px;
}

.notifications-popup {
    position: absolute;
    top: 100%;
    /* Set the top to 100% to position the popup right below the notification button */
    left: 60%;
    transform: translateX(-57%);
    width: 600px;
    height: 700px;
    z-index: 1000;
    background-color: white;
    overflow: scroll;
    scrollbar-width: thin;
}

  .notifications-popup::-webkit-scrollbar-thumb {
    background-color: #1A7028;
    width: 6px;
  }

  @media (max-width: 760px) {
    .notifications-popup {
    position: absolute;
    top: 100%;
    /* Set the top to 100% to position the popup right below the notification button */
    left: 60%;
    transform: translateX(-57%);
    width: 80%;
    height: 700px;
    z-index: 1000;
    background-color: white;
    overflow: scroll;
    scrollbar-width: 10px;
  }
}
</style>
