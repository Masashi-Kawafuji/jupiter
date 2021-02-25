import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandOutput,
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
} from '@aws-sdk/client-s3';
import sharp, { ResizeOptions } from 'sharp';

abstract class ImageUploadService {
  private client = new S3Client({ region: process.env.S3_REGION });

  private bucket = process.env.S3_BUCKET;

  public objectUrl: string;

  constructor(public key: string, public resizeOptions: ResizeOptions) {
    this.key = key;
    this.resizeOptions = resizeOptions;
    this.objectUrl = `https://${this.bucket}.s3-${process.env.S3_REGION}.amazonaws.com/${this.key}`;
  }

  private resizeAndConvert(input: Buffer | string): Promise<Buffer> {
    return sharp(input).resize(this.resizeOptions).jpeg().toBuffer();
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

export default ImageUploadService;
