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
        :options="{
          border: true,
          selection: true,
        }"
      ></Grid>
    </div>
  </div>
</template>
<script setup lang="tsx">
import { Grid, type Column, type ListItem, CellType } from 'vue-virt-grid';

const extraText = `Velit sed aspernatur tempora. Natus consequatur officiis dicta vel assumenda.`;

const columns: Column[] = [
  {
    title: '',
    field: '',
    type: CellType.Expand,
    width: 50,
    cellRender: (column, row) => {
      return (<div style="max-height: 200px; overflow: auto">{extraText}</div>) as any;
    },
  },
];
for (let i = 0; i < 100; i++) {
  columns.push({
    field: `field${i}`,
    title: `title${i}`,
    type: CellType.Text,
    width: 100,
  });
}

const list: ListItem[] = [];
for (let i = 0; i < 100; i++) {
  const item: ListItem = {
    id: i.toString(),
    field0: `row${i}-field`,
    field1: `row${i}-field1`,
    field2: `row${i}-field2`,
    field3: `row${i}-field3`,
    field4: `row${i}-field4`,
    field5: `row${i}-field5`,
    field6: `row${i}-field6`,
    field7: `row${i}-field7`,
    field8: `row${i}-field8`,
    field9: `row${i}-field9`,
    field10: `row${i}-field10`,
    field11: `row${i}-field11`,
    field12: `row${i}-field12`,
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
