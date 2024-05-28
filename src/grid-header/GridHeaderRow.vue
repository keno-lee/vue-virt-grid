<template>
  <tr ref="itemRefEl" :class="cls.row()" :style="getRowStyle()">
    <!-- 左侧固定列 -->
    <template v-for="(column, index) in leftFixedHeaderColumns[headerRowIndex]" :key="column.field">
      <th
        :data-id="column._id"
        :class="cls.leftFixed(column, index)"
        :style="`text-align: ${column.headerAlign || column.align}; left: ${
          headerCellInfo[column._id].left
        }px; ${getCellStyle(column)}`"
        :rowspan="headerCellInfo[column._id]?.rowspan"
        :colspan="headerCellInfo[column._id]?.colspan"
      >
        <component :is="getRenderCell(column)" :column="column"></component>
      </th>
    </template>
    <!-- 左侧虚拟占位 -->
    <th :class="cls.leftPadding()" :colspan="leftCount" v-if="leftCount > 0"></th>
    <!-- 主体 -->
    <template v-for="column in centerColumnsInfo[headerRowIndex]" :key="column.field">
      <th
        :class="cls.main(column)"
        :style="`text-align: ${column.headerAlign || column.align}; ${getCellStyle(column)}`"
        :data-id="column._id"
        :rowspan="headerCellInfo[column._id]?.rowspan"
        :colspan="headerCellInfo[column._id]?.colspan"
      >
        <component :is="getRenderCell(column)" :column="column"></component>
      </th>
    </template>
    <!--  右侧虚拟占位 -->
    <!-- TODO 有点问题 -->
    <th :class="cls.rightPadding" :colspan="rightCount" v-if="rightCount > 0"></th>
    <!-- 右侧固定列 -->
    <template
      v-for="(column, index) in rightFixedHeaderColumns[headerRowIndex]"
      :key="column.field"
    >
      <th
        :data-id="column._id"
        :class="cls.rightFixed(column, index)"
        :style="`text-align: ${column.headerAlign || column.align}; right: ${
          headerCellInfo[column._id].right
        }px; ${getCellStyle(column)}`"
        :rowspan="headerCellInfo[column._id]?.rowspan"
        :colspan="headerCellInfo[column._id]?.colspan"
      >
        <component :is="getRenderCell(column)" :column="column"></component>
      </th>
    </template>
  </tr>
</template>

<script setup lang="ts">
import { inject, computed, ref, onUpdated } from 'vue';
import type { GridStore } from '@/src/store';
import { ColumnType, type ColumnItem } from '@/src/type';

import IndexHeaderCell from './cell/IndexHeaderCell.vue';
// import OrderHeaderCell from './cell/OrderHeaderCell.vue';
import CheckboxHeaderCell from './cell/CheckboxHeaderCell.vue';
import TextHeaderCell from './cell/TextHeaderCell.vue';
import { useResizeColumn } from '@/src/hooks/useResizeColumn';

const gridStore = inject('gridStore') as GridStore;

const {
  headerCellInfo,
  leftFixedHeaderColumns,
  rightFixedHeaderColumns,
  centerNormalHeaderColumns,
} = gridStore;

const cls = {
  leftFixed: (column: ColumnItem, index: number) => [
    'vue-virt-grid-th',
    'is-fixed',
    'is-fixed--left',
    index === leftFixedHeaderColumns[props.headerRowIndex].length - 1 && 'is-last-column',
    getCellClass(column),
    column.className,
  ],
  leftPadding: () => ['vue-virt-grid-th'],
  main: (column: ColumnItem) => ['vue-virt-grid-th', getCellClass(column), column.className],
  rightPadding: () => ['vue-virt-grid-th'],
  rightFixed: (column: ColumnItem, index: number) => [
    'vue-virt-grid-th',
    'is-fixed',
    'is-fixed--right',
    index === 0 && 'is-first-column',
    getCellClass(column),
    column.className,
  ],
  row: () => ['vue-virt-grid-tr', getRowClass()],
};

const props = withDefaults(
  defineProps<{
    headerRowIndex: number;
    currentColumn: any;
    centerColumnsInfo: any;
  }>(),
  {},
);

const leftCount = computed(() => {
  const currentHeaderColumns = props.centerColumnsInfo[props.headerRowIndex];
  const currentHeaderFirstColumn = currentHeaderColumns?.[0];

  // console.log('currentHeaderFirstColumn -------------', currentHeaderFirstColumn);
  return headerCellInfo[currentHeaderFirstColumn?._id]?.leftColspan ?? 0;
});

const rightCount = computed(() => {
  const currentHeaderColumns = props.centerColumnsInfo[props.headerRowIndex];
  const currentHeaderLastColumn = currentHeaderColumns?.[currentHeaderColumns?.length - 1];
  const currentHeaderLastColumnLeftColspan =
    headerCellInfo[currentHeaderLastColumn?._id]?.leftColspan ?? 0;

  const currentCenterNormalHeaderColumns = centerNormalHeaderColumns[props.headerRowIndex];
  const currentHeaderNormalHeaderLastColumn =
    currentCenterNormalHeaderColumns?.[currentCenterNormalHeaderColumns?.length - 1];
  const currentHeaderNormalHeaderLastColumnLeftColspan =
    headerCellInfo[currentHeaderNormalHeaderLastColumn?._id]?.leftColspan ?? 0;

  // console.log(
  //   'currentHeaderLastColumn -------------',
  //   currentHeaderLastColumn,
  //   currentHeaderNormalHeaderLastColumn,
  // );
  return currentHeaderNormalHeaderLastColumnLeftColspan - currentHeaderLastColumnLeftColspan;
});

const fullRow = leftFixedHeaderColumns[props.headerRowIndex].concat(
  centerNormalHeaderColumns[props.headerRowIndex],
  rightFixedHeaderColumns[props.headerRowIndex],
);

const getRowClass = () => {
  const fn = gridStore.getUIProps('headerRowClassName');
  if (fn) {
    return fn({
      row: fullRow,
      rowIndex: props.headerRowIndex,
    });
  }
};

const getRowStyle = () => {
  const fn = gridStore.getUIProps('headerRowStyle');
  if (fn) {
    return fn({
      row: fullRow,
      rowIndex: props.headerRowIndex,
    });
  }
};

const getCellClass = (column: ColumnItem) => {
  const fn = gridStore.getUIProps('headerCellClassName');
  if (fn) {
    return fn({
      row: props.currentColumn,
      rowIndex: props.headerRowIndex,
      column,
      columnIndex: column.colIndex!,
    });
  }
};

const getCellStyle = (column: ColumnItem) => {
  const fn = gridStore.getUIProps('headerCellStyle');
  if (fn) {
    return fn({
      row: props.currentColumn,
      rowIndex: props.headerRowIndex,
      column,
      columnIndex: column.colIndex!,
    });
  }
};

const itemRefEl = ref<HTMLElement>();
onUpdated(() => {
  itemRefEl.value?.querySelectorAll(':scope>th[data-id]').forEach((item) => {
    const colId = item.getAttribute('data-id');
    if (!colId || !headerCellInfo[colId]?.resizable || !headerCellInfo[colId]?.isLeaf) return;
    useResizeColumn(
      item as HTMLElement,
      headerCellInfo[colId]!,
      gridStore.tableRootEl!,
      (width) => {
        if (colId) gridStore.setColumnWidth(colId, width);
      },
    );
  });
});

function getRenderCell(column: ColumnItem) {
  // 如果是被合并的就不要显示任何单元格内容
  // if (headerRowIndex !== undefined && props.columns[headerRowIndex]?.isPlaceholder) {
  //   return TextHeaderCell;
  // }
  switch (column.type) {
    case ColumnType.Index:
      return IndexHeaderCell;
    case ColumnType.Checkbox:
      return CheckboxHeaderCell;
    case ColumnType.Radio:
      return TextHeaderCell;
    // case ColumnType.orderCheckbox:
    //   return OrderHeaderCell;
    default:
      if (column?.headerRender) return column?.headerRender?.(column);
      return TextHeaderCell;
  }
}
</script>
