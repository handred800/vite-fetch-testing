<script setup>
import _ from 'lodash';
import { storeToRefs } from 'pinia';
import { ref, computed } from 'vue';
import { useArticlesStore } from '../store';
import { thousandFormat } from "../helper/utils";
import BarChart from '../components/BarChart.vue';
import HeatMap from '../components/HeatMap.vue';

const articleStore = useArticlesStore();
const { articles, years, articlesGroupByTime } = storeToRefs(articleStore);

// 1.總和數據
const statsTotal = computed(() => {
  const total = articles.value.map(({ stats }) => stats).reduce((acc, item) => {
    return {
      gp: acc.gp + item.gp,
      view: acc.view + item.view,
      coin: acc.coin + item.coin,
    }
  })
  return { count: articles.value.length, ...total };
})

const articleFormatterFactory = (statName) => {
  return (article) => {
    return {
      title: article.title,
      [statName]: article.stats[statName],
      createAt: article.createAt,
      id: article.id,
    }
  }
}

// 2.最近 n 篇文章數據
const currentCount = ref(10);
const currentType = ref('view');
const currentArticles = computed(() => {
  return articles.value.slice(0, currentCount.value).map(articleFormatterFactory(currentType.value))
})

// 3.月曆圖
const heatMapCurrentDate = ref(null);
const heatMapYear = ref(years.value[0]);
const heatMapType = ref('view');
const heatMapArticles = computed(() => {
  return _.chain(articlesGroupByTime.value)
    .mapValues((items) => {
      return _.sumBy(items, (item) => item.stats[heatMapType.value]);
    })
    .toPairs()
    .value()
})

const clickCalndar = (e) => {
  heatMapCurrentDate.value = e.data[0];
}

</script>

<template>
  <div class="grid">
    <div class="col-3_md-6_sm-12">
      <div class="card">文章數：{{ thousandFormat(statsTotal.count) }}</div>
    </div>
    <div class="col-3_md-6_sm-12">
      <div class="card">GP：{{ thousandFormat(statsTotal.gp) }}</div>
    </div>
    <div class="col-3_md-6_sm-12">
      <div class="card">觀看：{{ thousandFormat(statsTotal.view) }}</div>
    </div>
    <div class="col-3_md-6_sm-12">
      <div class="card">巴幣：{{ thousandFormat(statsTotal.coin) }}</div>
    </div>
  </div>
  最新
  <select v-model="currentCount">
    <option :value="10">10</option>
    <option :value="20">20</option>
    <option :value="30">30</option>
  </select>
  篇文章

  <select v-model="currentType">
    <option value="view">view</option>
    <option value="gp">gp</option>
  </select>

  <div class="grid">
    <div class="col-6_sm-12">
      <bar-chart :dataset="currentArticles" :data-type="currentType"></bar-chart>
    </div>
    <div class="col-6_sm-12">
      <div class="template">
        <ul>
          <li v-for="article in currentArticles" :key="article.id">
            <div>
              <a target="_blank" :title="article.createAt"
                :href="`https://home.gamer.com.tw/artwork.php?sn=${article.id}`">{{ article.title }}</a>
            </div>
            <div style="white-space: nowrap;padding-left: 10px;">{{ article.createAt }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <div>
    <select v-model="heatMapYear">
      <option :value="y" v-for="y in years" :key="y">{{ y }}</option>
    </select>
    <select v-model="heatMapType">
      <option value="view">view</option>
      <option value="gp">gp</option>
    </select>
    <HeatMap :dataset="heatMapArticles" :time="heatMapYear" :dataType="heatMapType" :clickEvent="clickCalndar"></HeatMap>
    <ul>
      <li v-for="article in articlesGroupByTime[heatMapCurrentDate]" :key="article.id">
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
      </li>
    </ul>
  </div>
</template>
