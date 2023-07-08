import { serialize } from "cookie";
import EnvConstants from "util/EnvConstants.js";
import jwt from "jsonwebtoken";

const AuthLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const {myTokenName} = req.cookies;
    
    if (!myTokenName) return req.status(401).json({error: 'No token'})

    if (email === "admin@local.local" && password === "admin") {
      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 34 * 30,
          email,
          username: "johann",
        },
        "secret"
      );

      const serialized = serialize('myTokenName', token, {
        httpOnly: true,
        secure: EnvConstants.APP_DEVELOPMENT,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 34 * 30,
        path: '/'
      })
    
      res.setHeader('Set-Cookie', serialized)
      return res.json('login successfully');
    }

    return res.status(401).json({error: 'invalid email or password'});
  } catch (error) {
    return res.status(500).json({error: 'error in the server'});
  }
}

export default AuthLoginController