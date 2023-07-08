import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LogoutPage from '../modules/auth/LogoutPage';
import SignInPage from '../modules/auth/SignInPage';
import DashboardRoutes from '../modules/dashboard/DashboardRoutes';
import MenuContextProvider from '../context/MenuContext';
import FrontRoutes from '../modules/front/FrontRoutes';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';


export default function IndexRoute () {  
  return (
    <Routes>
      <Route path={"*"} element={<PublicRoute path="*" element={<FrontRoutes />} />} />
      <Route path={"/dashboard/*"} element={<PrivateRoute path="*" element={<MenuContextProvider><DashboardRoutes /></MenuContextProvider>} />} />
      <Route path={"/login/*"} element={<PublicRoute path="/" element={<SignInPage />} />} />
      <Route path={"/logout/*"} element={<PrivateRoute path="/" element={<LogoutPage />} />} />
    </Routes>
  )
}