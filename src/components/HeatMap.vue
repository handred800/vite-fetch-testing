<script setup>
import _ from "lodash";
import { ref, computed, onMounted, toRef } from "vue";
import { useCalendarMap } from '../composable/useChart';

const props = defineProps({
  dataset: {
    type: Array,
    required: true,
  },
  dataType: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['chartClick']);

const dataRange = computed(() => {
  const values = _.map(props.dataset, (item) => item[1]);
  return [_.min(values), _.max(values)];
});

const $container = ref(null);

onMounted(() => {
  // 初始化 chart
  const { chart, resize } = useCalendarMap($container, toRef(props, 'dataset'), dataRange, toRef(props, 'time'));
  window.addEventListener("resize", () => {
    resize();
  });
  
  chart.on('click', (e) => {
    if (e.componentType !== 'series') return; 
    emit('chartClick', e.data);
  })
})

</script>
<template>
  <div ref="$container" class="container"></div>
</template>
<style scoped>
.container {
  width: 100%;
  height: 250px;
}
</style>