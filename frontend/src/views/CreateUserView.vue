<script lang="ts">
import { login, createuser } from "../utils/loginutils";

export default {
  name: "LoginView",

  /*methods: {
        async userlogin() {
            login(this.username, this.password);
        },

        async makeuser() {
            //fix "confirm password" check
            createuser(this.username, this.password);
        }

        @click="userlogin"
         @click="makeuser"
    }, */

  data() {
    return {
      username: "",
      password: "",
      loginStatus: "",
    };
  },
};
</script>

<template>
  <div id="Registry" class="tabcontent">
    <label for="username"> Brukernavn: </label>
    <input
      type="text"
      id="username"
      aria-required="true"
      data-ok="false"
      placeholder="Skriv brukernavn her..."
      v-model="username"
    />
    <p></p>
    <label for="pass"> Passord: </label>
    <input
      type="password"
      id="pass"
      aria-required="true"
      data-ok="false"
      placeholder="Skriv passord her..."
      v-model="password"
    />
    <p></p>
    <label for="pass"> Skriv passordet på nytt: </label>
    <input
      type="password"
      id="pass"
      aria-required="true"
      data-ok="false"
      placeholder="Skriv passord her..."
      v-model="password"
    />
    <p></p>
    <button id="loginbutton">Lag bruker</button>
  </div>
</template>

<style></style>
