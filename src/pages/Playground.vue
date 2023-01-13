<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import _ from "lodash";
import { useArticlesStore } from "../store";
import BarChart from "../components/BarChart.vue";

const articleStore = useArticlesStore();
const { articles } = storeToRefs(articleStore);

let dataType = ref("view");
const dataset = computed(() =>
  _.map(articles.value, (article) => ({
    title: article.title,
    [dataType.value]: article.stats[dataType.value],
  }))
);
</script>

<template>
  <select name="" id="" v-model="dataType">
    <option value="view">觀看數</option>
    <option value="gp">GP</option>
    <option value="coin">巴幣</option>
  </select>
  <bar-chart :dataset="dataset" :data-type="dataType"></bar-chart>
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
