<script setup>
import { useRouter } from 'vue-router';
import { useArticlesStore } from '../store';
const { loadData, clearData } = useArticlesStore();

const router = useRouter();

loadData();

function reset() {
  clearData();
  router.push('/');
}

</script>
<template>
  <header>
    <nav>
      <router-link to="/dashboard">Dashboard</router-link>
      <router-link to="/articles">Articles</router-link>
      <router-link to="/playground">Playground</router-link>
    </nav>
    <button @click="reset">reset</button>
  </header>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" :key="$route.name" />
    </keep-alive>
  </router-view>
</template>
<style scoped>
header {
  display: flex;
  justify-content: space-between;
}
nav a {
  display: inline-block;
  padding: 5px 10px;
}

.router-link-active {
  font-weight: bold;
  text-decoration: underline;
}
</style>