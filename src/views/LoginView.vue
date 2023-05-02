<template>
  <div class="login-container-body">
    <div class="login-container">
      <div class="form-container">
        <div class="login-forms">
          <div class="login-form-content">
            <LoginFormComp v-show="showLoginForm" @switchView="toggleView" />
            <SignUpFormComp v-show="!showLoginForm" @switchView="toggleView" />
          </div>
        </div>
      </div>
      <div class="image-container">
        <img class="logo-image" src="../assets/food-pic.jpg">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SignUpFormComp from '../components/SignUpFormComp.vue'
import LoginFormComp from '../components/LoginFormComp.vue'
import { useUtilityStore } from '../stores/UtilityStore'
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/UserStore'
const utilityStore = useUtilityStore()
const userStore = useUserStore()

onMounted(() => {
  userStore.logout()
  utilityStore.hideItems()
})

const showLoginForm = ref(true)

const toggleView = () => {
  showLoginForm.value = !showLoginForm.value
}

</script>

<style>
/* Login/signup page based on code found here:
https://www.youtube.com/watch?v=U69WL9jInW0
*/
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap');
*{
  box-sizing: border-box;
  font-family: "Poppins" , sans-serif;
}
.login-container-body{
  min-height: 100vh;
  height: 100%;
  padding-top: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url("../assets/startpagebackground3.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.login-container{
  position: relative;
  min-height: 580px;
  max-width: 850px;
  width: 100%;
  background: #fff;
  padding-left: 20px;
  padding-top: 0;
  padding-bottom: 0;
  box-shadow: 0 5px 10px rgba(0,0,0,0.2);
  perspective: 2700px;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.form-container {
  flex-basis: 50%;
  max-width: 50%;
}

.image-container {
  padding-left: 20px;
  flex-basis: 50%;
  min-width: 50%;
  min-height: 580px;
  position: relative;
  overflow: hidden;
}

.logo-image {
  width: 100%;
  min-height: 100%;
  object-fit: cover;
}
.login-container .login-forms{
  height: 100%;
  width: 100%;
  background: #fff;
}
.login-forms .login-form-content .title{
  position: relative;
  font-size: 24px;
  font-weight: 500;
  color: #333;
}
.login-forms .login-form-content .title:before{
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  height: 3px;
  width: 25px;
}
.login-forms .signup-form  .title:before{
  width: 20px;
}
.login-forms .login-form-content .input-boxes{
  margin-top: 30px;
}
.login-forms .login-form-content .input-box{
  display: flex;
  align-items: center;
  height: 50px;
  width: 100%;
  margin: 10px 0;
  position: relative;
}
.login-form-content .input-box input{
  height: 100%;
  width: 100%;
  outline: none;
  border: none;
  font-size: 16px;
  font-weight: 500;
  border-bottom: 2px solid rgba(0,0,0,0.2);
  transition: all 0.3s ease;
}

.login-form-content .input-box i{
  position: absolute;
  color: #7d2ae8;
  font-size: 17px;
}
.login-forms .login-form-content .text{
  font-size: 14px;
  font-weight: 500;
  color: #333;
}
.login-forms .login-form-content .text a{
  text-decoration: none;
}
.login-forms .login-form-content .text a:hover{
  text-decoration: underline;
}
.login-forms .login-form-content .button{
  color: #fff;
  margin-top: 40px;
}
.login-forms .login-form-content .button input{
  color: #fff;
  background-color: #1A7028;
  border-radius: 6px;
  padding: 0;
  cursor: pointer;
  transition: all 0.4s ease;
}
.login-forms .login-form-content .button input:hover{
  background-color: #25A13A;
}
.login-forms .login-form-content label{
  color: #5b13b9;
  cursor: pointer;
}
.login-forms .login-form-content label:hover{
  text-decoration: underline;
}
.login-forms .login-form-content .login-text,
.login-forms .login-form-content .sign-up-text{
  text-align: center;
  margin-top: 25px;
}
@media (max-width: 730px) {
  .login-form-content .login-form,
  .login-form-content .signup-form{
    width: 100%;
  }
}

@media only screen and (min-width: 992px){
  .login-container {
    scale: 1;
  }
}

@media only screen and (max-width: 900px){
  .image-container {
    display: none;
  }
  .login-container {
    display: grid;
    grid-template-columns: 1fr;
    justify-content: center;
    width: 500px;
    padding: 20px 20px;
  }
  .form-container {
    justify-self: center;
    max-width: 100%;
    width: 90%;
    padding: 0;
  }
}

@media only screen and (max-width: 600px){
  .login-container {
    width: 85%;
  }
}

@media only screen and (min-width: 600px){
  .input-box input {
    padding: 0 30px;
  }
}

@media only screen and (max-width: 450px){
  .input-box {
    text-align: left;
    justify-content: left;
    padding: 0;
  }
}

</style>
