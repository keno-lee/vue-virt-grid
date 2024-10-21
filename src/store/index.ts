import { reactive, shallowReactive, ref, inject, provide } from 'vue';
import {
  CellType,
  ColumnSpecType,
  type Column,
  type ListItem,
  type MergeCell,
  type SelectedCells,
  type ColumnItem,
  type TableOptions,
  type CustomRender,
  type GridProps,
} from '@/src/type';
import { formatColumns, type HeaderCellInfo } from '@/src/utils/column';
import { nanoid } from 'nanoid';
import { GridSelection } from '@/src/interaction/selection';
import { EventEmitter } from '@/src/hooks/useEvent';
import type { VirtListReturn } from 'vue-virt-list';
import { GridScrollZone } from '@/src/interaction/scrollZone';
import { useTableEvent } from '@/src/hooks/useEvent/useTableEvent';
import { assign, isEqual, merge, pick, unionWith } from 'lodash-es';
import { getMergeInfo } from '@/src/utils/merge';
import { InteractionTest } from './interactionTest';

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
  showHeader: boolean;
  selection: boolean;

  highlightHoverRow: boolean;
  highlightHoverCol: boolean;

  highlightSelectRow: boolean;
  highlightSelectCol: boolean;
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

export interface IColumnsRenderInfo {
  leftFixedColumns: ColumnItem[];
  rightFixedColumns: ColumnItem[];
  centerNormalHeaderColumns: ColumnItem[][];
  leftFixedHeaderColumns: ColumnItem[][];
  rightFixedHeaderColumns: ColumnItem[][];
  headerCellInfo: HeaderCellInfo;
}

const defaultUIProps: IUIProps = {
  border: false,
  stripe: false,
  showTreeLine: false,
  selection: false,
  showHeader: true,
  highlightHoverRow: false,
  highlightHoverCol: false,
  highlightSelectRow: false,
  highlightSelectCol: false,
  defaultExpandAll: false,
  headerRowClassName: () => '',
  headerRowStyle: () => '',
  headerCellClassName: () => '',
  headerCellStyle: () => '',
  rowClassName: () => '',
  rowStyle: () => '',
  cellClassName: () => '',
  cellStyle: () => '',
};

const defaultGridOptions = {
  rowKey: 'id',
  rowMinHeight: 40,
  merges: [] as MergeCell[],
  groupConfig: [] as { columnId: string; sort: 'desc' | 'asc' }[],
  ...defaultUIProps,
} as Required<TableOptions>;

export class GridStore {
  // 响应式数据
  watchData = reactive({
    // 强制渲染
    renderKey: 0,
    // TODO 可能考虑拿出去做非响应式
    rowHeightMap: new Map(),
    // 父子显示的映射
    foldMap: {} as Record<string, boolean>,
    // 展开行显示的映射
    expandMap: {} as Record<string, boolean>,

    // 多数
    checkboxRows: new Set() as Set<ListItem>,
    // 唯一
    radioRow: null as null | ListItem,

    // FIXME 分组不需要这个，要重新写分组逻辑
    // 配置
    config: {
      rowHeight: 36,
      colWidth: 100,
      // headerHeight: 30,
      // headerWidth: 100,
    },
    fullWidth: 0,

    // 可视区域
    originRect: {
      ys: 0,
      ye: 0,
      xs: 0,
      xe: 0,
    },
    // 渲染区域
    renderRect: {
      ys: 0,
      ye: 0,
      xs: 0,
      xe: 0,
    },

    fixedInfo: {
      leftWidth: 0,
      rightWidth: 0,
    },
  });

  rowKey: string | number = 'id';

  // 非响应式
  virtualListProps = shallowReactive({
    list: [] as ListItem[],
    minSize: 40,
    itemKey: this.rowKey,
    // buffer: 4,
    renderControl: (begin: number, end: number) => {
      this.watchData.originRect.ys = begin;
      this.watchData.originRect.ye = end;

      const { ys, ye } = this.calcRect();

      return {
        begin: ys ?? begin,
        end: ye ?? end,
      };
    },
  });

  uiProps = shallowReactive<IUIProps>({
    border: false,
    stripe: false,
    showTreeLine: false,
    selection: false,
    showHeader: true,

    highlightHoverRow: false,
    highlightHoverCol: false,

    highlightSelectRow: false,
    highlightSelectCol: false,
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

  columnsInfo = shallowReactive<IColumnsRenderInfo>({
    leftFixedColumns: [],
    rightFixedColumns: [],
    leftFixedHeaderColumns: [],
    rightFixedHeaderColumns: [],
    centerNormalHeaderColumns: [],
    headerCellInfo: {},
  });

  merges = [] as MergeCell[];
  // 生成渲染合并单元格
  tempMerges = [] as MergeCell[];
  // TODO: zhicheng 这里类型需要优化一下
  bodyMergeMap = {} as Record<string, Record<string, MergeCell & { mergeBy: [number, number] }>>;

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

  gridSelection = new GridSelection(this);
  gridScrollZone = new GridScrollZone(this);

  selectRowId = ref('');
  selectColId = ref('');

  gridScrollingStatus = ref('is-scrolling-none');

  tableRootEl: HTMLElement | undefined;
  virtualListRef: VirtListReturn<ListItem<Record<string, string>>> | undefined;

  gridRowMap: Record<string, ListItem> = {};

  // 用于内部事件的触发
  eventEmitter = new EventEmitter();

  // 交互层
  interactionTest: InteractionTest;

  // TODO: 目前看是不需要响应式的，配置项传入
  customRender: CustomRender = {};

  constructor(props: { columns: Column[]; list: ListItem[]; options: TableOptions }) {
    this.interactionTest = new InteractionTest(this);
    this.initOptions(props.options);
    this.setColumns(props.columns);
  }

  // TODO 仅合并单元格模式需要计算，提升性能
  calcRect(horizontal?: boolean): any {
    // 如果没有合并单元格，就不需要计算了
    if (this.merges.length <= 0) {
      this.watchData.renderRect.xs = this.watchData.originRect.xs;
      this.watchData.renderRect.xe = this.watchData.originRect.xe;
      return { ys: this.watchData.originRect.ys, ye: this.watchData.originRect.ye };
    }

    console.time('calcRect');
    const topMerges: any = [];
    const leftMerges: any = [];
    const rightMerges: any = [];
    const bottomMerges: any = [];
    // 计算出实际渲染的区域（补全rect）
    const oys = this.watchData.originRect.ys;
    const oye = this.watchData.originRect.ye;
    const oxs = this.watchData.originRect.xs;
    const oxe = this.watchData.originRect.xe;

    let rys = this.watchData.originRect.ys;
    let rye = this.watchData.originRect.ye;
    let rxs = this.watchData.originRect.xs;
    let rxe = this.watchData.originRect.xe;

    for (let y = oys; y <= oye; y++) {
      for (let x = oxs; x <= oxe; x++) {
        // 如果是第一行，那么可以算出rys
        if (y === oys) {
          const mergeInfo = getMergeInfo(this.merges, y, x);
          // console.warn('第一行', y, x, mergeInfo);
          if (mergeInfo) {
            const { rowIndex, colIndex, colspan } = mergeInfo;
            rys = Math.min(rys, rowIndex);
            rxs = Math.min(rxs, colIndex);
            rxe = Math.max(rxe, colIndex + colspan - 1);
            // 只有被上面的行合并的单元格才需要加进来
            if (y > rowIndex) {
              topMerges.push(mergeInfo);
            }
          }
        }

        // 左边列，不包含第一行和最后一行
        if (x === oxs) {
          const mergeInfo = getMergeInfo(this.merges, y, x);
          // console.warn('左边列', y, x, mergeInfo);
          if (mergeInfo) {
            const { colIndex } = mergeInfo;
            rxs = Math.min(rxs, colIndex);
            // 只有被左边的列合并的单元格才需要加进来
            if (x > colIndex) {
              leftMerges.push(mergeInfo);
            }
          }
        }

        // 右边列，不包含第一行和最后一行
        if (x === oxe) {
          const mergeInfo = getMergeInfo(this.merges, y, x);
          // console.warn('右边列', y, x, mergeInfo);
          if (mergeInfo) {
            const { colIndex, colspan } = mergeInfo;
            rxe = Math.max(rxe, colIndex + colspan - 1);
            // 只要是有合并信息的都加进去
            rightMerges.push(mergeInfo);
          }
        }

        // 如果是最后一行，那么可以算出rye
        if (y === oye) {
          const mergeInfo = getMergeInfo(this.merges, y, x);
          if (mergeInfo) {
            // 只要是有合并信息的都加进去
            const { rowIndex, rowspan } = mergeInfo;
            // console.warn('最后一行', y, x, mergeInfo);
            rye = Math.max(rye, rowIndex + rowspan - 1);
            // rxs = Math.min(rxs, colIndex);
            // rxe = Math.max(rxe, colIndex + colspan - 1);
            bottomMerges.push(mergeInfo);
          }
        }
      }
    }

    this.watchData.renderRect.ys = rys;
    this.watchData.renderRect.ye = rye;
    this.watchData.renderRect.xs = rxs;
    this.watchData.renderRect.xe = rxe;

    // console.log('原始区域', this.watchData.originRect);
    // console.log('渲染区域', this.watchData.renderRect);

    // console.warn('topMerges', topMerges);
    // console.warn('leftMerges', leftMerges);
    // console.warn('rightMerges', rightMerges);
    // console.warn('bottomMerges', bottomMerges);
    // 顶部
    const placeCells2top: any[] = [];
    if (oys > rys) {
      const unionMerges = unionWith(topMerges, isEqual);
      // console.warn('unionTopMerges', unionMerges);
      // 顶部占位单元格
      placeCells2top.push({
        // 应该从渲染的ys开始
        rowIndex: rys,
        colIndex: rxs,
        rowspan: oys - rys,
        colspan: rxe - rxs + 1,
      });
      // console.log('top原始', placeCells2top[0]);
      // 遍历信息，拆分占位单元格
      unionMerges.forEach((merge) => {
        const { rowIndex, colIndex, colspan } = merge;
        // 拿最后一个单元格拆分
        const last = placeCells2top.pop();
        const {
          rowIndex: rowIndexLast,
          colIndex: colIndexLast,
          rowspan: rowspanLast,
          colspan: colspanLast,
        } = last;
        // 左边可能也不存在
        if (colIndex > colIndexLast) {
          placeCells2top.push({
            rowIndex: rowIndexLast,
            colIndex: colIndexLast,
            rowspan: rowspanLast,
            colspan: colIndex - colIndexLast,
          });
        }
        // 中间，中间可能有可能无
        if (rowIndex > rowIndexLast) {
          placeCells2top.push({
            rowIndex: rowIndexLast,
            colIndex: colIndex,
            rowspan: rowIndex - rowIndexLast,
            colspan: colspan,
          });
        }
        // 右边可能也不存在
        if (colIndex + colspan - 1 < colIndexLast + colspanLast - 1) {
          placeCells2top.push({
            rowIndex: rowIndexLast,
            colIndex: colIndex + colspan,
            rowspan: rowspanLast,
            colspan: colIndexLast + colspanLast - colIndex - colspan,
          });
        }
      });
      // console.warn('placeCells2top', placeCells2top);
    }

    // 左边
    const placeCells2Left: any[] = [];
    if (oxs > rxs) {
      const unionMerges = unionWith(leftMerges, isEqual);
      // console.warn('unionLeftMerges', unionMerges);

      placeCells2Left.push({
        rowIndex: oys,
        colIndex: rxs,
        rowspan: oye - oys + 1,
        colspan: oxs - rxs,
      });
      // console.log('left原始', placeCells2Left[0]);

      // 遍历信息，拆分占位单元格
      unionMerges.forEach((merge) => {
        const { rowIndex, colIndex, rowspan } = merge;
        // 拿最后一个单元格拆分
        const last = placeCells2Left.pop();
        const {
          rowIndex: rowIndexLast,
          colIndex: colIndexLast,
          colspan: colspanLast,
          rowspan: rowspanLast,
        } = last;

        // 上边可能不存在
        if (rowIndex > rowIndexLast) {
          placeCells2Left.push({
            rowIndex: rowIndexLast,
            colIndex: colIndexLast,
            rowspan: rowIndex - rowIndexLast,
            colspan: colspanLast,
          });
        }
        // 中间，中间可能有可能无
        if (colIndex > colIndexLast) {
          placeCells2Left.push({
            rowIndex: rowIndex,
            colIndex: colIndexLast,
            rowspan: rowspan,
            colspan: colIndex - colIndexLast,
          });
        }
        // 下边可能也不存在
        if (rowIndex + rowspan - 1 < rowIndexLast + rowspanLast - 1) {
          placeCells2Left.push({
            rowIndex: rowIndex + rowspan,
            colIndex: colIndexLast,
            rowspan: rowIndexLast + rowspanLast - rowIndex - rowspan,
            colspan: colspanLast,
          });
        }
      });

      // console.warn('placeCells2Left', placeCells2Left);
    }

    // 右边 这里不能用最后一个数作为合并的范围，因为会造成大量的合并单元格信息。不如每行最后一个占位单元格数据量更小
    const placeCells2Right: any[] = [];
    if (oxe < rxe) {
      const unionMerges = unionWith(rightMerges, isEqual);
      // console.warn('unionRightMerges', unionMerges);
      placeCells2Right.push({
        rowIndex: oys,
        colIndex: oxe + 1,
        rowspan: oye - oys + 1,
        colspan: rxe - oxe,
      });
      // console.log('right原始', placeCells2Right[0]);

      // 遍历信息，拆分占位单元格
      unionMerges.forEach((merge) => {
        const { rowIndex, colIndex, rowspan, colspan } = merge;
        // 拿最后一个单元格拆分
        const last = placeCells2Right.pop();
        const {
          rowIndex: rowIndexLast,
          colIndex: colIndexLast,
          colspan: colspanLast,
          rowspan: rowspanLast,
        } = last;
        // 上边可能不存在
        if (rowIndex > rowIndexLast) {
          placeCells2Right.push({
            rowIndex: rowIndexLast,
            colIndex: colIndexLast,
            rowspan: rowIndex - rowIndexLast,
            colspan: colspanLast,
          });
        }
        // 中间，中间可能有可能无
        if (colIndex + colspan - 1 < colIndexLast + colspanLast - 1) {
          placeCells2Right.push({
            rowIndex: rowIndex,
            colIndex: colIndex + colspan,
            rowspan: rowspan,
            colspan: colIndexLast + colspanLast - colIndex - colspan,
          });
        }
        // 下边可能也不存在
        if (rowIndex + rowspan - 1 < rowIndexLast + rowspanLast - 1) {
          placeCells2Right.push({
            rowIndex: rowIndex + rowspan,
            colIndex: colIndexLast,
            rowspan: rowIndexLast + rowspanLast - rowIndex - rowspan,
            colspan: colspanLast,
          });
        }
      });

      // console.warn('placeCells2Right', placeCells2Right);
    }

    // 底边
    const placeCells2Bottom: any[] = [];
    if (oye < rye) {
      const unionMerges = unionWith(bottomMerges, isEqual);
      // console.warn('unionBottomMerges', unionMerges);
      placeCells2Bottom.push({
        rowIndex: oye + 1,
        colIndex: rxs,
        rowspan: rye - oye,
        colspan: rxe - rxs + 1,
      });
      // console.log('placeCells2Bottom', placeCells2Bottom[0]);

      // 遍历信息，拆分占位单元格
      unionMerges.forEach((merge) => {
        const { rowIndex, colIndex, rowspan, colspan } = merge;
        // 拿最后一个单元格拆分
        const last = placeCells2Bottom.pop();
        const {
          rowIndex: rowIndexLast,
          colIndex: colIndexLast,
          colspan: colspanLast,
          rowspan: rowspanLast,
        } = last;
        // 左边可能也不存在
        if (colIndex > colIndexLast) {
          placeCells2Bottom.push({
            rowIndex: rowIndexLast,
            colIndex: colIndexLast,
            rowspan: rowspanLast,
            colspan: colIndex - colIndexLast,
          });
        }
        // 中间，中间可能有可能无
        if (rowIndex + rowspan - 1 < rowIndexLast) {
          placeCells2Bottom.push({
            rowIndex: rowIndexLast,
            colIndex: colIndex,
            rowspan: rowIndexLast + colspanLast - rowIndex - colspan,
            colspan: colspan,
          });
        }
        // 右边可能也不存在
        if (colIndex + colspan - 1 < colIndexLast + colspanLast - 1) {
          placeCells2Bottom.push({
            rowIndex: rowIndexLast,
            colIndex: colIndex + colspan,
            rowspan: rowspanLast,
            colspan: colIndexLast + colspanLast - colIndex - colspan,
          });
        }
      });

      // console.warn('placeCells2Bottom', placeCells2Bottom);
    }

    this.tempMerges = [
      ...placeCells2top,
      ...placeCells2Left,
      ...placeCells2Right,
      ...placeCells2Bottom,
    ];

    // console.log('tempMerges', this.tempMerges);

    // console.warn(`rys: ${rys} rye: ${rye} rxs: ${rxs} rxe: ${rxe}`);
    // 生成占位单元格信息，用于渲染优化

    // console.timeEnd('calcRect');

    if (horizontal) {
      // 手动调用render
      this.virtualListRef?.manualRender(rys, rye);
    }
    this.forceUpdate();

    return {
      ys: rys,
      ye: rye,
    };
  }

  forceUpdate() {
    this.watchData.renderKey += 1;
    console.log('forceUpdate');
  }

  setMerges(merges?: MergeCell[]) {
    this.merges = merges ?? [];
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

      fixedInfo,
    } = formatColumns(columns);

    this.leftFixedColumns = leftFixedColumns;
    this.rightFixedColumns = rightFixedColumns;
    this.centerNormalColumns = centerNormalColumns;
    this.flattedColumns = flattedColumns;
    this.originColumns = originColumns;

    this.watchData.fixedInfo = fixedInfo;
    this.columnsInfo.headerCellInfo = headerCellInfo;
    this.columnsInfo.leftFixedColumns = leftFixedColumns;
    this.columnsInfo.rightFixedColumns = rightFixedColumns;
    this.columnsInfo.leftFixedHeaderColumns = leftFixedHeaderColumns;
    this.columnsInfo.rightFixedHeaderColumns = rightFixedHeaderColumns;
    this.columnsInfo.centerNormalHeaderColumns = centerNormalHeaderColumns;
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

  setCustomRender(customRender: CustomRender) {
    this.customRender = customRender;
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

  getCheckboxRows() {
    return this.watchData.checkboxRows;
  }

  addCheckboxRows(row: ListItem) {
    this.watchData.checkboxRows.add(row);
  }

  deleteCheckboxRows(row: ListItem) {
    this.watchData.checkboxRows.delete(row);
  }

  addAllCheckboxRows() {
    this.watchData.checkboxRows = new Set(this.virtualListProps.list);
    // console.log('addAllCheckboxRows', this.watchData.checkboxRows);
    this.forceUpdate();
  }

  clearCheckboxRows() {
    this.watchData.checkboxRows.clear();
  }

  addRadioRow(row: ListItem) {
    this.watchData.radioRow = row;
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

    const hasExpandCol = !!this.flattedColumns.find((col) => col.type === ColumnSpecType.Expand);

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

  mergeMapConstructor(cellList: MergeCell[]) {}

  groupFoldConstructor(list: ListItem[], conditions: { columnId: string; sort: 'desc' | 'asc' }[]) {
    console.log('groupFoldConstructor', list.length, conditions);
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

  initOptions(options: TableOptions) {
    const uiProps = assign(
      {},
      defaultUIProps,
      pick(options, Object.keys(defaultUIProps)),
    ) as IUIProps;
    this.setUIProps(uiProps);

    this.setRowKey(options?.rowKey ?? defaultGridOptions.rowKey);

    this.setMerges(options.merges);

    this.setRowMinHeight(options.rowMinHeight ?? defaultGridOptions.rowMinHeight);

    this.setCustomRender({
      customCellCoverRender: options.customCellCoverRender,
      customCellRender: options.customCellRender,
      customCellDropdownRender: options.customCellDropdownRender,
    });
  }

  // setUIProps<T extends keyof IUIProps>(key: T, value: IUIProps[T]) {
  //   this.uiProps[key] = value;
  // }

  setUIProps(data: IUIProps) {
    this.uiProps = { ...this.uiProps, ...data };
  }

  getUIProps<T extends keyof IUIProps>(key: T): IUIProps[T] {
    return this.uiProps[key];
  }

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

    if (type === ColumnSpecType.Expand || type === CellType.Index || type === CellType.Checkbox) {
      return 'vue-virt-grid-cell--unselectable';
    }

    const id = `${rowIndex}-${colIndex}`;
    return this.interaction.selectCellClassMap[id] || '';
  }

  initSelectionElement(el: HTMLElement) {
    this.gridSelection.init(el);
    this.gridScrollZone.init(el);
  }

  getSelectRow() {
    return this.selectRowId.value;
  }

  setSelectRow(rowIndex: number) {
    // TODO 后面看看是不是要这个
    if (this.getUIProps('highlightSelectRow')) {
      this.selectRowId.value = this.virtualListProps.list[rowIndex].id;
    }
  }

  getSelectCol() {
    return this.selectColId.value;
  }

  setSelectCol(colIndex: number) {
    if (this.getUIProps('highlightSelectCol')) {
      this.selectColId.value = this.flattedColumns[colIndex]._id;
    }
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

  calcVisibleColumns(scrollLeft: number, clientWidth: number) {
    // console.log('calcVisibleColumns', scrollLeft, clientWidth);
    let colRenderBegin = 0;
    let colRenderEnd = 0;
    let currentLeft = 0;
    let beginFlag = false;
    for (let i = 0; i < this.centerNormalColumns.length; i++) {
      const currentWidth = this.centerNormalColumns[i].width!;
      // console.log('currentWidth', currentLeft, scrollLeft, scrollLeft + clientWidth);
      if (currentLeft >= scrollLeft && !beginFlag) {
        colRenderBegin = i;
        beginFlag = true;
      } else if (currentLeft >= scrollLeft + clientWidth) {
        colRenderEnd = i;
        // console.log('计算结束', colRenderBegin, colRenderEnd);
        break;
      }
      colRenderEnd = i;
      currentLeft += currentWidth;
    }
    // 给首尾各加一个buffer
    // TODO 这里可以减少点
    colRenderBegin = Math.max(0, colRenderBegin - 1);
    colRenderEnd = Math.min(this.centerNormalColumns.length - 1, colRenderEnd + 1);

    if (
      colRenderBegin !== this.watchData.originRect.xs ||
      colRenderEnd !== this.watchData.originRect.xe
    ) {
      console.warn('横向计算结束', colRenderBegin, colRenderEnd);

      this.watchData.originRect.xs = colRenderBegin;
      this.watchData.originRect.xe = colRenderEnd;

      this.calcRect(true);
    }
  }

  initDataList(list: ListItem[]) {
    this.setList([]);
    setTimeout(() => {
      this.setOriginList(list);
      this.generateFlatList();
    });
  }
}

export const useGridStore = (props?: GridProps) => {
  if (props) {
    // 初始化时会传入 props
    const gridStore = new GridStore(props);
    provide('gridStore', gridStore);
    return gridStore;
  }
  return inject<GridStore>('gridStore')!;
};
