import { Controller } from '@nestjs/common';
import { RsService } from './rs.service';
import { EventPattern } from '@nestjs/microservices';
@Controller()
export class RsController {
    constructor(
        private readonly redisService: RsService,
    ) { }
    @EventPattern('redis')
    async redis() {
        return "Null"
    }
    @EventPattern('redis_get' )
    async redisGet(data: { key: string }) {
        return await this.redisService.redisGet(data.key)
    }
    @EventPattern('redis_set')
    async redisSet(data: {key: string, value: any}[]) {
        console.log(data)
        const convertData = data.map(d => ({ key: d.key, value: JSON.stringify(d.value) }))
        return await this.redisService.redisSet(convertData)
    }
    @EventPattern('redis_update')
    async redisUpdate(data: { key:string,field:string,value:any}) {
        return await this.redisService.redisUpdate(data.key,data.field, data.value)
    }
    @EventPattern('redis_del')
    async redisDel(data: { key:string}) {
        return await this.redisService.redisDel(data.key)
    }
}
