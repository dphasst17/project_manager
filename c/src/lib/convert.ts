import { Chat } from "@/@types/chat"
export const convertDate = (date:string,returnData:'day' | 'time') => {
  const utcDate = new Date(date);
  const vnDate = utcDate.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  const splitData = vnDate.split(' ');
  const day = splitData[1];
  const time = splitData[0].split(':').slice(0,2).join(':');
  return returnData === 'day' ? day : time;
}
export const convertDataChat = (data:Chat[]) => {
  const listDate = Array.from(
        new Set(data.map((d: Chat) => d.createdAt.split("T")[0])),
    )
    const result = listDate.map((d: any) => {
        return {
            date: d,
            data: data.filter((c: Chat) => c.createdAt.split("T")[0] === d),
        };
    });
    return result;
}
