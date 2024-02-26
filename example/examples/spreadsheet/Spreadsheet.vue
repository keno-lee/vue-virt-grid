<template>
  <div class="base-view">
    <div style="width: 100%; height: 600px; border: 2px solid var(--color-border)">
      <Grid :columns="columns" :list="list" border selection></Grid>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Grid, type Column, type ListItem } from 'kita-grid';

const chars = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

const generateColumns = (length = 10, props?: any) =>
  Array.from({ length }).map((_, columnIndex) => ({
    ...props,
    field: `${chars[columnIndex]}`,
    title: `${chars[columnIndex]}`,
    width: 200,
  }));

const generateList = (columns: ReturnType<typeof generateColumns>, length = 200, prefix = 'row-') =>
  Array.from({ length }).map((_, rowIndex) => {
    return columns.reduce(
      (rowData, column, columnIndex) => {
        // rowData[column.field] = `Row ${rowIndex} - Col ${columnIndex}`;
        return rowData;
      },
      {
        id: `${prefix}${rowIndex}`,
        parentId: null,
      },
    );
  });

const columns: Column[] = [{ type: 'index', width: 50, fixed: 'left' }, ...generateColumns(26)];
const list: ListItem[] = generateList(columns, 5000);

list[0].A =
  'kita-grid是一个基于vue3的表格组件，支持合并单元格，虚拟滚动，固定列，固定行，树形表格，自定义列，自定义单元格，自定义行，自定义表头，自定义表尾，自定义分页，自定义排序，自定义筛选，自定义合计，自定义分组，自定义展开行，自定义选择，自定义编辑，自定义校验，自定义拖拽，自定义导出，自定义打印，自定义复制，自定义粘贴，自定义导入，自定义拖拽，自定义滚动，自定义滚动条，自定义滚动到指定行，自定义滚动到指定列，自定义滚动到指定单元格，自定义滚动到指定坐标，自定义滚动到指定行列，自定义滚动到指定行单元格，自定义滚动到指定列单元格，自定义滚动到指定行列单元格，自定义滚动到指定行坐标，自定义滚动到指定列坐标，自定义滚动到指定单元格坐标，自定义滚动到指定行列坐标，自定义滚动到指定行单元格坐标，自定义';
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
