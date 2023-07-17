import { REQUEST_DATABASE } from "server/helpers/request"
import { ValidarAuth, CodificarBase64 } from "server/util/FunctionUtil"
import MessageUtil from "server/util/MessageUtil"
import typesErrors from "server/util/MessageUtil.js";

const ProfileController = async (req, res) => {
  try {
    await ValidarAuth(req)
    const result = await REQUEST_DATABASE(req.body);
    const data = { ...result.dataObject, DATA_PERSONAL: { ...result.dataObject.DATA_PERSONAL, IMAGEN: result.dataObject.DATA_PERSONAL.IMAGEN && "data:image/png;base64," + CodificarBase64(result.dataObject.DATA_PERSONAL.IMAGEN) }}
    if (result.error) throw({ ...result });
    console.log(data)
    return res.status(201).json(typesErrors.returnData(data))
  } catch (err) {
    console.log(err)
    return res.status(err.status || 500).json({...MessageUtil.throwExcepctionServer(), ...err})
  }
}

export default ProfileController