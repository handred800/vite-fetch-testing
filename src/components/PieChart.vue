<script setup>
import { ref, onMounted, toRef } from 'vue';
import { usePie } from '../composable/useChart';

const props = defineProps({
    dataset: {
        type: Array,
        required: true,
    }
})

const emit = defineEmits(['chartClick']);

const $container = ref(null);

onMounted(() => {
    const { chart, resize } = usePie($container, toRef(props, 'dataset'))
    window.addEventListener('resize', () => {
        resize();
    })

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
  height: 350px;
}
</style>