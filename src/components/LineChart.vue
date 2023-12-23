<script setup>
import _ from "lodash";
import { ref, computed, onMounted } from "vue";
import { useLine } from "../composable/useChart";


const props = defineProps({
  dataset: {
    type: Array,
    required: true,
  }
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
  // chart.on('click', (e) => { console.log(e.data); emit('clickData', e.data[0]) })
  chart.on('selectchanged', (e) => {
    if (e.selected.length === 0) {
      // 沒有選
      emit('clickData', '')
    } else {
      // dataIndex 為選中項目的序號
      // echart 有多選功能，所以是以陣列包裹(這邊只用到單選; [0]即可取到)
      const i = e.selected[0].dataIndex[0];
      emit('clickData', formatDataset.value[i + 1][0]);
    };
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
  height: 350px;
}

pre {
  white-space: pre-wrap;
  max-height: 300px;
  overflow-y: auto;
}
</style>
