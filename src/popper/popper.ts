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

const isHTMLElement = (el: any): el is HTMLElement =>
  el && el instanceof HTMLElement;

const onError = () => {
  console.error('invalid reference or popper ');
};

export const createPopper = (
  reference?: HTMLElement | IVirtualElement,
  popper?: HTMLElement | App,
  customOptions?: Options,
): ILmsPopper => {
  if (!reference || !popper) {
    return { close: onError, updatePopper: onError, destroy: onError };
  }

  let popperEl = null;
  let popperContainer: HTMLDivElement | null = null;
  let arrowEl: HTMLDivElement | null = null;
  let resizeObserver: ResizeObserver | null = null;
  const isHTMLReference = isHTMLElement(reference);
  const options: Options = {
    placement: 'bottom',
    offset: [0, 0],
    scrollTrigger: isHTMLReference ? reference : undefined,
    overflowTrigger: undefined,
    beforeClose: undefined,
    mounted: undefined,
    popperClass: '',
    onEnter: undefined,
    onOver: undefined,
    onLeave: undefined,
    showArrow: true,
    manual: false,
    padding: [0, 0],
    allowOverflow: false,
    followScroll: false,
    mountEl: document.body,
    zIndex: undefined,
    autoAdjustAlign: true,
  };

  Object.assign(options, customOptions);
  const beforeClose = options.beforeClose || null;
  const mounted = options.mounted || null;
  const onEnter = options.onEnter || null;
  const onOver = options.onOver || null;
  const onLeave = options.onLeave || null;
  const onOverflow = options.onOverflow || null;
  const onInView = options.onInView || null;
  const originOffset = options.offset ?? [0, 0];
  const offset = [0, 0];
  const manual = options.manual || false;
  const overflowTrigger = options.overflowTrigger || options.mountEl;
  const followScroll = options.followScroll || false;
  const zIndex = options.zIndex ?? 1;
  const autoAdjustAlign = options.autoAdjustAlign ?? true;

  if (popper instanceof HTMLElement) {
    popperEl = popper;
  } else {
    const div = document.createElement('div');
    popperEl = popper.mount(div).$el;
  }

  if (mounted) {
    mounted(popperEl);
  }

  const destroy = () => {
    if (popper instanceof HTMLElement) {
      popper.remove();
    } else {
      popper.unmount();
    }
    removeListener();
    popperContainer?.remove();
    popperContainer = null;
  };

  const close = () => {
    if (beforeClose) {
      beforeClose();
    }
    destroy();
  };

  const mouseEnter = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEnter) {
      onEnter();
    }
  };

  const mouseLeave = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onLeave) {
      onLeave();
    }
  };

  const mouseOver = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onOver) {
      onOver();
    }
  };

  const listenerCloseTrigger = (evt: MouseEvent) => {
    const target = (evt.composedPath() as HTMLElement[]).find(
      (ele: HTMLElement) =>
        ele?.classList?.contains('lms-popper') ||
        ele?.hasAttribute?.('lms-popper-disable-close'),
    );
    // 只要点击不包含当前弹窗内容就关闭弹窗
    if (!target) {
      close();
    }
  };

  const addListener = () => {
    // observer.observe(reference);
    addScrollListener();
    addResizeListener();
    if (!manual) {
      document.addEventListener('click', listenerCloseTrigger, true);
      if (popperContainer) {
        popperContainer.addEventListener('mouseenter', mouseEnter, false);
        popperContainer.addEventListener('mouseleave', mouseLeave, false);
        popperContainer.addEventListener('mouseover', mouseOver, false);
      }
    }
  };

  const removeListener = () => {
    // observer.unobserve(reference);
    removeScrollListener();
    removeResizeListener();
    if (!manual) {
      document.removeEventListener('click', listenerCloseTrigger, true);
      if (popperContainer) {
        popperContainer.removeEventListener('mouseenter', mouseEnter, false);
        popperContainer.removeEventListener('mouseleave', mouseLeave, false);
        popperContainer.removeEventListener('mouseover', mouseOver, false);
      }
    }
  };

  const scrollEvent = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    updatePopper();
  };

  const addScrollListener = () => {
    let trigger: HTMLElement | null | undefined = options.scrollTrigger;
    trigger = trigger?.parentElement;
    while (trigger) {
      trigger.addEventListener('scroll', scrollEvent, false);
      trigger = trigger.parentElement;
    }
  };

  const removeScrollListener = () => {
    let trigger: HTMLElement | null | undefined = options.scrollTrigger;
    trigger = trigger?.parentElement;
    while (trigger) {
      trigger.removeEventListener('scroll', scrollEvent, false);
      trigger = trigger.parentElement;
    }
  };

  const resizeEvent = () => {
    calculateWidth();
    updatePopper();
  };

  const addResizeListener = () => {
    resizeObserver?.disconnect();
    resizeObserver = null;
    resizeObserver = new ResizeObserver(resizeEvent);
    if (options.mountEl) {
      resizeObserver.observe(options.mountEl);
    }
    if (overflowTrigger && overflowTrigger !== options.mountEl) {
      resizeObserver.observe(overflowTrigger);
    }
    if (isHTMLReference) {
      resizeObserver.observe(reference);
    }
  };

  const removeResizeListener = () => {
    resizeObserver?.disconnect();
    resizeObserver = null;
  };

  const calculateWidth = () => {
    if (!popperContainer) return;
    if (options.autoWidth) {
      const { width: referenceWidth } =
        reference.getBoundingClientRect() as DOMRect;
      popperContainer.style.width = `${referenceWidth}px`;
    } else if (options.width) {
      popperContainer.style.width =
        typeof options.width === 'number'
          ? `${options.width}px`
          : options.width;
    }
  };

  // popperjs
  function getMainAxisFromPlacement(placement: Placement): 'x' | 'y' {
    return ['top', 'bottom'].includes(getSide(placement)) ? 'x' : 'y';
  }

  // popperjs
  function getSide(
    placement: Placement,
  ): 'top' | 'left' | 'bottom' | 'right' | 'center' {
    return placement.split('-')[0] as
      | 'top'
      | 'left'
      | 'bottom'
      | 'right'
      | 'center';
  }

  // popperjs
  function getLengthFromAxis(axis: 'x' | 'y'): 'width' | 'height' {
    return axis === 'y' ? 'height' : 'width';
  }

  // popperjs
  function getAlignment(placement: string): 'start' | 'end' {
    return placement.split('-')[1] as 'start' | 'end';
  }

  // popperjs
  const computeCoordsFromPlacement = (
    rects: { ref: ElementRect; float: ElementRect },
    placement: Placement,
    rtl?: boolean,
  ): { x: number; y: number } => {
    const [offsetX, offsetY] = offset;
    const { ref, float } = rects;
    const commonX = ref.x + ref.width / 2 - float.width / 2;
    const commonY = ref.y + ref.height / 2 - float.height / 2;
    const mainAxis = getMainAxisFromPlacement(placement);
    const length = getLengthFromAxis(mainAxis);
    const commonAlign = ref[length] / 2 - float[length] / 2;
    const isVertical = mainAxis === 'x';

    let coords;
    switch (getSide(placement)) {
      case 'top':
        coords = { x: commonX, y: ref.y - float.height };
        break;
      case 'bottom':
        coords = { x: commonX, y: ref.y + ref.height };
        break;
      case 'right':
        coords = { x: ref.x + ref.width, y: commonY };
        break;
      case 'left':
        coords = { x: ref.x - float.width, y: commonY };
        break;
      default:
        coords = { x: ref.x, y: ref.y };
    }

    switch (getAlignment(placement)) {
      case 'start':
        coords[mainAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
        break;
      case 'end':
        coords[mainAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
        break;
      default:
    }

    coords.x += offsetX;
    coords.y += offsetY;

    return coords;
  };

  // 更新位置
  const updatePopper = () => {
    // 触发节点从页面上移除时关闭弹窗
    if (isHTMLReference && !document.body.contains(reference)) {
      close();
      return;
    }

    if (!popperContainer || !reference || !overflowTrigger) {
      return;
    }

    const referenceRect = reference.getBoundingClientRect() as DOMRect;

    // 如果reference不存在页面上，关闭弹窗
    if (!referenceRect) {
      close();
      return;
    }

    const popperRect = popperContainer.getBoundingClientRect() as DOMRect;
    const overflowRect = (
      overflowTrigger as HTMLElement
    ).getBoundingClientRect();
    const mountRect = (options.mountEl as HTMLElement).getBoundingClientRect();
    const { scrollLeft, scrollTop } = options.mountEl as HTMLElement;
    const mountElStyle = window.getComputedStyle(
      options.mountEl as HTMLElement,
    );

    const {
      x: referenceX,
      y: referenceY,
      width: referenceWidth,
      height: referenceHeight,
    } = referenceRect;
    const { width: popperWidth, height: popperHeight } = popperRect;
    const {
      x: overflowContainerX,
      y: overflowContainerY,
      width: overflowContainerWidth,
      height: overflowContainerHeight,
    } = overflowRect;
    const { x: mountContainerX, y: mountContainerY } = mountRect;

    const mountContainerBorderX = parseFloat(
      mountElStyle.getPropertyValue('border-left-width'),
    );
    const mountContainerBorderY = parseFloat(
      mountElStyle.getPropertyValue('border-top-width'),
    );

    let { placement = 'bottom' } = options;
    const side = getSide(placement);
    const alignment = getAlignment(placement);

    const adjustXAlignment = () => {
      switch (alignment) {
        case 'start':
          if (
            referenceX + popperWidth >
            overflowContainerX + overflowContainerWidth
          ) {
            return 'end';
          }
          break;
        case 'end':
          if (referenceX + referenceWidth - popperWidth < overflowContainerX) {
            return 'start';
          }
          break;
      }
      return alignment;
    };

    const adjustYAlignment = () => {
      switch (alignment) {
        case 'start':
          if (
            referenceY + popperHeight >
            overflowContainerY + overflowContainerHeight
          ) {
            return 'end';
          }
          break;
        case 'end':
          if (
            referenceY + referenceHeight - popperHeight <
            overflowContainerY
          ) {
            return 'start';
          }
          break;
      }
      return alignment;
    };

    const adjustSide = () => {
      const [ox, oy] = originOffset;
      offset[0] = ox;
      offset[1] = oy;
      switch (side) {
        case 'bottom':
          if (
            referenceY + referenceHeight + popperHeight >
            overflowContainerHeight + overflowContainerY
          ) {
            offset[1] = -oy;
            return 'top';
          }
          break;
        case 'top':
          if (referenceY - popperHeight < overflowContainerY) {
            offset[1] = -oy;
            return 'bottom';
          }
          break;
        case 'left':
          if (referenceX - popperWidth < overflowContainerX) {
            offset[0] = -ox;
            return 'right';
          }
          break;
        case 'right':
          if (
            referenceX + referenceWidth + popperWidth >
            overflowContainerX + overflowContainerWidth
          ) {
            offset[0] = -ox;
            return 'left';
          }
          break;
        default:
          break;
      }
      return side;
    };

    if (autoAdjustAlign) {
      placement = placement.replace(side, adjustSide()) as Placement;

      if (getMainAxisFromPlacement(placement) === 'x') {
        placement = placement.replace(
          alignment,
          adjustXAlignment(),
        ) as Placement;
      } else {
        placement = placement.replace(
          alignment,
          adjustYAlignment(),
        ) as Placement;
      }
    }

    const { x, y } = computeCoordsFromPlacement(
      {
        ref: {
          x: referenceX,
          y: referenceY,
          width: referenceWidth,
          height: referenceHeight,
        },
        float: {
          x: 0,
          y: 0,
          width: popperWidth,
          height: popperHeight,
        },
      },
      placement,
    );

    if (popperContainer) {
      const padding = options.padding || [0, 0];
      const { allowOverflow } = options;
      const nonOverflowX = Math.max(
        overflowContainerX + padding[0],
        Math.min(
          overflowContainerX +
            overflowContainerWidth -
            padding[0] -
            popperWidth,
          x,
        ),
      );
      const nonOverflowY = Math.max(
        overflowContainerY + padding[1],
        Math.min(
          overflowContainerY +
            overflowContainerHeight -
            padding[1] -
            popperHeight,
          y,
        ),
      );
      const popperX = Math.round(
        (allowOverflow ? x : nonOverflowX) -
          mountContainerX -
          mountContainerBorderX +
          (followScroll ? 0 : scrollLeft),
      );
      const popperY = Math.round(
        (allowOverflow ? y : nonOverflowY) -
          mountContainerY -
          mountContainerBorderY +
          (followScroll ? 0 : scrollTop),
      );

      popperContainer.style.left = `${popperX}px`;
      popperContainer.style.top = `${popperY}px`;
      popperContainer.setAttribute('x-placement', placement);

      if (arrowEl) {
        const refX = referenceX - mountContainerX - mountContainerBorderX;
        const refY = referenceY - mountContainerY - mountContainerBorderY;
        const RATE = 0.1;
        const OFFSET = 6;
        let left = 0;
        let top = 0;
        if (placement.includes('start')) {
          left =
            Math.max(0, refX - popperX) +
            RATE * Math.min(referenceWidth, popperWidth);
          top =
            Math.max(0, refY - popperY) +
            RATE * Math.min(referenceHeight, popperHeight);
        } else if (placement.includes('end')) {
          left =
            Math.max(0, refX - popperX) +
            (1 - RATE) * Math.min(referenceWidth, popperWidth) -
            OFFSET * 2;
          top =
            Math.max(0, refY - popperY) +
            (1 - RATE) * Math.min(referenceHeight, popperHeight) -
            OFFSET * 2;
        } else {
          left =
            Math.max(0, refX - popperX) +
            0.5 * Math.min(referenceWidth, popperWidth) -
            OFFSET;
          top =
            Math.max(0, refY - popperY) +
            0.5 * Math.min(referenceHeight, popperHeight) -
            OFFSET;
        }

        if (placement.includes('top') || placement.includes('bottom')) {
          arrowEl.style.left = `${left}px`;
        } else {
          arrowEl.style.top = `${top}px`;
        }
      }

      if (!options.allowOverflow) {
        if (x !== nonOverflowX || y !== nonOverflowY) {
          onOverflow?.();
        } else {
          onInView?.();
        }
      }
    }
  };

  popperContainer = document.createElement('div');
  popperContainer.classList.add('hyd-popper');
  popperContainer.style.zIndex = `${zIndex}`;
  calculateWidth();
  if (options.popperClass) {
    const regex = /[\w-]+/g;
    const result = (options.popperClass || '').match(regex);
    if (result) popperContainer.classList.add(...result);
  }

  if (options.showArrow) {
    arrowEl = document.createElement('div');
    arrowEl.classList.add('popper__arrow');
    popperContainer.appendChild(arrowEl);
  }

  // 先要挂载，然后才能获取大小
  if (popperEl) popperContainer.appendChild(popperEl);

  // 如果有容器，则挂载在容器下方
  if (options.mountEl) {
    options.mountEl.appendChild(popperContainer);
  } else if (isHTMLReference) {
    reference.appendChild(popperContainer);
  }

  updatePopper();

  // 延迟绑定
  setTimeout(() => {
    addListener();
  }, 0);

  return {
    close,
    destroy,
    updatePopper,
    popperElement: popperContainer,
  };
};
