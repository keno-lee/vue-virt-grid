<template>
  <div class="base-view">
    <div style="width: 100%; height: 600px; border: 2px solid var(--el-color-border)">
      <Grid
        :columns="columns"
        :list="list"
        :config="customConfig"
        border
        highlightSelectRow
        highlightSelectCol
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
  DateActive,
  LinkView,
  PersonView,
  CellType,
  type TdData,
} from 'vue-virt-grid';
// const generateColumns = (length = 10, prefix = 'column-', props?: any) =>
//   Array.from({ length }).map((_, columnIndex) => ({
//     ...props,
//     field: `${prefix}${columnIndex}`,
//     title: `Column ${columnIndex}`,
//     width: 200,
//   }));
const generateList = (columns: Column[], length = 10000, prefix = 'row-') =>
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
  {
    field: 'text',
    title: 'Text',
    width: 200,
  },
  {
    field: 'select',
    title: 'Select 通过type渲染',
    width: 200,
    type: 'Select',
  },
  {
    field: 'select',
    title: 'Select',
    width: 200,
    customCellRender: () => <SelectView />,
    // 单击渲染
    customCellCoverRender: (tdData: TdData) => <SelectCover tdData={tdData} />,
    // 双击渲染
    customCellDropdownRender: (tdData: TdData) => <SelectDropdown tdData={tdData} />,
    // bodyActiveRender: () => <SelectActive />,
  },
  {
    field: 'date',
    title: 'Date',
    width: 200,
    customCellRender: () => <DateView />,
    // 单击渲染
    customCellCoverRender: () => <SelectCover />,
    // 双击渲染
    customCellDropdownRender: () => <SelectDropdown />,
  },
  {
    field: 'person',
    title: 'Person',
    width: 200,
    customCellRender: () => <PersonView />,
  },
  {
    field: 'link',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link1',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link2',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link3',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link4',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link5',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link1',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link2',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link3',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link4',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link5',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link1',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link2',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link3',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link4',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link5',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link1',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link2',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link3',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link4',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link5',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link1',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link2',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link3',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link4',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link5',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link1',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link2',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link3',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link4',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link5',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link1',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link2',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link3',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link4',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link5',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link1',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link2',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link3',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link4',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link5',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link1',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link2',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link3',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link4',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  {
    field: 'link5',
    title: 'Link',
    width: 200,
    customCellRender: () => <LinkView />,
  },
  // {
  //   field: 'formula',
  //   title: 'Formula',
  //   width: 100,
  // },
];
const list: ListItem[] = generateList(columns, 200);

const customConfig = {
  customCellRender: (tdData: TdData) => {
    if (tdData.column?.type === 'custom') {
      // 自定义类型
      return <div>111</div>;
    }
  },
  customCellCoverRender: (tdData: TdData) => {
    if (tdData.column?.type === 'custom') {
      // 自定义类型
      return <div>111</div>;
    }
  },
  customCellDropdownRender: (tdData: TdData) => {
    if (tdData.column?.type === 'custom') {
      // 自定义类型
      return <div>111</div>;
    }
  },
};

// TODO 单元格模式
list[0].text = {
  // 实际值
  value: 'Text',
  // 渲染函数
  customCellRender: () => <SelectView />,
  // 单击渲染
  customCellCoverRender: () => <SelectCover />,
  // 双击渲染
  customCellDropdownRender: () => <SelectDropdown />,
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
