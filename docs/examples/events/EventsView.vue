<template>
  <div class="base-view">
    <div style="width: 100%; height: 600px; border: 2px solid var(--color-border)">
      <Grid
        :columns="columns"
        :list="list"
        @cell-click="onCellClick"
        @cell-dblclick="onCellDblclick"
        @cell-contextmenu="onCellContextmenu"
        @row-click="onRowClick"
        @row-dblclick="onRowDblclick"
        @row-contextmenu="onRowContextmenu"
        @header-click="onHeaderClick"
        @header-dblclick="onHeaderDblclick"
        @header-contextmenu="onHeaderContextmenu"
        @expand-change="onExpandChange"
        @box-selection="onBoxSelection"
        selection
        border
      ></Grid>
    </div>
  </div>
</template>
<script setup lang="tsx">
import { Grid, type Column, type ListItem, ColumnType } from 'vue-virt-grid';

const extraText = `Velit sed aspernatur tempora. Natus consequatur officiis dicta vel assumenda.`;

const columns: Column[] = [
  {
    title: '',
    field: '',
    type: ColumnType.Expand,
    width: 50,
    bodyRender: (column, row) => {
      return (<div style="max-height: 200px; overflow: auto">{extraText}</div>) as any;
    },
  },
];
for (let i = 0; i < 100; i++) {
  columns.push({
    field: `key${i}`,
    title: `title${i}`,
    type: ColumnType.Text,
    width: 100,
  });
}

const list: ListItem[] = [];
for (let i = 0; i < 100; i++) {
  const item: ListItem = {
    id: i.toString(),
    key0: `row${i}-key`,
    key1: `row${i}-key1`,
    key2: `row${i}-key2`,
    key3: `row${i}-key3`,
    key4: `row${i}-key4`,
    key5: `row${i}-key5`,
    key6: `row${i}-key6`,
    key7: `row${i}-key7`,
    key8: `row${i}-key8`,
    key9: `row${i}-key9`,
    key10: `row${i}-key10`,
    key11: `row${i}-key11`,
    key12: `row${i}-key12`,
    children: [] as any[],
  };
  list.push(item);
}

// 可以打开控制台看输出
const onCellClick = (data) => {
  console.log('cell-click', data);
};
const onCellDblclick = (data) => {
  console.log('cell-dblclick', data);
};
const onCellContextmenu = (data) => {
  console.log('cell-contextmenu', data);
};
const onRowClick = (data) => {
  console.log('row-click', data);
};
const onRowDblclick = (data) => {
  console.log('row-dblclick', data);
};
const onRowContextmenu = (data) => {
  console.log('row-contextmenu', data);
};
const onHeaderClick = (data) => {
  console.log('header-click', data);
};
const onHeaderDblclick = (data) => {
  console.log('header-dblclick', data);
};
const onHeaderContextmenu = (data) => {
  console.log('header-contextmenu', data);
};
const onExpandChange = (data) => {
  console.log('expand-change', data);
};
const onBoxSelection = (data) => {
  console.log('box-selection', data);
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
</style>
