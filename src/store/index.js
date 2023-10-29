import _ from "lodash";
import { defineStore } from "pinia";

const urlsCreator = (id, length) => {
  const url = `${import.meta.env.VITE_API_ENDPOINT}/page?owner=${id}&page=`;

  let count = 0;
  return Array.from({ length }, () => {
    count++;
    return `${url}${count}`;
  });
};

export const useArticlesStore = defineStore("articles", {
  state: () => {
    return {
      fetchLength: 0,
      fetchingLength: 0,
      isFetching: false,
      isLoading: false,
      userId: "handred800",
      articles: [],
    };
  },
  getters: {
    years() {
      return _.chain(this.articles).map(({ createAt }) => createAt.slice(0, 4)).uniq().value();
    },
    articlesGroupByTime() {
      return _.groupBy(this.articles, 'createAt');
    },
  },
  actions: {
    async loadData() {
      this.isLoading = true;

      this.articles = this.loadStorage() || (await this.fetchData());
      sessionStorage.setItem("articles", JSON.stringify(this.articles));

      this.isLoading = false;
    },
    loadStorage() {
      const data = sessionStorage.getItem("articles");
      return data ? JSON.parse(data) : null;
    },
    async fetchData() {
      this.articles.splice(0);

      const store = this;
      const apiLimitCount = import.meta.env.PROD ? Number(import.meta.env.VITE_API_LIMIT_COUNT) : 100;
      const { data } = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/page?owner=${this.userId}`).then(res => res.json())
      const length = data.total_page >= apiLimitCount ? apiLimitCount : data.total_page;
      this.fetchLength = length;
      this.isFetching = true;

      const urls = urlsCreator(this.userId, length);

      const queueManager = (() => {
        let count = 0;
        let fetchingCount = 0;
      
        function formatter(data) {
          const list = data.list.map(
            ({ csn, title, coverpic, ctime, visit, gp, bahacoin, flagicon }) => ({
              id: csn,
              title,
              image: coverpic,
              createAt: ctime.split(' ')[0],
              stats: {
                view: Number(visit),
                gp: Number(gp),
                coin: Number(bahacoin.replaceAll(",", "")),
              },
            })
          );
          console.log(list);
          fetchingCount += 1;
          store.fetchingLength = fetchingCount;
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
                  resolve(formatter(data));
                })
                .catch((err) => {
                  alert(err);
                  window.location.reload()
                });
            }, 1000 * count);
          });
        };
      })();

      const requests = urls.map((url) => queueManager(url));

      return Promise.all(requests).then((data) => {
        console.log("all fetches has returned");
        this.isFetching = false;
        return _.chain(data).flatten().uniqBy('id').value();
      });
    },
    clearData() {
      sessionStorage.clear();
    }
  },
});
