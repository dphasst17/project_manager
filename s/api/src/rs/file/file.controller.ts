import { Controller, Inject, Post, Res, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';

@Controller('api/file')
export class FileController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) { }
  @Post('images')
  @UseInterceptors(FilesInterceptor('files',10))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[],@Res() res: Response) {
    const results = await firstValueFrom(this.natsClient.send('uploadImages', files));
    return res.status(results.status).json(results);
  }
  
}


