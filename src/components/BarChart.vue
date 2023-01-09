<script setup>
import { ref, computed, defineProps, onMounted } from 'vue';
import usePie from '../composable/usePie';

// const props = defineProps({
//   dataset: {
//     type: Array,
//     required: true,
//   }
// })

const $container = ref(null);

onMounted(() => {
  const { setDataset, resize } = usePie($container.value);

  // 初始化 chart
  setDataset([
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar'
    }
  ])
  window.addEventListener('resize', () => {
    resize()
  })

});

const series = computed(() => [
  {
    data: props.dataset
  }
]);


</script>
<template>
  <div ref="$container" class="container"></div>
</template>
<style scoped>
.container {
  width: 100%;
  height: 500px;
}
</style>