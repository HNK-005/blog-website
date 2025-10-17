import { CreateForm } from 'src/features/post/components';
import { PostProvider } from 'src/features/post/context/post-context';

const CreatePostRoot = () => {
  return (
    <PostProvider onSubmit={(data) => console.log('Submitting post:', data)}>
      <CreateForm />
    </PostProvider>
  );
};

export default CreatePostRoot;
