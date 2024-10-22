<template>
  <div class="base-view">
    <div class="control-panel">
      <div style="display: flex" v-for="(config, index) in state.groupConfig" :key="index">
        <el-select v-model="config.columnId">
          <el-option
            v-for="item in groupByOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select v-model="config.sort">
          <el-option
            v-for="item in sortOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div>
        <el-button @click="state.groupConfig.push({ columnId: '', sort: 'asc' })"
          >添加分组</el-button
        >
        <el-button @click="state.groupConfig.pop()">删除分组</el-button>
        <el-button type="primary" @click="confirm">确认</el-button>
      </div>
    </div>

    <div style="width: 100%; height: 600px; border: 2px solid var(--color-border)">
      <Grid
        :columns="columns"
        :list="list"
        :options="{
          defaultExpandAll: true,
          border: true,
          groupConfig: groupConfig,
        }"
      ></Grid>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Grid, type Column, type ListItem, CellType } from 'vue-virt-grid';
import { ElButton, ElSelect, ElOption } from 'element-plus';
import 'element-plus/dist/index.css';

const columns: Column[] = [
  { field: 'field1', title: 'title1', type: CellType.Text, width: 200 },
  { field: 'field7', title: 'title7', type: CellType.Text, width: 200 },
  { field: 'field10', title: 'title10', type: CellType.Text, width: 200 },
  { field: 'field11', title: 'title11', type: CellType.Text, width: 200 },
  { field: 'field12', title: 'title12', type: CellType.Text, width: 200 },
];

const groupConfig = ref<{ columnId: string; sort: 'desc' | 'asc' }[]>([
  {
    columnId: 'field1',
    sort: 'asc',
  },
]);

const state = reactive<{
  groupConfig: {
    columnId: string;
    sort: 'desc' | 'asc';
  }[];
}>({
  groupConfig: [
    {
      columnId: 'field1',
      sort: 'asc',
    },
  ],
});

const confirm = () => {
  groupConfig.value = [...state.groupConfig];
};

const sortOptions = [
  { label: '升序', value: 'asc' },
  { label: '降序', value: 'desc' },
];
const groupByOptions = [
  { value: 'field1', label: 'title1' },
  { value: 'field7', label: 'title7' },
  { value: 'field10', label: 'title10' },
  { value: 'field11', label: 'title11' },
  { value: 'field12', label: 'title12' },
];

const list: ListItem[] = [
  {
    id: '1',
    field0: 'row1-field0',
    field1: 'row1-field1',
    field2: 'row1-field2',
    field3: 'row1-field3',
    field4: 'row1-field4',
    field5: 'row1-field5',
    field6: 'row1-field6',
    field7: 'row1-field7',
    field8: 'row1-field8',
    field9: 'row1-field9',
    field10: 'row1-field10',
    field11: 'row1-field11',
    field12: 'row1-field12',
  },
  {
    id: '2',
    field0: 'row2-field',
    field1: 'row1-field1',
    field2: 'row2-field2',
    field3: 'row2-field3',
    field4: 'row2-field4',
    field5: 'row2-field5',
    field6: 'row2-field6',
    field7: 'row2-field7',
    field8: 'row2-field8',
    field9: 'row2-field9',
    field10: 'row2-field10',
    field11: 'row2-field11',
    field12: 'row2-field12',
    children: [
      {
        id: '3 - children',
        field0: 'row3-field',
        field1: 'row3-field1',
        field2: 'row3-field2',
        field3: 'row3-field3',
        field4: 'row3-field4',
        field5: 'row3-field5',
        field6: 'row3-field6',
        field7: 'row3-field7',
        field8: 'row3-field8',
        field9: 'row3-field9',
        field10: 'row3-field10',
        field11: 'row3-field11',
        field12: 'row3-field12',
        children: [
          {
            id: '4 - children',
            field0: 'row4-field',
            field1: 'row4-field1',
            field2: 'row4-field2',
            field3: 'row4-field3',
            field4: 'row4-field4',
            field5: 'row4-field5',
            field6: 'row4-field6',
            field7: 'row4-field7',
            field8: 'row4-field8',
            field9: 'row4-field9',
            field10: 'row4-field10',
            field11: 'row4-field11',
            field12: 'row4-field12',
          },
        ],
      },
    ],
  },
  {
    id: '18',
    field0: 'row18-field',
    field1: 'row18-field1',
    field2: 'row18-field2',
    field3: 'row18-field3',
    field4: 'row18-field4',
    field5: 'row18-field5',
    field6: 'row18-field6',
    field7: 'row18-field7',
    field8: 'row18-field8',
    field9: 'row18-field9',
    field10: 'row18-field10',
    field11: 'row18-field11',
    field12: 'row18-field12',
  },
  {
    id: '19',
    field0: 'row19-field',
    field1: 'row19-field1',
    field2: 'row19-field2',
    field3: 'row19-field3',
    field4: 'row19-field4',
    field5: 'row19-field5',
    field6: 'row19-field6',
    field7: 'row19-field7',
    field8: 'row19-field8',
    field9: 'row19-field9',
    field10: 'row19-field10',
    field11: 'row19-field11',
    field12: 'row19-field12',
  },
  {
    id: '4',
    field0: 'row4-field',
    field1: 'row4-field1',
    field2: 'row4-field2',
    field3: 'row4-field3',
    field4: 'row4-field4',
    field5: 'row4-field5',
    field6: 'row4-field6',
    field7: 'row4-field7',
    field8: 'row4-field8',
    field9: 'row4-field9',
    field10: 'row4-field10',
    field11: 'row4-field11',
    field12: 'row4-field12',
  },
  {
    id: '5',
    field0: 'row5-field',
    field1: 'row5-field1',
    field2: 'row5-field2',
    field3: 'row5-field3',
    field4: 'row5-field4',
    field5: 'row5-field5',
    field6: 'row5-field6',
    field7: 'row5-field7',
    field8: 'row5-field8',
    field9: 'row5-field9',
    field10: 'row5-field10',
    field11: 'row5-field11',
    field12: 'row5-field12',
  },
  {
    id: '6',
    field0: 'row6-field',
    field1: 'row6-field1',
    field2: 'row6-field2',
    field3: 'row6-field3',
    field4: 'row6-field4',
    field5: 'row6-field5',
    field6: 'row6-field6',
    field7: 'row6-field7',
    field8: 'row6-field8',
    field9: 'row6-field9',
    field10: 'row6-field10',
    field11: 'row6-field11',
    field12: 'row6-field12',
  },
  {
    id: '7',
    field0: 'row7-field',
    field1: 'row7-field1',
    field2: 'row7-field2',
    field3: 'row7-field3',
    field4: 'row7-field4',
    field5: 'row7-field5',
    field6: 'row7-field6',
    field7: 'row7-field7',
    field8: 'row7-field8',
    field9: 'row7-field9',
    field10: 'row7-field10',
    field11: 'row7-field11',
    field12: 'row7-field12',
  },
  {
    id: '8',
    field0: 'row8-field',
    field1: 'row8-field1',
    field2: 'row8-field2',
    field3: 'row8-field3',
    field4: 'row8-field4',
    field5: 'row8-field5',
    field6: 'row8-field6',
    field7: 'row8-field7',
    field8: 'row8-field8',
    field9: 'row8-field9',
    field10: 'row8-field10',
    field11: 'row8-field11',
    field12: 'row8-field12',
  },
  {
    id: '9',
    field0: 'row9-field',
    field1: 'row9-field1',
    field2: 'row9-field2',
    field3: 'row9-field3',
    field4: 'row9-field4',
    field5: 'row9-field5',
    field6: 'row9-field6',
    field7: 'row9-field7',
    field8: 'row9-field8',
    field9: 'row9-field9',
    field10: 'row9-field10',
    field11: 'row9-field11',
    field12: 'row9-field12',
  },
  {
    id: '10',
    field0: 'row10-field',
    field1: 'row10-field1',
    field2: 'row10-field2',
    field3: 'row10-field3',
    field4: 'row10-field4',
    field5: 'row10-field5',
    field6: 'row10-field6',
    field7: 'row10-field7',
    field8: 'row10-field8',
    field9: 'row10-field9',
    field10: 'row10-field10',
    field11: 'row10-field11',
    field12: 'row10-field12',
  },
  {
    id: '11',
    field0: 'row11-field',
    field1: 'row11-field1',
    field2: 'row11-field2',
    field3: 'row11-field3',
    field4: 'row11-field4',
    field5: 'row11-field5',
    field6: 'row11-field6',
    field7: 'row11-field7',
    field8: 'row11-field8',
    field9: 'row11-field9',
    field10: 'row11-field10',
    field11: 'row11-field11',
    field12: 'row11-field12',
  },
  {
    id: '12',
    field0: 'row12-field',
    field1: 'row12-field1',
    field2: 'row12-field2',
    field3: 'row12-field3',
    field4: 'row12-field4',
    field5: 'row12-field5',
    field6: 'row12-field6',
    field7: 'row12-field7',
    field8: 'row12-field8',
    field9: 'row12-field9',
    field10: 'row12-field10',
    field11: 'row12-field11',
    field12: 'row12-field12',
  },
  {
    id: '13',
    field0: 'row13-field',
    field1: 'row13-field1',
    field2: 'row13-field2',
    field3: 'row13-field3',
    field4: 'row13-field4',
    field5: 'row13-field5',
    field6: 'row13-field6',
    field7: 'row13-field7',
    field8: 'row13-field8',
    field9: 'row13-field9',
    field10: 'row13-field10',
    field11: 'row13-field11',
    field12: 'row13-field12',
  },
  {
    id: '14',
    field0: 'row14-field',
    field1: 'row14-field1',
    field2: 'row14-field2',
    field3: 'row14-field3',
    field4: 'row14-field4',
    field5: 'row14-field5',
    field6: 'row14-field6',
    field7: 'row14-field7',
    field8: 'row14-field8',
    field9: 'row14-field9',
    field10: 'row14-field10',
    field11: 'row14-field11',
    field12: 'row14-field12',
  },
  {
    id: '15',
    field0: 'row15-field',
    field1: 'row15-field1',
    field2: 'row15-field2',
    field3: 'row15-field3',
    field4: 'row15-field4',
    field5: 'row15-field5',
    field6: 'row15-field6',
    field7: 'row15-field7',
    field8: 'row15-field8',
    field9: 'row15-field9',
    field10: 'row15-field10',
    field11: 'row15-field11',
    field12: 'row15-field12',
  },
  {
    id: '16',
    field0: 'row16-field',
    field1: 'row16-field1',
    field2: 'row16-field2',
    field3: 'row16-field3',
    field4: 'row16-field4',
    field5: 'row16-field5',
    field6: 'row16-field6',
    field7: 'row16-field7',
    field8: 'row16-field8',
    field9: 'row16-field9',
    field10: 'row16-field10',
    field11: 'row16-field11',
    field12: 'row16-field12',
  },
  {
    id: '17',
    field0: 'row17-field',
    field1: 'row17-field1',
    field2: 'row17-field2',
    field3: 'row17-field3',
    field4: 'row17-field4',
    field5: 'row17-field5',
    field6: 'row17-field6',
    field7: 'row17-field7',
    field8: 'row17-field8',
    field9: 'row17-field9',
    field10: 'row17-field10',
    field11: 'row17-field11',
    field12: 'row17-field12',
  },
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
  flex-direction: column;
  gap: 8px;

  .control-panel {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
}
</style>
