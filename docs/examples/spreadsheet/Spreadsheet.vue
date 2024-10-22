<template>
  <div class="base-view">
    <div style="width: 100%; height: 600px; border: 2px solid var(--color-border)">
      <Grid
        :columns="columns"
        :list="list"
        :options="{
          border: true,
          highlightSelectRow: true,
          highlightSelectCol: true,
          selection: true,
        }"
      ></Grid>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Grid, type Column, type ListItem } from 'vue-virt-grid';

const chars = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

const generateColumns = (length = 10, props?: any) =>
  Array.from({ length }).map((_, columnIndex) => ({
    ...props,
    field: `${chars[columnIndex]}`,
    title: `${chars[columnIndex]}`,
    width: 200,
    resizable: true,
  }));

const generateList = (columns: ReturnType<typeof generateColumns>, length = 200, prefix = 'row-') =>
  Array.from({ length }).map((_, rowIndex) => {
    return columns.reduce(
      (rowData, column, columnIndex) => {
        // rowData[column.field] = `Row ${rowIndex} - Field ${columnIndex}`;
        return rowData;
      },
      {
        id: `${prefix}${rowIndex}`,
        parentId: null,
      },
    );
  });

const columns: Column[] = [{ type: 'index', width: 50, fixed: 'left' }, ...generateColumns(26)];
const list: ListItem[] = generateList(columns, 5000);

list[0].A =
  'vue-virt-grid是一个基于vue-virt-list的vue3的表格组件，支持合并单元格，虚拟滚动，固定列，固定行，树形表格';
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
</style>
