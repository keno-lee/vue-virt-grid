<template>
  <div class="base-view">
    <div style="width: 100%; height: 600px; border: 2px solid var(--color-border)">
      <Grid
        :columns="columns"
        :list="list"
        :options="{
          merges: merges,
          border: true,
          selection: true,
        }"
      ></Grid>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Grid, type Column, type ListItem, CellType } from 'vue-virt-grid';

const columns: Column[] = [
  {
    field: 'key1',
    title: 'key1',
    type: CellType.Text,
    width: 200,
    fixed: 'left',
    resizable: true,
  },
  {
    field: 'key2',
    title: 'key2',
    type: CellType.Text,
    width: 200,
    fixed: 'left',
    children: [
      {
        field: 'key2-1',
        title: 'key2-1',
        type: CellType.Text,
        width: 200,
        fixed: 'left',
        children: [
          {
            field: 'key2-1-1',
            title: 'key2-1-1',
            type: CellType.Text,
            width: 200,
            children: [
              {
                field: 'key2-1-1-1',
                title: 'key2-1-1-1',
                type: CellType.Text,
                width: 200,
              },
              {
                field: 'key2-1-1-2',
                title: 'key2-1-1-2',
                type: CellType.Text,
                width: 100,
              },
            ],
          },
          { field: 'key2-1-2', title: 'key2-1-2', type: CellType.Text, width: 100 },
        ],
      },
      {
        field: 'key2-2',
        title: 'key2-2',
        type: CellType.Text,
        width: 200,
        // children: [
        //   { id: 221, field: 'key221', title: 'title12', type: CellType.Text, width: 200 },
        //   { id: 222, field: 'key222', title: 'title12', type: CellType.Text, width: 200 },
        // ],
      },
    ],
  },
  {
    field: 'key3',
    title: 'key3',
    type: CellType.Text,
    width: 200,
    children: [
      {
        field: 'key3-1',
        title: 'key3-1',
        type: CellType.Text,
        width: 200,
        // FIXME: 有bug
        children: [{ field: 'key3-1-1', title: 'key3-1-1', type: CellType.Text, width: 200 }],
      },
    ],
  },
  {
    field: 'key4',
    title: 'key4',
    type: CellType.Text,
    width: 200,
    children: [{ field: 'key4-1', title: 'key4-1', type: CellType.Text, width: 200 }],
  },
  {
    field: 'key5',
    title: 'key5',
    type: CellType.Text,
    width: 200,
    // fixed: 'right',
    children: [{ field: 'key5-1', title: 'key5-1', type: CellType.Text, width: 200 }],
  },
  {
    field: 'key6',
    title: 'key6',
    type: CellType.Text,
    width: 200,
    // fixed: 'right',
    children: [{ field: 'key6-1', title: 'key6-1', type: CellType.Text, width: 200 }],
  },
  {
    field: 'key7',
    title: 'key7',
    type: CellType.Text,
    width: 200,
    // fixed: 'right',
    children: [{ field: 'key7-1', title: 'key7-1', type: CellType.Text, width: 200 }],
  },
  {
    field: 'key8',
    title: 'key8',
    type: CellType.Text,
    width: 200,
    // fixed: 'right',
    children: [{ field: 'key8-1', title: 'key8-1', type: CellType.Text, width: 200 }],
  },
  {
    field: 'key9',
    title: 'key9',
    type: CellType.Text,
    width: 200,
    // fixed: 'right',
    children: [{ field: 'key9-1', title: 'key9-1', type: CellType.Text, width: 200 }],
  },
  {
    field: 'key10',
    title: 'key10',
    type: CellType.Text,
    width: 200,
    // fixed: 'right',
    children: [{ field: 'key10-1', title: 'key10-1', type: CellType.Text, width: 200 }],
  },
  {
    field: 'key11',
    title: 'key11',
    type: CellType.Text,
    width: 200,
    // fixed: 'right',
    children: [
      { field: 'key11-1', title: 'key11-1', type: CellType.Text, width: 200 },
      { field: 'key11-2', title: 'key11-2', type: CellType.Text, width: 200 },
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
    key13: `row${i}-key13`,
    key14: `row${i}-key14 渲染判断的骨架渲染判断的骨架渲染判断的骨架渲染判断的骨架`,
    key15: `row${i}-key15`,
    key16: `row${i}-key16`,
    key17: `row${i}-key17`,
    key18: `row${i}-key18`,
    key19: `row${i}-key19`,
    key20: `row${i}-key20`,
    key21: `row${i}-key21`,
    key22: `row${i}-key22`,
    key23: `row${i}-key23`,
    key24: `row${i}-key24`,
    key25: `row${i}-key25`,
    key26: `row${i}-key26`,
    key27: `row${i}-key27`,
    key28: `row${i}-key28`,
    key29: `row${i}-key29`,
    key30: `row${i}-key30`,
    key31: `row${i}-key31`,
    key32: `row${i}-key32`,
    key33: `row${i}-key33`,
    key34: `row${i}-key34`,
    key35: `row${i}-key35`,
    key36: `row${i}-key36`,
    key37: `row${i}-key37`,
    key38: `row${i}-key38`,
    key39: `row${i}-key39`,
    key40: `row${i}-key40`,

    key50: `row${i}-key50 渲染判断的骨架渲染判断的骨架渲染判断的骨架渲染判断的骨架`,
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
