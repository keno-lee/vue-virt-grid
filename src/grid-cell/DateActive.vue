<template>
  <div class="vue-virt-grid-popper-cell vue-virt-grid-cell__date">
    <div class="vue-virt-grid-cell__date-content">2024/09/25</div>
    <div class="vue-virt-grid-cell__date-icon">
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

    <!-- dropdown -->
    <div class="vue-virt-grid-cell__date-dropdown">3333</div>
  </div>
</template>
<script setup lang="tsx"></script>

<style lang="scss">
.vue-virt-grid-cell__date {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #fff;
  position: relative;
  z-index: 99;
  pointer-events: all;

  .vue-virt-grid-cell__date-content {
    flex: 1;
  }

  .vue-virt-grid-cell__date-icon {
    width: 16px;
    height: 16px;
    svg {
      width: 100%;
      height: 100%;
      fill: red;
    }
  }

  .vue-virt-grid-cell__date-dropdown {
    position: absolute;
    top: 44px;
    left: 0;
    width: 100%;
    height: 200px;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 8px 16px rgba(31, 35, 41, 0.1);
  }
}
</style>
