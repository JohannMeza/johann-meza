import { SERVICES_POST, UPLOAD_POST } from "../services/services.axios";
import { AlertUtilMessage } from "../utils/AlertUtil";
import { EnvConstants } from "util/EnvConstants";
import { UploadFile } from "../utils/UploadFile";

/**
 * 
 * @param {object} config 
 * @returns Realiza peticion validando si el token es valido
 */

export const SaveRequestData = (props) => {
  let { queryId, body = {}, success, error, pagination, config } = props;

  if (pagination) {
    let params = {queryId, body, pagination}
    return SERVICES_POST(EnvConstants.REACT_APP_URL_BASE_BACK, params, config)
    .then(resp => {
      success(resp.data)
    })
    .catch((err) => {
      let { response } = err;
      let { status, message } = response.data
      error(response.data)
      AlertUtilMessage({ title: `Error ${status}`, text: message, type: "error" })
    })
  } else {
    let params = {queryId, body}
    return SERVICES_POST(EnvConstants.REACT_APP_URL_BASE_BACK, params, config)
    .then(resp => success({...resp.data}))
    .catch(err => {
      console.error(err)
      let { response } = err;
      let { status, message } = response.data
      if (status >= 500) AlertUtilMessage({ title: `Error ${status}`, text: message, type: "error" })
      error(response.data)
    })
  }
}

/**
 * 
 * @param {object} config 
 * @returns Realiza peticion sin validar el token o enviar una path en el config
 */

export const SendRequestData = (props) => { 
  let { queryId, body = {}, success, error, pagination, path, config } = props;
  if (!path) path = EnvConstants.REACT_APP_URL_BASE_FRONT;
  if (pagination) {
    let params = {queryId, body, pagination}
    return SERVICES_POST(path, params, config) 
    .then(resp => {
      success(resp.data)
    })
    .catch((err) => {
      let { response } = err;
      let { status, message } = response.data
      error(response.data)
      AlertUtilMessage({ title: `Error ${status}`, text: message, type: "error" })
    })
  } else {
    let params = {queryId, body}
    return SERVICES_POST(path, params, config)
    .then(resp => success({...resp.data}))
    .catch(err => {
      let { response } = err;
      let { status, message } = response.data
      if (status >= 500) AlertUtilMessage({ title: `Error ${status}`, text: message, type: "error" })
      error(response.data)
    })
  } 
}

/**
 * 
 * @param {object} config 
 * @returns Realiza una peticion y guarda un archivo en cloudinary
 */

export const FileRequestData = (config) => {
  let { queryId, body, success, error, pagination, path } = config;

  if (pagination) {
    let params = UploadFile({queryId, body, pagination})
    return UPLOAD_POST(path, params) 
    .then(resp => {
      success(resp.data)
    })
    .catch((err) => {
      let { response } = err;
      let { status, message } = response.data
      error(response.data)
      AlertUtilMessage({ title: `Error ${status}`, text: message, type: "error" })
    })
  } else {
    let params = UploadFile({queryId, ...body})
    return UPLOAD_POST(path, params)
    .then(resp => success({...resp.data}))
    .catch(err => {
      console.error(err)
      let { response } = err;
      let { status, message } = response.data
      if (status >= 500) AlertUtilMessage({ title: `Error ${status}`, text: message, type: "error" })
      error(response.data)
    })
  }
}

export const FormRequestData = (config) => {
  let { queryId, body, success, error, pagination } = config;

  if (pagination) {
    let params = UploadFile({queryId, body, pagination})
    return UPLOAD_POST(EnvConstants.REACT_APP_URL_BASE_FORMDATA, params) 
    .then(resp => {
      success(resp.data)
    })
    .catch((err) => {
      let { response } = err;
      let { status, message } = response.data
      error(response.data)
      AlertUtilMessage({ title: `Error ${status}`, text: message, type: "error" })
    })
  } else {
    let params = UploadFile({queryId, ...body})
    return UPLOAD_POST(EnvConstants.REACT_APP_URL_BASE_FORMDATA, params)
    .then(resp => success({...resp.data}))
    .catch(err => {
      console.error(err)
      let { response } = err;
      let { status, message } = response.data
      if (status >= 500) AlertUtilMessage({ title: `Error ${status}`, text: message, type: "error" })
      error(response.data)
    })
  }
}

export const ImageRequestData = (props) => { 
  let { queryId, body = {}, success, error, pagination, config } = props;
  if (pagination) {
    let params = {queryId, body, pagination }
    return SERVICES_POST(EnvConstants.REACT_APP_URL_BASE_IMAGE, params, config) 
    .then(resp => {
      success(resp.data)
    })
    .catch((err) => {
      let { response } = err;
      let { status, message } = response.data
      error(response.data)
      AlertUtilMessage({ title: `Error ${status}`, text: message, type: "error" })
    })
  } else {
    let params = {queryId, body}
    return SERVICES_POST(EnvConstants.REACT_APP_URL_BASE_IMAGE, params, config)
    .then(resp => success({...resp.data}))
    .catch(err => {
      console.error(err)
      let { response } = err;
      let { status, message } = response.data
      if (status >= 500) AlertUtilMessage({ title: `Error ${status}`, text: message, type: "error" })
      error(response.data)
    })
  } 
}

/**
 * 
 * @param {object} config 
 * @returns Login
 */

export const SignInRequestData = (config) => {
  let { queryId, body = {}, success, error, pagination } = config;

  if (pagination) {
    let params = {queryId, body, pagination }
    return SERVICES_POST(EnvConstants.REACT_APP_URL_AUTH_SIGN_IN, params) 
    .then(resp => {
      success(resp.data)
    })
    .catch((err) => {
      let { response } = err;
      let { status, message } = response.data
      error(response.data)
      AlertUtilMessage({ title: `Error ${status}`, text: message, type: "error" })
    })
  } else {
    let params = {queryId, body}
    return SERVICES_POST(EnvConstants.REACT_APP_URL_AUTH_SIGN_IN, params)
    .then(resp => success({...resp.data}))
    .catch(err => {
      let { response } = err;
      let { status, message } = response.data
      if (status >= 500) AlertUtilMessage({ title: `Error ${status}`, text: message, type: "error" })
      error(response.data)
    })
  }
}

/**
 * 
 * @param {object} config 
 * @returns Register
 */

export const SignUpRequestData = (config) => {
  let { queryId, body = {}, success, error, pagination } = config;

  if (pagination) {
    let params = {queryId, body, pagination}
    return SERVICES_POST(EnvConstants.REACT_APP_URL_AUTH_SIGN_UP, params) 
    .then(resp => {
      success(resp.data)
    })
    .catch((err) => {
      let { response } = err;
      let { status, message } = response.data
      error(response.data)
      AlertUtilMessage({ title: `Error ${status}`, text: message, type: "error" })
    })
  } else {
    let params = {queryId, body}
    return SERVICES_POST(EnvConstants.REACT_APP_URL_AUTH_SIGN_UP, params)
    .then(resp => success({...resp.data}))
    .catch(err => {
      let { response } = err;
      let { status, message } = response.data
      if (status >= 500) AlertUtilMessage({ title: `Error ${status}`, text: message, type: "error" })
      error(response.data)
    })
  }
}