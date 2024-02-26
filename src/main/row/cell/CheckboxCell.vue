<template>
  <div class="kita-grid-cell kita-grid-cell__checkbox">
    <input type="checkbox" />
  </div>
</template>
<script setup lang="ts">
import type { ListItem, ColumnItem } from '@/src/type';
defineProps<{
  rowIndex: number;
  row: ListItem;
  column: ColumnItem;
}>();
</script>
