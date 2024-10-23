<template>
  <div class="vtg-cell vtg-cell__text">
    {{ column.field ? row[column.field] : '' }}
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
