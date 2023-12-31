<script setup>
import { ref, reactive, computed } from "vue";
import { storeToRefs } from "pinia";
import _ from "lodash";
import { thousandFormat } from "../helper/utils";
import { useArticlesStore } from "../store";

const articleStore = useArticlesStore();
const { articles } = storeToRefs(articleStore);

// 條件過濾
const filter = ref('');
const filtedArticles = computed(() => {
    return filter.value === ''
        ? articles.value
        : articles.value.filter((article) => article.title.includes(filter.value));
});

const bucketGroup = reactive({});

const bucketName = ref('');
const bucket = ref([]);

function createGroup() {
    if (bucketName.value === '' || bucket.value.length === 0) return;
    bucketGroup[bucketName.value] = bucket.value;
    bucketName.value = '';
    bucket.value = [];
}

function deleteGroup(name) {
    delete bucketGroup[name];
}

// 只存取 ID
function idsToArticles(ids) {
    return ids.map((id) => articles.value.find((article) => article.id === id));
}
const articleIds = computed(() => {
    return filtedArticles.value.map((article) => article.id);
})
const remainingArticles = computed(() => {
    const ids = _.pullAll(articleIds.value, Object.values(bucketGroup).flat());
    return idsToArticles(ids);
});

</script>

<template>
    <div class="grid">
        <div class="col-6_sm-12">
            <input type="text" placeholder="搜尋" v-model="filter">
            <div class="template">
                <ul>
                    <li v-for="article in remainingArticles">
                        <label :for="article.id">
                            <input type="checkbox" :id="article.id" v-model="bucket" :value="article.id">
                            {{ article.title }}
                        </label>
                    </li>
                </ul>
            </div>
            <input type="text" placeholder="組別名" v-model="bucketName">
            <button @click="createGroup">建立</button>
        </div>
        <div class="col-6_sm-12">
            <ul>
                <li v-for="name in Object.keys(bucketGroup)" :id="name">
                    <details>
                        <summary>{{ name }} <button @click="deleteGroup(name)">X</button></summary>
                        <div class="template">
                            <ol>
                                <li v-for="article in idsToArticles(bucketGroup[name])" :id="article.id">{{ article.title }}</li>
                            </ol>
                        </div>
                    </details>
                </li>
            </ul>
        </div>
    </div>
</template>
