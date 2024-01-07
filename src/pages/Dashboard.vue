<script setup>
import _ from 'lodash';
import { storeToRefs } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useArticlesStore } from '../store';
import { sortBySize, sortByCurry, thousandFormat } from "../helper/utils";
import BarChart from '../components/BarChart.vue';
import LineChart from "../components/LineChart.vue";
import HeatMap from '../components/HeatMap.vue';
import ArticleCard from '../components/ArticleCard.vue';

const articleStore = useArticlesStore();
const { articles, years, articlesGroupByYear, articlesGroupByDate } = storeToRefs(articleStore);

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

const articleFormatterCurry = (statName) => {
  return (article) => {
    return {
      title: article.title,
      [statName]: article.stats[statName],
      createAt: article.createAt,
      id: article.id,
    }
  }
}

// 2.文章數據
const currentType = ref('view');
const currentIsSorted = ref(false);
const selectedId = ref('');
const orderFunc = computed(() => sortByCurry([currentType.value]));

// 處理過的文章數據
const formattedArticles = computed(() => {
  const formattedResult = articles.value.map(articleFormatterCurry(currentType.value));
  return currentIsSorted.value ? orderFunc.value(formattedResult) : formattedResult;
})

// 選取的文章數據
const selectArticle = computed(() => {
  return articles.value.find((article) => article.id === selectedId.value);
})
// 去除重複值+排序的 currentType 陣列 (用於計算百分位)
const sortedValues = computed(() => {
  return sortBySize(formattedArticles.value.map((article) => article[currentType.value]));
})

const selectArticlePercentage = computed(() => {
  if (selectedId.value === '') return;
  const index = _.findLastIndex(sortedValues.value, (val) => val === selectArticle.value.stats[currentType.value]);
  return ((index / sortedValues.value.length) * 100).toFixed(1);
}) 


// 選取事件
const clickBarchart = (data) => {
  selectedId.value = data[3] === selectedId.value ? '' : data[3];
} 
 
// 3.年度線圖 & 月曆圖
const heatMapYear = ref(null);
const heatMapType = ref('stats.view');
const heatMapSelectDate = ref(null);

watch([heatMapType, heatMapYear], () => {
  heatMapSelectDate.value = null;
})

const lineChartArticles = computed(() => {
  return _.chain(articlesGroupByYear.value)
    .mapValues((list) => {
      return _.sumBy(list, heatMapType.value);
    })
    .toPairs()
    .value();
})

const heatMapArticles = computed(() => {
  return _.chain(articlesGroupByDate.value)
    .mapValues((list) => {
      return _.sumBy(list, heatMapType.value);
    })
    .toPairs()
    .value()
})

// 加總數據
const totalStats = computed(() => {
  let articlesStats = (heatMapYear.value ? articlesGroupByYear.value[heatMapYear.value] : articles.value).map((data) => data.stats);
  return _.mergeWith({}, ...articlesStats, (currentVal, sourceVal) => (currentVal || 0) + sourceVal)
});

// line chart 互動
const setYear = (year) => {
  heatMapYear.value = year || null;
}

const clickCalndar = (data) => {
  heatMapSelectDate.value = data[0];
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

  <h2>排行榜</h2>
  <fieldset>
    <legend>控制項</legend>
    數據:
    <select v-model="currentType">
      <option value="view">view</option>
      <option value="gp">gp</option>
    </select>
    是否排序
    <input type="checkbox" v-model="currentIsSorted">
  </fieldset>

  <div class="grid">
    <div class="col-6_sm-12">
      <bar-chart :dataset="formattedArticles" :data-type="currentType" @chart-click="clickBarchart"></bar-chart>
    </div>
    <div class="col-6_sm-12">
      <article-card :article="selectArticle" v-if="selectedId !== ''"></article-card>
      <div v-if="selectedId !== ''">{{ currentType }} 約高於 {{ selectArticlePercentage }} % 的文章</div>
      <details>
        <summary>數據</summary>
        <div class="template">
          <ul>
            <li v-for="article in formattedArticles" :key="article.id">
              <div>
                <a target="_blank" :title="article.createAt"
                  :href="`https://home.gamer.com.tw/artwork.php?sn=${article.id}`">{{ article.title }}</a>
              </div>
              <div style="white-space: nowrap;padding-left: 10px;">{{ article[currentType] }}</div>
            </li>
          </ul>
        </div>
      </details>
    </div>
  </div>

  <h2>年度線圖</h2>
  <line-chart :dataset="lineChartArticles" @click-data="setYear"></line-chart>
  <fieldset>
    <legend>控制項</legend>
    年度:
    <select v-model="heatMapYear">
      <option :value="null">全部</option>
      <option :value="y" v-for="y in years" :key="y">{{ y }}</option>
    </select>
    數據:
    <select v-model="heatMapType">
      <option value="stats.view">view</option>
      <option value="stats.gp">gp</option>
    </select>
  </fieldset>
  <p>共 {{ heatMapYear ? articlesGroupByYear[heatMapYear].length : articles.length }} 篇文章
    、{{ thousandFormat(totalStats['view']) }} 觀看數
    、{{ thousandFormat(totalStats['gp']) }} GP
    、{{ thousandFormat(totalStats['coin']) }} 巴幣
  </p>
  <div class="grid">
    <div class="col-7_lg-12" style="position: relative;">
      <div style="position: sticky; top: 0;">
        <heat-map
          v-if="heatMapYear"
          :dataset="heatMapArticles"
          :time="heatMapYear"
          :dataType="heatMapType"
          @chartClick="clickCalndar">
        </heat-map>
      </div>
    </div>
    <div class="col-5_lg-12">
      <h3>{{ heatMapSelectDate }}</h3>
      <ul>
        <li v-for="article in articlesGroupByYear[heatMapYear]" :key="article.id">
          <article-card :article="article" :class="{'is-active': article.createAt === heatMapSelectDate}"></article-card>
        </li>
      </ul>
    </div>
  </div>

</template>
