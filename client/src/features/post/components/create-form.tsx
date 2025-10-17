import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Stack,
  Chip,
  IconButton,
  CardMedia,
  Slider,
  ButtonGroup,
  FormHelperText,
} from '@mui/material';
import { Close as CloseIcon, Upload as UploadIcon } from '@mui/icons-material';
import useImageSelection from '../hooks/useImageSelection';
import type { ImageAlignment } from '../hooks/useImageSelection';
import useImageControls from '../hooks/useImageControls';
import { usePostContext } from '../context/post-context';
import { postFormSchema, type PostCreateInput } from 'src/lib/post';

interface CreateFormProps {
  onCancel?: () => void;
}

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ['link', 'image'],
    ['clean'],
  ],
};

const QUILL_FORMATS = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'blockquote',
  'code-block',
  'color',
  'background',
  'link',
  'image',
  'align',
];

const IMAGE_ALIGNMENT_OPTIONS: Array<{ value: ImageAlignment; label: string }> =
  [
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'right', label: 'Right' },
  ];

export const CreateForm: React.FC<CreateFormProps> = ({ onCancel }) => {
  const {
    isSubmitting,
    bannerPreview,
    handleSubmit: contextHandleSubmit,
    handleSaveDraft: contextHandleSaveDraft,
    handleBannerUpload,
    handleBannerRemove,
  } = usePostContext();

  const [tagInput, setTagInput] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<PostCreateInput>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: '',
      content: '',
      description: '',
      banner: null,
      tags: [],
    },
  });

  const quillRef = useRef<ReactQuill | null>(null);
  const quillModules = useMemo(() => QUILL_MODULES, []);

  const imageState = useImageSelection(quillRef);
  const imageControls = useImageControls(quillRef, imageState);

  const tags = watch('tags');

  const handleBannerChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setValue('banner', file, { shouldValidate: true });
      handleBannerUpload(file);
    },
    [setValue, handleBannerUpload],
  );

  const handleRemoveBanner = useCallback(() => {
    setValue('banner', null);
    handleBannerRemove();
  }, [setValue, handleBannerRemove]);

  const handleAddTag = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter' || !tagInput.trim()) return;

      e.preventDefault();
      const trimmedTag = tagInput.trim();
      const currentTags = tags || [];

      if (!currentTags.includes(trimmedTag) && currentTags.length < 10) {
        setValue('tags', [...currentTags, trimmedTag], {
          shouldValidate: true,
        });
      }
      setTagInput('');
    },
    [tagInput, tags, setValue],
  );

  const handleDeleteTag = useCallback(
    (tagToDelete: string) => {
      const currentTags = tags || [];
      setValue(
        'tags',
        currentTags.filter((tag) => tag !== tagToDelete),
        { shouldValidate: true },
      );
    },
    [tags, setValue],
  );

  const onSubmit = useCallback(
    async (data: PostCreateInput) => {
      await contextHandleSubmit({
        title: data.title,
        content: data.content,
        banner: data.banner || null,
        description: data.description,
        tags: data.tags,
      });
    },
    [contextHandleSubmit],
  );

  const onSaveDraft = useCallback(async () => {
    const isValid = await trigger();
    if (!isValid) return;

    const data = watch();
    await contextHandleSaveDraft({
      title: data.title,
      content: data.content,
      banner: data.banner || null,
      description: data.description,
      tags: data.tags,
    });
  }, [contextHandleSaveDraft, trigger, watch]);

  return (
    <Paper elevation={2} sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Write a New Post
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Post Title"
                variant="outlined"
                fullWidth
                placeholder="Enter your post title..."
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                placeholder="Enter a short description..."
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            )}
          />

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Banner Image
            </Typography>
            {bannerPreview ? (
              <Box sx={{ position: 'relative', maxWidth: 600 }}>
                <CardMedia
                  component="img"
                  image={bannerPreview}
                  alt="Banner preview"
                  sx={{ borderRadius: 1, maxHeight: 300, objectFit: 'cover' }}
                />
                <IconButton
                  onClick={handleRemoveBanner}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'background.paper' },
                  }}
                  aria-label="Remove banner"
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            ) : (
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
              >
                Upload Banner
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleBannerChange}
                />
              </Button>
            )}
            {errors.banner && (
              <FormHelperText error>{errors.banner.message}</FormHelperText>
            )}
          </Box>

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Tags
            </Typography>
            <TextField
              variant="outlined"
              fullWidth
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Type a tag and press Enter..."
              error={!!errors.tags}
              helperText={errors.tags?.message}
            />
            {tags && tags.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleDeleteTag(tag)}
                  />
                ))}
              </Box>
            )}
          </Box>

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Content
            </Typography>
            <Box
              sx={{
                '& .ql-container': { minHeight: 400 },
                '& .ql-editor': { minHeight: 360 },
                '& .ql-editor img': {
                  maxWidth: '100%',
                  height: 'auto',
                },
                '& .ql-editor img.ql-image-selected': {
                  outline: (theme) => `2px solid ${theme.palette.primary.main}`,
                  outlineOffset: 2,
                  borderRadius: 1,
                },
              }}
            >
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={field.value}
                    onChange={field.onChange}
                    modules={quillModules}
                    formats={QUILL_FORMATS}
                    placeholder="Write your post content here..."
                    style={{ marginBottom: '50px' }}
                  />
                )}
              />
            </Box>
            {errors.content && (
              <FormHelperText error>{errors.content.message}</FormHelperText>
            )}
            {imageState.activeImage && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Image Settings
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Width ({imageState.imageWidth}px)
                    </Typography>
                    <Slider
                      value={imageState.imageWidth}
                      min={60}
                      max={Math.max(
                        imageState.activeImage.maxWidth,
                        imageState.imageWidth,
                        600,
                      )}
                      step={10}
                      onChange={imageControls.handleWidthChange}
                    />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Alignment
                    </Typography>
                    <ButtonGroup size="small">
                      {IMAGE_ALIGNMENT_OPTIONS.map(({ value, label }) => (
                        <Button
                          key={value}
                          variant={
                            imageState.imageAlignment === value
                              ? 'contained'
                              : 'outlined'
                          }
                          onClick={() => imageControls.handleAlignChange(value)}
                        >
                          {label}
                        </Button>
                      ))}
                      <Button
                        variant={
                          imageState.imageAlignment === 'none'
                            ? 'contained'
                            : 'outlined'
                        }
                        onClick={() => imageControls.handleAlignChange('none')}
                      >
                        Default
                      </Button>
                    </ButtonGroup>
                  </Box>
                  <TextField
                    label="Alt text"
                    size="small"
                    value={imageState.imageAlt}
                    onChange={(e) =>
                      imageControls.handleAltChange(e.target.value)
                    }
                    placeholder="Describe this image"
                  />
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={imageControls.handleRemove}
                  >
                    Remove Image
                  </Button>
                </Stack>
              </Box>
            )}
          </Box>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              onClick={onSaveDraft}
              disabled={isSubmitting}
            >
              Save Draft
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? 'Publishing...' : 'Publish Post'}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Paper>
  );
};
