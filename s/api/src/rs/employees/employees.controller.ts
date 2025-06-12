import { Controller, Inject, Post, Body, Get, Req, Patch, Res,Query,Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
//@ts-ignore
import { RequestCustom } from 'utils/type';
import { Response } from 'express';
@Controller('api/employees')
export class EmployeesController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) { }
  //admin create team
  @Post('team')
  async createTeam(@Body() team: any, @Res() res: Response) {
    const data = await firstValueFrom(this.natsClient.send('createTeam', team));
    return res.status(data.status).json(data);
  }
  //admin add team member
  @Post('team/member')
  async addTeamMember(@Body() team_member: any, @Res() res: Response) {
    const data = await firstValueFrom(this.natsClient.send('addTeamMember', team_member));
    return res.status(data.status).json(data);
  }
  //admin get all employees
  @Post('')
  async getAll(@Query('page') page: number, @Query('limit') limit: number, @Res() res: Response) {
    const data = await firstValueFrom(this.natsClient.send('getEmployees', {page,limit}));
    return res.status(data.status).json(data);

  }
  // admin get employees by id
  @Get('detail/:id')
  async adminGetEmployeesById(@Param() id:number, @Res() res: Response) {
    const data = await firstValueFrom(this.natsClient.send('getEmployeesById', id));
    return res.status(data.status).json(data);
  }
  //get info employee by id
  @Post('info')
  async getInfoEmployee(@Req() req: RequestCustom, @Res() res: Response) {
    const id = req.id
    const data = await firstValueFrom(this.natsClient.send('getEmployeesById', id));
    return res.status(data.status).json(data);
  }
  //admin get all team
  @Get('team')
  async getAllTeam(@Res() res: Response) {
    const data = await firstValueFrom(this.natsClient.send('getTeams', {}));
    return res.status(data.status).json(data);
  }
  //admin get all employee by team
  @Get('team/member/:id')
  async getTeamMemberById(@Param() id:number, @Res() res: Response) {
    const data = await firstValueFrom(this.natsClient.send('getTeamMemberById', id));
    return res.status(data.status).json(data);
  }
  // remove it or update it
  /*@Get('team/:id')
  async getTeamById(@Param() id:number, @Res() res: Response) {
    const data = await firstValueFrom(this.natsClient.send('getTeamMemberById', id));
    return res.status(data.status).json(data);
  }*/

  //admin Update
  @Patch('employee/:id')
  async updateEmployee(@Param() id:number,@Body() employee: any, @Res() res: Response) {
    const data = {
      id,
      employee
    }
    const result = await firstValueFrom(this.natsClient.send('updateEmployee', data));
    return res.status(result.status).json(result);
  }
  @Patch('team/:id')
  async updateTeam(@Param() id:number,@Body() team: any, @Res() res: Response) {
    const data = {
      id,
      team
    }
    const result = await firstValueFrom(this.natsClient.send('updateTeam', data));
    return res.status(result.status).json(result);
  }
}
