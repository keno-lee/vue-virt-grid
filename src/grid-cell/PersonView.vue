<template>
  <div class="vue-virt-grid-cell vue-virt-grid-cell__person">
    <div class="vue-virt-grid-cell__person-item">
      <div class="vue-virt-grid-cell__person-avatar"></div>
      <div class="vue-virt-grid-cell__person-name">Keno</div>
    </div>
    <div class="vue-virt-grid-cell__person-item">
      <div class="vue-virt-grid-cell__person-avatar"></div>
      <div class="vue-virt-grid-cell__person-name">Keno</div>
    </div>
  </div>
</template>
<script setup lang="tsx"></script>

<style lang="scss">
.vue-virt-grid-cell__person {
  display: flex;
  align-items: center;

  .vue-virt-grid-cell__person-item {
    display: flex;
    align-items: center;
    // flex-wrap: nowrap;
    white-space: nowrap;

    & + .vue-virt-grid-cell__person-item {
      margin-left: 6px;
    }

    .vue-virt-grid-cell__person-avatar {
      width: 20px;
      height: 20px;
      background-color: #ccc;
      border-radius: 50%;
      margin-right: 6px;
    }

    .vue-virt-grid-cell__person-name {
      flex: 1;
    }
  }
}
</style>
