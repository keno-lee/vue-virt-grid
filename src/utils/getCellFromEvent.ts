export const getCellFromEvent = (e: MouseEvent) => {
  const cellRoot = e
    .composedPath()
    .find(
      (v) =>
        !(v as HTMLElement).classList?.contains('vtg-cell--unselectable') &&
        (v as HTMLElement).dataset?.colidx &&
        (v as HTMLElement).dataset?.rowidx,
    ) as HTMLElement;

  if (cellRoot && cellRoot.dataset) {
    const { colidx, rowidx, colspan, rowspan } = cellRoot.dataset;
    return {
      rowIndex: +(rowidx || 0),
      colIndex: +(colidx || 0),
      rowspan: +(rowspan || 1),
      colspan: +(colspan || 1),
    };
  }

  return undefined;
};
