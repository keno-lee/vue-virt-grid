import {
  CellType,
  type Column,
  type ListItem,
  type MergeCell,
  type SelectedCells,
  type ColumnItem,
} from '@/src/type';

export function isInMergeCell(mergeInfo: MergeCell, rowIndex: number, colIndex: number) {
  return (
    mergeInfo.rowIndex <= rowIndex &&
    mergeInfo.rowIndex + mergeInfo.rowspan - 1 >= rowIndex &&
    mergeInfo.colIndex <= colIndex &&
    mergeInfo.colIndex + mergeInfo.colspan - 1 >= colIndex
  );
}

const mergeMethods = (
  rowIndex: number,
  colIndex: number,
): {
  rowIndex: number;
  colIndex: number;
  rowspan: number;
  colspan: number;
} | null => {
  if (colIndex === 0) {
    if (rowIndex % 2 === 0) {
      return {
        rowIndex: rowIndex,
        colIndex: colIndex,
        rowspan: 2,
        colspan: 1,
      };
    } else {
      return {
        rowIndex: rowIndex - 1,
        colIndex: colIndex,
        // rowspan: 2,
        // colspan: 1,
        rowspan: 0,
        colspan: 0,
      };
    }
  }
  if (colIndex === 1) {
    if (rowIndex % 2 === 1) {
      return {
        rowIndex: rowIndex,
        colIndex: colIndex,
        rowspan: 2,
        colspan: 1,
      };
    } else if (rowIndex > 0) {
      return {
        rowIndex: rowIndex - 1,
        colIndex: colIndex,
        rowspan: 2,
        colspan: 1,
      };
    }
  }
  return null;
};

export function getMergeInfo(
  merges: MergeCell[],
  rowIndex: number,
  colIndex: number,
): {
  rowIndex: number;
  colIndex: number;
  rowspan: number;
  colspan: number;
} | null {
  // 测试methods
  // return mergeMethods(rowIndex, colIndex);
  for (let i = 0; i < merges.length; i += 1) {
    if (isInMergeCell(merges[i], rowIndex, colIndex)) {
      return merges[i];
    }
  }
  return null;
}
