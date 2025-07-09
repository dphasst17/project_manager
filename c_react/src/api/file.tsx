const imagesUpload = async (files: FormData) => {
  const res = await fetch(`${import.meta.env.VITE_URL_SERVER}/file/images`,{
    method: 'POST',
    body: files
  })
  return res.json()
}

export {
  imagesUpload
}

