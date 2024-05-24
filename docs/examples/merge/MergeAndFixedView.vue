<template>
  <div class="base-view">
    <div style="width: 100%; height: 600px; border: 2px solid var(--color-border)">
      <Grid :columns="columns" :list="list" :merges="merges" border selection></Grid>
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

const normalColumns: Column[] = generateColumns(100);
const list: ListItem[] = generateList(normalColumns, 5000);
const columns = [
  { type: 'index', width: 50, fixed: 'left', index: (index: number) => {} },
  { type: 'checkbox', width: 50, fixed: 'left' },
  { type: 'checkbox', width: 50, fixed: 'left' },
  ...normalColumns,
  { type: 'index', width: 50, fixed: 'right' },
  { type: 'checkbox', width: 50, fixed: 'right' },
];

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

const merges = [
  {
    rowIndex: 1,
    colIndex: 3,
    rowspan: 5,
    colspan: 1,
  },
  {
    rowIndex: 2, // y
    colIndex: 1, // x
    rowspan: 2,
    colspan: 2,
  },
  {
    rowIndex: 1,
    colIndex: 4,
    rowspan: 3,
    colspan: 4,
  },
  {
    rowIndex: 16,
    colIndex: 2,
    rowspan: 2,
    colspan: 2,
  },
];

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
