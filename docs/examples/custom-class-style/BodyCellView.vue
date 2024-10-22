<template>
  <div class="base-view">
    <div style="width: 100%; height: 600px; border: 2px solid var(--el-color-border)">
      <Grid
        :columns="columns"
        :list="list"
        :options="{
          cellClassName: getCellClass,
          cellStyle: getCellStyle,
        }"
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
    title: `Title ${columnIndex}`,
    width: 200,
  }));

const generateList = (columns: ReturnType<typeof generateColumns>, length = 200, prefix = 'row-') =>
  Array.from({ length }).map((_, rowIndex) => {
    return columns.reduce(
      (rowData, column, columnIndex) => {
        rowData[column.field] = `Row ${rowIndex} - Field ${columnIndex}`;
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

const getCellClass = ({ columnIndex }) => {
  if (columnIndex === 1) {
    return 'success-col';
  }
  if (columnIndex === 3) {
    return 'warning-col';
  }
  return '';
};

const getCellStyle = ({ columnIndex }) => {
  if (columnIndex === 2) {
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

.success-col {
  background-color: #fdf6ec !important;
}

.warning-col {
  background-color: #f0f9eb !important;
}
</style>
