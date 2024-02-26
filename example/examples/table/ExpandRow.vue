<template>
  <GridTable
    :list="list"
    border
    stripe
    :showTreeLine="true"
    defaultExpandAll
    style="width: 100%; height: 600px"
  >
    <GridTableColumn
      id="expand"
      key="expand"
      field="expand"
      fixed="left"
      :type="ColumnType.Expand"
      :width="50"
    >
      <template #default="{ row }"> expand row {{ row.key }} </template>
    </GridTableColumn>
    <GridTableColumn v-for="column in columns" v-bind="column" :key="column.field">
      <template #default="{ row, column }"> cell: {{ row[column.field] }} </template>
      <template #header="{ column }"> header: {{ column.field }} </template>
    </GridTableColumn>
    <template #empty>暂无数据</template>
  </GridTable>
</template>
<script lang="ts" setup>
import { GridTable, GridTableColumn, type Column, type ListItem, ColumnType } from 'kita-grid';

const generateColumns = (length = 10, prefix = 'column-', props?: any) =>
  Array.from({ length }).map((_, columnIndex) => ({
    ...props,
    field: `${prefix}${columnIndex}`,
    title: `Column ${columnIndex}`,
    width: 200,
  }));

const generateList = (columns: ReturnType<typeof generateColumns>, length = 200, prefix = 'row-') =>
  Array.from({ length }).map((_, rowIndex) => {
    return columns.reduce(
      (rowData, column, columnIndex) => {
        rowData[column.field] = `Row ${rowIndex} - Col ${columnIndex}`;
        return rowData;
      },
      {
        id: `${prefix}${rowIndex}`,
        parentId: null,
      },
    );
  });

const columns: Column[] = [
  ...generateColumns(20),
  { type: 'index', width: 50, fixed: 'right' },
  { type: 'checkbox', width: 50, fixed: 'right' },
];
const list: ListItem[] = generateList(columns, 5000);
</script>
<style lang="scss" scoped></style>
