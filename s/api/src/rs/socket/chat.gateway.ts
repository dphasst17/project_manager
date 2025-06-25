import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io';
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
  ) { }
  @SubscribeMessage('join_channel')
  async joinChannel(client: Socket, data:{channel:string}) {
    client.join(data.channel)
    client.emit('join_channel', {message:'join channel success',channel:data.channel})
  }
  @SubscribeMessage('insert_message')
  async insertMessage(client: Socket, data:{channelId:string,content:string,id:number,images?:any[]}) {
    this.socket.to(data.channelId).emit('message', data)
  }
  async createChannel(client: Socket, data:{channel:string}) {
    this.socket.emit('create_channel', data)
  }

}
