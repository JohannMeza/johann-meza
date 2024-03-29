/* eslint-disable no-throw-literal */
import { REQUEST_DATABASE } from "server/helpers/request.js"
import { EnvConstants } from "util/EnvConstants";
import { CodificarBase64 } from "server/util/FunctionUtil"
import { serialize } from "cookie";
import { EnabledCors } from "server/util/FunctionUtil"
import MessageUtil from "server/util/MessageUtil"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const AuthSignInController = async (req, res) => {
  await EnabledCors(req, res);
  try {
    const { EMAIL, PASS } = req.body.body;
    const { queryId } = req.body;

    if (!EMAIL) throw ({ error: true, message: 'Campo Email esta vacio', status: 401 })
    const result = await REQUEST_DATABASE({ body: { EMAIL, ID_USUARIO: 0 }, queryId });
    
    if (result.error === false) {
      const user = result.dataObject
      const passDecode = bcrypt.compareSync(PASS, user.PASSWORD)
      const imagen = result.dataObject.IMAGEN && "data:image/png;base64," + CodificarBase64(result.dataObject.IMAGEN)
      const data = {...result, dataObject: {...result.dataObject, IMAGEN: imagen}}

      if (!passDecode) throw ({ error: true, message: 'La contraseña es incorrecta', status: 401 })
      
      const token = jwt.sign({ user }, EnvConstants.APP_TOKEN_AUTH, { expiresIn: 86400 * 7 /* 24 horas * 7 dias */ })
      if (result.error) throw({ ...result });

      const serialized = serialize(EnvConstants.REACT_APP_TOKEN, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 34 * 30,
        path: '/'
      })

      res.setHeader('Set-Cookie', serialized)
      return res.status(201).json({...data, message: "Te has logueado con éxito"})
    } else {
      throw(result);
    }
  } catch (err) {
    console.error(err)
    return res.status(err.status || 500).json({...MessageUtil.throwExcepctionServer(), ...err})
  }
}

export default AuthSignInController