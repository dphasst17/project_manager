import { Controller, Inject, Post, Body, Get, Res, Patch, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
//@ts-ignore
import { RequestCustom } from 'utils/type';

@Controller('api/auth')
export class AuthController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) { }
  @Get('')
  async authChecked(){
    const natsCheck = await firstValueFrom(this.natsClient.send('authChecked', {}));
    return natsCheck
  }
  @Post('signin')
  async authSignIn(@Body() data: {username:string,password:string}, @Res() res: Response) {
    const result = await firstValueFrom(this.natsClient.send('authSignIn', data));
    return res.status(result.status).json(result);
  }
  @Post('signup')
  async authSignUp(@Body() data:any[], @Res() res: Response) {
    console.log(data)
    const result = await firstValueFrom(this.natsClient.send('authSignUp', data));
    return res.status(result.status).json(result);
  }
  @Patch('update')
  async updatePassword(@Body() data:{current:string,new:string}, @Req() req:RequestCustom, @Res() res: Response) {
    const id = req.id 
    const result = await firstValueFrom(this.natsClient.send('updatePassword', {id,...data}));
    return res.status(result.status).json(result);
  }
  
}

