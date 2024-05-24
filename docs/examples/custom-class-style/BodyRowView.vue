<template>
  <div class="base-view">
    <div style="width: 100%; height: 600px; border: 2px solid var(--el-color-border)">
      <Grid
        :columns="columns"
        :list="list"
        :row-class-name="getRowClass"
        :row-style="getRowStyle"
      ></Grid>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Grid, type Column, type ListItem } from 'vue-virt-grid';

const generateColumns = (length = 10, prefix = 'column-', props?: any) =>
  Array.from({ length }).map((_, columnIndex) => ({
    ...props,
    field: `${prefix}${columnIndex}`,
    title: `Column ${columnIndex}`,
    width: 200,
  }));

const generateList = (columns: ReturnType<typeof generateColumns>, length = 200, prefix = 'row-') =>
  Array.from({ length }).map((_, rowIndex) => {
    return columns.reduce(
      (rowData, column, columnIndex) => {
        rowData[column.field] = `Row ${rowIndex} - Col ${columnIndex}`;
        return rowData;
      },
      {
        id: `${prefix}${rowIndex}`,
        parentId: null,
      },
    );
  });

const columns: Column[] = [...generateColumns(8)];
const list: ListItem[] = generateList(columns, 20);

const getRowClass = ({ rowIndex }) => {
  if (rowIndex === 2) {
    return 'success-row';
  }
  if (rowIndex === 4) {
    return 'warning-row';
  }
  return '';
};

const getRowStyle = ({ rowIndex }) => {
  if (rowIndex === 3) {
    return 'color: red';
  }
  return '';
};
</script>
<style lang="scss">
.base-view {
  width: 100%;
  height: 100%;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;
}

.success-row {
  background-color: #fdf6ec !important;
}

.warning-row {
  background-color: #f0f9eb !important;
}
</style>
