import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type PropsWithChildren,
} from 'react';

export interface PostFormData {
  title: string;
  content: string;
  banner: File | null;
  description?: string;
  tags?: string[];
}

interface PostContextValue {
  isSubmitting: boolean;
  bannerPreview: string;
  setBannerPreview: (preview: string) => void;
  handleSubmit: (data: PostFormData) => Promise<void>;
  handleSaveDraft: (data: PostFormData) => Promise<void>;
  handleBannerUpload: (file: File) => void;
  handleBannerRemove: () => void;
}

const PostContext = createContext<PostContextValue | undefined>(undefined);

type PostProviderProps = {
  onSubmit?: (data: PostFormData) => void | Promise<void>;
  onSaveDraft?: (data: PostFormData) => void | Promise<void>;
} & PropsWithChildren;

export const PostProvider: React.FC<PostProviderProps> = ({
  children,
  onSubmit,
  onSaveDraft,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bannerPreview, setBannerPreview] = useState('');

  const handleSubmit = useCallback(
    async (data: PostFormData) => {
      try {
        setIsSubmitting(true);
        await onSubmit?.(data);
      } catch (error) {
        console.error('Failed to submit post:', error);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit],
  );

  const handleSaveDraft = useCallback(
    async (data: PostFormData) => {
      try {
        setIsSubmitting(true);
        await onSaveDraft?.(data);
      } catch (error) {
        console.error('Failed to save draft:', error);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSaveDraft],
  );

  const handleBannerUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => setBannerPreview(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleBannerRemove = useCallback(() => {
    setBannerPreview('');
  }, []);

  const value: PostContextValue = {
    isSubmitting,
    bannerPreview,
    setBannerPreview,
    handleSubmit,
    handleSaveDraft,
    handleBannerUpload,
    handleBannerRemove,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

export const usePostContext = (): PostContextValue => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePostContext must be used within PostProvider');
  }
  return context;
};
