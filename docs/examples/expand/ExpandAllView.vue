<template>
  <div class="base-view">
    <div style="width: 100%; height: 600px; border: 2px solid var(--color-border)">
      <Grid :columns="columns" :list="list" default-expand-all></Grid>
    </div>
  </div>
</template>
<script setup lang="tsx">
import { Grid, type Column, type ListItem, CellType, ColumnSpecType } from 'vue-virt-grid';
import type { VNode } from 'vue';

const columns: Column[] = [
  {
    title: '',
    field: '',
    type: ColumnSpecType.Expand,
    width: 50,
    customCellRender: (column, row) => {
      return (
        <div>
          <p>展开行包含子表格</p>
          <Grid
            columns={[
              {
                id: 'index-0',
                type: CellType.Index,
                width: 50,
              } as any,
              {
                id: 'index-1',
                field: 'name',
                title: `Name`,
                type: CellType.Text,
                width: 100,
              },
              {
                id: 'index-2',
                field: 'attribute',
                title: `Attribute`,
                type: CellType.Text,
                width: 100,
              },
            ]}
            list={[
              {
                id: '1',
                name: 'aaa',
                attribute: 'bbb',
              },
              {
                id: '2',
                name: 'bbb',
                attribute: 'ccc',
              },
            ]}
            border
          ></Grid>
        </div>
      ) as any;
    },
  },
];

for (let i = 0; i < 8; i++) {
  columns.push({
    field: `key${i}`,
    title: `title${i}`,
    type: CellType.Text,
    width: 120,
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
