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

  constructor(public key: string, public resizeOptions: ResizeOptions) {
    this.key = key;
    this.resizeOptions = resizeOptions;
  }

  private resizeAndConvert(input: Buffer): Promise<Buffer> {
    return sharp(input).resize(this.resizeOptions).jpeg().toBuffer();
  }

  public async upload(input: Buffer): Promise<PutObjectCommandOutput> {
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
