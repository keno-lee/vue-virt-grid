<template>
  <div :class="cls"></div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
const props = withDefaults(
  defineProps<{ showLine: boolean; isLastPlacement: boolean; isLastChild: boolean }>(), {
  showLine: false,
  isLastPlacement: false,
  isLastChild: false
})

const cls = computed(() => ([
  'placement',
  props.showLine && 'placement--tree-line',
  props.showLine && props.isLastPlacement && 'placement--last-padding',
  props.showLine && props.isLastPlacement && props.isLastChild && 'placement--last-tree-node'
]))

</script>
