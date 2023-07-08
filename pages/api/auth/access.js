/* eslint-disable no-throw-literal */
import { REQUEST_DATABASE } from "server/helpers/request"
import { EnvConstants } from "util/EnvConstants"
import MessageUtil from "server/util/MessageUtil"
import { sign, verify } from "jsonwebtoken"

const AuthAccessController = async (req, res) => {
  try {
    const TOKEN = req.cookies[EnvConstants.REACT_APP_TOKEN];

    if (!TOKEN) throw({ status: 301, error: true, message: "Token no proveido"})
    
    const user = verify(TOKEN, EnvConstants.APP_TOKEN_AUTH)
    const { EMAIL, PASSWORD } = user.user;
    const { queryId } = req.body;

    if (!EMAIL) throw ({ error: true, message: 'Campo Email esta vacio', status: 401 })
    const result = await REQUEST_DATABASE({ body: { EMAIL, ID_USUARIO: 0 }, queryId });

    if (result.error === false) {
      const user = result.dataObject
      const passDecode = PASSWORD === user.PASSWORD
      
      if (!passDecode) throw ({ error: true, message: 'La contraseña es incorrecta', status: 401 })
      if (result.error) throw({ ...result });

      return res.status(201).json({...result, message: "Te has logueado con éxito"})
    }
  } catch (err) {
    return res.status(err.status || 500).json({...MessageUtil.throwExcepctionServer(), ...err})
  }
}

export default AuthAccessController