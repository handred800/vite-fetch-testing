<script setup>
  import { ref, computed } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useArticlesStore } from '../store';
  import ArticleCard from '../components/ArticleCard.vue';

  const articleStore = useArticlesStore();
  const { articles } = storeToRefs(articleStore);

  const currentTotal = ref(50);

  const articlesIsShow = computed(() => articles.value.slice(1, currentTotal.value));

</script>

<template>
  <div class="grid grid-equalHeight">
    <div class="col-3_xs-12_sm-6_md-4" v-for="article in articlesIsShow">
      <article-card :article="article"></article-card>
    </div>
    <button v-if="currentTotal < articles.length" @click="currentTotal += 30">more</button>
  </div>
</template>
