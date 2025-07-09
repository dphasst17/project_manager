const signIn = async(username:string,password:string) => {
  const res = await fetch(`${import.meta.env.VITE_URL_SERVER}/auth/signin`,{
    method:'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({username,password})
  })
  return res.json()
}
const signUp = async (token:string,data:{auth:any,employee:any,role:any,team:any}[]) => {
  const res = await fetch(`${import.meta.env.VITE_URL_SERVER}/auth/signup`,{
    method:'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
  return res.json()
}
const updateAuth = async (token:string,data:{[key:string]:any}) => {
  const res = await fetch(`${import.meta.env.VITE_URL_SERVER}/auth/update`,{
    method:'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
  return res.json()
}

export {signIn,signUp,updateAuth}

