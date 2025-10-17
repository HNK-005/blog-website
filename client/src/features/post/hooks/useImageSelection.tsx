import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getImageWidth } from '../helpers/getImageWidth';
import ReactQuill, { Quill } from 'react-quill-new';

export type ImageAlignment = 'none' | 'left' | 'center' | 'right';
export interface ActiveImage {
  element: HTMLImageElement;
  index: number;
  maxWidth: number;
}

const inferAlignment = (image: HTMLImageElement): ImageAlignment => {
  const datasetAlign = image.dataset.align as ImageAlignment | undefined;
  if (datasetAlign) return datasetAlign;

  if (image.style.float === 'left') return 'left';
  if (image.style.float === 'right') return 'right';
  if (
    image.style.display === 'block' &&
    image.style.marginLeft === 'auto' &&
    image.style.marginRight === 'auto'
  ) {
    return 'center';
  }

  return 'none';
};

const useImageSelection = (quillRef: React.RefObject<ReactQuill | null>) => {
  const lastSelectedImageRef = useRef<HTMLImageElement | null>(null);
  const [activeImage, setActiveImage] = useState<ActiveImage | null>(null);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageAlt, setImageAlt] = useState('');
  const [imageAlignment, setImageAlignment] = useState<ImageAlignment>('none');

  useEffect(() => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (target instanceof HTMLImageElement) {
        if (
          lastSelectedImageRef.current &&
          lastSelectedImageRef.current !== target
        ) {
          lastSelectedImageRef.current.classList.remove('ql-image-selected');
        }

        target.classList.add('ql-image-selected');
        lastSelectedImageRef.current = target;

        const blot = Quill.find(target);
        const index =
          blot &&
          !(blot instanceof Quill) &&
          typeof editor.getIndex === 'function'
            ? editor.getIndex(blot)
            : (editor.getSelection(true)?.index ?? -1);

        const maxWidth = Math.max(
          Math.round(editor.root.clientWidth),
          target.naturalWidth,
          400,
        );
        const width = getImageWidth(target);
        const alignment = inferAlignment(target);
        target.dataset.align = alignment;

        setActiveImage({ element: target, index, maxWidth });
        setImageWidth(Math.max(60, width));
        setImageAlt(target.getAttribute('alt') ?? '');
        setImageAlignment(alignment);
      } else {
        lastSelectedImageRef.current?.classList.remove('ql-image-selected');
        lastSelectedImageRef.current = null;
        setActiveImage(null);
        setImageWidth(0);
        setImageAlt('');
        setImageAlignment('none');
      }
    };

    const { root } = editor;
    root.addEventListener('click', handleClick);

    return () => {
      root.removeEventListener('click', handleClick);
      lastSelectedImageRef.current?.classList.remove('ql-image-selected');
    };
  }, [quillRef]);

  const clearSelection = useCallback(() => {
    lastSelectedImageRef.current?.classList.remove('ql-image-selected');
    lastSelectedImageRef.current = null;
    setActiveImage(null);
    setImageWidth(0);
    setImageAlt('');
    setImageAlignment('none');
  }, []);

  return {
    activeImage,
    imageWidth,
    imageAlt,
    imageAlignment,
    setImageWidth,
    setImageAlt,
    setImageAlignment,
    clearSelection,
  };
};

export default useImageSelection;
