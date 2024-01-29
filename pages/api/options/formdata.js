/* eslint-disable no-throw-literal */
import { REQUEST_DATABASE } from "server/helpers/request"
import { ValidarAuth, BodyParser } from "server/util/FunctionUtil"
import { EnabledCors } from "server/util/FunctionUtil"
import MessageUtil from "server/util/MessageUtil"
export const config = { api: { bodyParser: false } };

const FormdataController = async (req, res) => {
  await EnabledCors(req, res);
  try {
    const user = await ValidarAuth(req)
    const options = await BodyParser(req);
    
    let data = {};
    for (let value in options.fields) data = { ...data, [value]: options.fields[value][0] }
    const body = { queryId: data.queryId, body: { ...data, ID_USUARIOS: user.ID_USUARIOS.toString() } }
    const result = await REQUEST_DATABASE(body);
    if (result.error) throw({ ...result });
    return res.status(201).json(result)
  } catch (err) {
    console.error(err)
    return res.status(err.status || 500).json({...MessageUtil.throwExcepctionServer(), ...err})
  }
}

export default FormdataController