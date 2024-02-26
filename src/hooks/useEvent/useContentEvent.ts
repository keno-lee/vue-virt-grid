import type { GridStore } from '@/src/store';
import { CellEventEnum, RowEventEnum, HeaderEventEnum, type Column } from '@/src/type';

/**
 * @desc 检查并获取表头信息
 */
const checkAndGetThInfo = (e: MouseEvent, gridStore: GridStore) => {
  const composedPath = e.composedPath();
  const thEl = composedPath.find((el) => (el as HTMLElement).classList?.contains('kita-grid-th'));

  if (thEl) {
    const colId = (thEl as HTMLElement).dataset.id;
    if (colId === undefined) return;
    const targetColumnData = gridStore.headerCellInfo[colId];
    return {
      event: e,
      column: targetColumnData,
    };
  }
  return null;
};

/**
 * @desc 检查并获取单元格信息
 */
const checkAndGetTdInfo = (event: MouseEvent, gridStore: GridStore) => {
  const composedPath = event.composedPath();
  const tdEl = composedPath.find(
    (el) => (el as HTMLElement).classList?.contains('kita-grid-td'),
  ) as HTMLElement;

  if (tdEl) {
    const rowIdx = (tdEl as HTMLElement).dataset.rowidx;
    const colIdx = (tdEl as HTMLElement).dataset.colidx;
    if (rowIdx === undefined || colIdx === undefined) return;
    const rowIdxNum = +rowIdx;
    const colIdxNum = +colIdx;
    const targetColumn = gridStore.flattedColumns[colIdxNum];
    const targetRow = gridStore.originList[rowIdxNum];
    if (targetColumn && targetRow) {
      return {
        event,
        column: targetColumn,
        columnIndex: colIdxNum,
        row: gridStore.originList[rowIdxNum],
        rowIndex: rowIdxNum,
        cell: targetColumn.field ? targetRow[targetColumn.field] : null,
      };
    }
    return null;
  }
};

/**
 * @desc 表格内容区域相关事件，包含单元格、行、表头
 */
export const useContentEvent = (gridStore: GridStore) => {
  const onClick = (e: MouseEvent) => {
    const thData = checkAndGetThInfo(e, gridStore);
    if (thData) {
      gridStore.eventEmitter.emit(HeaderEventEnum.HeaderClick, thData);
      return;
    }
    const tdData = checkAndGetTdInfo(e, gridStore);
    if (tdData) {
      gridStore.eventEmitter.emit(CellEventEnum.CellClick, tdData);
      gridStore.eventEmitter.emit(RowEventEnum.RowClick, tdData);
    }
  };
  const onDblclick = (e: MouseEvent) => {
    const thData = checkAndGetThInfo(e, gridStore);
    if (thData) {
      gridStore.eventEmitter.emit(HeaderEventEnum.HeaderDblclick, thData);
      return;
    }
    const tdData = checkAndGetTdInfo(e, gridStore);
    if (tdData) {
      gridStore.eventEmitter.emit(CellEventEnum.CellDblclick, tdData);
      gridStore.eventEmitter.emit(RowEventEnum.RowDblclick, tdData);
    }
  };
  const onContextmenu = (e: MouseEvent) => {
    const thData = checkAndGetThInfo(e, gridStore);
    if (thData) {
      gridStore.eventEmitter.emit(HeaderEventEnum.HeaderContextmenu, thData);
      return;
    }
    const tdData = checkAndGetTdInfo(e, gridStore);
    if (tdData) {
      gridStore.eventEmitter.emit(CellEventEnum.CellContextmenu, tdData);
      gridStore.eventEmitter.emit(RowEventEnum.RowContextmenu, tdData);
    }
  };
  return {
    onClick,
    onDblclick,
    onContextmenu,
  };
};
