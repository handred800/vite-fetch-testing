<script setup>
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router"
import { useArticlesStore } from '../store';

const router = useRouter();
const useArticle = useArticlesStore();
const { loadData, fetchData } = useArticle;
const { isLoading, userId } = storeToRefs(useArticle);

const onSubmit = async() => {
    await loadData();
    router.push('/dashboard');
}

</script>

<template>
  <form @submit.prevent="onSubmit">
    <input type="text" v-model="userId" :readonly="isLoading" />
    <button type="submit" :disabled="isLoading">
      {{ isLoading ? "loading..." : "GO!" }}
    </button>
  </form>
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