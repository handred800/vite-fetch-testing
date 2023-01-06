<script setup>
import { ref, reactive } from 'vue'

let id = ref('handred800');
let resultList = reactive([]);

const urlsCreator = (length) => {
  const url = `${import.meta.env.VITE_API_ENDPOINT}/page?owner=${id.value}&page=`;

  let count = 0;
  return Array.from({ length }, () => {
    count++;
    return `${url}${count}`;
  });
};

const gm = (() => {
  let count = 0;

  function queueChecker({ data }) {
    const list = data.list.map(({ csn, title, ctime }) => ({
      id: csn,
      title,
      createAt: ctime,
    }));
    console.log(list);
    resultList.push(...list);
  }

  return (url) => {
    count += 1;
    setTimeout(() => {
      return fetch(url)
        .then(res => res.json())
        .then(queueChecker);
    }, 1200 * count)
  }
})()

const fetchData = () => {
  resultList.splice(0);
  const urls = urlsCreator(5);
  console.log(urls);
  urls.forEach((url) => gm(url));
}

</script>

<template>
  <form @submit.prevent="fetchData">
    <input type="text" v-model="id">
    <button type="submit">查詢</button>
  </form>
  <a v-for="res in resultList" :href="`https://home.gamer.com.tw/artwork.php?sn=${res.id}`" class="card"
    target="_blank">
    <h4>{{ res.title }}</h4>
    <small>{{ res.createAt }}</small>
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
  box-shadow: 0 3px 5px rgba(0, 0, 0, .15);
  box-sizing: border-box;
  transition: .15s;
}
.card:hover {
  box-shadow: 0 3px 15px rgba(0, 0, 0, .15);
  transform: translateY(-2px);
}

pre {
  white-space: pre-line;
}
</style>