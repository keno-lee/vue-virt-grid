import { createApp } from 'vue';
import { createPopper } from '@/src/popper/popper';
import { GridStore } from '@/src/store';
import { isFunction } from 'lodash-es';

class PopperStore {
  gridStore: GridStore;
  coverEl: HTMLElement | null = null;
  dropdownEl: HTMLElement | null = null;
  mountEl: HTMLElement | null = null;

  constructor(gridStore: GridStore) {
    this.gridStore = gridStore;
  }

  coverRender(tdData: any) {
    if (!isFunction(tdData.column?.cellCoverRender)) return;

    this.coverEl = document.createElement('div');
    this.coverEl.classList.add('vue-virt-grid-popper-container');

    this.mountEl = document.querySelector('.vue-virt-grid-main') as HTMLElement | null;

    const app = createApp({
      render: () => tdData.column.cellCoverRender?.(tdData.column, tdData.row, tdData),
    });
    if (this.mountEl) {
      createPopper({
        reference: tdData.el,
        mountEl: this.mountEl,
        popperContainer: this.coverEl,
        popper: app,
        options: {
          placement: 'center',
        },
      });
    }

    // TODO 移除事件监听
    this.coverEl.addEventListener('click', (evt: MouseEvent) => {
      evt.preventDefault();
      this.dropdownRender(tdData);
    });
  }

  dropdownRender(tdData: any) {
    if (!isFunction(tdData.column?.dropdownRender)) return;

    this.dropdownEl = document.createElement('div');
    this.dropdownEl.classList.add('vue-virt-grid-popper-container');

    this.mountEl = document.querySelector('.vue-virt-grid-main') as HTMLElement | null;

    const app = createApp({
      render: () => tdData.column.cellDropdownRender?.(tdData.column, tdData.row, tdData),
    });
    if (this.mountEl) {
      createPopper({
        reference: tdData.el,
        mountEl: this.mountEl,
        popperContainer: this.dropdownEl,
        popper: app,
        options: {
          placement: 'bottom-start',
        },
      });
    }
  }

  remove() {
    if (this.coverEl && this.mountEl?.contains(this.coverEl)) {
      this.mountEl?.removeChild(this.coverEl);
      this.coverEl = null;
    }
    if (this.dropdownEl && this.mountEl?.contains(this.dropdownEl)) {
      this.mountEl?.removeChild(this.dropdownEl);
      this.dropdownEl = null;
    }
  }
}

export { PopperStore };
