import { computed, defineComponent, type PropType } from 'vue';
import { useGridStore } from '@/src/store';
import { ColumnType, type ColumnItem, type ListItem } from '@/src/type';
import { getMergeInfo } from '@/src/utils/merge';
import { useObserverItem } from 'vue-virt-list';
import TitleCell from '@/src/grid-cell/TitleCell.vue';
import TextCell from '@/src/grid-cell/TextCell.vue';
import IndexCell from '@/src/grid-cell/IndexCell.vue';
import CheckboxCell from '@/src/grid-cell/CheckboxCell.vue';
import RadioCell from '@/src/grid-cell/RadioCell.vue';
import ExpandCell from '@/src/grid-cell/ExpandCell.vue';

export default defineComponent({
  name: 'Row',
  props: {
    resizeObserver: {
      type: Object as PropType<ResizeObserver | null>,
      default: null,
    },
    rowIndex: {
      type: Number,
      default: 0,
    },
    row: {
      type: Object as PropType<ListItem>,
      default: () => ({}),
    },
  },
  setup(props) {
    const gridStore = useGridStore();
    // const { headerCellInfo } = gridStore;

    const { itemRefEl } = useObserverItem({
      resizeObserver: props.resizeObserver as ResizeObserver,
    });
    const maxHeight = computed(() => gridStore.watchData.rowHeightMap.get(String(props.row.id)));

    const getCellStyle = (column: ColumnItem) => {
      const fn = gridStore.getUIProps('cellStyle');
      if (fn) {
        return fn({
          row: props.row,
          rowIndex: props.rowIndex,
          column,
          columnIndex: column.colIndex!,
        });
      }
    };

    const getRenderCell = ({
      row,
      rowIndex,
      column,
    }: {
      row: ListItem;
      rowIndex: number;
      column: ColumnItem;
    }) => {
      switch (column.type) {
        case ColumnType.Index:
          return <IndexCell rowIndex={rowIndex} row={row} column={column}></IndexCell>;
        case ColumnType.Title:
          return <TitleCell rowIndex={rowIndex} row={row} column={column}></TitleCell>;
        case ColumnType.Checkbox:
          return <CheckboxCell rowIndex={rowIndex} row={row} column={column}></CheckboxCell>;
        case ColumnType.Radio:
          return <RadioCell rowIndex={rowIndex} row={row} column={column}></RadioCell>;
        case ColumnType.Expand:
          return <ExpandCell rowIndex={rowIndex} row={row} column={column}></ExpandCell>;
        default:
          if (column.bodyRender) return column?.bodyRender?.(column, props.row);
          return <TextCell rowIndex={rowIndex} row={row} column={column}></TextCell>;
      }
    };

    const selectRowId = computed(() => gridStore.getSelectRow());
    const selectColId = computed(() => gridStore.getSelectCol());

    const getRowClass = () => {
      const fn = gridStore.getUIProps('rowClassName');
      if (fn) {
        return fn({
          row: props.row,
          rowIndex: props.rowIndex,
        });
      }
    };

    const getCellClass = (column: ColumnItem) => {
      const fn = gridStore.getUIProps('cellClassName');
      if (fn) {
        return fn({
          row: props.row,
          rowIndex: props.rowIndex,
          column,
          columnIndex: column.colIndex!,
        });
      }
    };

    const getRowStyle = () => {
      const fn = gridStore.getUIProps('rowStyle');
      if (fn) {
        return fn({
          row: props.row,
          rowIndex: props.rowIndex,
        });
      }
    };

    const cls = {
      leftFixed: (column: ColumnItem) => [
        'vue-virt-grid-td',
        'is-fixed',
        'is-fixed--left',
        column._id === selectColId.value && 'current-column',
        gridStore.getSelectionClass(props.rowIndex, column),
        getCellClass(column),
        column.className,
      ],
      leftPadding: () => ['vue-virt-grid-td'],
      main: (column: ColumnItem) => [
        'vue-virt-grid-td',
        column._id === selectColId.value && 'current-column',
        gridStore.getSelectionClass(props.rowIndex, column),
        getCellClass(column),
        column.className,
      ],
      rightPadding: () => ['vue-virt-grid-td'],
      rightFixed: (column: ColumnItem) => [
        'vue-virt-grid-td',
        'is-fixed',
        'is-fixed--right',
        column._id === selectColId.value && 'current-column',
        gridStore.getSelectionClass(props.rowIndex, column),
        getCellClass(column),
        column.className,
      ],
      row: () => [
        'vue-virt-grid-tr',
        gridStore.getUIProps('stripe') && props.rowIndex % 2 && 'vue-virt-grid-tr--striped',
        props.row.id === selectRowId.value && 'current-row',
        getRowClass(),
      ],
    };

    return {
      gridStore,
      maxHeight,
      itemRefEl,
      getCellStyle,
      getRowStyle,
      getRenderCell,
      cls,
    };
  },
  render() {
    const {
      watchData,
      tempMerges,
      merges,
      leftFixedColumns,
      rightFixedColumns,
      centerNormalColumns,
      columnsInfo,
    } = this.gridStore;
    const { headerCellInfo } = columnsInfo;
    const { row, rowIndex, maxHeight, getCellStyle, getRowStyle, getRenderCell, cls } = this;

    const tds = [];

    // 左侧固定列
    if (leftFixedColumns.length > 0) {
      for (let colIndex = 0; colIndex < leftFixedColumns.length; colIndex++) {
        const column = leftFixedColumns[colIndex];

        tds.push(
          <td
            // key={`${watchData.renderKey}-${rowIndex}-lp`}
            data-colidx={column.colIndex}
            data-rowidx={rowIndex}
            class={cls.leftFixed(column)}
            style={`text-align: ${column.align}; left: ${
              headerCellInfo[column._id].fixOffset
            }px; ${getCellStyle(column)}`}
          >
            {getRenderCell({
              row: row,
              rowIndex: rowIndex,
              column: column,
            })}
          </td>,
        );
      }
    }
    // 左侧占位
    if (watchData.renderRect.xs > 0) {
      tds.push(
        <td
          key={`${watchData.renderKey}-${rowIndex}-lp`}
          data-colidx="lp"
          data-rowidx={rowIndex}
          class={'vue-virt-grid-td'}
          style={`height: ${maxHeight}px`}
          rowspan={1}
          colspan={watchData.renderRect.xs}
        ></td>,
      );
    }
    // 主体单元格
    for (let colIndex = watchData.renderRect.xs; colIndex <= watchData.renderRect.xe; colIndex++) {
      const column = centerNormalColumns[colIndex];

      const mergeInfo =
        getMergeInfo(tempMerges, rowIndex, colIndex) ??
        getMergeInfo(merges, rowIndex, colIndex) ??
        undefined;

      // console.log(rowIndex, colIndex);

      // console.log('mergeInfo', mergeInfo, rowIndex, colIndex);

      if (mergeInfo === undefined) {
        // 无合并单元格
        tds.push(
          <td
            key={`${watchData.renderKey}-${rowIndex}-${colIndex}`}
            data-colidx={colIndex + leftFixedColumns.length}
            data-rowidx={rowIndex}
            class={cls.main(column)}
          >
            {/* <TextCell rowIndex={rowIndex} row={row} column={column}></TextCell> */}
            {getRenderCell({
              row: row,
              rowIndex: rowIndex,
              column: column,
            })}
          </td>,
        );
      } else if (mergeInfo.rowIndex === rowIndex && mergeInfo.colIndex === colIndex) {
        // 只渲染合并单元格主体
        const colspan = mergeInfo?.colspan ?? 1;
        const rowspan = mergeInfo?.rowspan ?? 1;

        tds.push(
          <td
            key={`${watchData.renderKey}-${rowIndex}-${colIndex}`}
            data-colidx={colIndex + leftFixedColumns.length}
            data-rowidx={rowIndex}
            class={cls.main(column)}
            colspan={colspan}
            rowspan={rowspan}
          >
            {/* <TextCell rowIndex={rowIndex} row={row} column={column}></TextCell> */}
            {getRenderCell({
              row: row,
              rowIndex: rowIndex,
              column: column,
            })}
          </td>,
        );
        // 直接跳过
        // colIndex += colspan - 1;
      }
    }
    // 右侧占位
    if (watchData.renderRect.xe < centerNormalColumns.length - 1) {
      // console.log('watchData.renderRect.xe', watchData.renderRect.xe, centerNormalColumns.length);
      tds.push(
        <td
          key={`${watchData.renderKey}-${rowIndex}-rp`}
          data-colidx="rp"
          data-rowidx={rowIndex}
          class={'vue-virt-grid-td'}
          style={`height: ${maxHeight}px`}
          rowspan={1}
          // todo why 要减去右侧length呢
          colspan={
            centerNormalColumns.length - watchData.renderRect.xe + 1 - rightFixedColumns.length
          }
        ></td>,
      );
    }
    // 右侧固定列
    if (rightFixedColumns.length > 0) {
      for (let colIndex = 0; colIndex < rightFixedColumns.length; colIndex++) {
        const column = rightFixedColumns[colIndex];
        tds.push(
          <td
            // key={`${watchData.renderKey}-${rowIndex}-lp`}
            data-colidx={colIndex + leftFixedColumns.length + centerNormalColumns.length}
            data-rowidx={rowIndex}
            class={cls.rightFixed(column)}
            style={`text-align: ${column.align}; right: ${
              headerCellInfo[column._id].fixOffset
            }px; ${getCellStyle(column)}`}
          >
            {getRenderCell({
              row: row,
              rowIndex: rowIndex,
              column: column,
            })}
          </td>,
        );
      }
    }

    return (
      <tr class={cls.row()} style={getRowStyle()} ref="itemRefEl">
        {tds}
      </tr>
    );
  },
});
