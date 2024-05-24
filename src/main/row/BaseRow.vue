<template>
  <tr ref="itemRefEl" :class="cls.row()" :style="getRowStyle()">
    <!-- 左侧固定列 -->
    <template v-for="(column, index) in mainRenderInfo.leftColumns" :key="column.field">
      <td
        :class="cls.leftFixed(column, index)"
        :style="`text-align: ${column.align}; left: ${
          headerCellInfo[column._id].left
        }px; ${getCellStyle(column)}`"
        :rowspan="column?.rowspan"
        :colspan="column?.colspan"
        :data-rowidx="rowIndex"
        :data-colidx="column.colIndex"
      >
        <component
          :is="getRenderCell(column)"
          :rowIndex="rowIndex"
          :row="row"
          :column="column"
        ></component>
      </td>
    </template>
    <!-- 左侧虚拟占位 -->
    <td
      :class="cls.leftPadding()"
      :colspan="mainRenderInfo.leftCount"
      v-if="mainRenderInfo.leftCount > 0"
      :style="`height: ${maxHeight}px`"
    ></td>
    <!-- 主体 -->
    <template v-for="column in mainRenderInfo.centerColumns" :key="column.field">
      <td
        :class="cls.main(column)"
        :style="`text-align: ${column.align}; ${getCellStyle(column)}`"
        :rowspan="column?.rowspan"
        :colspan="column?.colspan"
        :data-rowidx="rowIndex"
        :data-colidx="column.colIndex"
      >
        <component
          :is="getRenderCell(column)"
          :rowIndex="rowIndex"
          :row="row"
          :column="column"
        ></component>
      </td>
    </template>
    <!--  右侧虚拟占位 -->
    <td
      :class="cls.rightPadding"
      :colspan="mainRenderInfo.rightCount"
      v-if="mainRenderInfo.rightCount > 0"
      :style="`height: ${maxHeight}px`"
    ></td>
    <!-- 右侧固定列 -->
    <template v-for="(column, index) in mainRenderInfo.rightColumns" :key="column.field">
      <td
        :class="cls.rightFixed(column, index)"
        :style="`text-align: ${column.align}; right: ${
          headerCellInfo[column._id].right
        }px; ${getCellStyle(column)}`"
        :rowspan="column?.rowspan"
        :colspan="column?.colspan"
        :data-rowidx="rowIndex"
        :data-colidx="column.colIndex"
      >
        <component
          :is="getRenderCell(column)"
          :rowIndex="rowIndex"
          :row="row"
          :column="column"
        ></component>
      </td>
    </template>
  </tr>
</template>
<script setup lang="ts">
import { inject, computed } from 'vue';
import type { GridStore } from '@/src/store';
import { ColumnType, type ColumnItem, type ListItem } from '@/src/type';
// import { useObserverItem } from 'vue-virt-list';
import { useObserverItem } from '../../virt';
import TitleCell from './cell/TitleCell.vue';
import TextCell from './cell/TextCell.vue';
import { useRenderColumns } from '@/src/hooks/useRenderColumns';
import IndexCell from './cell/IndexCell.vue';
import CheckboxCell from './cell/CheckboxCell.vue';
import RadioCell from './cell/RadioCell.vue';
import ExpandCell from './cell/ExpandCell.vue';

const gridStore = inject('gridStore') as GridStore;
const { headerCellInfo } = gridStore;

const props = withDefaults(
  defineProps<{
    resizeObserver: ResizeObserver | null;
    rowIndex: number;
    row: ListItem;
  }>(),
  {
    resizeObserver: null,
    rowIndex: 0,
  },
);

const selectRowId = computed(() => gridStore.getSelectRow());
const selectColId = computed(() => gridStore.getSelectCol());

const cls = {
  leftFixed: (column: ColumnItem, index: number) => [
    'vue-virt-grid-td',
    'is-fixed',
    'is-fixed--left',
    index === mainRenderInfo.value.leftColumns.length - 1 && 'is-last-column',
    column._id === selectColId.value && 'current-column',
    gridStore.getSelectionClass(props.rowIndex, column),
    getCellClass(column),
    column.className,
  ],
  leftPadding: () => ['vue-virt-grid-td'],
  main: (column: ColumnItem) => [
    'vue-virt-grid-td',
    column._id === selectColId.value && 'current-column',
    gridStore.getSelectionClass(props.rowIndex, column),
    getCellClass(column),
    column.className,
  ],
  rightPadding: () => ['vue-virt-grid-td'],
  rightFixed: (column: ColumnItem, index: number) => [
    'vue-virt-grid-td',
    'is-fixed',
    'is-fixed--right',
    index === 0 && 'is-first-column',
    column._id === selectColId.value && 'current-column',
    gridStore.getSelectionClass(props.rowIndex, column),
    getCellClass(column),
    column.className,
  ],
  row: () => [
    'vue-virt-grid-tr',
    gridStore.getUIProps('stripe') && props.rowIndex % 2 && 'vue-virt-grid-tr--striped',
    props.row.id === selectRowId.value && 'current-row',
    getRowClass(),
  ],
};

const { itemRefEl } = useObserverItem({ resizeObserver: props.resizeObserver as ResizeObserver });

const mainRenderInfo = useRenderColumns(props.rowIndex, gridStore);

const maxHeight = computed(() => gridStore.watchData.rowHeightMap.get(String(props.row.id)));

const getRowClass = () => {
  const fn = gridStore.getUIProps('rowClassName');
  if (fn) {
    return fn({
      row: props.row,
      rowIndex: props.rowIndex,
    });
  }
};

const getCellClass = (column: ColumnItem) => {
  const fn = gridStore.getUIProps('cellClassName');
  if (fn) {
    return fn({
      row: props.row,
      rowIndex: props.rowIndex,
      column,
      columnIndex: column.colIndex!,
    });
  }
};

const getRowStyle = () => {
  const fn = gridStore.getUIProps('rowStyle');
  if (fn) {
    return fn({
      row: props.row,
      rowIndex: props.rowIndex,
    });
  }
};

const getCellStyle = (column: ColumnItem) => {
  const fn = gridStore.getUIProps('cellStyle');
  if (fn) {
    return fn({
      row: props.row,
      rowIndex: props.rowIndex,
      column,
      columnIndex: column.colIndex!,
    });
  }
};

function getRenderCell(column: ColumnItem) {
  switch (column.type) {
    case ColumnType.Index:
      return IndexCell;
    case ColumnType.Title:
      return TitleCell;
    case ColumnType.Checkbox:
      return CheckboxCell;
    case ColumnType.Radio:
      return RadioCell;
    case ColumnType.Expand:
      return ExpandCell;
    // case ColumnType.orderCheckbox:
    //   return IndexCell;
    default:
      if (column.bodyRender) return column?.bodyRender?.(column, props.row);
      return TextCell;
  }
}
</script>
