import { v4 as uuidv4 } from 'uuid';
import {
  PutObjectCommandOutput,
  DeleteObjectsCommand,
  DeleteObjectsCommandOutput,
} from '@aws-sdk/client-s3';
import Post from '../entities/post';
import MultipleUploader from './uploader/multiple-uploader';

class PostImageUploadService extends MultipleUploader {
  private maxAmount = 4;

  constructor(public post: Post) {
    super(
      { width: 600 },
      `${process.env.NODE_ENV}/posts/${post.id}`,
      () => `${uuidv4()}.jpg`
    );
  }

  public uploadFromRequestFiles(
    files: Express.Multer.File[]
  ): Promise<PutObjectCommandOutput[]> {
    if (this.isNotAmountOfImagesLessThanMaxAmount(files)) {
      throw new Error(`The post must hold less than ${this.maxAmount} images.`);
    }

    const buffers = files.map((file) => file.buffer);
    return this.upload(buffers);
  }

  public async delete(imageIds: string[]): Promise<DeleteObjectsCommandOutput> {
    const imagesToDelete = this.post.images.filter((image) =>
      imageIds.includes(image.id.toString())
    );

    this.post.images = this.post.images.filter(
      (image) => !imagesToDelete.includes(image)
    );

    const command = new DeleteObjectsCommand({
      Bucket: this.bucket,
      Delete: {
        Objects: imagesToDelete.map((image) => {
          const Key = image.url.replace(`${this.baseUrl}/`, '');
          return { Key };
        }),
      },
    });

    return this.client.send(command);
  }

  private isNotAmountOfImagesLessThanMaxAmount(
    files: Express.Multer.File[]
  ): boolean {
    return (
      this.post.images &&
      this.post.images.length + files.length > this.maxAmount
    );
  }
}

export default PostImageUploadService;
