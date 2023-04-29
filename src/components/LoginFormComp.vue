<template>
  <div class="login-form">
    <div class="title">Logg inn</div>
    <form action="#">
      <div class="input-boxes">
        <div class="input-box">
          <i class="fas fa-envelope"></i>
          <input type="text" placeholder="Email..." required>
        </div>
        <div class="input-box">
          <i class="fas fa-lock"></i>
          <input type="password" placeholder="Passord..." required>
        </div>
        <div class="button input-box">
          <input type="submit" value="Logg inn">
        </div>
        <div class="text sign-up-text">Har du ikke bruker?
          <label @click="emit('switch-view')">Registrer deg</label>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">

const emit = defineEmits(['switch-view'])
</script>

<style scoped>
</style>
