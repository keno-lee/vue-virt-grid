<template>
  <div class="vue-virt-grid-cell vue-virt-grid-cell__checkbox">
    <input type="radio" :checked="watchData.radioRow?.id === row.id" @change="changeValue" />
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

const changeValue = () => {
  gridStore.addRadioRow(props.row);
};
</script>
