import type { GridStore } from '@/src/store';
import { TableEventEnum, type SelectedCells } from '@/src/type';

export const useTableEvent = (gridStore: GridStore) => {
  return {
    onExpandChange(data: { row: any; expandedRows: any[] }) {
      gridStore.eventEmitter.emit(TableEventEnum.ExpandChange, data);
    },
    onCellSelection(data: { areas: SelectedCells[][]; cells: SelectedCells[] }) {
      gridStore.eventEmitter.emit(TableEventEnum.BoxSelection, data);
    },
  };
};
