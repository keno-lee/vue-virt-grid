import type { VNode } from 'vue';
import type { JSX } from 'vue/jsx-runtime';

// 单元格类型
export enum CellType {
  Index = 'index',
  Expand = 'expand',
  Tree = 'tree',
  Radio = 'radio',
  Checkbox = 'checkbox',
  Text = 'text',
  Link = 'link',
  Select = 'select',
  MultiSelect = 'multiSelect',
  Image = 'image',
  Person = 'person',
}
/**
 * 用户配置时的列配置
 */
export type Column = {
  // 数据key-对应list中的key
  field: string;
  // 列标题
  title?: string;
  // 列类型
  type?: CellType | string;
  // 列宽度
  width?: number;
  // 最小列宽度
  minWidth?: number;
  // 最大列宽度
  maxWidth?: number;
  // 是否支持拖拽
  resizable?: boolean;
  // 是否固定
  fixed?: 'left' | 'right' | '';
  // 列对齐方式
  align?: 'left' | 'right' | 'center';
  // 表头对齐方式，如无，生效align
  headerAlign?: 'left' | 'right' | 'center';
  // 嵌套列
  children?: Column[];
  // 列的class
  className?: string;

  index?: (index: number) => number;

  // TODO 铸韬，可以改到headerCellInfo中
  colIndex?: number;

  /**
   * 是否超宽显示...+tooltip 还没用上
   */
  ellipsis?: boolean;
  /**
   * 列排序
   */
  sort?: {
    sortDirections: ('ascend' | 'descend')[];
    sortOrder: 'ascend' | 'descend' | boolean;
    sorter:
      | ((
          a: ListItem,
          b: ListItem,
          extra: { id: string; direction: 'ascend' | 'descend' },
        ) => number)
      | boolean;
  };

  // 自定义单元格渲染
  cellRender?: (column: Column, row: ListItem) => VNode | JSX.Element;
  // 自定义单元格覆盖渲染 多提供一个rect信息
  cellCoverRender?: (column: Column, row: ListItem, extra: any) => VNode | JSX.Element;
  // 自定义单元格下拉渲染
  cellDropdownRender?: (column: Column, row: ListItem, extra: any) => VNode | JSX.Element;
  // [仅存在于column中] 自定义header渲染
  headerRender?: (column: Column) => VNode | JSX.Element;
  // [仅存在于column中] 自定义expand渲染
  expandRender?: (column: Column, row: ListItem) => VNode | JSX.Element;
};

/**
 * 经过格式化后，内部使用的列配置
 */
export type ColumnItem = Column & {
  // 列id，
  _id: string;
  children: ColumnItem[];
};

export interface MergeCell {
  rowIndex: number;
  colIndex: number;
  rowspan: number;
  colspan: number;
}

type CellExtra = {
  type: CellType | string;
  value: string;
};

export type ListItem<T = any> = {
  id: string;
  // 只区分group和item，item包含父子节点
  type?: 'group' | 'expand' | 'item';

  children?: ListItem<T>[];

  level?: number;

  groupLevel?: number;

  isLastChild?: boolean;
} & T;

export type TdData = {
  column: Column;
  columnIndex: number;
  row: ListItem;
  rowIndex: number;
  cell: string | number | CellExtra;
  el: HTMLElement;
  event: Event;
  rect: DOMRect;
};

export enum CellEventEnum {
  CellClick = 'cellClick',
  CellDblclick = 'cellDblclick',
  CellContextmenu = 'cellContextmenu',
}

export enum RowEventEnum {
  RowClick = 'rowClick',
  RowDblclick = 'rowDblclick',
  RowContextmenu = 'rowContextmenu',
}

export enum HeaderEventEnum {
  HeaderClick = 'headerClick',
  HeaderDblclick = 'headerDblclick',
  HeaderContextmenu = 'headerContextmenu',
}

export enum TableEventEnum {
  ExpandChange = 'expandChange',
  BoxSelection = 'boxSelection',
}

// 表头事件
export type HeaderEmits = {
  (
    eventName: HeaderEventEnum.HeaderClick,
    data: {
      event: Event;
      column: Column;
      columnIndex: number;
    },
  ): void;
  (
    eventName: HeaderEventEnum.HeaderDblclick,
    data: {
      event: Event;
      column: Column;
      columnIndex: number;
    },
  ): void;
  (
    eventName: HeaderEventEnum.HeaderContextmenu,
    data: {
      event: Event;
      column: Column;
      columnIndex: number;
    },
  ): void;
};

// 行事件
export type RowEmits = {
  (
    eventName: RowEventEnum.RowClick,
    data: {
      event: Event;
      column: Column;
      row: ListItem;
      rowIndex: number;
    },
  ): void;
  (
    eventName: RowEventEnum.RowDblclick,
    data: {
      event: Event;
      column: Column;
      row: ListItem;
      rowIndex: number;
    },
  ): void;
  (
    eventName: RowEventEnum.RowContextmenu,
    data: {
      event: Event;
      column: Column;
      row: ListItem;
      rowIndex: number;
    },
  ): void;
};

// 单元格事件
export type CellEmits = {
  (
    eventName: CellEventEnum.CellClick,
    data: {
      event: Event;
      column: Column;
      columnIndex: number;
      row: ListItem;
      rowIndex: number;
      cell: string;
    },
  ): void;
  (
    eventName: CellEventEnum.CellDblclick,
    data: {
      column: Column;
      columnIndex: number;
      row: ListItem;
      rowIndex: number;
      cell: string;
    },
  ): void;
  (
    eventName: CellEventEnum.CellContextmenu,
    data: {
      column: Column;
      columnIndex: number;
      row: ListItem;
      rowIndex: number;
      cell: string;
    },
  ): void;
};

// 表格事件
export type TableEmits = {
  (
    eventName: TableEventEnum.ExpandChange,
    data: {
      rowKey: string;
      rowKeys: string[];
    },
  ): void;
  (
    eventName: TableEventEnum.BoxSelection,
    data: {
      areas: SelectedCells[][];
      cells: SelectedCells[];
    },
  ): void;
};

export interface SelectedCells {
  row: ListItem;
  rowIndex: number;
  column: Column;
  columnIndex: number;
}

export interface TableOptions {
  rowKey?: string | number;
  rowMinHeight?: number;

  showHeader?: boolean;
  // TODO 最好分开 树形 or 分组
  defaultExpandAll?: boolean;
  // 是否显示border
  border?: boolean;
  // 是否显示斑马纹
  stripe?: boolean;
  // TODO 样式要重写 是否显示树形线
  showTreeLine?: boolean;

  // 是否高亮当前悬浮行
  highlightHoverRow?: boolean;
  // TODO 好像没必要用
  highlightHoverCol?: boolean;
  // 是否高亮当前选中行
  highlightSelectRow?: boolean;
  // 是否高亮当前选中列
  highlightSelectCol?: boolean;
  // TODO 要改一个命名 是否支持框选
  selection?: boolean;

  // 合并单元格信息
  merges?: MergeCell[];
  // 分组信息
  groupConfig?: { columnId: string; sort: 'desc' | 'asc' }[];
  // 表头行自定义类
  headerRowClassName?: (data: { row: Column[]; rowIndex: number }) => string;
  // 表头行自定义样式
  headerRowStyle?: (data: { row: Column[]; rowIndex: number }) => string;
  // 表头单元格自定义类
  headerCellClassName?: (data: {
    row: Column[];
    column: Column;
    rowIndex: number;
    columnIndex: number;
  }) => string;
  // 表头单元格自定义样式
  headerCellStyle?: (data: {
    row: Column[];
    column: Column;
    rowIndex: number;
    columnIndex: number;
  }) => string;
  // 行自定义类
  rowClassName?: (data: { row: ListItem; rowIndex: number }) => string;
  // 行自定义样式
  rowStyle?: (data: { row: ListItem; rowIndex: number }) => string;
  // 单元格自定义类
  cellClassName?: (data: {
    row: ListItem;
    column: Column;
    rowIndex: number;
    columnIndex: number;
  }) => string;
  // 单元格自定义样式
  cellStyle?: (data: {
    row: ListItem;
    column: Column;
    rowIndex: number;
    columnIndex: number;
  }) => string;
  // 自定义单元格渲染
  cellRender?: (column: Column, row: ListItem, extra: any) => VNode | JSX.Element;
  cellCoverRender?: (column: Column, row: ListItem, extra: any) => VNode | JSX.Element;
  cellDropdownRender?: (column: Column, row: ListItem, extra: any) => VNode | JSX.Element;
  // TODO 还没实现 分组单元格渲染
  groupRender?: (column: Column, row: ListItem) => VNode | JSX.Element;
}

export type CustomRender = Pick<
  TableOptions,
  'cellRender' | 'cellCoverRender' | 'cellDropdownRender'
>;

export interface GridProps {
  columns: Column[];
  list: ListItem[];
  options: TableOptions;
}
