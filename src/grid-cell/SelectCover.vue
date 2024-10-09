<template>
  <div class="vue-virt-grid-popper-cell vue-virt-grid-cell__select-cover">
    <div class="vue-virt-grid-cell__select-cover-content">222</div>
    <div class="vue-virt-grid-cell__select-cover-icon">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.5632 7.72544L10.539 13.2587C10.2728 13.6247 9.72696 13.6247 9.46073 13.2587L5.43658 7.72544C5.11611 7.28479 5.43088 6.66666 5.97573 6.66666L14.024 6.66666C14.5689 6.66666 14.8837 7.28479 14.5632 7.72544Z"
          fill="var(--virt-tree-color-icon)"
        ></path>
      </svg>
    </div>
  </div>
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
.vue-virt-grid-cell__select-cover {
  width: 100%;
  height: 100%;
  background-color: cyan;
  position: relative;
  z-index: 99;
  user-select: none;
  display: flex;

  .vue-virt-grid-cell__select-content {
    flex: 1;
  }

  .vue-virt-grid-cell__select-icon {
    width: 16px;
    height: 16px;
    svg {
      width: 100%;
      height: 100%;
      fill: red;
    }
  }
}
</style>
