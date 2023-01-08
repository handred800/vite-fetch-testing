<script setup>
  import { storeToRefs } from 'pinia';
  import { useArticlesStore } from '../store';

  const articleStore = useArticlesStore();
  const { articles } = storeToRefs(articleStore);
</script>

<template>
  <a
    v-for="article in articles"
    :href="`https://home.gamer.com.tw/artwork.php?sn=${article.id}`"
    class="card"
    target="_blank"
    :key="article.id"
  >
    <h4>{{ article.title }}</h4>
    <p>{{ article.createAt }}</p>
    <div style="display: flex">
      <img :src="article.image" alt="" style="max-width: 100px" />
      <ul>
        <li>view：{{ article.stats.view }}</li>
        <li>gp：{{ article.stats.gp }}</li>
        <li>coin：{{ article.stats.coin }}</li>
      </ul>
    </div>

    <!-- <pre>{{ res }}</pre> -->
  </a>
</template>

<style scoped>
.card {
  display: block;
  max-width: 500px;
  width: 100%;
  padding: 15px 20px;
  margin-bottom: 15px;
  background: #fff;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.15);
  box-sizing: border-box;
  transition: 0.15s;
}
.card:hover {
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

pre {
  white-space: pre-line;
}
</style>