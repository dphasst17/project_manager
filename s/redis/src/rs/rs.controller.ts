import { Controller } from '@nestjs/common';
import { RsService } from './rs.service';
import { RedisMeetingService } from './public_meeting.service';
import { EventPattern } from '@nestjs/microservices';
@Controller()
export class RsController {
    constructor(
        private readonly redisService: RsService,
        private readonly meetingService:RedisMeetingService
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
    @EventPattern('get_all_meetings')
    async getAllMeetings() {
        return await this.meetingService.getAllMeetings()
    }
    @EventPattern('get_meeting')
    async getMeeting(data: { id: string }) {
        return await this.meetingService.getMeeting(data.id)
    }
    @EventPattern('set_meeting')
    async setMeeting(data: { id: string, title: string, url: string }) {
        return await this.meetingService.addMeeting(data)
    }
    @EventPattern('remove_meeting')
    async removeMeeting(data: { id: string }) {
        return await this.meetingService.removeMeeting(data.id)
    }
}
