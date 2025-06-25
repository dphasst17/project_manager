import {Controller, Req, Res, Param, Body, Query, Inject, Get, Post, Patch, Delete} from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {firstValueFrom} from "rxjs";
import {Response} from "express";
//@ts-ignore
import {RequestCustom} from "utils/type";
@Controller('api/chat')
export class ChatController {
  constructor(
    @Inject('NATS_SERVICE') private natsClient: ClientProxy
  ){}
  @Get('/admin')
  async adminGetAll(@Query('limit') limit:number,@Query('skip') skip:number,@Res() res: Response){
   const result = await firstValueFrom(this.natsClient.send('all', {limit,skip})); 
   return res.status(result.status).json(result)
  }
  @Get('/employee')
  async getChatByEmployee(@Query('limit') limit:number,@Query('skip') skip:number, @Req() req:RequestCustom,@Res() res: Response){
    const id = req.id
    const result = await firstValueFrom(this.natsClient.send('user_id', {id,limit,skip})); 
    return res.status(result.status).json(result)
  }
  @Get('detail/:id')
  async getChatById(@Query('limit') limit:number,@Query('skip') skip:number,@Param('id') id:string,@Res() res: Response){
    const result = await firstValueFrom(this.natsClient.send('chat_id', {id,limit,skip})); 
    return res.status(result.status).json(result)
  }
  @Get('images/:id')
  async getImagesByChannelId(@Query('limit') limit:number,@Query('skip') skip:number,@Param('id') id:string,@Res() res: Response){
    const result = await firstValueFrom(this.natsClient.send('image', {id,limit,skip})); 
    return res.status(result.status).json(result)
  }
  @Post('')
  async createChat(@Body() createChatDto: any,@Res() res: Response,@Req() req:RequestCustom){
    const id = req.id
    const data = {
      ...createChatDto,
      chat:{
        ...createChatDto.chat,
        senderId:id
      }
    }
    const result = await firstValueFrom(this.natsClient.send('createChat', data)); 
    return res.status(result.status).json(result)
  }
  @Post('channel')
  async createChannel(@Body() createChannelDto: any,@Res() res: Response){
    const result = await firstValueFrom(this.natsClient.send('createChannel', createChannelDto)); 
    return res.status(result.status).json(result)
  }
  @Patch('')
  async updateChat(@Body() updateChatDto: any,@Res() res: Response){
    const result = await firstValueFrom(this.natsClient.send('updateChat', updateChatDto)); 
    return res.status(result.status).json(result)
  }
  @Patch('channel')
  async updateChannel(@Body() updateChannelDto: any,@Res() res: Response){
    const result = await firstValueFrom(this.natsClient.send('updateChannel', updateChannelDto)); 
    return res.status(result.status).json(result)
  }
  @Delete(':id')
  async deleteChat(@Param('id') id:string,@Res() res: Response){
    const result = await firstValueFrom(this.natsClient.send('deleteChat', {id})); 
    return res.status(result.status).json(result)
  }
}
