import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChannelDocument = Channel & Document;

@Schema({ collection: 'channel',versionKey:false })
export class Channel {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [Number], required: true })
  members: number[];

  @Prop({ default: false })
  isArchived: boolean;

  @Prop({ default: Date.now, required: true })
  createdAt: Date;

  @Prop({ default: Date.now, required: true })
  updatedAt: Date;
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);


