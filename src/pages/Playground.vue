<script setup>
import { ref, reactive, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import _ from "lodash";
import { useArticlesStore } from "../store";
import PieChart from '../components/PieChart.vue';

const articleStore = useArticlesStore();
const { articles } = storeToRefs(articleStore);

const bucketGroup = reactive([]);

const bucketName = ref('');
const bucket = ref([]);

function selectToggle() {
    bucket.value = bucket.value.length === filtedArticleIds.value.length
        ? []
        : _.cloneDeep(filtedArticleIds.value);
}

function createGroup() {
    if (bucketName.value === '' || bucket.value.length === 0) return;
    bucketGroup.push({
        name: bucketName.value,
        ids: bucket.value,
    });
    
    bucketName.value = '';
    filter.value = '';
    bucket.value = [];
}
function deleteGroup(name) {
    const index = bucketGroup.findIndex((group) => group.name === name);
    bucketGroup.splice(index, 1);
}

// 只存取 ID
function idsToArticles(ids) {
    return ids.map((id) => articles.value.find((article) => article.id === id));
}

const othersIds = computed(() => {
    const usedIds = bucketGroup.map((group) => group.ids).flat();
    return _.pullAll(articles.value.map((article) => article.id), usedIds);
});

const othersArticles = computed(() => idsToArticles(othersIds.value));

// 條件過濾
const filter = ref('');
const filtedArticles = computed(() => {
    return filter.value === ''
        ? othersArticles.value
        : othersArticles.value.filter((article) => article.title.includes(filter.value));
});
const filtedArticleIds = computed(() => {
    return filtedArticles.value.map((article) => article.id);
})


const piechartDataset = computed(() => {
    const groupArticles = bucketGroup.map((group) => {
        return [group.name, idsToArticles(group.ids)]
    })

    const dataset = [['其他', othersArticles.value], ...groupArticles];

    return dataset.map((group) => {
        console.log(group);
        return [
            group[0],
            _.sum(group[1].map((article) => article.stats.view))
        ]
    });
})

// 搜尋時清空勾選
watch(filter, () => {bucket.value = []})

</script>

<template>
    <div class="grid">
        <div class="col-6_sm-12">
            <input type="text" placeholder="搜尋" v-model="filter">
            <button @click="selectToggle">全選({{ filtedArticleIds.length }})</button>
            <div class="template">
                <ul>
                    <li v-for="article in filtedArticles">
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
                <li v-for="group in bucketGroup" :id="group.name">
                    <details>
                        <summary>{{ group.name }} ({{ group.ids.length }}) <button @click="deleteGroup(group.name)">X</button></summary>
                        <div class="template">
                            <ol>
                                <li v-for="article in idsToArticles(group.ids)" :id="article.id">{{ article.title }}</li>
                            </ol>
                        </div>
                    </details>
                </li>
            </ul>
            <div v-if="bucketGroup.length > 0">
                <h2>觀看數</h2>
                <pie-chart :dataset="piechartDataset"></pie-chart>
            </div>
        </div>
    </div>
</template>
