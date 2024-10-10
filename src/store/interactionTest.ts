import { createApp } from 'vue';
// import { type TdData } from '@/src/type';
import { createPopper, createPopper2 } from '@/src/popper/popper';
import { GridStore } from '@/src/store';

// 交互层 - 没想好名字
class InteractionTest {
  gridStore: GridStore;
  coverEl: HTMLElement;
  dropdownEl: HTMLElement;

  constructor(gridStore: GridStore) {
    this.gridStore = gridStore;

    this.coverEl = document.createElement('div');
    this.coverEl.classList.add('vue-virt-grid-popper-container');
    this.coverEl.style.zIndex = `999`;
    this.coverEl.style.position = 'absolute';

    this.dropdownEl = document.createElement('div');
    this.dropdownEl.classList.add('vue-virt-grid-popper-container');
    this.dropdownEl.style.zIndex = `999`;
    this.dropdownEl.style.position = 'absolute';
  }

  coverRender(tdData: any) {
    const app = createApp({
      render: () => tdData.column.customCellCoverRender?.(tdData.column, tdData.row, tdData),
    });
    const mountEl = document.querySelector('.vue-virt-grid-main') as HTMLElement | null;

    if (mountEl) {
      createPopper2(tdData.el, this.gridStore.interactionTest.coverEl, mountEl, app, {
        placement: 'center',
      });
    }

    // TODO 移除事件监听
    this.coverEl.addEventListener('click', () => {
      this.dropdownRender(tdData);
    });
  }

  dropdownRender(tdData: any) {
    const app = createApp({
      render: () => tdData.column.customCellDropdownRender?.(tdData.column, tdData.row, tdData),
    });
    const mountEl = document.querySelector('.vue-virt-grid-main') as HTMLElement | null;
    if (mountEl) {
      createPopper2(tdData.el, this.gridStore.interactionTest.dropdownEl, mountEl, app, {
        placement: 'bottom-start',
      });
    }
  }

  remove() {
    this.coverEl.innerHTML = '';
    this.dropdownEl.innerHTML = '';
  }
}

export { InteractionTest };
