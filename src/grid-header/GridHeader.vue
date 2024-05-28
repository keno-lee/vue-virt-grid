<template>
  <GridHeaderRow
    v-for="(currentColumn, index) in leftFixedHeaderColumns"
    :key="index"
    :currentColumn="currentColumn"
    :headerRowIndex="index"
    :centerColumnsInfo="centerColumnsInfo"
  >
  </GridHeaderRow>
</template>
<script lang="ts" setup>
import { inject, computed } from 'vue';
import type { GridStore } from '@/src/store';
import GridHeaderRow from './GridHeaderRow.vue';
import type { ColumnItem } from '@/src/type';

const gridStore = inject('gridStore') as GridStore;
const { leftFixedHeaderColumns } = gridStore;

const centerColumnsInfo = computed(() => {
  // console.log(
  //   'calcHeaderVisibleColumns',
  //   gridStore.watchData.colRenderBegin,
  //   gridStore.watchData.colRenderEnd,
  // );

  const { centerNormalColumns, centerNormalHeaderColumns, headerCellInfo } = gridStore;

  const centerColumnsInfo: ColumnItem[][] = [];

  const resetRender = (col: ColumnItem) => {
    headerCellInfo[col._id].rendered = false;
    const { parentColumn } = headerCellInfo[col._id];
    if (parentColumn) {
      resetRender(parentColumn);
      // headerCellInfo[parentColumn._id].rendered = false;
    }
  };
  centerNormalColumns.forEach((col) => {
    resetRender(col);
    // headerCellInfo[col._id].rendered = false;
    // const { parentColumn } = headerCellInfo[col._id];
    // if (parentColumn) {
    //   headerCellInfo[parentColumn._id].rendered = false;
    // }
  });

  const renderHeader = (column: ColumnItem) => {
    const { level = 0, parentColumn } = headerCellInfo[column._id];
    if (centerColumnsInfo[level] === undefined) {
      centerColumnsInfo[level] = [];
    }
    if (centerColumnsInfo[level].indexOf(column) < 0) {
      centerColumnsInfo[level].push(column);
      headerCellInfo[column._id].rendered = true;
    }

    // 如果有父级，那么就要渲染父级
    if (parentColumn) {
      renderHeader(parentColumn);
    }
  };

  // console.log('headerCellInfo',  JSON.parse(JSON.stringify(headerCellInfo)))
  // 这些都是要渲染的表头单元格
  for (let i = gridStore.watchData.renderRect.xs; i <= gridStore.watchData.renderRect.xe; i++) {
    const column = centerNormalColumns[i];
    renderHeader(column);
    // // console.log('要渲染', column._id, headerCellInfo[column._id]);
    // const { level = 0, parentColumn } = headerCellInfo[column._id];
    // if (centerColumnsInfo[level] === undefined) {
    //   centerColumnsInfo[level] = [];
    // }
    // centerColumnsInfo[level].push(column);
    // headerCellInfo[column._id].rendered = true;

    // // 如果有父级，那么就要渲染父级
    // if (parentColumn) {
    //   // console.log('要渲染', parentColumn, headerCellInfo[parentColumn.id]);
    //   const { level: parentLevel = 0 } = headerCellInfo[parentColumn._id];
    //   console.warn('parent-1', parentColumn, parentLevel, centerColumnsInfo[parentLevel]);
    //   if (centerColumnsInfo[parentLevel] === undefined) {
    //     centerColumnsInfo[parentLevel] = [];
    //   }
    //   if (centerColumnsInfo[parentLevel].indexOf(parentColumn) < 0) {
    //     // 如果不存在，那么就加入渲染
    //     centerColumnsInfo[parentLevel].push(parentColumn);
    //     headerCellInfo[parentColumn._id].rendered = true;
    //   }
    // }
  }

  const baseLeftPadding: number[] = [];
  const maxLevel = centerNormalHeaderColumns.length;

  // 计算各层级的左边距
  for (let i = 0; i < maxLevel; i++) {
    baseLeftPadding.push(0);
  }

  /**
   * 从上往下，从左往右
   * 如果该表头节点未渲染，且为父节点/父节点已渲染
   * 则在当期及以下层级的左边距加上该表头节点的colspan
   * 当遇到渲染节点后停止
   */
  for (let i = 0; i < maxLevel; i++) {
    // 获取当前层的节点
    const row = centerNormalHeaderColumns[i];
    for (let j = 0; j < row.length; j++) {
      // 获取当前节点的每一列
      const info = headerCellInfo[row[j]._id];
      const parentInfo = info.parentId ? headerCellInfo[info.parentId] : undefined;
      if (!info.rendered && (!parentInfo || parentInfo.rendered)) {
        for (let k = i; k < maxLevel; k++) {
          baseLeftPadding[k] += info.colspan || 1;
        }
      } else {
        break;
      }
    }
  }

  /**
   * 从上往下，从左往右
   * 如果该表头节点已渲染，则该表头节点的leftColspan等于当前层级位于该节点左边的所有表头节点的colspan和
   * 右边未渲染的表头节点计算相同以正常计算右边固定列的位置
   */
  for (let i = 0; i < maxLevel; i++) {
    const row = centerNormalHeaderColumns[i];
    let isLeftPadding = true;
    for (let j = 0; j < row.length; j++) {
      const info = headerCellInfo[row[j]._id];
      if (info.rendered || !isLeftPadding) {
        info.leftColspan = baseLeftPadding[i];
        baseLeftPadding[i] += info.colspan || 1;
        isLeftPadding = false;
      }
    }
  }

  // console.log('centerColumnsInfo =======================', centerColumnsInfo);
  return centerColumnsInfo;
});
</script>
