import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ImageService {
  private readonly BUCKET_NAME = process.env.BUCKET_NAME!;
  private readonly BASE_URL = process.env.BASE_URL!;
  private readonly PUBLIC_URL = process.env.PUBLIC_URL!;
  private s3 = new S3Client({
    region: 'auto',
    endpoint: process.env.ENDPOINT!,
    credentials: {
      accessKeyId: process.env.S3KEY_ID!,
      secretAccessKey: process.env.S3ACCESS_KEY!,
    },
  });


  async uploadImage(files: Express.Multer.File[]) {
    try{
      const results = await Promise.all(
        files.map(async (file) => {
          const ext = file.originalname.split('.').pop();
          const fileName = `${uuid()}.${ext}`;
  
          const command = new PutObjectCommand({
            Bucket: this.BUCKET_NAME,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
          });
  
          await this.s3.send(command);
  
          return {
            url: `${this.PUBLIC_URL}/${fileName}`,
          };
        }),
      );

      return {
        status: 201,
        message: 'success',
        data: results 
      };
    }catch(err){
      console.log(err)
      return {
        status: 500,
        message: err
      }
    }
  }}

