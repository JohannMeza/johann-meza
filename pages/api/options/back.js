/* eslint-disable no-throw-literal */
import { REQUEST_DATABASE } from "server/helpers/request"
import { ValidarAuth } from "server/util/FunctionUtil"
import MessageUtil from "server/util/MessageUtil"

const OptionsBackController = async (req, res) => {
  try {
    await ValidarAuth(req)
    const result = await REQUEST_DATABASE(req.body);
    if (result.error) throw({ ...result });
    return res.status(201).json(result)
  } catch (err) {
    return res.status(err.status || 500).json({...MessageUtil.throwExcepctionServer(), ...err})
  }
}

export default OptionsBackController