<template>
  <div class="vtg-root" ref="rootRefEl">
    <div class="vtg-main" ref="clientRefEl" data-id="client" :class="cls.body">
      <!-- height skeleton -->
      <div :style="`float:left; height: ${vlReactiveData.listTotalSize}px`"></div>
      <!-- table main -->
      <table
        :class="cls.table"
        cellspacing="0"
        cellpadding="0"
        :style="`width: ${fullWidth}px;`"
        ref="tableRefEl"
        @click="onClick"
        @dblclick="onDblclick"
        @contextmenu="onContextmenu"
        @mousedown="onMouseDown"
      >
        <colgroup :key="gridStore.watchData.renderKey">
          <col v-for="column in leftFixedColumns" :key="column._id" :width="column.width" />
          <col v-for="column in centerNormalColumns" :key="column._id" :width="column.width" />
          <col v-for="column in rightFixedColumns" :key="column._id" :width="column.width" />
        </colgroup>

        <thead
          ref="stickyHeaderRefEl"
          data-id="stickyHeader"
          class="vtg-header"
          :style="`height: ${headerHeight}px;`"
          v-if="gridStore.getUIProps('showHeader')"
        >
          <GridHeader></GridHeader>
        </thead>
        <tbody class="vtg-body">
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
          class="vtg-footer"
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
    <div
      :class="cls.leftFixedShadow"
      :style="{ left: `${gridStore.watchData.fixedInfo.leftWidth || 0}px` }"
    ></div>
    <div
      :class="cls.rightFixedShadow"
      :style="{ right: `${gridStore.watchData.fixedInfo.rightWidth + 16 || 0}px` }"
    ></div>
    <div class="vtg-mask" v-if="isEmpty">
      <slot name="empty"><p>No Data</p></slot>
    </div>
  </div>
</template>
<script setup lang="tsx">
import { onMounted, provide, ref, watch, computed, onBeforeUnmount, createApp } from 'vue';
import { useVirtList } from 'vue-virt-list';
import { GridStore, useGridStore } from '@/src/store';
import { useContentEvent } from '@/src/hooks/useEvent';

import GridHeader from '@/src/grid-header/GridHeader.vue';
// import GridHeader from '@/src/grid-header/GridHeader';
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
  type TableOptions,
} from '@/src/type';
import { clearResizeLine } from '../hooks/useResizeColumn';

const emits = defineEmits<CellEmits & RowEmits & HeaderEmits & TableEmits>();

const props = withDefaults(
  defineProps<{
    columns: Column[];
    list: ListItem[];

    options?: TableOptions;
  }>(),
  {
    columns: () => [],
    list: () => [],

    options: () => ({}),
  },
);

const gridStore = useGridStore(props);

// TODO: 这里目前看只是用来判断列表是否为空
// let list = props.list;

// // TODO 分组需要再讨论一下处理方式，交由外部处理还是 grid 内部处理
// if(props.options?.groupConfig?.length) {
//   list = gridStore.groupFoldConstructor(props.list, props.options.groupConfig)
// }

// 如果有分组优先判断分组信息
const isEmpty = computed(() => {
  return props.options?.groupConfig?.length
    ? gridStore.groupFoldConstructor(props.list, props.options.groupConfig).length === 0
    : props.list.length === 0;
});

watch(
  () => props.options.groupConfig,
  (nv) => {
    console.log('groupConfig', nv);
    if (!nv) return;
    const list = gridStore.groupFoldConstructor(props.list, nv);
    console.log('groupConfig', list);
    gridStore.initDataList(list);
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
    gridStore.initDataList(nv);
  },
  {
    immediate: true,
  },
);

const { centerNormalColumns, leftFixedColumns, rightFixedColumns } = gridStore;

function calcFixedShadow(scrollLeft: number, scrollWidth: number, clientWidth: number) {
  gridStore.calcGridScrollingStatus(scrollLeft, scrollWidth, clientWidth);
}

const emitFunction = {
  scroll: (evt: Event) => {
    const { scrollLeft, scrollTop, scrollWidth, clientWidth } = evt.target as HTMLElement;
    gridStore.calcVisibleColumns(scrollLeft, clientWidth);
    calcFixedShadow(scrollLeft, scrollWidth, clientWidth);
    // 滚动时清除列宽调整的线
    clearResizeLine();
  },
  itemResize: (id: string, height: number) => {
    const lastHeight =
      gridStore.watchData.rowHeightMap.get(String(id)) ?? gridStore.virtualListProps.minSize;
    gridStore.watchData.rowHeightMap.set(String(id), Math.max(lastHeight, height));
  },
  toTop: () => {},
  toBottom: () => {},
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
const { onClick, onDblclick, onContextmenu, onMouseDown } = useContentEvent(gridStore);

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
    gridStore.getUIProps('border') ? 'vtg-main--border' : '',
    gridStore.getUIProps('highlightHoverRow') ? 'vtg-main--highlight-hover-row' : '',
    gridStore.getUIProps('highlightSelectRow') ? 'vtg-main--highlight-select-row' : '',
    gridStore.getUIProps('highlightSelectCol') ? 'vtg-main--highlight-select-col' : '',
    gridStore.getUIProps('highlightSelectCell') ? 'vtg-main--highlight-select-cell' : '',
  ],
  table: ['vtg-table', gridStore.gridScrollingStatus.value],
  leftFixedShadow: [
    'vtg-fixed-shadow',
    gridStore.gridScrollingStatus.value !== 'is-scrolling-left' && leftFixedColumns.length > 0
      ? 'vtg-fixed-shadow--left'
      : '',
  ],
  rightFixedShadow: [
    'vtg-fixed-shadow',
    gridStore.gridScrollingStatus.value !== 'is-scrolling-right' && rightFixedColumns.length > 0
      ? 'vtg-fixed-shadow--right'
      : '',
  ],
}));
const fullWidth = computed(() => {
  return gridStore.watchData.fullWidth;
});
const headerHeight = computed(() => slotSize.stickyHeaderSize);

onMounted(() => {
  // gridStore.layoutStore.initContainer(clientRefEl.value);
  if (clientRefEl.value) {
    const { scrollLeft, scrollWidth, clientWidth } = clientRefEl.value as HTMLElement;
    gridStore.calcVisibleColumns(scrollLeft, clientWidth);
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
</script>
