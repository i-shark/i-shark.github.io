<style src="../../assets/css/material-icons.css"/>
<style src="../../assets/css/flags.css"/>
<style src="./app.css"/>
<script src="./app.js"/>

<template>
  <v-app>
    <v-main v-show="ready">
      <router-view class="app-content" ref="router-component"/>
      <notifications group="primary" position="top center"/>
      <notifications group="secondary" position="top right"/>
      <notifications group="info" position="bottom right"/>
    </v-main>
  </v-app>
</template>
