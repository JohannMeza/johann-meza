import React, { createContext, useMemo, useState } from 'react';
import { useEffect } from 'react';
import { useAlert } from 'react-alert';
import { SendRequestData, SignInRequestData } from '../helpers/helpRequestBackend';
import { useRouter } from 'next/router';
import { EnvConstants } from "util/EnvConstants.js";
import useLoaderContext from '../hooks/useLoaderContext';
import PathConstants from 'util/PathConstants';

export const AuthContext = createContext()

export default function AuthContextProvider ({children}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState({});
  const {setLoader} = useLoaderContext()
  const {push} = useRouter()
  const alert = useAlert();

  const access = () => { 
    SendRequestData({
      path: EnvConstants.REACT_APP_URL_AUTH_ACCESS,
      queryId: 33,
      success: (resp) => {
        setLoader(false)
        setIsAuthenticated(true)
        setUser(resp.dataObject)
      }, 
      error: (err) => {
        setLoader(false)
      }
    })
  }

  const logout = async () => {
    SendRequestData({
      path: EnvConstants.REACT_APP_URL_AUTH_LOGOUT,
      success: (resp) => {
        push(PathConstants.auth_login)
      }, 
      error: (err) => {
        push(PathConstants.auth_login)
        setLoader(false)
        const { message, status } = err;
        (status < 500) && alert.error(message)
      }
    })
  }

  const login = (data) => {
    SignInRequestData({
      queryId: 33,
      body: { ...data },
      success: (resp) => {
        setIsAuthenticated(true)
        setUser(resp.dataObject)
        push(PathConstants.home_admin)
      }, 
      error: (err) => {
        push(PathConstants.auth_login)
        setLoader(false)
        const { message, status } = err;
        (status < 500) && alert.error(message)
      }
    })
 
  }

  const value = useMemo(() => ({
    login,
    logout,
    isAuthenticated,
    user,
    setUser,
    access
  }), [isAuthenticated, login, user])

  useEffect(() => access(), [])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}