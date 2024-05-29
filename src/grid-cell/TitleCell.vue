<template>
  <div class="vue-virt-grid-cell vue-virt-grid-cell__title" :style="`width: ${column.width}px;`">
    <Placement
      v-for="item in row.level"
      :key="item"
      :show-line="showTreeLine && item > row.groupLevel!"
      :is-last-child="row.isLastChild"
      :is-last-placement="item === row.level"
    ></Placement>
    <div
      :class="[
        'tree-leading',
        showTreeLine ? 'tree-leading--tree-line' : 'tree-leading--tree-line-hide',
        (!row.level || row.level === row.groupLevel) && 'tree-leading--first-node',
      ]"
    >
      <template v-if="watchData.foldMap[row.id] !== undefined">
        <div
          :class="[
            'tree-leading-icon',
            !watchData.foldMap[props.row.id] && 'tree-leading-icon--expand',
          ]"
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
      </template>
    </div>
    <div class="content">
      <component v-if="customBody" :is="customBody"></component>
      <template v-else>
        {{ column.field ? row[column.field] : '' }}
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { inject, computed } from 'vue';
import type { GridStore } from '@/src/store';
import type { ListItem, ColumnItem } from '@/src/type';
import Placement from '@/src/components/Placement.vue';

const gridStore = inject('gridStore') as GridStore;
const { watchData } = gridStore;

const props = defineProps<{
  rowIndex: number;
  row: ListItem;
  column: ColumnItem;
}>();

const showTreeLine = computed(() => gridStore.getUIProps('showTreeLine'));

const customBody = computed(() => {
  return props.column?.bodyRender?.(props.column, props.row);
});
</script>
<style lang="scss">
.vue-virt-grid-cell__title {
  display: flex;
  align-items: center;
  // background-color: grey;
  width: 100%;
  height: 100%;
  // border-bottom: 1px solid var(--color-border);
  // border-right: 1px solid var(--color-border);

  .content {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    // border-bottom: 1px solid var(--color-border);
    // border-left: 1px solid var(--color-border);
  }
}
</style>
