/* eslint-disable no-throw-literal */
import { REQUEST_DATABASE } from "server/helpers/request";
import { EnabledCors } from "server/util/FunctionUtil"
import bcrypt  from "bcrypt"
import MessageUtil from  "server/util/MessageUtil"

const AuthSignUpController = async (req, res) => {
  await EnabledCors(req, res);
  try {
    const { queryId } = req.body;
    const { PASSWORD } = req.body.body;
    let passEncode;

    if (PASSWORD) {
      const salt = await bcrypt.genSalt(10);
      passEncode = bcrypt.hashSync(PASSWORD, salt)
    }

    const result = await REQUEST_DATABASE({ body: { ...req.body.body, PASSWORD: passEncode }, queryId });
    if (result.error) throw({ ...result });
    
    return res.status(201).json(result)
  } catch (err) {
    console.error(err);
    return res.status(err.status || 500).json({...MessageUtil.throwExcepctionServer(), ...err})
  }
}

export default AuthSignUpController