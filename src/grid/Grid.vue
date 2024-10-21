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
          v-if="gridStore.getUIProps('showHeader')"
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
    <div
      :class="cls.leftFixedShadow"
      :style="{ left: `${gridStore.watchData.fixedInfo.leftWidth || 0}px` }"
    ></div>
    <div
      :class="cls.rightFixedShadow"
      :style="{ right: `${gridStore.watchData.fixedInfo.rightWidth + 16 || 0}px` }"
    ></div>
    <div class="vue-virt-grid-mask" v-if="isEmpty">
      <slot name="empty"><p>No Data</p></slot>
    </div>
    <div class="vue-virt-grid-popper-wrapper">
      <div class="vue-virt-grid-popper"></div>
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
import { createPopper } from '../utils/createPopper';

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

let lastScrollLeft = 0;
let lastScrollTop = 0;
const emitFunction = {
  scroll: (evt: Event) => {
    const { scrollLeft, scrollTop, scrollWidth, clientWidth } = evt.target as HTMLElement;
    gridStore.calcVisibleColumns(scrollLeft, clientWidth);
    calcFixedShadow(scrollLeft, scrollWidth, clientWidth);
    // 滚动时清除列宽调整的线
    clearResizeLine();

    console.log('scroll', scrollLeft, scrollTop - lastScrollTop);
    updatePopperPosition(scrollLeft - lastScrollLeft, scrollTop - lastScrollTop);

    lastScrollLeft = scrollLeft;
    lastScrollTop = scrollTop;
  },
  toTop: () => {
    // console.log('toTop');
  },
  toBottom: () => {
    // console.log('toBottom');
  },
  itemResize: (id: string, height: number) => {
    const lastHeight =
      gridStore.watchData.rowHeightMap.get(String(id)) ?? props.options.rowMinHeight;
    gridStore.watchData.rowHeightMap.set(String(id), Math.max(lastHeight, height));
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
  leftFixedShadow: [
    'vue-virt-grid-fixed-shadow',
    gridStore.gridScrollingStatus.value !== 'is-scrolling-left' && leftFixedColumns.length > 0
      ? 'vue-virt-grid-fixed-shadow--left'
      : '',
  ],
  rightFixedShadow: [
    'vue-virt-grid-fixed-shadow',
    gridStore.gridScrollingStatus.value !== 'is-scrolling-right' && rightFixedColumns.length > 0
      ? 'vue-virt-grid-fixed-shadow--right'
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

let mountEl: HTMLElement | null = null;
// TODO 写一个简单的popper
function updatePopperPosition(left: number, top: number) {
  if (mountEl) {
    console.log(mountEl.style.top);

    const lastTop = Number(mountEl.style.top.match(/-?[0-9]+/)?.[0] ?? 0);
    const lastLeft = Number(mountEl.style.left.match(/-?[0-9]+/)?.[0] ?? 0);

    mountEl.style.top = `${lastTop - top}px`;
    mountEl.style.left = `${lastLeft - left}px`;
  }
}

// TODO 拆出去做hook处理
// function onMouseDown(evt: MouseEvent) {
//   const path = evt.composedPath() as HTMLElement[];
//   // console.log(evt, path);
//   // const targetTr = path.find((el) => el.tagName === 'TR');
//   const targetTd = path.find((el) => el.tagName === 'TD');
//   // console.log(targetTd);
//   // console.log(targetTd, targetTd?.dataset.rowidx, targetTd?.dataset.colidx);

//   if (targetTd) {
//     if (targetTd?.dataset.rowidx !== undefined) {
//       gridStore.setSelectRow(Number(targetTd?.dataset.rowidx));
//     }
//     if (targetTd?.dataset.colidx !== undefined) {
//       gridStore.setSelectCol(Number(targetTd?.dataset.colidx));
//     }

//     // console.log(targetTd, 'left', left, top, width, height);
//     // 生成popper，加载单元格激活态

//     console.log('column', gridStore.flattedColumns[Number(targetTd?.dataset.colidx)]);
//     const { customCellCoverRender } = gridStore.flattedColumns[Number(targetTd?.dataset.colidx)];

//     if (customCellCoverRender) {
//       // const mountEl = document.createElement('div');

//       const { left, top, width, height } = targetTd.getBoundingClientRect();
//       mountEl = document.querySelector('.vue-virt-grid-popper') as HTMLElement | null;
//       if (mountEl) {
//         mountEl.style.position = 'absolute';
//         mountEl.style.left = `${left}px`;
//         mountEl.style.top = `${top}px`;
//         mountEl.style.width = `${width - 1}px`;
//         mountEl.style.height = `${height - 1}px`;
//         createPopper(targetTd, customCellCoverRender, mountEl);
//       }
//     }
//   }
// }
</script>
