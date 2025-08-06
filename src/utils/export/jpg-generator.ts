import html2canvas from 'html2canvas';

export const generateJPG = async (element: HTMLElement) => {
  const canvas = await html2canvas(element);
  return canvas.toDataURL('image/jpeg', 0.9);
};
