<template>
  <div class="base-view">
    <div style="width: 100%; height: 600px; border: 2px solid var(--color-border)">
      <Grid :columns="columns" :list="list" :merges="merges" border></Grid>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Grid, type Column, type ListItem, ColumnType } from 'vue-virt-grid';

const columns: Column[] = [
  {
    field: 'key1',
    title: 'key1',
    type: ColumnType.Text,
    width: 200,
    // fixed: 'left',
  },
  {
    field: 'key2',
    title: 'key2',
    type: ColumnType.Text,
    width: 200,
    // fixed: 'left',
    children: [
      {
        field: 'key2-1',
        title: 'key2-1',
        type: ColumnType.Text,
        width: 200,
        fixed: 'left',
        children: [
          {
            field: 'key2-1-1',
            title: 'key2-1-1',
            type: ColumnType.Text,
            width: 200,
            children: [
              {
                field: 'key2-1-1-1',
                title: 'key2-1-1-1',
                type: ColumnType.Text,
                width: 200,
              },
              {
                field: 'key2-1-1-2',
                title: 'key2-1-1-2',
                type: ColumnType.Text,
                width: 200,
              },
            ],
          },
          { field: 'key2-1-2', title: 'key2-1-2', type: ColumnType.Text, width: 200 },
        ],
      },
      {
        field: 'key2-2',
        title: 'key2-2',
        type: ColumnType.Text,
        width: 200,
      },
    ],
  },
  {
    field: 'key3',
    title: 'key3',
    type: ColumnType.Text,
    width: 200,
    children: [
      {
        field: 'key3-1',
        title: 'key3-1',
        type: ColumnType.Text,
        width: 200,
        children: [{ field: 'key3-1-1', title: 'key3-1-1', type: ColumnType.Text, width: 200 }],
      },
    ],
  },
  {
    field: 'key4',
    title: 'key4',
    type: ColumnType.Text,
    width: 200,
    children: [{ field: 'key4-1', title: 'key4-1', type: ColumnType.Text, width: 200 }],
  },
  {
    field: 'key5',
    title: 'key5',
    type: ColumnType.Text,
    width: 200,
    // fixed: 'right',
    children: [{ field: 'key5-1', title: 'key5-1', type: ColumnType.Text, width: 200 }],
  },
  {
    field: 'key6',
    title: 'key6',
    type: ColumnType.Text,
    width: 200,
    // fixed: 'right',
    children: [{ field: 'key6-1', title: 'key6-1', type: ColumnType.Text, width: 200 }],
  },
  {
    field: 'key7',
    title: 'key7',
    type: ColumnType.Text,
    width: 200,
    // fixed: 'right',
    children: [{ field: 'key7-1', title: 'key7-1', type: ColumnType.Text, width: 200 }],
  },
  {
    field: 'key8',
    title: 'key8',
    type: ColumnType.Text,
    width: 200,
    // fixed: 'right',
    children: [{ field: 'key8-1', title: 'key8-1', type: ColumnType.Text, width: 200 }],
  },
  {
    field: 'key9',
    title: 'key9',
    type: ColumnType.Text,
    width: 200,
    // fixed: 'right',
    children: [{ field: 'key9-1', title: 'key9-1', type: ColumnType.Text, width: 200 }],
  },
  {
    field: 'key10',
    title: 'key10',
    type: ColumnType.Text,
    width: 200,
    // fixed: 'right',
    children: [{ field: 'key10-1', title: 'key10-1', type: ColumnType.Text, width: 200 }],
  },
  {
    field: 'key11',
    title: 'key11',
    type: ColumnType.Text,
    width: 200,
    // fixed: 'right',
    children: [
      { field: 'key11-1', title: 'title12', type: ColumnType.Text, width: 200 },
      { field: 'key12-1', title: 'title12', type: ColumnType.Text, width: 200 },
    ],
  },
];
const list: ListItem[] = [];
for (let i = 0; i < 5000; i++) {
  list.push({
    id: i.toString(),
    key0: `row${i}-key0`,
    key1: `row${i}-key1`,
    'key2-1-1-1': `row${i}-key2-1-1-1`,
    'key2-1-1-2': `row${i}-key2-1-1-2`,
    'key2-1-2': `row${i}-key2-1-2`,
    'key2-2': `row${i}-key2-2`,
    'key3-1-1': `row${i}-key3-1-1`,
    'key4-1': `row${i}-key4-1`,
    'key5-1': `row${i}-key5-1`,
    'key6-1': `row${i}-key6-1`,
    'key7-1': `row${i}-key7-1`,
    'key8-1': `row${i}-key8-1`,
    'key9-1': `row${i}-key9-1`,
    'key10-1': `row${i}-key10-1`,
    'key11-1': `row${i}-key11-1`,
    'key12-1': `row${i}-key12-1 渲染判断的骨架渲染判断的骨架渲染判断的骨架渲染判断的骨架`,
  });
}

const merges = [
  {
    rowIndex: 1,
    colIndex: 1,
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
    colIndex: 2,
    rowspan: 6,
    colspan: 1,
  },
  // TODO 对于错误的合并，需要做出提示
  // {
  //   rowIndex: 0,
  //   colIndex: 3,
  //   rowspan: 5,
  //   colspan: 1,
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
