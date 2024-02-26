<template>
  <tr ref="itemRefEl" class="kita-grid-tr">
    <td class="kita-grid-td kita-grid-td--expand" :colspan="flattedColumns.length">
      <div class="kita-grid-cell">
        <component :is="getRenderRow(row)"></component>
      </div>
    </td>
  </tr>
</template>
<script setup lang="ts">
import { inject, computed } from 'vue';
import type { GridStore } from '@/src/store';
import { useObserverItem } from 'vue-virt-list';
import { type ListItem } from '@/src/type';

const gridStore = inject('gridStore') as GridStore;
const { flattedColumns } = gridStore;

const expandCol = computed(() => flattedColumns.find((c) => c.type === 'expand'));

const props = withDefaults(
  defineProps<{
    resizeObserver: ResizeObserver | null;
    rowIndex: number;
    row: ListItem;
  }>(),
  {
    resizeObserver: null,
  },
);

const { itemRefEl } = useObserverItem({ resizeObserver: props.resizeObserver as ResizeObserver });
const getRenderRow = (row: ListItem) => {
  return expandCol.value?.bodyRender?.(expandCol.value, row);
};
</script>
