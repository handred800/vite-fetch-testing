<script setup>
import _ from "lodash";
import { ref, computed, onMounted } from "vue";
import { useLine } from "../composable/useChart";


const props = defineProps({
  dataset: {
    type: Array,
    required: true,
  },
  dataType: String,
});

const emit = defineEmits(['clickData'])

const $container = ref(null);

const formatDataset = computed(() => {
  const keys = _.keys(props.dataset[0]);
  const values = _.map(props.dataset, (data) => _.values(data));
  return [keys, ...values];
});

onMounted(() => {
  // 初始化 chart
  const { chart, resize } = useLine($container, formatDataset);
  window.addEventListener("resize", () => {
    resize();
  });
  chart.on('click', (e) => {
    emit('clickData', e.data[0]);
  })
});
</script>
<template>
  <div ref="$container" class="container"></div>
  <!-- <details>
    <summary>dataset</summary>
    <pre>{{ props.dataset }}</pre>
  </details> -->
</template>
<style scoped>
.container {
  width: 100%;
  height: 600px;
}

pre {
  white-space: pre-wrap;
  max-height: 300px;
  overflow-y: auto;
}
</style>
