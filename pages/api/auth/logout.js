import { EnvConstants } from "util/EnvConstants";
import { serialize } from "cookie";
import { EnabledCors } from "server/util/FunctionUtil"

const AuthLogoutController = async (req, res) => {
  await EnabledCors(req, res);  
  const TOKEN = req.cookies[EnvConstants.REACT_APP_TOKEN];
  if (!TOKEN) return res.status(401).json({error: 'No token'})
  try {
    const serialized = serialize(EnvConstants.REACT_APP_TOKEN, TOKEN, {
      httpOnly: true,
      secure: EnvConstants.APP_DEVELOPMENT,
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    })
    res.setHeader('Set-Cookie', serialized)
    return res.status(200).json('logout successfully')
  } catch (error) {
    console.error(error);
    return res.status(401).json({error: 'invalid token'})
  }
}

export default AuthLogoutController