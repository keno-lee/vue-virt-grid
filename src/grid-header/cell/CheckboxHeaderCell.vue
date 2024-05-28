<template>
  <div class="vue-virt-grid-th-cell vue-virt-grid-th-cell__checkbox">
    <input
      type="checkbox"
      :indeterminate="isIndeterminate"
      :checked="fullChecked"
      @change="(e) => changeValue(e)"
    />
    <span class="vue-virt-grid-th-cell__checkbox-title" v-if="column.title">{{
      column.title
    }}</span>
  </div>
</template>
<script setup lang="ts">
import { computed, inject, watch } from 'vue';
import type { ColumnItem } from '@/src/type';
import type { GridStore } from '@/src/store';

const gridStore = inject('gridStore') as GridStore;
const { watchData, virtualListProps } = gridStore;

defineProps<{
  column: ColumnItem;
}>();

const fullChecked = computed(
  () =>
    watchData.checkboxRows.size === virtualListProps.list.length &&
    virtualListProps.list.length !== 0,
);
const isIndeterminate = computed(() => watchData.checkboxRows.size > 0 && !fullChecked.value);

const changeValue = (e: Event) => {
  if ((e?.target as HTMLInputElement)?.checked) {
    gridStore.addAllCheckboxRows();
  } else {
    gridStore.clearCheckboxRows();
  }
};
</script>
<style></style>
