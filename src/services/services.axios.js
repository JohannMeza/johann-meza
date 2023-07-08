import { axiosBase, axiosUpload } from "./axios";

export const SERVICES_GET = (path, body) => axiosBase.get(path, body)
export const SERVICES_POST = (path, body, config) => axiosBase.post(path, body, config)
export const UPLOAD_POST = (path, body) => axiosUpload.post(path, body)
export const SERVICES_PUT = (path, body) => axiosBase.put(path, body)
export const SERVICES_DELETE = (path, body) => axiosBase.delete(path, body)