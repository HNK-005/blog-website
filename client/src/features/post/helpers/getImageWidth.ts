export const getImageWidth = (element: HTMLImageElement): number => {
  const styleWidth = parseInt(element.style.width, 10);
  return styleWidth || Math.round(element.getBoundingClientRect().width);
};