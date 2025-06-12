import { Controller } from '@nestjs/common';
import {EventPattern} from '@nestjs/microservices';
import { RsService } from './rs.service';
@Controller('')
export class RsController {
    constructor(private readonly rsService: RsService) { }
}
