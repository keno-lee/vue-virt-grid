import { cloneDeep, isEqual } from 'lodash-es';
import type { GridStore } from '../store';
import { getCellFromEvent } from '../utils/getCellFromEvent';
import { nanoid } from 'nanoid';

export class GridSelection {
  container?: HTMLElement;

  boxArea = {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  };

  id: string = '';

  startPos = {
    rowIndex: -1,
    colIndex: -1,
  };
  
  lastClickPos?: { rowIndex: number; colIndex: number } = undefined;
  lastShiftClickPos?: { rowIndex: number; colIndex: number } = undefined;

  callbackFunc: any = () => {};

  isMetaKey = false;
  isShiftKey = false;
  
  constructor(private store: GridStore) {
    
  }

  init(el: HTMLElement) {
    this.container = el;
    this.container.addEventListener('mousedown', this.onMousedown);
  }

  on(fn: any) {
    this.callbackFunc = fn;
  }

  reset() {

  }

  preventContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    this.onMouseup();
  };

  onMousedown = (e: MouseEvent) => {
    if (!this.store.getUIProps('selection')) return;
    // 禁用右键响应
    if (e.buttons !== 1 || e.button) return;
    const cellInfo = getCellFromEvent(e);
    this.isMetaKey = e.metaKey || e.ctrlKey;
    this.isShiftKey = e.shiftKey;

    if (cellInfo) {
      const { colIndex, rowIndex } = cellInfo;

      this.id = nanoid(4);

      this.startPos = {
        rowIndex,
        colIndex,
      }

      if (this.isShiftKey) {
        if (!this.lastShiftClickPos) {
          this.lastShiftClickPos = cloneDeep(this.lastClickPos || this.startPos);
        }
      } else {
        this.lastShiftClickPos = undefined
      }

      if (this.isShiftKey && this.lastShiftClickPos) {
        const { rowIndex: ri, colIndex: ci } = this.lastShiftClickPos;
        this.boxArea = {
          top: Math.min(rowIndex, ri),
          bottom: Math.max(rowIndex, ri),
          left: Math.min(colIndex, ci),
          right: Math.max(colIndex, ci),
        }
      } else {
        this.boxArea = {
          top: rowIndex,
          bottom: rowIndex,
          left: colIndex,
          right: colIndex,
        }
      }

      this.lastClickPos = cloneDeep(this.startPos);

      this.container!.style.userSelect = 'none';
      document.body.addEventListener('mouseup', this.onMouseup);
      document.body.addEventListener('mouseover', this.onMouseOver);
      document.body.addEventListener('contextmenu', this.preventContextMenu);
      this.store.gridScrollZone.append();
      this.emitChange();
    }
  };

  onMouseOver = (e: MouseEvent) => {
    if (!this.store.getUIProps('selection')) return;
    const cellInfo = getCellFromEvent(e);

    if (cellInfo) {
      const { colIndex, rowIndex } = cellInfo;

      const newArea = {
        top: Math.min(this.startPos.rowIndex, rowIndex),
        bottom: Math.max(this.startPos.rowIndex, rowIndex),
        left: Math.min(this.startPos.colIndex, colIndex),
        right: Math.max(this.startPos.colIndex, colIndex),
      }

      if (!isEqual(newArea, this.boxArea)) {
        this.boxArea = newArea;
        this.emitChange();
      }
    }
  }

  onMouseup = () => {
    if (!this.store.getUIProps('selection')) return;
    this.id = '';
    this.boxArea = {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    }
    this.container!.style.userSelect = 'auto';
    document.body.removeEventListener('mouseover', this.onMouseOver);
    document.body.removeEventListener('mouseup', this.onMouseup);
    document.body.removeEventListener('contextmenu', this.preventContextMenu);
    this.store.gridScrollZone.remove();
  };

  emitChange() {
    this.callbackFunc(this.id, this.boxArea, this.isMetaKey);
  }

  destroy() {
    this.container?.removeEventListener('mousedown', this.onMousedown);
    document.body.removeEventListener('contextmenu', this.preventContextMenu);
    document.body.removeEventListener('mouseup', this.onMouseup);
    document.body.removeEventListener('mouseover', this.onMouseOver);
    this.store.gridScrollZone.remove();
  }
}
