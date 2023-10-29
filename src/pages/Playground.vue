<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import _ from "lodash";
import { thousandFormat, filterWith } from "../helper/utils";
import { useArticlesStore } from "../store";
import LineChart from "../components/LineChart.vue";

const articleStore = useArticlesStore();
const { articles } = storeToRefs(articleStore);

// 年度 select
const filterYear = ref('');
const yearOptions = computed(() => {
  return _.chain(articles.value)
  .map(({ createAt }) => Number(createAt.slice(0, 4)))
  .sortedUniq()
  .value();
})

const isSorted = ref(false);
// 數據type select
const filterStats = ref('stats.view');

const filtedArticles = computed(() => {
  const filtedData = filterWith(filterYear.value)(articles.value);
  return isSorted.value ? filtedData.sort((a, b) => (_.get(b, filterStats.value) - _.get(a, filterStats.value))) : filtedData;
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
    數據:
    <select v-model="filterStats">
      <option value="stats.view">觀看數</option>
      <option value="stats.gp">GP</option>
      <option value="stats.coin">巴幣</option>
    </select>
  </fieldset>
  <p>共 {{ filtedArticles.length }} 篇文章
    、{{ thousandFormat(totalStats('view')) }} 觀看數
    、{{ thousandFormat(totalStats('gp')) }} GP
    、{{ thousandFormat(totalStats('coin')) }} 巴幣
  </p>
  <div class="grid">
    <div class="col-6">
      <line-chart :dataset="dataset" @click-data="setYear"></line-chart>
    </div>
    <div class="col-6">
      是否排序
      <input type="checkbox" v-model="isSorted">
      <div class="template">
        <ul>
          <li v-for="article in filtedArticles" :key="article.id">
            <div>
              <a target="_blank" :title="article.createAt"
                :href="`https://home.gamer.com.tw/artwork.php?sn=${article.id}`">{{ article.title }}</a>
            </div>
            <div style="white-space: nowrap;padding-left: 10px;">{{ _.get(article, filterStats) }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
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
</style>
