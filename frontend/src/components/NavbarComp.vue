<template>
    <nav class="navbar" :class="{ 'is-opaque': isOpaque }">
        <div class="navbar-container">
            <div class="navbar-logo">
                <router-link to="/" @click.prevent="closeMenu" exact-active-class="active">
                <img
                    id="logo"
                    src="../assets/logo.png"
                    alt="logo"
                    @mouseover="underLineImage"
                    @mouseout="removeUnderLine"
                />
                </router-link>
            </div>
            <div class="navbar-icons">

                <router-link v-if="!showHamburgerMenu" to="/chat" class="icon-link" exact-active-class="active">
                <h1>{{ recipes }}</h1>
                </router-link>

                <router-link v-if="!showHamburgerMenu" to="/notifications" class="icon-link" exact-active-class="active">
                <h1>{{ shoppingCart }}</h1>
                </router-link>

                <router-link v-if="!showHamburgerMenu" to="/login" class="icon-link" exact-active-class="active">
                <h1>{{ inventory }}</h1>
                </router-link>

                <router-link v-if="!showHamburgerMenu" to="/login" class="icon-link" exact-active-class="active">
                <h1>{{ profile }}</h1>
                </router-link>

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
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useUtilityStore } from '../stores/UtilityStore'

const store = useUtilityStore()
const isOpaque = ref(true)
const screenWidth = ref(window.innerWidth)
const showHamburgerMenu = computed(() => screenWidth.value < 500)
const isMenuVisible = ref(false)

const toggleMenu = () => {
  isMenuVisible.value = !isMenuVisible.value
  if (isMenuVisible.value) {
    isOpaque.value = true
  } else {
    isOpaque.value = false
  }
}

const closeMenu = () => {
  isMenuVisible.value = false
  store.setTransparentStatus(true)
}

const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth
}

const recipes = computed(() => {
  if (screenWidth.value > 850) {
    return 'Matforslag'
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

watch(() => store.transparent, (newValue) => {
  if (isMenuVisible.value) {
    return
  }
  isOpaque.value = !newValue
})

onMounted(() => {
  isOpaque.value = !store.transparent
  window.addEventListener('resize', updateScreenWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenWidth)
})

function underLineImage (event: any) {
  event.target.classList.add('underline')
}

function removeUnderLine (event: any) {
  event.target.classList.remove('underline')
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
}
.navbar.is-opaque {
    background-color: #26a23b;
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

.navbar-logo img {
    height: 70px;
}

.navbar-icons{
    display: flex;
    height: 73px;
    width: 700px;
    justify-content: right;
    align-items: center;
    padding: 0;
}
.navbar-icons img{
    height: 44px;
    padding-right: 5px;
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
}
.icon-link:hover {
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
