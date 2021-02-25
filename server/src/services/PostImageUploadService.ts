import { v4 as uuidv4 } from 'uuid';
import Post from '../entities/post';
import MultipleUploader from './uploader/multiple-uploader';

class PostImageUploadService extends MultipleUploader {
  constructor(postId: Post['id']) {
    super(
      { width: 600 },
      `${process.env.NODE_ENV}/posts/${postId}`,
      () => `${uuidv4()}.jpg`
    );
  }
}

export default PostImageUploadService;
