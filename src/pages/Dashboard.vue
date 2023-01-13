<script setup>
  import _ from 'lodash';
  import dayjs from 'dayjs';
  import { storeToRefs } from 'pinia';
  import { ref, computed } from 'vue';
  import { useArticlesStore } from '../store';

  const articleStore = useArticlesStore();
  const { articles } = storeToRefs(articleStore);

  // 年度 select
  const filterYear = ref('');
  const yearOptions = computed(() => {
    const options = _.map(articles.value, ({createAt}) => Number(createAt.slice(0, 4)));
    const orderDesc = (list) => _.orderBy(list, [], ['desc'])
    const pipe = _.flow([_.uniq, orderDesc])
    return pipe(options)
  }) 

  const filtedArticles = computed(() => {
    if (filterYear.value === '') return articles.value
    return _.filter(articles.value, (article) => article.createAt.startsWith(filterYear.value));
  });
  const totalStats = (statsName) => _.reduce(filtedArticles.value, (sum, current) => sum + current.stats[statsName], 0);
  
</script>

<template>
  <select v-model="filterYear">
    <option value="">全部</option>
    <option :value="option" v-for="option in yearOptions">{{ option }}</option>
  </select>
  <p>共 {{articles.length}} 篇文章、{{ totalStats('view') }} 觀看數、{{ totalStats('gp') }} GP</p>
  <a
    v-for="article in filtedArticles"
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