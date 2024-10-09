import { createApp } from 'vue';

export function createPopper(
  reference: HTMLElement,
  customCellCoverRender: any,
  mountEl: HTMLElement,
  // options?: {
  //   // 挂载对象
  //   mounted?: HTMLElement;
  // },
) {
  // const { left, top, width, height } = reference.getBoundingClientRect();

  const app = createApp({
    render: () => customCellCoverRender(),
  });

  // console.log('createPopper', reference, app);
  // const { left, top, width, height } = reference.getBoundingClientRect();

  // const popperCell = document.createElement('div');
  // // popperCell.className = 'vue-virt-grid-popper-cell';
  // popperCell.style.position = 'absolute';
  // popperCell.style.left = `${left}px`;
  // popperCell.style.top = `${top}px`;
  // popperCell.style.width = `${width}px`;
  // popperCell.style.height = `${height}px`;
  // wrapper?.appendChild(popperCell);

  if (mountEl) {
    app.mount(mountEl);
  }

  return;
}
