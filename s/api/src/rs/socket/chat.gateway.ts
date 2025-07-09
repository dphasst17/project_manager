import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
@WebSocketGateway({
    cors: {
        origin: '*',
    },
    methos: ['GET', 'POST'],

})

export class ChatGateway {
  @WebSocketServer()
  socket: Server
  constructor(
    @Inject('NATS_SERVICE') private readonly nats: ClientProxy
  ) { }
  @SubscribeMessage('join_channel')
  async joinChannel(client: Socket, data:{channel:string}) {
    client.join(data.channel)
    const getMeeting = await firstValueFrom(this.nats.send('redis_get', {key:`meeting:${data.channel}`}))
    client.emit('join_channel', {message:'join channel success',channel:data.channel,meeting:getMeeting})
  }
  @SubscribeMessage('insert_message')
  async insertMessage(client: Socket, data:{channelId:string,content:string,id:number,images?:any[]}) {
    this.socket.to(data.channelId).emit('message', data)
  }
  @SubscribeMessage('create_channel')
  async createChannel(client: Socket, data:{channel:string}) {
    this.socket.emit('create_channel', data)
  }
  // public meeting
  @SubscribeMessage('all_public_meeting')
  async getAllMeeting(client: Socket) {
    const meeting = await firstValueFrom(this.nats.send('get_all_meetings', {}))
    client.emit('all_public_meeting', meeting)
  }
  @SubscribeMessage('set_public_meeting')
  async setMeeting(client: Socket, data:{id:string,title:string,url:string}) {
    const meeting = await firstValueFrom(this.nats.send('set_meeting', data))
    console.log(meeting)
    this.socket.emit('public_meeting', data)
  }
  @SubscribeMessage('get_public_meeting')
  async getMeeting(client: Socket, data:{id:string}) {
    const meeting = await firstValueFrom(this.nats.send('get_meeting', data))
    this.socket.emit('get_public_meeting', meeting)
  }
  @SubscribeMessage('remove_public_meeting')
  async removeMeeting(client: Socket, data:{id:string}) {
    const meeting = await firstValueFrom(this.nats.send('remove_meeting', data))
    this.socket.emit('remove_public_meeting', meeting)
  }

  //
  @SubscribeMessage('on_meeting')
  async createMeeting(client: Socket, data:{channel?:string,url:string}) {
    await firstValueFrom(this.nats.send('redis_set', [{key:`meeting:${data.channel}`,value:{url:data.url}}]))
    if(data.channel){
      this.socket.to(data.channel).emit('on_meeting', data)
    }else{
      this.socket.emit('on_meeting', data)
    }
  }
  @SubscribeMessage('off_meeting')
  async offMeeting(client: Socket, data:{channel:string}) {
    const meeting = await firstValueFrom(this.nats.send('redis_del', {key:`meeting:${data.channel}`}))
    this.socket.to(data.channel).emit('off_meeting', meeting)
  }
}
