import { ValidarEntorno } from "util/UtilsComponents.js";

const APP_DEVELOPMENT = ValidarEntorno(process.env.APP_ENV);

// Desarrollo
const APP_DEV_DB_HOST = process.env.APP_DEV_DB_HOST;
const APP_DEV_DB_DATABASE = process.env.APP_DEV_DB_DATABASE;
const APP_DEV_DB_USER = process.env.APP_DEV_DB_USER;
const APP_DEV_DB_PASS = process.env.APP_DEV_DB_PASS;
const APP_DEV_DB_PORT = process.env.APP_DEV_DB_PORT;
const APP_DEV_PORT = process.env.APP_DEV_PORT;
const APP_DEV_TOKEN_AUTH = process.env.APP_DEV_TOKEN_AUTH;
const APP_DEV_PATH_UPLOAD = process.env.APP_DEV_PATH_UPLOAD;
const APP_DEV_URL = process.env.APP_DEV_URL;

// Produccion
const APP_PROD_DB_HOST = process.env.APP_PROD_DB_HOST;
const APP_PROD_DB_DATABASE = process.env.APP_PROD_DB_DATABASE;
const APP_PROD_DB_USER = process.env.APP_PROD_DB_USER;
const APP_PROD_DB_PASS = process.env.APP_PROD_DB_PASS;
const APP_PROD_DB_PORT = process.env.APP_PROD_DB_PORT;
const APP_PROD_PORT = process.env.APP_PROD_PORT;
const APP_PROD_TOKEN_AUTH = process.env.APP_PROD_TOKEN_AUTH;
const APP_PROD_PATH_UPLOAD = process.env.APP_PROD_PATH_UPLOAD;
const APP_PROD_URL = process.env.APP_PROD_URL;

// Configuracion
export const EnvConstants = {
  APP_DEVELOPMENT                    : APP_DEVELOPMENT,
  APP_DB_HOST                        : APP_DEVELOPMENT  ?  APP_DEV_DB_HOST        :  APP_PROD_DB_HOST,
  APP_DB_DATABASE                    : APP_DEVELOPMENT  ?  APP_DEV_DB_DATABASE    :  APP_PROD_DB_DATABASE,
  APP_DB_USER                        : APP_DEVELOPMENT  ?  APP_DEV_DB_USER        :  APP_PROD_DB_USER,
  APP_DB_PASS                        : APP_DEVELOPMENT  ?  APP_DEV_DB_PASS        :  APP_PROD_DB_PASS,
  APP_DB_PORT                        : APP_DEVELOPMENT  ?  APP_DEV_DB_PORT        :  APP_PROD_DB_PORT,
  APP_PORT                           : APP_DEVELOPMENT  ?  APP_DEV_PORT           :  APP_PROD_PORT,
  APP_TOKEN_AUTH                     : APP_DEVELOPMENT  ?  APP_DEV_TOKEN_AUTH     :  APP_PROD_TOKEN_AUTH,
  APP_PATH_UPLOAD                    : APP_DEVELOPMENT  ?  APP_DEV_PATH_UPLOAD    :  APP_PROD_PATH_UPLOAD,
  APP_CLOUDINARY_NAME                : process.env.APP_CLOUDINARY_NAME,
  APP_CLOUDINARY_KEY                 : process.env.APP_CLOUDINARY_KEY,
  APP_CLOUDINARY_API_SECRET          : process.env.APP_CLOUDINARY_API_SECRET,
  
  REACT_APP_URL                      : APP_DEVELOPMENT  ?  APP_DEV_URL  :  APP_PROD_URL,
  REACT_APP_TOKEN                    : "TOKEN_AUTH",
  
  REACT_APP_URL_BASE_BACK            : "/api/options/back",
  REACT_APP_URL_BASE_FRONT           : "/api/options/front",
  
  REACT_APP_URL_UPLOAD_CLOUD         : "/api/upload/cloud",
  REACT_APP_URL_UPLOAD_LOCAL         : "/api/upload/local",

  REACT_APP_URL_CUSTOMIZE_PROFILE    : "/api/customize/profile",

  REACT_APP_URL_AUTH_SIGN_IN         : "/api/auth/signIn",
  REACT_APP_URL_AUTH_SIGN_UP         : "/api/auth/signUp",
  REACT_APP_URL_AUTH_LOGOUT          : "/api/auth/logout",
  REACT_APP_URL_AUTH_ACCESS          : "/api/auth/access",
}