const imagesUpload = async (files: FormData) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL_SERVER}/file/images`,{
    method: 'POST',
    body: files
  })
  return res.json()
}

export {
  imagesUpload
}
