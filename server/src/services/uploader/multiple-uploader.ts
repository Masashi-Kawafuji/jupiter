import {
  PutObjectCommand,
  PutObjectCommandOutput,
  ListObjectsCommand,
  ListObjectsCommandOutput,
  DeleteObjectsCommand,
  DeleteObjectsCommandOutput,
} from '@aws-sdk/client-s3';
import { ResizeOptions } from 'sharp';
import path from 'path';
import BaseUploader from './base-uploader';

abstract class MultipleUploader extends BaseUploader {
  public objectUrls: string[] = [];

  constructor(
    resizeOptions: ResizeOptions,
    public prefix: string,
    private getFileName: <T>(arg?: T) => string
  ) {
    super(resizeOptions);
    this.prefix = prefix;
    this.getFileName = getFileName;
  }

  public async upload(
    inputs: (Buffer | string)[]
  ): Promise<PutObjectCommandOutput[]> {
    const uploads = inputs.map(async (input) => {
      const image = await this.resizeAndConvert(input);
      const key = path.join(this.prefix, this.getFileName());
      this.objectUrls.push(this.getObjectUrl(key));
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: image,
      });
      return this.client.send(command);
    });

    return Promise.all(uploads);
  }

  public async delete(): Promise<DeleteObjectsCommandOutput> {
    const objects = await this.getObjects();

    if (objects.Contents) {
      const command = new DeleteObjectsCommand({
        Bucket: this.bucket,
        Delete: {
          Objects: objects.Contents.map((content) => {
            const { Key } = content;
            return { Key };
          }),
        },
      });

      return this.client.send(command);
    }

    throw new Error('failed to delete objects.');
  }

  public async getObjects(): Promise<ListObjectsCommandOutput> {
    const command = new ListObjectsCommand({
      Bucket: this.bucket,
      Prefix: this.prefix,
    });

    return this.client.send(command);
  }
}

export default MultipleUploader;
