<template>
  <nav class="navbar is-opaque">
    <div class="navbar-container">
      <div class="navbar-logo">
        <div @click.prevent="closeMenu" exact-active-class="active">
          <h1
            class="logo"
            @click.prevent="() => navigate('/')"
            :class="{ active: isActiveLink('/') }"
          >SmartMat</h1>
        </div>
      </div>

      <div class="navbar-icons" v-if="showItems">
        <div
          v-if="!showHamburgerMenu"
          class="icon-link"
          @click.prevent="() => navigate('/recipes')"
          :class="{ active: isActiveLink('/recipes') }"
        >
        <h1>{{ recipes }}</h1>
        </div>
        <div
          v-if="!showHamburgerMenu"
          class="icon-link"
          @click.prevent="() => navigate('/weekMenu')"
          :class="{ active: isActiveLink('/weekMenu') }"
        >
          <h1>{{ weekMenu }}</h1>
        </div>

        <div
          v-if="!showHamburgerMenu"
          class="icon-link"
          @click.prevent="() => navigate('/shoppinglist')"
          :class="{ active: isActiveLink('/shoppinglist') }"
        >
        <h1>{{ shoppingCart }}</h1>
        </div>

        <div
          v-if="!showHamburgerMenu"
          class="icon-link"
          @click.prevent="() => navigate('/fridge')"
          :class="{ active: isActiveLink('/fridge') }"
        >
        <h1>{{ inventory }}</h1>
        </div>

        <div
          v-if="!showHamburgerMenu"
          class="icon-link"
          @click.prevent="() => navigate('/profile')"
          :class="{ active: isActiveLink('/profile') }"
        >
        <h1>{{ profile }}</h1>
        </div>

        <div
          v-if="!showHamburgerMenu"
          class="icon-link"
          @click.prevent="() => navigate('/login')"
          :class="{ active: isActiveLink('/login') }"
        >
        <h1>{{ login }}</h1>
        </div>

        <notification-center-comp />

        <div class="menu" v-if="showHamburgerMenu">
          <button class="menu-button" @click="toggleMenu">
          </button>
          <ul class="sub-menu" v-if="isMenuVisible">
            <li>
              <router-link to="/chat" @click.prevent="closeMenu" class="icon-link" exact-active-class="active">
                Messages
              </router-link>
            </li>
            <li>
              <router-link to="/notifications" @click.prevent="closeMenu" class="icon-link" exact-active-class="active">
                Notifications
              </router-link>
            </li>
            <li>
              <router-link to="/login" @click.prevent="closeMenu" class="icon-link" exact-active-class="active">
                Profile
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '../stores/UserStore'
import { useUtilityStore } from '../stores/UtilityStore'
import NotificationCenterComp from './NotificationCenterComp.vue'
import router from '../router/index'

const userStore = useUserStore()
const utilityStore = useUtilityStore()
const screenWidth = ref(window.innerWidth)
const showHamburgerMenu = computed(() => screenWidth.value < 500)
const isMenuVisible = ref(false)
const route = useRoute()
const currentPath = computed(() => route.path)
const showItems = ref(true)

const isActiveLink = (path: string) => {
  return currentPath.value === path
}

const navigate = (route: string) => {
  if (!userStore.loggedIn) {
    userStore.logout()
  } else {
    router.push(route)
  }
}

watch(() => utilityStore.navBarItems, (newValue) => {
  showItems.value = newValue
})

const toggleMenu = () => {
  isMenuVisible.value = !isMenuVisible.value
}

const closeMenu = () => {
  isMenuVisible.value = false
}

const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth
}

const recipes = computed(() => {
  if (screenWidth.value > 850) {
    return 'Oppskrifter'
  } else {
    return ''
  }
})

const weekMenu = computed(() => {
  if (screenWidth.value > 850) {
    return 'Ukesmeny'
  } else {
    return ''
  }
})

const shoppingCart = computed(() => {
  if (screenWidth.value > 850) {
    return 'Handleliste'
  } else {
    return ''
  }
})

const inventory = computed(() => {
  if (screenWidth.value > 850) {
    return 'Mitt kjøleskap'
  } else {
    return ''
  }
})

const profile = computed(() => {
  if (screenWidth.value > 850) {
    return 'Min profil'
  } else {
    return ''
  }
})

const login = computed(() => {
  if (screenWidth.value > 850) {
    return 'Logg ut'
  } else {
    return ''
  }
})

onMounted(() => {
  window.addEventListener('resize', updateScreenWidth)
  showItems.value = utilityStore.navBarItems
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenWidth)
})

</script>

<style scoped>

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 75px;
  z-index: 9999;
  width: 100%;
}
.navbar.is-opaque {
  background-color: #1A7028;
  transition: background-color 0.1s ease-in-out;
}
.navbar:not(.is-opaque) {
  background-color: transparent;
  transition: background-color 0.1s ease-in-out;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  justify-content: center;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.navbar-icons{
  display: flex;
  height: 73px;
  width: 700px;
  justify-content: right;
  align-items: center;
  padding: 0;
}

h1{
  color: white;
  text-decoration: none;
  font-size: 17px;
  font-family: 'Lato', sans-serif;
}

a{
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
}

.icon-link{
  transition: transform 0.3s;
  padding: 10px;
  cursor: pointer;
}
.icon-link:hover {
  transform: translateY(-2px);
  border-bottom: 4px solid white;
}

.icon-link.active {
  transform: translateY(-2px);
  border-bottom: 4px solid white;
}

.menu-button {
  display: block;
  width: 50px;
  height: 50px;
  background-repeat: no-repeat;
  background-position: center center;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.sub-menu {
  position: absolute;
  top: 75px;
  left: 0;
  width: 100%;
  background-color: #e9f1fe;
  border: 1px solid #cccccc;
  border-top: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  padding: 10px 0;
  margin: 0;
  text-align: center;
  list-style: none;
}

.sub-menu li {
  display: block;
  padding: 10px 0;
}

.logo {
  font-size: 30px;
  font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 0;
  padding-bottom: 17px;
  cursor: pointer;
}

.sub-menu li a {
  display: block;
  color: #333333;
  font-size: 20px;
  font-family: 'Lato', sans-serif;
  font-weight: 700;
  text-decoration: none;
  padding: 5px 20px;
  transition: background-color 0.2s ease;
}

.sub-menu li a:hover {
  background-color: #f3f3f3;
}

@media only screen and (max-width: 400px){
  .navbar-container{
    justify-content: center;
  }
  .navbar-icons img{
    padding-right: 5px;
    padding-left: 5px;
  }
}
@media only screen and (max-width: 300px){
  .navbar-icons img{
    padding: 0;
    margin: 0;
  }
}
</style>
