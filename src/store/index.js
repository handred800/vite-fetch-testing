import _ from 'lodash';
import { defineStore } from 'pinia'


const urlsCreator = (id, length) => {
  const url = `${import.meta.env.VITE_API_ENDPOINT}/page?owner=${id}&page=`;

  let count = 0;
  return Array.from({ length }, () => {
    count++;
    return `${url}${count}`;
  });
};

const queueManager = (() => {
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
    return list;
  }

  // 使用 queueManager 回傳
  return (url) => {
    return new Promise((resolve) => {
      count += 1;
      setTimeout(() => {
        fetch(url)
          .then((res) => res.json())
          .then(({ data }) => {
            resolve(queueChecker(data));
          })
          .catch((err) => {
            console.log(err);
          });
      }, 1000 * count);
    });
  };
})();

export const useArticlesStore = defineStore('articles', {
  state: () => {
    return {
      isLoading: false,
      userId: 'handred800',
      articles: [],
    }
  },
  actions: {
    async loadData () {
      this.isLoading = true;

      this.articles = this.loadStorage() || await this.fetchData();
      sessionStorage.setItem('articles', JSON.stringify(this.articles));

      this.isLoading = false;
    },
    loadStorage() {
      const data = sessionStorage.getItem('articles');
      return data ? JSON.parse(data) : null;
    },
    async fetchData() {
      this.articles.splice(0);
      
      const urls = urlsCreator(this.userId, 5);
      const requests = urls.map((url) => queueManager(url));

      return Promise.all(requests).then((data) => {
        console.log("all fetches has sended");
        return _.flatMap(data);
      });
    },
  }
})