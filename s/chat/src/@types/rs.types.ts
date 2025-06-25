export interface ChatAttachment {
  url: string;
  name: string;
  size: number;
}
export interface Images{
  channelId: string,
  chatId?: string,
  images: string,
  created_at: Date
}
export interface CreateChatInput {
  channelId: string;
  senderId: number;
  content: string;
  replyTo?: string;
  images?: Images[];
}

export interface UpdateChatInput {
  content?: string;
  attachments?: ChatAttachment[];
}
export interface ChannelResponse {
  _id: string;
  name: string;
  members: number[] | any[];
  isArchived: boolean;
}
