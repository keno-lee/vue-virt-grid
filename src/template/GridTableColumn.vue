<template>
  {{ field }}
</template>
<script lang="ts" setup>
import type { VNode } from 'vue';
import type { Column, ListItem } from '@/src/type';

defineProps<Column>();

defineSlots<{
  header?: (data: { column: Column }) => VNode[];
  default?: (data: { row: ListItem; column: Column }) => VNode[];
}>();
</script>
<script lang="ts">
export default {
  name: 'GridTableColumn',
};
</script>
<style lang="scss" scoped></style>
