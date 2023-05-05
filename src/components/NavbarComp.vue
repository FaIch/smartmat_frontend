<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-left">
        <div
          class="logo icon-link"
          @click.prevent="() => navigate('/savings')"
          :class="{ active: isActiveLink('/savings') }"
        ></div>

        <div class="navbar-icons" v-if="showItems">

          <div
            v-if="!showHamburgerMenu"
            class="icon-link"
            @click.prevent="() => navigate('/weekMenu')"
            :class="{ active: isActiveLink('/weekMenu') }"
          >
            <h1 data-cy="weekMenu">Ukesmeny</h1>
          </div>

          <div
            v-if="!showHamburgerMenu"
            class="icon-link"
            @click.prevent="() => navigate('/recipes')"
            :class="{ active: isActiveLink('/recipes') }"
            >
            <h1 data-cy="recipes">Oppskrifter</h1>
          </div>

          <div
            v-if="!showHamburgerMenu"
            class="icon-link"
            @click.prevent="() => navigate('/shoppinglist')"
            :class="{ active: isActiveLink('/shoppinglist') }"
          >
            <h1 data-cy="shoppingCart">Handleliste</h1>
          </div>

          <div
            v-if="!showHamburgerMenu"
            class="icon-link"
            @click.prevent="() => navigate('/fridge')"
            :class="{ active: isActiveLink('/fridge') }"
          >
            <h1 data-cy="fridge">Mitt kjøleskap</h1>
          </div>
        </div>
      </div>

      <div class="navbar-right">
        <notification-center-comp v-if="showItems && !showHamburgerMenu"/>
        <div class="profile" v-if="showItems && !showHamburgerMenu">
          <img src="../assets/icons/profile.svg" class="profile-button" @click="toggleProfileMenu"/>
          <ul class="profile-menu" v-if="isProfileMenuVisible" @click.stop>
            <li v-if=" userStore.role === Role.PARENT">
              <a data-cy="profile" @click.prevent="() => { closeProfileMenu(); navigate('/profile'); }" :class="{ active: isActiveLink('/profile')}">
                Profilinnstillinger
              </a>
            </li>
            <li>
              <a @click.prevent="() => { closeProfileMenu(); navigate('/login'); }" :class="{ active: isActiveLink('/login') }">
                Logg ut
              </a>
            </li>
          </ul>
        </div>

        <div class="hamburger-menu" v-if="showHamburgerMenu && showItems">
          <button class="hamburger-menu-button" @click="toggleMenu">
          </button>
            <ul class="hamburger-sub-menu" v-if="isMenuVisible">
              <li>
                <a @click.prevent="() => { closeMenu(); navigate('/weekMenu'); }" :class="{ active: isActiveLink('/weekMenu') }">
                  Ukesmeny
                </a>
              </li>
              <li>
                <a @click.prevent="() => { closeMenu(); navigate('/recipes'); }" :class="{ active: isActiveLink('/recipes') }">
                  Oppskrifter
                </a>
              </li>
              <li>
                <a @click.prevent="() => { closeMenu(); navigate('/shoppinglist'); }" :class="{ active: isActiveLink('/shoppinglist') }">
                  Handleliste
                </a>
              </li>
              <li>
                <a @click.prevent="() => { closeMenu(); navigate('/fridge'); }" :class="{ active: isActiveLink('/fridge') }">
                  Mitt Kjøleskap
                </a>
              </li>
              <li>
                <a v-if="userStore.role === Role.PARENT" @click.prevent="() => { closeMenu(); navigate('/profile'); }" :class="{ active: isActiveLink('/profile') }">
                  Min Profil
                </a>
              </li>
              <li>
                <a @click.prevent="() => { closeMenu(); navigate('/login'); }" :class="{ active: isActiveLink('/login') }">
                  Logg Ut
                </a>
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
import { Role } from '../components/types'

const userStore = useUserStore()
const utilityStore = useUtilityStore()
const screenWidth = ref(window.innerWidth)
const showHamburgerMenu = computed(() => screenWidth.value < 800)
const isMenuVisible = ref(false)
const isProfileMenuVisible = ref(false)
const route = useRoute()
const showItems = ref(false)

const isActiveLink = (path: string) => {
  return route.path === path
}

const navigate = (route: string) => {
  if (route === '/savings' && !userStore.loggedIn) {
    router.push('/')
  } else if (!userStore.loggedIn) {
    userStore.logout()
  } else {
    router.push(route)
  }
}

watch(() => utilityStore.navBarItems, (newValue) => {
  showItems.value = newValue
})

const toggleProfileMenu = () => {
  isProfileMenuVisible.value = !isProfileMenuVisible.value
}

const closeProfileMenu = () => {
  isProfileMenuVisible.value = false
}

const toggleMenu = () => {
  isMenuVisible.value = !isMenuVisible.value
}

const closeMenu = () => {
  isMenuVisible.value = false
}

const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', updateScreenWidth)
  window.addEventListener('click', handleWindowClick)
  showItems.value = utilityStore.navBarItems
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenWidth)
  window.addEventListener('click', handleWindowClick)
})

const handleWindowClick = (event: MouseEvent) => {
  if (!event.target) return
  const target = event.target as HTMLElement
  if (!target.closest('.profile')) {
    closeProfileMenu()
  }
}

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
  background-color: #1A7028;
  justify-content: center;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 1300px;
  padding: 0 20px;
  align-items: center;
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

.logo {
  margin-bottom: 10px;
  padding: 0;
  padding-right: 50px;
  cursor: pointer;
  width: 100px;
  height: 40px;
  background-image: url('../assets/logo/logoSmall.png');
  background-position: center center;
  background-size: cover;
}

.navbar-icons {
  display: flex;
}

.navbar-left {
  display: flex;
  padding: 0;
  align-items: center;
}

.navbar-left h1 {
  margin: 0;
}

.navbar-right {
  display: flex;
  height: 100%;
  width: 110px;
  justify-content: space-between;
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

.profile {
  height: 30px;
  position: relative;
}

.profile-button {
  width: 40px;
  height: 40px;
  cursor: pointer;
}

.profile-menu {
  position: absolute;
  right: 0;
  min-width: 200px;
  background-color: white;
  border: 1px solid #cccccc;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  padding: 10px 0;
  margin: 0;
  text-align: left;
  list-style: none;
  z-index: 20;
}

.profile-menu li {
  display: block;
  padding: 5px 15px;
}

.profile-menu li:hover {
  background-color: rgb(184, 184, 184);
}

.profile-menu li a {
  display: block;
  color: #333333;
  font-size: 16px;
  font-family: 'Lato', sans-serif;
  font-weight: 700;
  text-decoration: none;
  padding: 5px 10px;
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.profile-menu li a:hover {
  text-decoration: none;
}

.hamburger-menu {
  position: fixed;
  top: 10px;
  right: 20px;
}

.hamburger-sub-menu {
  position: absolute;
  top: 65px;
  right: 0;
  min-width: 240px;
  background-color: white;
  border: 1px solid #cccccc;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  padding: 10px 0;
  margin: 0;
  text-align: center;
  list-style: none;
  z-index: 20;
}

.hamburger-menu-button {
  display: block;
  width: 80px;
  height: 50px;
  background-repeat: no-repeat;
  background-position: center center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  background-image: url('../assets/icons/menu-white.svg');
}

.hamburger-sub-menu li {
  display: block;
  padding: 10px 0;
}

.hamburger-sub-menu li:hover {
  background-color: rgb(184, 184, 184);
}

.hamburger-sub-menu li a {
  display: block;
  color: #333333;
  font-size: 20px;
  font-family: 'Lato', sans-serif;
  font-weight: 700;
  text-decoration: none;
  padding: 5px 20px;
  transition: background-color 0.2s ease;
}

.hamburger-sub-menu li a:hover {
  background-color: rgb(184, 184, 184);
}

@media only screen and (min-width: 300px) {
  .logo {
    margin-bottom: 10px;
    padding: 0;
    margin-right: auto;
    cursor: pointer;
    width: 200px;
    height: 40px;
    background-image: url('../assets/logo/logoBig.png');
    background-position: center center;
    background-size: cover;
  }
}

</style>
