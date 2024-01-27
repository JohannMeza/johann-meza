import { EnvConstants } from  "util/EnvConstants";
import { Client } from "pg";
export const client = () => {
  let { APP_DB_USER: user, APP_DB_HOST: host, APP_DB_DATABASE: database, APP_DB_PASS: password, APP_DB_PORT: port, APP_DEVELOPMENT } = EnvConstants
  console.log(EnvConstants);
  return APP_DEVELOPMENT 
  ? new Client({user, host, database, password, port}) 
  : new Client({ssl: true, user, host, database, password, port});
}

