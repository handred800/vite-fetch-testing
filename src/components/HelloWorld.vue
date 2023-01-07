<script setup>
import { ref, reactive } from "vue";

let id = ref("handred800");
let resultList = reactive([]);
let isLoading = ref(false);

const urlsCreator = (length) => {
  const url = `${import.meta.env.VITE_API_ENDPOINT}/page?owner=${
    id.value
  }&page=`;

  let count = 0;
  return Array.from({ length }, () => {
    count++;
    return `${url}${count}`;
  });
};

const gm = (() => {
  let count = 0;

  function queueChecker(data) {
    const list = data.list.map(
      ({ csn, title, coverpic, ctime, visit, gp, bahacoin, flagicon }) => ({
        id: csn,
        title,
        image: coverpic,
        createAt: ctime,
        stats: {
          view: Number(visit),
          gp: Number(gp),
          coin: Number(bahacoin.replaceAll(",", "")),
        },
      })
    );
    console.log(list);
    resultList.push(...list);
  }

  // 使用 gm 回傳
  return (url) => {
    return new Promise((resolve) => {
      count += 1;
      setTimeout(() => {
        fetch(url)
          .then((res) => res.json())
          .then(({ data }) => {
            queueChecker(data);
            resolve();
          })
          .catch((err) => {
            console.log(err);
          });
      }, 1000 * count);
    });
  };
})();

const fetchData = () => {
  isLoading.value = true;
  resultList.splice(0);
  const urls = urlsCreator(5);
  const requests = urls.map((url) => gm(url));
  Promise.all(requests).then(() => {
    console.log("all fetches has sended");
    isLoading.value = false;
  });
};
</script>

<template>
  <form @submit.prevent="fetchData">
    <input type="text" v-model="id" :readonly="isLoading" />
    <button type="submit" :disabled="isLoading">
      {{ isLoading ? "loading..." : "GO!" }}
    </button>
  </form>
  <a
    v-for="res in resultList"
    :href="`https://home.gamer.com.tw/artwork.php?sn=${res.id}`"
    class="card"
    target="_blank"
    :key="res.id"
  >
    <h4>{{ res.title }}</h4>
    <p>{{ res.createAt }}</p>
    <div style="display: flex">
      <img :src="res.image" alt="" style="max-width: 100px" />
      <ul>
        <li>view：{{ res.stats.view }}</li>
        <li>gp：{{ res.stats.gp }}</li>
        <li>coin：{{ res.stats.coin }}</li>
      </ul>
    </div>

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