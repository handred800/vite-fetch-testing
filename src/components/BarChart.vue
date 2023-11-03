<script setup>
import _ from "lodash";
import { ref, computed, onMounted } from "vue";
import { useBar } from "../composable/useChart";

const emit = defineEmits(['chartClick']);

const props = defineProps({
  dataset: {
    type: Array,
    required: true,
  },
  dataType: String,
});

const $container = ref(null);

const formatDataset = computed(() => {
  const keys = _.keys(props.dataset[0]);
  const values = _.map(props.dataset, (data) => _.values(data));
  return [keys, ...values];
});

const dataRange = computed(() => {
  const values = _.map(props.dataset, props.dataType);
  return [_.min(values), _.max(values), _.mean(values)];
});

onMounted(() => {
  // 初始化 chart
  const { chart, resize } = useBar($container, formatDataset, dataRange);
  window.addEventListener("resize", () => {
    resize();
  });
  chart.on('click', (e) => {
    if (e.componentType !== 'series') return; 
    emit('chartClick', e.data);
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
