import type { GridStore } from '@/src/store';
import { CellEventEnum, RowEventEnum, HeaderEventEnum, type Column } from '@/src/type';
import { createPopper, createPopper2 } from '@/src/popper/popper';
import { createApp } from 'vue';

/**
 * @desc 检查并获取表头信息
 */
const checkAndGetThInfo = (e: MouseEvent, gridStore: GridStore) => {
  const composedPath = e.composedPath();
  const thEl = composedPath.find((el) =>
    (el as HTMLElement).classList?.contains('vue-virt-grid-th'),
  );

  if (thEl) {
    const colId = (thEl as HTMLElement).dataset.id;
    if (colId === undefined) return;
    const targetColumnData = gridStore.columnsInfo.headerCellInfo[colId];
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
  const tdEl = composedPath.find((el) =>
    (el as HTMLElement).classList?.contains('vue-virt-grid-td'),
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
        rect: tdEl.getBoundingClientRect(),
        el: tdEl,
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

      gridStore.interactionTest.remove();
      gridStore.interactionTest.coverRender(tdData);
    }
  };
  const onDblclick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const thData = checkAndGetThInfo(e, gridStore);
    if (thData) {
      gridStore.eventEmitter.emit(HeaderEventEnum.HeaderDblclick, thData);
      return;
    }
    const tdData = checkAndGetTdInfo(e, gridStore);
    if (tdData) {
      gridStore.eventEmitter.emit(CellEventEnum.CellDblclick, tdData);
      gridStore.eventEmitter.emit(RowEventEnum.RowDblclick, tdData);

      // 双击
      console.log('dblclick', tdData);
      // gridStore.interactionTest.dropdownRender(tdData);
      // if (tdData.column.customCellDropdownRender !== undefined) {
      //   const app = createApp({
      //     render: () => tdData.column.customCellDropdownRender?.(),
      //   });
      //   const mountEl = document.querySelector('.vue-virt-grid-main') as HTMLElement | null;
      //   if (mountEl) {
      //     createPopper2(tdData.el, app, {
      //       // autoWidth: true,
      //       // autoHeight: true,
      //       placement: 'bottom-start',
      //       mountEl: mountEl,
      //     });
      //   }
      // }
      // gridStore.dropdownEl.style.zIndex = '999';
      // gridStore.dropdownEl.style.position = 'absolute';
      // gridStore.dropdownEl.style.left = '0px';
      // gridStore.dropdownEl.style.top = `${tdData.rect.height + 4}px`;
      // // gridStore.dropdownEl.style.width = `${tdData.rect.width - 1}px`;
      // // gridStore.dropdownEl.style.height = `${tdData.rect.height - 1}px`;
      // createPopper(tdData.el, tdData.column.customCellDropdownRender, gridStore.dropdownEl);
      // tdData.el.append(gridStore.dropdownEl);
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
