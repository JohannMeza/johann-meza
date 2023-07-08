import { client } from "server/connection";
import typesErrors from "server/util/MessageUtil.js";

const requestFindQuery = async (queryId, connection) => {
  try {
    let data;
    if (!queryId) typesErrors.throwExcepction({ error: true, status: 401, message: "Id Query no provided" })

    data = await connection
    .query(`SELECT "SQL_QUERY", "SQL_TYPE" FROM "PUBLIC"."FW_SQL" WHERE "SQL_ID" = ${queryId}`)
    .then(result => result.rows[0])
    .catch(error => error.stack);
    
    if (!data) typesErrors.throwExcepction({ error: true, status: 401, message: "Id Query no existe" })
    return data
  } catch (error) {
    return error
  }
}

const REQUEST_DATABASE = async (params) => {
  const connection = client();
  await connection.connect()
  try {
    let { queryId, body, ID_USUARIOS } = params;
    let resultQuery = await requestFindQuery(queryId, connection);
    let { SQL_QUERY } = resultQuery
    let parameters = JSON.stringify({ ...body, ID_USUARIOS: ID_USUARIOS || body.ID_USUARIOS });
    
    if (resultQuery.error) throw(resultQuery)
    if (!SQL_QUERY) throw(typesErrors.throwExcepctionServer())
    const data = await connection.query(`SELECT "PUBLIC"."${SQL_QUERY}"(CAST('${parameters}' AS JSON))`).then(result => typeof result.rows[0][SQL_QUERY] === "string" ? JSON.parse(result.rows[0][SQL_QUERY]) : result.rows[0][SQL_QUERY]).catch(error => error.stack)
    const messageReturn = typesErrors.returnData(data)
    if (messageReturn.error) throw(messageReturn)
    return messageReturn
  } catch (error) {
    return typesErrors.throwExcepction(error)
  } finally {
    await connection.end();
  }
}

module.exports = { 
  REQUEST_DATABASE
}