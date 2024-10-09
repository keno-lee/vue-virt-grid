<template>
  <GridTable :list="list" border stripe :showTreeLine="true" defaultExpandAll :merges="merges">
    <GridTableColumn key="1" field="field1" :width="100" :type="CellType.Text" title="field1" />
    <GridTableColumn key="2" field="field2" :width="100" :type="CellType.Text" title="field2">
      <GridTableColumn key="3" field="field3" :width="100" :type="CellType.Text" title="field3" />
    </GridTableColumn>
    <GridTableColumn key="4" field="field4" :width="100" :type="CellType.Text" title="field4" />
  </GridTable>
</template>
<script setup lang="ts">
import { GridTable, GridTableColumn, type ListItem, CellType } from 'vue-virt-grid';

const list: ListItem[] = [
  {
    id: '1',
    field1: '11',
    field2: '12',
    field3: '13',
    field4: '14',
  },
  {
    id: '2',
    field1: '21',
    field2: '22',
    field3: '23',
    field4: '24',
  },
  {
    id: '3',
    field1: '31',
    field2: '32',
    field3: '33',
    field4: '34',
  },
  {
    id: '4',
    field1: '41',
    field2: '42',
    field3: '43',
    field4: '44',
  },
];
const merges = [
  {
    rowIndex: 0,
    colIndex: 0,
    rowspan: 2,
    colspan: 2,
  },
  {
    rowIndex: 2,
    colIndex: 1,
    rowspan: 1,
    colspan: 2,
  },
];
</script>
