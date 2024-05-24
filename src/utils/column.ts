import { nanoid } from 'nanoid';
import type { Column, ColumnItem } from '../type';

export interface FormatColumns {
  headerCellInfo: HeaderCellInfo;

  flattedColumns: ColumnItem[];
  leftFixedColumns: ColumnItem[];
  rightFixedColumns: ColumnItem[];
  centerNormalColumns: ColumnItem[];
  originColumns: ColumnItem[];

  leftFixedHeaderColumns: ColumnItem[][];
  rightFixedHeaderColumns: ColumnItem[][];
  centerNormalHeaderColumns: ColumnItem[][];
}

export type HeaderCellInfo = Record<
  string | number,
  ColumnItem & {
    rowspan?: number;
    colspan?: number;
    level?: number;
    leftColspan?: number;
    fixed?: 'left' | 'right' | '';
    parentId?: string | number;
    parentColumn?: ColumnItem;
    rendered?: boolean;
    isLeaf?: boolean;
    left?: number;
    right?: number;
  }
>;

export const formatColumns = (originColumns: Column[]): FormatColumns => {
  // console.log('originColumns', originColumns);

  // 只包含最低一层的列
  const leftFixedColumns: ColumnItem[] = [];
  const rightFixedColumns: ColumnItem[] = [];
  const centerNormalColumns: ColumnItem[] = [];
  // 一个所有子节点组成的数组
  // const flattedColumns: ColumnItem[] = [];
  const headerCellInfo: HeaderCellInfo = {};

  // const updateParentInfo = (colId: string, key: 'left' | 'colspan', val: number) => {
  //   if (!colId || !key) return;
  //   const parentColumn = headerCellInfo[colId].parentColumn;
  //   if (!parentColumn) return;
  //   headerCellInfo[parentColumn._id][key] = val;
  //   updateParentInfo(parentColumn._id, key, val);
  // };

  // function getHeaderGroupColSpan(columns: ColumnItem[]) {
  //   let maxColspan = 0;
  //   let maxWidth = 0;

  //   for (const column of columns) {
  //     if (column.children) {
  //       const { colspan, width } = getHeaderGroupColSpan(column.children);
  //       maxColspan += colspan;
  //       maxWidth += width!;
  //     } else {
  //       maxColspan += 1;
  //       maxWidth += column.width!;
  //     }
  //   }

  //   return { colspan: maxColspan, width: maxWidth };
  // }

  // function updateHeaderGroupInfo(
  //   col: ColumnItem,
  //   key: 'headerWidth' | 'headerColspan',
  //   val: number,
  // ) {
  //   // @ts-ignore
  //   headerCellInfo[col._id][key] = val;
  //   if (col.children && col.children.length > 0) {
  //     for (const child of col.children) {
  //       // console.warn('child', child);
  //       updateHeaderGroupInfo(child, key, val);
  //     }
  //   }
  // }

  // function generateHeaderColSpan(columns: ColumnItem[]) {
  //   for (const col of columns) {
  //     if (col.children && col.children.length > 0) {
  //       const { colspan, width } = getHeaderGroupColSpan(col.children);
  //       updateHeaderGroupInfo(col, 'headerColspan', colspan);
  //       updateHeaderGroupInfo(col, 'headerWidth', width);
  //     } else {
  //       updateHeaderGroupInfo(col, 'headerColspan', 1);
  //       updateHeaderGroupInfo(col, 'headerWidth', col.width!);
  //     }
  //   }
  // }

  // generateHeaderColSpan(originColumns as ColumnItem[]);

  // 深度遍历整个 column 将最底层的 column 进行归档
  let maxLevel = 0;
  function dfs({
    columns,
    level = 0,
    parentId,
    parentColumn,
    fixed,
    parentLeftReduce = 0,
  }: {
    columns: Column[];
    level?: number;
    parentId?: number | string;
    parentColumn?: ColumnItem;
    fixed?: 'left' | 'right' | '';
    parentLeftReduce?: number;
  }) {
    maxLevel = Math.max(maxLevel, level);
    // console.log('columns', columns, length);
    let childCountReduce = 0;
    let leftReduce: number = parentLeftReduce;
    columns.forEach((_col) => {
      // TODO 这里给一个默认值
      const column = _col as ColumnItem;
      // dfs 过程中，给每个 column 生成一个唯一 id，变成 ColumnItem 类型
      // 如果已经有 _id ，说明已经设置过了，直接重用
      column._id = column._id || `${column.field || ''}-${nanoid(4)}`;
      column.width = column.width ?? 200;

      headerCellInfo[column._id] = {
        ...column,
      };
      headerCellInfo[column._id].level = level;
      // TODO
      // column.level = level;

      // 需要把root的fixed属性传递给子节点
      if (column.fixed === undefined && fixed) {
        column.fixed = fixed;
        headerCellInfo[column._id].fixed = fixed;
      }
      // 如果父节点是没有fixed的，那么子节点是不允许有fixed的
      if (parentColumn && parentColumn?.fixed === undefined) {
        column.fixed = '';
      }

      if (column.children && column.children?.length > 0) {
        const childCount = dfs({
          columns: column.children,
          level: level + 1,
          parentId: column._id,
          parentColumn: column,
          fixed: column.fixed,
          parentLeftReduce: leftReduce,
        });
        headerCellInfo[column._id].colspan = childCount;
        // TODO
        // column.colspan = childCount;
        childCountReduce += childCount;
      } else {
        // 如果没有子节点，就是最后的子节点
        headerCellInfo[column._id].colspan = 1;
        // TODO
        // column.colspan = 1;
        childCountReduce += 1;
        headerCellInfo[column._id].isLeaf = true;
        // flattedColumns.push(column);

        if (column.fixed === 'left') {
          // headerCellInfo[column._id].left = leftReduce;
          // leftReduce += column.width;
          leftFixedColumns.push(column);
        } else if (column.fixed === 'right') {
          rightFixedColumns.push(column);
        } else {
          centerNormalColumns.push(column);
        }
      }
      if (column.fixed === 'left') {
        headerCellInfo[column._id].left = leftReduce;
        const colSpan = headerCellInfo[column._id].colspan || 1;
        leftReduce += column.width * colSpan;
      }
      if (parentId !== undefined) {
        headerCellInfo[column._id].parentId = parentId;
      }
      if (parentColumn !== undefined) {
        headerCellInfo[column._id].parentColumn = parentColumn;
      }
    });
    return childCountReduce;
  }
  dfs({ columns: originColumns });

  function bfs(columns: ColumnItem[]) {
    // const result: ColumnItem[][] = [];
    const leftFixedHeaderColumns: ColumnItem[][] = [];
    const rightFixedHeaderColumns: ColumnItem[][] = [];
    const centerNormalHeaderColumns: ColumnItem[][] = [];
    const queue = [...columns];
    while (queue.length > 0) {
      const levelFixedLeft: ColumnItem[] = [];
      const levelFixedRight: ColumnItem[] = [];
      const levelMain: ColumnItem[] = [];
      const length = queue.length;

      for (let i = 0; i < length; i++) {
        const column = queue.shift()!;

        headerCellInfo[column._id].rowspan = maxLevel - (headerCellInfo[column._id].level ?? 0) + 1;

        if (column.fixed === 'left') {
          levelFixedLeft.push(column);
        } else if (column.fixed === 'right') {
          levelFixedRight.push(column);
        } else {
          // 似乎没有什么用
          levelMain.push(column);
        }

        if (column.children) {
          headerCellInfo[column._id].rowspan = 1;
          queue.push(...column.children);
        }
      }

      // result.push(level);
      leftFixedHeaderColumns.push(levelFixedLeft);
      rightFixedHeaderColumns.push(levelFixedRight);
      centerNormalHeaderColumns.push(levelMain);
    }

    // console.log('leftFixedHeaderColumns', leftFixedHeaderColumns);
    // console.log('rightFixedHeaderColumns', rightFixedHeaderColumns);
    // console.log('centerNormalHeaderColumns', centerNormalHeaderColumns);

    return {
      // result,
      leftFixedHeaderColumns,
      rightFixedHeaderColumns,
      centerNormalHeaderColumns,
    };
  }

  const { leftFixedHeaderColumns, rightFixedHeaderColumns, centerNormalHeaderColumns } = bfs(
    originColumns as ColumnItem[],
  );
  // 计算右侧fixed的值
  let rightReduce = 0;
  for (let i = rightFixedColumns.length - 1; i >= 0; i--) {
    headerCellInfo[rightFixedColumns[i]._id].right = rightReduce;
    rightReduce += rightFixedColumns[i].width!;
  }

  const flattedColumns: ColumnItem[] = [
    ...leftFixedColumns,
    ...centerNormalColumns,
    ...rightFixedColumns,
  ];
  flattedColumns.forEach((col, index) => {
    col.colIndex = index;
  });

  // console.warn('leftFixedColumns', leftFixedColumns);
  // console.warn('rightFixedColumns', rightFixedColumns);
  // console.warn('centerNormalColumns', centerNormalColumns);
  // console.log('originColumns', originColumns);
  console.log('headerCellInfo', headerCellInfo);

  return {
    headerCellInfo,
    flattedColumns,
    leftFixedColumns,
    rightFixedColumns,
    centerNormalColumns,
    originColumns: originColumns as ColumnItem[],

    leftFixedHeaderColumns,
    rightFixedHeaderColumns,
    centerNormalHeaderColumns,
  };
};
