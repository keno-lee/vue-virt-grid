<template>
  <div class="base-view">
    <div style="width: 100%; height: 600px; border: 2px solid var(--color-border)">
      <Grid :columns="columns" :list="list" :merges="merges" border></Grid>
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

const columns: Column[] = generateColumns(1000);
const list: ListItem[] = generateList(columns, 5000);

// list[1]['column-11'] =
//   'vue-virt-grid是一个基于vue-virt-list的vue3的表格组件，支持合并单元格，虚拟滚动，固定列，固定行，树形表格';
// const merges = [
//   {
//     rowIndex: 1, // y
//     colIndex: 0, // x
//     rowspan: 2,
//     colspan: 2,
//   },
//   // {
//   //   rowIndex: 0, // y
//   //   colIndex: 0, // x
//   //   rowspan: 1,
//   //   colspan: 2,
//   // },
//   {
//     rowIndex: 1,
//     colIndex: 4,
//     rowspan: 3,
//     colspan: 3,
//   },
//   {
//     rowIndex: 3,
//     colIndex: 6,
//     rowspan: 3,
//     colspan: 2,
//   },
//   {
//     rowIndex: 5,
//     colIndex: 97,
//     rowspan: 2,
//     colspan: 3,
//   },
//   {
//     rowIndex: 13,
//     colIndex: 1,
//     rowspan: 6,
//     colspan: 1,
//   },
//   {
//     rowIndex: 0,
//     colIndex: 2,
//     rowspan: 5,
//     colspan: 1,
//   },

//   //
//   {
//     rowIndex: 11,
//     colIndex: 2,
//     rowspan: 4,
//     colspan: 1,
//   },

//   {
//     rowIndex: 13,
//     colIndex: 0,
//     rowspan: 3,
//     colspan: 2,
//   },
//   // {
//   //   rowIndex: 15,
//   //   colIndex: 4,
//   //   rowspan: 10,
//   //   colspan: 3,
//   // },
// ];

// const merges = [
//   {
//     rowIndex: 1,
//     colIndex: 3,
//     rowspan: 5,
//     colspan: 1,
//   },
//   {
//     rowIndex: 2, // y
//     colIndex: 1, // x
//     rowspan: 2,
//     colspan: 2,
//   },
//   {
//     rowIndex: 1,
//     colIndex: 4,
//     rowspan: 3,
//     colspan: 4,
//   },
//   {
//     rowIndex: 16,
//     colIndex: 2,
//     rowspan: 2,
//     colspan: 2,
//   },
// ];

// const merges = [{ rowIndex: 0, colIndex: 0, rowspan: 1000, colspan: 1 }];
// const merges = [{ rowIndex: 1, colIndex: 0, rowspan: 1, colspan: 900 }];
const merges = [
  { rowIndex: 0, colIndex: 0, rowspan: 2, colspan: 1 },
  { rowIndex: 0, colIndex: 1, rowspan: 2, colspan: 1 },
  { rowIndex: 0, colIndex: 2, rowspan: 2, colspan: 1 },
  { rowIndex: 0, colIndex: 3, rowspan: 2, colspan: 1 },
  { rowIndex: 0, colIndex: 4, rowspan: 2, colspan: 1 },
  { rowIndex: 0, colIndex: 5, rowspan: 2, colspan: 1 },
  { rowIndex: 0, colIndex: 6, rowspan: 2, colspan: 1 },
  { rowIndex: 0, colIndex: 7, rowspan: 2, colspan: 1 },
  { rowIndex: 0, colIndex: 8, rowspan: 2, colspan: 1 },
  { rowIndex: 0, colIndex: 9, rowspan: 2, colspan: 1 },
  { rowIndex: 0, colIndex: 15, rowspan: 10, colspan: 1 },
  { rowIndex: 0, colIndex: 16, rowspan: 10, colspan: 1 },
  { rowIndex: 0, colIndex: 18, rowspan: 2, colspan: 1 },
  { rowIndex: 0, colIndex: 19, rowspan: 2, colspan: 1 },
  { rowIndex: 0, colIndex: 20, rowspan: 2, colspan: 1 },
  { rowIndex: 0, colIndex: 21, rowspan: 2, colspan: 1 },
  { rowIndex: 1, colIndex: 11, rowspan: 1, colspan: 4 },

  { rowIndex: 2, colIndex: 0, rowspan: 4, colspan: 2 },
  { rowIndex: 2, colIndex: 2, rowspan: 4, colspan: 1 },
  { rowIndex: 2, colIndex: 3, rowspan: 4, colspan: 1 },
  { rowIndex: 2, colIndex: 6, rowspan: 4, colspan: 1 },
  { rowIndex: 2, colIndex: 7, rowspan: 4, colspan: 1 },
  { rowIndex: 2, colIndex: 8, rowspan: 4, colspan: 1 },
  { rowIndex: 2, colIndex: 9, rowspan: 4, colspan: 1 },
  { rowIndex: 2, colIndex: 17, rowspan: 4, colspan: 1 },
  { rowIndex: 2, colIndex: 18, rowspan: 3, colspan: 1 },
  { rowIndex: 2, colIndex: 19, rowspan: 3, colspan: 1 },
  { rowIndex: 2, colIndex: 20, rowspan: 3, colspan: 2 },
  { rowIndex: 3, colIndex: 4, rowspan: 2, colspan: 2 },
  { rowIndex: 4, colIndex: 11, rowspan: 2, colspan: 4 },
  { rowIndex: 5, colIndex: 18, rowspan: 1, colspan: 4 },

  { rowIndex: 6, colIndex: 0, rowspan: 3, colspan: 1 },
  { rowIndex: 6, colIndex: 1, rowspan: 3, colspan: 1 },
  { rowIndex: 6, colIndex: 4, rowspan: 3, colspan: 1 },
  { rowIndex: 6, colIndex: 5, rowspan: 3, colspan: 1 },
  { rowIndex: 6, colIndex: 6, rowspan: 3, colspan: 1 },
  { rowIndex: 6, colIndex: 7, rowspan: 3, colspan: 1 },
  { rowIndex: 6, colIndex: 8, rowspan: 3, colspan: 1 },
  { rowIndex: 6, colIndex: 9, rowspan: 3, colspan: 1 },
  { rowIndex: 6, colIndex: 18, rowspan: 3, colspan: 1 },
  { rowIndex: 6, colIndex: 19, rowspan: 3, colspan: 1 },
  { rowIndex: 6, colIndex: 20, rowspan: 3, colspan: 1 },
  { rowIndex: 6, colIndex: 21, rowspan: 3, colspan: 1 },
  { rowIndex: 6, colIndex: 2, rowspan: 1, colspan: 2 },
  { rowIndex: 8, colIndex: 2, rowspan: 1, colspan: 2 },
  { rowIndex: 9, colIndex: 0, rowspan: 1, colspan: 15 },

  { rowIndex: 11, colIndex: 5, rowspan: 4, colspan: 12 },
];

// const merges = [
//   {
//     rowIndex: 1,
//     colIndex: 1,
//     rowspan: 3,
//     colspan: 1,
//   },
//   {
//     rowIndex: 1,
//     colIndex: 2,
//     rowspan: 3,
//     colspan: 3,
//   },
// ];

// const merges = [
//   {
//     rowIndex: 1,
//     colIndex: 0,
//     rowspan: 2,
//     colspan: 2,
//   },
//   {
//     rowIndex: 0,
//     colIndex: 3,
//     rowspan: 3,
//     colspan: 3,
//   },
//   {
//     rowIndex: 3,
//     colIndex: 6,
//     rowspan: 3,
//     colspan: 5,
//   },
//   // {
//   //   rowIndex: 5,
//   //   colIndex: 97,
//   //   rowspan: 2,
//   //   colspan: 3,
//   // },
//   {
//     rowIndex: 13,
//     colIndex: 1,
//     rowspan: 20,
//     colspan: 1,
//   },
//   {
//     rowIndex: 0,
//     colIndex: 2,
//     rowspan: 5,
//     colspan: 1,
//   },
// ];

// const merges = [
//   {
//     rowIndex: 1,
//     colIndex: 0,
//     rowspan: 5,
//     colspan: 2,
//   },
//   {
//     rowIndex: 2, // y
//     colIndex: 2, // x
//     rowspan: 2,
//     colspan: 2,
//   },
//   {
//     rowIndex: 1,
//     colIndex: 4,
//     rowspan: 3,
//     colspan: 3,
//   },
// ];
</script>
