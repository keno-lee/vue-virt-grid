<template>
  <div>test</div>
</template>
<script setup lang="ts">
import { type Column, type ListItem } from 'kita-grid';
const props =
  defineProps<{
    row: ListItem;
    column: Column;
  }>();
</script>
