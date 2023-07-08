import { EnvConstants } from "util/EnvConstants.js";
import axios from 'axios';

export const axiosBase = axios.create({
  baseURL: EnvConstants.REACT_APP_URL,
  headers: { 'Content-Type': 'application/json' },
}
)
export const axiosUpload = axios.create({
  baseURL: EnvConstants.REACT_APP_URL,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
})