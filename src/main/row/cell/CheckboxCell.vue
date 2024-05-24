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
import { inject } from 'vue';
import type { ListItem, ColumnItem } from '@/src/type';
import type { GridStore } from '@/src/store';

const gridStore = inject('gridStore') as GridStore;
const { watchData } = gridStore;

const props = defineProps<{
  rowIndex: number;
  row: ListItem;
  column: ColumnItem;
}>();

const changeValue = (e: Event) => {
  if ((e?.target as HTMLInputElement)?.checked) {
    gridStore.addCheckboxRows(props.row);
  } else {
    gridStore.deleteCheckboxRows(props.row);
  }
};
</script>
