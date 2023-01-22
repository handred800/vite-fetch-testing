<script setup>
  import _ from 'lodash';
  import { storeToRefs } from 'pinia';
  import { ref, computed } from 'vue';
  import { useArticlesStore } from '../store';
  import { thousandFormat, filterWith, orderWith } from "../helper/utils";
  import LineChart from "../components/LineChart.vue";

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

  // 數據type select
  const filterStats = ref('stats.view');

  const filtedArticles = computed(() => {
    const filterPipe = _.flow([filterWith(filterYear.value), orderWith(filterStats.value)]);
    return filterPipe(articles.value);
  });

  // line chart
  const dataset = computed(() => {

    const yearFilter = (list) => _.groupBy(list, (article) => (article.createAt.slice(0, 4)))
    const sumFunc = (list) => _.mapValues(list, (articlesByYear) => _.sumBy(articlesByYear, filterStats.value));
    const pipe = _.flow([yearFilter, sumFunc, _.toPairs])

    return pipe(articles.value);
  })
  // line chart 互動
  function setYear(year) {
    filterYear.value = year;
  }
 
  // 加總數據
  const totalStats = (statsName) => _.reduce(filtedArticles.value, (sum, current) => sum + current.stats[statsName], 0);
  
</script>

<template>
  <fieldset>
    <legend>控制項</legend>
    年度: 
    <select v-model="filterYear">
      <option value="">全部</option>
      <option :value="option" v-for="option in yearOptions">{{ option }}</option>
    </select>
    排序:
    <select v-model="filterStats">
      <option value="createAt">發佈日期</option>
      <option value="stats.view">觀看數</option>
      <option value="stats.gp">GP</option>
      <option value="stats.coin">巴幣</option>
    </select>
  </fieldset>
  <p>共 {{filtedArticles.length}} 篇文章
    、{{ thousandFormat(totalStats('view')) }} 觀看數
    、{{ thousandFormat(totalStats('gp')) }} GP
    、{{ thousandFormat(totalStats('coin')) }} 巴幣
  </p>
  <line-chart :dataset="dataset" data-type="view" @click-data="setYear"></line-chart>
  <details open>
    <summary>排行</summary>
    <div class="template">
      <ul>
        <li v-for="(article, index) in filtedArticles" :key="article.id">
          <div style="display: flex; flex: 1;">
            <span style="margin-right: 10px">{{ index+1 }}</span>
            <a target="_blank" :href="`https://home.gamer.com.tw/artwork.php?sn=${article.id}`">{{article.title}}</a>
          </div>
          {{ _.get(article, filterStats) }}
        </li>
      </ul>
    </div>
  </details>

</template>

<style scoped>
.card-list {
  display: flex;
  overflow-x: auto;
}
.card-list .card {
  flex: 0 0 300px;
}
.card {
  display: block;
  max-width: 500px;
  width: 100%;
  padding: 15px 20px;
  background: #fff;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.15);
  box-sizing: border-box;
  transition: 0.15s;
}
.card-sm {
  max-width: 300px;
  padding: 5px 10px;
}
.card:hover {
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}
.card img {
  width: 100px;
  height: 100px;
  object-fit: contain;
  background-color: silver;
}

textarea {
  display: block;
  width: 100%;
  resize: vertical;
  /* white-space: pre-line; */
}

.template {
  display: block;
  width: 100%;
  max-width: 1024px;
  max-height: 500px;
  overflow-y: auto;
}
.template ul {
  padding: 0 15px;
}
.template li {
  display: flex;
  justify-content: space-between;
}
.template a {
  display: inline-block;
  color: var(--primary);
}
.template a:hover,
.template a:focus {
  text-decoration: underline;
}
</style>