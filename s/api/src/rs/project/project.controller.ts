import { Controller, Inject, Post, Body, Get, Patch, Res, Req, Query,Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
//@ts-ignore
import { RequestCustom } from 'utils/type';
@Controller('api/project')
export class ProjectController {
 constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) { }

  @Get('')
  async getProjects(@Query('page') page: number, @Query('limit') limit: number, @Res() res: Response) {
    const data =  await firstValueFrom(this.natsClient.send('getProjects', { page, limit }));
    return res.status(data.status).json(data);
  }
  @Get('task')
  async adminGetAllTask(@Query('page') page: number, @Query('limit') limit: number, @Res() res: Response){
    const data =  await firstValueFrom(this.natsClient.send('getAllTasks', { page, limit }))
    return res.status(data.status).json(data) 
  }
  @Get('task/status')
  async adminGetTaskByStatus(@Query('status') status: string,@Query('page') page: number, @Query('limit') limit: number, @Res() res: Response) {
    const data =  await firstValueFrom(this.natsClient.send('getTaskByStatus', {page,limit,status}));
    return res.status(data.status).json(data);
  }
  @Get('detail/:id')
  async getDetailProject(@Param('id') id: number, @Res() res: Response) {
    const data =  await firstValueFrom(this.natsClient.send('getDetailProject', { id }));
    return res.status(data.status).json(data);
  }
  //admin create project
  @Post('')
  async createProject(@Body() data:{project:any,assignment:any,task:any}, @Res() res: Response) {
    const result =  await firstValueFrom(this.natsClient.send('createProject', { project:data.project,assignment:data.assignment,task:data.task }));
    return res.status(result.status).json(result);
  }
  @Post('append')
  async append(@Body() data:{type:"project_assignments" | "tasks" | "budgets",value:any}, @Res() res: Response) {
    const result =  await firstValueFrom(this.natsClient.send('append', data));
    return res.status(result.status).json(result);
  }

  //get task by employee
  @Get('task/employee')
  async getTaskByEmployee(@Query('page') page: number, @Query('limit') limit: number,@Req() req: RequestCustom, @Res() res: Response) {
    const id = req.id
    const result =  await firstValueFrom(this.natsClient.send('getTaskByEmployee', { id,limit,page}));
    return res.status(result.status).json(result);
  }
  @Get('task/employee/status')
  async getTaskByStatus(@Query('status') status: string,@Query('page') page: number, @Query('limit') limit: number,@Req() req: RequestCustom, @Res() res: Response) {
    const id = req.id
    const result =  await firstValueFrom(this.natsClient.send('getTaskByStatus', {page,limit,status,id}));
    return res.status(result.status).json(result);
  }
  @Post('employee')
  async getProjectByEmployee(@Query('page') page: number, @Query('limit') limit: number,@Req() req: RequestCustom, @Res() res: Response) {
    const id = req.id
    const result =  await firstValueFrom(this.natsClient.send('getProjectByEmployee', { id,page,limit }));
    return res.status(result.status).json(result);
  }
  @Patch('')  
  async updateProject(@Body() data:{name:'project' | 'assignment' | 'tasks',data:any,condition:{name:string,value:string | number}}, @Res() res: Response) {
    const result =  await firstValueFrom(this.natsClient.send('updateProject', data));
    return res.status(result.status).json(result);
  }
}
