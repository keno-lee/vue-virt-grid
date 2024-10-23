import './popper.scss';
import type { App } from 'vue';

export type Placement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'center'
  | 'top-start'
  | 'bottom-start'
  | 'left-start'
  | 'right-start'
  | 'top-end'
  | 'bottom-end'
  | 'left-end'
  | 'right-end';

export type Options = {
  // 定位
  placement?: Placement;
  // 偏移 [x, y]
  offset?: [number, number];
  // 容器，可以是body 也可以是任意容器
  mountEl?: HTMLElement | null;
  // 滚动依赖
  scrollTrigger?: HTMLElement;
  // 范围控制
  overflowTrigger?: HTMLElement;
  // 关闭前回调
  beforeClose?: () => void;
  // 挂载后回调
  mounted?: (el: HTMLElement) => void;
  // 自定义class
  popperClass?: string;
  // 进入popper区域
  onEnter?: () => void;
  // 处于popper区域
  onOver?: () => void;
  // 离开popper区域
  onLeave?: () => void;
  // 检测越界
  onOverflow?: () => void;
  // 检测在视图内
  onInView?: () => void;
  // 箭头
  showArrow?: boolean;
  // 是否自动宽度，设置后，会以触发元素的宽度来设定
  autoWidth?: boolean;
  // 自定义宽度
  width?: string | number;

  autoHeight?: boolean;

  // 是否手动控制事件监听
  manual?: boolean;
  // 承载容器padding
  padding?: [number, number];
  // 允许超出容器
  allowOverflow?: boolean;
  // 当挂载容器可滚动时，是否跟随挂载容器滚动
  followScroll?: boolean;
  // zIndex
  zIndex?: number;
  // 自动矫正弹窗位置
  autoAdjustAlign?: boolean;
};

export interface ElementRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ILmsPopper {
  close: () => void;
  updatePopper: () => void;
  destroy: () => void;
  popperElement?: HTMLDivElement;
}

export interface IVirtualElement {
  getBoundingClientRect():
    | {
        x: number;
        y: number;
        width: number;
        height: number;
      }
    | DOMRect
    | void;
}

const isHTMLElement = (el: any): el is HTMLElement => el && el instanceof HTMLElement;

const onError = () => {
  console.error('invalid reference or popper ');
};

export const isScrollElement = (element: HTMLElement) => {
  const clientHeight =
    element === document.documentElement ? element.clientHeight : element.offsetHeight;
  const clientWidth =
    element === document.documentElement ? element.clientWidth : element.offsetWidth;

  return element.scrollHeight > clientHeight || element.scrollWidth > clientWidth;
};

/**
 * 从当前节点向上查找所有的滚动元素
 * @param container 当前节点
 * @param top 查找到 top 节点就终止，不再继续查找
 * @returns
 */
export const getAncestorScrollElement = (
  container: HTMLElement,
  top: HTMLElement = document.documentElement,
): HTMLElement | null => {
  let scrollElement: HTMLElement | null = null;
  let element: HTMLElement | null = container;
  while (element && element !== top && !scrollElement) {
    if (isScrollElement(element)) {
      scrollElement = element;
    }
    element = element.parentElement;
  }
  return scrollElement;
};

export const createPopper = ({
  reference,
  mountEl,
  popperContainer,
  popper,
  options,
}: {
  reference: HTMLElement;
  popperContainer: HTMLElement;
  mountEl: HTMLElement;
  popper: HTMLElement | App;
  options?: Options;
}) => {
  if (!reference || !popper) {
    return;
  }
  console.log('createPopper', reference, popper, options);

  let popperEl = null;
  if (popper instanceof HTMLElement) {
    popperEl = popper;
  } else {
    const div = document.createElement('div');
    popperEl = popper.mount(div).$el;
  }

  const {
    left: referenceLeft,
    top: referenceTop,
    width: referenceWidth,
    height: referenceHeight,
  } = reference.getBoundingClientRect();
  const scrollLeft = mountEl.scrollLeft;
  const scrollTop = mountEl.scrollTop;

  const {
    left: mountElLeft,
    top: mountElTop,
    right: mountElRight,
    bottom: mountElBottom,
    width: mountElWidth,
    height: mountElHeight,
  } = mountEl.getBoundingClientRect();

  popperContainer.innerHTML = '';
  if (options?.placement === 'bottom-start') {
    popperContainer.style.left = `${referenceLeft - mountElLeft + scrollLeft - 2}px`;
    popperContainer.style.top = `${referenceTop - mountElTop + referenceHeight + scrollTop + 2}px`;
    // popperContainer.style.width = `${width - 1}px`;
    // popperContainer.style.height = `${height - 1}px`;

    // TODO 检测越界
    console.log('检测越界', mountEl.getBoundingClientRect());
  } else {
    // center
    popperContainer.style.left = `${referenceLeft - mountElLeft + scrollLeft - 1}px`;
    popperContainer.style.top = `${referenceTop - mountElTop + scrollTop - 1}px`;
    popperContainer.style.width = `${referenceWidth - 1}px`;
    popperContainer.style.height = `${referenceHeight - 1}px`;
  }

  mountEl.appendChild(popperContainer);
  popperContainer.appendChild(popperEl);

  // 移除popper
  setTimeout(() => {
    document.addEventListener('click', (evt: MouseEvent) => {
      const popper = (evt.composedPath() as HTMLElement[]).find(
        (el: HTMLElement) =>
          el?.classList?.contains('vtg-popper-container') || el?.classList?.contains('vtg-td'),
      );
      if (!popper) {
        mountEl.removeChild(popperContainer);
      }
    });
  }, 0);
};
