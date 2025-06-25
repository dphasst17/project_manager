import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, Images } from '../schemas/chat.schema';
import {Channel} from '../schemas/channel.schema'
import { Model, Types } from 'mongoose';
import { CreateChatInput, UpdateChatInput } from '../@types/rs.types';

@Injectable()
export class RsRepo {
  constructor(
    @InjectModel('chat') private chatModel: Model<Chat>,
    @InjectModel('channel') private channelModel: Model<Channel>,
    @InjectModel('images') private imagesModel: Model<Images>,
  ) {}
  
  async countData(channelId?: string,collection?:'chat' | 'channel' | 'image') {
    const collectionData = [
      { name: 'chat', count: 'chatModel' },
      { name: 'channel', count: 'channelModel' },
      { name: 'image', count: 'imagesModel' },
    ]
    const foundItem = collectionData.find(item => item.name === collection);
    const count = foundItem ? foundItem.count : 'chatModel';
    const model =  collectionData && this[count];

    if(channelId) {
      return model.countDocuments({ channelId: collection === "chat" ? new Types.ObjectId(channelId) : channelId });
    }
    return model.countDocuments();
  }
  // read chat data by _id
  async getChatDataById(id: string | Types.ObjectId) {
    return await this.chatModel.findById({_id: new Types.ObjectId(id)});
  }
  //read
  async adminGetAll (limit = 20, skip = 0) {
    return await this.channelModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
  }
  //read data message according to channel id
  async getDataByChannelId(channelId: string, limit = 20, skip = 0) {
    const data = await this.chatModel.aggregate([
      { $match: { channelId: channelId } },
      { $lookup: { from: 'images', localField: '_id', foreignField: 'chatId', as: 'images' } },
      { $sort: { _id:-1 } },
      { $skip: skip },
      { $limit: limit }
    ]);
    return data.reverse()
  }
  async getImagesByChannelId(channelId: string, limit = 20, skip = 0) {

    const data = await this.imagesModel.find({ channelId: channelId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    return data
  }
  //read data channel according to employee
  async getAllByUserId(userId: number, limit = 20, skip = 0) {
    const data = await this.channelModel.aggregate([
      { $match: { members: { $in: [userId] }, isArchived: false } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    ]);  
    return data
  }
  //admin will to create
  async createChannel(createChannelDto: any) {
    return await this.channelModel.create(createChannelDto);    
  }
  async createChat(createChatDto: CreateChatInput) {
    return await this.chatModel.create(createChatDto);    
  }
  
  //employee upload images
  async uploadImages(imagesData:{channelId: string, chatId: string, images: string, created_at: Date}[]) {
    return await this.imagesModel.create(imagesData);
  }
  //admin will to update channel
  async updateChannel(id: string, updateChannelDto: any) {
    return await this.channelModel.findByIdAndUpdate(
      id,
      { $set: updateChannelDto },
      { new: true },
    );
  }
  async updateChat(id: string, updateChatDto: UpdateChatInput) {
    return await this.chatModel.findByIdAndUpdate(
      id,
      { $set: updateChatDto },
      { new: true },
    );
  }

  //delete
  async deleteChat(id: string) {
    return await this.chatModel.findByIdAndDelete(id);
  }
}

