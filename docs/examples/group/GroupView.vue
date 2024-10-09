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
        defaultExpandAll
        :groupConfig="groupConfig"
        border
        show-tree-line
      ></Grid>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Grid, type Column, type ListItem, CellType, ColumnSpecType } from 'vue-virt-grid';
import { ElButton, ElSelect, ElOption } from 'element-plus';
import 'element-plus/dist/index.css';

const columns: Column[] = [
  // FIXME: 这里需要想一下是默认第一列就是title还是？
  { field: 'key1', title: 'title1', type: ColumnSpecType.Title, width: 200 },
  { field: 'key7', title: 'title7', type: CellType.Text, width: 200 },
  { field: 'key10', title: 'title10', type: CellType.Text, width: 200 },
  { field: 'key11', title: 'title11', type: CellType.Text, width: 200 },
  { field: 'key12', title: 'title12', type: CellType.Text, width: 200 },
];

const groupConfig = ref<{ columnId: string; sort: 'desc' | 'asc' }[]>([
  {
    columnId: 'key1',
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
      columnId: 'key1',
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
  { value: 'key1', label: 'title1' },
  { value: 'key7', label: 'title7' },
  { value: 'key10', label: 'title10' },
  { value: 'key11', label: 'title11' },
  { value: 'key12', label: 'title12' },
];

const list: ListItem[] = [
  {
    id: '1',
    key0: 'row1-key0',
    key1: 'row1-key1',
    key2: 'row1-key2',
    key3: 'row1-key3',
    key4: 'row1-key4',
    key5: 'row1-key5',
    key6: 'row1-key6',
    key7: 'row1-key7',
    key8: 'row1-key8',
    key9: 'row1-key9',
    key10: 'row1-key10',
    key11: 'row1-key11',
    key12: 'row1-key12',
  },
  {
    id: '2',
    key0: 'row2-key',
    key1: 'row1-key1',
    key2: 'row2-key2',
    key3: 'row2-key3',
    key4: 'row2-key4',
    key5: 'row2-key5',
    key6: 'row2-key6',
    key7: 'row2-key7',
    key8: 'row2-key8',
    key9: 'row2-key9',
    key10: 'row2-key10',
    key11: 'row2-key11',
    key12: 'row2-key12',
    children: [
      {
        id: '3 - children',
        key0: 'row3-key',
        key1: 'row3-key1',
        key2: 'row3-key2',
        key3: 'row3-key3',
        key4: 'row3-key4',
        key5: 'row3-key5',
        key6: 'row3-key6',
        key7: 'row3-key7',
        key8: 'row3-key8',
        key9: 'row3-key9',
        key10: 'row3-key10',
        key11: 'row3-key11',
        key12: 'row3-key12',
        children: [
          {
            id: '4 - children',
            key0: 'row4-key',
            key1: 'row4-key1',
            key2: 'row4-key2',
            key3: 'row4-key3',
            key4: 'row4-key4',
            key5: 'row4-key5',
            key6: 'row4-key6',
            key7: 'row4-key7',
            key8: 'row4-key8',
            key9: 'row4-key9',
            key10: 'row4-key10',
            key11: 'row4-key11',
            key12: 'row4-key12',
          },
        ],
      },
    ],
  },
  {
    id: '18',
    key0: 'row18-key',
    key1: 'row18-key1',
    key2: 'row18-key2',
    key3: 'row18-key3',
    key4: 'row18-key4',
    key5: 'row18-key5',
    key6: 'row18-key6',
    key7: 'row18-key7',
    key8: 'row18-key8',
    key9: 'row18-key9',
    key10: 'row18-key10',
    key11: 'row18-key11',
    key12: 'row18-key12',
  },
  {
    id: '19',
    key0: 'row19-key',
    key1: 'row19-key1',
    key2: 'row19-key2',
    key3: 'row19-key3',
    key4: 'row19-key4',
    key5: 'row19-key5',
    key6: 'row19-key6',
    key7: 'row19-key7',
    key8: 'row19-key8',
    key9: 'row19-key9',
    key10: 'row19-key10',
    key11: 'row19-key11',
    key12: 'row19-key12',
  },
  {
    id: '4',
    key0: 'row4-key',
    key1: 'row4-key1',
    key2: 'row4-key2',
    key3: 'row4-key3',
    key4: 'row4-key4',
    key5: 'row4-key5',
    key6: 'row4-key6',
    key7: 'row4-key7',
    key8: 'row4-key8',
    key9: 'row4-key9',
    key10: 'row4-key10',
    key11: 'row4-key11',
    key12: 'row4-key12',
  },
  {
    id: '5',
    key0: 'row5-key',
    key1: 'row5-key1',
    key2: 'row5-key2',
    key3: 'row5-key3',
    key4: 'row5-key4',
    key5: 'row5-key5',
    key6: 'row5-key6',
    key7: 'row5-key7',
    key8: 'row5-key8',
    key9: 'row5-key9',
    key10: 'row5-key10',
    key11: 'row5-key11',
    key12: 'row5-key12',
  },
  {
    id: '6',
    key0: 'row6-key',
    key1: 'row6-key1',
    key2: 'row6-key2',
    key3: 'row6-key3',
    key4: 'row6-key4',
    key5: 'row6-key5',
    key6: 'row6-key6',
    key7: 'row6-key7',
    key8: 'row6-key8',
    key9: 'row6-key9',
    key10: 'row6-key10',
    key11: 'row6-key11',
    key12: 'row6-key12',
  },
  {
    id: '7',
    key0: 'row7-key',
    key1: 'row7-key1',
    key2: 'row7-key2',
    key3: 'row7-key3',
    key4: 'row7-key4',
    key5: 'row7-key5',
    key6: 'row7-key6',
    key7: 'row7-key7',
    key8: 'row7-key8',
    key9: 'row7-key9',
    key10: 'row7-key10',
    key11: 'row7-key11',
    key12: 'row7-key12',
  },
  {
    id: '8',
    key0: 'row8-key',
    key1: 'row8-key1',
    key2: 'row8-key2',
    key3: 'row8-key3',
    key4: 'row8-key4',
    key5: 'row8-key5',
    key6: 'row8-key6',
    key7: 'row8-key7',
    key8: 'row8-key8',
    key9: 'row8-key9',
    key10: 'row8-key10',
    key11: 'row8-key11',
    key12: 'row8-key12',
  },
  {
    id: '9',
    key0: 'row9-key',
    key1: 'row9-key1',
    key2: 'row9-key2',
    key3: 'row9-key3',
    key4: 'row9-key4',
    key5: 'row9-key5',
    key6: 'row9-key6',
    key7: 'row9-key7',
    key8: 'row9-key8',
    key9: 'row9-key9',
    key10: 'row9-key10',
    key11: 'row9-key11',
    key12: 'row9-key12',
  },
  {
    id: '10',
    key0: 'row10-key',
    key1: 'row10-key1',
    key2: 'row10-key2',
    key3: 'row10-key3',
    key4: 'row10-key4',
    key5: 'row10-key5',
    key6: 'row10-key6',
    key7: 'row10-key7',
    key8: 'row10-key8',
    key9: 'row10-key9',
    key10: 'row10-key10',
    key11: 'row10-key11',
    key12: 'row10-key12',
  },
  {
    id: '11',
    key0: 'row11-key',
    key1: 'row11-key1',
    key2: 'row11-key2',
    key3: 'row11-key3',
    key4: 'row11-key4',
    key5: 'row11-key5',
    key6: 'row11-key6',
    key7: 'row11-key7',
    key8: 'row11-key8',
    key9: 'row11-key9',
    key10: 'row11-key10',
    key11: 'row11-key11',
    key12: 'row11-key12',
  },
  {
    id: '12',
    key0: 'row12-key',
    key1: 'row12-key1',
    key2: 'row12-key2',
    key3: 'row12-key3',
    key4: 'row12-key4',
    key5: 'row12-key5',
    key6: 'row12-key6',
    key7: 'row12-key7',
    key8: 'row12-key8',
    key9: 'row12-key9',
    key10: 'row12-key10',
    key11: 'row12-key11',
    key12: 'row12-key12',
  },
  {
    id: '13',
    key0: 'row13-key',
    key1: 'row13-key1',
    key2: 'row13-key2',
    key3: 'row13-key3',
    key4: 'row13-key4',
    key5: 'row13-key5',
    key6: 'row13-key6',
    key7: 'row13-key7',
    key8: 'row13-key8',
    key9: 'row13-key9',
    key10: 'row13-key10',
    key11: 'row13-key11',
    key12: 'row13-key12',
  },
  {
    id: '14',
    key0: 'row14-key',
    key1: 'row14-key1',
    key2: 'row14-key2',
    key3: 'row14-key3',
    key4: 'row14-key4',
    key5: 'row14-key5',
    key6: 'row14-key6',
    key7: 'row14-key7',
    key8: 'row14-key8',
    key9: 'row14-key9',
    key10: 'row14-key10',
    key11: 'row14-key11',
    key12: 'row14-key12',
  },
  {
    id: '15',
    key0: 'row15-key',
    key1: 'row15-key1',
    key2: 'row15-key2',
    key3: 'row15-key3',
    key4: 'row15-key4',
    key5: 'row15-key5',
    key6: 'row15-key6',
    key7: 'row15-key7',
    key8: 'row15-key8',
    key9: 'row15-key9',
    key10: 'row15-key10',
    key11: 'row15-key11',
    key12: 'row15-key12',
  },
  {
    id: '16',
    key0: 'row16-key',
    key1: 'row16-key1',
    key2: 'row16-key2',
    key3: 'row16-key3',
    key4: 'row16-key4',
    key5: 'row16-key5',
    key6: 'row16-key6',
    key7: 'row16-key7',
    key8: 'row16-key8',
    key9: 'row16-key9',
    key10: 'row16-key10',
    key11: 'row16-key11',
    key12: 'row16-key12',
  },
  {
    id: '17',
    key0: 'row17-key',
    key1: 'row17-key1',
    key2: 'row17-key2',
    key3: 'row17-key3',
    key4: 'row17-key4',
    key5: 'row17-key5',
    key6: 'row17-key6',
    key7: 'row17-key7',
    key8: 'row17-key8',
    key9: 'row17-key9',
    key10: 'row17-key10',
    key11: 'row17-key11',
    key12: 'row17-key12',
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
