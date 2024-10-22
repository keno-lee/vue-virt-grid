<template>
  <div class="base-view">
    <div style="width: 100%; height: 600px; border: 2px solid var(--el-color-border)">
      <Grid
        :columns="columns"
        :list="list"
        :options="{
          border: true,
          highlightSelectRow: true,
          ...customConfig,
        }"
      ></Grid>
    </div>
  </div>
</template>
<script setup lang="tsx">
import { Grid, type Column, type ListItem } from 'vue-virt-grid';
import {
  SelectCover,
  SelectDropdown,
  SelectView,
  DateView,
  DateCover,
  DateDropdown,
  LinkView,
  PersonView,
  CellType,
  type TdData,
} from 'vue-virt-grid';
import { ElSelect, ElOption } from 'element-plus';
// const generateColumns = (length = 10, prefix = 'column-', props?: any) =>
//   Array.from({ length }).map((_, columnIndex) => ({
//     ...props,
//     field: `${prefix}${columnIndex}`,
//     title: `Title ${columnIndex}`,
//     width: 200,
//   }));
const generateList = (columns: Column[], length = 10000, prefix = 'row-') =>
  Array.from({ length }).map((_, rowIndex) => {
    return columns.reduce(
      (rowData, column, columnIndex) => {
        rowData[column.field] = `Row ${rowIndex} - Field ${columnIndex}`;
        return rowData;
      },
      {
        id: `${prefix}${rowIndex}`,
        parentId: null,
      },
    );
  });

const columns: Column[] = [
  {
    field: 'text',
    title: 'Text',
    width: 200,
  },
  {
    field: 'select',
    title: '内部组件渲染',
    width: 200,
    type: 'Select',
  },
  {
    field: 'select0',
    title: '加载element-plus组件',
    width: 200,
    cellCoverRender: (column: Column, row: ListItem, tdData: any) => (
      <ElSelect placeholder="Select" size="large" style="width: 100%">
        <ElOption label="11" value="11" />
        <ElOption label="22" value="22" />
      </ElSelect>

      // return {
      //   props: {},
      //   class: '',
      //   style: '',
      //   render: null,
      // }
    ),
  },
  {
    field: 'select1',
    title: '自定义渲染',
    width: 200,
    cellRender: (column: Column, row: ListItem) => <SelectView column={column} row={row} />,
    // 单击渲染
    cellCoverRender: (column: Column, row: ListItem, tdData: any) => (
      <SelectCover column={column} row={row} tdData={tdData} />
    ),
    // 双击渲染
    cellDropdownRender: (column: Column, row: ListItem, tdData: any) => (
      <SelectDropdown column={column} row={row} tdData={tdData} />
    ),
  },
  {
    field: 'global-render',
    title: '全局渲染器渲染',
    width: 200,
    type: 'custom',
  },
  {
    field: 'date',
    title: 'Date',
    width: 200,
    // cellRender: () => <DateView />,
    // // 单击渲染
    // cellCoverRender: () => <DateCover />,
    // // 双击渲染
    // cellDropdownRender: () => <DateDropdown />,
  },
  {
    field: 'person',
    title: 'Person',
    width: 200,
    cellRender: () => <PersonView />,
  },
  {
    field: 'link',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link1',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link2',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link3',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link4',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link5',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link6',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link7',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link8',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link9',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link10',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link11',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link12',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link13',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link14',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link15',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link16',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link17',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link18',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link19',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link20',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link21',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link22',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link23',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link24',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link25',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link26',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link27',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link28',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link29',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link30',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link31',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link32',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link33',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link34',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link35',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link36',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link37',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link38',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link39',
    title: 'Link',
    width: 200,
    cellRender: () => <LinkView />,
  },
  {
    field: 'link40',
    title: 'Link40',
    width: 200,
    cellRender: () => <LinkView />,
  },
  // {
  //   field: 'formula',
  //   title: 'Formula',
  //   width: 100,
  // },
];
const list: ListItem[] = generateList(columns, 200);

const customConfig: any = {
  cellRender: (column: Column, row: ListItem) => {
    if (column?.type === 'custom') {
      // 自定义类型
      return <div>global custom</div>;
    }
  },
  cellCoverRender: (column: Column, row: ListItem) => {
    if (column?.type === 'custom') {
      // 自定义类型
      return <div>global custom</div>;
    }
  },
  cellDropdownRender: (column: Column, row: ListItem) => {
    if (column?.type === 'custom') {
      // 自定义类型
      return <div>global custom</div>;
    }
  },
};

// TODO 单元格模式
list[0].text = {
  // 实际值
  value: 'Text',
  // 渲染函数
  cellRender: (column: Column, row: ListItem) => <SelectView column={column} row={row} />,
  // 单击渲染
  cellCoverRender: (column: Column, row: ListItem, tdData: any) => (
    <SelectCover column={column} row={row} tdData={tdData} />
  ),
  // 双击渲染
  cellDropdownRender: (column: Column, row: ListItem, tdData: any) => (
    <SelectDropdown column={column} row={row} tdData={tdData} />
  ),
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
