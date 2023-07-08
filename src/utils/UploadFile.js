export const UploadFile = (obj) => {
  let form = new FormData()
  for (let value in obj) form.append(value, obj[value])
  return form;
}
