<template>
  <div class="base-view">
    <div style="width: 800px; height: 600px; border: 2px solid var(--color-border)">
      <Grid :columns="columns" :list="list" :merges="merges" border selection></Grid>
      <ol style="font-size: 14px; color: rgba(0, 0, 0, 0.8); margin-top: 16px">
        <li>选中单元格后拖动快速创建区域</li>
        <li>按住command/ctrl可以选中多个区域</li>
        <li>按住shift选中区域对角点快速创建区域</li>
      </ol>
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

const columns: Column[] = generateColumns(100);
const list: ListItem[] = generateList(columns, 5000);
const merges = [
  {
    rowIndex: 1,
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
    rowIndex: 5,
    colIndex: 97,
    rowspan: 2,
    colspan: 3,
  },
  {
    rowIndex: 13,
    colIndex: 1,
    rowspan: 6,
    colspan: 1,
  },
  {
    rowIndex: 0,
    colIndex: 2,
    rowspan: 5,
    colspan: 1,
  },
];

// list[0].key0 =
//   'row0-key0 - 渲染判断的骨架渲染判断的骨架渲染判断的骨架渲染判断的骨架渲染判断的骨架渲染判断的骨架渲染判断的骨架渲染判断的骨架渲染判断的骨架渲染判断的骨架渲染判断的骨架渲染判断的骨架渲染判断的骨架渲染判断的骨架渲染判断的骨架渲染判断的骨架渲染判断的骨架渲染判断的骨架渲染判断的骨架渲染判断的骨架渲染判断的骨架渲染判断的骨架渲染判断的骨架渲染判断的骨架渲染判断的骨架渲染判断的骨架渲染判断的骨架渲染判断的骨架渲染判断的骨架';

// const mergeMethods = (row: ListItem, column: Column) => {
//   if (row.id === 0 && column.id === 0) {
//     return {
//       rowspan: 4,
//       colspan: 4,
//     };
//   }
//   if (
//     (row.id === 0 && column.id === 1) ||
//     (row.id === 0 && column.id === 2) ||
//     (row.id === 0 && column.id === 3) ||
//     (row.id === 1 && column.id === 0) ||
//     (row.id === 1 && column.id === 1) ||
//     (row.id === 1 && column.id === 2) ||
//     (row.id === 1 && column.id === 3) ||
//     (row.id === 2 && column.id === 0) ||
//     (row.id === 2 && column.id === 1) ||
//     (row.id === 2 && column.id === 2) ||
//     (row.id === 2 && column.id === 3) ||
//     (row.id === 3 && column.id === 0) ||
//     (row.id === 3 && column.id === 1) ||
//     (row.id === 3 && column.id === 2) ||
//     (row.id === 3 && column.id === 3)
//   ) {
//     return {
//       rowspan: 0,
//       colspan: 0,
//       related: {
//         col: 0,
//         colspan: 4,
//       }
//     };
//   }
//   if (row.id === 4 && column.id === 0) {
//     return {
//       rowspan: 3,
//       colspan: 3,
//     };
//   }
//   if (
//     (row.id === 4 && column.id === 1) ||
//     (row.id === 4 && column.id === 2) ||
//     (row.id === 5 && column.id === 0) ||
//     (row.id === 5 && column.id === 1) ||
//     (row.id === 5 && column.id === 2) ||
//     (row.id === 6 && column.id === 0) ||
//     (row.id === 6 && column.id === 1) ||
//     (row.id === 6 && column.id === 2)
//   ) {
//     return {
//       rowspan: 0,
//       colspan: 0,
//       related: {
//         col: 0,
//         colspan: 3,
//       }
//     };
//   }
// };
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
