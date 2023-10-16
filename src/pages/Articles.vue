<script setup>
  import { storeToRefs } from 'pinia';
  import { useArticlesStore } from '../store';

  const articleStore = useArticlesStore();
  const { articles } = storeToRefs(articleStore);
</script>

<template>
  <div class="grid grid-equalHeight">
    <div class="col-3_xs-12_sm-6_md-4" v-for="article in articles">
      <a
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
    </div>
  </div>
</template>
