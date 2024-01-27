const { REQUEST_DATABASE } = require("server/helpers/request")
import { EnabledCors } from "server/util/FunctionUtil"
const MessageUtil = require("server/util/MessageUtil")

const OptionsFrontController = async (req, res) => {
  await EnabledCors(req, res);
  try {
    const result = await REQUEST_DATABASE(req.body);
    if (result.error) throw({ ...result });
    return res.status(201).json(result)
  } catch (err) {
    console.error(err)
    return res.status(err.status || 500).json({...MessageUtil.throwExcepctionServer(), ...err})
  }
}

export default OptionsFrontController