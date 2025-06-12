import { Injectable } from '@nestjs/common';
import { RsRepo } from './rs.repo';
@Injectable()
export class RsService {
    constructor(private readonly rsRepo: RsRepo) { }
}
