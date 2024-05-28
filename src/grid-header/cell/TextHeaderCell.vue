<template>
  <div class="vue-virt-grid-th-cell">
    {{ column.title }}
  </div>
</template>
<script setup lang="ts">
import type { ColumnItem } from '@/src/type';
defineProps<{
  column: ColumnItem;
}>();
</script>
<style></style>
