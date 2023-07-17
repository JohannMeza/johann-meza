import fs from "fs";
import MessageUtil from "server/util/MessageUtil"
import formidable from "formidable";
import { EnvConstants } from "util/EnvConstants";
import { jwtVerify } from "jose";

export const CodificarBase64 = (file) => {
  try {
    const bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
  } catch (error) {
    return ""
  }
}

export const ValidarAuth = async (request) => {
  try {
    const jwt = request.cookies[EnvConstants.REACT_APP_TOKEN] || request.headers.cookies
    if (jwt === undefined) throw(MessageUtil.throwExcepctionServer('Token de usuario no valido'))
    const {payload} = await jwtVerify(jwt, new TextEncoder().encode(EnvConstants.APP_TOKEN_AUTH))
    if (request.body) request.body.body = { ...request.body.body, ID_USUARIOS: payload.user.ID_USUARIOS }
    else return payload.user
  } catch (error) {
    throw(MessageUtil.throwExcepction({ ...error }))
  }
}

export const BodyParser = (req) => {
  const form = formidable({});

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};