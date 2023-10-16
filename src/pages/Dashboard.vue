<script setup>
import _ from 'lodash';
import { storeToRefs } from 'pinia';
import { ref, computed } from 'vue';
import { useArticlesStore } from '../store';
import { thousandFormat } from "../helper/utils";
import BarChart from '../components/BarChart.vue';

const articleStore = useArticlesStore();
const { articles } = storeToRefs(articleStore);

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

// 2.最近 n 篇文章數據
const currentCount = ref(10);
const currentType = ref('view');
const currentArticles = computed(() => {
  return articles.value.slice(0, currentCount.value).map((article) => {
    return {
      title: article.title,
      [currentType.value]: article.stats[currentType.value],
      createAt: article.createAt,
      id: article.id,
    }
  })
})

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
</template>
