import { EnvConstants } from "util/EnvConstants";
import { REQUEST_DATABASE } from "server/helpers/request"
import { UploadFile } from "server/util/UploadUtil";
import MessageUtil from "server/util/MessageUtil"
import cloudinary from "cloudinary";

export const config = { api: { bodyParser: false } };

const ObtenerPropImagen = (dataResponse) => {
  if (Object.prototype.toString.call(dataResponse) === '[object Array]') {
    let arrNew = []
    dataResponse.forEach(el => {
      let obj = el;
      let objNew = {}

      for (let value in obj) {
        if (value === 'IMAGEN') objNew = { ...objNew, [value]: "data:image/png;base64," + CodificarBase64(obj[value]) }
        else objNew = { ...objNew, [value]: obj[value] }

        if (obj[value] instanceof Object) {
        
          if (Object.prototype.toString.call(obj[value]) === '[object Array]') {
            let arrayNew = obj[value].map(el => {
              if (Object.prototype.toString.call(el) === '[object Object]') return ObtenerPropImagen(el)
            })

            objNew = { ...objNew, [value]: arrayNew }
          } else if (Object.prototype.toString.call(obj[value]) === '[object Object]') {
            const objImagen = ObtenerPropImagen(el)
            objNew = { ...objNew, [value]: objImagen }
          }
        }
      }

      arrNew.push(objNew)
    })

    return arrNew
  } else if (Object.prototype.toString.call(dataResponse) === '[object Object]') {
    let obj = dataResponse;
    let objNew = {}

    for (let value in obj) {
      if (value === 'IMAGEN') objNew = { ...objNew, [value]: "data:image/png;base64," + CodificarBase64(obj[value]) }
      else objNew = { ...objNew, [value]: obj[value] }
      
      const isArrayProp = ['ARR', 'OBJ'].includes(value.split('_')[0]);
      const valueData = isArrayProp ? JSON.parse(obj[value]) : obj[value];

      if (valueData instanceof Object) {
        if (Object.prototype.toString.call(valueData) === '[object Array]') {
          let arrayNew = valueData.map(el => {
            if (Object.prototype.toString.call(el) === '[object Object]') return ObtenerPropImagen(el)
          })
          objNew = { ...objNew, [value.replace(/^ARR_/, '')]: arrayNew }
          delete objNew[value]
        } else if (Object.prototype.toString.call(valueData) === '[object Object]') {
          const objImagen = ObtenerPropImagen(el)
          objNew = { ...objNew, [value.replace(/^OBJ_/, '')]: objImagen }
          delete objNew[value]
        }
      }
    }

    return objNew
  }      
}

const UploadCloudController = async (req, res) => {
  const options = await UploadFile(req, false);
  let data = {};
  for (let value in options.fields) data = { ...data, [value]: options.fields[value][0] }
  data = ObtenerPropImagen(data);

  try {
    cloudinary.config({ cloud_name: EnvConstants.APP_CLOUDINARY_NAME, api_key: EnvConstants.APP_CLOUDINARY_KEY, api_secret: EnvConstants.APP_CLOUDINARY_API_SECRET })
    const fileUpload = await cloudinary.uploader.upload(options.files.PORTADA[0].filepath)
    const body = { ...data, PORTADA: fileUpload.url }
    const result = await REQUEST_DATABASE({ queryId: data.queryId, body });
    if (result.error) throw({ ...result });
    
    return res.status(201).json(result)
  } catch (err) {
    console.error(err);
    return res.status(err.status || 500).json({...MessageUtil.throwExcepctionServer(), ...err})
  }
};

export default UploadCloudController;