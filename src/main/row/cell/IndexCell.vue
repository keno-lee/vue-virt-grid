<template>
  <div class="kita-grid-cell kita-grid-cell__index">
    {{ indexValue }}
  </div>
</template>
<script setup lang="ts">
import type { ListItem, ColumnItem } from '@/src/type';
const props = defineProps<{
  rowIndex: number;
  row: ListItem;
  column: ColumnItem;
}>();
const indexValue = props.column?.index?.(props.rowIndex) ?? props.rowIndex + 1;
</script>
