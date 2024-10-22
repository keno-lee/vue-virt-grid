<template>
  <div class="vue-virt-grid-cell__date-dropdown">时间选择器</div>
</template>
<script setup lang="tsx">
import { type PropType } from 'vue';
import { type Column, type ListItem, type TdData } from '@/src/type';

const props = defineProps({
  column: {
    type: Object as PropType<Column>,
    default: () => ({}),
  },
  row: {
    type: Object as PropType<ListItem>,
    default: () => ({}),
  },
  tdData: {
    type: Object as PropType<any>,
    default: () => ({}),
  },
});
</script>

<style lang="scss">
.vue-virt-grid-cell__date-dropdown {
  width: 220px;
  height: 300px;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 8px 16px rgba(31, 35, 41, 0.1);
  border: 1px solid #dee0e3;
}
</style>
