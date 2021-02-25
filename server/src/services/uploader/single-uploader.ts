import {
  PutObjectCommand,
  PutObjectCommandOutput,
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { ResizeOptions } from 'sharp';
import BaseUploader from './base-uploader';

abstract class SingleUploader extends BaseUploader {
  public objectUrl: string;

  constructor(public key: string, resizeOptions: ResizeOptions) {
    super(resizeOptions);
    this.key = key;
    this.objectUrl = this.getObjectUrl(this.key);
  }

  public async upload(input: Buffer | string): Promise<PutObjectCommandOutput> {
    const image = await this.resizeAndConvert(input);

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: this.key,
      Body: image,
    });

    return this.client.send(command);
  }

  public delete(): Promise<DeleteObjectCommandOutput> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: this.key,
    });

    return this.client.send(command);
  }
}

export default SingleUploader;
