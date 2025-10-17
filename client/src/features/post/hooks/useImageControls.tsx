import React, { useCallback } from 'react';
import ReactQuill from 'react-quill-new';
import type useImageSelection from './useImageSelection';
import type { ImageAlignment } from './useImageSelection';
import { resetImageAlignmentStyles } from '../helpers/resetImage';

const applyAlignment = (
  image: HTMLImageElement,
  alignment: ImageAlignment,
): void => {
  resetImageAlignmentStyles(image);
  image.dataset.align = alignment;

  const alignmentStyles: Record<ImageAlignment, () => void> = {
    left: () => {
      image.style.float = 'left';
      image.style.margin = '0 16px 16px 0';
    },
    right: () => {
      image.style.float = 'right';
      image.style.margin = '0 0 16px 16px';
    },
    center: () => {
      image.style.display = 'block';
      image.style.margin = '16px auto';
    },
    none: () => {
      image.style.margin = '16px 0';
    },
  };

  alignmentStyles[alignment]();
};

const useImageControls = (
  quillRef: React.RefObject<ReactQuill | null>,
  imageState: ReturnType<typeof useImageSelection>,
) => {
  const {
    activeImage,
    setImageWidth,
    setImageAlt,
    setImageAlignment,
    clearSelection,
  } = imageState;

  const handleWidthChange = useCallback(
    (_: Event | React.SyntheticEvent, value: number | number[]) => {
      if (!activeImage) return;
      const width = Math.round(Array.isArray(value) ? value[0] : value);
      setImageWidth(width);
      activeImage.element.style.width = `${width}px`;
      activeImage.element.style.height = 'auto';
    },
    [activeImage, setImageWidth],
  );

  const handleAltChange = useCallback(
    (nextAlt: string) => {
      if (!activeImage) return;
      activeImage.element.setAttribute('alt', nextAlt);
      setImageAlt(nextAlt);
    },
    [activeImage, setImageAlt],
  );

  const handleAlignChange = useCallback(
    (alignment: ImageAlignment) => {
      if (!activeImage) return;
      const editor = quillRef.current?.getEditor();
      if (!editor) return;

      applyAlignment(activeImage.element, alignment);
      if (activeImage.index >= 0) {
        editor.formatText(
          activeImage.index,
          1,
          { align: alignment === 'none' ? false : alignment },
          'user',
        );
      }
      setImageAlignment(alignment);
    },
    [activeImage, quillRef, setImageAlignment],
  );

  const handleRemove = useCallback(() => {
    if (!activeImage) return;
    const editor = quillRef.current?.getEditor();
    if (!editor) return;

    const index =
      activeImage.index >= 0
        ? activeImage.index
        : (editor.getSelection(true)?.index ?? -1);

    if (index >= 0) {
      editor.deleteText(index, 1, 'user');
    }
    clearSelection();
  }, [activeImage, quillRef, clearSelection]);

  return {
    handleWidthChange,
    handleAltChange,
    handleAlignChange,
    handleRemove,
  };
};

export default useImageControls;
