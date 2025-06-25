import {Chat, Images} from "@/@types/chat"

const adminGetAll = async(token:string,limit:number,skip:number) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL_SERVER}/chat/admin?skip=${skip}&limit=${limit}`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  })
  return res.json()
}
const getByEmployee = async(token:string,limit:number,skip:number) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL_SERVER}/chat/employee?skip=${skip}&limit=${limit}`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  })
  return res.json()
}
const getChatByChannelId = async(id:string,limit:number,skip:number) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL_SERVER}/chat/detail/${id}?skip=${skip}&limit=${limit}`,{
    method: 'GET',
  })
  return res.json()
}
const getImagesByChannelId = async(id:string,limit:number,skip:number) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL_SERVER}/chat/images/${id}?skip=${skip}&limit=${limit}`,{
    method: 'GET',
  })
  return res.json()
}
const createChat = async(token:string,data: {chat:Chat,images?:Images[]}) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL_SERVER}/chat`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
  return res.json()
}

const createChannel = async(token:string,data: any) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL_SERVER}/chat/channel`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
  return res.json()
}
const updateChat = async(token:string,data: any) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL_SERVER}/chat`,{
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
  return res.json()
}
const updateChannel = async(token:string,data:any) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL_SERVER}/chat/channel`,{
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
  return res.json()
}

export {
  adminGetAll,
  getByEmployee,
  getChatByChannelId,
  getImagesByChannelId,
  createChat,
  createChannel,
  updateChat,
  updateChannel
}
