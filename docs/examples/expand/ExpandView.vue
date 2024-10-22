<template>
  <div class="base-view">
    <div style="width: 100%; height: 600px; border: 2px solid var(--color-border)">
      <Grid :columns="columns" :list="list"></Grid>
    </div>
  </div>
</template>
<script setup lang="tsx">
import { Grid, type Column, type ListItem, CellType } from 'vue-virt-grid';

const columns: Column[] = [
  {
    title: '',
    field: '',
    width: 50,
    type: CellType.Expand,
    expandRender: (column, row) => {
      return (
        <div>
          <p>展开一个新表格</p>
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
          ></Grid>
        </div>
      ) as any;
    },
  },
];

for (let i = 0; i < 8; i++) {
  columns.push({
    field: `field${i}`,
    title: `title${i}`,
    type: CellType.Text,
    width: 120,
  });
}

const list: ListItem[] = [];
for (let i = 0; i < 100; i++) {
  const item: ListItem = {
    id: i.toString(),
    field0: `row${i}-field0`,
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
