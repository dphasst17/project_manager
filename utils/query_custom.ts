export interface ConditionType {
  conditionName: string;
  conditionMethod: "=" | "!=" | ">=" | "<=" | "like" | "not like" | "in" | "not in";
  value: string | number | number[] | string[];
}
export interface columnAddType {
  name: string,
  datatypes: DataTypes,
  isNull: boolean,
  limit: number
}
export interface ValueType {
  column: string;
  value: string | number ;
}

type DataTypes = "varchar" | "integer" | "date"
const insertData = async(db:any,table:string,data:ValueType[]) => {
  const result = data.map((c: ValueType) => `${c.column}:${typeof c.value === "string" ? `"${c.value}"` : c.value}`).toString();
  return await db
    .insertInto(table)
    .values(eval(`({${result}})`))
    .executeTakeFirst();
}
const updateDataByCondition = async (db:any,table: string, data: ValueType[], condition: ConditionType) => {
    const result = data.map((c) => `${c.column}:${typeof c.value === "string" ? `'${c.value}'` : c.value}`).toString();
    return await db
      .updateTable(table)
      .set(eval(`({${result}})`))
      .where(condition.conditionName, condition.conditionMethod, condition.value)
      .executeTakeFirst();
  };
const createIndex = async (db:any,indexName: string, table: string, column: string[]) => {
    return await db.schema.createIndex(indexName)
      .on(table)
      .columns(column)
      .execute()
  }
const dropIndex = async (db:any,indexName: string) => {
  return await db.schema.dropIndex(indexName).execute()
}

export {insertData,updateDataByCondition,createIndex,dropIndex}
