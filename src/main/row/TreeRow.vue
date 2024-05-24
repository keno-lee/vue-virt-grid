<template>
  <tr ref="itemRefEl" class="vue-virt-grid-tr-group">
    <td :colspan="flattedColumns.length">
      <div class="group" :style="`width: 100%; height: ${config.rowHeight}px;`">
        <Placement
          v-for="item in props.row.level"
          :key="item"
          :class="item === props.row.level ? 'last' : ''"
        ></Placement>
        <div class="test">
          <div class="test1"></div>
        </div>
        <div>level {{ props.row.level }} 分组-自定义样式</div>
      </div>
    </td>
  </tr>
</template>
<script setup lang="ts">
import { inject } from 'vue';
import type { GridStore } from '@/src/store';
// import { useObserverItem } from 'vue-virt-list';
import { useObserverItem } from '../../virt';
import { type ListItem } from '@/src/type';

import Placement from '../Placement.vue';

const gridStore = inject('gridStore') as GridStore;
const { config } = gridStore.watchData;
const { flattedColumns } = gridStore;

const props = withDefaults(
  defineProps<{
    row: ListItem;
    resizeObserver: ResizeObserver | null;
  }>(),
  {
    resizeObserver: null,
  },
);

const { itemRefEl } = useObserverItem({ resizeObserver: props.resizeObserver as ResizeObserver });
console.log('itemRefEl', itemRefEl);
</script>
<style lang="scss">
.vue-virt-grid-tr-group {
  // height: 40px;
  background-color: cyan;
  td {
    // border-bottom: 1px solid var(--color-border);
  }

  .group {
    display: flex;
    align-items: center;
  }

  .test {
    width: 20px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-end;

    .test1 {
      width: 1px;
      height: 50%;
      border-right: 1px dashed green;
    }
  }
}
</style>
