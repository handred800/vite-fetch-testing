<script setup>
import _ from 'lodash';
import { computed } from 'vue';
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router"
import { useArticlesStore } from '../store';
import { event as gaEvent } from 'vue-gtag'

const router = useRouter();
const useArticle = useArticlesStore();
const { loadData } = useArticle;
const { fetchLength, fetchingLength, isFetching, isLoading, userId } = storeToRefs(useArticle);

const onSubmit = async () => {
  gaEvent('搜尋使用者', {
    event_category: 'form_submit',
    value: userId.value,
  });
  await loadData();
  router.push('/dashboard');
}

const limitCount = computed(() => import.meta.env.VITE_API_LIMIT_COUNT * 10);

const fetchingPercent = computed(() => (_.round(fetchingLength.value / fetchLength.value, 2) * 100))

</script>

<template>
  <h1>巴哈姆派+</h1>
  <form @submit.prevent="onSubmit">
    <input type="text" v-model="userId" :readonly="isLoading" />
    <button type="submit" :disabled="isLoading">
      {{ isLoading ? "loading..." : "GO!" }}
    </button>
  </form>

  <div v-if="isLoading">
    <span v-if="isFetching">約{{ fetchLength * 10 }}篇文章，撈取中...</span>
    <div class="progress-bar">
      <div class="bar" :style="{ width: `${fetchingPercent}%` }"></div>
    </div>
  </div>
  <div v-else>目前至多撈取前{{ limitCount }}篇文章</div>
</template>

<style scoped>
.progress-bar {
  background-color: lightgray;
  max-width: 500px;
  width: 100%;
}

.progress-bar .bar {
  display: block;
  height: 20px;
  width: 0;
  background-color: var(--primary);
  transition: .3s ease-in-out;
}
</style>