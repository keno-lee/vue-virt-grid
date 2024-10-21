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
        defaultExpandAll
        border
      ></Grid>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Grid, type Column, type ListItem, CellType, ColumnSpecType } from 'vue-virt-grid';

const columns: Column[] = [];
for (let i = 0; i < 10; i++) {
  columns.push({
    field: `key${i}`,
    title: `title${i}`,
    type: i === 0 ? ColumnSpecType.Title : CellType.Text,
    width: i == 0 ? 400 : 200,
  });
}

const list: ListItem[] = [];
for (let i = 0; i < 1000; i++) {
  const item = {
    id: i.toString(),
    key0: `row${i}-title`,
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

  if (i === 1 || i === 2) {
    item.children = [
      {
        id: `${i}-children`,
        key0: `row${i}-children-key`,
        key1: `row${i}-children-key1`,
        key2: `row${i}-children-key2`,
        key3: `row${i}-children-key3`,
        key4: `row${i}-children-key4`,
        key5: `row${i}-children-key5`,
        key6: `row${i}-children-key6`,
        key7: `row${i}-children-key7`,
        key8: `row${i}-children-key8`,
        key9: `row${i}-children-key9`,
        key10: `row${i}-children-key10`,
        key11: `row${i}-children-key11`,
        key12: `row${i}-children-key12`,
        children: [
          {
            id: `${i}-children111`,
            key0: `row${i}-children-key`,
            key1: `row${i}-children-key1`,
            key2: `row${i}-children-key2`,
            key3: `row${i}-children-key3`,
            key4: `row${i}-children-key4`,
            key5: `row${i}-children-key5`,
            key6: `row${i}-children-key6`,
            key7: `row${i}-children-key7`,
            key8: `row${i}-children-key8`,
            key9: `row${i}-children-key9`,
            key10: `row${i}-children-key10`,
            key11: `row${i}-children-key11`,
            key12: `row${i}-children-key12`,
          },
          {
            id: `${i}-children111222`,
            key0: `row${i}-children-key`,
            key1: `row${i}-children-key1`,
            key2: `row${i}-children-key2`,
            key3: `row${i}-children-key3`,
            key4: `row${i}-children-key4`,
            key5: `row${i}-children-key5`,
            key6: `row${i}-children-key6`,
            key7: `row${i}-children-key7`,
            key8: `row${i}-children-key8`,
            key9: `row${i}-children-key9`,
            key10: `row${i}-children-key10`,
            key11: `row${i}-children-key11`,
            key12: `row${i}-children-key12`,
          },
        ],
      },
      {
        id: `${i}-children1`,
        key0: `row${i}-children-key`,
        key1: `row${i}-children-key1`,
        key2: `row${i}-children-key2`,
        key3: `row${i}-children-key3`,
        key4: `row${i}-children-key4`,
        key5: `row${i}-children-key5`,
        key6: `row${i}-children-key6`,
        key7: `row${i}-children-key7`,
        key8: `row${i}-children-key8`,
        key9: `row${i}-children-key9`,
        key10: `row${i}-children-key10`,
        key11: `row${i}-children-key11`,
        key12: `row${i}-children-key12`,
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
