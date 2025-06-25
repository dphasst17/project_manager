import { Controller } from '@nestjs/common';
import {EventPattern} from '@nestjs/microservices';
import { RsService } from './rs.service';
@Controller('')
export class RsController {
    constructor(private readonly rsService: RsService) { }

    @EventPattern('all')
    async adminGetAll(data: {limit: number, skip: number}) {
      try{
        const result = await this.rsService.adminGetAll(data.limit, data.skip);
        return {status:200,data:result}
      }catch(e){
        console.log(e)
        return {status:500,message:'Server Error, Please Try Again'}
      }
    }

    @EventPattern('chat_id')
    async getChatByChannelId(data: {id: string, limit: number, skip: number}) {
      try{
        const result = await this.rsService.getAllByChannelId(data.id, data.limit, data.skip);
        return {status:200,data:result}
      }catch(e){
        console.log(e)
        return {status:500,message:'Server Error, Please Try Again'}
      }
    }

    @EventPattern('user_id')
    async getChatByUserId(data: {id: number, limit: number, skip: number}) {
      try{
        const result = await this.rsService.getAllByUserId(data.id, data.limit, data.skip);
        return {status:200,data:result}
      }catch(e){
        console.log(e)
        return {status:500,message:'Server Error, Please Try Again'}
      }
    }

    @EventPattern('image')
    async getImagesByChannelId(data:{id:string,limit:number,skip:number}) {
      try{
        const result = await this.rsService.getImagesByChannelId(data.id,data.limit,data.skip);
        return {status:200,data:result}
      }catch(e){
        console.log(e)
        return {status:500,message:'Server Error, Please Try Again'}
      }
    }
    @EventPattern('createChat')
    async createChat(data: any) {
      try{
        const result = await this.rsService.createChat(data);
        return {status:201,data:result}
      }catch(e){
        console.log(e)
        return {status:500,message:'Server Error, Please Try Again'}
      }
    }
    @EventPattern('createChannel')
    async createChannel(data: any) {
      try{
        const result = await this.rsService.createChannel(data);
        return {status:201,data:result}
      }catch(e){
        console.log(e)
        return {status:500,message:'Server Error, Please Try Again'}
      }
    }
    @EventPattern('updateChat')
    async updateChat(data: any) {
      try{
        const result = await this.rsService.updateChat(data.id, data);
        return {status:200,data:result}
      }catch(e){
        console.log(e)
        return {status:500,message:'Server Error, Please Try Again'}
      }
    }
    @EventPattern('updateChannel')
    async updateChannel(data:any){
      try{
        const result = await this.rsService.updateChannel(data.id, data);
        return {status:200,data:result}
      }catch(e){
        console.log(e)
        return {status:500,message:'Server Error, Please Try Again'}
      }
    }
    @EventPattern('deleteChat')
    async deleteChat(data: {id: string}) {
      try{
        const result = await this.rsService.deleteChat(data.id);
        return {status:200,data:result}
      }catch(e){
        console.log(e)
        return {status:500,message:'Server Error, Please Try Again'}
      }
    }
    
}
