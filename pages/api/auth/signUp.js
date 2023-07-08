/* eslint-disable no-throw-literal */
import { REQUEST_DATABASE } from "server/helpers/request";
import MessageUtil from  "server/util/MessageUtil"
import bcrypt  from "bcrypt"

const AuthSignUpController = async (req, res) => {
  try {
    const { PASSWORD } = req.body.body;
    let passEncode;

    if (PASSWORD) {
      const salt = await bcrypt.genSalt(10);
      passEncode = bcrypt.hashSync(PASSWORD, salt)
    }

    const result = await REQUEST_DATABASE({ body: { ...req.body.body, PASSWORD: passEncode }, queryId: 8 });
    if (result.error) throw({ ...result });
    
    return res.status(201).json(result)
  } catch (err) {
    return res.status(err.status || 500).json({...MessageUtil.throwExcepctionServer(), ...err})
  }
}

export default AuthSignUpController