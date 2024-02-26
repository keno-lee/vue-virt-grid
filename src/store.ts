import { computed, reactive, shallowReactive, shallowRef, ref, type ShallowRef } from 'vue';
import {
  ColumnType,
  type Column,
  type ListItem,
  type MergeCell,
  type SelectedCells,
  type ColumnItem,
} from './type';
import { formatColumns, type HeaderCellInfo } from './utils/column';
import { nanoid } from 'nanoid';
import { GridSelection } from './interaction/selection';
import { EventEmitter } from './hooks/useEvent';
import type { VirtListReturn } from 'vue-virt-list';
import { GridScrollZone } from './interaction/scrollZone';
import { useTableEvent } from './hooks/useEvent/useTableEvent';

export type MergeInfoMap = Record<
  number,
  {
    $begin: number;
    $end: number;
    [field: number]: {
      $begin: number;
      $end: number;
      rowspan?: number;
      colspan?: number;
      mergeBy?: [number, number];
    };
  }
>;

export interface IUIProps {
  border: boolean;
  stripe: boolean;
  showTreeLine: boolean;
  selection: boolean;
  highlightCurrentRow: boolean;
  highlightCurrentColumn: boolean;
  defaultExpandAll: boolean;
  headerRowClassName: (data: { row: Column[]; rowIndex: number }) => string;
  headerRowStyle: (data: { row: Column[]; rowIndex: number }) => string;
  headerCellClassName: (data: {
    row: Column[];
    column: Column;
    rowIndex: number;
    columnIndex: number;
  }) => string;
  headerCellStyle: (data: {
    row: Column[];
    column: Column;
    rowIndex: number;
    columnIndex: number;
  }) => string;
  rowClassName: (data: { row: ListItem; rowIndex: number }) => string;
  rowStyle: (data: { row: ListItem; rowIndex: number }) => string;
  cellClassName: (data: {
    row: ListItem;
    column: Column;
    rowIndex: number;
    columnIndex: number;
  }) => string;
  cellStyle: (data: {
    row: ListItem;
    column: Column;
    rowIndex: number;
    columnIndex: number;
  }) => string;
}

export type ISelectionBorderPos =
  | 'left-top'
  | 'top'
  | 'right-top'
  | 'right'
  | 'right-bottom'
  | 'bottom'
  | 'left-bottom'
  | 'left'
  | 'center';

export interface IInteractionProps {
  selectBoxes: Record<string, { left: number; top: number; right: number; bottom: number }>;
  selectCellBorderMap: Record<string, ISelectionBorderPos[]>;
  selectCellClassMap: Record<string, string>;
}

export class GridStore {
  // 响应式数据
  watchData = reactive({
    // 强制渲染
    renderKey: 0,
    // 列渲染起始
    colRenderBegin: 0,
    // 列渲染结束
    colRenderEnd: 0,
    // TODO 可能考虑拿出去做非响应式
    rowHeightMap: new Map(),
    // 父子显示的映射
    foldMap: {} as Record<string, boolean>,
    // 展开行显示的映射
    expandMap: {} as Record<string, boolean>,

    // FIXME： 分组不需要这个，要重新写分组逻辑
    // 配置
    config: {
      rowHeight: 36,
      colWidth: 100,
      // headerHeight: 30,
      // headerWidth: 100,
    },
    fullWidth: 0,
  });

  rowKey: string | number = 'id';

  // 非响应式
  virtualListProps = shallowReactive({
    list: [] as ListItem[],
    minSize: 30,
    itemKey: this.rowKey,
    // buffer: 4,
    renderControl: (begin: number, end: number) => {
      // console.log('renderControl', begin, end, this.bodyMergeMap?.[begin]);
      return {
        begin: this.bodyMergeMap?.[begin]?.$begin ?? begin,
        end: this.bodyMergeMap?.[end]?.$end ?? end,
      };
    },
  });

  uiProps = shallowReactive<IUIProps>({
    border: false,
    stripe: false,
    showTreeLine: false,
    selection: false,
    highlightCurrentRow: false,
    highlightCurrentColumn: false,
    defaultExpandAll: false,
    headerRowClassName: () => '',
    headerRowStyle: () => '',
    headerCellClassName: () => '',
    headerCellStyle: () => '',
    rowClassName: () => '',
    rowStyle: () => '',
    cellClassName: () => '',
    cellStyle: () => '',
  });

  interaction = shallowReactive<IInteractionProps>({
    selectBoxes: {},
    selectCellBorderMap: {},
    selectCellClassMap: {},
  });

  // 原始列数据（带 _id），一般不直接用
  private originColumns = [] as ColumnItem[];
  // 平铺列(子树列)
  flattedColumns = [] as ColumnItem[];
  // 左侧固定列(子树列)
  leftFixedColumns = [] as ColumnItem[];
  // 右侧固定列(子树列)
  rightFixedColumns = [] as ColumnItem[];
  // 中间主要列(子树列)
  centerNormalColumns = [] as ColumnItem[];

  // 这3个是给表头用的
  leftFixedHeaderColumns = [] as ColumnItem[][];
  rightFixedHeaderColumns = [] as ColumnItem[][];
  centerNormalHeaderColumns = [] as ColumnItem[][];

  // 记一下原始的list
  originList = [] as ListItem[];

  // 表身合并信息
  bodyMergeMap = {} as MergeInfoMap;

  headerCellInfo: HeaderCellInfo = {};

  gridSelection = new GridSelection(this);
  gridScrollZone = new GridScrollZone(this);

  currentRowId = ref('');
  currentColumnId = ref('');

  gridScrollingStatus = ref('is-scrolling-none');

  tableRootEl: HTMLElement | undefined;
  virtualListRef: VirtListReturn<ListItem<Record<string, string>>> | undefined;

  gridRowMap: Record<string, ListItem> = {};

  // 用于内部事件的触发
  eventEmitter = new EventEmitter();

  constructor() {
    this.gridSelection.on(this.handleSelectionChange);
  }

  forceUpdate() {
    this.watchData.renderKey += 1;
    console.log('forceUpdate');
  }

  setRowKey(key: string | number) {
    this.rowKey = key;
    this.virtualListProps.itemKey = key;
  }

  setRowMinHeight(minHeight: number) {
    this.virtualListProps.minSize = minHeight;
  }

  setColumns(columns: Column[]) {
    // 存储最原始的列
    // 格式化列信息
    const {
      leftFixedColumns,
      rightFixedColumns,
      centerNormalColumns,
      flattedColumns,
      headerCellInfo,
      originColumns,

      leftFixedHeaderColumns,
      rightFixedHeaderColumns,
      centerNormalHeaderColumns,
    } = formatColumns(columns);

    this.leftFixedColumns = leftFixedColumns;
    this.rightFixedColumns = rightFixedColumns;
    this.centerNormalColumns = centerNormalColumns;
    this.flattedColumns = flattedColumns;
    this.headerCellInfo = headerCellInfo;
    this.originColumns = originColumns;

    this.leftFixedHeaderColumns = leftFixedHeaderColumns;
    this.rightFixedHeaderColumns = rightFixedHeaderColumns;
    this.centerNormalHeaderColumns = centerNormalHeaderColumns;
    // this.flattedColumns = flattedColumns;
    // // 拿平铺的列进行遍历
    // let leftReduce = 0;
    // this.flattedColumns.forEach((col) => {
    //   if (col.fixed === 'left') {
    //     this.leftFixedColumns.push(Object.assign(col, { left: leftReduce }));
    //     leftReduce += col.width;
    //   } else if (col.fixed === 'right') {
    //     // TODO right的值是要计算出来的
    //     this.rightFixedColumns.push(col);
    //   } else {
    //     this.centerNormalColumns.push(col);
    //   }
    // });
    this.watchData.fullWidth = this.flattedColumns.reduce((a, b) => a + b.width!, 0);
    this.forceUpdate();
  }

  setColumnWidth(id: string, width: number) {
    const column = this.flattedColumns.find((col) => col._id === id);
    if (column) {
      column.width = width;
      this.setColumns(this.originColumns);
    }
  }

  setList(list: ListItem[]) {
    this.virtualListProps.list = list;
  }

  // setConfig(config: GridStore['watchData']['config']) {
  //   this.watchData.config = {
  //     ...this.watchData.config,
  //     ...config,
  //   };
  // }

  setOriginList(list: ListItem[]) {
    this.originList = list;
  }

  setTableRootEl(el: HTMLElement) {
    this.tableRootEl = el;
  }

  // setMergeMethods(mergeMethods: any) {
  //   this.watchData.mergeMethods = mergeMethods;
  // }

  // setMergeCells(mergeCells: any) {
  //   this.watchData.mergeCells = mergeCells;
  //   console.log('mergeCells', mergeCells);
  // }

  generateFlatList() {
    const flattenList: ListItem[] = [];

    const { foldMap, expandMap } = this.watchData;

    const hasExpandCol = !!this.flattedColumns.find((col) => col.type === ColumnType.Expand);

    const defaultExpandAll = this.getUIProps('defaultExpandAll');

    this.gridRowMap = {};

    let level = 0;
    let groupLevel = 0;
    const flat = (list: ListItem[], isGroup = false) => {
      list.forEach((item, index) => {
        if (isGroup) {
          groupLevel += 1;
        }

        const row = { ...item, level, groupLevel, isLastChild: index === list.length - 1 };
        flattenList.push(row);
        this.gridRowMap[row.id] = row;

        if (item?.children && item?.children?.length > 0) {
          level += 1;
          foldMap[item.id] = !defaultExpandAll;
          if (defaultExpandAll) {
            flat(item.children, item.type === 'group');
          }
          level -= 1;
        }

        if (hasExpandCol) {
          expandMap[item.id] = defaultExpandAll;
          if (defaultExpandAll) {
            this.gridRowMap[`${item.id}-expand`] = { id: `${item.id}-expand`, type: 'expand' };
          }
        }

        if (expandMap[item.id]) {
          flattenList.push(this.gridRowMap[`${item.id}-expand`]);
        }
        if (isGroup) {
          groupLevel -= 1;
        }
      });
    };
    flat(this.originList);

    this.setList(flattenList);

    return flattenList;
  }

  resetFlatList(): ListItem[] {
    const flattenList: ListItem[] = [];
    const { foldMap, expandMap } = this.watchData;

    let level = 0;
    let groupLevel = 0;
    const flat = (list: ListItem[], isGroup = false) => {
      list.forEach((item, index) => {
        if (isGroup) {
          groupLevel += 1;
        }

        const row = { ...item, level, groupLevel, isLastChild: index === list.length - 1 };
        flattenList.push(row);
        this.gridRowMap[row.id] = row;

        if (foldMap[item.id] === false && item?.children && item?.children?.length > 0) {
          level += 1;
          flat(item.children, item.type === 'group');
          level -= 1;
        }
        if (expandMap[item.id]) {
          flattenList.push(this.gridRowMap[`${item.id}-expand`]);
        }
        if (isGroup) {
          groupLevel -= 1;
        }
      });
    };
    flat(this.originList);

    this.setList(flattenList);

    return flattenList;
  }

  mergeFunction(rowIndex: number, colIndex: number) {
    if (colIndex === 0) {
      if (rowIndex % 2 === 0) {
        return {
          rowspan: 2,
          colspan: 1,
        };
      } else {
        return {
          rowspan: 0,
          colspan: 0,
        };
      }
    }
  }

  mergeMapConstructorWithFunction() {
    // 填入具体行列数量
    const colLen = 200;
    const rowLen = 10000;
    const res = [];
    console.log(colLen, rowLen);
    for (let i = 0; i < colLen; i++) {
      for (let j = 0; j < rowLen; j++) {
        const mergeCfg = this.mergeFunction(j, i);
        if (mergeCfg) {
          res.push({
            rowIndex: j,
            colIndex: i,
            rowspan: mergeCfg.rowspan,
            colspan: mergeCfg.colspan,
          });
        }
      }
    }
    return this.mergeMapConstructor(res);
  }

  mergeMapConstructor(cellList: MergeCell[]) {
    type MergeInfo = {
      $begin: number;
      $end: number;
      rowspan?: number;
      colspan?: number;
      mergeBy?: [number, number];
    };
    const mergeMap: Record<number, MergeInfo & Record<number, MergeInfo>> = {};
    cellList.forEach((cell) => {
      const { rowIndex, colIndex, rowspan, colspan } = cell;
      if (mergeMap[rowIndex]) {
        mergeMap[rowIndex].$begin = Math.min(mergeMap[rowIndex].$begin, rowIndex);
        mergeMap[rowIndex].$end = Math.max(mergeMap[rowIndex].$end, rowIndex + rowspan - 1);
      } else {
        mergeMap[rowIndex] = {
          $begin: rowIndex,
          $end: rowIndex + rowspan - 1,
        };
      }

      for (let i = rowIndex; i < rowIndex + rowspan; i += 1) {
        for (let j = colIndex; j < colIndex + colspan; j += 1) {
          if (!mergeMap[i]) {
            mergeMap[i] = {
              $begin: rowIndex,
              $end: rowIndex + rowspan - 1,
            };
          } else {
            mergeMap[i].$begin = Math.min(mergeMap[i].$begin, rowIndex);
            mergeMap[i].$end = Math.max(mergeMap[i].$end, rowIndex + rowspan - 1);
          }
          mergeMap[i][j] = {
            $begin: colIndex,
            $end: colIndex + colspan - 1,
            mergeBy: [rowIndex, colIndex],
          };
        }
      }

      mergeMap[rowIndex][colIndex] = {
        $begin: colIndex,
        $end: colIndex + colspan - 1,
        rowspan,
        colspan,
      };
    });
    // console.log('mergeMap', mergeMap);
    return mergeMap;
  }

  groupFoldConstructor(list: ListItem[], conditions: { columnId: string; sort: 'desc' | 'asc' }[]) {
    return this.constructGroup(list, 0, conditions);
  }

  constructGroup(
    list: ListItem[],
    conditionIndex: number,
    conditions: { columnId: string; sort: 'desc' | 'asc' }[],
  ) {
    if (conditionIndex >= conditions.length) {
      return list;
    }

    const { columnId, sort } = conditions[conditionIndex];

    const sortedList = list.sort((a, b) => {
      if (sort === 'desc') {
        return (b[columnId] as string).localeCompare(a[columnId] as string);
      }
      return (a[columnId] as string).localeCompare(b[columnId] as string);
    });

    const res: ListItem[][] = [];
    let subGroup: ListItem[] = [];

    for (let i = 0; i < sortedList.length; i++) {
      const item = sortedList[i];
      if (item[columnId] === subGroup[subGroup.length - 1]?.[columnId]) {
        subGroup.push(item);
      } else {
        if (subGroup.length) {
          res.push(subGroup);
        }
        subGroup = [item];
      }
    }

    if (subGroup.length) {
      res.push(subGroup);
    }

    const groupList: ListItem[] = [];
    res.forEach((item) => {
      const v = item[0][columnId];
      groupList.push({
        id: `group-${columnId}-${nanoid(4)}`,
        type: 'group',
        columnId,
        name: v,
        children: this.constructGroup(item, conditionIndex + 1, conditions),
      });
    });

    return groupList;
  }

  toggleFold(id: string) {
    const { foldMap } = this.watchData;
    foldMap[id] = !foldMap[id];
    this.resetFlatList();
  }

  toggleExpand(id: string) {
    const tableEvents = useTableEvent(this);
    const { expandMap } = this.watchData;
    expandMap[id] = !expandMap[id];
    if (expandMap[id] && !this.gridRowMap[`${id}-expand`]) {
      this.gridRowMap[`${id}-expand`] = { id: `${id}-expand`, type: 'expand' };
    }

    // TODO yihuang 优化下性能用一次遍历解决
    const expandedRowKeys = Object.keys(expandMap)
      .filter((key) => !!expandMap[key])
      .map((id) => this.gridRowMap[id]);

    tableEvents.onExpandChange({ row: this.gridRowMap[id], expandedRows: expandedRowKeys });
    this.resetFlatList();
  }

  setUIProps<T extends keyof IUIProps>(key: T, value: IUIProps[T]) {
    this.uiProps[key] = value;
  }

  getUIProps<T extends keyof IUIProps>(key: T): IUIProps[T] {
    return this.uiProps[key];
  }

  handleSelectionChange = (
    id: string,
    area: { left: number; top: number; right: number; bottom: number },
    isMultiple: boolean,
  ) => {
    const mergedArea = this.expandMergedSelectArea(area);

    let selectBoxes = {
      [id]: mergedArea,
    };

    if (isMultiple) {
      selectBoxes = {
        ...this.interaction.selectBoxes,
        ...selectBoxes,
      };
    }

    const posMap: Record<string, Set<ISelectionBorderPos>> = {};
    const cellBorderMap: Record<string, ISelectionBorderPos[]> = {};

    Object.keys(selectBoxes).forEach((boxId) => {
      const { left, top, right, bottom } = selectBoxes[boxId];
      for (let i = top; i <= bottom; i++) {
        for (let j = left; j <= right; j++) {
          const posId = `${i}-${j}`;
          if (!posMap[posId]) {
            posMap[posId] = new Set();
          }
          if (i === top || i === bottom || j === left || j === right) {
            if (i === top && j === left) {
              posMap[posId].add('left-top');
            }
            if (i === top && j === right) {
              posMap[posId].add('right-top');
            }
            if (i === bottom && j === left) {
              posMap[posId].add('left-bottom');
            }
            if (i === bottom && j === right) {
              posMap[posId].add('right-bottom');
            }
            if (j > left && j < right) {
              if (i === top) {
                posMap[posId].add('top');
              }
              if (i === bottom) {
                posMap[posId].add('bottom');
              }
            }
            if (i > top && i < bottom) {
              if (j === left) {
                posMap[posId].add('left');
              }
              if (j === right) {
                posMap[posId].add('right');
              }
            }
          } else {
            posMap[posId].add('center');
          }
        }
      }
    });

    Object.keys(posMap).forEach((posId) => {
      const poses = posMap[posId];
      if (
        (poses.has('left-top') && poses.has('right-bottom')) ||
        (poses.has('left-bottom') && poses.has('right-top'))
      ) {
        cellBorderMap[posId] = ['left-top', 'right-bottom'];
      } else {
        cellBorderMap[posId] = [...posMap[posId]];
      }
    });

    const cellClass: Record<string, string> = {};
    const selectedCells: SelectedCells[] = [];
    const selectedArea: SelectedCells[][] = [];
    const visitedCellId = new Set<string>();

    Object.keys(selectBoxes).forEach((boxId) => {
      const { left: nLeft, top: nTop, right: nRight, bottom: nBottom } = selectBoxes[boxId];
      const cells = [];
      for (let i = nTop; i <= nBottom; i++) {
        for (let j = nLeft; j <= nRight; j++) {
          const posId = `${i}-${j}`;
          const mergeInfo = this.bodyMergeMap[i]?.[j];
          const colspan = mergeInfo?.colspan;
          const rowspan = mergeInfo?.rowspan;
          cellClass[posId] = this.selectCellClassConstructor(cellBorderMap, i, j, rowspan, colspan);

          if (!mergeInfo || colspan || rowspan) {
            const cellData = {
              row: this.virtualListProps.list[i],
              rowIndex: i,
              column: this.flattedColumns[j],
              columnIndex: j,
            };
            cells.push(cellData);
            if (!visitedCellId.has(posId)) {
              selectedCells.push(cellData);
            }
            visitedCellId.add(posId);
          }
        }
      }
      selectedArea.push(cells);
    });

    const tableEvents = useTableEvent(this);
    tableEvents.onCellSelection({
      areas: selectedArea,
      cells: selectedCells,
    });
    this.interaction.selectBoxes = selectBoxes;
    this.interaction.selectCellBorderMap = cellBorderMap;
    this.interaction.selectCellClassMap = cellClass;
    this.forceUpdate();
  };

  expandMergedSelectArea(area: { left: number; top: number; right: number; bottom: number }) {
    const { left, top, right, bottom } = area;
    const mergedArea = { ...area };

    const visited = new Set<string>();
    const que = [];
    for (let i = top; i <= bottom; i++) {
      for (let j = left; j <= right; j++) {
        que.push([i, j]);
      }
    }

    while (que.length) {
      const [i, j] = que.shift()!;
      const mergeInfo = this.bodyMergeMap[i]?.[j];
      const k = `${i}-${j}`;
      if (visited.has(k)) {
        continue;
      }
      visited.add(k);
      if (mergeInfo) {
        const mergeBy = mergeInfo.mergeBy;
        if (mergeBy) {
          const mergeOrigin = this.bodyMergeMap[mergeBy[0]][mergeBy[1]];
          if (mergeOrigin) {
            mergedArea.left = Math.min(mergedArea.left, mergeBy[1]);
            mergedArea.right = Math.max(mergedArea.right, mergeBy[1] + mergeOrigin.colspan! - 1);
            mergedArea.top = Math.min(mergedArea.top, mergeBy[0]);
            mergedArea.bottom = Math.max(mergedArea.bottom, mergeBy[0] + mergeOrigin.rowspan! - 1);
          }
        } else {
          const { rowspan, colspan } = mergeInfo;
          mergedArea.left = Math.min(mergedArea.left, j);
          mergedArea.right = Math.max(mergedArea.right, j + colspan! - 1);
          mergedArea.top = Math.min(mergedArea.top, i);
          mergedArea.bottom = Math.max(mergedArea.bottom, i + rowspan! - 1);
        }

        const { left, top, right, bottom } = mergedArea;
        for (let i = top; i <= bottom; i++) {
          for (let j = left; j <= right; j++) {
            que.push([i, j]);
          }
        }
      }
    }

    return mergedArea;
  }

  selectCellClassConstructor(
    selectRenderMap: Record<string, ISelectionBorderPos[]>,
    rowIndex: number,
    colIndex: number,
    rowspan = 1,
    colspan = 1,
  ) {
    const id = `${rowIndex}-${colIndex}`;
    let pos = selectRenderMap[id];
    if (pos) {
      if (rowspan > 1 || colspan > 1) {
        const posArr = new Set<ISelectionBorderPos>();
        for (let i = rowIndex; i < rowIndex + rowspan; i++) {
          for (let j = colIndex; j < colIndex + colspan; j++) {
            const subPos = selectRenderMap[`${i}-${j}`];
            if (subPos) {
              subPos.forEach((p) => {
                posArr.add(p);
              });
            }
          }
        }
        if (posArr.has('left-top')) {
          posArr.delete('left');
          posArr.delete('top');
          posArr.delete('center');
        }
        if (posArr.has('right-top')) {
          posArr.delete('right');
          posArr.delete('top');
          posArr.delete('center');
        }
        if (posArr.has('left-bottom')) {
          posArr.delete('left');
          posArr.delete('bottom');
          posArr.delete('center');
        }
        if (posArr.has('right-bottom')) {
          posArr.delete('right');
          posArr.delete('bottom');
          posArr.delete('center');
        }
        if (
          posArr.has('left') ||
          posArr.has('right') ||
          posArr.has('top') ||
          posArr.has('bottom')
        ) {
          posArr.delete('center');
        }

        if (
          (posArr.has('left-top') && posArr.has('right-bottom')) ||
          (posArr.has('left-bottom') && posArr.has('right-top'))
        ) {
          pos = ['left-top', 'right-bottom'];
        } else {
          pos = [...posArr];
        }
      }
      return ['box-selection', ...pos.map((p) => `box-selection__${p}`)].join(' ');
    }
    return '';
  }

  getSelectionClass(rowIndex: number, column: Column) {
    if (!this.getUIProps('selection')) {
      return '';
    }

    const colIndex = column.colIndex;
    const type = column.type;

    if (type === ColumnType.Expand || type === ColumnType.Index || type === ColumnType.Checkbox) {
      return 'kita-grid-cell--unselectable';
    }

    const id = `${rowIndex}-${colIndex}`;
    return this.interaction.selectCellClassMap[id] || '';
  }

  initSelectionElement(el: HTMLElement) {
    this.gridSelection.init(el);
    this.gridScrollZone.init(el);
  }

  getCurrentRow() {
    return this.currentRowId.value;
  }

  setCurrentRow(v: string) {
    if (this.getUIProps('highlightCurrentRow')) {
      this.currentRowId.value = v;
    }
  }

  getCurrentColumn() {
    return this.currentColumnId.value;
  }

  setCurrentColumn(v: string) {
    if (this.getUIProps('highlightCurrentColumn')) {
      this.currentColumnId.value = v;
    }
  }

  setRowSelection(
    areaId = nanoid(4),
    startRowIndex: number,
    endRowIndex: number,
    isMulti: boolean,
  ) {
    this.handleSelectionChange(
      areaId,
      {
        left: 0,
        right: this.flattedColumns.length,
        top: startRowIndex,
        bottom: endRowIndex,
      },
      isMulti,
    );
  }

  setColumnSelection(
    areaId = nanoid(4),
    startColumnIndex: number,
    endColumnIndex: number,
    isMulti: boolean,
  ) {
    this.handleSelectionChange(
      areaId,
      {
        left: startColumnIndex,
        right: endColumnIndex,
        top: 0,
        bottom: this.virtualListProps.list.length,
      },
      isMulti,
    );
  }

  initVirtualListRef(elRef: GridStore['virtualListRef']) {
    this.virtualListRef = elRef;
  }

  calcGridScrollingStatus(scrollLeft: number, scrollWidth: number, clientWidth: number) {
    if (scrollWidth <= clientWidth) {
      this.gridScrollingStatus.value = 'is-scrolling-none';
    } else {
      if (scrollLeft === 0) {
        this.gridScrollingStatus.value = 'is-scrolling-left';
      } else if (scrollLeft + clientWidth === scrollWidth) {
        this.gridScrollingStatus.value = 'is-scrolling-right';
      } else {
        this.gridScrollingStatus.value = 'is-scrolling-middle';
      }
    }
  }
}
