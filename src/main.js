import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';
import VueGtag from "vue-gtag";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(VueGtag, {
    config: {
        id: import.meta.env.VITE_GTAG,
    }
});
app.mount('#app');
