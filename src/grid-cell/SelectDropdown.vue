<template>
  <div class="vue-virt-grid-popper-cell vue-virt-grid-cell__select-dropdown">select</div>
</template>
<script setup lang="tsx">
import { type PropType } from 'vue';
import { type TdData } from '@/src/type';

const props = defineProps({
  tdData: {
    type: Object as PropType<TdData>,
    default: () => ({}),
  },
});
</script>

<style lang="scss">
.vue-virt-grid-cell__select-dropdown {
  // position: absolute;
  // top: 44px;
  // left: 0;
  // width: 300px;
  // height: 200px;
  // border-radius: 4px;
  // background-color: #fff;
  // box-shadow: 0 8px 16px rgba(31, 35, 41, 0.1);
  // border: 1px solid #ccc;
  width: 200px;
  height: 300px;
  background-color: cyan;
  box-shadow: 0 8px 16px rgba(31, 35, 41, 0.1);
}
</style>
