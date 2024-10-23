import type { GridStore } from '../store';

export class GridScrollZone {
  container?: HTMLElement;

  scrollUpZone!: HTMLElement;
  scrollDownZone!: HTMLElement;

  scrollIntervalTimer = 0;
  speed = 4;

  lastDirection = 0;

  constructor(private store: GridStore) {
    this.scrollUpZone = document.createElement('div');
    this.scrollUpZone.style.width = '3000px';
    this.scrollUpZone.style.height = '64px';
    this.scrollUpZone.style.position = 'absolute';
    this.scrollUpZone.style.left = '0';
    this.scrollUpZone.style.top = '0';
    this.scrollUpZone.style.background = 'transparent'; // 'rgba(255,165,0,0.8)';
    this.scrollUpZone.style.zIndex = '-100';
    this.scrollUpZone.id = 'vtg-scroll-zone__top';

    this.scrollDownZone = document.createElement('div');
    this.scrollDownZone.style.width = '3000px';
    this.scrollDownZone.style.height = '40px';
    this.scrollDownZone.style.position = 'absolute';
    this.scrollDownZone.style.left = '0';
    this.scrollDownZone.style.bottom = '0';
    this.scrollDownZone.style.background = 'transparent'; // 'rgba(255,165,0,0.8)';
    this.scrollDownZone.style.zIndex = '-100';
    this.scrollUpZone.id = 'vtg-scroll-zone__bottom';
  }

  init(container: HTMLElement) {
    this.container = container;
  }

  scrollUp(offset: number, base = 1) {
    this.scrollIntervalTimer = requestAnimationFrame(() => {
      this.store.virtualListRef?.scrollToOffset(offset - this.speed * base);
      this.scrollUp(offset, base + 1);
    });
  }

  scrollDown(offset: number, base = 1) {
    this.scrollIntervalTimer = requestAnimationFrame(() => {
      this.store.virtualListRef?.scrollToOffset(offset + this.speed * base);
      this.scrollDown(offset, base + 1);
    });
  }

  onListScrollUp() {
    cancelAnimationFrame(this.scrollIntervalTimer);
    const { offset } = this.store.virtualListRef!.reactiveData;
    const base = this.lastDirection === -1 ? 2 : 1;
    this.scrollUp(offset, base);
  }

  onListScrollDown() {
    cancelAnimationFrame(this.scrollIntervalTimer);
    const { offset } = this.store.virtualListRef!.reactiveData;
    const base = this.lastDirection === 1 ? 2 : 1;
    this.scrollDown(offset, base);
  }

  handler = (e: MouseEvent) => {
    const els = document.elementsFromPoint(e.pageX, e.pageY);
    if (els.includes(this.scrollUpZone)) {
      this.onListScrollUp();
      this.lastDirection = -1;
    } else if (els.includes(this.scrollDownZone)) {
      this.onListScrollDown();
      this.lastDirection = 1;
    } else {
      cancelAnimationFrame(this.scrollIntervalTimer);
      this.lastDirection = 0;
    }
  };

  append() {
    this.remove();
    this.container?.appendChild(this.scrollUpZone);
    this.container?.appendChild(this.scrollDownZone);
    this.container?.addEventListener('mousemove', this.handler);
    document.body.addEventListener('mouseup', this.handler);
    this.lastDirection = 0;
  }

  remove() {
    cancelAnimationFrame(this.scrollIntervalTimer);
    this.scrollUpZone?.remove();
    this.scrollDownZone?.remove();
    this.container?.removeEventListener('mousemove', this.handler);
    document.body.removeEventListener('mouseup', this.handler);
    this.lastDirection = 0;
  }
}
