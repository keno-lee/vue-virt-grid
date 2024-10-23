<template>
  <div class="vtg-cell vtg-cell__person">
    <div class="vtg-cell__person-item">
      <div class="vtg-cell__person-avatar"></div>
      <div class="vtg-cell__person-name">Keno</div>
    </div>
    <div class="vtg-cell__person-item">
      <div class="vtg-cell__person-avatar"></div>
      <div class="vtg-cell__person-name">Keno</div>
    </div>
  </div>
</template>
<script setup lang="tsx"></script>

<style lang="scss">
.vtg-cell__person {
  display: flex;
  align-items: center;

  .vtg-cell__person-item {
    display: flex;
    align-items: center;
    // flex-wrap: nowrap;
    white-space: nowrap;

    & + .vtg-cell__person-item {
      margin-left: 6px;
    }

    .vtg-cell__person-avatar {
      width: 20px;
      height: 20px;
      background-color: #ccc;
      border-radius: 50%;
      margin-right: 6px;
    }

    .vtg-cell__person-name {
      flex: 1;
    }
  }
}
</style>
