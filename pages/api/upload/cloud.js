import { EnvConstants } from "util/EnvConstants";
import { REQUEST_DATABASE } from "server/helpers/request"
import { UploadFile } from "server/util/UploadUtil";
import MessageUtil from "server/util/MessageUtil"
import cloudinary from "cloudinary";

export const config = { api: { bodyParser: false } };

const UploadCloudController = async (req, res) => {
  const options = await UploadFile(req, false);
  let data = {};
  for (let value in options.fields) data = { ...data, [value]: options.fields[value][0] }

  try {
    cloudinary.config({ cloud_name: EnvConstants.APP_CLOUDINARY_NAME, api_key: EnvConstants.APP_CLOUDINARY_KEY, api_secret: EnvConstants.APP_CLOUDINARY_API_SECRET })
    const fileUpload = await cloudinary.uploader.upload(options.files.PORTADA[0].filepath)
    const body = { ...data, PORTADA: fileUpload.url, ID_CATEGORIAS: JSON.parse(data.ID_CATEGORIAS), ID_ETIQUETAS: JSON.parse(data.ID_ETIQUETAS) }
    const result = await REQUEST_DATABASE({ queryId: data.queryId, body });
    if (result.error) throw({ ...result });
    return res.status(201).json(result)
  } catch (err) {
    return res.status(err.status || 500).json({...MessageUtil.throwExcepctionServer(), ...err})
  }
};

export default UploadCloudController;