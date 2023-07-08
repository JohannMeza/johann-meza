/* eslint-disable no-throw-literal */
const throwExcepction = (config) => {
  let { error, message, status } = config;
  throw({ error, message, status, ...config })
}

const throwExcepctionServer = (detail = null) => { return { message: "Error en el servidor", status: 500, error: true, detail } }

const successMessageList = (data) => {
  let config = {
    error: false,
    status: 201,
    message: "Consulta Exitosa",
    dataList: data,
    dataObject: null
  };
  return config
}

const successMessageObject = (data) => {
  let config = {};
  let objResp = {...data};
  delete data.error; delete data.status; delete data.message; delete data.messageServer; delete data.dataList; delete data.dataObject

  if (objResp.error) config = {
    error: true, 
    status: objResp.status || 401, 
    message: objResp.message || objResp.error || "Error en el query", 
    dataList: null, 
    dataObject: null, 
    messageServer: objResp.messageServer 
  }
  else config = { 
    error: objResp.error || false, 
    status: objResp.status || 201, 
    message: objResp.message || "Consulta Exitosa", 
    dataList: objResp?.dataList || [], 
    dataObject: Object.entries(objResp?.dataObject || {}).length ? objResp.dataObject : objResp || null, 
    messageServer: objResp.messageServer 
  };
  return config;
}

const returnData = (data, sql_type) => {
  try {
    if (Object.prototype.toString.call(data) === '[object Array]') return successMessageList(data)
    else if (Object.prototype.toString.call(data) === '[object Object]') return successMessageObject(data)
    else return successMessageObject({
      error: true,
      status: 500,
      message: 'Error al retornar los datos',
      dataList: null,
      dataObject: null,
      messageServer: data
    })
  } catch (err) {
    return successMessageObject({})
  }
}

module.exports = {
  returnData,
  successMessageList,
  successMessageObject,
  throwExcepctionServer,
  throwExcepction,
}