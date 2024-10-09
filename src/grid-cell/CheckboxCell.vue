<template>
  <div class="vue-virt-grid-cell vue-virt-grid-cell__checkbox">
    <input
      type="checkbox"
      :checked="watchData.checkboxRows.has(row)"
      @change="(e) => changeValue(e)"
    />
    <span class="vue-virt-grid-cell__checkbox-filed" v-if="column.field">{{
      column.field ? row[column.field] : ''
    }}</span>
  </div>
</template>
<script setup lang="ts">
import { computed, inject } from 'vue';
import type { ListItem, ColumnItem } from '@/src/type';
import { useGridStore } from '@/src/store';

const gridStore = useGridStore();
const { watchData } = gridStore;

const props = defineProps<{
  rowIndex: number;
  row: ListItem;
  column: ColumnItem;
}>();

// const isChecked = computed(() => {
//   console.log(watchData.checkboxRows.has(props.row));
//   return watchData.checkboxRows.has(props.row);
// });
const changeValue = (e: Event) => {
  if ((e?.target as HTMLInputElement)?.checked) {
    gridStore.addCheckboxRows(props.row);
  } else {
    gridStore.deleteCheckboxRows(props.row);
  }
};
</script>
