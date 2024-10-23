<template>
  <div class="vtg-cell vtg-cell__expand" @click="gridStore.toggleExpand(row.id)">
    <div :class="['row-expand-icon', watchData.expandMap[row.id] && 'row-expand-icon--expand']">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M6.79289 22.2071C6.40237 21.8166 6.40237 21.1834 6.79289 20.7929L15.0858 12.5L6.79289 4.20711C6.40237 3.81658 6.40237 3.18342 6.79289 2.79289C7.18342 2.40237 7.81658 2.40237 8.20711 2.79289L17.2071 11.7929C17.5976 12.1834 17.5976 12.8166 17.2071 13.2071L8.20711 22.2071C7.81658 22.5976 7.18342 22.5976 6.79289 22.2071Z"
          fill="#6B7075"
        />
      </svg>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useGridStore } from '@/src/store';
import type { ListItem, ColumnItem } from '@/src/type';

const gridStore = useGridStore();

const { watchData } = gridStore;

defineProps<{
  rowIndex: number;
  row: ListItem;
  column: ColumnItem;
}>();
</script>
