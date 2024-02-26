<template>
  <div class="base-view">
    <div style="width: 100%; height: 600px; border: 2px solid var(--color-border)">
      <Grid :columns="columns" :list="list" :merges="merges" selection border></Grid>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Grid, type ListItem, type Column } from 'kita-grid';

const generateColumns = (length = 10, prefix = 'column-', props?: any) =>
  Array.from({ length }).map((_, columnIndex) => ({
    ...props,
    field: `${prefix}${columnIndex}`,
    title: `Column ${columnIndex}`,
    width: 200,
  }));

const generateList = (columns: ReturnType<typeof generateColumns>, length = 20, prefix = 'row-') =>
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

const columns: Column[] = [
  { type: 'index', width: 50, fixed: 'left', index: (index: number) => {} },
  { type: 'checkbox', width: 50, fixed: 'left' },
  { type: 'checkbox', width: 50, fixed: 'left' },
  ...generateColumns(20),
  { type: 'index', width: 50, fixed: 'right' },
  { type: 'checkbox', width: 50, fixed: 'right' },
];
const list: ListItem[] = generateList(columns, 5000);
const merges = [
  {
    rowIndex: 0,
    colIndex: 0,
    rowspan: 2,
    colspan: 2,
  },
  {
    rowIndex: 0,
    colIndex: 3,
    rowspan: 3,
    colspan: 3,
  },
  {
    rowIndex: 3,
    colIndex: 6,
    rowspan: 3,
    colspan: 2,
  },
  {
    rowIndex: 13,
    colIndex: 1,
    rowspan: 6,
    colspan: 1,
  },
  // {
  //   rowIndex: 0,
  //   colIndex: 23,
  //   rowspan: 2,
  //   colspan: 2,
  // },
];
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
