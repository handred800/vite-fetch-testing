<script setup></script>
<template>
  <nav>
    <router-link to="/dashboard">Dashboard</router-link>
    <router-link to="/articles">Articles</router-link>
    <router-link to="/playground">Playground</router-link>
  </nav>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" :key="$route.name" />
    </keep-alive>
  </router-view>
</template>
<style scoped>
nav a {
  display: inline-block;
  padding: 5px 10px;
}

.router-link-active {
  font-weight: bold;
  text-decoration: underline;
}
</style>