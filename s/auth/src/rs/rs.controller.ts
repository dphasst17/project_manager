import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { RsService } from './rs.service';
import { SignIn } from '../@types/rs.types';
@Controller('')
export class RsController {
    constructor(private readonly rsService: RsService) { }
    @EventPattern('authChecked')
    async authChecked(){
      return {
        message: 'auth checked'
      }
    }
    @EventPattern('authSignIn')
    async authSignIn(data: {username:string,password:string}) {
        try{
          const result = this.rsService.authSignIn(data);
          return result
        }catch(e){
          console.log(e)
          return {status:500,message:'Server Error, Please Try Again'}
        }
    }
    @EventPattern('authSignUp')
    async authSignUp(data: SignIn[]) {
        try{
          const result = this.rsService.authSignUp(data);
          return result
        }catch(e){
          console.log(e)
          return {status:500,message:'Server Error, Please Try Again'}
        }
    }
    @EventPattern('updatePassword')
    async updatePassword(data:{id:number,current:string,new:string}){
      try{
        const result = this.rsService.updatePassword(data);
        return result
      }catch(e){
        console.log(e)
        return {status:500,message:'Server Error, Please Try Again'}
      }
    }
}
