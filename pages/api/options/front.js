const { REQUEST_DATABASE } = require("server/helpers/request")
const MessageUtil = require("server/util/MessageUtil")

const OptionsFrontController = async (req, res) => {
  try {
    const result = await REQUEST_DATABASE(req.body);
    if (result.error) throw({ ...result });
    return res.status(201).json(result)
  } catch (err) {
    console.log(err)
    return res.status(err.status || 500).json({...MessageUtil.throwExcepctionServer(), ...err})
  }
}

export default OptionsFrontController