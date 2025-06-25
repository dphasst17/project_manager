import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema({ collection: 'chat',versionKey:false})
export class Chat {
  @Prop({ ref: 'Channel', required: true })
  channelId: string;
  @Prop({ required: true })
  senderId: number;
  @Prop({ default: '' })
  content: string;
  @Prop({ type: Types.ObjectId, default: null })
  replyTo?: Types.ObjectId;
  @Prop({ default: [], required: true })
  reaction: {icon:any,employee_id:number}[]
  @Prop({ default: Date.now, required: true })
  createdAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
ChatSchema.index({ channelId: 1, createdAt: -1 });

@Schema({collection: 'images'})
export class Images{
  @Prop({required: true})
  channelId: Types.ObjectId
  @Prop({required: true})
  chatId: Types.ObjectId
  @Prop({required: true})
  url: string
  @Prop({default: Date.now, required: true})
  created_at: Date
}
export const ImagesSchema = SchemaFactory.createForClass(Images)
ImagesSchema.index({channelId: 1, date: -1})

