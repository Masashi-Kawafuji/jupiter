import { S3Client } from '@aws-sdk/client-s3';
import sharp, { ResizeOptions } from 'sharp';

abstract class BaseUploader {
  protected client = new S3Client({ region: process.env.S3_REGION });

  protected bucket = process.env.S3_BUCKET;

  constructor(public resizeOptions: ResizeOptions) {
    this.resizeOptions = resizeOptions;
  }

  protected resizeAndConvert(input: Buffer | string): Promise<Buffer> {
    return sharp(input).resize(this.resizeOptions).jpeg().toBuffer();
  }

  protected getObjectUrl(key: string): string {
    return `https://${this.bucket}.s3-${process.env.S3_REGION}.amazonaws.com/${key}`;
  }
}

export default BaseUploader;
