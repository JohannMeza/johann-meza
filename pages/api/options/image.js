import { REQUEST_DATABASE } from "server/helpers/request"
import { ValidarAuth, CodificarBase64 } from "server/util/FunctionUtil"
import MessageUtil from "server/util/MessageUtil"
import typesErrors from "server/util/MessageUtil.js";

const ImageController = async (req, res) => {
  try {
    const result = await REQUEST_DATABASE(req.body);
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

        return objNew
      }      
    }
    
    const data = ObtenerPropImagen(result.dataObject || result.dataList)
    if (result.error) throw({ ...result });
    return res.status(201).json(typesErrors.returnData(data))
  } catch (err) {
    console.error(err)
    return res.status(err.status || 500).json({...MessageUtil.throwExcepctionServer(), ...err})
  }
}

export default ImageController