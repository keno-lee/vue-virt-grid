<template>
  <div class="vue-virt-grid-root" ref="rootRefEl">
    <div class="vue-virt-grid-main" ref="clientRefEl" data-id="client" :class="cls.body">
      <!-- height skeleton -->
      <div :style="`float:left; height: ${vlReactiveData.listTotalSize}px`"></div>
      <!-- table main -->
      <table
        :class="cls.table"
        cellspacing="0"
        cellpadding="0"
        :style="`width: ${fullWidth}px;`"
        ref="tableRefEl"
        @mousedown="onMouseDown"
        @click="onClick"
        @dblclick="onDblclick"
        @contextmenu="onContextmenu"
      >
        <colgroup :key="gridStore.watchData.renderKey">
          <col v-for="column in leftFixedColumns" :key="column._id" :width="column.width" />
          <col v-for="column in centerNormalColumns" :key="column._id" :width="column.width" />
          <col v-for="column in rightFixedColumns" :key="column._id" :width="column.width" />
        </colgroup>

        <thead
          ref="stickyHeaderRefEl"
          data-id="stickyHeader"
          class="vue-virt-grid-header"
          :style="`height: ${headerHeight}px;`"
          v-if="props.showHeader"
        >
          <GridHeader></GridHeader>
        </thead>
        <tbody class="vue-virt-grid-body">
          <!-- TODO 未来这里会给顶部滚动行的渲染 -->
          <!-- <tr style="position: sticky; top: 40px; z-index: 20; background-color: red;">
            <td>111</td>
            <td>111</td>
            <td>111</td>
            <td>111</td>
            <td>111</td>
            <td>111</td>
            <td>111</td>
            <td>111</td>
          </tr>
          -->

          <tr :style="`height: ${vlReactiveData.virtualSize}px;`"></tr>

          <template v-for="(row, index) in renderList" :key="row.id">
            <component
              :resizeObserver="resizeObserver"
              :is="getComponent(row)"
              :row="row"
              :rowIndex="index + vlReactiveData.renderBegin"
              :data-id="row.id"
              :data-level="row.level"
            ></component>
          </template>
        </tbody>
        <!-- 下一期功能 t-foot -->
        <!-- <tfoot
          ref="stickyFooterRefEl"
          data-id="stickyFooter"
          class="vue-virt-grid-footer"
          style="
            position: sticky;
            bottom: 0;
            z-index: 6;
            background-color: red;
            height: 30px;
            min-height: 30px;
          "
        >
          <tr>
            <td v-for="column in flattedColumns" :key="column.id">{{ column.id }}</td>
          </tr>
        </tfoot> -->
      </table>
    </div>
    <div class="vue-virt-grid-mask" v-if="!list.length">
      <slot name="empty"><p>No Data</p></slot>
    </div>
  </div>
</template>
<script setup lang="tsx">
import { onMounted, provide, ref, watch, computed, onBeforeUnmount } from 'vue';
import { useVirtList } from 'vue-virt-list';
import { GridStore } from '@/src/store';
import { useContentEvent } from '@/src/hooks/useEvent';

import GridHeader from '@/src/grid-header/GridHeader.vue';
// import BaseRow from '@/src/grid-row/BaseRow.vue';
import BaseRow from '@/src/grid-row/BaseRow';
import GroupRow from '@/src/grid-row/GroupRow.vue';
import ExpandRow from '@/src/grid-row/ExpandRow.vue';
import {
  RowEventEnum,
  type CellEmits,
  type RowEmits,
  type TableEmits,
  CellEventEnum,
  type HeaderEmits,
  HeaderEventEnum,
  type ListItem,
  type MergeCell,
  TableEventEnum,
  type Column,
} from '@/src/type';

const emits = defineEmits<CellEmits & RowEmits & HeaderEmits & TableEmits>();

const props = withDefaults(
  defineProps<{
    columns: Column[];
    list: ListItem[];
    rowKey?: string | number;
    rowMinHeight?: number;

    showHeader?: boolean;
    // 树形 or 分组
    defaultExpandAll?: boolean;
    // 是否显示border
    border?: boolean;
    // 是否显示斑马纹
    stripe?: boolean;
    // 是否显示树形线
    showTreeLine?: boolean;
    // 是否支持框选
    selection?: boolean;

    highlightHoverRow?: boolean;
    highlightHoverCol?: boolean;

    // 是否高亮当前行
    highlightSelectRow?: boolean;
    // 是否高亮当前列
    highlightSelectCol?: boolean;
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
  }>(),
  {
    columns: () => [],
    list: () => [],

    rowKey: 'id',
    rowMinHeight: 40,

    showHeader: true,
    defaultExpandAll: false,
    border: false,
    stripe: false,
    showTreeLine: false,
    selection: false,
    highlightHoverRow: false,
    highlightHoverCol: false,
    highlightSelectRow: false,
    highlightSelectCol: false,
    headerRowClassName: () => '',
    headerRowStyle: () => '',
    headerCellClassName: () => '',
    headerCellStyle: () => '',
    rowClassName: () => '',
    rowStyle: () => '',
    cellClassName: () => '',
    cellStyle: () => '',

    merges: () => [],
    // mergeMethods: null,
    groupConfig: () => [],
  },
);

// 注入
const gridStore = new GridStore();
provide('gridStore', gridStore);

// 在这里处理好数据，传递给GridMain
gridStore.setUIProps('border', props.border);
gridStore.setUIProps('stripe', props.stripe);
gridStore.setUIProps('showTreeLine', props.showTreeLine);
gridStore.setUIProps('selection', props.selection);
gridStore.setUIProps('highlightHoverRow', props.highlightHoverRow);
gridStore.setUIProps('highlightHoverCol', props.highlightHoverCol);
gridStore.setUIProps('highlightSelectRow', props.highlightSelectRow);
gridStore.setUIProps('highlightSelectCol', props.highlightSelectCol);
gridStore.setUIProps('defaultExpandAll', props.defaultExpandAll);
gridStore.setUIProps('headerRowClassName', props.headerRowClassName);
gridStore.setUIProps('headerRowStyle', props.headerRowStyle);
gridStore.setUIProps('headerCellClassName', props.headerCellClassName);
gridStore.setUIProps('headerCellStyle', props.headerCellStyle);
gridStore.setUIProps('rowClassName', props.rowClassName);
gridStore.setUIProps('rowStyle', props.rowStyle);
gridStore.setUIProps('cellClassName', props.cellClassName);
gridStore.setUIProps('cellStyle', props.cellStyle);

// 如果有合并单元格信息，就设置
gridStore.setColumns(props.columns);

// 这里处理合并单元格信息
if (props.merges) {
  gridStore.merges = props.merges;
}

if (props.rowKey) {
  gridStore.setRowKey(props.rowKey);
}

if (props.rowMinHeight) {
  gridStore.setRowMinHeight(props.rowMinHeight);
}

let list = props.list;

// TODO 分组需要再讨论一下处理方式，交由外部处理还是grid内部处理
if (props.groupConfig && props.groupConfig.length) {
  list = gridStore.groupFoldConstructor(list, props.groupConfig);
}

function initDataList(list: ListItem[]) {
  gridStore.setList([]);
  setTimeout(() => {
    gridStore.setOriginList(list);
    gridStore.generateFlatList();
  });
}

watch(
  () => props.groupConfig,
  (nv) => {
    console.log('groupConfig', nv);
    const list = gridStore.groupFoldConstructor(props.list, nv);
    console.log('groupConfig', list);
    initDataList(list);
  },
  {
    immediate: true,
    deep: true,
  },
);

// 监听list变化，初始化数据
watch(
  () => props.list,
  (nv) => {
    initDataList(nv);
  },
  {
    immediate: true,
  },
);

const { centerNormalColumns, leftFixedColumns, rightFixedColumns } = gridStore;

function calcVisibleColumns(scrollLeft: number, clientWidth: number) {
  // console.log('calcVisibleColumns', scrollLeft, clientWidth);

  let colRenderBegin = 0;
  let colRenderEnd = 0;

  // TODO 无所谓要不要算，影响不是很大，先注释在这里
  // let currentLeft = leftFixedColumns.reduce(
  //   (total, column: Column) => total + column?.width ?? 200,
  //   0,
  // );
  // const clientWidth2 =
  //   clientWidth - rightFixedColumns.reduce((total, column: Column) => total + column?.width ?? 200, 0);

  let currentLeft = 0;
  let beginFlag = false;
  for (let i = 0; i < centerNormalColumns.length; i++) {
    const currentWidth = centerNormalColumns[i].width!;
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
  colRenderBegin = Math.max(0, colRenderBegin - 1);
  colRenderEnd = Math.min(centerNormalColumns.length - 1, colRenderEnd + 1);

  const { watchData } = gridStore;
  if (
    colRenderBegin !== gridStore.watchData.originRect.xs ||
    colRenderEnd !== gridStore.watchData.originRect.xe
  ) {
    console.warn('横向计算结束', colRenderBegin, colRenderEnd);

    watchData.originRect.xs = colRenderBegin;
    watchData.originRect.xe = colRenderEnd;

    gridStore.calcRect(true);

    // gridStore.virtualListRef?.forceUpdate();
  }
}

function calcFixedShadow(scrollLeft: number, scrollWidth: number, clientWidth: number) {
  gridStore.calcGridScrollingStatus(scrollLeft, scrollWidth, clientWidth);
}

const emitFunction = {
  scroll: (evt: Event) => {
    const { scrollLeft, scrollWidth, clientWidth } = evt.target as HTMLElement;
    calcVisibleColumns(scrollLeft, clientWidth);
    calcFixedShadow(scrollLeft, scrollWidth, clientWidth);
  },
  toTop: () => {
    // console.log('toTop');
  },
  toBottom: () => {
    // console.log('toBottom');
  },
  itemResize: (id: string, height: number) => {
    const lastHeight = gridStore.watchData.rowHeightMap.get(String(id)) ?? props.rowMinHeight;
    gridStore.watchData.rowHeightMap.set(String(id), Math.max(lastHeight, height));
    // console.log('maxHeight', id, height);
  },
};

const virtualListRef = useVirtList(gridStore.virtualListProps, emitFunction);
gridStore.initVirtualListRef(virtualListRef as GridStore['virtualListRef']);

const {
  resizeObserver,
  reactiveData: vlReactiveData,
  slotSize,
  renderList,
  clientRefEl,
  stickyHeaderRefEl,
} = virtualListRef;

const tableRefEl = ref<HTMLElement>();
const rootRefEl = ref<HTMLElement>();
const { onClick, onDblclick, onContextmenu } = useContentEvent(gridStore);

function getComponent(row: ListItem) {
  switch (row.type) {
    case 'group':
      return GroupRow;
    case 'expand':
      return ExpandRow;
    default:
      return BaseRow;
  }
}

const cls = computed(() => ({
  body: [
    gridStore.getUIProps('border') && 'vue-virt-grid-main--border',
    gridStore.getUIProps('highlightHoverRow') && 'vue-virt-grid-main--highlight-hover-row',
  ],
  table: ['vue-virt-grid-table', gridStore.gridScrollingStatus.value],
}));
const fullWidth = computed(() => {
  return gridStore.watchData.fullWidth;
});
const headerHeight = computed(() => slotSize.stickyHeaderSize);

onMounted(() => {
  // gridStore.layoutStore.initContainer(clientRefEl.value);
  if (clientRefEl.value) {
    const { scrollLeft, scrollWidth, clientWidth } = clientRefEl.value as HTMLElement;
    calcVisibleColumns(scrollLeft, clientWidth);
    calcFixedShadow(scrollLeft, scrollWidth, clientWidth);
  }
  if (tableRefEl.value) gridStore.setTableRootEl(tableRefEl.value);
  if (rootRefEl.value) gridStore.initSelectionElement(rootRefEl.value);

  //初始化事件做监听
  for (const key of Object.values({
    ...CellEventEnum,
    ...RowEventEnum,
    ...HeaderEventEnum,
    ...TableEventEnum,
  })) {
    gridStore.eventEmitter.on(key, (data) => {
      //@ts-ignore
      emits(key, data);
    });
  }
});
onBeforeUnmount(() => {
  gridStore.eventEmitter.offAll();
});

function onMouseDown(evt: MouseEvent) {
  const path = evt.composedPath() as HTMLElement[];
  // console.log(evt, path);
  // const targetTr = path.find((el) => el.tagName === 'TR');
  const targetTd = path.find((el) => el.tagName === 'TD');
  // console.log(targetTr, targetTr?.dataset.id);
  // console.log(targetTd, targetTd?.dataset.rowidx, targetTd?.dataset.colidx);

  if (targetTd?.dataset.rowidx !== undefined) {
    gridStore.setSelectRow(Number(targetTd?.dataset.rowidx));
  }
  if (targetTd?.dataset.colidx !== undefined) {
    gridStore.setSelectCol(Number(targetTd?.dataset.colidx));
  }
}
</script>
