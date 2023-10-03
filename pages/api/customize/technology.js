
import { REQUEST_DATABASE } from "server/helpers/request"
import { UploadFile } from "server/util/UploadUtil";
import { ValidarAuth } from "server/util/FunctionUtil"
import MessageUtil from "server/util/MessageUtil"

export const config = { api: { bodyParser: false } };

export const TechnologyController = async (req, res) => {
  await ValidarAuth(req)
  const options = await UploadFile(req, true, null, "/public/assets/tech");
  let pathname = options.files?.IMAGEN[0]?.filepath;
  let data = {};
  for (let value in options.fields) data = { ...data, [value]: options.fields[value][0] }
  
  try {
    if (!pathname) throw(MessageUtil.throwExcepctionServer('Error al subir la imagen'))
    const body = { ...data, IMAGEN: pathname }
    const result = await REQUEST_DATABASE({ queryId: data.queryId, body });

    if (result.error) throw({ ...result });
    return res.status(201).json(result)
  } catch (err) {
    console.error(err)
    return res.status(err.status || 500).json({...MessageUtil.throwExcepctionServer(), ...err})
  }
}

export default TechnologyController;