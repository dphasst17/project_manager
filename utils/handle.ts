const handleTryCatch = async (handler:() => any) => {
  try{
    const res = await handler()
    return res
  }
  catch(e){
    console.log(e)
    return{
      status:500,
      message:"Internal Server Error"
    }
  }
}
const formatTime = (data: Date | string) => {
  const date = new Date(data)
  const hours = String(date.getHours()).padStart(2, "0");     // 0–23
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};
const formatDate = (date: Date | string) => {
  const reverseDate = new Date(date)
  return reverseDate.toISOString().split("T")[0]
}
export {handleTryCatch,formatTime,formatDate}
