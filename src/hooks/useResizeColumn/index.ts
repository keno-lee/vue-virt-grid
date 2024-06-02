import { onUpdated, watch } from 'vue';
import './index.scss';
import type { ColumnItem } from '@/src/type';
import { clamp } from 'lodash-es';

const ColumnResizeLineClass = 'gird-column-resize-line';

const ColumnResizeTriggerClass = 'gird-column-resize-trigger';

function setRelative(el: HTMLElement) {
  const style = getComputedStyle(el);
  const position = style.getPropertyValue('position');
  if (!position || position === 'static') {
    el.style.position = 'relative';
  }
}

function isInitialized(el: HTMLElement) {
  return !!(el as any).__resizeTrigger;
}

// 全局唯一，防止重复创建
let resizeLine: HTMLElement | undefined;

export const clearResizeLine = () => {
  if (!resizeLine) return;
  resizeLine.remove();
  resizeLine = undefined;
};

export function useResizeColumn(
  columnEl: HTMLElement,
  headerInfo: ColumnItem,
  tableRootEl: HTMLElement,
  cb: (width: number) => void,
) {
  if (isInitialized(columnEl)) return;
  const resizeTriggerDom = document.createElement('div');
  resizeTriggerDom.className = ColumnResizeTriggerClass;
  const data = {
    resizing: false,
    startX: 0,
    endX: 0,
    columnLeft: 0,
    columnCurrentWidth: 0,
  };

  function getWillWidth() {
    return clamp(
      data.endX - data.startX + data.columnCurrentWidth,
      headerInfo.minWidth ?? 0,
      headerInfo.maxWidth ?? Infinity,
    );
  }

  function setupTrigger() {
    if (!headerInfo?.resizable) {
      resizeTriggerDom.parentElement?.removeChild(resizeTriggerDom);
      return;
    }
    if (columnEl && !columnEl.contains(resizeTriggerDom)) {
      columnEl.appendChild(resizeTriggerDom);
      setRelative(columnEl);

      const style = getComputedStyle(columnEl);
      if (style.getPropertyValue('border-right-width') === '0px') {
        resizeTriggerDom.classList.add('is-opacity');
      }
    }
    (columnEl as any).__resizeTrigger = true;
  }
  onUpdated(() => setupTrigger);
  watch(() => [columnEl, headerInfo], setupTrigger, { immediate: true });

  // let resizeLine: HTMLElement | undefined;

  function setupResizeLine(e: MouseEvent) {
    if (!tableRootEl) return;
    data.startX = e.clientX;
    data.columnLeft =
      tableRootEl.scrollLeft +
      columnEl.getBoundingClientRect().left -
      tableRootEl.getBoundingClientRect().x -
      2;
    data.endX = e.clientX;
    data.columnCurrentWidth = columnEl.getBoundingClientRect().width;

    resizeLine = document.createElement('div');
    resizeLine.className = ColumnResizeLineClass;
    tableRootEl.appendChild(resizeLine);
    setRelative(tableRootEl);
    resizeLine.style.transform = `translateX(${getWillWidth() + data.columnLeft}px)`;
    resizeLine.style.top = `${tableRootEl.scrollTop}px`;
  }

  function resize(e: MouseEvent) {
    if (!data.resizing) return;
    e.preventDefault();
    data.endX = e.clientX;
    if (resizeLine)
      resizeLine.style.transform = `translateX(${getWillWidth() + data.columnLeft}px)`;
  }

  resizeTriggerDom.addEventListener('mouseenter', (e) => {
    if (!resizeLine) setupResizeLine(e);
  });

  resizeTriggerDom.addEventListener('mouseleave', (e) => {
    if (!data.resizing && resizeLine) {
      resizeLine.remove();
      resizeLine = undefined;
    }
  });

  resizeTriggerDom.addEventListener('mousedown', (e) => {
    e.preventDefault();
    if (data.resizing) return;
    data.resizing = true;

    document.addEventListener('mousemove', resize);
    document.addEventListener(
      'mouseup',
      () => {
        data.resizing = false;
        document.removeEventListener('mousemove', resize);
        resizeLine?.remove();
        resizeLine = undefined;

        console.log(getWillWidth());
        cb(getWillWidth());
      },
      {
        once: true,
      },
    );
  });
}
