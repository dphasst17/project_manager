import { Controller } from '@nestjs/common';
import {EventPattern} from '@nestjs/microservices';
import { RsService } from './rs.service';
import {ImageService} from './images.service';
@Controller('')
export class RsController {
    constructor(
      private readonly imagesService:ImageService,
      private readonly rsService: RsService
    ) { }

  @EventPattern('uploadImages')
  async uploadImages(files:Express.Multer.File[]) {
    const convertFile = files.map((f:any) =>{
      return {
        ...f,
        buffer: Buffer.from(f.buffer, 'base64')
      }
    })
    const results = await this.imagesService.uploadImage(convertFile);
    return results
  }
}
