/* eslint-disable no-throw-literal */
import { REQUEST_DATABASE } from "server/helpers/request"
import { EnvConstants } from "util/EnvConstants"
import { verify } from "jsonwebtoken"
import { CodificarBase64 } from "server/util/FunctionUtil"
import { serialize } from "cookie";
import MessageUtil from "server/util/MessageUtil"
import NextCors from 'nextjs-cors';

const AuthAccessController = async (req, res) => {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
 });
  
  const TOKEN = req.cookies[EnvConstants.REACT_APP_TOKEN];

  try {
    if (!TOKEN) throw ({ error: false, message: 'Unauthorized', status: 401 })
    const user = verify(TOKEN, EnvConstants.APP_TOKEN_AUTH)
    const { EMAIL, PASSWORD } = user.user;
    const { queryId } = req.body;
    
    if (!EMAIL) throw ({ error: true, message: 'Campo Email esta vacio', status: 401 })
    const result = await REQUEST_DATABASE({ body: { EMAIL, ID_USUARIO: 0 }, queryId });
    if (result.error === false) {
      const user = result.dataObject
      const passDecode = PASSWORD === user.PASSWORD
      const imagen = result.dataObject.IMAGEN && "data:image/png;base64," + CodificarBase64(result.dataObject.IMAGEN)
      const data = {...result, dataObject: {...result.dataObject, IMAGEN: imagen}}

      if (!passDecode) throw ({ error: true, message: 'La contraseña es incorrecta', status: 401 })
      if (result.error) throw({ ...result });
      return res.status(201).json({...data, message: "Te has logueado con éxito"})
    }
  } catch (err) {
    if (TOKEN) {
      const serialized = serialize(EnvConstants.REACT_APP_TOKEN, TOKEN, {
        httpOnly: true,
        secure: EnvConstants.APP_DEVELOPMENT,
        sameSite: 'strict',
        maxAge: 0,
        path: '/'
      })
      res.setHeader('Set-Cookie', serialized)
    }
    console.error(err);
    return res.status(err.status || 401).json({...MessageUtil.throwExcepctionServer(), ...err})
  }
}

export default AuthAccessController