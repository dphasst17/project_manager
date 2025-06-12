import { Injectable } from '@nestjs/common';
import {InjectKysely} from 'nestjs-kysely';
import {Kysely} from 'kysely';
import {DB} from "../@types/rs.types";
//@ts-ignore
import {updateDataByCondition,ValueType,ConditionType} from "utils/query_custom";
@Injectable()
export class RsRepo {
    constructor(@InjectKysely() private readonly db: Kysely<DB>) { }
    async checkAccountLocked(username:string){
      const result = await this.db.selectFrom('auth')
      .select(["is_locked"])
      .where('username', '=', username)
      .execute()
      return result
    }
    async getData(key:"employee_id" | "username",value:string | number,getData?:string[]){
      const selectData = getData ? getData : ["employee_id","username","password_hash","failed_login_attempts","is_locked"]
      const result = await this.db.selectFrom('auth')
      .select<any>(selectData)
      .where(key, '=', value)
      .execute()
      return result
    }
    async updateDataAuth(data:ValueType[],condition:ConditionType){
      const result = updateDataByCondition(this.db,"auth",data,condition)
      return result
    }
    async insertDataAuth(data:any[]){
      const result = this.db.insertInto("auth")
      .values(data)
      .execute()
      return result
    }
    async deleteAuth(conditionName:string, value:string[] | number[]){
      return this.db.deleteFrom('auth')
      .where(conditionName as any, 'in', value)
      .executeTakeFirst()
    }
}
