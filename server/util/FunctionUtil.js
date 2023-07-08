import fs from "fs";
import MessageUtil from "server/util/MessageUtil"
import formidable from "formidable";
import { EnvConstants } from "util/EnvConstants.js";
import { jwtVerify } from "jose";

const CodificarBase64 = (file) => {
  const bitmap = fs.readFileSync(file);
  return new Buffer(bitmap).toString('base64');
}

const ValidarAuth = async (request) => {
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

const BodyParser = (req) => {
  const form = formidable();

  return new Promise((resolve, reject) => {
    return form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      return resolve({ fields, files });
    });
  });
};

export { CodificarBase64, ValidarAuth, BodyParser }