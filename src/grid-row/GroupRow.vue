<template>
  <tr ref="itemRefEl" class="vue-virt-grid-tr vue-virt-grid-tr--group">
    <td class="vue-virt-grid-td vue-virt-grid-td--group" :colspan="flattedColumns.length">
      <div class="vue-virt-grid-cell" :style="`height: ${config.rowHeight}px;`">
        <Placement
          v-for="item in props.row.level"
          :key="item"
          :class="item === props.row.level ? 'last' : ''"
        ></Placement>
        <div
          :class="['group-icon', !foldMap[props.row.id] && 'group-icon--expand']"
          @click.stop="gridStore.toggleFold(row.id)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M8.58816 5.15502L16.888 11.1913C17.4371 11.5906 17.4371 12.4094 16.888 12.8087L8.58816 18.845C7.92719 19.3257 6.99999 18.8535 6.99999 18.0362L6.99999 5.96376C6.99999 5.14647 7.92719 4.67432 8.58816 5.15502Z"
              fill="#6B7075"
            />
          </svg>
        </div>

        <div>分组-{{ props.row.name }}</div>
      </div>
    </td>
  </tr>
</template>
<script setup lang="ts">
import { inject } from 'vue';
import type { GridStore } from '@/src/store';
import { useObserverItem } from 'vue-virt-list';
import { type ListItem } from '@/src/type';
import Placement from '@/src/components/Placement.vue';

const gridStore = inject('gridStore') as GridStore;
const { foldMap, config } = gridStore.watchData;
const { flattedColumns } = gridStore;

const props = withDefaults(
  defineProps<{
    row: ListItem;
    resizeObserver: ResizeObserver | null;
    rowIndex: number;
  }>(),
  {
    resizeObserver: null,
    rowIndex: 0,
  },
);

console.log(111, foldMap[props.row.id]);

const { itemRefEl } = useObserverItem({ resizeObserver: props.resizeObserver as ResizeObserver });
// console.log('itemRefEl', itemRefEl);
</script>
