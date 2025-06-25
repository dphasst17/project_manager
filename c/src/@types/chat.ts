export interface Channel {
  _id?: string;
  name: string;
  members: any[];
  isArchived: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface Images {
  _id?:string,
  channelId: string;
  chatId?: string;
  url: string;
  created_at?: Date;
}
export interface Chat {
  _id: string;
  channelId: string;
  senderId: number;
  content: string;
  reaction?:any[]
  replyTo?: string;
  replyContent?: string;
  createdAt: string;
  updatedAt: string;
  images: Images[]
}
