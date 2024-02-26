import { computed } from 'vue';
import { type GridStore } from '../store';

function handleColumns({
  currentRowMergeInfo,
  columns,
  startIndex,
  endIndex,
  offsetIndex = 0,
}: any) {
  const result: any[] = [];
  for (let colIndex = startIndex; colIndex <= endIndex; colIndex++) {
    const column = columns[colIndex];
    if (currentRowMergeInfo?.[colIndex + offsetIndex] === undefined) {
      result.push(column);
    } else if (currentRowMergeInfo?.[colIndex + offsetIndex]?.colspan !== undefined) {
      result.push({
        ...column,
        colspan: currentRowMergeInfo?.[colIndex + offsetIndex]?.colspan,
        rowspan: currentRowMergeInfo?.[colIndex + offsetIndex]?.rowspan,
      });
      colIndex += (currentRowMergeInfo?.[colIndex + offsetIndex]?.colspan ?? 0) - 1;
    }
  }
  return result;
}
/**
 *
 * @param index 当前行在 mergeInfoMap 中的索引
 * @param columns 当前行的所有列
 * @param mergeInfoMap 包含合并单元格的信息
 * @param watchData 包含 colRenderBegin 和 colRenderEnd 的对象，必须是响应式的
 * @returns
 */
const useRenderColumns = (rowIndex: number, gridStore: GridStore): any => {
  // 做成一个 computed
  const data = computed(() => {
    const { watchData, bodyMergeMap, leftFixedColumns, rightFixedColumns, centerNormalColumns } = gridStore;

    const currentRowMergeInfo = bodyMergeMap[rowIndex];

    const mainStartIndex = leftFixedColumns.length;
    const rightStartIndex = mainStartIndex + centerNormalColumns.length;

    // console.log('mainStartIndex', mainStartIndex);
    const leftColumns: any[] = handleColumns({
      currentRowMergeInfo,
      columns: leftFixedColumns,
      startIndex: 0,
      endIndex: leftFixedColumns.length - 1,
      offsetIndex: 0,
    });
    const rightColumns: any[] = handleColumns({
      currentRowMergeInfo,
      columns: rightFixedColumns,
      startIndex: 0,
      endIndex: rightFixedColumns.length - 1,
      offsetIndex: rightStartIndex,
    });
    // const leftCount = currentRowMergeInfo?.[watchData.colRenderBegin + mainStartIndex]?.$begin
    //   ? currentRowMergeInfo?.[watchData.colRenderBegin + mainStartIndex]?.$begin - mainStartIndex
    //   : watchData.colRenderBegin;
    // const rightCount =
    //   centerNormalColumns.length -
    //   1 -
    //   (currentRowMergeInfo?.[watchData.colRenderEnd + mainStartIndex]?.$end
    //     ? currentRowMergeInfo?.[watchData.colRenderEnd + mainStartIndex]?.$end - mainStartIndex
    //     : watchData.colRenderEnd);
    // const centerColumns: any[] = handleColumns({
    //   currentRowMergeInfo,
    //   columns: centerNormalColumns,
    //   startIndex: Math.max(leftCount, 0),
    //   endIndex: watchData.colRenderEnd,
    //   offsetIndex: mainStartIndex,
    // });

    // 先处理左侧悬浮
    // for (let colIndex = 0; colIndex <= leftFixedColumns.length - 1; colIndex++) {
    //   const col = leftFixedColumns[colIndex];
    //   if (mergeInfoMap[rowIndex]?.[colIndex] === undefined) {
    //     leftColumns.push(col);
    //   } else if (mergeInfoMap[rowIndex]?.[colIndex]?.colspan !== undefined) {
    //     leftColumns.push({
    //       ...col,
    //       colspan: mergeInfoMap[rowIndex]?.[colIndex]?.colspan,
    //       rowspan: mergeInfoMap[rowIndex]?.[colIndex]?.rowspan,
    //     });
    //     colIndex += (mergeInfoMap[rowIndex]?.[colIndex]?.colspan ?? 0) - 1;
    //   }
    // }

    // console.log('watchData.colRenderEnd', watchData.colRenderEnd);
    // 再处理中间部分
    // let leftCount = watchData.colRenderBegin + mainStartIndex;
    // if (currentRowMergeInfo?.[leftCount]?.$begin !== undefined) {
    //   leftCount = currentRowMergeInfo?.[leftCount]?.$begin;
    // }
    // leftCount = Math.max(0, leftCount);
    // const actualEndIndex = watchData.colRenderEnd + mainStartIndex;
    // let rightCount = centerNormalColumns.length - 1 - actualEndIndex;
    // if (currentRowMergeInfo?.[rightCount]?.$end !== undefined) {
    //   rightCount -= currentRowMergeInfo?.[rightCount]?.$end;
    // }
    // rightCount = Math.max(0, rightCount);

    const actualBeginIndex = watchData.colRenderBegin + mainStartIndex;
    const $begin =
      currentRowMergeInfo?.[actualBeginIndex]?.$begin !== undefined
        ? currentRowMergeInfo?.[actualBeginIndex]?.$begin
        : actualBeginIndex;
    const leftCount = $begin - mainStartIndex;
    // console.log(rowIndex, currentRowMergeInfo, watchData.colRenderBegin, mainStartIndex, leftCount);

    // const rightCount =
    //   columns.length -
    //   1 -
    //   (mergeInfoMap[rowIndex]?.[watchData.colRenderEnd]?.$end ?? watchData.colRenderEnd);

    const actualEndIndex = watchData.colRenderEnd + mainStartIndex;
    const $end =
      currentRowMergeInfo?.[actualEndIndex]?.$end !== undefined
        ? currentRowMergeInfo?.[actualEndIndex]?.$end
        : actualEndIndex;
    const rightCount = Math.max(0, centerNormalColumns.length - 1 - $end + mainStartIndex);

    // const leftCount =
    //   currentRowMergeInfo?.[]?.$begin !== undefined
    //     ? currentRowMergeInfo?.[watchData.colRenderBegin + mainStartIndex]?.$begin - mainStartIndex
    //     : watchData.colRenderBegin;
    // const rightCount =
    //   centerNormalColumns.length -
    //   1 -
    //   (currentRowMergeInfo?.[watchData.colRenderEnd + mainStartIndex]?.$end !== undefined
    //     ? currentRowMergeInfo?.[watchData.colRenderEnd + mainStartIndex]?.$end - mainStartIndex
    //     : watchData.colRenderEnd);

    const centerColumns: any[] = [];
    for (let colIndex = leftCount; colIndex <= watchData.colRenderEnd; colIndex++) {
      if (currentRowMergeInfo?.[colIndex + mainStartIndex] === undefined) {
        // console.log('不存在合并信息', rowIndex, colIndex, currentRowMergeInfo?.[colIndex]);
        centerColumns.push(centerNormalColumns[colIndex]);
      } else if (currentRowMergeInfo?.[colIndex + mainStartIndex]?.colspan !== undefined) {
        // console.log('存在合并信息', rowIndex, colIndex, currentRowMergeInfo?.[colIndex]);
        centerColumns.push({
          ...centerNormalColumns[colIndex],
          colspan: currentRowMergeInfo?.[colIndex + mainStartIndex]?.colspan,
          rowspan: currentRowMergeInfo?.[colIndex + mainStartIndex]?.rowspan,
        });
        colIndex += (currentRowMergeInfo?.[colIndex + mainStartIndex]?.colspan ?? 1) - 1;
      }
    }
    // 再处理右侧悬浮
    // const rightColumns: any[] = [];
    // for (let colIndex = 0; colIndex <= rightFixedColumns.length - 1; colIndex++) {
    //   const col = rightFixedColumns[colIndex];
    //   if (mergeInfoMap[rowIndex]?.[colIndex + rightStartIndex] === undefined) {
    //     rightColumns.push(col);
    //   } else if (mergeInfoMap[rowIndex]?.[colIndex + rightStartIndex]?.colspan !== undefined) {
    //     rightColumns.push({
    //       ...col,
    //       colspan: mergeInfoMap[rowIndex]?.[colIndex + rightStartIndex]?.colspan,
    //       rowspan: mergeInfoMap[rowIndex]?.[colIndex + rightStartIndex]?.rowspan,
    //     });
    //     colIndex += (mergeInfoMap[rowIndex]?.[colIndex + rightStartIndex]?.colspan ?? 0) - 1;
    //   }
    // }

    // console.log('rightColumns', rowIndex, {
    //   leftColumns,
    //   rightColumns,
    //   centerColumns,
    //   leftCount,
    //   rightCount,
    // });
    return {
      leftColumns,
      rightColumns,
      centerColumns,
      leftCount,
      rightCount,
    };
  });
  return data;
};

export { useRenderColumns };
