import { Injectable,Inject } from '@nestjs/common';
import { RsRepo } from './rs.repo';
import { ChannelResponse, CreateChatInput, UpdateChatInput } from 'src/@types/rs.types';
import {firstValueFrom} from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import {Chat} from 'src/schemas/chat.schema';
@Injectable()
export class RsService {
    constructor(
     @Inject('NATS_SERVICE') private natsClient: ClientProxy,
      private readonly rsRepo: RsRepo
    ) { }
    async adminGetAll(limit:number, skip:number) {
      const data = await this.rsRepo.adminGetAll(limit, skip);
      const formatData = data.map(async (d:any) => {
          const userData = await Promise.all(d.members.map(async (id:any) => {
            return await firstValueFrom(this.natsClient.send('info', id));
          }))
          return {
            ...d._doc,
            members:userData
          }
      })
      return await Promise.all(formatData);
    }
    async getAllByChannelId(channelId: string, limit:number, skip:any) {
      const total = await this.rsRepo.countData(channelId);
      const data = await this.rsRepo.getDataByChannelId(channelId, limit, skip);
      const formatData = await Promise.all(
        data.map(async(d:Chat) => {
          const replyData = d.replyTo && await this.rsRepo.getChatDataById(d.replyTo)
          return {
            ...d,
            replyContent:replyData
          }
        })
      )
      return {
        total,
        data:formatData
      }
    }
    async getImagesByChannelId(channelId: string, limit:number, skip:number) {
      const total = await this.rsRepo.countData(channelId,'image');
      const data = await this.rsRepo.getImagesByChannelId(channelId, limit, skip); 
      return {total,data}
    }
    async getAllByUserId(userId: number, limit:any, skip:any):Promise<ChannelResponse[]> {
      const data:ChannelResponse[] = await this.rsRepo.getAllByUserId(userId, limit, skip);
      const formatData = data.map(async (d:any) => {
          const userDataFilter = d.members.filter((m:any) => m !== userId);
          const userData = await Promise.all(userDataFilter.map(async (id:any) => {
            const resultEmployee =  await firstValueFrom(this.natsClient.send('info', id));
            return {id,...resultEmployee}
          }))
          return {
            ...d,
            members:userData          
          }
        })
        return await Promise.all(formatData);
    }
    async createChannel(createChannelDto: any) {
      return await this.rsRepo.createChannel(createChannelDto);
    }
    async createChat(data: {chat:CreateChatInput,images?:{channelId: string, chatId?: string, images: string, created_at: Date}[]}) {
      const chatData = await this.rsRepo.createChat(data.chat);
      if(data.images) {
        const imagesData = data.images.map((d:any) => {
          return {
            ...d,
            chatId: chatData._id
          }
        })
        await this.rsRepo.uploadImages(imagesData);
      }
      return chatData;
    }
    async updateChannel(id: string, updateChannelDto: any) {
      return await this.rsRepo.updateChannel(id, updateChannelDto);
    }
    async updateChat(id: string, updateChatDto: UpdateChatInput) {
      return await this.rsRepo.updateChat(id, updateChatDto);
    }
    async deleteChat(id: string) {
      return await this.rsRepo.deleteChat(id);
    }
}
