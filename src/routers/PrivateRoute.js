import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import useAuthContext from '../hooks/useAuthContext';

export default function PrivateRoute (props) {
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    !isAuthenticated && navigate("/home")
  }, [isAuthenticated, navigate])

  return (
    <Routes>
      <Route {...props} />
    </Routes>
  )
}