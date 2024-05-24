<template>
  <GridTable :list="list" border>
    <GridTableColumn field="field1" title="field1" />
    <GridTableColumn field="field2" title="field2" />
    <GridTableColumn field="field3" title="field3" />
    <GridTableColumn field="field4" title="field4" />
    <GridTableColumn field="field5" title="field5" />
  </GridTable>
</template>
<script setup>
import { GridTable, GridTableColumn } from 'vue-virt-grid';
const list = [
  {
    id: '1',
    field1: '11',
    field2: '12',
    field3: '13',
    field4: '14',
    field5: '15',
  },
  {
    id: '2',
    field1: '21',
    field2: '22',
    field3: '23',
    field4: '24',
    field5: '25',
  },
  {
    id: '3',
    field1: '31',
    field2: '32',
    field3: '33',
    field4: '34',
    field5: '35',
  },
  {
    id: '4',
    field1: '41',
    field2: '42',
    field3: '43',
    field4: '44',
    field5: '45',
  },
];
</script>
