import type { VNode } from 'vue';
import type { JSX } from 'vue/jsx-runtime';

export enum ColumnSpecType {
  Expand = 'expand',
  Title = 'title',
}
// 单元格类型
export enum CellType {
  Index = 'index',
  Radio = 'radio',
  Checkbox = 'checkbox',
  Text = 'text',
  Link = 'Link',
  Select = 'Select',
  MultiSelect = 'MultiSelect',
  Image = 'Image',
  Person = 'Person',
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
  type?: CellType | ColumnSpecType | string;
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

  headerRender?: (column: Column) => VNode | JSX.Element;
  // 自定义单元格渲染
  customCellRender?: (column: Column, row: ListItem) => VNode | JSX.Element;
  // 自定义单元格覆盖渲染 多提供一个rect信息
  customCellCoverRender?: (column: Column, row: ListItem, extra: any) => VNode | JSX.Element;
  // 自定义单元格下拉渲染
  customCellDropdownRender?: (column: Column, row: ListItem, extra: any) => VNode | JSX.Element;

  bodyActiveRender?: (column: Column, row: ListItem) => VNode | JSX.Element;
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
