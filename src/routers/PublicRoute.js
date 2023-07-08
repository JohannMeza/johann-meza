import React from 'react';
import { Route, Routes } from 'react-router-dom';


export default function PublicRoute (props) {
  return (
    <Routes>
      <Route {...props} />
    </Routes>
  )
}