<template>
  <div class="vue-virt-grid-cell__select-dropdown">
    <!-- <div class="search">
      <input type="text" placeholder="select" />
    </div> -->

    <div class="divider"></div>

    <div class="options">
      <div class="options-item">哈哈哈</div>
      <div class="options-item">嘻嘻嘻</div>
      <div class="options-item">恩恩嗯</div>
    </div>
  </div>
</template>
<script setup lang="tsx">
import { type PropType } from 'vue';
import { type Column, type ListItem, type TdData } from '@/src/type';

const props = defineProps({
  column: {
    type: Object as PropType<Column>,
    default: () => ({}),
  },
  row: {
    type: Object as PropType<ListItem>,
    default: () => ({}),
  },
  tdData: {
    type: Object as PropType<any>,
    default: () => ({}),
  },
});
</script>

<style lang="scss">
.vue-virt-grid-cell__select-dropdown {
  width: 220px;
  max-height: 300px;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 8px 16px rgba(31, 35, 41, 0.1);
  border: 1px solid #dee0e3;

  .options {
    padding: 12px 4px;

    .options-item {
      width: 100%;
      height: 32px;
      padding: 0 12px;
      display: flex;
      align-items: center;
      cursor: pointer;
      border-radius: 4px;

      &:hover {
        background-color: #f5f5f5;
      }
    }
  }

  // .search {
  //   height: 36px;

  //   input {
  //     width: 100%;
  //     height: 100%;
  //     outline: none;
  //     border: none;
  //     background-color: #fff;
  //   }
  // }
}
</style>
