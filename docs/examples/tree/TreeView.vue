<template>
  <div class="base-view">
    <div style="width: 100%; height: 600px; border: 2px solid var(--color-border)">
      <Grid
        :columns="columns"
        :list="list"
        :options="{
          defaultExpandAll: true,
          border: true,
        }"
      ></Grid>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Grid, type Column, type ListItem, CellType } from 'vue-virt-grid';

const columns: Column[] = [];
for (let i = 0; i < 10; i++) {
  columns.push({
    field: `field${i}`,
    title: `title${i}`,
    type: i === 0 ? CellType.Tree : CellType.Text,
    width: i == 0 ? 400 : 200,
  });
}

const list: ListItem[] = [];
for (let i = 0; i < 1000; i++) {
  const item = {
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

  if (i === 1 || i === 2) {
    item.children = [
      {
        id: `${i}-children`,
        field0: `row${i}-children-field`,
        field1: `row${i}-children-field1`,
        field2: `row${i}-children-field2`,
        field3: `row${i}-children-field3`,
        field4: `row${i}-children-field4`,
        field5: `row${i}-children-field5`,
        field6: `row${i}-children-field6`,
        field7: `row${i}-children-field7`,
        field8: `row${i}-children-field8`,
        field9: `row${i}-children-field9`,
        field10: `row${i}-children-field10`,
        field11: `row${i}-children-field11`,
        field12: `row${i}-children-field12`,
        children: [
          {
            id: `${i}-children111`,
            field0: `row${i}-children-field`,
            field1: `row${i}-children-field1`,
            field2: `row${i}-children-field2`,
            field3: `row${i}-children-field3`,
            field4: `row${i}-children-field4`,
            field5: `row${i}-children-field5`,
            field6: `row${i}-children-field6`,
            field7: `row${i}-children-field7`,
            field8: `row${i}-children-field8`,
            field9: `row${i}-children-field9`,
            field10: `row${i}-children-field10`,
            field11: `row${i}-children-field11`,
            field12: `row${i}-children-field12`,
          },
          {
            id: `${i}-children111222`,
            field0: `row${i}-children-field`,
            field1: `row${i}-children-field1`,
            field2: `row${i}-children-field2`,
            field3: `row${i}-children-field3`,
            field4: `row${i}-children-field4`,
            field5: `row${i}-children-field5`,
            field6: `row${i}-children-field6`,
            field7: `row${i}-children-field7`,
            field8: `row${i}-children-field8`,
            field9: `row${i}-children-field9`,
            field10: `row${i}-children-field10`,
            field11: `row${i}-children-field11`,
            field12: `row${i}-children-field12`,
          },
        ],
      },
      {
        id: `${i}-children1`,
        field0: `row${i}-children-field`,
        field1: `row${i}-children-field1`,
        field2: `row${i}-children-field2`,
        field3: `row${i}-children-field3`,
        field4: `row${i}-children-field4`,
        field5: `row${i}-children-field5`,
        field6: `row${i}-children-field6`,
        field7: `row${i}-children-field7`,
        field8: `row${i}-children-field8`,
        field9: `row${i}-children-field9`,
        field10: `row${i}-children-field10`,
        field11: `row${i}-children-field11`,
        field12: `row${i}-children-field12`,
      },
    ];
  }
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
